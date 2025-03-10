document.addEventListener("DOMContentLoaded", () => {
    const unitSelect = document.getElementById("unit-select");
    const wordDisplay = document.getElementById("word-display");
    const answerInput = document.getElementById("answer-input");
    const checkButton = document.getElementById("check-button");
    const feedback = document.getElementById("feedback");

    let currentUnit = null;
    let currentWord = null;

    // Load units into the dropdown
    Object.keys(vocabulary).forEach(unit => {
        let option = document.createElement("option");
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    });

    // Select a unit and start quiz
    unitSelect.addEventListener("change", () => {
        currentUnit = unitSelect.value;
        if (currentUnit) {
            nextWord();
        }
    });

    // Load next word
    function nextWord() {
        if (!currentUnit) return;
        let words = vocabulary[currentUnit];
        currentWord = words[Math.floor(Math.random() * words.length)];
        wordDisplay.textContent = currentWord.german;
        answerInput.value = "";
        feedback.textContent = "";
    }

    // Check answer
    checkButton.addEventListener("click", () => {
        if (!currentWord) return;

        let userAnswer = answerInput.value.trim().toLowerCase();
        let correctAnswer = currentWord.french.toLowerCase();

        if (userAnswer === correctAnswer) {
            feedback.textContent = "✅ Richtig!";
            feedback.style.color = "green";
        } else {
            feedback.textContent = `❌ Falsch! Richtige Antwort: ${currentWord.french}`;
            feedback.style.color = "red";
        }

        setTimeout(nextWord, 2000);
    });
});
