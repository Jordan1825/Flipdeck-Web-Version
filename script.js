// Get DOM elements
const deckNameInput = document.getElementById('deckNameInput');
const createDeckBtn = document.getElementById('createDeckBtn');
const deckList = document.getElementById('deckList');

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

// Function: Display all decks
function displayDecks() {
    // Clear current display
    deckList.innerHTML = '';

    // Check if no decks exist
    if (decks.length === 0) {
        deckList.innerHTML = '<p>No decks created yet. Create one above!</p>';
        return;
    }

    // Create HTML for each deck
    decks.forEach(function(deck) {
        // Create deck element
        const deckDiv = document.createElement('div');
        deckDiv.className = 'deck-item';
        deckDiv.textContent = deck.name + ' (' + deck.cards.length + ' cards)';

        // Add click handler 
        deckDiv.addEventListener('click', function() {
            openDeck(deck.id);
        });

        // Add to list
        deckList.appendChild(deckDiv);
    });
}

// Function: Open a deck (placeholder for now)
function openDeck(deckId) {
    const deck = decks.find(d => d.id === deckId);

    if (deck) {
        alert('Opening deck: ' + deck.name + '\n(Add cards feature coming soon!)');
        // Later, create the add cards interface here
   
    }
}

// Event Listerner: Create deck button
createDeckBtn.addEventListener('click', createDeck);

// Event Listener: Press Enter to create deck
deckNameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        createDeck();
    }
});

// Initial display
displayDecks();


//Auto-add new card row when current one is filled
const cardContainer = document.getElementById('cards-container');
let cardIDCounter = 1;

function addNewCardRow() {
    cardIDCounter++;

    const cardRow = document.createElement('div');
    newCardRow.className = 'card-row';
    newCardRow.setAttribute('data-card-id', cardIDCounter);

    newCardRow.innerHTML = `
        <input type="text" class="card-front" placeholder="Front" data-card-id="${cardIDCounter}">
        <input type="text" class="card-back" placeholder="Back" data-card-id="${cardIDCounter}">
        <button class="delete-card-btn" data-card-id="${cardIDCounter}">
            img src="trash-icon.webp" alt="Delete">
        </button>
    `;

    cardsContainer.appendChild(newCardRow);
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
}

// Attach listeners to the first card on page load
if (cardsContainer) {
    const firstCardRow = cardsContainer.querySelector('.card-row');
    if (firstCardRow) {
        attachCardListeners(firstCardRow);
    }
}


// At the bottom where you attach listeners
if (cardsContainer) {
    const firstCardRow = cardsContainer.querySelector('.card-row');
    if (firstCardRow) {
        attachCardListeners(firstCardRow);
    } else {
        console.log("No .card-row found!");
    }
} else {
    console.log("cards-container not found!");
}