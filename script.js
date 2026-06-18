// DOMContentLoaded wrapper prevents the "first card row has no listeners" bug. 3/7/2026
  document.addEventListener('DOMContentLoaded', function() {

  // Get DOM elements
  const deckNameInput = document.getElementById('deck-name-input');
  const createDeckBtn = document.getElementById('create-deck-btn');
  const deckList = document.getElementById('deckList');

  // Only run home page code if home page elements exist (all the saved decks are here from localStorage)
  if (deckList) {
      displayDecks();
  }

  // Array to store the decks
  let decks = [];

  // Function: Create a new deck (old home-screen flow, kept for reference)
  function createDeck() {
      const deckName = deckNameInput.value.trim();
      if (deckName === '') {
          alert('Please enter a deck name.');
          return;
      }
      const newDeck = {
          id: Date.now(),
          name: deckName,
          cards: []
      };
      decks.push(newDeck);
      deckNameInput.value = '';
      displayDecks();
      console.log('Deck created:', newDeck);
      console.log('All decks:', decks);
  }

  // =====================================================
  // HOME SCREEN: display saved decks
  // =====================================================
  function displayDecks() {
      deckList.innerHTML = '';
      const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');

      

      savedDecks.forEach(function(deck) {
          const deckDiv = document.createElement('div');
          deckDiv.className = 'deck-item';
          deckDiv.innerHTML = `
            <div class="deck-item-name">${deck.name} (${deck.cards.length} cards)</div>
            <div class="deck-actions">
                <button class="deck-action-btn review-btn">Review Cards</button>
                <span class="coming-soon-label"> Edit -- Coming Soon</span>
                <button class="deck-action-btn quiz-btn">Take Quiz</button>
                 <button class="deck-action-btn delete-btn">Delete</button>
            </div>
          `;
          
            deckDiv.querySelector('.review-btn').addEventListener('click', function() {
                localStorage.setItem('tempDeck', JSON.stringify(deck));
                localStorage.setItem('reviewSource', 'home');
                window.location.href = 'Deck-Builder-Screen3Review.html';
            });
            
            deckDiv.querySelector('.quiz-btn').addEventListener('click', function() {
                localStorage.setItem('activeDeck', JSON.stringify(deck));
                window.location.href = 'Deck-Builder-Screen4Quiz.html';
            });
          
            deckDiv.querySelector('.delete-btn').addEventListener('click', function() {
                if (confirm(`Are you sure you want to delete the deck "${deck.name}"? This action cannot be undone.`)) {
                    const updatedDecks = savedDecks.filter(d => d.id !== deck.id);
                    localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
                    displayDecks();
                }
            })




          deckList.appendChild(deckDiv);
      });
      const createCard = document.createElement('div');
      createCard.className = 'deck-item create-deck-card';
         createCard.innerHTML = '<div class="create-deck-label">+ Create New Deck</div>';
      createCard.addEventListener('click', function() {
          window.location.href = 'Deck-BuilderSC2.html';
      });
      deckList.appendChild(createCard);
  }

  // =====================================================
  // SCREEN 2: Auto-add card rows 3/1/2026
  // =====================================================
  const cardContainer = document.getElementById('cards-container');
  let cardIDCounter = 1;

  function addNewCardRow() {
      cardIDCounter++;
      const newCardRow = document.createElement('div');
      newCardRow.className = 'card-row';
      newCardRow.setAttribute('data-card-id', cardIDCounter);
      newCardRow.innerHTML = `
          <input type="text" name="card-front" class="card-front" placeholder="Front" 
  data-card-id="${cardIDCounter}">
          <input type="text" name="card-back" class="card-back" placeholder="Back" 
  data-card-id="${cardIDCounter}">
          <button class="delete-card-btn" data-card-id="${cardIDCounter}">
              <img src="trash-icon.webp" alt="Delete">
          </button>
      `;
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

  if (cardContainer) {
      const firstCardRow = cardContainer.querySelector('.card-row');
      if (firstCardRow) {
          attachCardListeners(firstCardRow);
      } else {
          console.log("No .card-row found!");
      }
  }

  // ===============================================================
  // SCREEN 2 TO SCREEN 3 TRANSITION 3/11/26
  // ===============================================================

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
          cards: cards,
          createdAt: new Date().toISOString()
      };
  }

  function saveDeckToLocalStorage(deckData) {
      localStorage.setItem('tempDeck', JSON.stringify(deckData));
  }

  function loadDeckFromLocalStorage() {
      const tempDeckString = localStorage.getItem('tempDeck');
      if (!tempDeckString) {
          alert("No deck found! Redirecting back to deck builder...");
          window.location.href = 'Deck-BuilderSC2.html';
          return null;
      }
      return JSON.parse(tempDeckString);
  }

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
  // SCREEN 2: Finalize Deck button 3/11/26
  // =====================================================
  const createDeckBtnNew = document.getElementById('create-deck-btn');

  if (createDeckBtnNew && document.getElementById('cards-container')) {
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
  // SCREEN 3: Display and buttons
  // =====================================================
  if (document.getElementById('review-cards-container')) {
      displayDeckForReview();
  }

  const goBackBtn = document.getElementById('go-back-btn');
  if (goBackBtn) {
      goBackBtn.addEventListener('click', function() {
          const source = localStorage.getItem('reviewSource');
          if (source === 'home') {
              localStorage.removeItem('reviewSource');
              window.location.href = 'index.html';
          } else {
              window.location.href = 'Deck-BuilderSC2.html';
          }
      });
  }

  const saveDeckBtn = document.getElementById('save-deck-btn');
  if (saveDeckBtn) {
      saveDeckBtn.addEventListener('click', function() {
          const deckData = loadDeckFromLocalStorage();
          const savedDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
          deckData.id = Date.now();
          savedDecks.push(deckData);
          localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
          localStorage.removeItem('tempDeck');
          window.location.href = 'index.html';
      });
  }

  // =====================================================
  // SCREEN 3: Home-review mode — hide save buttons, show quiz button
  // =====================================================
  if (document.getElementById('review-cards-container')) {
      const source = localStorage.getItem('reviewSource');
      if (source === 'home') {
          const saveBtn = document.getElementById('save-deck-btn');
          const saveQuizBtn = document.getElementById('save-and-quiz-btn');
          const quizFromReviewBtn = document.getElementById('quiz-from-review-btn');
          if (saveBtn) saveBtn.style.display = 'none';
          if (saveQuizBtn) saveQuizBtn.style.display = 'none';
          if (quizFromReviewBtn) quizFromReviewBtn.style.display = 'block';
      }
  }

  const quizFromReviewBtn = document.getElementById('quiz-from-review-btn');
  if (quizFromReviewBtn) {
      quizFromReviewBtn.addEventListener('click', function() {
          const deckData = JSON.parse(localStorage.getItem('tempDeck'));
          localStorage.setItem('activeDeck', JSON.stringify(deckData));
          localStorage.removeItem('reviewSource');
          window.location.href = 'Deck-Builder-Screen4Quiz.html';
      });
  }

  // =====================================================
  // SCREEN 3: Save & Start Quiz button 6/1/26
  // =====================================================
  const saveAndQuizBtn = document.getElementById('save-and-quiz-btn');
  if (saveAndQuizBtn) {
      saveAndQuizBtn.addEventListener('click', function() {
          const deckData = loadDeckFromLocalStorage();
          const savedDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
          deckData.id = Date.now();
          savedDecks.push(deckData);
          localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
          localStorage.setItem('activeDeck', JSON.stringify(deckData));
          localStorage.removeItem('tempDeck');
          window.location.href = 'Deck-Builder-Screen4Quiz.html';
      });
  }

  // =====================================================
  // SCREEN 4: Quiz mode logic 5/31/26
  // =====================================================
  if (document.getElementById('quiz-question')) {
      const activeDeck = JSON.parse(localStorage.getItem('activeDeck'));

      if (!activeDeck) {
          alert("No deck selected. Going home.");
          window.location.href = 'index.html';
      } else {
          document.getElementById('quiz-deck-name').textContent = activeDeck.name;

          function shuffle(arr) {
              return arr.slice().sort(() => Math.random() - 0.5);
          }

          const cards = shuffle(activeDeck.cards);
          let currentCardIndex = 0;
          let score = 0;

          document.getElementById('total-cards').textContent = cards.length;

          function loadQuestion() {
              const card = cards[currentCardIndex];
              document.getElementById('current-card-num').textContent = currentCardIndex +
  1;
              document.getElementById('quiz-question').textContent = card.front;
              document.getElementById('quiz-feedback').style.display = 'none';
              document.getElementById('quiz-next-btn').style.display = 'none';

              const otherBacks = cards
                  .filter((_, i) => i !== currentCardIndex)
                  .map(c => c.back);
              const wrongAnswers = shuffle(otherBacks).slice(0, 3);
              const choices = shuffle([card.back, ...wrongAnswers]);

              const choicesBox = document.getElementById('quiz-choices');
              choicesBox.innerHTML = '';
              choices.forEach(function(choice) {
                  const btn = document.createElement('button');
                  btn.textContent = choice;
                  btn.addEventListener('click', function() {
                      handleAnswer(choice, card.back);
                  });
                  choicesBox.appendChild(btn);
              });
          }

          function handleAnswer(chosen, correct) {
              document.querySelectorAll('#quiz-choices button').forEach(btn => btn.disabled
  = true);
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
                  document.getElementById('quiz-question-box').style.display = 'none';
                  document.getElementById('quiz-choices').style.display = 'none';
                  document.getElementById('quiz-next-btn').style.display = 'none';
                  document.getElementById('quiz-progress').style.display = 'none';
                  const results = document.getElementById('quiz-results');
                  results.style.display = 'block';
                  document.getElementById('quiz-score-text').textContent =
                      'You got ' + score + ' out of ' + cards.length + ' correct!';
              }
          });

          document.getElementById('quiz-home-btn').addEventListener('click', function() {
              window.location.href = 'index.html';
          });

          loadQuestion();
      }
  }

  }); // End of DOMContentLoaded
