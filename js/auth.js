// Dom References
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotForm = document.getElementById('forgot-form');

// State switching
document.getElementById('to-signup').addEventListener('click', () => switchAuthCard('signup-card'));
document.getElementById('to-login').addEventListener('click', () => switchAuthCard('login-card'));
document.getElementById('back-to-login').addEventListener('click', () => switchAuthCard('login-card'));
document.getElementById('forgot-pass-trigger').addEventListener('click', () => switchAuthCard('forgot-card'));

function switchAuthCard(id) {
    document.querySelectorAll('.auth-card').forEach(card => card.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// Authentication Forms
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        
        auth.signInWithEmailAndPassword(email, pass)
            .then(() => showNotification("Authentication accepted!", "success"))
            .catch(err => showNotification(err.message, "error"));
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        
        auth.createUserWithEmailAndPassword(email, pass)
            .then(res => {
                showNotification("Node creation successful!", "success");
            })
            .catch(err => showNotification(err.message, "error"));
    });
}

if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        auth.sendPasswordResetEmail(email)
            .then(() => {
                showNotification("Password reset email sent!", "info");
                switchAuthCard('login-card');
            })
            .catch(err => showNotification(err.message, "error"));
    });
}

// Social Login Integration
const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(() => showNotification("Google authentication authorized!", "success"))
            .catch(err => showNotification(err.message, "error"));
    });
}

// System Shutdown Trigger
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut()
        .then(() => showNotification("Node closed safely.", "info"))
        .catch(err => showNotification(err.message, "error"));
});
