document.addEventListener("DOMContentLoaded", () => {
    const unitSelect = document.getElementById("unit-select");
    const modeSelect = document.getElementById("mode-select");
    const wordDisplay = document.getElementById("word-display");
    const answerInput = document.getElementById("answer-input");
    const checkButton = document.getElementById("check-button");
    const feedback = document.getElementById("feedback");
    const correctAnswerDisplay = document.getElementById("correct-answer");
    const noteDisplay = document.getElementById("note-display");

    let currentUnit = null;
    let currentWord = null;
    let mode = "german-to-french"; // Default mode

    // Function to calculate Levenshtein distance (number of changes needed to match strings)
    function levenshteinDistance(a, b) {
        const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1, // Deletion
                        dp[i][j - 1] + 1, // Insertion
                        dp[i - 1][j - 1] + 1 // Substitution
                    );
                }
            }
        }
        return dp[a.length][b.length];
    }

    // Load units into the dropdown
    Object.keys(vocabulary).forEach(unit => {
        let option = document.createElement("option");
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    });

    // Update mode when selection changes
    modeSelect.addEventListener("change", () => {
        mode = modeSelect.value;
        nextWord();
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

        // Show the correct word based on mode
        if (mode === "german-to-french") {
            wordDisplay.textContent = currentWord.german;
        } else {
            wordDisplay.textContent = currentWord.french;
        }

        // Hide correct answer and note at the start
        correctAnswerDisplay.classList.add("hidden");
        noteDisplay.classList.add("hidden");
        correctAnswerDisplay.textContent = "";
        noteDisplay.textContent = "";

        answerInput.value = "";
        feedback.textContent = "";
    }

    // Check answer
    checkButton.addEventListener("click", () => {
        if (!currentWord) return;

        let userAnswer = answerInput.value.trim().toLowerCase();
        let correctAnswer, correctNote;

        if (mode === "german-to-french") {
            correctAnswer = currentWord.french.toLowerCase();
            correctNote = currentWord.noteFrench;
        } else {
            correctAnswer = currentWord.german.toLowerCase();
            correctNote = currentWord.noteGerman;
        }

        let distance = levenshteinDistance(userAnswer, correctAnswer);
        let maxAllowedDistance = Math.ceil(correctAnswer.length * 0.2); // Allow small typos (max 20% of word length)

        if (userAnswer === correctAnswer) {
            feedback.textContent = "✅ Richtig!";
            feedback.style.color = "green";
        } else if (distance > 0 && distance <= maxAllowedDistance) {
            feedback.textContent = "⚠️ Fast richtig!";
            feedback.style.color = "orange";
        } else {
            feedback.textContent = "❌ Falsch!";
            feedback.style.color = "red";
        }

        // Display correct answer and note
        correctAnswerDisplay.textContent = correctAnswer;
        correctAnswerDisplay.classList.remove("hidden");

        if (correctNote) {
            noteDisplay.textContent = correctNote;
            noteDisplay.classList.remove("hidden");
        }

        setTimeout(nextWord, 4000);
    });
});
