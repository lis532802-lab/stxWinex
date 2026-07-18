let localTxLedger = [];

function handleDeposit() {
    const amtInput = document.getElementById('deposit-amount');
    const amt = parseFloat(amtInput.value);
    
    if (isNaN(amt) || amt < 10) {
        showNotification("Minimum deposit requirement is $10.", "error");
        return;
    }

    if (!currentUser) return;
    const userRef = rtdb.ref(`users/${currentUser.uid}`);
    userRef.once('value').then(snap => {
        const val = snap.val();
        userRef.update({
            balance: parseFloat(val.balance) + amt
        }).then(() => {
            logTransaction("DEPOSIT", amt, "SUCCESS");
            amtInput.value = "";
            showNotification(`Transaction processed! +$${amt.toFixed(2)} added to network vault.`, "success");
        });
    });
}

function handleWithdrawal() {
    const amtInput = document.getElementById('withdraw-amount');
    const amt = parseFloat(amtInput.value);

    if (isNaN(amt) || amt < 15) {
        showNotification("Minimum withdrawal request is $15.", "error");
        return;
    }

    if (!currentUser) return;
    const userRef = rtdb.ref(`users/${currentUser.uid}`);
    userRef.once('value').then(snap => {
        const val = snap.val();
        if (val.balance < amt) {
            showNotification("Requested balance exceeds user reserves.", "error");
            return;
        }

        userRef.update({
            balance: parseFloat(val.balance) - amt
        }).then(() => {
            logTransaction("WITHDRAW", amt, "SUCCESS");
            amtInput.value = "";
            showNotification(`Withdrawal request committed! -$${amt.toFixed(2)} processed.`, "success");
        });
    });
}

function logTransaction(type, amt, status) {
    localTxLedger.push({
        type: type,
        amount: amt,
        status: status,
        date: new Date().toLocaleTimeString()
    });
    renderTransactionLedger();
}

function renderTransactionLedger() {
    const container = document.getElementById('transaction-rows');
    if (!container) return;
    container.innerHTML = "";
    
    localTxLedger.slice().reverse().forEach(tx => {
        const row = document.createElement('div');
        row.className = "dev-row";
        row.style.padding = "10px 0";
        row.innerHTML = `
            <strong>${tx.type} (${tx.date})</strong>
            <span class="${tx.type === 'DEPOSIT' ? 'color-green' : 'color-red'}">${tx.type === 'DEPOSIT' ? '+' : '-'}$${tx.amount.toFixed(2)}</span>
        `;
        container.appendChild(row);
    });
}
