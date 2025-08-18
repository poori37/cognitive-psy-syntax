declare var ohm: any;
declare var io: any;

// --- CONFIGURATION ---
const SOCKET_SERVER_URL = "https://cognitive-psy-assessment.onrender.com"; // Connect to the live server
const TIME_LIMIT = 60; // seconds

// --- DATA ---
const grammarMap = {
    'S': 'Subject (a noun that performs the action)', 'V': 'Verb (the action word)',
    'O': 'Object (a noun that receives the action)', 'Det': 'Determiner (e.g., a, the, my)',
    'N': 'Noun (person, place, or thing)', 'Adj': 'Adjective (describes a noun)',
    'Adv': 'Adverb (describes a verb)', 'PP': 'Prepositional Phrase (e.g., "on the chair")',
    'Conj': 'Conjunction (e.g., and, but, or)', 'Compound': 'Compound Element',
    'Question': 'Question Form', 'Wh': 'Wh-word (e.g., Who, What, Where)',
    'Aux': 'Auxiliary Verb (e.g., do, can, is)'
};

const levels = [
    // Levels 1-20: Beginner
    { rule: "S_V", target: "S - V", words: [{word: "Birds", type: "Noun"}, {word: "fly", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "Det_N_V", target: "Det - N - V", words: [{word: "The", type: "Det"}, {word: "sun", type: "Noun"}, {word: "shines", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O", target: "S - V - O", words: [{word: "Cats", type: "Noun"}, {word: "chase", type: "Verb"}, {word: "mice", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_Adv", target: "S - V - Adv", words: [{word: "She", type: "Noun"}, {word: "sings", type: "Verb"}, {word: "loudly", type: "Adv"}, {word: ".", type: "Punct"}] },
    { rule: "Det_Adj_N_V", target: "Det - Adj - N - V", words: [{word: "The", type: "Det"}, {word: "big", type: "Adj"}, {word: "dog", type: "Noun"}, {word: "barks", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V", target: "S - V", words: [{word: "Fish", type: "Noun"}, {word: "swim", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "Det_N_V", target: "Det - N - V", words: [{word: "A", type: "Det"}, {word: "baby", type: "Noun"}, {word: "cries", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O", target: "S - V - O", words: [{word: "He", type: "Noun"}, {word: "reads", type: "Verb"}, {word: "books", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_Adv", target: "S - V - Adv", words: [{word: "They", type: "Noun"}, {word: "ran", type: "Verb"}, {word: "quickly", type: "Adv"}, {word: ".", type: "Punct"}] },
    { rule: "Det_Adj_N_V", target: "Det - Adj - N - V", words: [{word: "My", type: "Det"}, {word: "red", type: "Adj"}, {word: "car", type: "Noun"}, {word: "drives", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O", target: "S - V - O", words: [{word: "I", type: "Noun"}, {word: "love", type: "Verb"}, {word: "music", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Det_N_V", target: "Det - N - V", words: [{word: "The", type: "Det"}, {word: "stars", type: "Noun"}, {word: "twinkle", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V", target: "S - V", words: [{word: "Water", type: "Noun"}, {word: "flows", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_Adv", target: "S - V - Adv", words: [{word: "He", type: "Noun"}, {word: "speaks", type: "Verb"}, {word: "softly", type: "Adv"}, {word: ".", type: "Punct"}] },
    { rule: "Det_Adj_N_V", target: "Det - Adj - N - V", words: [{word: "A", type: "Det"}, {word: "small", type: "Adj"}, {word: "boat", type: "Noun"}, {word: "sails", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O", target: "S - V - O", words: [{word: "We", type: "Noun"}, {word: "play", type: "Verb"}, {word: "games", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Det_N_V", target: "Det - N - V", words: [{word: "The", type: "Det"}, {word: "wind", type: "Noun"}, {word: "blows", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_Adv", target: "S - V - Adv", words: [{word: "She", type: "Noun"}, {word: "waited", type: "Verb"}, {word: "patiently", type: "Adv"}, {word: ".", type: "Punct"}] },
    { rule: "S_V", target: "S - V", words: [{word: "Time", type: "Noun"}, {word: "passes", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O", target: "S - V - O", words: [{word: "You", type: "Noun"}, {word: "need", type: "Verb"}, {word: "help", type: "Noun"}, {word: "?", type: "Punct"}] },
    // Levels 21-40: Advanced
    { rule: "S_V_PP", target: "S - V - PP", words: [{word: "He", type: "Noun"}, {word: "walked", type: "Verb"}, {word: "to", type: "Prep"}, {word: "school", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_PP", target: "S - V - O - PP", words: [{word: "She", type: "Noun"}, {word: "put", type: "Verb"}, {word: "the book", type: "Noun"}, {word: "on", type: "Prep"}, {word: "the table", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_Conj_V", target: "S - V - Conj - V", words: [{word: "They", type: "Noun"}, {word: "danced", type: "Verb"}, {word: "and", type: "Conj"}, {word: "sang", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "Compound_S_V", target: "Compound S - V", words: [{word: "John", type: "Noun"}, {word: "and", type: "Conj"}, {word: "Mary", type: "Noun"}, {word: "left", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_Conj_S_V_O", target: "S - V - O, Conj S - V - O", words: [{word: "I", type: "Noun"}, {word: "like", type: "Verb"}, {word: "tea", type: "Noun"}, {word: ",", type: "Comma"}, {word: "but", type: "Conj"}, {word: "he", type: "Noun"}, {word: "likes", type: "Verb"}, {word: "coffee", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Question_V_S_O", target: "Question: Aux - S - V - O", words: [{word: "Do", type: "Aux"}, {word: "you", type: "Noun"}, {word: "want", type: "Verb"}, {word: "pizza", type: "Noun"}, {word: "?", type: "Punct"}] },
    { rule: "Question_Wh_V_S", target: "Question: Wh - Aux - S - V", words: [{word: "Where", type: "Wh"}, {word: "are", type: "Aux"}, {word: "you", type: "Noun"}, {word: "going", type: "Verb"}, {word: "?", type: "Punct"}] },
    { rule: "S_V_PP", target: "S - V - PP", words: [{word: "The keys", type: "Noun"}, {word: "are", type: "Verb"}, {word: "in", type: "Prep"}, {word: "the drawer", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_PP", target: "S - V - O - PP", words: [{word: "He", type: "Noun"}, {word: "hit", type: "Verb"}, {word: "the nail", type: "Noun"}, {word: "with", type: "Prep"}, {word: "a hammer", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_Conj_V", target: "S - V - Conj - V", words: [{word: "I", type: "Noun"}, {word: "will call", type: "Verb"}, {word: "or", type: "Conj"}, {word: "text", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "Compound_S_V", target: "Compound S - V", words: [{word: "The dog", type: "Noun"}, {word: "and", type: "Conj"}, {word: "the cat", type: "Noun"}, {word: "are sleeping", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_Conj_S_V_O", target: "S - V - O, Conj S - V - O", words: [{word: "She", type: "Noun"}, {word: "is", type: "Verb"}, {word: "smart", type: "Noun"}, {word: ",", type: "Comma"}, {word: "and", type: "Conj"}, {word: "she", type: "Noun"}, {word: "is", type: "Verb"}, {word: "funny", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Question_V_S_O", target: "Question: Aux - S - V - O", words: [{word: "Can", type: "Aux"}, {word: "I", type: "Noun"}, {word: "have", type: "Verb"}, {word: "some", type: "Noun"}, {word: "?", type: "Punct"}] },
    { rule: "Question_Wh_V_S", target: "Question: Wh - Aux - S - V", words: [{word: "What", type: "Wh"}, {word: "did", type: "Aux"}, {word: "you", type: "Noun"}, {word: "say", type: "Verb"}, {word: "?", type: "Punct"}] },
    { rule: "S_V_PP", target: "S - V - PP", words: [{word: "We", type: "Noun"}, {word: "live", type: "Verb"}, {word: "near", type: "Prep"}, {word: "the city", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_PP", target: "S - V - O - PP", words: [{word: "I", type: "Noun"}, {word: "read", type: "Verb"}, {word: "a story", type: "Noun"}, {word: "about", type: "Prep"}, {word: "dragons", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_Conj_V", target: "S - V - Conj - V", words: [{word: "He", type: "Noun"}, {word: "tripped", type: "Verb"}, {word: "but", type: "Conj"}, {word: "recovered", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "Compound_S_V", target: "Compound S - V", words: [{word: "My mom", type: "Noun"}, {word: "and", type: "Conj"}, {word: "my dad", type: "Noun"}, {word: "are here", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_Conj_S_V_O", target: "S - V - O, Conj S - V - O", words: [{word: "He", type: "Noun"}, {word: "came", type: "Verb"}, {word: "home", type: "Noun"}, {word: ",", type: "Comma"}, {word: "so", type: "Conj"}, {word: "I", type: "Noun"}, {word: "started", type: "Verb"}, {word: "dinner", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Question_V_S_O", target: "Question: Aux - S - V - O", words: [{word: "Will", type: "Aux"}, {word: "they", type: "Noun"}, {word: "win", type: "Verb"}, {word: "the game", type: "Noun"}, {word: "?", type: "Punct"}] },
    // Levels 41-50: Professional
    { rule: "S_V_O_PP", target: "S - V - O - PP", words: [{word: "The painting", type: "Noun"}, {word: "was hung", type: "Verb"}, {word: "by the artist", type: "Noun"}, {word: "in", type: "Prep"}, {word: "the gallery", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_Conj_S_V_O", target: "S - V - O, Conj S - V - O", words: [{word: "Before", type: "Conj"}, {word: "you", type: "Noun"}, {word: "leave", type: "Verb"}, {word: "the house", type: "Noun"}, {word: ",", type: "Comma"}, {word: "you", type: "Noun"}, {word: "should check", type: "Verb"}, {word: "the lights", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Question_Wh_V_S", target: "Question: Wh - Aux - S - V", words: [{word: "Why", type: "Wh"}, {word: "is", type: "Aux"}, {word: "the sky", type: "Noun"}, {word: "blue", type: "Verb"}, {word: "?", type: "Punct"}] },
    { rule: "S_V_PP", target: "S - V - PP", words: [{word: "Running", type: "Noun"}, {word: "is", type: "Verb"}, {word: "good", type: "Prep"}, {word: "for you", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O", target: "S - V - O", words: [{word: "To err", type: "Noun"}, {word: "is", type: "Verb"}, {word: "human", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Det_Adj_N_V", target: "Det - Adj - N - V", words: [{word: "The", type: "Det"}, {word: "barking", type: "Adj"}, {word: "dog", type: "Noun"}, {word: "is", type: "Verb"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_PP", target: "S - V - O - PP", words: [{word: "I", type: "Noun"}, {word: "saw", type: "Verb"}, {word: "the man", type: "Noun"}, {word: "with", type: "Prep"}, {word: "the telescope", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "S_V_O_Conj_S_V_O", target: "S - V - O, Conj S - V - O", words: [{word: "Although", type: "Conj"}, {word: "it", type: "Noun"}, {word: "was", type: "Verb"}, {word: "raining", type: "Noun"}, {word: ",", type: "Comma"}, {word: "we", type: "Noun"}, {word: "went", type: "Verb"}, {word: "outside", type: "Noun"}, {word: ".", type: "Punct"}] },
    { rule: "Question_V_S_O", target: "Question: Aux - S - V - O", words: [{word: "Have", type: "Aux"}, {word: "you", type: "Noun"}, {word: "finished", type: "Verb"}, {word: "your homework", type: "Noun"}, {word: "?", type: "Punct"}] },
    { rule: "Compound_S_V", target: "Compound S - V", words: [{word: "The old", type: "Noun"}, {word: "and", type: "Conj"}, {word: "the young", type: "Noun"}, {word: "agree", type: "Verb"}, {word: ".", type: "Punct"}] },
];


// --- DOM ELEMENTS ---
const DOMElements = {
    gameContainer: document.getElementById('game-container') as HTMLElement,
    // Modals
    modeModalOverlay: document.getElementById('mode-modal-overlay') as HTMLElement,
    levelModalOverlay: document.getElementById('level-modal-overlay') as HTMLElement,
    multiplayerModalOverlay: document.getElementById('multiplayer-modal-overlay') as HTMLElement,
    waitingRoomOverlay: document.getElementById('waiting-room-overlay') as HTMLElement,
    abbrModalOverlay: document.getElementById('abbr-modal-overlay') as HTMLElement,
    abbrModalContent: document.getElementById('abbr-modal-content') as HTMLElement,
    modalDefinitions: document.getElementById('modal-definitions') as HTMLElement,
    // Buttons
    singlePlayerBtn: document.getElementById('single-player-btn') as HTMLButtonElement,
    multiplayerBtn: document.getElementById('multiplayer-btn') as HTMLButtonElement,
    beginnerBtn: document.getElementById('beginner-level') as HTMLButtonElement,
    advancedBtn: document.getElementById('advanced-level') as HTMLButtonElement,
    professionalBtn: document.getElementById('professional-level') as HTMLButtonElement,
    joinGroupBtn: document.getElementById('join-group-btn') as HTMLButtonElement,
    createGroupBtn: document.getElementById('create-group-btn') as HTMLButtonElement,
    startGameBtn: document.getElementById('start-game-btn') as HTMLButtonElement,
    checkBtn: document.getElementById('check-btn') as HTMLButtonElement,
    resetBtn: document.getElementById('reset-btn') as HTMLButtonElement,
    changeLevelBtn: document.getElementById('change-level-btn') as HTMLButtonElement,
    abbrModalCloseBtn: document.getElementById('abbr-modal-close-btn') as HTMLButtonElement,
    // Inputs & Displays
    nicknameInput: document.getElementById('nickname-input') as HTMLInputElement,
    groupCodeInput: document.getElementById('group-code-input') as HTMLInputElement,
    multiplayerFeedback: document.getElementById('multiplayer-feedback') as HTMLElement,
    groupCodeDisplay: document.getElementById('group-code-display') as HTMLElement,
    groupCodeText: document.querySelector('#group-code-display strong') as HTMLElement,
    waitingRoomPlayerList: document.getElementById('waiting-room-player-list') as HTMLElement,
    // Game UI
    levelCounter: document.getElementById('level-counter') as HTMLElement,
    scoreCounter: document.getElementById('score-counter') as HTMLElement,
    timerDisplay: document.getElementById('timer-display') as HTMLElement,
    progressBar: document.getElementById('progress-bar') as HTMLElement,
    scoreboard: document.getElementById('scoreboard') as HTMLElement,
    playerList: document.getElementById('player-list') as HTMLElement,
    challengeDisplay: document.getElementById('challenge-display') as HTMLElement,
    targetGrammar: document.getElementById('target-grammar') as HTMLElement,
    sentenceArea: document.getElementById('sentence-area') as HTMLElement,
    wordBank: document.getElementById('word-bank') as HTMLElement,
    feedback: document.getElementById('feedback') as HTMLElement,
};

// --- GAME STATE ---
let state = {
    gameMode: null as 'singlePlayer' | 'multiplayer' | null,
    socket: null as any, // Consider using a more specific type if you have socket.io types
    playerData: { id: null as string | null, nickname: '', score: 0, groupCode: null as string | null },
    currentLevel: 0,
    score: 0,
    timerInterval: null as NodeJS.Timeout | null,
    timeLeft: TIME_LIMIT,
    grammar: null as any,
    semantics: null as any,
    draggedItem: null as HTMLElement | null,
};

// --- INITIALIZATION ---
function init() {
    setupGrammar();
    addEventListeners();
}

function setupGrammar() {
    const grammarScript = document.getElementById('grammar')!.textContent;
    state.grammar = ohm.grammar(grammarScript);
    state.semantics = state.grammar.createSemantics().addOperation('getPos', {
        _iter: (...children: any[]) => children.map(c => c.getPos()).join(' '),
        _terminal: function(this: any) { return this.sourceString; }
    });
}

// --- EVENT LISTENERS ---
function addEventListeners() {
    // Mode Selection
    DOMElements.singlePlayerBtn.addEventListener('click', () => selectGameMode('singlePlayer'));
    DOMElements.multiplayerBtn.addEventListener('click', () => selectGameMode('multiplayer'));

    // Level Selection
    DOMElements.beginnerBtn.addEventListener('click', () => { setLevelAndStart(0); });
    DOMElements.advancedBtn.addEventListener('click', () => { setLevelAndStart(20); });
    DOMElements.professionalBtn.addEventListener('click', () => { setLevelAndStart(40); });
    DOMElements.changeLevelBtn.addEventListener('click', () => DOMElements.levelModalOverlay.style.display = 'flex');

    // Multiplayer
    DOMElements.createGroupBtn.addEventListener('click', createGroup);
    DOMElements.joinGroupBtn.addEventListener('click', joinGroup);
    DOMElements.startGameBtn.addEventListener('click', () => {
        if (state.socket && state.playerData.groupCode) {
            state.socket.emit('startGameRequest', state.playerData.groupCode);
        }
    });

    // In-Game Controls
    DOMElements.checkBtn.addEventListener('click', checkSentence);
    DOMElements.resetBtn.addEventListener('click', resetLevel);
    
    // Abbreviation Modal
    DOMElements.challengeDisplay.addEventListener('click', showAbbreviations);
    DOMElements.abbrModalCloseBtn.addEventListener('click', hideAbbreviations);
    DOMElements.abbrModalOverlay.addEventListener('click', (e) => {
        if (e.target === DOMElements.abbrModalOverlay) hideAbbreviations();
    });

    // Drag and Drop
    [DOMElements.sentenceArea, DOMElements.wordBank].forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

// --- MODAL & GAME FLOW ---
function selectGameMode(mode: 'singlePlayer' | 'multiplayer') {
    state.gameMode = mode;
    DOMElements.modeModalOverlay.style.display = 'none';
    if (mode === 'singlePlayer') {
        DOMElements.levelModalOverlay.style.display = 'flex';
        DOMElements.scoreboard.style.display = 'none'; // Hide scoreboard in single player
    } else {
        DOMElements.multiplayerModalOverlay.style.display = 'flex';
        DOMElements.scoreboard.style.display = 'block'; // Show scoreboard in multiplayer
        connectSocket();
    }
}

function setLevelAndStart(level: number) {
    state.currentLevel = level;
    // For single player, start game immediately. For multiplayer, game starts via socket event.
    if (state.gameMode === 'singlePlayer') {
        startGame();
    }
}

function startGame() {
    DOMElements.levelModalOverlay.style.display = 'none';
    DOMElements.multiplayerModalOverlay.style.display = 'none';
    DOMElements.waitingRoomOverlay.style.display = 'none';
    DOMElements.gameContainer.style.display = 'block';
    DOMElements.changeLevelBtn.style.display = 'block';
    state.score = 0;
    updateScoreUI();
    loadLevel(state.currentLevel);
}

// --- MULTIPLAYER LOGIC ---
function connectSocket() {
    if (state.socket) return;
    try {
        state.socket = io(SOCKET_SERVER_URL, { reconnection: false });

        state.socket.on('connect', () => {
            state.playerData.id = state.socket.id;
            console.log('Connected to server with ID:', state.playerData.id);
        });

        state.socket.on('connect_error', (err: Error) => {
            console.error('Connection failed:', err.message);
            DOMElements.multiplayerFeedback.textContent = "Error: Could not connect to server.";
            // Disable multiplayer buttons to prevent further attempts
            DOMElements.createGroupBtn.disabled = true;
            DOMElements.joinGroupBtn.disabled = true;
        });

        state.socket.on('groupCreated', ({ groupCode, players }: { groupCode: string, players: any[] }) => {
            state.playerData.groupCode = groupCode;
            DOMElements.multiplayerFeedback.textContent = '';
            DOMElements.groupCodeDisplay.style.display = 'block';
            DOMElements.groupCodeText.textContent = groupCode;
            
            DOMElements.multiplayerModalOverlay.style.display = 'none';
            DOMElements.waitingRoomOverlay.style.display = 'flex';
            updateWaitingRoomUI(players);
        });

        state.socket.on('joinSuccess', (groupData: { groupCode: string }) => {
            state.playerData.groupCode = groupData.groupCode;
            DOMElements.multiplayerModalOverlay.style.display = 'none';
            DOMElements.waitingRoomOverlay.style.display = 'flex';
            // The 'updatePlayers' event will now handle rendering the player list.
        });
        
        state.socket.on('joinError', (message: string) => {
            DOMElements.multiplayerFeedback.textContent = message;
        });
        
        state.socket.on('updatePlayers', (players: any[]) => {
            updateScoreboard(players);
            updateWaitingRoomUI(players);
        });

        state.socket.on('gameStarted', () => {
            // Everyone starts the game at beginner level for now
            setLevelAndStart(0); 
            startGame();
        });

        state.socket.on('disconnect', () => {
            console.log('Disconnected from server.');
            displayFeedback('Connection to server lost.', 'error', 0);
        });
    } catch (error) {
        console.error("Socket.IO client error:", error);
        DOMElements.multiplayerFeedback.textContent = "An error occurred while setting up multiplayer.";
    }
}

function createGroup() {
    const nickname = DOMElements.nicknameInput.value.trim();
    if (!nickname) {
        DOMElements.multiplayerFeedback.textContent = 'Please enter a nickname.';
        return;
    }
    if (!state.socket || !state.socket.connected) {
        DOMElements.multiplayerFeedback.textContent = 'Not connected to server.';
        return;
    }
    state.playerData.nickname = nickname;
    state.socket.emit('createGroup', state.playerData);
}

function joinGroup() {
    const nickname = DOMElements.nicknameInput.value.trim();
    const groupCode = DOMElements.groupCodeInput.value.trim();
    if (!nickname || !groupCode) {
        DOMElements.multiplayerFeedback.textContent = 'Please enter a nickname and group code.';
        return;
    }
    if (!state.socket || !state.socket.connected) {
        DOMElements.multiplayerFeedback.textContent = 'Not connected to server.';
        return;
    }
    state.playerData.nickname = nickname;
    state.socket.emit('joinGroup', { playerData: state.playerData, groupCode });
}


// --- CORE GAME LOGIC ---
function loadLevel(levelIndex: number) {
    if (levelIndex >= levels.length) {
        displayFeedback("Congratulations! You've completed all levels!", 'success', 0);
        stopTimer();
        return;
    }
    
    state.currentLevel = levelIndex;
    const level = levels[levelIndex];
    
    // Clear previous state
    DOMElements.sentenceArea.innerHTML = '';
    DOMElements.wordBank.innerHTML = '';
    displayFeedback('', 'info');

    // Populate word bank with shuffled words
    shuffleArray(level.words).forEach(wordObj => {
        const tile = createWordTile(wordObj);
        DOMElements.wordBank.appendChild(tile);
    });

    // Update UI
    DOMElements.targetGrammar.textContent = level.target;
    updateProgress();
    
    // Start timer
    startTimer();
}

function createWordTile(wordObj: { word: string, type: string }) {
    const tile = document.createElement('div');
    tile.className = 'word-tile';
    tile.textContent = wordObj.word;
    tile.dataset.type = wordObj.type.toLowerCase();
    tile.draggable = true;
    if (wordObj.type === 'Punct' || wordObj.type === 'Comma') {
        tile.classList.add('punctuation');
    }
    
    tile.addEventListener('dragstart', handleDragStart);
    tile.addEventListener('dragend', handleDragEnd);
    return tile;
}

function resetLevel() {
    loadLevel(state.currentLevel);
}

function checkSentence() {
    stopTimer();
    DOMElements.checkBtn.disabled = true;

    const sentenceTiles = [...DOMElements.sentenceArea.children];
    if (sentenceTiles.length === 0) {
        displayFeedback('Please build a sentence first.', 'info');
        DOMElements.checkBtn.disabled = false;
        startTimer(); // Restart timer if nothing was checked
        return;
    }
    
    const posString = sentenceTiles.map(tile => (tile as HTMLElement).dataset.type).join(' ');
    const targetRule = levels[state.currentLevel].rule;
    
    const match = state.grammar.match(posString, targetRule);
    
    if (match.succeeded()) {
        const points = 10 + state.timeLeft; // More points for faster answers
        state.score += points;
        updateScoreUI();
        if (state.gameMode === 'multiplayer' && state.socket && state.socket.connected) {
            state.playerData.score = state.score;
            state.socket.emit('updateScore', state.playerData);
        }
        displayFeedback(`Correct! +${points} points`, 'correct');
        setTimeout(() => loadLevel(state.currentLevel + 1), 1500);
    } else {
        displayFeedback('That sentence structure is incorrect. Try again!', 'incorrect');
        setTimeout(() => {
            DOMElements.checkBtn.disabled = false;
            startTimer();
        }, 1500);
    }
}

// --- TIMER ---
function startTimer() {
    stopTimer(); // Ensure no multiple timers run
    state.timeLeft = TIME_LIMIT;
    DOMElements.timerDisplay.textContent = `${state.timeLeft}s`;
    DOMElements.checkBtn.disabled = false;
    
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        DOMElements.timerDisplay.textContent = `${state.timeLeft}s`;
        if (state.timeLeft <= 0) {
            stopTimer();
            displayFeedback("Time's up! Moving to the next question.", 'info');
            setTimeout(() => loadLevel(state.currentLevel + 1), 2000);
        }
    }, 1000);
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }
}

// --- UI UPDATES ---
function updateScoreUI() {
    DOMElements.scoreCounter.textContent = `Score: ${state.score}`;
}

function updateProgress() {
    const progress = (state.currentLevel / levels.length) * 100;
    DOMElements.progressBar.style.width = `${progress}%`;
    DOMElements.levelCounter.textContent = `Level ${state.currentLevel + 1} / ${levels.length}`;
}

function updateWaitingRoomUI(players: { nickname: string }[]) {
    DOMElements.waitingRoomPlayerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.nickname;
        DOMElements.waitingRoomPlayerList.appendChild(li);
    });
}

function updateScoreboard(players: { nickname: string, score: number, id: string }[]) {
    DOMElements.playerList.innerHTML = '';
    players.sort((a, b) => b.score - a.score); // Sort by score descending
    players.forEach(player => {
        const li = document.createElement('li');
        li.innerHTML = `
                    <span class="player-name">${player.nickname}</span>
                    <span class="player-score">${player.score}</span>
                `;
        if (player.id === state.playerData.id) {
            li.classList.add('current-player');
        }
        DOMElements.playerList.appendChild(li);
    });
}

function displayFeedback(message: string, type: 'info' | 'correct' | 'incorrect' | 'success' | 'error', duration = 3000) {
    DOMElements.feedback.textContent = message;
    DOMElements.feedback.className = `feedback-${type}`;
    if (duration > 0) {
        setTimeout(() => {
            if (DOMElements.feedback.textContent === message) {
                DOMElements.feedback.textContent = '';
            }
        }, duration);
    }
}

function showAbbreviations() {
    const targetText = levels[state.currentLevel].target.split(' - ');
    let html = '';
    const uniqueAbbrs = [...new Set(targetText.map(t => t.replace(/[^A-Z]/g, '')))];
    uniqueAbbrs.forEach(abbr => {
        const fullForm = (grammarMap as any)[abbr] || 'Unknown';
        html += `<p><strong>${abbr}:</strong> ${fullForm}</p>`;
    });
    DOMElements.modalDefinitions.innerHTML = html;
    DOMElements.abbrModalOverlay.style.display = 'flex';
}

function hideAbbreviations() {
    DOMElements.abbrModalOverlay.style.display = 'none';
}

// --- DRAG & DROP HANDLERS ---
function handleDragStart(e: DragEvent) {
    state.draggedItem = e.target as HTMLElement;
    setTimeout(() => (e.target as HTMLElement).classList.add('dragging'), 0);
}

function handleDragEnd(e: DragEvent) {
    (e.target as HTMLElement).classList.remove('dragging');
}

function handleDragOver(e: DragEvent) {
    e.preventDefault();
    (e.target as HTMLElement).closest('.drop-zone')?.classList.add('drag-over');
}

function handleDragLeave(e: DragEvent) {
    (e.target as HTMLElement).closest('.drop-zone')?.classList.remove('drag-over');
}

function handleDrop(e: DragEvent) {
    e.preventDefault();
    const dropZone = (e.target as HTMLElement).closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.remove('drag-over');
        if (state.draggedItem) {
            dropZone.appendChild(state.draggedItem);
        }
    }
    state.draggedItem = null;
}

// --- UTILITY ---
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- START THE APP ---
init();
