// Social Intelligence Test - Main Application
// Psychological test style: 10 questions, then AI-generated advice

// ============================================
// Configuration
// ============================================
const CONFIG = {
    TOTAL_QUESTIONS: 10,
    API_ENDPOINT: 'YOUR_API_GATEWAY_ENDPOINT_HERE', // Replace after deploying Lambda
    USE_MOCK_API: true // Set to false when backend is ready
};

// ============================================
// Application State
// ============================================
let state = {
    currentQuestion: 0,
    answers: [],
    currentSituation: null,
    selectedOption: null,
    category: 'random',
    usedQuestionIds: [],
    isComplete: false,
    isLoading: false,
    aiAdvice: null
};

// ============================================
// DOM Elements
// ============================================
const elements = {
    // Screens
    startScreen: document.getElementById('startScreen'),
    testScreen: document.getElementById('testScreen'),
    loadingScreen: document.getElementById('loadingScreen'),
    resultsScreen: document.getElementById('resultsScreen'),
    
    // Start screen
    categorySelect: document.getElementById('categorySelect'),
    startBtn: document.getElementById('startBtn'),
    
    // Test screen
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    categoryBadge: document.getElementById('categoryBadge'),
    situationText: document.getElementById('situationText'),
    optionsContainer: document.getElementById('optionsContainer'),
    nextBtn: document.getElementById('nextBtn'),
    
    // Results screen
    scoreDisplay: document.getElementById('scoreDisplay'),
    aiAdviceContent: document.getElementById('aiAdviceContent'),
    retryBtn: document.getElementById('retryBtn')
};

// ============================================
// Utility Functions
// ============================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showScreen(screenName) {
    // Hide all screens
    elements.startScreen.classList.add('hidden');
    elements.testScreen.classList.add('hidden');
    elements.loadingScreen.classList.add('hidden');
    elements.resultsScreen.classList.add('hidden');
    
    // Show requested screen
    switch(screenName) {
        case 'start':
            elements.startScreen.classList.remove('hidden');
            break;
        case 'test':
            elements.testScreen.classList.remove('hidden');
            break;
        case 'loading':
            elements.loadingScreen.classList.remove('hidden');
            break;
        case 'results':
            elements.resultsScreen.classList.remove('hidden');
            break;
    }
}

function getCategoryDisplayName(category) {
    const names = {
        'workplace': 'Workplace',
        'social': 'Social',
        'family': 'Family',
        'random': 'Mixed'
    };
    return names[category] || category;
}

// ============================================
// Game Logic
// ============================================
function getAvailableSituations() {
    let situations;
    
    if (state.category === 'random') {
        situations = [...situationsDatabase.random];
    } else {
        situations = [...situationsDatabase[state.category]];
    }
    
    // Filter out already used questions
    return situations.filter(s => !state.usedQuestionIds.includes(s.id));
}

function selectNextSituation() {
    const available = getAvailableSituations();
    
    if (available.length === 0) {
        // Reset if we've used all questions (shouldn't happen with 15 questions and 10 needed)
        state.usedQuestionIds = [];
        return selectNextSituation();
    }
    
    // Random selection
    const randomIndex = Math.floor(Math.random() * available.length);
    const situation = available[randomIndex];
    
    state.usedQuestionIds.push(situation.id);
    return situation;
}

function updateProgressBar() {
    const progress = (state.currentQuestion / CONFIG.TOTAL_QUESTIONS) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.progressText.textContent = `Question ${state.currentQuestion + 1} of ${CONFIG.TOTAL_QUESTIONS}`;
}

function displaySituation() {
    state.currentSituation = selectNextSituation();
    state.selectedOption = null;
    
    // Update category badge
    const situationCategory = state.currentSituation.category || state.category;
    elements.categoryBadge.textContent = getCategoryDisplayName(situationCategory);
    
    // Update situation text
    elements.situationText.textContent = state.currentSituation.situation;
    
    // Create options
    elements.optionsContainer.innerHTML = '';
    state.currentSituation.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        optionEl.addEventListener('click', () => selectOption(index, optionEl));
        elements.optionsContainer.appendChild(optionEl);
    });
    
    // Disable next button until an option is selected
    elements.nextBtn.disabled = true;
    updateProgressBar();
}

function selectOption(index, optionElement) {
    // Remove selection from all options
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select clicked option
    optionElement.classList.add('selected');
    state.selectedOption = index;
    
    // Enable next button
    elements.nextBtn.disabled = false;
}

function recordAnswer() {
    if (state.selectedOption === null) return;
    
    const answer = {
        questionId: state.currentSituation.id,
        category: state.currentSituation.category,
        situation: state.currentSituation.situation,
        options: state.currentSituation.options,
        selectedIndex: state.selectedOption,
        correctIndex: state.currentSituation.correctIndex,
        isCorrect: state.selectedOption === state.currentSituation.correctIndex,
        traits: state.currentSituation.traits
    };
    
    state.answers.push(answer);
}

function nextQuestion() {
    recordAnswer();
    state.currentQuestion++;
    
    if (state.currentQuestion >= CONFIG.TOTAL_QUESTIONS) {
        // Test complete - get AI analysis
        completeTest();
    } else {
        displaySituation();
    }
}

// ============================================
// API Integration
// ============================================
async function getAIAdvice() {
    if (CONFIG.USE_MOCK_API) {
        // Mock response for development
        return await getMockAdvice();
    }
    
    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: state.answers })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return data.advice;
    } catch (error) {
        console.error('Error getting AI advice:', error);
        return getFallbackAdvice();
    }
}

async function getMockAdvice() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    const categoryBreakdown = analyzeByCategory();
    
    return `
## Your Social Intelligence Profile

Based on your responses to ${CONFIG.TOTAL_QUESTIONS} scenarios, here's your personalized analysis:

### Overall Score: ${correctCount}/${CONFIG.TOTAL_QUESTIONS} (${Math.round(correctCount/CONFIG.TOTAL_QUESTIONS * 100)}%)

### Strengths 💪
${getStrengthsText(categoryBreakdown)}

### Areas for Growth 🌱
${getGrowthAreasText(categoryBreakdown)}

### Key Insight 💡
${getKeyInsight(categoryBreakdown)}

### Actionable Tip 🎯
${getActionableTip(categoryBreakdown)}

---
*This analysis is generated based on established social intelligence research. Consider retaking the test with different categories to explore other aspects of your interpersonal skills.*
    `.trim();
}

function analyzeByCategory() {
    const categories = { workplace: [], social: [], family: [] };
    
    state.answers.forEach(answer => {
        if (categories[answer.category]) {
            categories[answer.category].push(answer);
        }
    });
    
    const breakdown = {};
    for (const [cat, answers] of Object.entries(categories)) {
        if (answers.length > 0) {
            const correct = answers.filter(a => a.isCorrect).length;
            breakdown[cat] = {
                total: answers.length,
                correct: correct,
                percentage: Math.round((correct / answers.length) * 100)
            };
        }
    }
    
    return breakdown;
}

function getStrengthsText(breakdown) {
    const strengths = [];
    
    for (const [cat, data] of Object.entries(breakdown)) {
        if (data.percentage >= 70) {
            strengths.push(`- **${getCategoryDisplayName(cat)} situations**: You showed strong judgment in ${data.correct}/${data.total} scenarios. You understand how to navigate these contexts effectively.`);
        }
    }
    
    if (strengths.length === 0) {
        const bestCat = Object.entries(breakdown).sort((a, b) => b[1].percentage - a[1].percentage)[0];
        if (bestCat) {
            strengths.push(`- **${getCategoryDisplayName(bestCat[0])} situations**: This is your strongest area with ${bestCat[1].percentage}% optimal responses.`);
        }
    }
    
    return strengths.join('\n') || '- You showed thoughtfulness in considering different perspectives across scenarios.';
}

function getGrowthAreasText(breakdown) {
    const areas = [];
    
    for (const [cat, data] of Object.entries(breakdown)) {
        if (data.percentage < 50) {
            areas.push(`- **${getCategoryDisplayName(cat)} situations**: Consider practicing more assertive yet diplomatic approaches. You scored ${data.correct}/${data.total} in this area.`);
        }
    }
    
    if (areas.length === 0) {
        return '- Continue developing your awareness of how timing and context affect the best response to social situations.';
    }
    
    return areas.join('\n');
}

function getKeyInsight(breakdown) {
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    
    if (correctCount >= 8) {
        return 'You demonstrate strong social intelligence across multiple contexts. Your responses show a good balance of assertiveness and empathy.';
    } else if (correctCount >= 5) {
        return 'You have a solid foundation in social intelligence. Focus on situations where direct communication might feel uncomfortable—these often have the best outcomes.';
    } else {
        return 'Social intelligence is a skill that develops with practice. Many of your responses leaned toward either avoidance or confrontation—finding the middle ground of "diplomatic directness" is key.';
    }
}

function getActionableTip(breakdown) {
    const tips = [
        'This week, practice one direct conversation you\'ve been avoiding. Frame it with "I" statements and focus on specific behaviors rather than character judgments.',
        'Before responding to a challenging situation, pause and consider: "What outcome do I actually want here?" This helps align your response with your goals.',
        'Try the "private first" approach: Address issues one-on-one before they become public conflicts. This preserves relationships while still addressing problems.'
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
}

function getFallbackAdvice() {
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    return `
## Test Complete!

You answered ${correctCount} out of ${CONFIG.TOTAL_QUESTIONS} questions optimally.

We couldn't connect to the AI analysis service at this time. Please try again later for personalized insights, or review your answers to reflect on the scenarios where you might approach things differently.
    `.trim();
}

// ============================================
// Test Flow
// ============================================
function startTest() {
    // Reset state
    state = {
        currentQuestion: 0,
        answers: [],
        currentSituation: null,
        selectedOption: null,
        category: elements.categorySelect.value,
        usedQuestionIds: [],
        isComplete: false,
        isLoading: false,
        aiAdvice: null
    };
    
    showScreen('test');
    displaySituation();
}

async function completeTest() {
    state.isComplete = true;
    showScreen('loading');
    
    // Get AI advice
    state.aiAdvice = await getAIAdvice();
    
    // Display results
    displayResults();
}

function displayResults() {
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    
    // Update score display
    elements.scoreDisplay.textContent = `${correctCount}/${CONFIG.TOTAL_QUESTIONS}`;
    
    // Render AI advice as HTML (simple markdown parsing)
    elements.aiAdviceContent.innerHTML = parseMarkdown(state.aiAdvice);
    
    showScreen('results');
}

function parseMarkdown(text) {
    return text
        .replace(/## (.*)/g, '<h2>$1</h2>')
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/---/g, '<hr>');
}

function retryTest() {
    showScreen('start');
}

// ============================================
// Event Listeners
// ============================================
elements.startBtn.addEventListener('click', startTest);
elements.nextBtn.addEventListener('click', nextQuestion);
elements.retryBtn.addEventListener('click', retryTest);

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    showScreen('start');
});
