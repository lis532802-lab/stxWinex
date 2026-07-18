let activePeriodType = "30s";
let selectedPrediction = null;
let currentBetAmount = 10;
let userBets = [];

document.addEventListener('DOMContentLoaded', () => {
    initColorPeriodTabs();
    initColorPredictionButtons();
    initGameHistorySubTabs();
});

function initColorPeriodTabs() {
    document.querySelectorAll('.period-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.period-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePeriodType = btn.getAttribute('data-period');
            showNotification(`Connected to ${activePeriodType} node.`, "info");
            updatePeriodIDDisplay();
            renderColorGameHistory();
        });
    });
}

function updatePeriodIDDisplay() {
    const display = document.getElementById('color-period-id');
    if (display) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hr = String(now.getHours()).padStart(2, '0');
        const typePrefix = activePeriodType === "30s" ? "1" : activePeriodType === "1m" ? "2" : activePeriodType === "2m" ? "3" : "4";
        display.innerText = `${year}${month}${day}${hr}_${typePrefix}`;
    }
}

// Bind choice buttons
function initColorPredictionButtons() {
    const btns = document.querySelectorAll('.color-btn, .size-btn, .num-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPrediction = btn.getAttribute('data-prediction') || btn.getAttribute('data-num');
            openBetModal(selectedPrediction);
        });
    });
}

function openBetModal(prediction) {
    const modal = document.getElementById('bet-modal');
    const title = document.getElementById('bet-modal-title');
    if (modal && title) {
        title.innerText = `PLACE SYSTEM BET ON [${prediction.toUpperCase()}]`;
        modal.classList.remove('hidden');
    }
}

function closeBetModal() {
    const modal = document.getElementById('bet-modal');
    if (modal) modal.classList.add('hidden');
}

function setBetMultiplier(amt) {
    const input = document.getElementById('bet-amount-input');
    if (input) input.value = amt;
}

// Confirm user selection
document.getElementById('confirm-bet-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('bet-amount-input').value);
    if (!currentUser) {
        showNotification("Register to engage core transaction.", "error");
        return;
    }
    
    const userRef = rtdb.ref(`users/${currentUser.uid}`);
    userRef.once('value').then(snap => {
        const val = snap.val();
        if (val.balance < amount) {
            showNotification("Insufficient balance in system vault.", "error");
            return;
        }

        userRef.update({
            balance: parseFloat(val.balance) - amount
        }).then(() => {
            userBets.push({
                period: document.getElementById('color-period-id').innerText,
                prediction: selectedPrediction,
                amount: amount,
                status: "PENDING"
            });
            renderUserColorBets();
            closeBetModal();
            showNotification("Bet written to network block!", "success");
        });
    });
});

function initGameHistorySubTabs() {
    document.querySelectorAll('.hist-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.hist-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-subtab');
            document.querySelectorAll('.hist-view-tab').forEach(v => v.classList.remove('active'));
            if (target === "game-history") document.getElementById('game-history-table').classList.add('active');
            if (target === "my-bets") document.getElementById('my-bets-table').classList.add('active');
        });
    });
}

// Generate color predictions history logs
function renderColorGameHistory() {
    const rows = document.getElementById('color-history-rows');
    if (!rows) return;
    rows.innerHTML = "";
    
    // Simulate previous results data
    const sizes = ["BIG", "SMALL"];
    const colors = ["GREEN", "RED", "VIOLET"];
    
    for (let i = 0; i < 6; i++) {
        const number = Math.floor(Math.random() * 10);
        const size = number >= 5 ? sizes[0] : sizes[1];
        let colorClass = "color-green";
        let colorText = colors[0];
        
        if (number === 0 || number === 5) {
            colorClass = "color-cyan";
            colorText = colors[2];
        } else if (number % 2 === 0) {
            colorClass = "color-red";
            colorText = colors[1];
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#...${100 - i}</td>
            <td><strong>${number}</strong></td>
            <td>${size}</td>
            <td><span class="${colorClass}">${colorText}</span></td>
        `;
        rows.appendChild(tr);
    }
}

function renderUserColorBets() {
    const rows = document.getElementById('color-my-bets-rows');
    if (!rows) return;
    rows.innerHTML = "";
    userBets.slice().reverse().forEach(bet => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${bet.period}</td>
            <td>${bet.prediction.toUpperCase()}</td>
            <td>$${bet.amount}</td>
            <td><span class="color-yellow">${bet.status}</span></td>
        `;
        rows.appendChild(tr);
    });
}

// Resolve user bets after timer ends
function resolveCurrentBets(periodResultNum) {
    if (userBets.length === 0) return;
    const currentPeriodId = document.getElementById('color-period-id').innerText;
    
    userBets.forEach(bet => {
        if (bet.period === currentPeriodId && bet.status === "PENDING") {
            const isBig = periodResultNum >= 5;
            let didWin = false;

            if (bet.prediction === "big" && isBig) didWin = true;
            if (bet.prediction === "small" && !isBig) didWin = true;
            if (bet.prediction == periodResultNum) didWin = true;

            const isGreen = [1, 3, 7, 9].includes(periodResultNum) || periodResultNum === 5;
            const isRed = [2, 4, 6, 8].includes(periodResultNum) || periodResultNum === 0;

            if (bet.prediction === "green" && isGreen) didWin = true;
            if (bet.prediction === "red" && isRed) didWin = true;

            bet.status = didWin ? "WON" : "LOST";
            
            if (didWin) {
                const prize = bet.amount * 1.95;
                rtdb.ref(`users/${currentUser.uid}`).once('value').then(snap => {
                    rtdb.ref(`users/${currentUser.uid}`).update({
                        balance: snap.val().balance + prize
                    });
                });
                showNotification(`SUCCESS! Bet matched block result. Added +$${prize.toFixed(2)}`, "success");
            } else {
                showNotification(`Bet failed to match outcome.`, "error");
            }
        }
    });
    renderUserColorBets();
}
