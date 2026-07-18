// Keep track of counts for 30s, 1m, 2m, and 5m periods
let timers = {
    "30s": 30,
    "1m": 60,
    "2m": 120,
    "5m": 300
};

setInterval(() => {
    // Decrement loops
    for (let type in timers) {
        timers[type]--;
        
        if (timers[type] < 0) {
            // Reset to default standard
            timers[type] = type === "30s" ? 30 : type === "1m" ? 60 : type === "2m" ? 120 : 300;
            
            if (activePeriodType === type) {
                const randomWinNum = Math.floor(Math.random() * 10);
                resolveCurrentBets(randomWinNum);
                renderColorGameHistory();
                updatePeriodIDDisplay();
            }
        }
        
        if (activePeriodType === type) {
            updateTimerDisplay(timers[type]);
            handleTimerVisualEffects(timers[type]);
        }
    }
}, 1000);

function updateTimerDisplay(seconds) {
    const el = document.getElementById('color-countdown');
    if (!el) return;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    el.innerText = `${mins}:${secs}`;
}

// Fullscreen countdown display for the final 5 seconds of the round
function handleTimerVisualEffects(seconds) {
    let overlay = document.getElementById('fs-countdown-overlay');
    
    if (seconds <= 5 && seconds > 0) {
        // Build countdown element dynamically
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = "fs-countdown-overlay";
            overlay.className = "fs-countdown";
            overlay.innerHTML = `<div id="fs-count-num" class="fs-countdown-number">5</div>`;
            document.body.appendChild(overlay);
        }
        document.getElementById('fs-count-num').innerText = seconds;
        overlay.classList.remove('hidden');
    } else {
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}
