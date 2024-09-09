document.addEventListener('DOMContentLoaded', function () {
    const mainMenu = document.getElementById('main-menu');
    const subcategoryMenu = document.getElementById('subcategory-menu');
    const gameSection = document.getElementById('game-section');
    const resultSection = document.getElementById('result-section');
    const categoryTitle = document.getElementById('category-title');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const feedback = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const replayButton = document.getElementById('replay-button');

    let currentCategory = '';
    let currentSubcategory = '';
    let questions = [];
    let currentIndex = 0;
    let score = 0;

    // Función para cargar la base de datos de preguntas
    async function loadQuestions(category) {
        try {
            const response = await fetch(`${category}.json`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al cargar la base de datos:', error);
        }
    }

    function startGame(category) {
        currentCategory = category;
        mainMenu.style.display = 'none';
        subcategoryMenu.style.display = 'block';
    }

    async function startSubcategory(subcategory) {
        currentSubcategory = subcategory;
        const data = await loadQuestions(currentCategory);
        questions = data[currentSubcategory].sort(() => Math.random() - 0.5).slice(0, 10);
        currentIndex = 0;
        score = 0;
        categoryTitle.textContent = `${currentCategory} - ${currentSubcategory}`;
        subcategoryMenu.style.display = 'none';
        gameSection.style.display = 'block';
        loadNextQuestion();
    }

    function loadNextQuestion() {
        if (currentIndex < questions.length) {
            questionText.textContent = questions[currentIndex].question;
        } else {
            endGame();
        }
    }

    function checkAnswer() {
        const correctAnswer = questions[currentIndex].answer.toLowerCase();
        const userAnswer = answerInput.value.trim().toLowerCase();

        if (userAnswer === correctAnswer) {
            feedback.textContent = '¡Correcto!';
            score++;
        } else {
            feedback.textContent = `Incorrecto. La respuesta correcta es: ${questions[currentIndex].answer}`;
        }

        scoreElement.textContent = `Puntuación: ${score}`;
        currentIndex++;
        answerInput.value = '';
        loadNextQuestion();
    }

    function endGame() {
        gameSection.style.display = 'none';
        resultSection.style.display = 'block';
        finalScoreElement.textContent = `Tu puntuación final es: ${score} de ${questions.length}`;
    }

    document.getElementById('btnPanama').addEventListener('click', () => startGame('panama'));
    document.getElementById('btnComunidades').addEventListener('click', () => startGame('comunidades'));
    document.getElementById('btnLiteratura').addEventListener('click', () => startGame('literatura'));
    document.getElementById('btnLinguistica').addEventListener('click', () => startGame('linguistica'));
    document.getElementById('btnCatalan').addEventListener('click', () => startGame('catalan'));

    document.getElementById('btnFechas').addEventListener('click', () => startSubcategory('fechas'));
    document.getElementById('btnCulturaG').addEventListener('click', () => startSubcategory('culturaG'));
    document.getElementById('btnPersonajes').addEventListener('click', () => startSubcategory('personajes'));
    document.getElementById('btnCitas').addEventListener('click', () => startSubcategory('citas'));
    document.getElementById('btnVocabulario').addEventListener('click', () => startSubcategory('vocabulario'));

    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
    replayButton.addEventListener('click', () => {
        resultSection.style.display = 'none';
        mainMenu.style.display = 'block';
    });
});
