
// FIX: Declare global variables for ohm and io to resolve 'Cannot find name' errors.
declare var ohm: any;
declare var io: any;

// --- STATE MANAGEMENT ---
const state = {
    gameMode: null, // 'single', 'multi', 'quiz'
    // Card Game State
    proficiency: 'easy',
    currentQuestionIndex: 0,
    totalQuestions: 0,
    score: 0,
    timer: 50,
    timerInterval: null,
    currentWords: [],
    // Multiplayer State
    playerData: { id: null, nickname: '', score: 0, groupCode: null },
    groupCode: null,
    players: [],
    socket: null,
    // Quiz State
    quizProficiency: 'easy',
    currentQuizQuestionIndex: 0,
    quizScore: 0,
    quizQuestions: [],
};

// --- DOM ELEMENTS ---
const elements = {
    gameContainer: document.getElementById('game-container'),
    // Views
    gameView: document.getElementById('game-view'),
    quizView: document.getElementById('quiz-view'),
    // Modals
    modeModal: document.getElementById('mode-modal-overlay'),
    playerSetupModal: document.getElementById('player-setup-modal-overlay'),
    quizSetupModal: document.getElementById('quiz-setup-modal-overlay'),
    multiplayerModal: document.getElementById('multiplayer-modal-overlay'),
    multiplayerProficiencyModal: document.getElementById('multiplayer-proficiency-modal-overlay'),
    waitingRoomModal: document.getElementById('waiting-room-modal-overlay'),
    gameOverModal: document.getElementById('game-over-modal-overlay'),
    // Mode Buttons
    singlePlayerBtn: document.getElementById('single-player-mode-btn'),
    multiplayerBtn: document.getElementById('multiplayer-mode-btn'),
    quizBtn: document.getElementById('quiz-mode-btn'),
    // Card Game Elements
    gameSubtitle: document.getElementById('game-subtitle'),
    targetGrammar: document.getElementById('target-grammar'),
    levelIndicator: document.getElementById('level-indicator'),
    questionIndicator: document.getElementById('question-indicator'),
    progressBar: document.getElementById('progress-bar'),
    sentenceTray: document.getElementById('sentence-tray'),
    wordPool: document.getElementById('word-pool'),
    feedbackArea: document.getElementById('feedback-area'),
    checkBtn: document.getElementById('check-btn'),
    resetBtn: document.getElementById('reset-btn'),
    timerDisplay: document.getElementById('timer'),
    // Typing Game Elements
    typingChallengeContainer: document.getElementById('typing-challenge-container'),
    typingPrompt: document.getElementById('typing-prompt'),
    typingWordSet: document.getElementById('typing-word-set'),
    typingInput: document.getElementById('typing-input'),
    // Single Player Setup
    proficiencyBtns: document.querySelectorAll('.proficiency-btn'),
    resumeGameContainer: document.getElementById('resume-game-container'),
    resumeGameBtn: document.getElementById('resume-game-btn'),
    backFromSetupBtn: document.getElementById('back-from-setup-btn'),
    // Quiz Setup
    quizProficiencyBtns: document.querySelectorAll('.quiz-proficiency-btn'),
    backFromQuizSetupBtn: document.getElementById('back-from-quiz-setup-btn'),
    // Multiplayer Elements
    nicknameInput: document.getElementById('nickname-input'),
    groupCodeInput: document.getElementById('group-code-input'),
    joinGroupBtn: document.getElementById('join-group-btn'),
    createGroupBtn: document.getElementById('create-group-btn'),
    multiplayerFeedback: document.getElementById('multiplayer-feedback'),
    groupCodeDisplay: document.querySelector('#group-code-display strong'),
    waitingPlayerList: document.getElementById('waiting-room-player-list'),
    startGameBtn: document.getElementById('start-game-btn'),
    multiplayerScoreboard: document.getElementById('multiplayer-scoreboard'),
    playerScoresList: document.getElementById('player-scores'),
    multiplayerCreateTab: document.getElementById('multiplayer-create-tab'),
    multiplayerJoinTab: document.getElementById('multiplayer-join-tab'),
    backFromMultiplayerBtn: document.getElementById('back-from-multiplayer-btn'),
    multiplayerProficiencyBtns: document.querySelectorAll('.multiplayer-proficiency-btn'),
    backFromMultiplayerProficiencyBtn: document.getElementById('back-from-multiplayer-proficiency-btn'),
    backFromWaitingBtn: document.getElementById('back-from-waiting-btn'),
    // Game Over Modal
    gameOverTitle: document.getElementById('game-over-title'),
    gameOverMessage: document.getElementById('game-over-message'),
    finalScore: document.getElementById('final-score'),
    playAgainBtn: document.getElementById('play-again-btn'),
    // Quiz Elements
    quizLevelIndicator: document.getElementById('quiz-level-indicator'),
    quizQuestionIndicator: document.getElementById('quiz-question-indicator'),
    quizProgressBar: document.getElementById('quiz-progress-bar'),
    quizQuestionText: document.getElementById('quiz-question-text'),
    quizOptionsArea: document.getElementById('quiz-options-area'),
    quizFeedbackArea: document.getElementById('quiz-feedback-area'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    // Menu Buttons
    backToMenuBtn: document.getElementById('back-to-menu-btn'),
    quizBackToMenuBtn: document.getElementById('quiz-back-to-menu-btn'),
};

// --- OHM.JS GRAMMAR ---
// FIX: Added 'declare var ohm: any;' at the top of the file to resolve 'Cannot find name 'ohm'' error.
const grammar = ohm.grammar(document.getElementById('grammar').textContent);

// --- GAME & QUIZ DATA ---
const levels = {
    easy: [
        { 
            rule: "Determiner_Noun_Verb_Punctuation",
            displayRule: 'Subject - Verb - Punctuation', 
            words: [{word: "The", type: "Determiner"}, {word: "dog", type: "Noun"}, {word: "runs", type: "Verb"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Pronoun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Subject - Verb - Object - Punctuation', 
            words: [{word: "She", type: "Pronoun"}, {word: "ate", type: "Verb"}, {word: "an", type: "Determiner"}, {word: "apple", type: "Noun"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Determiner_Noun_Verb_Punctuation",
            displayRule: 'Subject - Verb - Punctuation', 
            words: [{word: "A", type: "Determiner"}, {word: "cat", type: "Noun"}, {word: "slept", type: "Verb"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Pronoun_Verb_Adjective_Punctuation",
            displayRule: 'Subject - Verb - Adjective - Punctuation', 
            words: [{word: "They", type: "Pronoun"}, {word: "are", type: "Verb"}, {word: "happy", type: "Adjective"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Pronoun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Subject - Verb - Object - Punctuation', 
            words: [{word: "He", type: "Pronoun"}, {word: "kicked", type: "Verb"}, {word: "the", type: "Determiner"}, {word: "ball", type: "Noun"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Noun_Verb_Punctuation",
            displayRule: 'Subject - Verb - Punctuation', 
            words: [{word: "Birds", type: "Noun"}, {word: "fly", type: "Verb"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Determiner_Noun_Verb_Punctuation",
            displayRule: 'Subject - Verb - Punctuation', 
            words: [{word: "The", type: "Determiner"}, {word: "wind", type: "Noun"}, {word: "howled", type: "Verb"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Determiner_Noun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Subject - Verb - Object - Punctuation', 
            words: [{word: "The", type: "Determiner"}, {word: "girl", type: "Noun"}, {word: "wrote", type: "Verb"}, {word: "a", type: "Determiner"}, {word: "letter", type: "Noun"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Pronoun_Verb_Adjective_Punctuation",
            displayRule: 'Subject - Verb - Adjective - Punctuation', 
            words: [{word: "I", type: "Pronoun"}, {word: "am", type: "Verb"}, {word: "tired", type: "Adjective"}, {word: ".", type: "Punctuation"}] 
        },
        { 
            rule: "Pronoun_Verb_Adjective_Noun_Punctuation",
            displayRule: 'Subject - Verb - Object - Punctuation', 
            words: [{word: "We", type: "Pronoun"}, {word: "play", type: "Verb"}, {word: "video", type: "Adjective"}, {word: "games", type: "Noun"}, {word: ".", type: "Punctuation"}] 
        },
    ],
    medium: [
        // Prompt 1: Subordinate Clause
        { 
            rule: "Conjunction_Pronoun_Verb_Adjective_Comma_Pronoun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Complex Sentence: Subordinate Clause', 
            words: [
                {word: "Although", type: "Conjunction"}, {word: "he", type: "Pronoun"}, {word: "was", type: "Verb"}, 
                {word: "tired", type: "Adjective"}, {word: ",", type: "Comma"}, {word: "he", type: "Pronoun"}, 
                {word: "finished", type: "Verb"}, {word: "the", type: "Determiner"}, {word: "project", type: "Noun"}, 
                {word: ".", type: "Punctuation"}
            ] 
        },
        // Prompt 2: Conditional Sentence
        { 
            rule: "Conjunction_Pronoun_Verb_Comma_Pronoun_Verb_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Conditional Sentence (using "Unless")', 
            words: [
                {word: "Unless", type: "Conjunction"}, {word: "you", type: "Pronoun"}, {word: "study", type: "Verb"}, 
                {word: ",", type: "Comma"}, {word: "you", type: "Pronoun"}, {word: "will", type: "Verb"}, 
                {word: "fail", type: "Verb"}, {word: "the", type: "Determiner"}, {word: "exam", type: "Noun"}, 
                {word: ".", type: "Punctuation"}
            ]
        },
        // Prompt 3: Past Perfect Tense
        { 
            rule: "Pronoun_Verb_Verb_Possessive_Noun_Preposition_Noun_Punctuation",
            displayRule: 'Sentence with Past Perfect Tense', 
            words: [
                {word: "She", type: "Pronoun"}, {word: "had", type: "Verb"}, {word: "finished", type: "Verb"}, 
                {word: "her", type: "Possessive"}, {word: "homework", type: "Noun"}, {word: "before", type: "Preposition"}, 
                {word: "dinner", type: "Noun"}, {word: ".", type: "Punctuation"}
            ] 
        },
        // Prompt 4: Interrogative Sentence
        { 
            rule: "Adverb_Verb_Pronoun_Verb_Conjunction_Determiner_Noun_Verb_Punctuation",
            displayRule: 'Interrogative with Subordinate Clause', 
            words: [
                {word: "Why", type: "Adverb"}, {word: "did", type: "Verb"}, {word: "you", type: "Pronoun"}, 
                {word: "leave", type: "Verb"}, {word: "before", type: "Conjunction"}, {word: "the", type: "Determiner"}, 
                {word: "party", type: "Noun"}, {word: "ended", type: "Verb"}, {word: "?", type: "Punctuation"}
            ] 
        },
        // Prompt 5: Sentence begins with "Although..."
        { 
            rule: "Conjunction_Pronoun_Verb_Ving_Comma_Pronoun_Verb_Adverb_Punctuation",
            displayRule: 'Sentence starting with "Although"', 
            words: [
                {word: "Although", type: "Conjunction"}, {word: "it", type: "Pronoun"}, {word: "was", type: "Verb"}, 
                {word: "raining", type: "Ving"}, {word: ",", type: "Comma"}, {word: "we", type: "Pronoun"}, 
                {word: "played", type: "Verb"}, {word: "outside", type: "Adverb"}, {word: ".", type: "Punctuation"}
            ]
        },
        // Prompt 6: Two clauses joined by "because"
        { 
            rule: "Pronoun_Verb_Adjective_Conjunction_Possessive_Noun_Verb_Adverb_Punctuation",
            displayRule: 'Two clauses joined by "because"', 
            words: [
                {word: "He", type: "Pronoun"}, {word: "was", type: "Verb"}, {word: "late", type: "Adjective"}, 
                {word: "because", type: "Conjunction"}, {word: "his", type: "Possessive"}, {word: "car", type: "Noun"}, 
                {word: "broke", type: "Verb"}, {word: "down", type: "Adverb"}, {word: ".", type: "Punctuation"}
            ]
        },
        // Prompt 7: Relative Clause
        { 
            rule: "Determiner_Noun_Pronoun_Verb_Determiner_Noun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Sentence with a Relative Clause (who/which)', 
            words: [
                {word: "The", type: "Determiner"}, {word: "artist", type: "Noun"}, {word: "who", type: "Pronoun"}, 
                {word: "created", type: "Verb"}, {word: "the", type: "Determiner"}, {word: "painting", type: "Noun"}, 
                {word: "inspired", type: "Verb"}, {word: "the", type: "Determiner"}, {word: "audience", type: "Noun"}, 
                {word: ".", type: "Punctuation"}
            ]
        },
        // Prompt 8: Subject with two actions
        { 
            rule: "Determiner_Noun_Verb_Conjunction_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Subject performing two actions', 
            words: [
                {word: "The", type: "Determiner"}, {word: "student", type: "Noun"}, {word: "studied", type: "Verb"}, 
                {word: "and", type: "Conjunction"}, {word: "wrote", type: "Verb"}, {word: "the", type: "Determiner"}, 
                {word: "essay", type: "Noun"}, {word: ".", type: "Punctuation"}
            ]
        },
        // Prompt 9: Adverbial clause
        { 
            rule: "Conjunction_Determiner_Noun_Verb_Comma_Possessive_Noun_Verb_Punctuation",
            displayRule: 'Sentence with Adverbial Clause of Time', 
            words: [
                {word: "After", type: "Conjunction"}, {word: "the", type: "Determiner"}, {word: "storm", type: "Noun"}, 
                {word: "passed", type: "Verb"}, {word: ",", type: "Comma"}, {word: "our", type: "Possessive"}, 
                {word: "power", type: "Noun"}, {word: "returned", type: "Verb"}, {word: ".", type: "Punctuation"}
            ]
        },
        // Prompt 10: Two clauses joined by "but"
        { 
            rule: "Pronoun_Verb_Determiner_Noun_Conjunction_Pronoun_Verb_Adjective_Punctuation",
            displayRule: 'Two clauses joined by "but"', 
            words: [
                {word: "She", type: "Pronoun"}, {word: "wanted", type: "Verb"}, {word: "the", type: "Determiner"}, 
                {word: "dress", type: "Noun"}, {word: "but", type: "Conjunction"}, {word: "it", type: "Pronoun"}, 
                {word: "was", type: "Verb"}, {word: "expensive", type: "Adjective"}, {word: ".", type: "Punctuation"}
            ]
        }
    ],
    hard: [
        {
            prompt: "Describe the process of photosynthesis using the following words. Be sure to form a complete, grammatically correct sentence.",
            words: ["plants", "sunlight", "water", "carbon-dioxide", "oxygen", "energy", "convert"],
            rule: "Hard_Complex_Subordinate" // This rule is just a placeholder for validation logic
        },
        {
            prompt: "Explain the importance of recycling using the words provided. Construct a single, well-formed sentence.",
            words: ["recycling", "reduces", "waste", "conserves", "resources", "protects", "environment"],
            rule: "Hard_Because_Join"
        },
        {
            prompt: "Using the words below, write a sentence that explains a consequence of not getting enough sleep.",
            words: ["sleep-deprivation", "impairs", "cognitive", "function", "concentration", "affects", "mood"],
            rule: "Hard_Relative_Clause"
        },
        {
            prompt: "Construct a sentence about the solar system using the following words.",
            words: ["Earth", "planets", "revolve", "around", "sun", "gravity", "holds"],
            rule: "Hard_Two_Actions"
        },
        {
            prompt: "Form a sentence that describes the water cycle using the given vocabulary.",
            words: ["water", "evaporates", "condenses", "clouds", "precipitation", "forms", "returns"],
            rule: "Hard_Adverbial_Time"
        },
        {
            prompt: "Write a sentence explaining the function of the heart in the human body with the provided words.",
            words: ["heart", "pumps", "blood", "throughout", "body", "delivering", "oxygen"],
            rule: "Hard_Complex_Subordinate"
        },
        {
            prompt: "Using the following words, create a sentence that describes the impact of technology on communication.",
            words: ["technology", "revolutionized", "communication", "making", "world", "more", "connected"],
            rule: "Hard_Because_Join"
        },
        {
            prompt: "Construct a sentence about the benefits of a balanced diet using the words given.",
            words: ["balanced-diet", "provides", "essential", "nutrients", "maintains", "health", "prevents-disease"],
            rule: "Hard_Two_Actions"
        },
        {
            prompt: "Form a sentence that explains the concept of supply and demand with the vocabulary below.",
            words: ["supply", "demand", "determine", "price", "goods", "services", "market"],
            rule: "Hard_Relative_Clause"
        },
        {
            prompt: "Write a sentence describing the role of bees in pollination using the provided words.",
            words: ["bees", "play", "crucial", "role", "pollinating", "flowers", "enabling-reproduction"],
            rule: "Hard_Adverbial_Time"
        }
    ]
};

const quizData = {
    easy: [
        { question: "Which word is a noun?", options: ["run", "quickly", "book", "happy"], answer: "book" },
        { question: "Identify the verb in the sentence: 'The cat sleeps.'", options: ["The", "cat", "sleeps", "."], answer: "sleeps" },
        { question: "Which of the following is an adjective?", options: ["eat", "beautiful", "she", "soundly"], answer: "beautiful" },
        { question: "Choose the pronoun in the sentence: 'He threw the ball.'", options: ["threw", "the", "ball", "He"], answer: "He" },
        { question: "What is the subject of the sentence: 'Dogs bark loudly.'?", options: ["Dogs", "bark", "loudly", "."], answer: "Dogs" },
        { question: "Find the determiner: 'An apple a day keeps the doctor away.'", options: ["apple", "day", "away", "An"], answer: "An" },
        { question: "Which word completes the sentence correctly? 'They ___ playing in the park.'", options: ["is", "are", "am", "be"], answer: "are" },
        { question: "Identify the punctuation mark that ends a question.", options: [".", ",", "!", "?"], answer: "?" },
        { question: "Which word is an adverb? 'The turtle walks slowly.'", options: ["turtle", "walks", "the", "slowly"], answer: "slowly" },
        { question: "What part of speech is 'and'?", options: ["Verb", "Preposition", "Conjunction", "Adjective"], answer: "Conjunction" }
    ],
    medium: [
        { question: "Identify the preposition in the sentence: 'The book is on the table.'", options: ["book", "is", "on", "table"], answer: "on" },
        { question: "What type of sentence is this? 'Although it was raining, we went for a walk.'", options: ["Simple", "Compound", "Complex", "Imperative"], answer: "Complex" },
        { question: "Which sentence uses the past perfect tense correctly?", options: ["He has finished his work.", "He had finished his work before she arrived.", "He will finish his work.", "He is finishing his work."], answer: "He had finished his work before she arrived." },
        { question: "Find the subordinate clause: 'I will call you when I get home.'", options: ["I will call you", "when I get home", "call you when", "I will"], answer: "when I get home" },
        { question: "Which conjunction best joins these two clauses? 'She studied hard, ___ she passed the exam.'", options: ["but", "or", "so", "if"], answer: "so" },
        { question: "Identify the relative pronoun: 'The man who called you is my brother.'", options: ["man", "who", "is", "my"], answer: "who" },
        { question: "What is the function of the comma in this sentence? 'After the movie, we went for ice cream.'", options: ["To separate items in a list", "To join two independent clauses", "To separate an introductory clause", "To show possession"], answer: "To separate an introductory clause" },
        { question: "Which of the following is a compound sentence?", options: ["The sun is shining.", "I like tea, and he likes coffee.", "Because he was tired, he went to bed.", "What a beautiful day!"], answer: "I like tea, and he likes coffee." },
        { question: "Identify the adverbial phrase: 'He ran with great speed.'", options: ["He ran", "with great speed", "great speed", "ran with"], answer: "with great speed" },
        { question: "Choose the correct form of the verb: 'Neither of the students ___ the answer.'", options: ["know", "knows", "have known", "are knowing"], answer: "knows" }
    ],
    hard: [
        { question: "What is the grammatical mood of this sentence? 'If I were you, I would apologize.'", options: ["Indicative", "Imperative", "Subjunctive", "Interrogative"], answer: "Subjunctive" },
        { question: "Identify the participle phrase: 'Having finished her homework, she watched a movie.'", options: ["she watched a movie", "a movie", "Having finished her homework", "her homework"], answer: "Having finished her homework" },
        { question: "Which of these sentences contains a dangling modifier?", options: ["Walking down the street, the trees were beautiful.", "The trees were beautiful as I walked down the street.", "While I was walking down the street, I saw beautiful trees.", "The beautiful trees lined the street I walked down."], answer: "Walking down the street, the trees were beautiful." },
        { question: "What is the function of 'that' in the sentence: 'The rumor that he was leaving spread quickly.'?", options: ["Relative Pronoun", "Demonstrative Pronoun", "Conjunction", "Appositive Conjunction"], answer: "Appositive Conjunction" },
        { question: "Identify the sentence with correct parallel structure.", options: ["She likes to swim, hiking, and to ride a bike.", "She likes swimming, hiking, and to ride a bike.", "She likes swimming, hiking, and riding a bike.", "She likes to swim, to hike, and riding a bike."], answer: "She likes swimming, hiking, and riding a bike." },
        { question: "What type of clause is underlined? '<u>Whoever wins the race</u> will receive a prize.'", options: ["Adjective Clause", "Adverb Clause", "Noun Clause", "Independent Clause"], answer: "Noun Clause" },
        { question: "Which sentence correctly uses an em dash?", options: ["The verdict-a surprise to everyone-was not guilty.", "The verdict, a surprise to everyone was not guilty.", "The verdict (a surprise to everyone) was not guilty.", "The verdict a surprise to everyone was not guilty."], answer: "The verdict-a surprise to everyone-was not guilty." },
        { question: "An 'antecedent' is the word that a ___ refers to.", options: ["verb", "adjective", "pronoun", "preposition"], answer: "pronoun" },
        { question: "Identify the literary device used in the phrase 'deafening silence'.", options: ["Metaphor", "Simile", "Oxymoron", "Hyperbole"], answer: "Oxymoron" },
        { question: "What is the error in this sentence? 'The reason is because he was late.'", options: ["Split infinitive", "Redundancy", "Comma splice", "Subject-verb disagreement"], answer: "Redundancy" }
    ]
};


// --- UTILITY FUNCTIONS ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showModal(modal) {
    if(modal) modal.style.display = 'flex';
}

function hideModal(modal) {
    if(modal) modal.style.display = 'none';
}

// --- TIMER FUNCTIONS ---
function startTimer() {
    stopTimer();
    state.timer = 50;
    updateTimerDisplay();
    state.timerInterval = setInterval(() => {
        state.timer--;
        updateTimerDisplay();
        if (state.timer <= 0) {
            stopTimer();
            checkAnswer(true); // Auto-check answer when time is up
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(state.timerInterval);
}

function updateTimerDisplay() {
    if (elements.timerDisplay) elements.timerDisplay.textContent = `Time: ${state.timer}`;
}


// --- UI UPDATE FUNCTIONS ---
function updateProgressBar(current, total) {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    if(elements.progressBar) elements.progressBar.style.width = `${percentage}%`;
    if(elements.quizProgressBar) elements.quizProgressBar.style.width = `${percentage}%`;
}

function displayFeedback(message, isCorrect) {
    if (!elements.feedbackArea) return;
    elements.feedbackArea.textContent = message;
    elements.feedbackArea.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
}

function clearFeedback() {
    if(elements.feedbackArea) {
        elements.feedbackArea.textContent = '';
        elements.feedbackArea.className = '';
    }
    if(elements.quizFeedbackArea) {
        elements.quizFeedbackArea.textContent = '';
    }
}

// --- DRAG & DROP LOGIC ---
let draggedElement = null;

function dragStart(e) {
    draggedElement = e.target;
    setTimeout(() => {
        (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
}

function dragEnd(e) {
    (e.target as HTMLElement).style.opacity = '1';
    draggedElement = null;
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const droppable = (e.target as HTMLElement).closest('.droppable');
    if (droppable) {
        droppable.classList.add('drag-over');
    }
}

function dragLeave(e) {
    const droppable = (e.target as HTMLElement).closest('.droppable');
    if (droppable) {
        droppable.classList.remove('drag-over');
    }
}

function drop(e) {
    e.preventDefault();
    const droppable = (e.target as HTMLElement).closest('.droppable');
    if (droppable && draggedElement) {
        droppable.classList.remove('drag-over');
        // If dropping on another tile, insert before it
        if ((e.target as HTMLElement).classList.contains('word-tile') && e.target !== draggedElement) {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const nextSibling = (e.clientX - rect.left) > (rect.width / 2) ? (e.target as HTMLElement).nextSibling : e.target;
            droppable.insertBefore(draggedElement, nextSibling as Node);
        } else {
            droppable.appendChild(draggedElement);
        }
    }
}

// --- CARD GAME LOGIC ---
function createWordTile(wordData) {
    const tile = document.createElement('div');
    tile.classList.add('word-tile');
    tile.textContent = wordData.word;
    tile.dataset.type = wordData.type;
    tile.draggable = true;
    tile.addEventListener('dragstart', dragStart);
    tile.addEventListener('dragend', dragEnd);
    return tile;
}

function setupQuestion() {
    clearFeedback();
    const levelData = levels[state.proficiency];
    state.totalQuestions = levelData.length;
    const question = levelData[state.currentQuestionIndex];
    state.currentWords = [...question.words];

    if (elements.levelIndicator) elements.levelIndicator.textContent = `Proficiency: ${state.proficiency.charAt(0).toUpperCase() + state.proficiency.slice(1)}`;
    if (elements.questionIndicator) elements.questionIndicator.textContent = `Question: ${state.currentQuestionIndex + 1}/${state.totalQuestions}`;
    updateProgressBar(state.currentQuestionIndex, state.totalQuestions);

    // Show/hide appropriate game UI
    if (state.proficiency === 'hard') {
        if(elements.typingChallengeContainer) elements.typingChallengeContainer.style.display = 'block';
        if(elements.sentenceTray) elements.sentenceTray.style.display = 'none';
        if(elements.wordPool) elements.wordPool.style.display = 'none';
        setupTypingChallenge(question);
    } else {
        if(elements.typingChallengeContainer) elements.typingChallengeContainer.style.display = 'none';
        if(elements.sentenceTray) elements.sentenceTray.style.display = 'flex';
        if(elements.wordPool) elements.wordPool.style.display = 'flex';
        
        if (elements.targetGrammar) elements.targetGrammar.textContent = question.displayRule;
        if (elements.sentenceTray) elements.sentenceTray.innerHTML = '';
        if (elements.wordPool) elements.wordPool.innerHTML = '';
        
        shuffleArray(state.currentWords);
        state.currentWords.forEach(wordData => {
            const tile = createWordTile(wordData);
            elements.wordPool.appendChild(tile);
        });
    }

    if (elements.checkBtn) (elements.checkBtn as HTMLButtonElement).disabled = false;
    if (state.gameMode !== 'multi') {
        startTimer();
    }
}

function setupTypingChallenge(question) {
    if (elements.typingPrompt) elements.typingPrompt.textContent = question.prompt;
    const shuffledWords = [...question.words].sort(() => Math.random() - 0.5);
    if (elements.typingWordSet) elements.typingWordSet.textContent = shuffledWords.join(', ');
    if (elements.typingInput) {
        // FIX: Cast 'elements.typingInput' to HTMLInputElement to access 'value' property.
        (elements.typingInput as HTMLInputElement).value = '';
        elements.typingInput.focus();
    }
}


function checkAnswer(timedOut = false) {
    if (timedOut && state.timer > 0) return; // Don't check if not actually timed out
    stopTimer();
    
    let isCorrect;
    const levelData = levels[state.proficiency];
    const question = levelData[state.currentQuestionIndex];

    if (state.proficiency === 'hard') {
        // FIX: Cast 'elements.typingInput' to HTMLInputElement to access 'value' property.
        const userInput = (elements.typingInput as HTMLInputElement).value.trim().toLowerCase();
        // Simple check: see if all required words are present
        isCorrect = question.words.every(word => userInput.includes(word.toLowerCase()));
        if (isCorrect) {
            displayFeedback("Excellent! You used all the required words correctly.", true);
        } else {
             displayFeedback("Not quite. Make sure you use all the words from the set.", false);
        }
    } else {
        const sentenceTiles = elements.sentenceTray.querySelectorAll('.word-tile');
        // FIX: Cast 'tile' to HTMLElement to access 'dataset' property. This is likely the fix for the misreported error on line 551.
        const submittedTypes = Array.from(sentenceTiles).map(tile => (tile as HTMLElement).dataset.type);
        const submittedSentence = submittedTypes.join('_');
        
        const semantics = grammar.createSemantics().addOperation('eval', {});
        const match = grammar.match(submittedSentence, question.rule);
        
        isCorrect = match.succeeded();
        
        if (isCorrect) {
            displayFeedback("Correct! Well done.", true);
        } else {
            displayFeedback("Not quite right. Try again!", false);
        }
    }
    
    if (isCorrect) {
        state.score += 10 + Math.max(0, state.timer);
        if (state.gameMode === 'multi' && state.socket) {
            state.playerData.score = state.score;
            state.socket.emit('updateScore', state.playerData);
        }
        
        // FIX: Cast 'elements.checkBtn' to HTMLButtonElement to access 'disabled' property.
        if (elements.checkBtn) (elements.checkBtn as HTMLButtonElement).disabled = true;
        
        setTimeout(() => {
            state.currentQuestionIndex++;
            if (state.currentQuestionIndex < state.totalQuestions) {
                setupQuestion();
            } else {
                endGame(true);
            }
        }, 2000);
    } else {
        if(timedOut) {
            displayFeedback("Time's up! Moving to the next question.", false);
            setTimeout(() => {
                state.currentQuestionIndex++;
                if (state.currentQuestionIndex < state.totalQuestions) {
                    setupQuestion();
                } else {
                    endGame(false);
                }
            }, 2000);
        }
    }
}


function resetWordPositions() {
    if (!elements.wordPool || !elements.sentenceTray) return;
    elements.wordPool.innerHTML = '';
    elements.sentenceTray.innerHTML = '';
    clearFeedback();

    shuffleArray(state.currentWords);
    state.currentWords.forEach(wordData => {
        const tile = createWordTile(wordData);
        elements.wordPool.appendChild(tile);
    });
}

function startGame(proficiency) {
    state.proficiency = proficiency;
    state.currentQuestionIndex = 0;
    state.score = 0;
    
    if (state.gameMode === 'multi') {
        if(elements.multiplayerScoreboard) elements.multiplayerScoreboard.style.display = 'block';
        if(elements.timerDisplay) elements.timerDisplay.style.display = 'none';
        updatePlayerScores(state.players);
    } else {
        if(elements.multiplayerScoreboard) elements.multiplayerScoreboard.style.display = 'none';
        if(elements.timerDisplay) elements.timerDisplay.style.display = 'block';
    }
    
    hideModal(elements.modeModal);
    hideModal(elements.playerSetupModal);
    hideModal(elements.waitingRoomModal);
    hideModal(elements.multiplayerProficiencyModal);
    if(elements.gameContainer) elements.gameContainer.style.display = 'block';
    if(elements.gameView) elements.gameView.style.display = 'block';
    if(elements.quizView) elements.quizView.style.display = 'none';
    
    setupQuestion();
}

function endGame(completed) {
    stopTimer();
    if(elements.gameOverTitle) elements.gameOverTitle.textContent = completed ? "Level Complete!" : "Game Over";
    if(elements.gameOverMessage) elements.gameOverMessage.textContent = completed 
        ? "You've successfully answered all questions." 
        : "You've completed the session.";
    if(elements.finalScore) elements.finalScore.textContent = state.score.toString();
    showModal(elements.gameOverModal);
}

function backToMenu() {
    stopTimer();
    state.gameMode = null;
    if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
    }

    hideModal(elements.playerSetupModal);
    hideModal(elements.quizSetupModal);
    hideModal(elements.multiplayerModal);
    hideModal(elements.waitingRoomModal);
    hideModal(elements.gameOverModal);
    hideModal(elements.multiplayerProficiencyModal);
    if(elements.gameContainer) elements.gameContainer.style.display = 'none';
    showModal(elements.modeModal);
}

// --- QUIZ LOGIC ---
function startQuiz(proficiency) {
    state.quizProficiency = proficiency;
    state.currentQuizQuestionIndex = 0;
    state.quizScore = 0;
    state.quizQuestions = [...quizData[proficiency]];
    shuffleArray(state.quizQuestions);

    hideModal(elements.quizSetupModal);
    if(elements.gameContainer) elements.gameContainer.style.display = 'block';
    if(elements.gameView) elements.gameView.style.display = 'none';
    if(elements.quizView) elements.quizView.style.display = 'block';
    
    displayQuizQuestion();
}

function displayQuizQuestion() {
    clearFeedback();
    const questionData = state.quizQuestions[state.currentQuizQuestionIndex];
    if (!questionData) {
        endQuiz();
        return;
    }

    if(elements.quizLevelIndicator) elements.quizLevelIndicator.textContent = `Difficulty: ${state.quizProficiency.charAt(0).toUpperCase() + state.quizProficiency.slice(1)}`;
    if(elements.quizQuestionIndicator) elements.quizQuestionIndicator.textContent = `Question: ${state.currentQuizQuestionIndex + 1}/${state.quizQuestions.length}`;
    updateProgressBar(state.currentQuizQuestionIndex, state.quizQuestions.length);

    if(elements.quizQuestionText) elements.quizQuestionText.textContent = questionData.question;
    if(elements.quizOptionsArea) elements.quizOptionsArea.innerHTML = '';
    
    const options = [...questionData.options];
    shuffleArray(options);

    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('quiz-option-btn');
        button.textContent = option;
        button.onclick = () => checkQuizAnswer(option, questionData.answer);
        elements.quizOptionsArea.appendChild(button);
    });

    if(elements.nextQuestionBtn) elements.nextQuestionBtn.style.display = 'none';
}

function checkQuizAnswer(selectedOption, correctAnswer) {
    const buttons = elements.quizOptionsArea.querySelectorAll('.quiz-option-btn');
    let correctButton;

    buttons.forEach(button => {
        // FIX: Cast 'button' to HTMLButtonElement to access 'disabled' property.
        (button as HTMLButtonElement).disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
            correctButton = button;
        }
        if (button.textContent === selectedOption && selectedOption !== correctAnswer) {
            button.classList.add('incorrect');
        }
    });

    if (selectedOption === correctAnswer) {
        if(elements.quizFeedbackArea) elements.quizFeedbackArea.textContent = "Correct!";
        if(elements.quizFeedbackArea) elements.quizFeedbackArea.className = 'feedback-correct';
        state.quizScore++;
    } else {
        if(elements.quizFeedbackArea) elements.quizFeedbackArea.textContent = `Sorry, the correct answer was "${correctAnswer}".`;
        if(elements.quizFeedbackArea) elements.quizFeedbackArea.className = 'feedback-incorrect';
    }

    if(elements.nextQuestionBtn) elements.nextQuestionBtn.style.display = 'block';
}

function nextQuizQuestion() {
    state.currentQuizQuestionIndex++;
    if (state.currentQuizQuestionIndex < state.quizQuestions.length) {
        displayQuizQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    if(elements.gameOverTitle) elements.gameOverTitle.textContent = "Quiz Complete!";
    if(elements.gameOverMessage) elements.gameOverMessage.textContent = `You answered ${state.quizScore} out of ${state.quizQuestions.length} questions correctly.`;
    if(elements.finalScore) elements.finalScore.textContent = `${Math.round((state.quizScore / state.quizQuestions.length) * 100)}%`;
    showModal(elements.gameOverModal);
}

// --- MULTIPLAYER LOGIC ---
function connectToServer() {
    // Connect to the server running on the same host
    // FIX: Added 'declare var io: any;' at the top of the file to resolve 'Cannot find name 'io'' error.
    state.socket = io({
        reconnectionAttempts: 3,
        timeout: 10000,
    });
    if(elements.multiplayerFeedback) elements.multiplayerFeedback.textContent = "Connecting to server...";
    
    state.socket.on('connect', () => {
        console.log("Connected to server with ID:", state.socket.id);
        if(elements.multiplayerFeedback) elements.multiplayerFeedback.textContent = "";
        // FIX: Cast 'elements.createGroupBtn' and 'elements.joinGroupBtn' to HTMLButtonElement to access 'disabled' property.
        if(elements.createGroupBtn) (elements.createGroupBtn as HTMLButtonElement).disabled = false;
        if(elements.joinGroupBtn) (elements.joinGroupBtn as HTMLButtonElement).disabled = false;
        state.playerData.id = state.socket.id;
    });

    state.socket.on('connect_error', (err) => {
        console.error("Connection Error:", err.message);
        if(elements.multiplayerFeedback) elements.multiplayerFeedback.textContent = `Connection failed. Retrying...`;
    });

    state.socket.on('disconnect', () => {
        console.log("Disconnected from server.");
        if(elements.multiplayerFeedback) elements.multiplayerFeedback.textContent = "Disconnected.";
        // FIX: Cast 'elements.createGroupBtn' and 'elements.joinGroupBtn' to HTMLButtonElement to access 'disabled' property.
        if(elements.createGroupBtn) (elements.createGroupBtn as HTMLButtonElement).disabled = true;
        if(elements.joinGroupBtn) (elements.joinGroupBtn as HTMLButtonElement).disabled = true;
    });

    state.socket.on('groupCreated', ({ groupCode, players }) => {
        state.groupCode = groupCode;
        state.playerData.groupCode = groupCode;
        if(elements.groupCodeDisplay) elements.groupCodeDisplay.textContent = groupCode;
        hideModal(elements.multiplayerModal);
        // If host, show proficiency selection first
        showModal(elements.multiplayerProficiencyModal);
        updateWaitingRoom(players, true); // isHost = true
    });

    state.socket.on('joinSuccess', ({ groupCode }) => {
        state.groupCode = groupCode;
        state.playerData.groupCode = groupCode;
        hideModal(elements.multiplayerModal);
        showModal(elements.waitingRoomModal);
    });

    state.socket.on('joinError', (message) => {
        if(elements.multiplayerFeedback) elements.multiplayerFeedback.textContent = message;
    });

    state.socket.on('updatePlayers', (players) => {
        state.players = players;
        if (elements.waitingRoomModal.style.display === 'flex') {
            const isHost = players.length > 0 && players[0].id === state.playerData.id;
            updateWaitingRoom(players, isHost);
        }
        if (elements.gameContainer.style.display === 'block' && state.gameMode === 'multi') {
            updatePlayerScores(players);
        }
    });
    
    state.socket.on('gameStarted', ({ proficiency }) => {
        startGame(proficiency);
    });
}

function updateWaitingRoom(players, isHost) {
    if(!elements.waitingPlayerList) return;
    elements.waitingPlayerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.nickname + (player.id === state.playerData.id ? ' (You)' : '');
        elements.waitingPlayerList.appendChild(li);
    });
    
    if (isHost) {
        if(elements.startGameBtn) elements.startGameBtn.style.display = 'block';
        // FIX: Cast 'elements.startGameBtn' to HTMLButtonElement to access 'disabled' property.
        if(elements.startGameBtn) (elements.startGameBtn as HTMLButtonElement).disabled = players.length < 1; // Can start with 1 for testing
    } else {
        if(elements.startGameBtn) elements.startGameBtn.style.display = 'none';
    }
}

function updatePlayerScores(players) {
    if(!elements.playerScoresList) return;
    elements.playerScoresList.innerHTML = '';
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    sortedPlayers.forEach(player => {
        const li = document.createElement('li');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = player.nickname + (player.id === state.playerData.id ? ' (You)' : '');
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'player-score';
        scoreSpan.textContent = player.score;
        li.appendChild(nameSpan);
        li.appendChild(scoreSpan);
        elements.playerScoresList.appendChild(li);
    });
}

// --- EVENT LISTENERS ---
function init() {
    // Mode Selection
    if(elements.singlePlayerBtn) elements.singlePlayerBtn.onclick = () => {
        state.gameMode = 'single';
        hideModal(elements.modeModal);
        showModal(elements.playerSetupModal);
    };
    if(elements.multiplayerBtn) elements.multiplayerBtn.onclick = () => {
        state.gameMode = 'multi';
        hideModal(elements.modeModal);
        showModal(elements.multiplayerModal);
        connectToServer();
    };
    if(elements.quizBtn) elements.quizBtn.onclick = () => {
        state.gameMode = 'quiz';
        hideModal(elements.modeModal);
        showModal(elements.quizSetupModal);
    };

    // Single Player Proficiency
    elements.proficiencyBtns.forEach(btn => {
        // FIX: Cast 'btn' to HTMLElement to add 'onclick' event listener and access 'dataset'.
        (btn as HTMLElement).onclick = (e) => startGame((btn as HTMLElement).dataset.level);
    });
    if(elements.backFromSetupBtn) elements.backFromSetupBtn.onclick = backToMenu;

    // Quiz Proficiency
    elements.quizProficiencyBtns.forEach(btn => {
        // FIX: Cast 'btn' to HTMLElement to add 'onclick' event listener and access 'dataset'.
        (btn as HTMLElement).onclick = (e) => startQuiz((btn as HTMLElement).dataset.level);
    });
    if(elements.backFromQuizSetupBtn) elements.backFromQuizSetupBtn.onclick = backToMenu;
    if(elements.nextQuestionBtn) elements.nextQuestionBtn.onclick = nextQuizQuestion;

    // Game Controls
    if(elements.checkBtn) elements.checkBtn.onclick = () => checkAnswer(false);
    if(elements.resetBtn) elements.resetBtn.onclick = resetWordPositions;
    if(elements.playAgainBtn) elements.playAgainBtn.onclick = backToMenu;
    if(elements.backToMenuBtn) elements.backToMenuBtn.onclick = backToMenu;
    if(elements.quizBackToMenuBtn) elements.quizBackToMenuBtn.onclick = backToMenu;

    // Drag and Drop listeners for containers
    [elements.sentenceTray, elements.wordPool].forEach(container => {
        if(container) {
            container.addEventListener('dragover', dragOver);
            container.addEventListener('dragleave', dragLeave);
            container.addEventListener('drop', drop);
        }
    });

    // Multiplayer Setup
    if(elements.multiplayerCreateTab) elements.multiplayerCreateTab.onclick = () => {
        elements.multiplayerCreateTab.classList.add('active');
        elements.multiplayerJoinTab.classList.remove('active');
        if(elements.groupCodeInput) elements.groupCodeInput.style.display = 'none';
        if(elements.joinGroupBtn) elements.joinGroupBtn.style.display = 'none';
        if(elements.createGroupBtn) elements.createGroupBtn.style.display = 'block';
    };
     if(elements.multiplayerJoinTab) elements.multiplayerJoinTab.onclick = () => {
        elements.multiplayerJoinTab.classList.add('active');
        elements.multiplayerCreateTab.classList.remove('active');
        if(elements.groupCodeInput) elements.groupCodeInput.style.display = 'block';
        if(elements.joinGroupBtn) elements.joinGroupBtn.style.display = 'block';
        if(elements.createGroupBtn) elements.createGroupBtn.style.display = 'none';
    };
    if(elements.createGroupBtn) elements.createGroupBtn.onclick = () => {
        // FIX: Cast 'elements.nicknameInput' to HTMLInputElement to access 'value' property.
        const nickname = (elements.nicknameInput as HTMLInputElement).value.trim();
        if (nickname && state.socket) {
            state.playerData.nickname = nickname;
            state.socket.emit('createGroup', state.playerData);
        } else {
            if(elements.multiplayerFeedback) elements.multiplayerFeedback.textContent = "Please enter a nickname.";
        }
    };
    if(elements.joinGroupBtn) elements.joinGroupBtn.onclick = () => {
        // FIX: Cast 'elements.nicknameInput' and 'elements.groupCodeInput' to HTMLInputElement to access 'value' property.
        const nickname = (elements.nicknameInput as HTMLInputElement).value.trim();
        const groupCode = (elements.groupCodeInput as HTMLInputElement).value.trim();
        if (nickname && groupCode.length === 3 && state.socket) {
            state.playerData.nickname = nickname;
            state.socket.emit('joinGroup', { playerData: state.playerData, groupCode });
        } else {
            if(elements.multiplayerFeedback) elements.multiplayerFeedback.textContent = "Please enter a nickname and a valid 3-digit code.";
        }
    };
    if(elements.backFromMultiplayerBtn) elements.backFromMultiplayerBtn.onclick = backToMenu;
    
    // Multiplayer Host Proficiency Selection
    elements.multiplayerProficiencyBtns.forEach(btn => {
        // FIX: Cast 'btn' to HTMLElement to add 'onclick' event listener and access 'dataset'.
        (btn as HTMLElement).onclick = (e) => {
            const proficiency = (btn as HTMLElement).dataset.level;
            state.proficiency = proficiency;
            if (state.socket && state.groupCode) {
                state.socket.emit('setProficiency', { groupCode: state.groupCode, proficiency });
            }
            hideModal(elements.multiplayerProficiencyModal);
            showModal(elements.waitingRoomModal);
        };
    });
    if(elements.backFromMultiplayerProficiencyBtn) elements.backFromMultiplayerProficiencyBtn.onclick = backToMenu;

    // Multiplayer Waiting Room
    if(elements.startGameBtn) elements.startGameBtn.onclick = () => {
        if(state.socket && state.groupCode) {
            state.socket.emit('startGameRequest', { groupCode: state.groupCode, proficiency: state.proficiency });
        }
    };
    if(elements.backFromWaitingBtn) elements.backFromWaitingBtn.onclick = backToMenu;
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', init);