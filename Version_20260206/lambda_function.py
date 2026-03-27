"""
Social Intelligence Test - AWS Lambda Function
Analyzes user responses and generates personalized advice using Amazon Bedrock

Deploy this to AWS Lambda with:
- Runtime: Python 3.11+
- Handler: lambda_function.lambda_handler
- Timeout: 30 seconds
- Memory: 256 MB
- IAM Role: Must have bedrock:InvokeModel permission
"""

import json
import boto3
import os
import logging
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize Bedrock client
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)

# Model configuration - Using Claude on Bedrock
MODEL_ID = os.environ.get('MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0')


def lambda_handler(event, context):
    """
    Main Lambda handler.
    Receives user's 10 answers and returns AI-generated advice.
    """
    try:
        # Handle CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return cors_response(200, {})
        
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        answers = body.get('answers', [])
        
        # Validate input
        if not answers or len(answers) < 1:
            return cors_response(400, {'error': 'No answers provided'})
        
        logger.info(f"Received {len(answers)} answers for analysis")
        
        # Build analysis prompt
        prompt = build_analysis_prompt(answers)
        
        # Get AI-generated advice
        advice = invoke_bedrock(prompt)
        
        # Return success response
        return cors_response(200, {
            'advice': advice,
            'questionsAnalyzed': len(answers)
        })
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}")
        return cors_response(400, {'error': 'Invalid JSON in request body'})
    except ClientError as e:
        logger.error(f"Bedrock API error: {e}")
        return cors_response(500, {'error': 'AI service temporarily unavailable'})
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return cors_response(500, {'error': 'Internal server error'})


def build_analysis_prompt(answers):
    """
    Constructs a detailed prompt for Bedrock to analyze user responses.
    """
    # Calculate statistics
    total = len(answers)
    correct = sum(1 for a in answers if a.get('isCorrect', False))
    
    # Group by category
    categories = {}
    for answer in answers:
        cat = answer.get('category', 'unknown')
        if cat not in categories:
            categories[cat] = {'total': 0, 'correct': 0}
        categories[cat]['total'] += 1
        if answer.get('isCorrect', False):
            categories[cat]['correct'] += 1
    
    # Build detailed answer summary
    answer_details = []
    for i, a in enumerate(answers, 1):
        status = "✓ Optimal" if a.get('isCorrect') else "✗ Suboptimal"
        chosen_option = a.get('options', [])[a.get('selectedIndex', 0)] if a.get('options') else "Unknown"
        correct_option = a.get('options', [])[a.get('correctIndex', 0)] if a.get('options') else "Unknown"
        
        detail = f"""
Scenario {i} ({a.get('category', 'unknown').title()}):
- Situation: {a.get('situation', 'N/A')[:100]}...
- User chose: "{chosen_option[:80]}..."
- Optimal choice: "{correct_option[:80]}..."
- Result: {status}
"""
        answer_details.append(detail)
    
    # Category breakdown
    cat_summary = "\n".join([
        f"- {cat.title()}: {data['correct']}/{data['total']} optimal"
        for cat, data in categories.items()
    ])
    
    prompt = f"""You are a social intelligence expert and psychologist. Analyze this person's responses to {total} social scenarios and provide personalized, actionable feedback.

## Test Results Summary
Overall Score: {correct}/{total} ({round(correct/total*100)}% optimal responses)

Category Breakdown:
{cat_summary}

## Detailed Responses
{"".join(answer_details)}

## Your Task
Based on these responses, write a personalized analysis in the following format:

### Your Social Intelligence Profile

Start with 2-3 sentences summarizing their overall performance and approach to social situations.

### Strengths 💪
List 2-3 specific strengths you observed in their responses. Reference specific scenarios where they showed good judgment.

### Areas for Growth 🌱
List 2-3 areas where they could improve. Be specific but encouraging. Reference patterns you noticed.

### Key Insight 💡
One paragraph with the most important insight about their social intelligence style.

### Your Action Plan 🎯
Give 2-3 specific, actionable tips they can implement this week to improve.

Keep your response encouraging, specific, and actionable. Use markdown formatting. Total response should be 300-400 words."""

    return prompt


def invoke_bedrock(prompt):
    """
    Calls Amazon Bedrock with the analysis prompt.
    """
    try:
        # Anthropic Claude format
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "temperature": 0.7,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        
        # Extract text from Claude response
        if 'content' in response_body and len(response_body['content']) > 0:
            return response_body['content'][0]['text']
        
        return "Analysis could not be generated. Please try again."
        
    except ClientError as e:
        logger.error(f"Bedrock invocation failed: {e}")
        raise


def cors_response(status_code, body):
    """
    Returns a response with CORS headers for GitHub Pages.
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # Or specify your GitHub Pages domain
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps(body)
    }


# For local testing
if __name__ == "__main__":
    # Mock test data
    test_event = {
        'httpMethod': 'POST',
        'body': json.dumps({
            'answers': [
                {
                    'category': 'workplace',
                    'situation': 'Your colleague takes credit for your idea in a meeting.',
                    'options': ['Say nothing', 'Interrupt immediately', 'Wait and mention politely'],
                    'selectedIndex': 2,
                    'correctIndex': 2,
                    'isCorrect': True
                },
                {
                    'category': 'social',
                    'situation': 'A friend posts health misinformation.',
                    'options': ['Public comment', 'Private message', 'Ignore it'],
                    'selectedIndex': 0,
                    'correctIndex': 1,
                    'isCorrect': False
                }
            ]
        })
    }
    
    # This won't work without AWS credentials, but shows the structure
    print("Test event structure:", json.dumps(test_event, indent=2))
