// Quiz functionality
let currentQuestion = 0;
let userAnswers = {};
let timeLeft = 600; // 10 minutes in seconds
let timerInterval;

document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    startTimer();
    updateProgress();
    displayQuestion();
    
    // Event listeners
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
});

function initializeQuiz() {
    document.getElementById('total-questions').textContent = quizData.questions.length;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function displayQuestion() {
    const question = quizData.questions[currentQuestion];
    const container = document.getElementById('question-container');
    
    container.innerHTML = `
        <div class="question-text">${question.question}</div>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <div class="option ${userAnswers[question.id] === index ? 'selected' : ''}" 
                     onclick="selectOption(${question.id}, ${index})">
                    <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="option-text">${option}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Update question counter
    document.getElementById('current-question').textContent = currentQuestion + 1;
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    
    if (currentQuestion === quizData.questions.length - 1) {
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'flex';
    } else {
        document.getElementById('next-btn').style.display = 'flex';
        document.getElementById('submit-btn').style.display = 'none';
    }
}

function selectOption(questionId, optionIndex) {
    userAnswers[questionId] = optionIndex;
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function nextQuestion() {
    if (currentQuestion < quizData.questions.length - 1) {
        currentQuestion++;
        displayQuestion();
        updateProgress();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        updateProgress();
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function submitQuiz() {
    clearInterval(timerInterval);
    
    // Show loading
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Submit to server
    fetch('/submit_quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subject: subject,
            lesson: lesson,
            page_range: pageRange,
            answers: userAnswers
        })
    })
    .then(response => response.json())
    .then(data => {
        showResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the quiz. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function showResults(data) {
    const modal = document.getElementById('results-modal');
    const percentage = Math.round((data.score / data.total) * 100);
    
    // Update score display
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    document.getElementById('score-text').textContent = `${data.score} out of ${data.total}`;
    
    // Update results details
    const detailsContainer = document.getElementById('results-details');
    detailsContainer.innerHTML = data.results.map((result, index) => `
        <div class="result-item ${result.is_correct ? 'correct' : 'incorrect'}">
            <div class="result-question">
                <strong>Question ${index + 1}:</strong> ${result.question}
            </div>
            <div class="result-answer">
                <strong>Your answer:</strong> ${result.user_answer !== undefined ? result.options[result.user_answer] : 'Not answered'}<br>
                <strong>Correct answer:</strong> ${result.options[result.correct_answer]}
            </div>
        </div>
    `).join('');
    
    modal.style.display = 'flex';
}
