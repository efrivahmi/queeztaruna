// Game State
let gameState = {
    groups: [],
    currentQuestion: null,
    currentGroup: null,
    usedQuestions: [],
    questionCount: 0,
    buzzerActive: false,
    attackMode: false,
    attackerGroup: null
};

// Question Bank
const questionBank = [
    { question: "Apa ibu kota Indonesia?", answer: "Jakarta" },
    { question: "Siapa presiden pertama Indonesia?", answer: "Soekarno" },
    { question: "Berapa hasil dari 15 × 8?", answer: "120" },
    { question: "Apa nama planet terdekat dengan matahari?", answer: "Merkurius" },
    { question: "Siapa penemu lampu?", answer: "Thomas Alva Edison" },
    { question: "Berapa jumlah provinsi di Indonesia?", answer: "38" },
    { question: "Apa bahasa resmi Jepang?", answer: "Bahasa Jepang" },
    { question: "Berapa hasil dari 144 ÷ 12?", answer: "12" },
    { question: "Siapa penulis novel Laskar Pelangi?", answer: "Andrea Hirata" },
    { question: "Apa nama ibukota Jepang?", answer: "Tokyo" },
    { question: "Berapa hasil dari 7²?", answer: "49" },
    { question: "Apa nama gunung tertinggi di Indonesia?", answer: "Puncak Jaya" },
    { question: "Siapa penemu telepon?", answer: "Alexander Graham Bell" },
    { question: "Apa nama benua terkecil di dunia?", answer: "Australia" },
    { question: "Berapa hasil dari √64?", answer: "8" },
    { question: "Apa nama laut terluas di dunia?", answer: "Laut Pasifik" },
    { question: "Siapa pelukis terkenal dari lukisan Mona Lisa?", answer: "Leonardo da Vinci" },
    { question: "Apa nama mata uang Jepang?", answer: "Yen" },
    { question: "Berapa jumlah pemain dalam satu tim sepak bola?", answer: "11" },
    { question: "Apa nama hewan tercepat di darat?", answer: "Cheetah" },
    { question: "Siapa presiden ke-2 Indonesia?", answer: "Soeharto" },
    { question: "Apa nama planet terbesar di tata surya?", answer: "Jupiter" },
    { question: "Berapa hasil dari 13 + 29?", answer: "42" },
    { question: "Apa nama sungai terpanjang di dunia?", answer: "Sungai Nil" },
    { question: "Siapa penemu pesawat terbang?", answer: "Wright Bersaudara" },
    { question: "Apa nama organ terbesar pada tubuh manusia?", answer: "Kulit" },
    { question: "Berapa hasil dari 25% dari 200?", answer: "50" },
    { question: "Apa nama ibukota Perancis?", answer: "Paris" },
    { question: "Siapa penemu komputer?", answer: "Charles Babbage" },
    { question: "Apa nama satelit alami bumi?", answer: "Bulan" }
];

// Audio Context for Buzzer Sound
let audioContext = null;

function playBuzzerSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio not supported:', error);
    }
}

function playSuccessSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // Second note
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.value = 659.25; // E5
        oscillator2.type = 'sine';

        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.45);

        oscillator2.start(audioContext.currentTime + 0.15);
        oscillator2.stop(audioContext.currentTime + 0.45);
    } catch (error) {
        console.log('Audio not supported:', error);
    }
}

function playErrorSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
        console.log('Audio not supported:', error);
    }
}

// Initialize group name inputs
document.getElementById('numGroups').addEventListener('input', function() {
    const num = parseInt(this.value);
    const container = document.getElementById('groupNames');
    container.innerHTML = '';

    for (let i = 1; i <= num; i++) {
        const div = document.createElement('div');
        div.className = 'group-name-input';
        div.innerHTML = `
            <div class="form-group">
                <label>Nama Kelompok ${i}:</label>
                <input type="text" id="groupName${i}" placeholder="Kelompok ${i}" value="Kelompok ${i}">
            </div>
        `;
        container.appendChild(div);
    }
});

// Trigger initial setup
document.getElementById('numGroups').dispatchEvent(new Event('input'));

function startGame() {
    const numGroups = parseInt(document.getElementById('numGroups').value);
    gameState.groups = [];

    for (let i = 1; i <= numGroups; i++) {
        const name = document.getElementById(`groupName${i}`).value || `Kelompok ${i}`;
        gameState.groups.push({
            id: i,
            name: name,
            score: 0,
            streak: 0
        });
    }

    document.getElementById('setupPanel').classList.add('hidden');
    document.getElementById('gamePanel').classList.remove('hidden');

    renderGroups();
    renderBuzzerButtons();
    updateGameStatus();
}

function renderGroups() {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';

    gameState.groups.forEach(group => {
        const div = document.createElement('div');
        div.className = 'group-card';
        div.id = `group-${group.id}`;

        let streakText = '';
        if (group.streak > 0) {
            streakText = `<div class="group-streak">🔥 Streak: ${group.streak}</div>`;
        }

        div.innerHTML = `
            <div class="group-name">${group.name}</div>
            <div class="group-score">${group.score}</div>
            ${streakText}
        `;
        container.appendChild(div);
    });
}

function renderBuzzerButtons() {
    const container = document.getElementById('buzzerButtons');
    container.innerHTML = '';

    gameState.groups.forEach(group => {
        const btn = document.createElement('button');
        btn.className = 'buzzer-btn';
        btn.textContent = group.name;
        btn.onclick = () => buzzerPressed(group.id);
        btn.id = `buzzer-${group.id}`;
        container.appendChild(btn);
    });

    gameState.buzzerActive = true;
}

function buzzerPressed(groupId) {
    if (!gameState.buzzerActive) return;

    playBuzzerSound();

    gameState.buzzerActive = false;
    gameState.currentGroup = gameState.groups.find(g => g.id === groupId);

    // Disable all buzzer buttons
    document.querySelectorAll('.buzzer-btn').forEach(btn => {
        btn.disabled = true;
    });

    // Show winner
    const winnerDiv = document.getElementById('buzzerWinner');
    winnerDiv.textContent = `${gameState.currentGroup.name} menekan buzzer!`;
    winnerDiv.classList.remove('hidden');

    // Highlight winner group
    document.querySelectorAll('.group-card').forEach(card => {
        card.classList.remove('winner');
    });
    document.getElementById(`group-${groupId}`).classList.add('winner');

    // Show question after delay
    setTimeout(() => {
        showRandomQuestion();
    }, 1500);
}

function showRandomQuestion() {
    // Get unused questions
    const availableQuestions = questionBank.filter(
        (q, index) => !gameState.usedQuestions.includes(index)
    );

    if (availableQuestions.length === 0) {
        alert('Semua soal sudah digunakan!');
        return;
    }

    // Select random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    const originalIndex = questionBank.indexOf(selectedQuestion);

    gameState.currentQuestion = selectedQuestion;
    gameState.usedQuestions.push(originalIndex);
    gameState.questionCount++;

    // Determine question type
    let questionType = 'Normal';
    if (gameState.attackMode) {
        questionType = 'SERANGAN';
    }

    // Show question section
    document.getElementById('questionType').textContent = questionType;
    document.getElementById('questionNumber').textContent = `Soal #${gameState.questionCount}`;
    document.getElementById('questionText').textContent = selectedQuestion.question;
    document.getElementById('userAnswer').value = '';
    document.getElementById('correctAnswer').classList.add('hidden');
    document.getElementById('questionSection').classList.remove('hidden');

    updateGameStatus();
}

function submitAnswer() {
    const userAnswer = document.getElementById('userAnswer').value.trim();
    if (!userAnswer) {
        alert('Silakan masukkan jawaban!');
        return;
    }

    const correctAnswer = gameState.currentQuestion.answer.toLowerCase();
    const isCorrect = userAnswer.toLowerCase() === correctAnswer ||
                     userAnswer.toLowerCase().includes(correctAnswer);

    if (isCorrect) {
        markCorrect();
    } else {
        markWrong();
    }
}

function markCorrect() {
    playSuccessSound();

    if (gameState.attackMode) {
        // Attack successful - reduce target score
        const targetGroup = gameState.groups.find(g => g.id === gameState.attackTarget);
        targetGroup.score = Math.max(0, targetGroup.score - 10);

        document.getElementById('correctAnswer').innerHTML =
            `<strong>✓ BENAR!</strong> ${gameState.currentGroup.name} berhasil menyerang! ${targetGroup.name} -10 poin!`;
        document.getElementById('correctAnswer').classList.remove('hidden');

        gameState.attackMode = false;
        document.getElementById('attackPanel').classList.add('hidden');

    } else {
        // Normal correct answer
        gameState.currentGroup.score += 10;
        gameState.currentGroup.streak += 1;

        document.getElementById('correctAnswer').innerHTML =
            `<strong>✓ BENAR!</strong> Jawaban: ${gameState.currentQuestion.answer}<br>+10 poin untuk ${gameState.currentGroup.name}!`;
        document.getElementById('correctAnswer').classList.remove('hidden');

        // Check for attack mode eligibility
        if (gameState.currentGroup.streak >= 3) {
            setTimeout(() => {
                showAttackMode();
            }, 2000);
            return;
        }
    }

    renderGroups();
}

function markWrong() {
    playErrorSound();

    if (gameState.attackMode) {
        // Attack failed
        document.getElementById('correctAnswer').innerHTML =
            `<strong>✗ SALAH!</strong> Jawaban yang benar: ${gameState.currentQuestion.answer}<br>Serangan gagal!`;
        document.getElementById('correctAnswer').classList.remove('hidden');

        gameState.attackMode = false;
        document.getElementById('attackPanel').classList.add('hidden');

    } else {
        // Normal wrong answer - reduce score and reset streak
        gameState.currentGroup.score = Math.max(0, gameState.currentGroup.score - 5);
        gameState.currentGroup.streak = 0;

        document.getElementById('correctAnswer').innerHTML =
            `<strong>✗ SALAH!</strong> Jawaban yang benar: ${gameState.currentQuestion.answer}<br>-5 poin untuk ${gameState.currentGroup.name}`;
        document.getElementById('correctAnswer').classList.remove('hidden');

        // Throw question to other groups
        setTimeout(() => {
            throwQuestionToOthers();
        }, 2000);
        return;
    }

    renderGroups();
}

function throwQuestionToOthers() {
    const otherGroups = gameState.groups.filter(g => g.id !== gameState.currentGroup.id);

    if (otherGroups.length === 0) {
        nextQuestion();
        return;
    }

    alert(`Soal dilempar ke kelompok lain! Siapa yang mau mencoba?`);

    // Reset buzzer for other groups only
    gameState.buzzerActive = true;

    document.querySelectorAll('.buzzer-btn').forEach(btn => {
        const btnGroupId = parseInt(btn.id.replace('buzzer-', ''));
        if (btnGroupId !== gameState.currentGroup.id) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    });

    document.getElementById('questionSection').classList.add('hidden');
    document.getElementById('buzzerWinner').classList.add('hidden');
}

function showAttackMode() {
    gameState.attackMode = true;
    gameState.attackerGroup = gameState.currentGroup;

    // Reset streak
    gameState.currentGroup.streak = 0;
    renderGroups();

    // Highlight attacker
    document.querySelectorAll('.group-card').forEach(card => {
        card.classList.remove('attacker');
    });
    document.getElementById(`group-${gameState.currentGroup.id}`).classList.add('attacker');

    // Show attack panel
    document.getElementById('attackerName').textContent = gameState.currentGroup.name;
    document.getElementById('attackPanel').classList.remove('hidden');
    document.getElementById('questionSection').classList.add('hidden');

    // Render attack targets
    const container = document.getElementById('attackTargets');
    container.innerHTML = '';

    gameState.groups.forEach(group => {
        if (group.id !== gameState.currentGroup.id) {
            const btn = document.createElement('button');
            btn.className = 'attack-target-btn';
            btn.textContent = `${group.name} (${group.score} poin)`;
            btn.onclick = () => selectAttackTarget(group.id);
            container.appendChild(btn);
        }
    });

    updateGameStatus();
}

function selectAttackTarget(targetId) {
    gameState.attackTarget = targetId;

    // Highlight attacked group
    document.querySelectorAll('.group-card').forEach(card => {
        card.classList.remove('attacked');
    });
    document.getElementById(`group-${targetId}`).classList.add('attacked');

    const targetGroup = gameState.groups.find(g => g.id === targetId);
    alert(`${gameState.currentGroup.name} menyerang ${targetGroup.name}!`);

    setTimeout(() => {
        showRandomQuestion();
    }, 1000);
}

function nextQuestion() {
    // Reset UI
    document.getElementById('questionSection').classList.add('hidden');
    document.getElementById('buzzerWinner').classList.add('hidden');
    document.getElementById('attackPanel').classList.add('hidden');

    document.querySelectorAll('.group-card').forEach(card => {
        card.classList.remove('winner', 'attacker', 'attacked');
    });

    gameState.currentGroup = null;
    gameState.currentQuestion = null;
    gameState.attackMode = false;

    resetBuzzer();
    updateGameStatus();
}

function resetBuzzer() {
    gameState.buzzerActive = true;

    document.querySelectorAll('.buzzer-btn').forEach(btn => {
        btn.disabled = false;
    });

    document.getElementById('buzzerWinner').classList.add('hidden');
    document.getElementById('questionSection').classList.add('hidden');
}

function resetGame() {
    if (confirm('Apakah Anda yakin ingin reset game?')) {
        gameState = {
            groups: [],
            currentQuestion: null,
            currentGroup: null,
            usedQuestions: [],
            questionCount: 0,
            buzzerActive: false,
            attackMode: false,
            attackerGroup: null
        };

        document.getElementById('gamePanel').classList.add('hidden');
        document.getElementById('setupPanel').classList.remove('hidden');

        // Re-trigger group name inputs
        document.getElementById('numGroups').dispatchEvent(new Event('input'));
    }
}

function updateGameStatus() {
    document.getElementById('questionCount').textContent =
        `Soal: ${gameState.questionCount}/${questionBank.length}`;

    let roundInfo = 'Putaran Normal';
    if (gameState.attackMode) {
        roundInfo = '⚔️ MODE SERANGAN';
    }
    document.getElementById('roundInfo').textContent = roundInfo;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('userAnswer') === document.activeElement) {
        submitAnswer();
    }
});
