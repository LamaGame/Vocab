document.addEventListener("DOMContentLoaded", () => {
    const unitSelect = document.getElementById("unitSelect");
    const wordDisplay = document.getElementById("word");
    const answerInput = document.getElementById("answer");
    const checkButton = document.getElementById("check");
    const continueButton = document.getElementById("continue"); // New button
    const resultDisplay = document.getElementById("result");
    const exampleDisplay = document.getElementById("example");
    const toggleLanguage = document.getElementById("toggleLanguage");

    let currentUnit = "Unité 2"; // Default unit
    let isFrenchToGerman = true; // Toggle between directions
    let wordQueue = []; // Holds words without duplicates
    let wordIndex = 0; // Tracks current position in the shuffled list
    let currentWord = null; // Store the current word

    function populateUnitSelect() {
        for (let unit in vocabulary) {
            let option = document.createElement("option");
            option.value = unit;
            option.textContent = unit;
            unitSelect.appendChild(option);
        }
        unitSelect.value = currentUnit;
    }

    function initializeWordQueue() {
        wordQueue = [...vocabulary[currentUnit]]; // Copy words from vocabulary
        shuffleWords();
        wordIndex = 0; // Reset index
    }

    function shuffleWords() {
        for (let i = wordQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordQueue[i], wordQueue[j]] = [wordQueue[j], wordQueue[i]];
        }
    }

    function getNextWord() {
        if (wordIndex >= wordQueue.length) {
            shuffleWords(); // Reshuffle when the list is exhausted
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
        resultDisplay.innerHTML = "";
        exampleDisplay.innerHTML = "";
        checkButton.style.display = "block";
        continueButton.style.display = "none";
        checkButton.disabled = false;
        answerInput.focus();
    }

    function normalizeString(str) {
        return str
            .normalize("NFD") // Decomposes accents
            .replace(/[\u0300-\u036f]/g, "") // Removes accents
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
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1,     // Insertion
                    matrix[i - 1][j] + 1      // Deletion
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

    // Split correct answer into separate valid responses
    let possibleAnswers = correctAnswer
        .split(/[,;/]/) // Split at `,`, `;`, `/`
        .map(part => normalizeString(part.trim())) // Normalize and trim spaces
        .filter(part => part.length > 0); // Remove empty entries

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

    // Show example sentence if available
    if (currentWord.exampleFrench) {
        exampleDisplay.innerHTML = `<i>${currentWord.exampleFrench}</i>`;
    }

    checkButton.style.display = "none"; // Hide check button
    continueButton.style.display = "block"; // Show continue button
}
    
    toggleLanguage.addEventListener("click", () => {
        isFrenchToGerman = !isFrenchToGerman;
        toggleLanguage.innerText = isFrenchToGerman ? "Französisch → Deutsch" : "Deutsch → Französisch";
        displayWord();
    });

    unitSelect.addEventListener("change", () => {
        currentUnit = unitSelect.value;
        initializeWordQueue();
        displayWord();
    });

    checkButton.addEventListener("click", checkAnswer);
    answerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkAnswer();
        }
    });

    continueButton.addEventListener("click", () => {
        displayWord();
    });

    populateUnitSelect();
    initializeWordQueue();
    displayWord();
});

document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const container = document.querySelector(".container");

    /* ============================
       🌙 DARK MODE FUNCTIONALITY
    ============================ */
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

    // Load dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        enableDarkMode();
    }

    // Toggle dark mode when button is clicked
    darkModeToggle.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});
