document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const container = document.querySelector(".container");
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".card");
    const startButton = document.getElementById("startLesson");

    let selectedLanguage = null;

    /* ============================
       🌙 DARK MODE FUNCTIONALITY
    ============================ */
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

    /* ==================================
       🎯 CENTER THE SELECTED CARD 
    ================================== */
    function centerCard(card) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    function updateSelectedCard() {
        let closestCard = null;
        let minDistance = Infinity;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const carouselRect = carousel.getBoundingClientRect();
            const distance = Math.abs(cardRect.left + cardRect.width / 2 - carouselRect.left - carouselRect.width / 2);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        if (closestCard) {
            cards.forEach(card => card.classList.remove("selected"));
            closestCard.classList.add("selected");
            selectedLanguage = closestCard.dataset.language; // Store selected language
        }
    }

    // Detect scroll to determine centered card
    carousel.addEventListener("scroll", () => {
        clearTimeout(carousel.scrollTimeout);
        carousel.scrollTimeout = setTimeout(updateSelectedCard, 100);
    });

    // Click to center a card
    cards.forEach(card => {
        card.addEventListener("click", () => {
            centerCard(card);
            updateSelectedCard();
        });
    });

    // Initialize selected card on page load
    updateSelectedCard();

    /* ==================================
       🚀 START LESSON BUTTON
    ================================== */
    startButton.addEventListener("click", () => {
        if (selectedLanguage) {
            window.location.href = selectedLanguage + ".html"; // Redirects based on selection
        } else {
            alert("Please select a language first!");
        }
    });
});
