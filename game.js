// ===========================
// GAME STATE
// ===========================
let deck = [];           // All cards in the deck
let playerHand = [];     // Cards in player's hand
let currentCard = null;  // Card on top of discard pile
let currentColor = null; // Current active color

// ===========================
// CARD CREATION
// ===========================
// Create a full UNO deck
function createDeck() {
    const colors = ['red', 'yellow', 'green', 'blue'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const specials = ['Skip', 'Reverse', '+2'];
    const deck = [];
    
    // Add numbered cards (0 has 1 card per color, 1-9 have 2 cards per color)
    colors.forEach(color => {
        deck.push({ color, value: '0' });
        numbers.slice(1).forEach(number => {
            deck.push({ color, value: number });
            deck.push({ color, value: number });
        });
    });
    
    // Add special cards (2 per color)
    colors.forEach(color => {
        specials.forEach(special => {
            deck.push({ color, value: special });
            deck.push({ color, value: special });
        });
    });
    
    // Add wild cards (4 of each)
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', value: 'Wild' });
        deck.push({ color: 'wild', value: '+4' });
    }
    
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// ===========================
// GAME INITIALIZATION
// ===========================
function startGame() {
    // Hide start screen
    document.getElementById('start-screen').classList.add('hidden');
    
    // Create and shuffle deck
    deck = shuffleDeck(createDeck());
    
    // Deal 7 cards to player
    playerHand = [];
    for (let i = 0; i < 7; i++) {
        playerHand.push(deck.pop());
    }
    
    // Set first card (make sure it's not a wild card)
    do {
        currentCard = deck.pop();
    } while (currentCard.color === 'wild');
    
    currentColor = currentCard.color;
    
    // Update UI
    updateUI();
    showMessage('Game Started! Match color or number.');
}

// ===========================
// UI UPDATES
// ===========================
function updateUI() {
    // Update deck count
    document.getElementById('deck-count').textContent = deck.length;
    
    // Update hand count
    document.getElementById('hand-count').textContent = playerHand.length;
    
    // Update current card
    const currentCardElement = document.getElementById('current-card');
    currentCardElement.className = `card card-${currentColor}`;
    currentCardElement.textContent = currentCard.value;
    
    // Update player hand
    renderPlayerHand();
}

function renderPlayerHand() {
    const handElement = document.getElementById('player-hand');
    handElement.innerHTML = '';
    
    playerHand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card card-${card.color}`;
        cardElement.textContent = card.value;
        
        // Check if card is playable
        if (canPlayCard(card)) {
            cardElement.classList.add('playable');
            cardElement.onclick = () => playCard(index);
        }
        
        handElement.appendChild(cardElement);
    });
}

// ===========================
// GAME LOGIC
// ===========================
// Check if a card can be played
function canPlayCard(card) {
    // Wild cards can always be played
    if (card.color === 'wild') {
        return true;
    }
    
    // Match color or value
    return card.color === currentColor || card.value === currentCard.value;
}

// Play a card from hand
function playCard(index) {
    const card = playerHand[index];
    
    if (!canPlayCard(card)) {
        showMessage('Cannot play this card!');
        return;
    }
    
    // Remove card from hand
    playerHand.splice(index, 1);
    
    // Update current card
    currentCard = card;
    
    // Handle wild cards
    if (card.color === 'wild') {
        showColorPicker();
        return;
    }
    
    currentColor = card.color;
    
    // Handle special cards
    handleSpecialCard(card);
    
    // Check for win
    if (playerHand.length === 0) {
        showMessage('🎉 YOU WIN! 🎉');
        setTimeout(() => {
            document.getElementById('start-screen').classList.remove('hidden');
        }, 2000);
        return;
    }
    
    // Update UI
    updateUI();
}

// Handle special card effects
function handleSpecialCard(card) {
    if (card.value === '+2') {
        showMessage('Drew 2 cards!');
        drawCards(2);
    } else if (card.value === '+4') {
        showMessage('Drew 4 cards!');
        drawCards(4);
    } else if (card.value === 'Skip') {
        showMessage('Turn skipped!');
    } else if (card.value === 'Reverse') {
        showMessage('Direction reversed!');
    }
}

// Draw cards from deck
function drawCards(count) {
    for (let i = 0; i < count; i++) {
        if (deck.length === 0) {
            showMessage('Deck is empty!');
            return;
        }
        playerHand.push(deck.pop());
    }
}

// Draw a card when clicking the deck
function drawCard() {
    if (deck.length === 0) {
        showMessage('Deck is empty!');
        return;
    }
    
    const card = deck.pop();
    playerHand.push(card);
    
    showMessage('Drew a card!');
    updateUI();
}

// ===========================
// COLOR PICKER
// ===========================
function showColorPicker() {
    const modal = document.getElementById('color-picker');
    modal.classList.add('active');
    
    // Add click handlers to color buttons
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.onclick = () => selectColor(btn.dataset.color);
    });
}

function selectColor(color) {
    currentColor = color;
    
    // Hide modal
    document.getElementById('color-picker').classList.remove('active');
    
    // Handle +4 effect
    if (currentCard.value === '+4') {
        showMessage('Drew 4 cards!');
        drawCards(4);
    }
    
    // Check for win
    if (playerHand.length === 0) {
        showMessage('🎉 YOU WIN! 🎉');
        setTimeout(() => {
            document.getElementById('start-screen').classList.remove('hidden');
        }, 2000);
        return;
    }
    
    // Update UI
    updateUI();
}

// ===========================
// MESSAGES
// ===========================
function showMessage(text) {
    const messageElement = document.getElementById('game-message');
    messageElement.textContent = text;
    messageElement.classList.add('active');
    
    setTimeout(() => {
        messageElement.classList.remove('active');
    }, 2000);
}

// ===========================
// EVENT LISTENERS
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Start button
    document.getElementById('start-btn').onclick = startGame;
    
    // Deck click to draw card
    document.getElementById('deck').onclick = drawCard;
});
