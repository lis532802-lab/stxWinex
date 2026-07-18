// STX WIN SECURE FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyC7BK93f9qqUuvJBaJrF7jSyU2A7pjE744",
    authDomain: "stxwin-6dcc1.firebaseapp.com",
    databaseURL: "https://stxwin-6dcc1-default-rtdb.firebaseio.com",
    projectId: "stxwin-6dcc1",
    storageBucket: "stxwin-6dcc1.firebasestorage.app",
    messagingSenderId: "442985758225",
    appId: "1:442985758225:web:b21b31133ba1779e78fbb0",
    measurementId: "G-Y0HT09VDTV"
};

// Initialize Connection
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global Interfaces
const auth = firebase.auth();
const rtdb = firebase.database();
