.auth-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(circle at center, rgba(5, 15, 8, 0.95) 0%, rgba(1, 4, 3, 1) 100%);
    padding: 20px;
}

.auth-card {
    background: rgba(12, 15, 18, 0.9);
    border: 1px solid var(--border-cyber);
    box-shadow: 0 0 30px rgba(57, 255, 20, 0.05);
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    padding: 35px;
    text-align: center;
    position: relative;
    backdrop-filter: blur(10px);
}

.auth-logo-area {
    margin-bottom: 25px;
}

.auth-logo-area .fallback-logo {
    display: block;
    margin-bottom: 5px;
}

.neon-title {
    font-family: 'Orbitron', sans-serif;
    color: var(--neon-green);
    text-shadow: 0 0 8px var(--neon-green-glow);
    font-size: 1.4rem;
}

.auth-card h3 {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    letter-spacing: 2px;
    font-size: 1.1rem;
    margin-bottom: 25px;
    color: var(--text-primary);
}

.input-group {
    position: relative;
    margin-bottom: 20px;
}

.input-group .input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--neon-green);
}

.input-group input {
    width: 100%;
    padding: 14px 15px 14px 45px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(57, 255, 20, 0.2);
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
}

.input-group input:focus {
    border-color: var(--neon-green);
    box-shadow: 0 0 10px var(--neon-green-glow);
}

.auth-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    margin-bottom: 25px;
    color: var(--text-secondary);
}

.checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.checkbox-container input {
    margin-right: 8px;
}

.auth-link {
    color: var(--neon-cyan);
    text-decoration: none;
}

.auth-link:hover {
    text-shadow: 0 0 5px var(--neon-cyan-glow);
}

.auth-btn {
    width: 100%;
    margin-bottom: 20px;
}

.auth-divider {
    position: relative;
    margin: 20px 0;
}

.auth-divider span {
    background: var(--bg-card);
    padding: 0 15px;
    color: var(--text-secondary);
    font-size: 0.8rem;
    position: relative;
    z-index: 1;
}

.auth-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.05);
}

.social-login {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.google-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(0,0,0,0.3);
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: var(--transition-fast);
}

.google-btn:hover {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 15px var(--neon-cyan-glow);
}

.auth-switch {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.auth-switch a {
    color: var(--neon-green);
    text-decoration: none;
}
