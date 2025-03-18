document.addEventListener("DOMContentLoaded", () => {
    const pageMinInput = document.getElementById("pageMin");
    const pageMaxInput = document.getElementById("pageMax");
    const pageMinValue = document.getElementById("pageMinValue");
    const pageMaxValue = document.getElementById("pageMaxValue");
    const wordDisplay = document.getElementById("word");
    const answerInput = document.getElementById("answer");
    const checkButton = document.getElementById("check");
    const continueButton = document.getElementById("continue");
    const resultDisplay = document.getElementById("result");
    const exampleDisplay = document.getElementById("example");
    const toggleLanguage = document.getElementById("toggleLanguage");

    let selectedPageMin = parseInt(pageMinInput.value);
    let selectedPageMax = parseInt(pageMaxInput.value);
    let isFrenchToGerman = true;
    let wordQueue = [];
    let wordIndex = 0;
    let currentWord = null;

    function updatePageValues() {
        selectedPageMin = Math.min(parseInt(pageMinInput.value), parseInt(pageMaxInput.value));
        selectedPageMax = Math.max(parseInt(pageMinInput.value), parseInt(pageMaxInput.value));

        pageMinValue.textContent = selectedPageMin;
        pageMaxValue.textContent = selectedPageMax;

        initializeWordQueue();
        displayWord();
    }

    function initializeWordQueue() {
        wordQueue = [];
        for (let page = selectedPageMin; page <= selectedPageMax; page++) {
            if (vocabulary[page]) {
                wordQueue = wordQueue.concat(vocabulary[page]);
            }
        }
        shuffleWords();
        wordIndex = 0;
    }

    function shuffleWords() {
        for (let i = wordQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordQueue[i], wordQueue[j]] = [wordQueue[j], wordQueue[i]];
        }
    }

    function getNextWord() {
        if (wordIndex >= wordQueue.length) {
            shuffleWords();
            wordIndex = 0;
        }
        return wordQueue[wordIndex++];
    }

    function displayWord() {
        if (wordQueue.length === 0) initializeWordQueue();
        currentWord = getNextWord();

        let wordText = isFrenchToGerman ? currentWord.french : currentWord.german;
        let noteText = isFrenchToGerman ? currentWord.noteFrench : currentWord.noteGerman;

        wordDisplay.innerHTML = `${wordText} <i style="color:gray;">${noteText ? "(" + noteText + ")" : ""}</i>`;

        answerInput.value = "";
        answerInput.disabled = false; // Re-enable input
        resultDisplay.innerHTML = "";
        exampleDisplay.innerHTML = "";
        checkButton.style.display = "block";
        continueButton.style.display = "none";
        checkButton.disabled = false;
        answerInput.focus();
    }

    function normalizeString(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function levenshteinDistance(a, b) {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    function checkAnswer() {
        let userAnswer = answerInput.value.trim();
        let correctAnswer = isFrenchToGerman ? currentWord.german : currentWord.french;

        if (!userAnswer) {
            resultDisplay.innerHTML = "<span style='color: red;'>Bitte eine Antwort eingeben!</span>";
            return;
        }

        let normalizedUserAnswer = normalizeString(userAnswer);
        let possibleAnswers = correctAnswer
            .split(/[;]/)
            .map(part => normalizeString(part.trim()))
            .filter(part => part.length > 0);

        let isCorrect = false;
        let almostCorrect = false;

        for (let validAnswer of possibleAnswers) {
            let distance = levenshteinDistance(normalizedUserAnswer, validAnswer);

            if (normalizedUserAnswer === validAnswer) {
                isCorrect = true;
                break;
            } else if (distance <= 2) {
                almostCorrect = true;
            }
        }

        if (isCorrect) {
            resultDisplay.innerHTML = "<span style='color: green;'>Richtig!</span>";
        } else if (almostCorrect) {
            resultDisplay.innerHTML = `<span style='color: orange;'>Fast richtig! Achte auf die Schreibweise! <b>${correctAnswer}</b></span>`;
        } else {
            resultDisplay.innerHTML = `<span style='color: red;'>Falsch! Die richtige Antwort ist: <b>${correctAnswer}</b></span>`;
        }

        if (currentWord.exampleFrench) {
            exampleDisplay.innerHTML = `<i>${currentWord.exampleFrench}</i>`;
        }

        answerInput.disabled = true; // Disable input after checking
        checkButton.style.display = "none";
        continueButton.style.display = "block";
    }

    toggleLanguage.addEventListener("click", () => {
        isFrenchToGerman = !isFrenchToGerman;
        toggleLanguage.innerText = isFrenchToGerman ? "Französisch → Deutsch" : "Deutsch → Französisch";
        displayWord();
    });

    pageMinInput.addEventListener("input", updatePageValues);
    pageMaxInput.addEventListener("input", updatePageValues);

    checkButton.addEventListener("click", checkAnswer);
    answerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkAnswer();
        }
    });

    continueButton.addEventListener("click", displayWord);

    updatePageValues();
    displayWord();
});

/* ============================
   🌙 DARK MODE FUNCTIONALITY
============================ */
document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const container = document.querySelector(".container");

    function enableDarkMode() {
        body.classList.add("dark-mode");
        container.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "☀️";
    }

    function disableDarkMode() {
        body.classList.remove("dark-mode");
        container.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "🌙";
    }

    if (localStorage.getItem("darkMode") === "enabled") {
        enableDarkMode();
    }

    darkModeToggle.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});
