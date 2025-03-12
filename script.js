document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const container = document.querySelector(".container");
    const cards = document.querySelectorAll(".card");
    const startButton = document.getElementById("startLesson");

    let selectedLanguage = null;

    // Load dark mode preference
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

    function enableDarkMode() {
        body.classList.add("dark-mode");
        container.classList.add("dark-mode");
        cards.forEach(card => card.classList.add("dark-mode"));
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "☀️ Light Mode";
    }

    function disableDarkMode() {
        body.classList.remove("dark-mode");
        container.classList.remove("dark-mode");
        cards.forEach(card => card.classList.remove("dark-mode"));
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "🌙 Dark Mode";
    }

    // Select a language card
    cards.forEach(card => {
        card.addEventListener("click", () => {
            if (card.classList.contains("disabled")) return;
            cards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedLanguage = card.getAttribute("data-language");
        });
    });

    // Start lesson
    startButton.addEventListener("click", () => {
        if (selectedLanguage) {
            window.location.href = selectedLanguage + ".html"; // Redirect to lesson page
        } else {
            alert("Please select a language!");
        }
    });
});
