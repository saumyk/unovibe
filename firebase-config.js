// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get them from: https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "AIzaSyD5VP3anyw3MMtdLg5re_ani0_bDQecefg",
    authDomain: "vibeuno-e0800.firebaseapp.com",
    databaseURL: "https://vibeuno-e0800-default-rtdb.firebaseio.com",
    projectId: "vibeuno-e0800",
    storageBucket: "vibeuno-e0800.firebasestorage.app",
    messagingSenderId: "148791271990",
    appId: "1:148791271990:web:93486916d9ef7242efae97",
    measurementId: "G-NHZRBCKV50"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Export for use in game.js
window.gameDatabase = database;
