// ⚠️ PENTING: Ganti konfigurasi ini dengan Firebase project Anda sendiri!
// Cara setup: Baca file FIREBASE-SETUP.md

// TEMPLATE - Ganti dengan config dari Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, database;

try {
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log('✅ Firebase initialized successfully');
    } else {
        console.error('❌ Firebase SDK not loaded');
        alert('Error: Firebase SDK tidak terload. Pastikan koneksi internet aktif.');
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error);

    // Check if config is still using template values
    if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
        alert('⚠️ PENTING: Anda belum setup Firebase!\n\nBaca file FIREBASE-SETUP.md untuk cara setup.\n\nUntuk testing tanpa Firebase, gunakan Mode Standalone di index-standalone.html');
    } else {
        alert('Error Firebase: ' + error.message);
    }
}

// Utility Functions
const db = {
    // Reference to a path
    ref: (path) => {
        return database.ref(path);
    },

    // Set data
    set: (path, data) => {
        return database.ref(path).set(data);
    },

    // Update data
    update: (path, data) => {
        return database.ref(path).update(data);
    },

    // Push data (generate unique key)
    push: (path, data) => {
        return database.ref(path).push(data);
    },

    // Remove data
    remove: (path) => {
        return database.ref(path).remove();
    },

    // Listen to value changes
    on: (path, callback) => {
        return database.ref(path).on('value', (snapshot) => {
            callback(snapshot.val());
        });
    },

    // Listen once
    once: (path) => {
        return database.ref(path).once('value').then(snapshot => snapshot.val());
    },

    // Stop listening
    off: (path) => {
        return database.ref(path).off();
    },

    // Server timestamp
    serverTimestamp: () => {
        return firebase.database.ServerValue.TIMESTAMP;
    }
};

// Generate random 6-digit PIN
function generatePIN() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate unique player ID
function generatePlayerID() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Play sound effects (if enabled)
let soundEnabled = true;

function playSound(type) {
    if (!soundEnabled) return;

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch(type) {
            case 'buzzer':
                oscillator.frequency.value = 800;
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                break;

            case 'correct':
                oscillator.frequency.value = 523.25;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;

            case 'wrong':
                oscillator.frequency.value = 200;
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
                break;

            case 'join':
                oscillator.frequency.value = 400;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
        }
    } catch (error) {
        console.log('Audio not supported:', error);
    }
}

// Toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundBtn');
    if (btn) {
        btn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
    }
    return soundEnabled;
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Check Firebase connection
function checkFirebaseConnection() {
    return new Promise((resolve, reject) => {
        const connectedRef = database.ref('.info/connected');
        connectedRef.once('value', (snapshot) => {
            if (snapshot.val() === true) {
                resolve(true);
            } else {
                reject(new Error('Not connected to Firebase'));
            }
        });
    });
}
