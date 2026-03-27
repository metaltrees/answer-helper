// Social Intelligence Test - Situations Database
// 5 questions per category (15 total for MVP)

const situationsDatabase = {
    workplace: [
        {
            id: "work001",
            category: "workplace",
            situation: "You're in a team meeting and a colleague takes credit for an idea you shared with them privately last week. What do you do?",
            options: [
                "Say nothing and let it go this time.",
                "Interrupt immediately and claim it was your idea.",
                "Wait for an appropriate moment and politely mention you had shared this idea earlier."
            ],
            correctIndex: 2,
            traits: {
                assertiveness: [0, 2, 1],
                diplomacy: [1, 0, 2],
                conflictResolution: [0, 0, 2]
            }
        },
        {
            id: "work002",
            category: "workplace",
            situation: "Your manager assigns you a project with an unrealistic deadline when you're already overwhelmed. What's the best response?",
            options: [
                "Accept without question to show you're a team player.",
                "Decline immediately since it's impossible to complete.",
                "Schedule a meeting to discuss priorities and propose a realistic timeline."
            ],
            correctIndex: 2,
            traits: {
                assertiveness: [0, 2, 1],
                communication: [0, 1, 2],
                professionalBoundaries: [0, 1, 2]
            }
        },
        {
            id: "work003",
            category: "workplace",
            situation: "During a presentation, a client asks you a technical question you don't know the answer to. How do you respond?",
            options: [
                "Make your best guess to appear knowledgeable.",
                "Deflect by asking what they think the answer might be.",
                "Acknowledge you don't have that information but will find out and follow up promptly."
            ],
            correctIndex: 2,
            traits: {
                honesty: [0, 1, 2],
                professionalIntegrity: [0, 0, 2],
                communication: [0, 1, 2]
            }
        },
        {
            id: "work004",
            category: "workplace",
            situation: "You notice a coworker struggling with their tasks and falling behind. How should you approach this?",
            options: [
                "Mind your own business since helping might be seen as interference.",
                "Report their performance issues to your manager right away.",
                "Privately offer assistance and support in a non-condescending way."
            ],
            correctIndex: 2,
            traits: {
                empathy: [0, 0, 2],
                teamwork: [0, 0, 2],
                supportiveness: [0, 0, 2]
            }
        },
        {
            id: "work005",
            category: "workplace",
            situation: "You discover a respected senior colleague has been manipulating data in reports. What should you do?",
            options: [
                "Report it anonymously through the company's ethics hotline with evidence.",
                "Confront the colleague directly and demand they correct the reports.",
                "Subtly fix the data yourself going forward without mentioning the past."
            ],
            correctIndex: 0,
            traits: {
                ethicalJudgment: [2, 1, 0],
                courage: [2, 1, 0],
                professionalIntegrity: [2, 1, 0]
            }
        }
    ],
    social: [
        {
            id: "soc001",
            category: "social",
            situation: "A friend posts health misinformation on social media that could be harmful. What's the best approach?",
            options: [
                "Publicly comment with corrections and reliable sources.",
                "Send them a private message explaining the inaccuracy.",
                "Ignore it since it's not your responsibility to correct others."
            ],
            correctIndex: 1,
            traits: {
                diplomacy: [0, 2, 0],
                socialAwareness: [0, 2, 0],
                empathy: [0, 2, 0]
            }
        },
        {
            id: "soc002",
            category: "social",
            situation: "As a dinner party host, a guest makes an offensive joke that creates uncomfortable silence. How do you handle it?",
            options: [
                "Laugh it off to ease tension and continue with dinner.",
                "Calmly state that such jokes aren't welcome and redirect conversation.",
                "Take the person aside later to explain why it was inappropriate."
            ],
            correctIndex: 1,
            traits: {
                assertiveness: [0, 2, 1],
                leadership: [0, 2, 1],
                conflictResolution: [0, 2, 1]
            }
        },
        {
            id: "soc003",
            category: "social",
            situation: "You've been invited to an expensive group activity that you cannot afford right now. How should you handle it?",
            options: [
                "Go anyway and put it on your credit card to avoid embarrassment.",
                "Make up an excuse about being busy that day.",
                "Be honest about budget constraints and suggest an alternative activity."
            ],
            correctIndex: 2,
            traits: {
                honesty: [0, 0, 2],
                selfAwareness: [0, 0, 2],
                professionalBoundaries: [0, 0, 2]
            }
        },
        {
            id: "soc004",
            category: "social",
            situation: "A friend constantly arrives 20-30 minutes late whenever you make plans. How should you address this?",
            options: [
                "Start telling them to arrive earlier than the actual meeting time.",
                "End the friendship since they clearly don't respect your time.",
                "Have a direct conversation about how their lateness affects you."
            ],
            correctIndex: 2,
            traits: {
                communication: [0, 0, 2],
                assertiveness: [1, 1, 2],
                conflictResolution: [0, 0, 2]
            }
        },
        {
            id: "soc005",
            category: "social",
            situation: "Your close friend confides they're having an affair. You're also good friends with their spouse. What's the most ethical response?",
            options: [
                "Tell the spouse immediately as they deserve to know the truth.",
                "Encourage your friend to come clean, making clear you won't keep this secret indefinitely.",
                "Keep your friend's confidence as it's not your place to interfere."
            ],
            correctIndex: 1,
            traits: {
                ethicalJudgment: [1, 2, 0],
                diplomacy: [0, 2, 1],
                courage: [1, 2, 0]
            }
        }
    ],
    family: [
        {
            id: "fam001",
            category: "family",
            situation: "You're invited to a family dinner, but you have dietary restrictions not mentioned in the invitation. What should you do?",
            options: [
                "Don't mention it and just eat what you can at the dinner.",
                "Decline the invitation to avoid any awkwardness.",
                "Contact the host beforehand to politely inform them of your dietary needs."
            ],
            correctIndex: 2,
            traits: {
                communication: [0, 0, 2],
                selfAdvocacy: [0, 0, 2],
                socialAwareness: [0, 0, 2]
            }
        },
        {
            id: "fam002",
            category: "family",
            situation: "Your parent frequently criticizes your career choices during family gatherings. How should you handle this?",
            options: [
                "Avoid the topic completely by changing the subject whenever it comes up.",
                "Have a private conversation expressing how their comments make you feel and set boundaries.",
                "Debate them with facts and figures about your career success."
            ],
            correctIndex: 1,
            traits: {
                assertiveness: [0, 2, 1],
                professionalBoundaries: [0, 2, 0],
                communication: [0, 2, 1]
            }
        },
        {
            id: "fam003",
            category: "family",
            situation: "Your sibling frequently borrows money but rarely pays it back. They're asking for another loan for an 'urgent' situation. What's the best approach?",
            options: [
                "Refuse outright based on their past behavior.",
                "Give them the money without expecting repayment, treating it as a gift.",
                "Offer assistance in non-monetary ways, like helping them budget or find resources."
            ],
            correctIndex: 2,
            traits: {
                professionalBoundaries: [1, 0, 2],
                empathy: [0, 1, 2],
                problemSolving: [0, 0, 2]
            }
        },
        {
            id: "fam004",
            category: "family",
            situation: "You discover your teenage child has been dishonest about their whereabouts and find concerning messages on their phone. How do you approach this?",
            options: [
                "Confront them immediately with the evidence and implement strict monitoring.",
                "Say nothing but secretly increase monitoring of their activities.",
                "Express concern about the dishonesty and have an open conversation about safety and trust."
            ],
            correctIndex: 2,
            traits: {
                communication: [1, 0, 2],
                empathy: [0, 0, 2],
                leadership: [1, 0, 2]
            }
        },
        {
            id: "fam005",
            category: "family",
            situation: "Your aging parent needs more care than you can provide alone, but they strongly resist assisted living or in-home help. How should you proceed?",
            options: [
                "Make the decision for them and arrange the move for their own safety.",
                "Respect their wishes completely even if it puts their health at risk.",
                "Arrange a family meeting with healthcare professionals to discuss options and address concerns."
            ],
            correctIndex: 2,
            traits: {
                empathy: [0, 1, 2],
                communication: [0, 0, 2],
                problemSolving: [1, 0, 2]
            }
        }
    ]
};

// Combine all situations for random category
situationsDatabase.random = [
    ...situationsDatabase.workplace,
    ...situationsDatabase.social,
    ...situationsDatabase.family
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = situationsDatabase;
}
