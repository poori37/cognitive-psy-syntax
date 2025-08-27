// Fix: Add declarations for external libraries 'ohm-js' and 'socket.io-client' to resolve 'Cannot find name' errors.
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
    // Fix: Add groupCode to playerData state to resolve property assignment errors.
    playerData: { id: null, nickname: '', score: 0, groupCode: null as string | null },
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
// Fix: Cast DOM elements to their specific HTML element types to prevent property access errors (e.g., .value, .disabled).
const elements = {
    gameContainer: document.getElementById('game-container') as HTMLElement,
    // Views
    gameView: document.getElementById('game-view') as HTMLElement,
    quizView: document.getElementById('quiz-view') as HTMLElement,
    // Modals
    modeModal: document.getElementById('mode-modal-overlay') as HTMLElement,
    playerSetupModal: document.getElementById('player-setup-modal-overlay') as HTMLElement,
    quizSetupModal: document.getElementById('quiz-setup-modal-overlay') as HTMLElement,
    multiplayerModal: document.getElementById('multiplayer-modal-overlay') as HTMLElement,
    multiplayerProficiencyModal: document.getElementById('multiplayer-proficiency-modal-overlay') as HTMLElement,
    waitingRoomModal: document.getElementById('waiting-room-modal-overlay') as HTMLElement,
    gameOverModal: document.getElementById('game-over-modal-overlay') as HTMLElement,
    // Mode Buttons
    singlePlayerBtn: document.getElementById('single-player-mode-btn') as HTMLButtonElement,
    multiplayerBtn: document.getElementById('multiplayer-mode-btn') as HTMLButtonElement,
    quizBtn: document.getElementById('quiz-mode-btn') as HTMLButtonElement,
    // Card Game Elements
    gameSubtitle: document.getElementById('game-subtitle') as HTMLElement,
    targetGrammar: document.getElementById('target-grammar') as HTMLElement,
    levelIndicator: document.getElementById('level-indicator') as HTMLElement,
    questionIndicator: document.getElementById('question-indicator') as HTMLElement,
    progressBar: document.getElementById('progress-bar') as HTMLElement,
    sentenceTray: document.getElementById('sentence-tray') as HTMLElement,
    wordPool: document.getElementById('word-pool') as HTMLElement,
    feedbackArea: document.getElementById('feedback-area') as HTMLElement,
    checkBtn: document.getElementById('check-btn') as HTMLButtonElement,
    resetBtn: document.getElementById('reset-btn') as HTMLButtonElement,
    timerDisplay: document.getElementById('timer') as HTMLElement,
    // Typing Game Elements
    typingChallengeContainer: document.getElementById('typing-challenge-container') as HTMLElement,
    typingPrompt: document.getElementById('typing-prompt') as HTMLElement,
    typingWordSet: document.getElementById('typing-word-set') as HTMLElement,
    typingInput: document.getElementById('typing-input') as HTMLInputElement,
    // Single Player Setup
    proficiencyBtns: document.querySelectorAll('.proficiency-btn'),
    resumeGameContainer: document.getElementById('resume-game-container') as HTMLElement,
    resumeGameBtn: document.getElementById('resume-game-btn') as HTMLButtonElement,
    backFromSetupBtn: document.getElementById('back-from-setup-btn') as HTMLButtonElement,
    // Quiz Setup
    quizProficiencyBtns: document.querySelectorAll('.quiz-proficiency-btn'),
    backFromQuizSetupBtn: document.getElementById('back-from-quiz-setup-btn') as HTMLButtonElement,
    // Multiplayer Elements
    nicknameInput: document.getElementById('nickname-input') as HTMLInputElement,
    groupCodeInput: document.getElementById('group-code-input') as HTMLInputElement,
    joinGroupBtn: document.getElementById('join-group-btn') as HTMLButtonElement,
    createGroupBtn: document.getElementById('create-group-btn') as HTMLButtonElement,
    multiplayerFeedback: document.getElementById('multiplayer-feedback') as HTMLElement,
    groupCodeDisplay: document.querySelector('#group-code-display strong') as HTMLElement,
    waitingPlayerList: document.getElementById('waiting-room-player-list') as HTMLElement,
    startGameBtn: document.getElementById('start-game-btn') as HTMLButtonElement,
    multiplayerScoreboard: document.getElementById('multiplayer-scoreboard') as HTMLElement,
    playerScoresList: document.getElementById('player-scores') as HTMLElement,
    multiplayerCreateTab: document.getElementById('multiplayer-create-tab') as HTMLElement,
    multiplayerJoinTab: document.getElementById('multiplayer-join-tab') as HTMLElement,
    backFromMultiplayerBtn: document.getElementById('back-from-multiplayer-btn') as HTMLButtonElement,
    multiplayerProficiencyBtns: document.querySelectorAll('.multiplayer-proficiency-btn'),
    backFromMultiplayerProficiencyBtn: document.getElementById('back-from-multiplayer-proficiency-btn') as HTMLButtonElement,
    backFromWaitingBtn: document.getElementById('back-from-waiting-btn') as HTMLButtonElement,
    // Game Over Modal
    gameOverTitle: document.getElementById('game-over-title') as HTMLElement,
    gameOverMessage: document.getElementById('game-over-message') as HTMLElement,
    finalScore: document.getElementById('final-score') as HTMLElement,
    playAgainBtn: document.getElementById('play-again-btn') as HTMLButtonElement,
    // Quiz Elements
    quizLevelIndicator: document.getElementById('quiz-level-indicator') as HTMLElement,
    quizQuestionIndicator: document.getElementById('quiz-question-indicator') as HTMLElement,
    quizProgressBar: document.getElementById('quiz-progress-bar') as HTMLElement,
    quizQuestionText: document.getElementById('quiz-question-text') as HTMLElement,
    quizOptionsArea: document.getElementById('quiz-options-area') as HTMLElement,
    quizFeedbackArea: document.getElementById('quiz-feedback-area') as HTMLElement,
    nextQuestionBtn: document.getElementById('next-question-btn') as HTMLButtonElement,
    // Menu Buttons
    backToMenuBtn: document.getElementById('back-to-menu-btn') as HTMLButtonElement,
    quizBackToMenuBtn: document.getElementById('quiz-back-to-menu-btn') as HTMLButtonElement,
};

// --- OHM.JS GRAMMAR ---
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
        // Prompt 9: Adverbial clause of time
        { 
            rule: "Conjunction_Determiner_Noun_Verb_Comma_Possessive_Noun_Verb_Punctuation",
            displayRule: 'Adverbial Clause of Time (e.g., while)', 
            words: [
                {word: "While", type: "Conjunction"}, {word: "the", type: "Determiner"}, {word: "children", type: "Noun"}, 
                {word: "played", type: "Verb"}, {word: ",", type: "Comma"}, {word: "their", type: "Possessive"}, 
                {word: "parents", type: "Noun"}, {word: "watched", type: "Verb"}, {word: ".", type: "Punctuation"}
            ]
        },
        // Prompt 10: Irrelevant word
        { 
            rule: "Determiner_Noun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Simple Sentence (ignore one word)', 
            words: [
                {word: "The", type: "Determiner"}, {word: "manager", type: "Noun"}, {word: "organized", type: "Verb"}, 
                {word: "the", type: "Determiner"}, {word: "meeting", type: "Noun"}, {word: ".", type: "Punctuation"}, 
                {word: "toothbrush", type: "Noun"}
            ]
        }
    ],
    hard: [
        {
            prompt: "Form a complex sentence using a subordinate clause.",
            wordSet: ["The professor", "discovered", "imagined", "a theory", "the experiment", "although", "because", "towel", "obscure"],
            answer: "Although the professor imagined a theory, he discovered the experiment was obscure."
        },
        {
            prompt: "Create a conditional sentence using “if” or “unless.”",
            wordSet: ["The politician", "announced", "delayed", "the election", "the policy", "unless", "because", "spoon"],
            answer: "The politician delayed the election unless the policy was announced."
        },
        {
            prompt: "Make a sentence using the past perfect tense.",
            wordSet: ["The scientist", "had completed", "had observed", "the results", "the stars", "before", "while", "banana"],
            answer: "The scientist had completed the results before he had observed the stars."
        },
        {
            prompt: "Form an interrogative sentence with a subordinate clause.",
            wordSet: ["The teacher", "explained", "completed", "the project", "the homework", "why", "although", "balloon"],
            answer: "Why did the teacher explain the project although the students had completed the homework?"
        },
        {
            prompt: "Write a sentence that begins with “Although...”.",
            wordSet: ["My neighbor", "chased", "hid", "the dog", "under the table", "although", "when", "umbrella"],
            answer: "Although my neighbor chased the dog, it hid under the table."
        },
        {
            prompt: "Construct a sentence with two clauses joined by “because.”",
            wordSet: ["The engineer", "designed", "repaired", "the bridge", "the machine", "because", "although", "candle"],
            answer: "The engineer repaired the machine because he had already designed the bridge."
        },
        {
            prompt: "Form a sentence that uses a relative clause (e.g., who, which, that).",
            wordSet: ["The artist", "created", "inspired", "the painting", "the audience", "which", "who", "sandwich"],
            answer: "The artist created the painting which inspired the audience."
        },
        {
            prompt: "Write a sentence where the subject performs two different actions.",
            wordSet: ["The student", "studied", "wrote", "the exam", "the essay", "and", "although", "pencil"],
            answer: "The student studied the exam and wrote the essay."
        },
        {
            prompt: "Create a sentence using an adverbial clause of time (e.g., when, while, before).",
            wordSet: ["The children", "played", "watched", "the rain", "the cartoon", "while", "before", "kite"],
            answer: "The children played in the rain while they watched the cartoon."
        },
        {
            prompt: "Form a sentence that includes one irrelevant/trap word (must be ignored).",
            wordSet: ["The manager", "organized", "attended", "the meeting", "the conference", "because", "when", "toothbrush"],
            answer: "The manager organized the meeting because he attended the conference."
        }
    ]
};

const quizData = {
    easy: [
        { question: "Which word is the NOUN in the sentence: 'The cat sat on the mat.'?", options: ["The", "cat", "sat", "on"], answer: "cat" },
        { question: "Identify the VERB: 'Birds fly high in the sky.'", options: ["Birds", "fly", "high", "sky"], answer: "fly" },
        { question: "What part of speech is 'happy' in 'She is a happy girl.'?", options: ["Noun", "Verb", "Adjective", "Adverb"], answer: "Adjective" },
        { question: "Find the PRONOUN: 'He threw the ball to them.'", options: ["threw", "ball", "to", "He"], answer: "He" },
        { question: "Which word is a DETERMINER in 'An apple a day keeps the doctor away.'?", options: ["apple", "day", "An", "away"], answer: "An" },
        { question: "What is the PUNCTUATION in the sentence: 'Hello!'?", options: [".", ",", "!", "?"], answer: "!" },
        { question: "Identify the NOUN: 'My dog has a fluffy tail.'", options: ["My", "has", "fluffy", "dog"], answer: "dog" },
        { question: "Which is the VERB in 'They quickly ran home.'?", options: ["They", "quickly", "ran", "home"], answer: "ran" },
        { question: "Find the ADJECTIVE: 'It was a beautiful day.'", options: ["It", "was", "beautiful", "day"], answer: "beautiful" },
        { question: "What part of speech is 'I' in 'I love this game.'?", options: ["Noun", "Pronoun", "Verb", "Adjective"], answer: "Pronoun" }
    ],
    medium: [
        { question: "What is the ADVERB in 'She sings beautifully.'?", options: ["She", "sings", "beautifully", "."], answer: "beautifully" },
        { question: "Identify the PREPOSITION: 'The book is on the table.'", options: ["book", "is", "on", "table"], answer: "on" },
        { question: "Which word is the CONJUNCTION in 'I am tired, but I will finish.'?", options: ["am", "tired", "but", "finish"], answer: "but" },
        { question: "What role does 'running' play in 'Running is good exercise.'?", options: ["Verb", "Adjective", "Noun (Gerund)", "Adverb"], answer: "Noun (Gerund)" },
        { question: "Find the PREPOSITIONAL PHRASE: 'The man with the yellow hat smiled.'", options: ["The man", "with the yellow hat", "yellow hat", "smiled"], answer: "with the yellow hat" },
        { question: "Identify the ADVERB: 'He works very hard.'", options: ["He", "works", "very", "hard"], answer: "very" },
        { question: "What part of speech is 'although' in 'Although it was raining, we went out.'?", options: ["Adverb", "Preposition", "Conjunction", "Pronoun"], answer: "Conjunction" },
        { question: "Find the POSSESSIVE pronoun: 'That blue car is hers.'", options: ["That", "blue", "is", "hers"], answer: "hers" },
        { question: "What is the object of the preposition in 'She walked through the door.'?", options: ["She", "walked", "through", "door"], answer: "door" },
        { question: "Identify the CONJUNCTION: 'He is not only smart but also funny.'", options: ["not", "only", "but", "also"], answer: "but" }
    ],
    hard: [
        { question: "What type of clause is 'who is my best friend' in 'John, who is my best friend, is a doctor.'?", options: ["Adverbial Clause", "Noun Clause", "Relative Clause", "Main Clause"], answer: "Relative Clause" },
        { question: "Identify the part of speech for 'however' in 'The task was difficult; however, we succeeded.'", options: ["Subordinating Conjunction", "Coordinating Conjunction", "Conjunctive Adverb", "Adjective"], answer: "Conjunctive Adverb" },
        { question: "What is the grammatical function of 'to win' in 'Her goal is to win.'?", options: ["Adjective", "Adverb", "Infinitive as Noun", "Prepositional Phrase"], answer: "Infinitive as Noun" },
        { question: "Which term describes the phrase 'Having finished her work' in 'Having finished her work, she went home.'?", options: ["Gerund Phrase", "Infinitive Phrase", "Participial Phrase", "Prepositional Phrase"], answer: "Participial Phrase" },
        { question: "In 'I made him the captain,' what is 'the captain'?", options: ["Direct Object", "Indirect Object", "Predicate Nominative", "Object Complement"], answer: "Object Complement" },
        { question: "What mood is the verb in 'If I were you, I would not go.'?", options: ["Indicative", "Imperative", "Subjunctive", "Conditional"], answer: "Subjunctive" },
        { question: "Identify the gerund in the sentence: 'I enjoy swimming.'", options: ["I", "enjoy", "swimming", "."], answer: "swimming" },
        { question: "What is the function of the noun clause in 'I know that you are right.'?", options: ["Subject", "Direct Object", "Appositive", "Predicate Nominative"], answer: "Direct Object" },
        { question: "Which of the following is an example of an appositive phrase: 'My brother, a talented artist, won the award.'?", options: ["My brother", "a talented artist", "won the award", "the award"], answer: "a talented artist" },
        { question: "What is the verb tense in 'She will have finished by noon.'?", options: ["Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous"], answer: "Future Perfect" }
    ]
};

// --- TILE INTERACTION LOGIC ---
let draggedTile: HTMLElement | null = null;
let placeholder: HTMLElement | null = null;

function createPlaceholder() {
    const p = document.createElement('div');
    p.className = 'placeholder';
    // Match style with word-tile for sizing
    p.style.width = draggedTile.offsetWidth + 'px';
    p.style.height = draggedTile.offsetHeight + 'px';
    p.style.margin = getComputedStyle(draggedTile).margin;
    return p;
}

/**
 * Determines which element the dragged tile should be inserted before.
 * This version is more robust for multi-line flex containers.
 * @param {HTMLElement} container The container being dragged over.
 * @param {number} x The clientX of the mouse event.
 * @param {number} y The clientY of the mouse event.
 * @returns {HTMLElement|null} The element to insert before, or null to append.
 */
function getDragAfterElement(container, x, y) {
    const draggableElements = [...container.querySelectorAll('.word-tile:not(.dragging)')];
    
    let closestElement = null;
    let minDistance = Number.POSITIVE_INFINITY;

    // Find the element whose center is geometrically closest to the cursor
    draggableElements.forEach(child => {
        const box = child.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

        if (distance < minDistance) {
            minDistance = distance;
            closestElement = child;
        }
    });

    if (!closestElement) {
        return null;
    }

    const closestBox = closestElement.getBoundingClientRect();
    // Decide whether to insert before or after the closest element based on horizontal position.
    if (x > closestBox.left + closestBox.width / 2) {
        // Cursor is to the right of the center, so insert *after* it (by returning its next sibling).
        return closestElement.nextElementSibling;
    } else {
        // Cursor is to the left of the center, so insert *before* it.
        return closestElement;
    }
}

function setupTileInteractions() {
    // CLICK to move tiles between pool and tray
    elements.gameContainer.addEventListener('click', (e) => {
        // Fix: Cast e.target to HTMLElement to safely access its properties.
        if (!(e.target instanceof HTMLElement) || !e.target.classList.contains('word-tile')) return;

        const tile = e.target;
        const sourceContainer = tile.parentElement;

        if (sourceContainer.id === 'word-pool') {
            elements.sentenceTray.appendChild(tile);
            tile.draggable = true;
        } else if (sourceContainer.id === 'sentence-tray') {
            elements.wordPool.appendChild(tile);
            tile.draggable = false;
        }
    });

    // DRAG AND DROP for reordering and returning tiles
    document.addEventListener('dragstart', (e) => {
        // Fix: Cast e.target to HTMLElement to safely access its properties.
        const target = e.target as HTMLElement;
        if (target.classList.contains('word-tile') && target.draggable) {
            draggedTile = target;
            setTimeout(() => target.classList.add('dragging'), 0);
            placeholder = createPlaceholder();
        }
    });

    document.addEventListener('dragend', () => {
        if (draggedTile) {
            draggedTile.classList.remove('dragging');
            draggedTile = null;
            if (placeholder && placeholder.parentElement) {
                placeholder.remove();
            }
            placeholder = null;
        }
    });

    const droppables = [elements.sentenceTray, elements.wordPool];
    droppables.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
            
            if (draggedTile && zone.id === 'sentence-tray') {
                const afterElement = getDragAfterElement(zone, e.clientX, e.clientY);
                if (afterElement) {
                    zone.insertBefore(placeholder, afterElement);
                } else {
                    zone.appendChild(placeholder);
                }
            }
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            if (placeholder && placeholder.parentElement) {
                placeholder.remove();
            }

            if (draggedTile) {
                if (zone.id === 'sentence-tray') {
                    const afterElement = getDragAfterElement(zone, e.clientX, e.clientY);
                    zone.insertBefore(draggedTile, afterElement); // insertBefore(el, null) appends
                } 
                else if (zone.id === 'word-pool') {
                    zone.appendChild(draggedTile);
                    draggedTile.draggable = false;
                }
            }
        });
    });
}

// --- GAME LOGIC ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createWordTile(wordData) {
    const tile = document.createElement('div');
    tile.classList.add('word-tile');
    tile.textContent = wordData.word;
    tile.dataset.type = wordData.type;
    tile.draggable = false; // Tiles start as not draggable in the pool
    return tile;
}

function loadQuestion(index) {
    clearFeedback();
    elements.checkBtn.disabled = false;
    
    const levelData = levels[state.proficiency];
    state.totalQuestions = levelData.length;
    const questionData = levelData[index];

    // Common UI updates
    elements.levelIndicator.textContent = `Proficiency: ${state.proficiency.charAt(0).toUpperCase() + state.proficiency.slice(1)}`;
    elements.questionIndicator.textContent = `Question: ${index + 1}/${state.totalQuestions}`;
    elements.progressBar.style.width = `${((index + 1) / state.totalQuestions) * 100}%`;

    if (state.proficiency === 'hard') {
        // --- HARD TYPING MODE ---
        elements.typingChallengeContainer.style.display = 'block';
        elements.targetGrammar.parentElement.style.display = 'none'; // Hides #challenge-display
        elements.sentenceTray.style.display = 'none';
        elements.wordPool.style.display = 'none';
        
        elements.typingPrompt.textContent = questionData.prompt;
        elements.typingWordSet.textContent = questionData.wordSet.join(', ');
        elements.typingInput.value = '';
        elements.gameSubtitle.textContent = "Type the sentence based on the prompt below.";

    } else {
        // --- EASY/MEDIUM CARD MODE ---
        elements.typingChallengeContainer.style.display = 'none';
        elements.targetGrammar.parentElement.style.display = 'block';
        elements.sentenceTray.style.display = 'flex';
        elements.wordPool.style.display = 'flex';

        state.currentWords = [...questionData.words];
        elements.targetGrammar.textContent = questionData.displayRule;
        elements.gameSubtitle.textContent = "Arrange the words to match the target sentence structure.";

        elements.sentenceTray.innerHTML = '';
        elements.wordPool.innerHTML = '';
        const shuffledWords = [...questionData.words];
        shuffleArray(shuffledWords);
        shuffledWords.forEach(word => elements.wordPool.appendChild(createWordTile(word)));
    }
    
    resetTimer();
    startTimer();
}

function checkAnswer() {
    clearInterval(state.timerInterval);

    if (state.proficiency === 'hard') {
        // --- HARD TYPING VALIDATION ---
        const userAnswer = elements.typingInput.value.trim();
        if (userAnswer === '') {
            showFeedback("Please type a sentence first.", 'incorrect');
            startTimer(); // Resume timer
            return;
        }

        const correctAnswer = levels.hard[state.currentQuestionIndex].answer;
        
        // Normalization: lowercase, remove trailing punctuation, collapse multiple spaces
        const normalize = (str) => str.toLowerCase().replace(/[.,?]$/, '').trim().replace(/\s+/g, ' ');
        
        if (normalize(userAnswer) === normalize(correctAnswer)) {
            const points = calculateScore();
            state.score += points;
            showFeedback(`Correct! +${points} points`, 'correct');
            if (state.gameMode === 'multi' && state.socket) {
                state.playerData.score = state.score;
                state.socket.emit('updateScore', state.playerData);
            }
            elements.checkBtn.disabled = true;
            setTimeout(nextQuestion, 1500);
        } else {
            showFeedback("That's not quite right. Try again!", 'incorrect');
        }

    } else {
        // --- EASY/MEDIUM CARD VALIDATION ---
        const sentenceTiles = elements.sentenceTray.querySelectorAll('.word-tile');
        if (sentenceTiles.length === 0) {
            showFeedback("Please build a sentence first.", 'incorrect');
            startTimer(); // Resume timer if no answer submitted
            return;
        }

        const sentenceTypes = Array.from(sentenceTiles).map(tile => (tile as HTMLElement).dataset.type);
        const sentenceString = sentenceTypes.join(' ');
        const currentRule = levels[state.proficiency][state.currentQuestionIndex].rule;

        const match = grammar.match(sentenceString, currentRule);

        if (match.succeeded()) {
            const points = calculateScore();
            state.score += points;
            showFeedback(`Correct! +${points} points`, 'correct');
            if (state.gameMode === 'multi' && state.socket) {
                state.playerData.score = state.score;
                state.socket.emit('updateScore', state.playerData);
            }
            elements.checkBtn.disabled = true;
            setTimeout(nextQuestion, 1500);
        } else {
            showFeedback("That's not quite right. Try again!", 'incorrect');
        }
    }
}

function calculateScore() {
    // Base score + time bonus
    const baseScore = 100;
    const timeBonus = Math.max(0, state.timer * 2); 
    return baseScore + timeBonus;
}

function nextQuestion() {
    state.currentQuestionIndex++;
    if (state.currentQuestionIndex < state.totalQuestions) {
        loadQuestion(state.currentQuestionIndex);
    } else {
        endGame('Level Complete!', "You've answered all questions for this level.");
    }
}

function resetCurrentQuestion() {
    // For hard, this will clear the input. For others, it reloads the tiles.
    clearInterval(state.timerInterval);
    loadQuestion(state.currentQuestionIndex);
}

function startTimer() {
    clearInterval(state.timerInterval); // Ensure no multiple timers running
    state.timerInterval = setInterval(() => {
        state.timer--;
        elements.timerDisplay.textContent = `Time: ${state.timer}`;
        if (state.timer <= 0) {
            clearInterval(state.timerInterval);
            showFeedback("Time's up! Moving to the next question.", 'incorrect');
            setTimeout(nextQuestion, 2000);
        }
    }, 1000);
}

function resetTimer() {
    state.timer = 50;
    elements.timerDisplay.textContent = `Time: ${state.timer}`;
}

function showFeedback(message, type) {
    elements.feedbackArea.textContent = message;
    elements.feedbackArea.className = `feedback-${type}`;
}

function clearFeedback() {
    elements.feedbackArea.textContent = '';
    elements.feedbackArea.className = '';
}

// --- UI & MODAL MANAGEMENT ---
function showModal(modal) {
    modal.style.display = 'flex';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

function resetToMenu() {
    // Stop any game timers
    clearInterval(state.timerInterval);
    if (state.socket) {
        state.socket.disconnect();
    }
    
    // Hide game/quiz containers
    elements.gameContainer.style.display = 'none';
    elements.gameView.style.display = 'block'; // reset to default
    elements.quizView.style.display = 'none';  // reset to default

    // Hide all modals
    hideModal(elements.playerSetupModal);
    hideModal(elements.quizSetupModal);
    hideModal(elements.multiplayerModal);
    hideModal(elements.multiplayerProficiencyModal);
    hideModal(elements.waitingRoomModal);
    hideModal(elements.gameOverModal);
    
    // Explicitly reset game view UI to default (card view)
    elements.typingChallengeContainer.style.display = 'none';
    elements.targetGrammar.parentElement.style.display = 'block';
    elements.sentenceTray.style.display = 'flex';
    elements.wordPool.style.display = 'flex';
    
    // Show the main menu modal
    showModal(elements.modeModal);

    // Reset state object to its initial values
    state.gameMode = null;
    state.proficiency = 'easy';
    state.currentQuestionIndex = 0;
    state.totalQuestions = 0;
    state.score = 0;
    state.timer = 50;
    state.timerInterval = null;
    state.currentWords = [];
    state.playerData = { id: null, nickname: '', score: 0, groupCode: null };
    state.groupCode = null;
    state.players = [];
    state.socket = null;
    state.quizProficiency = 'easy';
    state.currentQuizQuestionIndex = 0;
    state.quizScore = 0;
    state.quizQuestions = [];
    
    // Reset UI elements that might hold old state
    elements.multiplayerScoreboard.style.display = 'none';
    elements.playerScoresList.innerHTML = '';
    elements.feedbackArea.innerHTML = '';
    elements.quizFeedbackArea.innerHTML = '';
    elements.nicknameInput.value = '';
    elements.groupCodeInput.value = '';

    // Also remove the beforeunload listener if it was set
    window.removeEventListener('beforeunload', saveGameState);
    // And clear saved game from local storage to prevent resuming a game that was 'backed out' of.
    localStorage.removeItem('syntaxGameState');
}

function setupUI() {
    elements.checkBtn.addEventListener('click', checkAnswer);
    elements.resetBtn.addEventListener('click', resetCurrentQuestion);

    // Mode selection
    elements.singlePlayerBtn.addEventListener('click', () => {
        state.gameMode = 'single';
        hideModal(elements.modeModal);
        showModal(elements.playerSetupModal);
        checkForSavedGame();
    });
    elements.multiplayerBtn.addEventListener('click', () => {
        state.gameMode = 'multi';
        hideModal(elements.modeModal);
        showModal(elements.multiplayerModal);
        initializeSocket();
    });
    elements.quizBtn.addEventListener('click', () => {
        state.gameMode = 'quiz';
        hideModal(elements.modeModal);
        showModal(elements.quizSetupModal);
    });

    // Single Player Setup
    elements.proficiencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Fix: Cast element to HTMLElement to access the dataset property.
            state.proficiency = (btn as HTMLElement).dataset.level;
            startGame();
        });
    });
    elements.backFromSetupBtn.addEventListener('click', () => {
        hideModal(elements.playerSetupModal);
        showModal(elements.modeModal);
    });

    // Multiplayer Setup
    elements.multiplayerCreateTab.addEventListener('click', () => {
         elements.multiplayerCreateTab.classList.add('active');
         elements.multiplayerJoinTab.classList.remove('active');
         elements.groupCodeInput.style.display = 'none';
         elements.createGroupBtn.style.display = 'block';
         elements.joinGroupBtn.style.display = 'none';
    });
    elements.multiplayerJoinTab.addEventListener('click', () => {
         elements.multiplayerJoinTab.classList.add('active');
         elements.multiplayerCreateTab.classList.remove('active');
         elements.groupCodeInput.style.display = 'block';
         elements.createGroupBtn.style.display = 'none';
         elements.joinGroupBtn.style.display = 'block';
    });
    elements.createGroupBtn.addEventListener('click', createGroup);
    elements.joinGroupBtn.addEventListener('click', joinGroup);
    elements.backFromMultiplayerBtn.addEventListener('click', () => {
        hideModal(elements.multiplayerModal);
        showModal(elements.modeModal);
        if (state.socket) {
            state.socket.disconnect();
            state.socket = null;
        }
    });
    elements.nicknameInput.addEventListener('input', () => {
        const isNicknameValid = elements.nicknameInput.value.trim().length > 0;
        elements.createGroupBtn.disabled = !isNicknameValid;
        elements.joinGroupBtn.disabled = !isNicknameValid || elements.groupCodeInput.value.length !== 3;
    });
     elements.groupCodeInput.addEventListener('input', () => {
        const isNicknameValid = elements.nicknameInput.value.trim().length > 0;
        elements.joinGroupBtn.disabled = !isNicknameValid || elements.groupCodeInput.value.length !== 3;
    });

    // Multiplayer Proficiency (Host only)
    elements.multiplayerProficiencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Fix: Cast element to HTMLElement to access the dataset property.
            state.proficiency = (btn as HTMLElement).dataset.level;
            if (state.socket) {
                state.socket.emit('setProficiency', { groupCode: state.groupCode, proficiency: state.proficiency });
            }
            hideModal(elements.multiplayerProficiencyModal);
            showModal(elements.waitingRoomModal);
            elements.startGameBtn.style.display = 'block';
        });
    });
    elements.backFromMultiplayerProficiencyBtn.addEventListener('click', () => {
        // This should disconnect and go back to the multiplayer setup
        hideModal(elements.multiplayerProficiencyModal);
        showModal(elements.multiplayerModal);
         if (state.socket) {
            state.socket.emit('disconnect'); // This won't work, need server-side logic to handle group teardown. For now, just disconnect.
            state.socket.disconnect();
        }
    });

    // Waiting Room
    elements.startGameBtn.addEventListener('click', () => {
         if (state.socket && state.players.length > 0 && state.players[0].id === state.playerData.id) {
            state.socket.emit('startGameRequest', { groupCode: state.groupCode, proficiency: state.proficiency });
        }
    });
    elements.backFromWaitingBtn.addEventListener('click', resetToMenu);
    
    // Game Over
    elements.playAgainBtn.addEventListener('click', resetToMenu);

    // Save/Resume Logic
    elements.resumeGameBtn.addEventListener('click', resumeGame);

    // Quiz Setup
    elements.quizProficiencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Fix: Cast element to HTMLElement to access the dataset property.
            state.quizProficiency = (btn as HTMLElement).dataset.level;
            startQuiz();
        });
    });
    elements.backFromQuizSetupBtn.addEventListener('click', () => {
        hideModal(elements.quizSetupModal);
        showModal(elements.modeModal);
    });

    // Menu Buttons
    elements.backToMenuBtn.addEventListener('click', resetToMenu);
    elements.quizBackToMenuBtn.addEventListener('click', resetToMenu);
}

function startGame() {
    hideModal(elements.playerSetupModal);
    elements.gameContainer.style.display = 'block';
    elements.gameView.style.display = 'block';
    elements.quizView.style.display = 'none';

    state.currentQuestionIndex = 0;
    state.score = 0;
    
    loadQuestion(state.currentQuestionIndex);
    
    if (state.gameMode === 'single') {
        window.addEventListener('beforeunload', saveGameState);
    }
}

function endGame(title, message) {
    clearInterval(state.timerInterval);
    elements.gameOverTitle.textContent = title;
    elements.gameOverMessage.textContent = message;
    // Fix: Convert the score number to a string before assigning to textContent.
    elements.finalScore.textContent = (state.gameMode === 'quiz' ? state.quizScore : state.score).toString();
    showModal(elements.gameOverModal);
    
    if (state.gameMode === 'single') {
        localStorage.removeItem('syntaxGameState');
        window.removeEventListener('beforeunload', saveGameState);
    }
}

// --- LOCAL STORAGE (SINGLE PLAYER) ---
function saveGameState() {
    // Do not save hard level games as they are a different format
    if (state.proficiency === 'hard') return;
    const gameState = {
        proficiency: state.proficiency,
        currentQuestionIndex: state.currentQuestionIndex,
        score: state.score,
        timer: state.timer
    };
    localStorage.setItem('syntaxGameState', JSON.stringify(gameState));
}

function checkForSavedGame() {
    if (localStorage.getItem('syntaxGameState')) {
        elements.resumeGameContainer.style.display = 'block';
    } else {
        elements.resumeGameContainer.style.display = 'none';
    }
}

function resumeGame() {
    const savedState = JSON.parse(localStorage.getItem('syntaxGameState'));
    if (savedState) {
        state.proficiency = savedState.proficiency;
        state.currentQuestionIndex = savedState.currentQuestionIndex;
        state.score = savedState.score;
        state.timer = savedState.timer;
        startGame();
        // Override timer from saved state
        resetTimer();
        state.timer = savedState.timer > 0 ? savedState.timer : 50;
        startTimer();
    }
}

// --- MULTIPLAYER LOGIC ---
function initializeSocket() {
    // Connect to the local server, prioritizing websockets
    state.socket = io({
        transports: ['websocket']
    }); 
    elements.multiplayerFeedback.textContent = 'Connecting to server...';

    state.socket.on('connect', () => {
        console.log('Connected to server with ID:', state.socket.id);
        state.playerData.id = state.socket.id;
        elements.multiplayerFeedback.textContent = '';
        elements.createGroupBtn.disabled = elements.nicknameInput.value.trim().length === 0;
    });
    
    state.socket.on('connect_error', (err) => {
        console.error('Connection Error:', err);
        elements.multiplayerFeedback.textContent = 'Failed to connect to server.';
        elements.createGroupBtn.disabled = true;
        elements.joinGroupBtn.disabled = true;
    });

    state.socket.on('groupCreated', ({ groupCode, players }) => {
        state.groupCode = groupCode;
        state.players = players;
        state.playerData.groupCode = groupCode;
        hideModal(elements.multiplayerModal);
        
        // Host chooses proficiency
        showModal(elements.multiplayerProficiencyModal);
        
        updateWaitingRoom(players);
        elements.groupCodeDisplay.textContent = groupCode;
    });
    
    state.socket.on('joinSuccess', ({ groupCode }) => {
        state.groupCode = groupCode;
        state.playerData.groupCode = groupCode;
        hideModal(elements.multiplayerModal);
        showModal(elements.waitingRoomModal);
        elements.groupCodeDisplay.textContent = groupCode;
    });
    
    state.socket.on('joinError', (message) => {
        elements.multiplayerFeedback.textContent = message;
    });
    
    state.socket.on('updatePlayers', (players) => {
        updateWaitingRoom(players);
        if (state.gameMode === 'multi' && elements.gameContainer.style.display === 'block') {
            updateScoreboard(players);
        }
    });
    
    state.socket.on('gameStarted', ({ proficiency }) => {
        state.proficiency = proficiency;
        hideModal(elements.waitingRoomModal);
        hideModal(elements.multiplayerProficiencyModal);
        startGame();
        elements.multiplayerScoreboard.style.display = 'block';
        updateScoreboard(state.players);
    });
}

function createGroup() {
    const nickname = elements.nicknameInput.value.trim();
    if (nickname && state.socket) {
        state.playerData.nickname = nickname;
        state.socket.emit('createGroup', state.playerData);
    }
}

function joinGroup() {
    const nickname = elements.nicknameInput.value.trim();
    const groupCode = elements.groupCodeInput.value.trim();
    if (nickname && groupCode && state.socket) {
        state.playerData.nickname = nickname;
        state.socket.emit('joinGroup', { playerData: state.playerData, groupCode });
    }
}

function updateWaitingRoom(players) {
    state.players = players;
    elements.waitingPlayerList.innerHTML = '';
    players.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.nickname + (p.id === state.playerData.id ? ' (You)' : '');
        elements.waitingPlayerList.appendChild(li);
    });
    
    // Host control logic
    const isHost = state.players.length > 0 && state.players[0].id === state.playerData.id;
    if (isHost && elements.waitingRoomModal.style.display === 'flex' && elements.multiplayerProficiencyModal.style.display === 'none') {
        elements.startGameBtn.style.display = 'block';
    }
}

function updateScoreboard(players) {
    // Sort players by score descending
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    elements.playerScoresList.innerHTML = '';
    sortedPlayers.forEach(p => {
        const li = document.createElement('li');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = p.nickname + (p.id === state.playerData.id ? ' (You)' : '');
        
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'player-score';
        scoreSpan.textContent = p.score;
        
        li.appendChild(nameSpan);
        li.appendChild(scoreSpan);
        elements.playerScoresList.appendChild(li);
    });
}

// --- QUIZ LOGIC ---
function startQuiz() {
    hideModal(elements.quizSetupModal);
    elements.gameContainer.style.display = 'block';
    elements.gameView.style.display = 'none';
    elements.quizView.style.display = 'block';

    state.quizQuestions = quizData[state.quizProficiency];
    state.totalQuestions = state.quizQuestions.length;
    state.currentQuizQuestionIndex = 0;
    state.quizScore = 0;

    loadQuizQuestion(state.currentQuizQuestionIndex);
}

function loadQuizQuestion(index) {
    elements.quizLevelIndicator.textContent = `Difficulty: ${state.quizProficiency.charAt(0).toUpperCase() + state.quizProficiency.slice(1)}`;
    elements.quizQuestionIndicator.textContent = `Question: ${index + 1}/${state.totalQuestions}`;
    elements.quizProgressBar.style.width = `${((index + 1) / state.totalQuestions) * 100}%`;
    elements.quizFeedbackArea.textContent = '';
    elements.nextQuestionBtn.style.display = 'none';
    
    const question = state.quizQuestions[index];
    elements.quizQuestionText.textContent = question.question;
    elements.quizOptionsArea.innerHTML = '';

    const shuffledOptions = [...question.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(optionText => {
        const button = document.createElement('button');
        button.className = 'quiz-option-btn';
        button.textContent = optionText;
        button.addEventListener('click', () => checkQuizAnswer(button, optionText, question.answer));
        elements.quizOptionsArea.appendChild(button);
    });
}

function checkQuizAnswer(button, selectedOption, correctAnswer) {
    const allOptionBtns = elements.quizOptionsArea.querySelectorAll('.quiz-option-btn');
    // Fix: Cast each button element to HTMLButtonElement to access the 'disabled' property.
    allOptionBtns.forEach(btn => (btn as HTMLButtonElement).disabled = true);

    if (selectedOption === correctAnswer) {
        button.classList.add('correct');
        elements.quizFeedbackArea.textContent = 'Correct!';
        elements.quizFeedbackArea.style.color = 'var(--success)';
        state.quizScore += 100;
    } else {
        button.classList.add('incorrect');
        elements.quizFeedbackArea.textContent = `Incorrect. The correct answer is "${correctAnswer}".`;
        elements.quizFeedbackArea.style.color = 'var(--error)';
        // Highlight the correct answer
        allOptionBtns.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    elements.nextQuestionBtn.style.display = 'block';
}

function nextQuizQuestion() {
    state.currentQuizQuestionIndex++;
    if (state.currentQuizQuestionIndex < state.totalQuestions) {
        loadQuizQuestion(state.currentQuizQuestionIndex);
    } else {
        endGame("Quiz Complete!", "You've finished all the quiz questions.");
    }
}

// --- APP INITIALIZATION ---
function initialize() {
    setupUI();
    setupTileInteractions();
    elements.nextQuestionBtn.addEventListener('click', nextQuizQuestion);
    showModal(elements.modeModal);
}

initialize();