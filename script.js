document.addEventListener("DOMContentLoaded", () => {
    const unitSelect = document.getElementById("unitSelect");
    const wordDisplay = document.getElementById("word");
    const answerInput = document.getElementById("answer");
    const checkButton = document.getElementById("check");
    const resultDisplay = document.getElementById("result");
    const exampleDisplay = document.getElementById("example");
    const toggleLanguage = document.getElementById("toggleLanguage");

    let currentUnit = "Unité 2"; // Default unit
    let currentWord = null;
    let isFrenchToGerman = true; // Toggle between directions

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

    function getRandomWord() {
        const words = vocabulary[currentUnit];
        return words[Math.floor(Math.random() * words.length)];
    }

    function displayWord() {
        currentWord = getRandomWord();
        if (!currentWord) return;
        
        let wordText = isFrenchToGerman ? currentWord.french : currentWord.german;
        let noteText = isFrenchToGerman ? currentWord.noteFrench : currentWord.noteGerman;
        
        wordDisplay.innerHTML = `${wordText} <i style="color:gray;">${noteText ? "(" + noteText + ")" : ""}</i>`;
        
        answerInput.value = "";
        resultDisplay.innerHTML = "";
        exampleDisplay.innerHTML = "";
        answerInput.focus();
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
        displayWord();
    });

    checkButton.addEventListener("click", checkAnswer);
    answerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkAnswer();
        }
    });

    populateUnitSelect();
    displayWord();
});
