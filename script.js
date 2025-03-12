document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const container = document.querySelector(".container");
    const newsContainer = document.querySelector(".news-container"); // Select news container
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".card");
    const startButton = document.getElementById("startLesson");
    const newsTrack = document.querySelector(".news-track");
    const items = Array.from(newsTrack.children);

    let selectedLanguage = null;

    /* ============================
       🌙 DARK MODE FUNCTIONALITY
    ============================ */
    function enableDarkMode() {
        body.classList.add("dark-mode");
        container.classList.add("dark-mode");
        newsContainer.classList.add("dark-mode"); // Apply dark mode to news ticker
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "☀️";
    }

    function disableDarkMode() {
        body.classList.remove("dark-mode");
        container.classList.remove("dark-mode");
        newsContainer.classList.remove("dark-mode"); // Remove dark mode from news ticker
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

    /* ==================================
       🎯 DETECT & HIGHLIGHT CENTERED CARD
    ================================== */
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
            // Remove selection from all cards
            cards.forEach(card => card.classList.remove("selected"));

            // Add selection effect to centered card
            closestCard.classList.add("selected");

            // Store the selected language
            selectedLanguage = closestCard.dataset.language;
        }
    }

    // Detect when scrolling stops & update selection
    carousel.addEventListener("scroll", () => {
        clearTimeout(carousel.scrollTimeout);
        carousel.scrollTimeout = setTimeout(() => {
            updateSelectedCard();
        }, 10);
    });

    // Click to center a card AND immediately update selection
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

            // Ensure the selection effect updates immediately on click
            setTimeout(updateSelectedCard, 100);
        });
    });

    // Ensure a card is selected on page load
    setTimeout(updateSelectedCard, 100);

    /* ==================================
       🚀 START LESSON BUTTON
    ================================== */
    startButton.addEventListener("click", () => {
        if (selectedLanguage) {
            window.location.href = selectedLanguage + "/index.html"; // Redirects based on selection
        } else {
            alert("Bitte wähle eine Sprache aus!");
        }
    });
    
    // Duplicate each item and append it to the track
    items.forEach(item => {
        const clone = item.cloneNode(true);
        newsTrack.appendChild(clone);
    });
});
