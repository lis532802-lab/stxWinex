let currentUser = null;
let currentTab = 'home';

// Initial state load
document.addEventListener('DOMContentLoaded', () => {
    initAppRouting();
    initAuthObserver();
    initSimulatedLeaderboard();
});

// App Router / Navigation
function initAppRouting() {
    const navItems = document.querySelectorAll('.nav-item, .mob-item, .wallet-badge');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            if (tab) switchTab(tab);
        });
    });
}

function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.remove('active');
    });
    document.querySelectorAll('.nav-item, .mob-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.add('active');
}

// Authentication Watcher
function initAuthObserver() {
    auth.onAuthStateChanged(user => {
        const loadingScreen = document.getElementById('loading-screen');
        const authContainer = document.getElementById('auth-container');
        const appShell = document.getElementById('app-shell');

        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.classList.add('hidden'), 500);
            }, 1000);
        }

        if (user) {
            currentUser = user;
            if (authContainer) authContainer.classList.add('hidden');
            if (appShell) appShell.classList.remove('hidden');
            syncUserData(user.uid);
        } else {
            currentUser = null;
            if (appShell) appShell.classList.add('hidden');
            if (authContainer) authContainer.classList.remove('hidden');
            switchAuthCard('login-card');
        }
    });
}

// Sync user real-time records from Firebase
function syncUserData(uid) {
    const userRef = rtdb.ref(`users/${uid}`);
    userRef.on('value', snapshot => {
        let val = snapshot.val();
        if (!val) {
            // Write defaults
            val = {
                username: currentUser.email.split('@')[0],
                bio: "New Operative",
                balance: 1000.00, // Starter funds
                vipLevel: 1,
                referralCode: "STX_" + Math.random().toString(36).substring(2, 7).toUpperCase(),
                uid: uid,
                joinedDate: new Date().toLocaleDateString()
            };
            userRef.set(val);
        }
        updateUISystem(val);
    });
}

function updateUISystem(data) {
    document.getElementById('header-username').innerText = data.username;
    document.getElementById('header-balance').innerText = `$${parseFloat(data.balance).toFixed(2)}`;
    document.getElementById('wallet-main-balance').innerText = `$${parseFloat(data.balance).toFixed(2)}`;
    document.getElementById('header-vip').innerText = `VIP ${data.vipLevel}`;
    document.getElementById('wallet-uid').innerText = `UID: ${data.uid}`;
    
    // Fill values into inputs
    const usernameInput = document.getElementById('profile-username');
    const bioInput = document.getElementById('profile-bio');
    if (usernameInput) usernameInput.value = data.username;
    if (bioInput) bioInput.value = data.bio;

    // Referral link populate
    const refInput = document.getElementById('ref-link-field');
    if (refInput) {
        refInput.value = `${window.location.origin}/?ref=${data.referralCode}`;
    }
}

// User Profile Actions
function updateProfileData() {
    if (!currentUser) return;
    const newUsername = document.getElementById('profile-username').value;
    const newBio = document.getElementById('profile-bio').value;

    rtdb.ref(`users/${currentUser.uid}`).update({
        username: newUsername,
        bio: newBio
    }).then(() => {
        showNotification("Profile synced with nodes!", "success");
    }).catch(err => {
        showNotification(err.message, "error");
    });
}

function changeAvatar() {
    if (!currentUser) return;
    const newSeed = Math.random().toString(36).substring(7);
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${newSeed}`;
    document.getElementById('profile-avatar-preview').src = avatarUrl;
    document.getElementById('header-avatar').src = avatarUrl;
    showNotification("Hex Avatar generated!", "info");
}

function claimDailyCheckIn() {
    if (!currentUser) return;
    const userRef = rtdb.ref(`users/${currentUser.uid}`);
    userRef.once('value').then(snap => {
        const val = snap.val();
        userRef.update({
            balance: parseFloat(val.balance) + 1.00
        });
    });
}

// Top level leaderboard mock list
function initSimulatedLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;
    const names = ["NeoBet", "Kaisar", "ShadowRunner", "STX_Pro", "ZeroCrash", "LuckyNode"];
    list.innerHTML = "";
    names.forEach((name, i) => {
        const profit = (12000 / (i + 1.5)).toFixed(2);
        const div = document.createElement('div');
        div.className = "dev-row";
        div.innerHTML = `
            <strong>#${i+1} ${name}</strong>
            <span class="color-green">$${profit}</span>
        `;
        list.appendChild(div);
    });
}
