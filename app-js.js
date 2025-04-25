// DOM Elements
const chatHistory = document.getElementById('chatHistory');
const situationText = document.getElementById('situationText');
const optionsContainer = document.getElementById('optionsContainer');
const feedbackEl = document.getElementById('feedback');
const generateBtn = document.getElementById('generateBtn');
const submitBtn = document.getElementById('submitBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const difficultySelect = document.getElementById('difficulty');
const categorySelect = document.getElementById('category');

// Application state
let currentSituation = null;
let selectedOptionIndex = null;
let usedSituations = [];

// Generate new situation
generateBtn.addEventListener('click', async () => {
    try {
        setLoading(true);
        
        // Add any existing situation to history
        if (currentSituation) {
            addToHistory(currentSituation);
        }
        
        // Reset the UI state
        selectedOptionIndex = null;
        optionsContainer.innerHTML = '';
        feedbackEl.style.display = 'none';
        submitBtn.style.display = 'none';
        
        // Get selected difficulty and category
        const difficulty = difficultySelect.value;
        const category = categorySelect.value;
        
        // Generate new situation
        currentSituation = generateSituation(difficulty, category);
        
        // Display the new situation
        displaySituation(currentSituation);
        
        submitBtn.style.display = 'inline-block';
    } catch (error) {
        console.error('Error generating situation:', error);
        situationText.textContent = 'Error generating situation. Please try again.';
    } finally {
        setLoading(false);
    }
});

// Submit answer
submitBtn.addEventListener('click', async () => {
    if (selectedOptionIndex === null) {
        alert('Please select an answer before submitting.');
        return;
    }

    try {
        setLoading(true);
        
        // Evaluate the answer
        const result = evaluateAnswer(currentSituation, selectedOptionIndex);
        
        // Update the UI with the result
        displayResult(result);
        
        // Disable the submit button after submission
        submitBtn.disabled = true;
    } catch (error) {
        console.error('Error evaluating answer:', error);
        feedbackEl.textContent = 'Error evaluating your answer. Please try again.';
        feedbackEl.style.display = 'block';
    } finally {
        setLoading(false);
    }
});

// Helper function to set loading state
function setLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'flex' : 'none';
    generateBtn.disabled = isLoading;
    submitBtn.disabled = isLoading;
}

// Generate a new situation from our database
function generateSituation(difficulty, category) {
    // Filter situations by difficulty and category
    const availableSituations = situationsDatabase[category].filter(s => s.difficulty === difficulty);
    
    // If no situations match or all have been used, reset used situations
    if (availableSituations.length === 0 || availableSituations.every(s => usedSituations.includes(s))) {
        usedSituations = [];
    }
    
    // Filter out situations that have been used already
    const unusedSituations = availableSituations.filter(s => !usedSituations.includes(s));
    
    // If all situations have been used, reset used situations
    const situationsToChooseFrom = unusedSituations.length > 0 ? unusedSituations : availableSituations;
    
    // Randomly select a situation
    const randomIndex = Math.floor(Math.random() * situationsToChooseFrom.length);
    const selectedSituation = situationsToChooseFrom[randomIndex];
    
    // Add to used situations
    usedSituations.push(selectedSituation);
    
    return selectedSituation;
}

// Evaluate the user's answer - simplified version
function evaluateAnswer(situation, selectedIndex) {
    return {
        isCorrect: selectedIndex === situation.correctIndex,
        explanation: situation.explanation
    };
}

// Display the situation in the UI
function displaySituation(situation) {
    situationText.textContent = situation.situation;
    
    optionsContainer.innerHTML = '';
    situation.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.textContent = option;
        optionEl.dataset.index = index;
        
        optionEl.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            optionEl.classList.add('selected');
            selectedOptionIndex = index;
        });
        
        optionsContainer.appendChild(optionEl);
    });
}

// Display the evaluation result
function displayResult(result) {
    const options = document.querySelectorAll('.option');
    
    // Mark the correct answer
    options[currentSituation.correctIndex].classList.add('correct');
    
    // If the selected option is not correct, mark it as wrong
    if (selectedOptionIndex !== currentSituation.correctIndex) {
        options[selectedOptionIndex].classList.add('wrong');
    }
    
    // Display the explanation
    feedbackEl.textContent = result.explanation;
    feedbackEl.style.display = 'block';
}

// Add a situation to the history
function addToHistory(situation) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item situation-container';
    
    const situationHeader = document.createElement('div');
    situationHeader.className = 'situation-header';
    situationHeader.textContent = 'Previous Situation';
    
    const situationTextEl = document.createElement('div');
    situationTextEl.className = 'situation-text';
    situationTextEl.textContent = situation.situation;
    
    const optionsContainerEl = document.createElement('div');
    optionsContainerEl.className = 'options-container';
    
    situation.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        
        // Add the correct/wrong class if this situation had a submitted answer
        if (selectedOptionIndex !== null) {
            if (index === situation.correctIndex) {
                optionEl.classList.add('correct');
            } else if (index === selectedOptionIndex && selectedOptionIndex !== situation.correctIndex) {
                optionEl.classList.add('wrong');
            }
        }
        
        optionEl.textContent = option;
        optionsContainerEl.appendChild(optionEl);
    });
    
    historyItem.appendChild(situationHeader);
    historyItem.appendChild(situationTextEl);
    historyItem.appendChild(optionsContainerEl);
    
    // Add explanation if it was revealed
    if (feedbackEl.style.display !== 'none') {
        const feedbackCopy = document.createElement('div');
        feedbackCopy.className = 'feedback';
        feedbackCopy.textContent = situation.explanation;
        feedbackCopy.style.display = 'block';
        historyItem.appendChild(feedbackCopy);
    }
    
    // Insert at the beginning of the history
    chatHistory.insertBefore(historyItem, chatHistory.firstChild);
}