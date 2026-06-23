[1mdiff --git a/Deck-Builder-Screen3Review.html b/Deck-Builder-Screen3Review.html[m
[1mindex 779068a..447d668 100644[m
[1m--- a/Deck-Builder-Screen3Review.html[m
[1m+++ b/Deck-Builder-Screen3Review.html[m
[36m@@ -26,6 +26,7 @@[m
 [m
         <!-- Action Buttons -->[m
         <button id="save-deck-btn">Confirm & Save Deck</button>[m
[32m+[m[32m        <button id="save-and-quiz-btn">Save & Start Quiz</button>[m
         <button id="go-back-btn">Go Back & Edit</button>[m
 [m
     </div>[m
[1mdiff --git a/Deck-Builder-Screen4Quiz.html b/Deck-Builder-Screen4Quiz.html[m
[1mindex 5785e14..3edbafe 100644[m
[1m--- a/Deck-Builder-Screen4Quiz.html[m
[1m+++ b/Deck-Builder-Screen4Quiz.html[m
[36m@@ -2,8 +2,40 @@[m
 <html lang="en">[m
 <head>[m
 <meta charset="UTF-8">[m
[31m-<title>Deck Builder Screen 4 Quiz</title>[m
[32m+[m[32m<meta name="viewport" content="width=device-width, initial-scale=1.0">[m
[32m+[m[32m<title>Quiz - FlipDeck</title>[m
[32m+[m[32m<link rel="stylesheet" href="style.css">[m
 </head>[m
 <body>[m
[32m+[m[32m    <div class="container">[m
[32m+[m
[32m+[m[32m        <div class"deck-builder-header">[m
[32m+[m[32m            <h1>FlipDeck</h1>[m
[32m+[m[32m            <p  id="quiz-deck-name" class="review-label">Quiz Mode</p>[m
[32m+[m[32m        </div>[m
[32m+[m
[32m+[m[32m        <div id="quiz-progress">Card <span id="current-card-num">1</span> of <span id="total-cards">?</span></div>[m
[32m+[m
[32m+[m[32m        <div id="quiz-question-box">[m
[32m+[m[32m            <p class="'label">What is the answer for:</p>[m
[32m+[m[32m            <h2 id="quiz-question">Loading...</h2>[m
[32m+[m[32m        </div>[m
[32m+[m
[32m+[m[32m        <div id="quiz-choices">[m
[32m+[m[32m            <!-- 4 answers will be dynamically inserted here by JS-->[m
[32m+[m[32m        </div>[m
[32m+[m
[32m+[m[32m        <div id="quiz-feedback" style="display:none;"></div>[m
[32m+[m[41m        [m
[32m+[m[32m        <button id="quiz-next-btn" style="display:none;">Next Card</button>[m
[32m+[m
[32m+[m[32m        <div id="quiz-results" style="display:none;">[m
[32m+[m[32m            <h2>Quiz Completed!</h2>[m
[32m+[m[32m            <p id="quiz-score-text"></p>[m
[32m+[m[32m            <button id="quiz-home-btn">Back to Home</button>[m
[32m+[m[32m        </div>[m
[32m+[m
[32m+[m[32m    </div>[m
[32m+[m[32m    <script src="script.js"></script>[m
 </body>[m
 </html>[m
[1mdiff --git a/script.js b/script.js[m
[1mindex 3600f69..aec2e1d 100644[m
[1m--- a/script.js[m
[1m+++ b/script.js[m
[36m@@ -1,410 +1,327 @@[m
[31m-// I seem to need this to prevent some weird bug where the first card row doesn't get listeners attached. 3/7/2026[m
[31m-document.addEventListener('DOMContentLoaded', function() {[m
[31m-[m
[31m-[m
[31m-[m
[31m-// Get DOM elements[m
[31m-const deckNameInput = document.getElementById('deck-name-input');[m
[31m-const createDeckBtn = document.getElementById('create-deck-btn');[m
[31m-const deckList = document.getElementById('deckList');[m
[31m-[m
[31m-// Only run home page code if home page elements exist[m
[31m-if (deckList) {[m
[31m-   [m
[31m-    displayDecks();[m
[31m-}[m
[31m-[m
[31m-// Array to store the decks[m
[31m-let decks = [];[m
[31m-[m
[31m-// Function: Create a new deck[m
[31m-function createDeck() {[m
[31m-    const deckName = deckNameInput.value.trim();[m
[31m-[m
[31m-    // Validate input[m
[31m-    if (deckName === '') {[m
[31m-        alert('Please enter a deck name.');[m
[31m-        return;[m
[31m-    }[m
[31m-[m
[31m-    // Create a new deck object[m
[31m-    const newDeck = {[m
[31m-        id: Date.now(), // Unique ID based on timestamp[m
[31m-        name: deckName,[m
[31m-        cards: [] // Initialize with an empty array of cards[m
[31m-    };[m
[31m-[m
[31m-    // Add the new deck to the decks array[m
[31m-    decks.push(newDeck);[m
[31m-[m
[31m-    // Clear the input field[m
[31m-    deckNameInput.value = '';[m
[31m-[m
[31m-    // Update display[m
[31m-    displayDecks();[m
[31m-[m
[31m-    // Log for debugging[m
[31m-    console.log('Deck created:', newDeck);[m
[31m-    console.log('All decks:', decks);[m
[31m-}[m
[31m-[m
[31m-// =====================================================[m
[31m-// SCREEN 4: QUIZ MODE - HOME SCREEN SETUP[m
[31m-// =====================================================[m
[31m-// Loads saved decks from localStorage and launches quiz[m
[31m-function displayDecks() {[m
[31m-    deckList.innerHTML = '';[m
[31m-[m
[31m-    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');[m
[31m-[m
[31m-    if (savedDecks.length === 0) {[m
[31m-        deckList.innerHTML = '<p class="empty-message">No decks created yet. Start by creating a new deck!</p>';[m
[31m-        return;[m
[31m-    }[m
[31m-[m
[31m-    savedDecks.forEach(function(deck) {[m
[31m-        const deckDiv = document.createElement('div');[m
[31m-        deckDiv.className = 'deck-item';[m
[31m-        deckDiv.textContent = deck.name + ' (' + deck.cards.length + ' cards)';[m
[31m-[m
[31m-        deckDiv.addEventListener('click', function() {[m
[31m-            localStorage.setItem('activeDeck', JSON.stringify(deck));[m
[31m-            window.location.href = 'quiz-screen4.html';[m
[31m-        });[m
[31m-[m
[31m-        deckList.appendChild(deckDiv);[m
[31m-    });[m
[31m-}[m
[31m-// =====================================================[m
[31m-// SCREEN 4: QUIZ MODE - HOME SCREEN SETUP CLOSE *****[m
[31m-// =====================================================[m
[31m-[m
[31m-// Function: Open a deck (placeholder for now)[m
[31m-function openDeck(deckId) {[m
[31m-    const deck = decks.find(d => d.id === deckId);[m
[31m-[m
[31m-    if (deck) {[m
[31m-        alert('Opening deck: ' + deck.name + '\n(Add cards feature coming soon!)');[m
[31m-        // Later, create the add cards interface here[m
[31m-   [m
[31m-    }[m
[31m-}[m
[31m-[m
[31m-if (deckList) {[m
[31m-    createDeckBtn.addEventListener('click', createDeck);[m
[31m-// Event Listerner: Create deck button[m
[31m-createDeckBtn.addEventListener('click', createDeck);[m
[31m-[m
[31m-// Event Listener: Press Enter to create deck[m
[31m-deckNameInput.addEventListener('keypress', function(event) {[m
[31m-    if (event.key === 'Enter') {[m
[31m-        createDeck();[m
[31m-[m
[31m-        // 4 cards minium requirement 3/8/26[m
[31m-        const fillCards = document.querySelectorAll('.card-row').length;[m
[31m-        if (fillCards < 4) {[m
[31m-            alert('Please add at least 4 cards to create your deck!');[m
[31m-            return;[m
[31m-        }[m
[31m-    }[m
[31m-});[m
[31m-[m
[31m-// Initial display[m
[31m-displayDecks();[m
[31m-}[m
[31m-[m
[31m-//Auto-add new card row when current one is filled   3/1/2026[m
[31m-const cardContainer = document.getElementById('cards-container');[m
[31m-let cardIDCounter = 1;[m
[31m-[m
[31m-function addNewCardRow() {[m
[31m-    cardIDCounter++;[m
[31m-[m
[31m-    const newCardRow = document.createElement('div');[m
[31m-    newCardRow.className = 'card-row';[m
[31m-    newCardRow.setAttribute('data-card-id', cardIDCounter);[m
[31m-[m
[31m-    newCardRow.innerHTML = `[m
[31m-        <input type="text" name="card-front" class="card-front" placeholder="Front" data-card-id="${cardIDCounter}">[m
[31m-        <input type="text" name="card-back" class="card-back" placeholder="Back" data-card-id="${cardIDCounter}">[m
[31m-        <button class="delete-card-btn" data-card-id="${cardIDCounter}">[m
[31m-            <img src="trash-icon.webp" alt="Delete">[m
[31m-        </button>[m
[31m-    `;[m
[31m-[m
[31m-    // Add delete functionality to the new card row 3/8/26[m
[31m-    const deleteBtn = newCardRow.querySelector('.delete-card-btn');[m
[31m-    deleteBtn.addEventListener('click', function() {[m
[31m-        newCard