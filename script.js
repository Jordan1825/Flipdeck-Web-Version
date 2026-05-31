// I seem to need this to prevent some weird bug where the first card row doesn't get listeners attached. 3/7/2026
document.addEventListener('DOMContentLoaded', function() {



// Get DOM elements
const deckNameInput = document.getElementById('deck-name-input');
const createDeckBtn = document.getElementById('create-deck-btn');
const deckList = document.getElementById('deckList');

// Only run home page code if home page elements exist
if (deckList) {
   
    displayDecks();
}

// Array to store the decks
let decks = [];

// Function: Create a new deck
function createDeck() {
    const deckName = deckNameInput.value.trim();

    // Validate input
    if (deckName === '') {
        alert('Please enter a deck name.');
        return;
    }

    // Create a new deck object
    const newDeck = {
        id: Date.now(), // Unique ID based on timestamp
        name: deckName,
        cards: [] // Initialize with an empty array of cards
    };

    // Add the new deck to the decks array
    decks.push(newDeck);

    // Clear the input field
    deckNameInput.value = '';

    // Update display
    displayDecks();

    // Log for debugging
    console.log('Deck created:', newDeck);
    console.log('All decks:', decks);
}

// =====================================================
// SCREEN 4: QUIZ MODE - HOME SCREEN SETUP
// =====================================================
// Loads saved decks from localStorage and launches quiz
function displayDecks() {
    deckList.innerHTML = '';

    const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');

    if (savedDecks.length === 0) {
        deckList.innerHTML = '<p class="empty-message">No decks created yet. Start by creating a new deck!</p>';
        return;
    }

    savedDecks.forEach(function(deck) {
        const deckDiv = document.createElement('div');
        deckDiv.className = 'deck-item';
        deckDiv.textContent = deck.name + ' (' + deck.cards.length + ' cards)';

        deckDiv.addEventListener('click', function() {
            localStorage.setItem('activeDeck', JSON.stringify(deck));
            window.location.href = 'quiz-screen4.html';
        });

        deckList.appendChild(deckDiv);
    });
}
// =====================================================
// SCREEN 4: QUIZ MODE - HOME SCREEN SETUP CLOSE *****
// =====================================================

// Function: Open a deck (placeholder for now)
function openDeck(deckId) {
    const deck = decks.find(d => d.id === deckId);

    if (deck) {
        alert('Opening deck: ' + deck.name + '\n(Add cards feature coming soon!)');
        // Later, create the add cards interface here
   
    }
}

if (deckList) {
    createDeckBtn.addEventListener('click', createDeck);
// Event Listerner: Create deck button
createDeckBtn.addEventListener('click', createDeck);

// Event Listener: Press Enter to create deck
deckNameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        createDeck();

        // 4 cards minium requirement 3/8/26
        const fillCards = document.querySelectorAll('.card-row').length;
        if (fillCards < 4) {
            alert('Please add at least 4 cards to create your deck!');
            return;
        }
    }
});

// Initial display
displayDecks();
}

//Auto-add new card row when current one is filled   3/1/2026
const cardContainer = document.getElementById('cards-container');
let cardIDCounter = 1;

function addNewCardRow() {
    cardIDCounter++;

    const newCardRow = document.createElement('div');
    newCardRow.className = 'card-row';
    newCardRow.setAttribute('data-card-id', cardIDCounter);

    newCardRow.innerHTML = `
        <input type="text" name="card-front" class="card-front" placeholder="Front" data-card-id="${cardIDCounter}">
        <input type="text" name="card-back" class="card-back" placeholder="Back" data-card-id="${cardIDCounter}">
        <button class="delete-card-btn" data-card-id="${cardIDCounter}">
            <img src="trash-icon.webp" alt="Delete">
        </button>
    `;

    // Add delete functionality to the new card row 3/8/26
    const deleteBtn = newCardRow.querySelector('.delete-card-btn');
    deleteBtn.addEventListener('click', function() {
        newCardRow.remove();
    });

    cardContainer.appendChild(newCardRow);
    attachCardListeners(newCardRow);
}

function attachCardListeners(cardRow) {
    const frontInput = cardRow.querySelector('.card-front');
    const backInput = cardRow.querySelector('.card-back');

    function checkBothFilled() {
        if (frontInput.value.trim() !== '' && backInput.value.trim() !== '') {
            // Check if this is the last card
            const allRows = document.querySelectorAll('.card-row');
            const lastRow = allRows[allRows.length - 1];

            if (cardRow === lastRow) {
                addNewCardRow();
            }
        }
    }

    frontInput.addEventListener('input', checkBothFilled);
    backInput.addEventListener('input', checkBothFilled);
}// Closes attachCardListeners function 




// At the bottom where you attach listeners
if (cardContainer) {
    const firstCardRow = cardContainer.querySelector('.card-row');
    if (firstCardRow) {
        attachCardListeners(firstCardRow);
    } else {
        console.log("No .card-row found!");
    }

}

// ===============================================================
// SCREEN 2 TO SCREEN 3 TRANSITION CODE (REVIEW SCREEN) 3/11/26
//================================================================

// STEP 1 COLLECT ALL DECK DATA FROM SCREEN 2
function collectDeckData() {
    const deckName = document.getElementById('deck-name-input').value;
    const cardRows = document.querySelectorAll('.card-row');
    const cards = [];

    cardRows.forEach(row => {
        const frontInput = row.querySelector('.card-front');
        const backInput = row.querySelector('.card-back');
        if (frontInput.value.trim() !== '' && backInput.value.trim() !== '') {
            cards.push({
                front: frontInput.value.trim(),
                back: backInput.value.trim()
            });
        }
    });

    return {
        name: deckName,
        cards: cards
        ,createdAt: new Date().toISOString() // Optional: Add a timestamp //check out if bug here
    };
}

// STEP 2 SAVE DECK DATA TO LOCAL STORAGE
function saveDeckToLocalStorage(deckData) {
    localStorage.setItem('tempDeck', JSON.stringify(deckData));
    }

// STEP 3 LOAD DECK FROM LOCALSTORAGE
function loadDeckFromLocalStorage() {
    const tempDeckString = localStorage.getItem('tempDeck');

    if (!tempDeckString) {
        alert("No deck found! Redirecting back to deck builder...");
        window.location.href = 'Deck-BuilderSC2.html';
        return null;
    }

    return JSON.parse(tempDeckString);
}
 // STEP 4: DISPLAY DECK FOR REVISION ON SCREEN 3
 function displayDeckForReview() {
    const deckData = loadDeckFromLocalStorage();

    if (!deckData) return;

    document.getElementById('deck-name-display').textContent = deckData.name;

    const reviewContainer = document.getElementById('review-cards-container');
    reviewContainer.innerHTML = '';

    deckData.cards.forEach((card, index) => {
        const cardRow = document.createElement('div');
        cardRow.className = 'review-card-row';

        cardRow.innerHTML = `
            <div class="card-number">${index + 1}.</div>
            <div class="card-preview">
                <span class="label">Front:</span>
                <span class="content">${card.front}</span>
            </div>
            <div class="card-preview">
                <span class="label">Back:</span>
                <span class="content">${card.back}</span>
            </div>
        `;

        reviewContainer.appendChild(cardRow);
    });
}

// =====================================================
// SCREEN 2: CREATE DECK BUTTON 3/11/26
// =====================================================
const createDeckBtnNew = document.getElementById('create-deck-btn');

if (createDeckBtnNew && document.getElementById(('cards-container'))) {
    createDeckBtnNew.addEventListener('click', function() {
        const deckData = collectDeckData();

        if (deckData.cards.length < 4) {
            alert('Please add at least 4 cards to create your deck!');
            return;
        }

        saveDeckToLocalStorage(deckData);
        window.location.href = 'Deck-Builder-Screen3Review.html';
        });
    
}

// =====================================================
// SCREEN 3: DISPLAY AND BUTTONS
// =====================================================
if (document.getElementById('review-cards-container')) {
    displayDeckForReview();
}

const goBackBtn = document.getElementById('go-back-btn');
if (goBackBtn) {
    goBackBtn.addEventListener('click', function() {
        window.location.href = 'Deck-BuilderSC2.html';
    });
}

const saveDeckBtn = document.getElementById('save-deck-btn');
if (saveDeckBtn) {
    saveDeckBtn.addEventListener('click', function() {
        const deckData = loadDeckFromLocalStorage();

        // Load existing saved decks or start fresh
        const savedDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
        //Give deck a unique ID for later retrieval
        deckData.id = Date.now();
        savedDecks.push(deckData);
// ===============================================================
// STEP 5: SAVE DECK PERMANENTLY AND NAVIGATE HOME 5/10/26
//================================================================
        // Save updated decks back to localStorage Permanently
        localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
        localStorage.removeItem('tempDeck'); // Clean up temp data

        
        window.location.href = 'index-home.html';
// =============================================================== STEP 5: SAVE DECK PERMANENTLY AND NAVIGATE HOME CLOSE 
        console.log('Deck to save:', deckData);
        alert(`Deck "${deckData.name}" saved successfully!`);

        localStorage.removeItem('tempDeck');
        window.location.href = 'index-home.html';
    });

}
// =====================================================
//SCREEN 4: QUIZ MODE LOGIC 5/31/26
// =====================================================
If (document.getElementById('quiz-question')) 
    const activeDeck = JSON.parse(localStorage.getItem('activeDeck'));

    if (!activeDeck) {
        alert("No deck selected. Going home.");
        window.location.href = 'index-home.html';
    } else {
        document.getElementById('quiz-deck-name').textContent = activeDeck.name;

        // Shuffle helper -- randomizes any array
        function shuffle(arr) {
            return arr.slice().sort(() => Math.random() - 0.5);
        }

        const cards = shuffle(activeDeck.cards);
        let currentCardIndex = 0;
        let score = 0;

        document.getElementById('total-cards').textContent = cards.length;

        function loadQuestion() {
            const card = cards[currenIndex];
            document.getElementById('current-card-num').textContent = currentIndex + 1;
            document.getElementById('quiz-question').textContent = card.front;
            document.getElementById('quiz-feedback').style.display = 'none';
            document.getElementById('quiz-next-btn').style.display = 'none';

            // BUILD WRONG CARD ANSWERS FROM OTHER CARDS' BACKS 5/31/26
            const otherBacks = cards
                .filter((_, i) => i !== currentIndex)
                .map(card => c.back);
            const wrongAnswers = shuffle(otherBacks).slice(0, 3);

            //MIX CORRECT ANSWERS IN AND SHUFFLE ALL 4 5/31/26
            const choices = shuffle([card.back, ...wrongAnswers]);

            const choicesBox = document.getElementById('quiz-choices');
            choicesBox.innerHTML = '';
            choices.forEach(function(choice) {
                const btn = document.createElement('button');
                btn.textContent = choice;
                btnaddEventListener('click', function() {
                    handleAnswer(choice, card.back);
                });
                choicesBox.appendChild(btn);
            });
        }

        function handleAnswer(chosen, correct) {
            // DISABLE ALL CHOICE BUTTONS AFTER ANSWERING 5/31/26
            document.querySelectorAll('#quiz-choices button').forEach(btn => btn.disabled = true);
            
            const feedback = document.getElementById('quiz-feedback');
            feedback.style.display = 'block';

            if (chosen === correct) {
                score++;
                feedback.textContent = 'Correct!';
                feedback.style.color = 'green';
            } else {
                feedback.textContent = 'Wrong - correct answer: ' + correct;
                feedback.style.color = 'red';
            }

            document.getElementById('quiz-next-btn').style.display = 'block';
        }

        document.getElementById('quiz-next-btn').addEventListener('click', function() {
            currentCardIndex++;
            if (currentCardIndex < cards.length) {
                loadQuestion();
            } else {
                // Show results
                document.getElementById('quiz-question-box').style.display = 'none';
                document.getElementById('quiz-choices').style.display = 'none';
                document.getElementById('quiz-next-btn').style.display = 'none';
                document.getElementById('quiz-progress').style.display = 'none';
                const results = document.getElementById('quiz-results');
                results.style.display = 'block';
                document.getElementById('quiz-score-text').textContent = 'You got ' + score + ' out of ' + cards.length + ' correct!';
            }
        });
        
        document.getElementById('quiz-home-btn').addEventListener('click', function() {
             window.location.href = 'index-home.html';
        });

        loadQuestion();
    }
    }
)// End of DOMContentLoaded event listener that I seem to need to prevent some weird bug where the first card row doesn't get listeners attached. 3/7/2026