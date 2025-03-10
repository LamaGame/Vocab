document.addEventListener("DOMContentLoaded", () => {
    const unitSelect = document.getElementById("unitSelect");
    const wordDisplay = document.getElementById("word");
    const answerInput = document.getElementById("answer");
    const checkButton = document.getElementById("check");
    const resultDisplay = document.getElementById("result");
    const exampleDisplay = document.getElementById("example");
    const toggleLanguage = document.getElementById("toggleLanguage");

    let currentUnit = "Unité 2"; // Default unit
    let isFrenchToGerman = true; // Toggle between directions
    let wordQueue = []; // Queue of words to be shown
    let wordStats = {}; // Tracking correct/incorrect answers

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
        wordQueue = vocabulary[currentUnit].map(word => ({
            word,
            weight: 1 // Default weight for fair initial distribution
        }));
        shuffleWords();
    }

    function shuffleWords() {
        wordQueue.sort((a, b) => a.weight - b.weight || Math.random() - 0.5);
    }

    function getNextWord() {
        return wordQueue.find(w => w.weight > 0)?.word || vocabulary[currentUnit][0];
    }

    function displayWord() {
        if (wordQueue.length === 0) initializeWordQueue();
        currentWord = getNextWord();

        if (!currentWord) return;
        
        let wordText = isFrenchToGerman ? currentWord.french : currentWord.german;
        let noteText = isFrenchToGerman ? currentWord.noteFrench : currentWord.noteGerman;
        
        wordDisplay.innerHTML = `${wordText} <i style="color:gray;">${noteText ? "(" + noteText + ")" : ""}</i>`;
        
        answerInput.value = "";
        resultDisplay.innerHTML = "";
        exampleDisplay.innerHTML = "";

        answerInput.focus(); // Ensures input is focused for quick typing
    }

    function normalizeString(str) {
        return str
            .normalize("NFD") // Decomposes accents
            .replace(/[\u0300-\u036f]/g, "") // Removes accents
            .toLowerCase()
            .trim();
    }

    function updateWordStats(isCorrect) {
        let wordObj = wordQueue.find(w => w.word === currentWord);
        if (!wordObj) return;

        if (isCorrect) {
            wordObj.weight = Math.max(1, wordObj.weight * 0.5); // Reduce weight, but never below 1
        } else {
            wordObj.weight = Math.min(10, wordObj.weight * 2); // Increase weight, max 10
        }

        shuffleWords();
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
            updateWordStats(true);
            setTimeout(displayWord, 1500); // Load next word after 1.5s
        } else if (correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer)) {
                        resultDisplay.innerHTML = `<span style='color: orange;'>Fast richtig! Korrekte Antwort: <b>${isFrenchToGerman ? currentWord.german : currentWord.french}</b></span>`;
            updateWordStats(false);
        } else {
            resultDisplay.innerHTML = `<span style='color: red;'>Falsch! Die richtige Antwort ist: <b>${isFrenchToGerman ? currentWord.german : currentWord.french}</b></span>`;
            updateWordStats(false);
        }

        // Show example sentence
        if (currentWord.exampleFrench) {
            exampleDisplay.innerHTML = `<i>${currentWord.exampleFrench}</i>`;
        }
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

    populateUnitSelect();
    initializeWordQueue();
    displayWord();
});
