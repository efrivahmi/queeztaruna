// Question Bank - Database Soal Kuis
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
    { question: "Apa nama satelit alami bumi?", answer: "Bulan" },
    { question: "Berapa hasil dari 9 × 9?", answer: "81" },
    { question: "Apa nama benua terbesar di dunia?", answer: "Asia" },
    { question: "Siapa pengarang novel Harry Potter?", answer: "J.K. Rowling" },
    { question: "Berapa hasil dari 100 - 37?", answer: "63" },
    { question: "Apa nama ibu kota Malaysia?", answer: "Kuala Lumpur" },
    { question: "Siapa penemu radio?", answer: "Guglielmo Marconi" },
    { question: "Berapa hasil dari 8 + 12?", answer: "20" },
    { question: "Apa nama planet yang memiliki cincin?", answer: "Saturnus" },
    { question: "Siapa pelukis terkenal asal Indonesia?", answer: "Raden Saleh" },
    { question: "Berapa hasil dari 50 ÷ 5?", answer: "10" },
    { question: "Apa nama sungai terpanjang di Indonesia?", answer: "Sungai Kapuas" },
    { question: "Siapa presiden ketiga Indonesia?", answer: "BJ Habibie" },
    { question: "Berapa hasil dari 6 × 7?", answer: "42" },
    { question: "Apa nama ibukota Thailand?", answer: "Bangkok" },
    { question: "Siapa penemu mesin uap?", answer: "James Watt" },
    { question: "Berapa jumlah benua di dunia?", answer: "7" },
    { question: "Apa nama lautan terkecil di dunia?", answer: "Lautan Arktik" },
    { question: "Berapa hasil dari 10²?", answer: "100" },
    { question: "Apa nama mata uang Amerika Serikat?", answer: "Dollar" },
    { question: "Siapa penemu telepon genggam (HP)?", answer: "Martin Cooper" }
];

// Get random question that hasn't been used
function getRandomQuestion(usedIndices = []) {
    const availableQuestions = questionBank.filter((q, index) => !usedIndices.includes(index));

    if (availableQuestions.length === 0) {
        return null; // No more questions
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    const originalIndex = questionBank.indexOf(selectedQuestion);

    return {
        question: selectedQuestion.question,
        answer: selectedQuestion.answer,
        index: originalIndex
    };
}

// Check if answer is correct (flexible matching)
function checkAnswer(userAnswer, correctAnswer) {
    const normalize = (str) => {
        return str.toLowerCase()
            .trim()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .replace(/\s+/g, " ");
    };

    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);

    // Exact match
    if (normalizedUser === normalizedCorrect) {
        return true;
    }

    // Contains correct answer
    if (normalizedUser.includes(normalizedCorrect)) {
        return true;
    }

    // Correct answer contains user answer (for longer answers)
    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length >= 3) {
        return true;
    }

    return false;
}

// Get total number of questions
function getTotalQuestions() {
    return questionBank.length;
}

// Shuffle questions
function shuffleQuestions() {
    const shuffled = [...questionBank];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
