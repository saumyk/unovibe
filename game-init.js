
// ===========================
// UI EVENT LISTENERS & INITIALIZATION
// ===========================

// Wait for DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Menu buttons
    document.getElementById('create-room-btn').addEventListener('click', () => {
        document.getElementById('create-room-modal').classList.add('active');
    });

    document.getElementById('join-room-btn').addEventListener('click', () => {
        document.getElementById('join-room-modal').classList.add('active');
    });

    document.getElementById('rules-btn').addEventListener('click', () => {
        document.getElementById('rules-modal').classList.add('active');
    });

    // Modal close buttons
    document.getElementById('close-create-modal').addEventListener('click', () => {
        document.getElementById('create-room-modal').classList.remove('active');
    });

    document.getElementById('close-join-modal').addEventListener('click', () => {
        document.getElementById('join-room-modal').classList.remove('active');
    });

    document.getElementById('close-rules-modal').addEventListener('click', () => {
        document.getElementById('rules-modal').classList.remove('active');
    });

    // Create room
    document.getElementById('confirm-create-room').addEventListener('click', async () => {
        const roomName = document.getElementById('room-name').value.trim();
        const playerName = document.getElementById('player-name-create').value.trim();
        const password = document.getElementById('room-password').value;
        const maxPlayers = parseInt(document.getElementById('max-players').value);

        if (!roomName || !playerName) {
            alert('Please enter room name and your name');
            return;
        }

        // Use Firebase multiplayer if available
        if (window.firebaseMultiplayer) {
            const result = await window.firebaseMultiplayer.createRoom(roomName, playerName, maxPlayers, password);

            if (result.success) {
                gameState.roomId = result.roomId;
                gameState.roomName = roomName;
                gameState.playerName = playerName;
                gameState.isHost = true;

                document.getElementById('create-room-modal').classList.remove('active');
                showLobby();
            } else {
                alert('Error creating room: ' + result.error);
            }
        } else {
            // Fallback to local mode
            createRoom(roomName, playerName, password, maxPlayers);
        }
    });

    // Join room
    document.getElementById('confirm-join-room').addEventListener('click', async () => {
        const roomId = document.getElementById('join-room-id').value.trim();
        const playerName = document.getElementById('player-name-join').value.trim();
        const password = document.getElementById('join-room-password').value;

        if (!roomId || !playerName) {
            alert('Please enter room ID and your name');
            return;
        }

        // Use Firebase multiplayer if available
        if (window.firebaseMultiplayer) {
            const result = await window.firebaseMultiplayer.joinRoom(roomId, playerName, password);

            if (result.success) {
                gameState.roomId = roomId;
                gameState.playerName = playerName;
                gameState.isHost = false;

                document.getElementById('join-room-modal').classList.remove('active');
                showLobby();
            } else {
                alert('Error joining room: ' + result.error);
            }
        } else {
            alert('Firebase not initialized. Please check your connection.');
        }
    });

    // Lobby buttons
    document.getElementById('start-game-btn').addEventListener('click', async () => {
        if (gameState.isHost) {
            startGame();
        }
    });

    document.getElementById('leave-room-btn').addEventListener('click', async () => {
        if (window.firebaseMultiplayer) {
            await window.firebaseMultiplayer.leaveRoom();
        }
        location.reload();
    });

    // Copy buttons
    document.getElementById('copy-room-id').addEventListener('click', () => {
        const roomId = document.getElementById('lobby-room-id').textContent;
        navigator.clipboard.writeText(roomId);
        showMessage('Room ID copied!');
    });

    document.getElementById('copy-invite-link').addEventListener('click', () => {
        const link = document.getElementById('invite-link').value;
        navigator.clipboard.writeText(link);
        showMessage('Link copied!');
    });

    // UNO button
    document.getElementById('uno-button').addEventListener('click', () => {
        callUno();
    });

    // Deck click
    document.getElementById('deck').addEventListener('click', () => {
        if (isMyTurn()) {
            drawCard();
        }
    });
}

// Show lobby screen
function showLobby() {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('lobby-screen').classList.remove('hidden');

    // Update lobby info
    document.getElementById('lobby-room-id').textContent = gameState.roomId;
    document.getElementById('lobby-room-name').textContent = gameState.roomName;

    // Generate invite link
    const inviteLink = window.location.origin + window.location.pathname + '?room=' + gameState.roomId;
    document.getElementById('invite-link').value = inviteLink;

    // Show/hide start button based on host status
    const startBtn = document.getElementById('start-game-btn');
    if (gameState.isHost) {
        startBtn.style.display = 'block';
    } else {
        startBtn.style.display = 'none';
    }
}

// Update players list in lobby
window.updatePlayersList = function (players) {
    console.log('📋 updatePlayersList called with:', players);
    const playersList = document.getElementById('players-list');

    if (!playersList) {
        console.error('❌ players-list element not found!');
        return;
    }

    playersList.innerHTML = '';
    console.log('📋 Cleared players list, adding', players.length, 'players');

    players.forEach((player, index) => {
        console.log(`📋 Adding player ${index + 1}:`, player);
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';

        const initials = player.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        playerItem.innerHTML = `
            <div class="player-info">
                <div class="player-avatar">${initials}</div>
                <span class="player-name">${player.name}</span>
            </div>
            ${player.isHost ? '<span class="player-badge">HOST</span>' : ''}
        `;

        playersList.appendChild(playerItem);
        console.log(`✅ Player ${player.name} added to list`);
    });

    console.log('📋 updatePlayersList completed. Total players rendered:', players.length);
};

// Start game from Firebase
window.startGameFromFirebase = function () {
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    gameState.gameStarted = true;
    initializeGame();
};

console.log('🎮 UNO Game initialized with Firebase multiplayer support!');
