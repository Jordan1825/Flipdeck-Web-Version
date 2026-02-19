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