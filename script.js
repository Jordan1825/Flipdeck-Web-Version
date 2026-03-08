// I seem to need this to prevent some weird bug where the first card row doesn't get listeners attached. 3/7/2026
document.addEventListener('DOMContentLoaded', function() {



// Get DOM elements
const deckNameInput = document.getElementById('deck-name-input');
const createDeckBtn = document.getElementById('create-deck-btn');
const deckList = document.getElementById('deckList');

// Only run home page code if home page elements exist
if (deckList) {
    createDeckBtn.addEventListener('click', createDeck);
    deckNameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { createDeck(); }
    });
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
        <input type="text" class="card-front" placeholder="Front" data-card-id="${cardIDCounter}">
        <input type="text" class="card-back" placeholder="Back" data-card-id="${cardIDCounter}">
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
// Create deck button validation and navigation. Screen 3 transition happens here after validation. 3/8/26
if (createDeckBtn) {
    createDeckBtn.addEventListener('click', function() {
        const allRows = document.querySelectorAll('.card-row');
        const filledRows = allRows.length - 1;
        
        if (filledRows < 4) {
            alert('Please add at least 4 cards to create your deck!');
            return;
        }
        window.location.href = 'Deck-Builder-Screen3Review.html';
    });

} else {
    console.log("cards-container not found!");
}

}); // End of DOMContentLoaded event listener that I seem to need to prevent some weird bug where the first card row doesn't get listeners attached. 3/7/2026