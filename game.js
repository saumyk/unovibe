// ===========================
// GAME STATE & CONFIGURATION
// ===========================
const gameState = {
    // Room info
    roomId: null,
    roomName: null,
    roomPassword: null,
    maxPlayers: 4,

    // Player info
    playerId: null,
    playerName: null,
    isHost: false,

    // Game data
    players: [],
    deck: [],
    discardPile: [],
    currentCard: null,
    currentColor: null,
    currentPlayerIndex: 0,
    direction: 1, // 1 = clockwise, -1 = counterclockwise

    // Game state
    gameStarted: false,
    playerHand: [],
    drawnCard: null,
    hasCalledUno: false,
    canCallUno: false,

    // Special rules
    stackCount: 0, // For stacking +2 and +4
    canChallenge: false,
    sevenZeroRule: true,
    jumpInRule: true
};

// ===========================
// UTILITY FUNCTIONS
// ===========================
function generateRoomId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}

function getPlayerInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Copied to clipboard!');
    }).catch(() => {
        showMessage('Failed to copy');
    });
}

// ===========================
// DECK CREATION
// ===========================
function createDeck() {
    const colors = ['red', 'yellow', 'green', 'blue'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const specials = ['Skip', 'Reverse', '+2'];
    const deck = [];

    // Number cards
    colors.forEach(color => {
        // One 0 per color
        deck.push({ color, value: '0', type: 'number' });
        // Two of each 1-9 per color
        numbers.slice(1).forEach(number => {
            deck.push({ color, value: number, type: 'number' });
            deck.push({ color, value: number, type: 'number' });
        });
    });

    // Special cards (2 per color)
    colors.forEach(color => {
        specials.forEach(special => {
            deck.push({ color, value: special, type: 'special' });
            deck.push({ color, value: special, type: 'special' });
        });
    });

    // Wild cards (4 of each)
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', value: 'Wild', type: 'wild' });
        deck.push({ color: 'wild', value: '+4', type: 'wild' });
    }

    return deck;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===========================
// MENU & MODAL HANDLERS
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeMenuHandlers();
    initializeModalHandlers();
    initializeLobbyHandlers();
    initializeGameHandlers();
});

function initializeMenuHandlers() {
    document.getElementById('create-room-btn').onclick = () => {
        document.getElementById('create-room-modal').classList.add('active');
    };

    document.getElementById('join-room-btn').onclick = () => {
        document.getElementById('join-room-modal').classList.add('active');
    };

    document.getElementById('rules-btn').onclick = () => {
        document.getElementById('rules-modal').classList.add('active');
    };
}

function initializeModalHandlers() {
    // Close buttons
    document.getElementById('close-create-modal').onclick = () => {
        document.getElementById('create-room-modal').classList.remove('active');
    };

    document.getElementById('close-join-modal').onclick = () => {
        document.getElementById('join-room-modal').classList.remove('active');
    };

    document.getElementById('close-rules-modal').onclick = () => {
        document.getElementById('rules-modal').classList.remove('active');
    };

    // Create room
    document.getElementById('confirm-create-room').onclick = createRoom;

    // Join room
    document.getElementById('confirm-join-room').onclick = joinRoom;

    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        };
    });
}

function initializeLobbyHandlers() {
    document.getElementById('copy-room-id').onclick = () => {
        copyToClipboard(gameState.roomId);
    };

    document.getElementById('copy-invite-link').onclick = () => {
        const link = document.getElementById('invite-link').value;
        copyToClipboard(link);
    };

    document.getElementById('start-game-btn').onclick = startGame;

    document.getElementById('leave-room-btn').onclick = leaveRoom;
}

function initializeGameHandlers() {
    document.getElementById('deck').onclick = drawCard;
    document.getElementById('uno-button').onclick = callUno;
}

// ===========================
// ROOM MANAGEMENT
// ===========================
function createRoom() {
    const roomName = document.getElementById('room-name').value.trim();
    const playerName = document.getElementById('player-name-create').value.trim();
    const password = document.getElementById('room-password').value;
    const maxPlayers = parseInt(document.getElementById('max-players').value);

    if (!roomName) {
        showMessage('Please enter a room name');
        return;
    }

    if (!playerName) {
        showMessage('Please enter your name');
        return;
    }

    // Generate room ID
    gameState.roomId = generateRoomId();
    gameState.roomName = roomName;
    gameState.roomPassword = password;
    gameState.maxPlayers = maxPlayers;
    gameState.playerId = generatePlayerId();
    gameState.playerName = playerName;
    gameState.isHost = true;

    // Add host as first player
    gameState.players = [{
        id: gameState.playerId,
        name: playerName,
        isHost: true,
        hand: [],
        cardCount: 0
    }];

    // Close modal and show lobby
    document.getElementById('create-room-modal').classList.remove('active');
    showLobby();

    showMessage('Room created successfully!');
}

function joinRoom() {
    const roomId = document.getElementById('join-room-id').value.trim();
    const playerName = document.getElementById('player-name-join').value.trim();
    const password = document.getElementById('join-room-password').value;

    if (!roomId || roomId.length !== 6) {
        showMessage('Please enter a valid 6-digit room ID');
        return;
    }

    if (!playerName) {
        showMessage('Please enter your name');
        return;
    }

    // Simulate joining (in real app, this would be a server call)
    gameState.roomId = roomId;
    gameState.playerId = generatePlayerId();
    gameState.playerName = playerName;
    gameState.isHost = false;

    // Simulate existing players
    gameState.players = [
        { id: 'host_123', name: 'Host Player', isHost: true, hand: [], cardCount: 0 },
        { id: gameState.playerId, name: playerName, isHost: false, hand: [], cardCount: 0 }
    ];

    // Close modal and show lobby
    document.getElementById('join-room-modal').classList.remove('active');
    showLobby();

    showMessage('Joined room successfully!');
}

function showLobby() {
    // Hide menu
    document.getElementById('menu-screen').classList.add('hidden');

    // Show lobby
    document.getElementById('lobby-screen').classList.remove('hidden');

    // Update lobby info
    document.getElementById('lobby-room-id').textContent = gameState.roomId;
    document.getElementById('lobby-room-name').textContent = gameState.roomName || 'Game Room';

    // Generate invite link
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${gameState.roomId}`;
    document.getElementById('invite-link').value = inviteLink;

    // Update players list
    updatePlayersList();

    // Show/hide start button based on host status
    const startBtn = document.getElementById('start-game-btn');
    if (gameState.isHost) {
        startBtn.style.display = 'block';
    } else {
        startBtn.style.display = 'none';
    }
}

function updatePlayersList() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';

    gameState.players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';

        const playerInfo = document.createElement('div');
        playerInfo.className = 'player-info';

        const avatar = document.createElement('div');
        avatar.className = 'player-avatar';
        avatar.textContent = getPlayerInitials(player.name);

        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = player.name;

        playerInfo.appendChild(avatar);
        playerInfo.appendChild(name);

        if (player.isHost) {
            const badge = document.createElement('div');
            badge.className = 'player-badge';
            badge.textContent = 'HOST';
            playerItem.appendChild(playerInfo);
            playerItem.appendChild(badge);
        } else {
            playerItem.appendChild(playerInfo);
        }

        playersList.appendChild(playerItem);
    });
}

function leaveRoom() {
    // Reset game state
    gameState.roomId = null;
    gameState.players = [];
    gameState.isHost = false;

    // Hide lobby and show menu
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');

    showMessage('Left the room');
}

// ===========================
// GAME INITIALIZATION
// ===========================
function startGame() {
    if (gameState.players.length < 2) {
        showMessage('Need at least 2 players to start!');
        return;
    }

    // Initialize game
    gameState.deck = shuffleDeck(createDeck());
    gameState.discardPile = [];
    gameState.direction = 1;
    gameState.currentPlayerIndex = 0;
    gameState.stackCount = 0;
    gameState.gameStarted = true;

    // Deal cards to all players
    gameState.players.forEach(player => {
        player.hand = [];
        for (let i = 0; i < 7; i++) {
            player.hand.push(gameState.deck.pop());
        }
        player.cardCount = 7;
    });

    // Set player hand
    const currentPlayer = gameState.players.find(p => p.id === gameState.playerId);
    gameState.playerHand = currentPlayer.hand;

    // Draw first card (not a wild card)
    do {
        gameState.currentCard = gameState.deck.pop();
    } while (gameState.currentCard.color === 'wild');

    gameState.currentColor = gameState.currentCard.color;
    gameState.discardPile.push(gameState.currentCard);

    // Hide lobby and show game
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    // Update UI
    updateGameUI();

    showMessage('Game Started!');
}

// ===========================
// GAME UI UPDATES
// ===========================
function updateGameUI() {
    // Update room ID
    document.getElementById('game-room-id').textContent = gameState.roomId;

    // Update deck count
    document.getElementById('deck-count').textContent = gameState.deck.length;

    // Update hand count
    document.getElementById('hand-count').textContent = gameState.playerHand.length;

    // Update current card
    updateCurrentCard();

    // Update current turn
    updateTurnIndicator();

    // Update other players
    updateOtherPlayers();

    // Update player hand
    renderPlayerHand();

    // Update direction indicator
    updateDirectionIndicator();

    // Update UNO button
    updateUnoButton();
}

function updateCurrentCard() {
    const cardElement = document.getElementById('current-card');
    cardElement.className = `card-3d card-${gameState.currentColor}`;
    cardElement.textContent = gameState.currentCard.value;
    cardElement.setAttribute('data-value', gameState.currentCard.value);

    // Update color indicator
    const colorIndicator = document.getElementById('current-color-indicator');
    colorIndicator.className = `current-color-indicator card-${gameState.currentColor}`;
}

function updateTurnIndicator() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('current-turn-player').textContent = currentPlayer.name;
}

function updateOtherPlayers() {
    const otherPlayersContainer = document.getElementById('other-players');
    otherPlayersContainer.innerHTML = '';

    gameState.players.forEach((player, index) => {
        if (player.id !== gameState.playerId) {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'other-player';

            if (index === gameState.currentPlayerIndex) {
                playerDiv.classList.add('active-turn');
            }

            const nameDiv = document.createElement('div');
            nameDiv.className = 'other-player-name';
            nameDiv.textContent = player.name;

            const cardsDiv = document.createElement('div');
            cardsDiv.className = 'other-player-cards';
            cardsDiv.textContent = `${player.cardCount} cards`;

            const handDiv = document.createElement('div');
            handDiv.className = 'other-player-hand';

            for (let i = 0; i < Math.min(player.cardCount, 7); i++) {
                const miniCard = document.createElement('div');
                miniCard.className = 'mini-card';
                handDiv.appendChild(miniCard);
            }

            playerDiv.appendChild(nameDiv);
            playerDiv.appendChild(cardsDiv);
            playerDiv.appendChild(handDiv);

            otherPlayersContainer.appendChild(playerDiv);
        }
    });
}

function updateDirectionIndicator() {
    const indicator = document.getElementById('direction-indicator');
    if (gameState.direction === -1) {
        indicator.classList.add('reversed');
    } else {
        indicator.classList.remove('reversed');
    }
}

function updateUnoButton() {
    const unoButton = document.getElementById('uno-button');

    if (gameState.playerHand.length === 2) {
        gameState.canCallUno = true;
        unoButton.classList.add('pulse');
    } else if (gameState.playerHand.length === 1) {
        if (!gameState.hasCalledUno) {
            unoButton.classList.add('pulse');
        }
    } else {
        gameState.canCallUno = false;
        gameState.hasCalledUno = false;
        unoButton.classList.remove('pulse');
    }
}

function renderPlayerHand() {
    const handElement = document.getElementById('player-hand');
    handElement.innerHTML = '';

    gameState.playerHand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card-3d card-${card.color}`;
        cardElement.textContent = card.value;
        cardElement.setAttribute('data-value', card.value);

        // Check if card is playable
        if (isMyTurn() && canPlayCard(card)) {
            cardElement.classList.add('playable');
            cardElement.onclick = () => playCard(index);
        }

        handElement.appendChild(cardElement);
    });
}

// ===========================
// GAME LOGIC
// ===========================
function isMyTurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    return currentPlayer.id === gameState.playerId;
}

function canPlayCard(card) {
    // Wild cards can always be played
    if (card.color === 'wild') {
        return true;
    }

    // Check for stacking +2 cards
    if (gameState.stackCount > 0 && gameState.currentCard.value === '+2') {
        return card.value === '+2';
    }

    // Check for stacking +4 cards
    if (gameState.stackCount > 0 && gameState.currentCard.value === '+4') {
        return card.value === '+4';
    }

    // Match color or value
    return card.color === gameState.currentColor || card.value === gameState.currentCard.value;
}

function playCard(index) {
    if (!isMyTurn()) {
        showMessage("It's not your turn!");
        return;
    }

    const card = gameState.playerHand[index];

    if (!canPlayCard(card)) {
        showMessage('Cannot play this card!');
        return;
    }

    // Remove card from hand
    gameState.playerHand.splice(index, 1);

    // Update current card
    gameState.currentCard = card;
    gameState.discardPile.push(card);

    // Handle wild cards
    if (card.color === 'wild') {
        showColorPicker();
        return;
    }

    gameState.currentColor = card.color;

    // Handle special cards
    handleSpecialCard(card);

    // Check for win
    if (gameState.playerHand.length === 0) {
        handleWin();
        return;
    }

    // Check UNO penalty
    if (gameState.playerHand.length === 1 && !gameState.hasCalledUno) {
        setTimeout(() => {
            if (!gameState.hasCalledUno) {
                showMessage('You forgot to call UNO! Draw 2 penalty cards!');
                drawCards(2);
                updateGameUI();
            }
        }, 3000);
    }

    // Move to next player
    nextTurn();

    // Update UI
    updateGameUI();
}

function handleSpecialCard(card) {
    switch (card.value) {
        case 'Skip':
            showMessage(`${gameState.players[getNextPlayerIndex()].name} was skipped!`);
            nextTurn(); // Skip the next player
            break;

        case 'Reverse':
            gameState.direction *= -1;
            showMessage('Direction reversed!');
            if (gameState.players.length === 2) {
                // In 2-player game, reverse acts like skip
                nextTurn();
            }
            break;

        case '+2':
            gameState.stackCount += 2;
            showMessage(`Next player must draw ${gameState.stackCount} cards or stack!`);
            break;

        case '7':
            if (gameState.sevenZeroRule) {
                // Allow swapping hands
                showMessage('7 played! You can swap hands with another player!');
            }
            break;

        case '0':
            if (gameState.sevenZeroRule) {
                // Rotate all hands
                showMessage('0 played! All hands rotate!');
                rotateHands();
            }
            break;
    }
}

function rotateHands() {
    if (gameState.direction === 1) {
        const lastHand = gameState.players[gameState.players.length - 1].hand;
        for (let i = gameState.players.length - 1; i > 0; i--) {
            gameState.players[i].hand = gameState.players[i - 1].hand;
            gameState.players[i].cardCount = gameState.players[i].hand.length;
        }
        gameState.players[0].hand = lastHand;
        gameState.players[0].cardCount = lastHand.length;
    } else {
        const firstHand = gameState.players[0].hand;
        for (let i = 0; i < gameState.players.length - 1; i++) {
            gameState.players[i].hand = gameState.players[i + 1].hand;
            gameState.players[i].cardCount = gameState.players[i].hand.length;
        }
        gameState.players[gameState.players.length - 1].hand = firstHand;
        gameState.players[gameState.players.length - 1].cardCount = firstHand.length;
    }

    // Update player hand
    const currentPlayer = gameState.players.find(p => p.id === gameState.playerId);
    gameState.playerHand = currentPlayer.hand;
}

function getNextPlayerIndex() {
    let nextIndex = gameState.currentPlayerIndex + gameState.direction;

    if (nextIndex >= gameState.players.length) {
        nextIndex = 0;
    } else if (nextIndex < 0) {
        nextIndex = gameState.players.length - 1;
    }

    return nextIndex;
}

function nextTurn() {
    gameState.currentPlayerIndex = getNextPlayerIndex();

    // Simulate AI turns for other players
    if (!isMyTurn()) {
        setTimeout(() => {
            simulateAITurn();
        }, 1500);
    }
}

function simulateAITurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Check if AI needs to draw due to +2 or +4
    if (gameState.stackCount > 0) {
        const canStack = currentPlayer.hand.some(card =>
            card.value === gameState.currentCard.value &&
            (card.value === '+2' || card.value === '+4')
        );

        if (!canStack) {
            // Draw cards
            for (let i = 0; i < gameState.stackCount; i++) {
                if (gameState.deck.length > 0) {
                    currentPlayer.hand.push(gameState.deck.pop());
                }
            }
            currentPlayer.cardCount = currentPlayer.hand.length;
            showMessage(`${currentPlayer.name} drew ${gameState.stackCount} cards!`);
            gameState.stackCount = 0;
            nextTurn();
            updateGameUI();
            return;
        }
    }

    // Find playable cards
    const playableCards = currentPlayer.hand.filter(card => canPlayCard(card));

    if (playableCards.length > 0) {
        // Play a random playable card
        const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
        const cardIndex = currentPlayer.hand.indexOf(cardToPlay);

        currentPlayer.hand.splice(cardIndex, 1);
        currentPlayer.cardCount = currentPlayer.hand.length;

        gameState.currentCard = cardToPlay;
        gameState.discardPile.push(cardToPlay);

        if (cardToPlay.color === 'wild') {
            // AI chooses random color
            const colors = ['red', 'yellow', 'green', 'blue'];
            gameState.currentColor = colors[Math.floor(Math.random() * colors.length)];
        } else {
            gameState.currentColor = cardToPlay.color;
        }

        showMessage(`${currentPlayer.name} played ${cardToPlay.value}`);

        handleSpecialCard(cardToPlay);

        // Check for AI win
        if (currentPlayer.cardCount === 0) {
            showMessage(`${currentPlayer.name} wins!`);
            setTimeout(() => {
                returnToLobby();
            }, 3000);
            return;
        }

        nextTurn();
    } else {
        // AI draws a card
        if (gameState.deck.length > 0) {
            currentPlayer.hand.push(gameState.deck.pop());
            currentPlayer.cardCount = currentPlayer.hand.length;
            showMessage(`${currentPlayer.name} drew a card`);
        }
        nextTurn();
    }

    updateGameUI();
}

function drawCard() {
    if (!isMyTurn()) {
        showMessage("It's not your turn!");
        return;
    }

    if (gameState.deck.length === 0) {
        showMessage('Deck is empty!');
        return;
    }

    // Check if player must draw due to +2 or +4
    if (gameState.stackCount > 0) {
        drawCards(gameState.stackCount);
        gameState.stackCount = 0;
        showMessage(`Drew ${gameState.stackCount} cards!`);
        nextTurn();
        updateGameUI();
        return;
    }

    const card = gameState.deck.pop();
    gameState.playerHand.push(card);
    gameState.drawnCard = card;

    showMessage('Drew a card!');

    // Check if drawn card can be played
    if (canPlayCard(card)) {
        showMessage('You can play the drawn card!');
        // Highlight the card
        setTimeout(() => {
            updateGameUI();
        }, 500);
    } else {
        nextTurn();
        updateGameUI();
    }
}

function drawCards(count) {
    for (let i = 0; i < count; i++) {
        if (gameState.deck.length > 0) {
            gameState.playerHand.push(gameState.deck.pop());
        } else {
            // Reshuffle discard pile if deck is empty
            if (gameState.discardPile.length > 1) {
                const topCard = gameState.discardPile.pop();
                gameState.deck = shuffleDeck(gameState.discardPile);
                gameState.discardPile = [topCard];
                gameState.playerHand.push(gameState.deck.pop());
            }
        }
    }
}

function callUno() {
    if (gameState.playerHand.length <= 2 && gameState.playerHand.length > 0) {
        gameState.hasCalledUno = true;
        showMessage('UNO! 🎉');
        document.getElementById('uno-button').classList.remove('pulse');
    } else {
        showMessage('You can only call UNO with 1 or 2 cards!');
    }
}

function handleWin() {
    showMessage('🎉 YOU WIN! 🎉');
    gameState.gameStarted = false;

    setTimeout(() => {
        returnToLobby();
    }, 3000);
}

function returnToLobby() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('lobby-screen').classList.remove('hidden');

    // Reset game state but keep room info
    gameState.gameStarted = false;
    gameState.deck = [];
    gameState.playerHand = [];
    gameState.currentCard = null;

    updatePlayersList();
}

// ===========================
// COLOR PICKER
// ===========================
function showColorPicker() {
    const modal = document.getElementById('color-picker');
    modal.classList.add('active');

    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.onclick = () => selectColor(btn.dataset.color);
    });
}

function selectColor(color) {
    gameState.currentColor = color;

    document.getElementById('color-picker').classList.remove('active');

    // Handle +4 effect
    if (gameState.currentCard.value === '+4') {
        gameState.stackCount += 4;
        showMessage(`Color changed to ${color}! Next player must draw ${gameState.stackCount} cards!`);
    } else {
        showMessage(`Color changed to ${color}!`);
    }

    // Check for win
    if (gameState.playerHand.length === 0) {
        handleWin();
        return;
    }

    nextTurn();
    updateGameUI();
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
    }, 2500);
}

// ===========================
// URL PARAMETER HANDLING
// ===========================
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');

    if (roomId) {
        // Auto-open join modal with room ID
        document.getElementById('join-room-id').value = roomId;
        document.getElementById('join-room-modal').classList.add('active');
    }
});
