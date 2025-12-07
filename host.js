// Host Game Logic
let gameState = {
    pin: null,
    players: {},
    currentQuestion: null,
    usedQuestions: [],
    questionCount: 0,
    phase: 'setup', // setup, waiting, buzzer, question, attack, ended
    currentPlayer: null,
    buzzerPressed: {},
    attackerPlayer: null
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Setup group name inputs
    document.getElementById('numGroups').addEventListener('input', updateGroupInputs);
    updateGroupInputs();
});

function updateGroupInputs() {
    const num = parseInt(document.getElementById('numGroups').value);
    const container = document.getElementById('groupNamesSetup');
    container.innerHTML = '';

    for (let i = 1; i <= num; i++) {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label>Nama Kelompok ${i}:</label>
            <input type="text" id="groupName${i}" placeholder="Kelompok ${i}" value="Kelompok ${i}">
        `;
        container.appendChild(div);
    }
}

// Create new game
async function createGame() {
    const numGroups = parseInt(document.getElementById('numGroups').value);

    // Generate PIN
    gameState.pin = generatePIN();

    // Initialize game data in Firebase
    const gameData = {
        pin: gameState.pin,
        status: 'waiting',
        phase: 'waiting',
        createdAt: db.serverTimestamp(),
        players: {},
        currentQuestion: null,
        questionCount: 0,
        usedQuestions: [],
        maxQuestions: getTotalQuestions()
    };

    try {
        await db.set(`games/${gameState.pin}`, gameData);

        // Show waiting panel
        document.getElementById('setupPanel').classList.add('hidden');
        document.getElementById('waitingPanel').classList.remove('hidden');
        document.getElementById('gamePIN').textContent = gameState.pin;
        document.getElementById('gamePINSmall').textContent = gameState.pin;

        // Generate QR Code
        const playerURL = window.location.origin + window.location.pathname.replace('host.html', 'player.html');
        document.getElementById('playerURL').textContent = playerURL;

        const qrElement = document.getElementById('qrCode');
        qrElement.innerHTML = '';
        new QRCode(qrElement, {
            text: playerURL + '?pin=' + gameState.pin,
            width: 200,
            height: 200
        });

        // Listen for players joining
        db.on(`games/${gameState.pin}/players`, updatePlayerList);

    } catch (error) {
        console.error('Error creating game:', error);
        alert('Gagal membuat game. Pastikan Firebase sudah dikonfigurasi.');
    }
}

function updatePlayerList(players) {
    gameState.players = players || {};
    const count = Object.keys(gameState.players).length;

    document.getElementById('playerCount').textContent = count;

    const listContainer = document.getElementById('playerList');
    listContainer.innerHTML = '';

    Object.entries(gameState.players).forEach(([id, player]) => {
        const div = document.createElement('div');
        div.className = 'player-item';
        div.innerHTML = `
            <span class="player-name">👤 ${player.name}</span>
            <span class="player-status">✓ Ready</span>
        `;
        listContainer.appendChild(div);
    });

    // Enable start button if enough players
    const startBtn = document.getElementById('startGameBtn');
    if (count >= 2) {
        startBtn.disabled = false;
        startBtn.textContent = `Mulai Game (${count} kelompok siap)`;
    } else {
        startBtn.disabled = true;
        startBtn.textContent = 'Mulai Game (Minimum 2 kelompok)';
    }
}

function copyPIN() {
    const pin = gameState.pin;
    navigator.clipboard.writeText(pin).then(() => {
        alert('PIN berhasil dicopy: ' + pin);
    });
}

async function startGame() {
    if (Object.keys(gameState.players).length < 2) {
        alert('Minimal 2 kelompok untuk memulai game!');
        return;
    }

    try {
        await db.update(`games/${gameState.pin}`, {
            status: 'playing',
            phase: 'buzzer',
            startedAt: db.serverTimestamp()
        });

        gameState.phase = 'buzzer';

        // Hide waiting, show game
        document.getElementById('waitingPanel').classList.add('hidden');
        document.getElementById('gamePanel').classList.remove('hidden');

        // Render groups
        renderGroups();

        // Show buzzer phase
        showBuzzerPhase();

        // Listen to game state changes
        db.on(`games/${gameState.pin}`, handleGameUpdate);

    } catch (error) {
        console.error('Error starting game:', error);
        alert('Gagal memulai game');
    }
}

function renderGroups() {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';

    Object.entries(gameState.players).forEach(([id, player]) => {
        const div = document.createElement('div');
        div.className = 'group-card';
        div.id = `group-${id}`;

        let streakHTML = '';
        if (player.streak > 0) {
            streakHTML = `<div class="group-streak">🔥 Streak: ${player.streak}</div>`;
        }

        div.innerHTML = `
            <div class="group-name">${player.name}</div>
            <div class="group-score">${player.score || 0}</div>
            ${streakHTML}
        `;
        container.appendChild(div);
    });
}

function handleGameUpdate(gameData) {
    if (!gameData) return;

    gameState = { ...gameState, ...gameData };

    // Update players display
    if (gameData.players) {
        gameState.players = gameData.players;
        renderGroups();
    }

    // Update question count
    document.getElementById('questionCount').textContent =
        `Soal: ${gameData.questionCount || 0}/${gameData.maxQuestions || 30}`;

    // Handle buzzer presses
    if (gameData.buzzerPressed && gameState.phase === 'buzzer') {
        handleBuzzerPress(gameData.buzzerPressed);
    }

    // Handle player answer
    if (gameData.currentAnswer && gameState.phase === 'question') {
        showPlayerAnswer(gameData.currentAnswer);
    }

    // Handle attack selection
    if (gameData.attackTarget && gameState.phase === 'attack') {
        handleAttackSelection(gameData.attackTarget);
    }
}

function showBuzzerPhase() {
    gameState.phase = 'buzzer';
    gameState.buzzerPressed = {};

    document.getElementById('buzzerPhase').classList.remove('hidden');
    document.getElementById('questionPhase').classList.add('hidden');
    document.getElementById('attackPhase').classList.add('hidden');
    document.getElementById('gamePhase').textContent = 'Fase: Buzzer';

    // Reset buzzer in database
    db.update(`games/${gameState.pin}`, {
        phase: 'buzzer',
        buzzerPressed: null,
        currentPlayer: null,
        currentAnswer: null
    });
}

function handleBuzzerPress(buzzerData) {
    const pressedPlayers = Object.entries(buzzerData || {})
        .filter(([id, data]) => data.pressed)
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

    if (pressedPlayers.length === 0) return;

    // First player to press wins
    const [winnerId, winnerData] = pressedPlayers[0];
    const winner = gameState.players[winnerId];

    if (!winner) return;

    gameState.currentPlayer = winnerId;

    // Update UI
    const statusDiv = document.getElementById('buzzerStatus');
    statusDiv.innerHTML = `
        <div class="buzzer-winner-display">
            <div class="winner-icon">🏆</div>
            <h3>${winner.name} menekan buzzer!</h3>
        </div>
    `;

    playSound('buzzer');

    // Highlight winner
    document.querySelectorAll('.group-card').forEach(card => {
        card.classList.remove('active');
    });
    document.getElementById(`group-${winnerId}`).classList.add('active');

    // Show question after delay
    setTimeout(() => {
        showQuestionPhase(winnerId);
    }, 2000);
}

function showQuestionPhase(playerId) {
    gameState.phase = 'question';
    gameState.currentPlayer = playerId;

    const player = gameState.players[playerId];

    // Get random question
    const questionData = getRandomQuestion(gameState.usedQuestions);

    if (!questionData) {
        endGame();
        return;
    }

    gameState.currentQuestion = questionData;
    gameState.usedQuestions.push(questionData.index);
    gameState.questionCount++;

    // Update database
    db.update(`games/${gameState.pin}`, {
        phase: 'question',
        currentPlayer: playerId,
        currentQuestion: {
            question: questionData.question,
            answer: questionData.answer
        },
        questionCount: gameState.questionCount,
        usedQuestions: gameState.usedQuestions,
        currentAnswer: null
    });

    // Update UI
    document.getElementById('buzzerPhase').classList.add('hidden');
    document.getElementById('questionPhase').classList.remove('hidden');
    document.getElementById('gamePhase').textContent = 'Fase: Menjawab';

    document.getElementById('currentPlayerName').textContent = player.name;
    document.getElementById('questionNumber').textContent = `Soal #${gameState.questionCount}`;
    document.getElementById('questionType').textContent = gameState.attackMode ? 'SERANGAN' : 'Normal';
    document.getElementById('questionText').textContent = questionData.question;
    document.getElementById('playerAnswer').innerHTML = '<div class="waiting-answer">Menunggu jawaban...</div>';
    document.getElementById('correctAnswerDisplay').classList.add('hidden');
}

function showPlayerAnswer(answer) {
    const answerDiv = document.getElementById('playerAnswer');
    answerDiv.innerHTML = `
        <div class="answer-received">
            <strong>Jawaban:</strong> ${answer}
        </div>
    `;
}

function showCorrectAnswer() {
    const display = document.getElementById('correctAnswerDisplay');
    display.textContent = `Jawaban yang benar: ${gameState.currentQuestion.answer}`;
    display.classList.remove('hidden');
}

async function markCorrect() {
    if (!gameState.currentPlayer || !gameState.currentQuestion) return;

    const playerId = gameState.currentPlayer;
    const player = gameState.players[playerId];

    // Update score and streak
    const newScore = (player.score || 0) + 10;
    const newStreak = (player.streak || 0) + 1;

    await db.update(`games/${gameState.pin}/players/${playerId}`, {
        score: newScore,
        streak: newStreak,
        lastResult: 'correct'
    });

    playSound('correct');

    // Check for attack mode
    if (newStreak >= 3) {
        showAttackMode(playerId);
    } else {
        nextQuestion();
    }
}

async function markWrong() {
    if (!gameState.currentPlayer || !gameState.currentQuestion) return;

    const playerId = gameState.currentPlayer;
    const player = gameState.players[playerId];

    // Update score and reset streak
    const newScore = Math.max(0, (player.score || 0) - 5);

    await db.update(`games/${gameState.pin}/players/${playerId}`, {
        score: newScore,
        streak: 0,
        lastResult: 'wrong'
    });

    playSound('wrong');

    // Throw to other players (optional - simplified to next question)
    nextQuestion();
}

function showAttackMode(playerId) {
    gameState.phase = 'attack';
    gameState.attackerPlayer = playerId;

    const player = gameState.players[playerId];

    // Reset streak
    db.update(`games/${gameState.pin}/players/${playerId}`, {
        streak: 0
    });

    // Update database
    db.update(`games/${gameState.pin}`, {
        phase: 'attack',
        attackerPlayer: playerId
    });

    // Update UI
    document.getElementById('questionPhase').classList.add('hidden');
    document.getElementById('attackPhase').classList.remove('hidden');
    document.getElementById('gamePhase').textContent = 'Fase: Serangan';

    document.getElementById('attackerNameDisplay').textContent = player.name;

    // Show attack targets (handled by player)
    // Just wait for selection
}

function handleAttackSelection(targetId) {
    // Attack question will be shown automatically
    // This is handled in player.js
    setTimeout(() => {
        nextQuestion();
    }, 5000);
}

function nextQuestion() {
    if (gameState.questionCount >= getTotalQuestions()) {
        endGame();
        return;
    }

    // Reset to buzzer phase
    showBuzzerPhase();
}

function resetBuzzer() {
    showBuzzerPhase();
}

async function endGame() {
    await db.update(`games/${gameState.pin}`, {
        status: 'ended',
        phase: 'ended',
        endedAt: db.serverTimestamp()
    });

    // Show end panel
    document.getElementById('gamePanel').classList.add('hidden');
    document.getElementById('endPanel').classList.remove('hidden');

    // Show final scoreboard
    const scoreboard = Object.entries(gameState.players)
        .sort((a, b) => (b[1].score || 0) - (a[1].score || 0));

    const container = document.getElementById('finalScoreboard');
    container.innerHTML = '';

    scoreboard.forEach(([id, player], index) => {
        const div = document.createElement('div');
        div.className = 'final-rank';
        div.innerHTML = `
            <div class="rank-number">#${index + 1}</div>
            <div class="rank-name">${player.name}</div>
            <div class="rank-score">${player.score || 0} poin</div>
        `;
        container.appendChild(div);
    });
}
