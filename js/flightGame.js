let canvas, ctx;
let currentMultiplier = 1.00;
let crashPoint = 1.00;
let isFlying = false;
let gameTick = 0;
let flightBetPlaced = false;
let autoCashOutValue = 2.00;
let activeFlightBet = null;

document.addEventListener('DOMContentLoaded', () => {
    initFlightCanvas();
    initFlightButtons();
    startFlightGameLoop();
});

function initFlightCanvas() {
    canvas = document.getElementById('flight-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
}

function initFlightButtons() {
    const btn = document.getElementById('flight-action-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (!isFlying && !flightBetPlaced) {
                placeFlightBet();
            } else if (isFlying && flightBetPlaced) {
                cashOutFlight();
            }
        });
    }
}

function placeFlightBet() {
    const amtInput = document.getElementById('flight-bet-amount');
    const autoInput = document.getElementById('flight-auto-out');
    
    const amount = parseFloat(amtInput.value);
    autoCashOutValue = parseFloat(autoInput.value);

    if (!currentUser) {
        showNotification("Sign in to place bets.", "error");
        return;
    }

    rtdb.ref(`users/${currentUser.uid}`).once('value').then(snap => {
        const val = snap.val();
        if (val.balance < amount) {
            showNotification("Insufficient wallet credits.", "error");
            return;
        }

        rtdb.ref(`users/${currentUser.uid}`).update({
            balance: val.balance - amount
        }).then(() => {
            activeFlightBet = { amount: amount };
            flightBetPlaced = true;
            document.getElementById('flight-action-btn').innerText = "AWAITING ENGINE START";
            document.getElementById('flight-action-btn').className = "cyber-btn outline-btn flight-bet-btn";
            showNotification("Flight bet committed!", "success");
        });
    });
}

function startFlightGameLoop() {
    let waitTimer = 5;
    
    function newRound() {
        isFlying = false;
        currentMultiplier = 1.00;
        gameTick = 0;
        document.getElementById('crash-alert-overlay').classList.add('hidden');
        document.getElementById('crash-multiplier-text').style.color = "var(--neon-green)";
        
        // Classic Crash mathematics with house-edge adjustment
        const outcome = Math.random();
        if (outcome < 0.03) {
            crashPoint = 1.00; // instant crash
        } else {
            crashPoint = parseFloat((1.01 + (0.95 / (outcome + 0.01))).toFixed(2));
            if (crashPoint > 50) crashPoint = parseFloat((Math.random() * 5 + 10).toFixed(2)); // limit extreme mock results
        }

        waitTimer = 5;
        const prepareInterval = setInterval(() => {
            document.getElementById('crash-multiplier-text').innerText = `STARTS IN ${waitTimer}s`;
            if (flightBetPlaced) {
                document.getElementById('flight-action-btn').innerText = "CASH OUT NOW";
                document.getElementById('flight-action-btn').className = "cyber-btn hazard-btn flight-bet-btn";
            }
            waitTimer--;
            if (waitTimer < 0) {
                clearInterval(prepareInterval);
                launchFlight();
            }
        }, 1000);
    }

    function launchFlight() {
        isFlying = true;
        gameTick = 0;
        simulateLiveBets();
        
        function animate() {
            if (!isFlying) return;
            gameTick++;
            
            // Exponential curve growth calculation
            currentMultiplier = parseFloat((1.00 + Math.pow(gameTick / 140, 2)).toFixed(2));
            
            document.getElementById('crash-multiplier-text').innerText = `${currentMultiplier.toFixed(2)}x`;
            drawFlightGraph();

            // Auto Cash Out Trigger
            if (flightBetPlaced && currentMultiplier >= autoCashOutValue) {
                cashOutFlight();
            }

            if (currentMultiplier >= crashPoint) {
                triggerCrash();
            } else {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    }

    function triggerCrash() {
        isFlying = false;
        flightBetPlaced = false;
        activeFlightBet = null;
        
        document.getElementById('crash-multiplier-text').innerText = `${crashPoint.toFixed(2)}x`;
        document.getElementById('crash-multiplier-text').style.color = "var(--neon-red)";
        document.getElementById('crash-alert-overlay').classList.remove('hidden');
        
        const btn = document.getElementById('flight-action-btn');
        btn.innerText = "ENGAGE ROCKET";
        btn.className = "cyber-btn primary-btn flight-bet-btn";

        updateCrashHistoryRow(crashPoint);
        setTimeout(newRound, 4000);
    }

    newRound();
}

function cashOutFlight() {
    if (!flightBetPlaced || !activeFlightBet) return;
    flightBetPlaced = false;
    
    const profit = activeFlightBet.amount * currentMultiplier;
    activeFlightBet = null;

    rtdb.ref(`users/${currentUser.uid}`).once('value').then(snap => {
        rtdb.ref(`users/${currentUser.uid}`).update({
            balance: snap.val().balance + profit
        }).then(() => {
            showNotification(`ROCKET CASH OUT! Added +$${profit.toFixed(2)}`, "success");
            const btn = document.getElementById('flight-action-btn');
            btn.innerText = "ENGAGE ROCKET";
            btn.className = "cyber-btn primary-btn flight-bet-btn";
        });
    });
}

function drawFlightGraph() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
    }

    // Plotting the line curve
    ctx.strokeStyle = "var(--neon-green)";
    ctx.shadowColor = "var(--neon-green-glow)";
    ctx.shadowBlur = 15;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    const xLimit = Math.min(gameTick * 2.2, canvas.width - 50);
    const yLimit = canvas.height - Math.min(Math.pow(gameTick / 10, 2), canvas.height - 50);

    ctx.quadraticCurveTo(xLimit / 2, canvas.height, xLimit, yLimit);
    ctx.stroke();

    // Rocket Icon Graphic
    ctx.fillStyle = "var(--neon-green)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(xLimit, yLimit, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function updateCrashHistoryRow(val) {
    const row = document.getElementById('crash-history-row');
    if (!row) return;
    const node = document.createElement('div');
    node.className = "hist-pill";
    node.style.padding = "5px 12px";
    node.style.borderRadius = "4px";
    node.style.fontWeight = "bold";
    node.style.fontSize = "0.85rem";
    node.style.background = val >= 2.0 ? "rgba(57, 255, 20, 0.15)" : "rgba(255, 0, 85, 0.15)";
    node.style.color = val >= 2.0 ? "var(--neon-green)" : "var(--neon-red)";
    node.innerText = `${val.toFixed(2)}x`;
    
    row.insertBefore(node, row.firstChild);
    if (row.children.length > 10) row.lastChild.remove();
}

function simulateLiveBets() {
    const container = document.getElementById('live-flight-bets');
    if (!container) return;
    container.innerHTML = "";
    
    const bots = ["Crypto_Sniper", "AlphaRun", "T-800", "WinMatrix", "NodeTrader"];
    bots.forEach(bot => {
        const bet = (Math.random() * 150 + 10).toFixed(0);
        const el = document.createElement('div');
        el.className = "live-bet-el";
        el.style.whiteSpace = "nowrap";
        el.innerHTML = `<strong>${bot}</strong>: $${bet}`;
        container.appendChild(el);
    });
}
