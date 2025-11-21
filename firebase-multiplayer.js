// Firebase Multiplayer Integration for UNO Game
// This file handles all real-time multiplayer functionality

class FirebaseMultiplayer {
    constructor() {
        this.database = window.gameDatabase;
        this.currentRoom = null;
        this.playerId = null;
        this.playerName = null;
        this.listeners = {};
    }

    // Generate unique player ID
    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Create a new room
    async createRoom(roomName, playerName, maxPlayers, password = '') {
        const roomId = Math.floor(100000 + Math.random() * 900000).toString();
        this.playerId = this.generatePlayerId();
        this.playerName = playerName;
        this.currentRoom = roomId;

        const roomData = {
            roomId: roomId,
            roomName: roomName,
            hostId: this.playerId,
            maxPlayers: maxPlayers,
            password: password,
            status: 'waiting', // waiting, playing, finished
            createdAt: Date.now(),
            players: {
                [this.playerId]: {
                    id: this.playerId,
                    name: playerName,
                    isHost: true,
                    hand: [],
                    cardCount: 0,
                    joinedAt: Date.now()
                }
            },
            gameState: null
        };

        try {
            await this.database.ref(`rooms/${roomId}`).set(roomData);
            this.listenToRoom(roomId);
            return { success: true, roomId: roomId };
        } catch (error) {
            console.error('Error creating room:', error);
            return { success: false, error: error.message };
        }
    }

    // Join an existing room
    async joinRoom(roomId, playerName, password = '') {
        this.playerId = this.generatePlayerId();
        this.playerName = playerName;
        this.currentRoom = roomId;

        try {
            const roomSnapshot = await this.database.ref(`rooms/${roomId}`).once('value');
            const roomData = roomSnapshot.val();

            if (!roomData) {
                return { success: false, error: 'Room not found' };
            }

            if (roomData.password && roomData.password !== password) {
                return { success: false, error: 'Incorrect password' };
            }

            const playerCount = Object.keys(roomData.players || {}).length;
            if (playerCount >= roomData.maxPlayers) {
                return { success: false, error: 'Room is full' };
            }

            if (roomData.status !== 'waiting') {
                return { success: false, error: 'Game already started' };
            }

            // Add player to room
            await this.database.ref(`rooms/${roomId}/players/${this.playerId}`).set({
                id: this.playerId,
                name: playerName,
                isHost: false,
                hand: [],
                cardCount: 0,
                joinedAt: Date.now()
            });

            this.listenToRoom(roomId);
            return { success: true, roomId: roomId };
        } catch (error) {
            console.error('Error joining room:', error);
            return { success: false, error: error.message };
        }
    }

    // Listen to room changes
    listenToRoom(roomId) {
        const roomRef = this.database.ref(`rooms/${roomId}`);

        // Listen for player changes
        this.listeners.players = roomRef.child('players').on('value', (snapshot) => {
            const players = snapshot.val();
            console.log('🔍 Players data received from Firebase:', players);
            console.log('🔍 Number of players:', players ? Object.keys(players).length : 0);

            if (players && window.updatePlayersList) {
                const playersArray = Object.values(players);
                console.log('🔍 Calling updatePlayersList with:', playersArray);
                window.updatePlayersList(playersArray);
            } else {
                console.warn('⚠️  No players data or updatePlayersList function not found');
            }
        });

        // Listen for game state changes
        this.listeners.gameState = roomRef.child('gameState').on('value', (snapshot) => {
            const gameState = snapshot.val();
            if (gameState && window.updateGameState) {
                window.updateGameState(gameState);
            }
        });

        // Listen for room status
        this.listeners.status = roomRef.child('status').on('value', (snapshot) => {
            const status = snapshot.val();
            if (status === 'playing' && window.startGameFromFirebase) {
                window.startGameFromFirebase();
            }
        });
    }

    // Start the game
    async startGame(initialGameState) {
        if (!this.currentRoom) return;

        try {
            await this.database.ref(`rooms/${this.currentRoom}`).update({
                status: 'playing',
                gameState: initialGameState,
                startedAt: Date.now()
            });
            return { success: true };
        } catch (error) {
            console.error('Error starting game:', error);
            return { success: false, error: error.message };
        }
    }

    // Update game state
    async updateGameState(gameState) {
        if (!this.currentRoom) return;

        try {
            await this.database.ref(`rooms/${this.currentRoom}/gameState`).set(gameState);
            return { success: true };
        } catch (error) {
            console.error('Error updating game state:', error);
            return { success: false, error: error.message };
        }
    }

    // Update player hand
    async updatePlayerHand(hand) {
        if (!this.currentRoom || !this.playerId) return;

        try {
            await this.database.ref(`rooms/${this.currentRoom}/players/${this.playerId}`).update({
                hand: hand,
                cardCount: hand.length
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating player hand:', error);
            return { success: false, error: error.message };
        }
    }

    // Leave room
    async leaveRoom() {
        if (!this.currentRoom || !this.playerId) return;

        try {
            // Remove player from room
            await this.database.ref(`rooms/${this.currentRoom}/players/${this.playerId}`).remove();

            // Check if room is empty
            const roomSnapshot = await this.database.ref(`rooms/${this.currentRoom}/players`).once('value');
            const players = roomSnapshot.val();

            if (!players || Object.keys(players).length === 0) {
                // Delete empty room
                await this.database.ref(`rooms/${this.currentRoom}`).remove();
            }

            // Remove listeners
            this.removeListeners();

            this.currentRoom = null;
            this.playerId = null;
            this.playerName = null;

            return { success: true };
        } catch (error) {
            console.error('Error leaving room:', error);
            return { success: false, error: error.message };
        }
    }

    // Remove all listeners
    removeListeners() {
        if (this.currentRoom) {
            const roomRef = this.database.ref(`rooms/${this.currentRoom}`);

            if (this.listeners.players) {
                roomRef.child('players').off('value', this.listeners.players);
            }
            if (this.listeners.gameState) {
                roomRef.child('gameState').off('value', this.listeners.gameState);
            }
            if (this.listeners.status) {
                roomRef.child('status').off('value', this.listeners.status);
            }
        }
        this.listeners = {};
    }

    // Get current room data
    async getRoomData() {
        if (!this.currentRoom) return null;

        try {
            const snapshot = await this.database.ref(`rooms/${this.currentRoom}`).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting room data:', error);
            return null;
        }
    }

    // Check if current player is host
    isHost() {
        return this.playerId && this.currentRoom;
    }

    // Get player info
    getPlayerInfo() {
        return {
            id: this.playerId,
            name: this.playerName,
            roomId: this.currentRoom
        };
    }
}

// Initialize Firebase Multiplayer
window.firebaseMultiplayer = new FirebaseMultiplayer();
