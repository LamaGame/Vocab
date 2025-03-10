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

    // Populate unit dropdown
    function populateUnitSelect() {
        for (let unit in vocabulary) {
            let option = document.createElement("option");
            option.value = unit;
            option.textContent = unit;
            unitSelect.appendChild(option);
        }
        unitSelect.value = currentUnit; // Set default unit
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
            wordIndex = 0; // Reset index
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
        continueButton.style.display = "none"; // Hide continue button initially
        checkButton.disabled = false; // Enable check button
        answerInput.focus(); // Focus on input field
    }

    function normalizeString(str) {
        return str
            .normalize("NFD") // Decomposes accents
            .replace(/[\u0300-\u036f]/g, "") // Removes accents
            .toLowerCase()
            .trim();
    }

    function checkAnswer() {
        let userAnswer = normalizeString(answerInput.value);
        let correctAnswer = normalizeString(isFrenchToGerman ? currentWord.german : currentWord.french);

        if (!userAnswer) {
            resultDisplay.innerHTML = "<span style='color: red;'>Bitte eine Antwort eingeben!</span>";
            return;
        }

        if (userAnswer === correctAnswer) {
            resultDisplay.innerHTML = "<span style='color: green;'>Richtig!</span>";
        } else if (correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer)) {
            resultDisplay.innerHTML = `<span style='color: orange;'>Fast richtig! Korrekte Antwort: <b>${isFrenchToGerman ? currentWord.german : currentWord.french}</b></span>`;
        } else {
            resultDisplay.innerHTML = `<span style='color: red;'>Falsch! Die richtige Antwort ist: <b>${isFrenchToGerman ? currentWord.german : currentWord.french}</b></span>`;
        }

        // Show example sentence if available
        if (currentWord.exampleFrench) {
            exampleDisplay.innerHTML = `<i>${currentWord.exampleFrench}</i>`;
        }

        checkButton.disabled = true; // Disable check button after checking answer
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
