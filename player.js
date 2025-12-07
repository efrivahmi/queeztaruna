// Player Game Logic
let playerState = {
    pin: null,
    playerId: null,
    playerName: null,
    gameData: null
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
            document.getElementById('groupName').focus();
        }
    });

    document.getElementById('groupName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinGame();
        }
    });
});

async function joinGame() {
    const pin = document.getElementById('gamePIN').value.trim();
    const groupName = document.getElementById('groupName').value.trim();

    // Validation
    if (pin.length !== 6) {
        showError('PIN harus 6 digit!');
        return;
    }

    if (!groupName) {
        showError('Masukkan nama kelompok!');
        return;
    }

    try {
        // Check if game exists
        const gameData = await db.once(`games/${pin}`);

        if (!gameData) {
            showError('Game dengan PIN tersebut tidak ditemukan!');
            return;
        }

        if (gameData.status === 'ended') {
            showError('Game sudah berakhir!');
            return;
        }

        // Generate player ID
        playerState.pin = pin;
        playerState.playerId = generatePlayerID();
        playerState.playerName = groupName;

        // Add player to game
        await db.set(`games/${pin}/players/${playerState.playerId}`, {
            name: groupName,
            score: 0,
            streak: 0,
            joinedAt: db.serverTimestamp()
        });

        playSound('join');

        // Show waiting panel
        document.getElementById('joinPanel').classList.add('hidden');
        document.getElementById('waitingPanel').classList.remove('hidden');

        document.getElementById('yourGroupName').textContent = groupName;
        document.getElementById('yourPIN').textContent = pin;

        // Listen to game updates
        db.on(`games/${pin}`, handleGameUpdate);

        // Listen to other players
        db.on(`games/${pin}/players`, updateOtherPlayers);

    } catch (error) {
        console.error('Error joining game:', error);
        showError('Gagal join game. Coba lagi!');
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

function updateOtherPlayers(players) {
    const container = document.getElementById('otherPlayersList');
    container.innerHTML = '';

    Object.entries(players || {}).forEach(([id, player]) => {
        if (id !== playerState.playerId) {
            const div = document.createElement('div');
            div.className = 'other-player-item';
            div.textContent = '• ' + player.name;
            container.appendChild(div);
        }
    });
}

function handleGameUpdate(gameData) {
    if (!gameData) {
        showDisconnected();
        return;
    }

    playerState.gameData = gameData;

    // Update player score display
    const myData = gameData.players?.[playerState.playerId];
    if (myData) {
        document.getElementById('playerScore').textContent = myData.score || 0;
        document.getElementById('playerNameDisplay').textContent = playerState.playerName;
    }

    // Handle different game phases
    if (gameData.status === 'waiting') {
        // Still in waiting room
        return;
    }

    if (gameData.status === 'playing') {
        // Hide waiting, show game
        document.getElementById('waitingPanel').classList.add('hidden');
        document.getElementById('gamePanel').classList.remove('hidden');

        // Handle current phase
        handlePhase(gameData.phase);
    }

    if (gameData.status === 'ended') {
        showGameOver();
    }
}

function handlePhase(phase) {
    // Hide all phases first
    document.getElementById('buzzerPhase').classList.add('hidden');
    document.getElementById('waitingPhase').classList.add('hidden');
    document.getElementById('answerPhase').classList.add('hidden');
    document.getElementById('attackPhase').classList.add('hidden');
    document.getElementById('resultPhase').classList.add('hidden');

    switch(phase) {
        case 'buzzer':
            showBuzzerPhase();
            break;
        case 'question':
            if (playerState.gameData.currentPlayer === playerState.playerId) {
                showAnswerPhase();
            } else {
                showWaitingPhase();
            }
            break;
        case 'attack':
            if (playerState.gameData.attackerPlayer === playerState.playerId) {
                showAttackPhase();
            } else {
                showWaitingPhase();
            }
            break;
    }
}

function showBuzzerPhase() {
    document.getElementById('buzzerPhase').classList.remove('hidden');

    const buzzerBtn = document.getElementById('buzzerButton');
    buzzerBtn.disabled = false;
    buzzerBtn.classList.remove('pressed');

    document.getElementById('buzzerFeedback').classList.add('hidden');
}

async function pressBuzzer() {
    const buzzerBtn = document.getElementById('buzzerButton');
    buzzerBtn.disabled = true;
    buzzerBtn.classList.add('pressed');

    // Record buzzer press in database
    await db.set(`games/${playerState.pin}/buzzerPressed/${playerState.playerId}`, {
        pressed: true,
        timestamp: db.serverTimestamp()
    });

    playSound('buzzer');

    // Show feedback
    const feedback = document.getElementById('buzzerFeedback');
    feedback.textContent = 'Buzzer ditekan! Menunggu...';
    feedback.classList.remove('hidden');
}

function showWaitingPhase() {
    document.getElementById('waitingPhase').classList.remove('hidden');

    const currentPlayer = playerState.gameData.currentPlayer;
    const currentPlayerData = playerState.gameData.players?.[currentPlayer];

    if (currentPlayerData) {
        document.getElementById('currentTurnPlayer').textContent = currentPlayerData.name;
    }

    // Show current question if available
    if (playerState.gameData.currentQuestion) {
        document.getElementById('questionNumberSmall').textContent =
            `Soal #${playerState.gameData.questionCount}`;
        document.getElementById('questionTextSmall').textContent =
            playerState.gameData.currentQuestion.question;
    }

    // Show mini scoreboard
    updateMiniScoreboard('scoreboardMini');
}

function showAnswerPhase() {
    document.getElementById('answerPhase').classList.remove('hidden');

    const question = playerState.gameData.currentQuestion;

    document.getElementById('questionNumberPlayer').textContent =
        `Soal #${playerState.gameData.questionCount}`;
    document.getElementById('questionTypePlayer').textContent =
        playerState.gameData.attackMode ? 'SERANGAN' : 'Normal';
    document.getElementById('questionTextPlayer').textContent = question.question;

    // Clear and focus answer input
    const answerInput = document.getElementById('answerInput');
    answerInput.value = '';
    answerInput.focus();
    answerInput.disabled = false;

    document.getElementById('submitBtn').disabled = false;
    document.getElementById('answerFeedback').classList.add('hidden');
}

async function submitAnswer() {
    const answer = document.getElementById('answerInput').value.trim();

    if (!answer) {
        alert('Masukkan jawaban!');
        return;
    }

    // Disable input
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;

    // Send answer to database
    await db.set(`games/${playerState.pin}/currentAnswer`, answer);

    // Show feedback
    const feedback = document.getElementById('answerFeedback');
    feedback.innerHTML = '<div class="answer-submitted">✓ Jawaban terkirim! Menunggu penilaian...</div>';
    feedback.classList.remove('hidden');
}

function showAttackPhase() {
    document.getElementById('attackPhase').classList.remove('hidden');

    const container = document.getElementById('attackTargetsList');
    container.innerHTML = '';

    // Show other players as targets
    Object.entries(playerState.gameData.players || {}).forEach(([id, player]) => {
        if (id !== playerState.playerId) {
            const btn = document.createElement('button');
            btn.className = 'attack-target-btn';
            btn.textContent = `${player.name} (${player.score} poin)`;
            btn.onclick = () => selectAttackTarget(id);
            container.appendChild(btn);
        }
    });
}

async function selectAttackTarget(targetId) {
    // Record attack target
    await db.set(`games/${playerState.pin}/attackTarget`, targetId);

    // Show feedback
    const targetPlayer = playerState.gameData.players[targetId];
    alert(`Anda menyerang ${targetPlayer.name}!`);

    // Attack question will be shown automatically
}

function updateMiniScoreboard(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const sorted = Object.entries(playerState.gameData.players || {})
        .sort((a, b) => (b[1].score || 0) - (a[1].score || 0));

    sorted.forEach(([id, player]) => {
        const div = document.createElement('div');
        div.className = 'mini-score-item';
        if (id === playerState.playerId) {
            div.classList.add('my-score');
        }
        div.innerHTML = `
            <span class="mini-score-name">${player.name}</span>
            <span class="mini-score-value">${player.score || 0}</span>
        `;
        container.appendChild(div);
    });
}

function showGameOver() {
    document.getElementById('gameOverPhase').classList.remove('hidden');

    // Hide other phases
    document.getElementById('buzzerPhase').classList.add('hidden');
    document.getElementById('waitingPhase').classList.add('hidden');
    document.getElementById('answerPhase').classList.add('hidden');

    // Show final result
    const sorted = Object.entries(playerState.gameData.players || {})
        .sort((a, b) => (b[1].score || 0) - (a[1].score || 0));

    const myRank = sorted.findIndex(([id]) => id === playerState.playerId) + 1;
    const myData = playerState.gameData.players[playerState.playerId];

    const container = document.getElementById('finalResult');
    container.innerHTML = `
        <div class="final-rank-display">
            <h3>Peringkat Anda: #${myRank}</h3>
            <div class="final-score">${myData.score || 0} poin</div>
        </div>
        <div class="final-scoreboard">
            ${sorted.map(([id, player], index) => `
                <div class="final-rank-item ${id === playerState.playerId ? 'my-rank' : ''}">
                    <span class="rank">#${index + 1}</span>
                    <span class="name">${player.name}</span>
                    <span class="score">${player.score || 0}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function showDisconnected() {
    document.getElementById('joinPanel').classList.add('hidden');
    document.getElementById('waitingPanel').classList.add('hidden');
    document.getElementById('gamePanel').classList.add('hidden');
    document.getElementById('disconnectedPanel').classList.remove('hidden');
}
