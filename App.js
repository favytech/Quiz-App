let timerInterval;
const timeLimit = 30; // seconds per question
let timeLeft = timeLimit;

function startQuiz(category) {
    currentCategory = category;
    currentQuestions = questionsData[category];
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    document.getElementById('quiz-category').innerText = `${capitalize(category)} Quiz`;

    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);

    const questionData = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = questionData.question;
    document.getElementById('options-container').innerHTML = '';
    document.getElementById('current-question-number').innerText = currentQuestionIndex + 1;
    document.getElementById('total-questions').innerText = currentQuestions.length;

    updateProgressBar();
    startTimer();

    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.className = 'w-full text-left px-4 py-2 bg-gray-200 rounded hover:bg-gray-300';
        button.onclick = () => {
            clearInterval(timerInterval);
            selectAnswer(option);
        };
        document.getElementById('options-container').appendChild(button);
    });
}

function startTimer() {
    timeLeft = timeLimit;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoMoveToNext();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timer').innerText = timeLeft;
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function selectAnswer(selected) {
    const correctAnswer = currentQuestions[currentQuestionIndex].correct;
    if (selected === correctAnswer) score++;

    document.querySelectorAll('#options-container button').forEach(button => {
        button.disabled = true;
        if (button.innerText === correctAnswer) {
            button.classList.add('bg-green-400');
        } else if (button.innerText === selected) {
            button.classList.add('bg-red-400');
        }
    });
}

function autoMoveToNext() {
    selectAnswer(null);  // No answer selected, auto-move
    setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('results-page').classList.remove('hidden');

    const totalQuestions = currentQuestions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    const finalScoreText = `You scored ${percentage}%`;
    document.getElementById('final-score').innerText = finalScoreText;

    saveHighScore(currentCategory, percentage);  // Store percentage instead of raw score
}


function loadHighScores() {
    const highScores = JSON.parse(localStorage.getItem('quizHighScores')) || {};
    const highScoresList = document.getElementById('high-scores-list');
    highScoresList.innerHTML = '';

    for (const category in highScores) {
        const li = document.createElement('li');
        li.innerText = `${capitalize(category)}: ${highScores[category]}%`;
        highScoresList.appendChild(li);
    }
}

function goHome() {
    document.getElementById('results-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function saveHighScore(category, percentage) {
    const highScores = JSON.parse(localStorage.getItem('quizHighScores')) || {};
    if (!highScores[category] || percentage > highScores[category]) {
        highScores[category] = percentage;
        localStorage.setItem('quizHighScores', JSON.stringify(highScores));
    }
}


document.addEventListener('DOMContentLoaded', loadHighScores);
