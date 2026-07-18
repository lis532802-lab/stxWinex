// Display notifications as animated screen alerts
function showNotification(msg, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = "info-circle";
    if (type === "success") icon = "check-circle";
    if (type === "error") icon = "exclamation-triangle";

    toast.innerHTML = `
        <i class="fa fa-${icon}"></i>
        <div class="toast-message">${msg}</div>
    `;

    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Copy values to clipboard
function copyRefLink() {
    const linkField = document.getElementById('ref-link-field');
    if (linkField) {
        linkField.select();
        linkField.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(linkField.value)
            .then(() => showNotification("Secure link saved to clipboard!", "success"))
            .catch(() => showNotification("Failed to write to clipboard.", "error"));
    }
}

// Direct style sheet for programmatic notifications
const style = document.createElement('style');
style.innerHTML = `
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.toast {
    background: rgba(12,15,18,0.95);
    border: 1px solid var(--border-cyber);
    color: #fff;
    padding: 15px 25px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    transform: translateY(-20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.toast.show {
    transform: translateY(0);
    opacity: 1;
}
.toast-success { border-color: var(--neon-green); box-shadow: 0 0 10px var(--neon-green-glow); }
.toast-error { border-color: var(--neon-red); box-shadow: 0 0 10px var(--neon-red-glow); }
.toast-info { border-color: var(--neon-cyan); box-shadow: 0 0 10px var(--neon-cyan-glow); }
`;
document.head.appendChild(style);
