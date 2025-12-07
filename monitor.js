// Monitor/Spectator Logic
let monitorState = {
    pin: null,
    gameData: null,
    activityLog: []
};

// Check for PIN in URL parameter
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const pinFromURL = urlParams.get('pin');

    if (pinFromURL) {
        document.getElementById('gamePIN').value = pinFromURL;
    }

    // Auto-focus on PIN input
    document.getElementById('gamePIN').focus();

    // Enter key to join
    document.getElementById('gamePIN').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinMonitor();
        }
    });
});

async function joinMonitor() {
    const pin = document.getElementById('gamePIN').value.trim();

    // Validation
    if (pin.length !== 6) {
        showError('PIN harus 6 digit!');
        return;
    }

    try {
        // Check if game exists
        const gameData = await db.once(`games/${pin}`);

        if (!gameData) {
            showError('Game dengan PIN tersebut tidak ditemukan!');
            return;
        }

        monitorState.pin = pin;

        // Show monitor panel
        document.getElementById('joinPanel').classList.add('hidden');
        document.getElementById('monitorPanel').classList.remove('hidden');

        document.getElementById('monitorPIN').textContent = pin;

        // Listen to game updates
        db.on(`games/${pin}`, handleGameUpdate);

        addActivity('✓ Connected to game');

    } catch (error) {
        console.error('Error joining monitor:', error);
        showError('Gagal join monitor. Coba lagi!');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('joinError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');

    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 3000);
}

function handleGameUpdate(gameData) {
    if (!gameData) {
        showDisconnected();
        return;
    }

    const previousPhase = monitorState.gameData?.phase;
    monitorState.gameData = gameData;

    // Update question count
    document.getElementById('monitorQuestionCount').textContent =
        `Soal: ${gameData.questionCount || 0}/${gameData.maxQuestions || 30}`;

    // Update scoreboard
    updateScoreboard();

    // Handle phase changes
    if (previousPhase !== gameData.phase) {
        handlePhaseChange(gameData.phase);
    }

    // Update phase-specific content
    updatePhaseContent(gameData.phase);

    // Check game status
    if (gameData.status === 'ended') {
        showGameOver();
    }
}

function updateScoreboard() {
    const container = document.getElementById('monitorScoreboard');
    container.innerHTML = '';

    if (!monitorState.gameData.players) return;

    const sorted = Object.entries(monitorState.gameData.players)
        .sort((a, b) => (b[1].score || 0) - (a[1].score || 0));

    sorted.forEach(([id, player], index) => {
        const div = document.createElement('div');
        div.className = 'scoreboard-row';

        let medal = '';
        if (index === 0) medal = '🥇';
        else if (index === 1) medal = '🥈';
        else if (index === 2) medal = '🥉';

        let streakDisplay = '';
        if (player.streak > 0) {
            streakDisplay = `<span class="streak-badge">🔥 ${player.streak}</span>`;
        }

        div.innerHTML = `
            <span class="rank">${medal || `#${index + 1}`}</span>
            <span class="player-name">${player.name}</span>
            ${streakDisplay}
            <span class="player-score">${player.score || 0}</span>
        `;
        container.appendChild(div);
    });
}

function handlePhaseChange(phase) {
    // Add activity log
    switch(phase) {
        case 'buzzer':
            addActivity('⚡ Fase Buzzer - Peserta berebut soal');
            break;
        case 'question':
            const currentPlayer = monitorState.gameData.players?.[monitorState.gameData.currentPlayer];
            if (currentPlayer) {
                addActivity(`📝 ${currentPlayer.name} sedang menjawab`);
            }
            break;
        case 'attack':
            const attacker = monitorState.gameData.players?.[monitorState.gameData.attackerPlayer];
            if (attacker) {
                addActivity(`⚔️ ${attacker.name} masuk mode serangan!`);
            }
            break;
    }
}

function updatePhaseContent(phase) {
    // Hide all phases
    document.getElementById('monitorBuzzerPhase').classList.add('hidden');
    document.getElementById('monitorQuestionPhase').classList.add('hidden');
    document.getElementById('monitorAttackPhase').classList.add('hidden');
    document.getElementById('monitorResultPhase').classList.add('hidden');

    switch(phase) {
        case 'buzzer':
            document.getElementById('monitorBuzzerPhase').classList.remove('hidden');
            break;

        case 'question':
            document.getElementById('monitorQuestionPhase').classList.remove('hidden');

            const currentPlayer = monitorState.gameData.players?.[monitorState.gameData.currentPlayer];
            if (currentPlayer) {
                document.getElementById('monitorCurrentPlayer').textContent = currentPlayer.name;
            }

            if (monitorState.gameData.currentQuestion) {
                document.getElementById('monitorQuestionNumber').textContent =
                    `Soal #${monitorState.gameData.questionCount}`;
                document.getElementById('monitorQuestionType').textContent =
                    monitorState.gameData.attackMode ? 'SERANGAN' : 'Normal';
                document.getElementById('monitorQuestionText').textContent =
                    monitorState.gameData.currentQuestion.question;
            }
            break;

        case 'attack':
            document.getElementById('monitorAttackPhase').classList.remove('hidden');

            const attacker = monitorState.gameData.players?.[monitorState.gameData.attackerPlayer];
            if (attacker) {
                document.getElementById('monitorAttacker').textContent = attacker.name;
            }
            break;
    }
}

function addActivity(message) {
    const timestamp = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    monitorState.activityLog.unshift({
        timestamp,
        message
    });

    // Keep only last 20 activities
    if (monitorState.activityLog.length > 20) {
        monitorState.activityLog.pop();
    }

    updateActivityLog();
}

function updateActivityLog() {
    const container = document.getElementById('activityLog');
    container.innerHTML = '';

    monitorState.activityLog.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <span class="activity-time">${activity.timestamp}</span>
            <span class="activity-message">${activity.message}</span>
        `;
        container.appendChild(div);
    });

    // Auto-scroll to top (latest activity)
    container.scrollTop = 0;
}

function showGameOver() {
    document.getElementById('monitorGameOver').classList.remove('hidden');
    document.getElementById('monitorBuzzerPhase').classList.add('hidden');
    document.getElementById('monitorQuestionPhase').classList.add('hidden');
    document.getElementById('monitorAttackPhase').classList.add('hidden');

    const container = document.getElementById('monitorFinalScoreboard');
    container.innerHTML = '';

    if (!monitorState.gameData.players) return;

    const sorted = Object.entries(monitorState.gameData.players)
        .sort((a, b) => (b[1].score || 0) - (a[1].score || 0));

    container.innerHTML = '<h3>🏆 Pemenang!</h3>';

    sorted.forEach(([id, player], index) => {
        const div = document.createElement('div');
        div.className = 'final-rank-row';

        let trophy = '';
        if (index === 0) {
            trophy = '🏆';
            div.classList.add('winner');
        } else if (index === 1) {
            trophy = '🥈';
        } else if (index === 2) {
            trophy = '🥉';
        }

        div.innerHTML = `
            <span class="final-rank">${trophy || `#${index + 1}`}</span>
            <span class="final-name">${player.name}</span>
            <span class="final-score">${player.score || 0} poin</span>
        `;
        container.appendChild(div);
    });

    addActivity('🏁 Game selesai!');
}

function showDisconnected() {
    document.getElementById('joinPanel').classList.add('hidden');
    document.getElementById('monitorPanel').classList.add('hidden');
    document.getElementById('disconnectedPanel').classList.remove('hidden');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}
