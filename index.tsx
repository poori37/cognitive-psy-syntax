
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { io, Socket } from 'socket.io-client';

// --- CONSOLIDATED FROM types.ts ---
interface Word {
    word: string;
    type: string;
}

interface CardQuestion {
    rule: string;
    displayRule: string;
    words: Word[];
}

interface HardQuestion {
    prompt: string;
    wordSet: string[];
    answer: string;
}

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

type Proficiency = 'easy' | 'medium' | 'hard';
type GameMode = 'single' | 'multi' | 'quiz' | null;

interface Player {
    id: string;
    nickname: string;
    score: number;
}
// --- END OF types.ts ---


// --- CONSOLIDATED FROM constants.ts ---
// Mapped type `[key in Proficiency]` was causing a Babel parsing error in the browser.
// Replaced with an explicit type definition for compatibility.
type Levels = {
    easy: (CardQuestion | HardQuestion)[];
    medium: (CardQuestion | HardQuestion)[];
    hard: (CardQuestion | HardQuestion)[];
};

type QuizData = {
    easy: QuizQuestion[];
    medium: QuizQuestion[];
    hard: QuizQuestion[];
};

const levels: Levels = {
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
        {
            rule: "Determiner_Noun_Verb_Determiner_Noun_Conjunction_Verb_Adverb_Punctuation",
            displayRule: 'Single Subject, Two Actions',
            words: [
                {word: "The", type: "Determiner"}, {word: "dog", type: "Noun"}, {word: "chased", type: "Verb"},
                {word: "the", type: "Determiner"}, {word: "ball", type: "Noun"}, {word: "and", type: "Conjunction"},
                {word: "barked", type: "Verb"}, {word: "loudly", type: "Adverb"}, {word: ".", type: "Punctuation"},
                {word: "on", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "lawn", type: "Noun"}
            ]
        },
        {
            rule: "Pronoun_Verb_Preposition_Determiner_Noun_Preposition_Determiner_Noun_Preposition_Noun_Punctuation",
            displayRule: 'Prepositional Phrase of Purpose',
            words: [
                {word: "She", type: "Pronoun"}, {word: "went", type: "Verb"}, {word: "to", type: "Preposition"},
                {word: "the", type: "Determiner"}, {word: "store", type: "Noun"}, {word: "for", type: "Preposition"},
                {word: "a", type: "Determiner"}, {word: "loaf", type: "Noun"}, {word: "of", type: "Preposition"},
                {word: "bread", type: "Noun"}, {word: ".", type: "Punctuation"},
                {word: "her", type: "Possessive"}, {word: "friend", type: "Noun"}, {word: "ran", type: "Verb"}
            ]
        },
        {
            rule: "Pronoun_Verb_Determiner_Noun_Comma_Conjunction_Pronoun_Verb_Adjective_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Compound Sentence with Conjunction',
            words: [
                {word: "He", type: "Pronoun"}, {word: "studied", type: "Verb"}, {word: "all", type: "Determiner"},
                {word: "night", type: "Noun"}, {word: ",", type: "Comma"}, {word: "so", type: "Conjunction"},
                {word: "he", type: "Pronoun"}, {word: "was", type: "Verb"}, {word: "tired", type: "Adjective"},
                {word: "in", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "morning", type: "Noun"},
                {word: ".", type: "Punctuation"}, {word: "happy", type: "Adjective"}
            ]
        },
        {
            rule: "Determiner_Noun_Verb_Conjunction_Determiner_Noun_Verb_Adjective_Punctuation",
            displayRule: 'Adverbial Clause of Reason',
            words: [
                {word: "The", type: "Determiner"}, {word: "machine", type: "Noun"}, {word: "broke", type: "Verb"},
                {word: "because", type: "Conjunction"}, {word: "the", type: "Determiner"}, {word: "part", type: "Noun"},
                {word: "was", type: "Verb"}, {word: "old", type: "Adjective"}, {word: ".", type: "Punctuation"},
                {word: "the", type: "Determiner"}, {word: "engineer", type: "Noun"}, {word: "repaired", type: "Verb"}, {word: "it", type: "Pronoun"}
            ]
        },
        {
            rule: "Conjunction_Pronoun_Verb_Ving_Determiner_Adjective_Noun_Comma_Pronoun_Verb_Preposition_Verb_Punctuation",
            displayRule: 'Dependent Clause First',
            words: [
                {word: "While", type: "Conjunction"}, {word: "she", type: "Pronoun"}, {word: "was", type: "Verb"},
                {word: "watching", type: "Ving"}, {word: "a", type: "Determiner"}, {word: "sad", type: "Adjective"},
                {word: "movie", type: "Noun"}, {word: ",", type: "Comma"}, {word: "she", type: "Pronoun"},
                {word: "started", type: "Verb"}, {word: "to", type: "Preposition"}, {word: "cry", type: "Verb"},
                {word: ".", type: "Punctuation"}, {word: "the", type: "Determiner"}, {word: "actor", type: "Noun"}
            ]
        },
        {
            rule: "Determiner_Noun_Comma_Pronoun_Verb_Verb_Preposition_Noun_Comma_Verb_Determiner_Adjective_Noun_Punctuation",
            displayRule: 'Adjective Clause with Relative Pronoun',
            words: [
                {word: "The", type: "Determiner"}, {word: "house", type: "Noun"}, {word: ",", type: "Comma"},
                {word: "which", type: "Pronoun"}, {word: "was", type: "Verb"}, {word: "built", type: "Verb"},
                {word: "in", type: "Preposition"}, {word: "1950", type: "Noun"}, {word: ",", type: "Comma"},
                {word: "has", type: "Verb"}, {word: "a", type: "Determiner"}, {word: "big", type: "Adjective"},
                {word: "yard", type: "Noun"}, {word: ".", type: "Punctuation"}, {word: "old", type: "Adjective"}
            ]
        },
        {
            rule: "Determiner_Adjective_Comma_Adjective_Noun_Verb_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Multiple Modifiers on a Noun',
            words: [
                {word: "The", type: "Determiner"}, {word: "tall", type: "Adjective"}, {word: ",", type: "Comma"},
                {word: "red", type: "Adjective"}, {word: "building", type: "Noun"}, {word: "stands", type: "Verb"},
                {word: "on", type: "Preposition"}, {word: "a", type: "Determiner"}, {word: "hill", type: "Noun"},
                {word: ".", type: "Punctuation"},
                {word: "a", type: "Determiner"}, {word: "skyscraper", type: "Noun"}, {word: "high", type: "Adjective"}
            ]
        },
        {
            rule: "Determiner_Noun_Verb_Adverb_Verb_Determiner_Noun_Conjunction_Pronoun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Negative Conditional with "unless"',
            words: [
                {word: "The", type: "Determiner"}, {word: "teacher", type: "Noun"}, {word: "will", type: "Verb"},
                {word: "not", type: "Adverb"}, {word: "explain", type: "Verb"}, {word: "the", type: "Determiner"},
                {word: "lesson", type: "Noun"}, {word: "unless", type: "Conjunction"}, {word: "you", type: "Pronoun"},
                {word: "ask", type: "Verb"}, {word: "a", type: "Determiner"}, {word: "question", type: "Noun"},
                {word: ".", type: "Punctuation"}, {word: "in", type: "Preposition"}, {word: "class", type: "Noun"}
            ]
        },
        {
            rule: "Pronoun_Verb_Ving_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Gerund Phrase as Object',
            words: [
                {word: "He", type: "Pronoun"}, {word: "loves", type: "Verb"}, {word: "swimming", type: "Ving"},
                {word: "in", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "ocean", type: "Noun"},
                {word: ".", type: "Punctuation"},
                {word: "a", type: "Determiner"}, {word: "sport", type: "Noun"}, {word: "a", type: "Determiner"}, {word: "vacation", type: "Noun"}
            ]
        },
        {
            rule: "Determiner_Noun_Verb_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Prepositional Phrase of Location',
            words: [
                {word: "The", type: "Determiner"}, {word: "children", type: "Noun"}, {word: "played", type: "Verb"},
                {word: "in", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "backyard", type: "Noun"},
                {word: ".", type: "Punctuation"},
                {word: "the", type: "Determiner"}, {word: "rain", type: "Noun"}, {word: "happily", type: "Adverb"}, {word: "toy", type: "Noun"}
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

const quizData: QuizData = {
    easy: [
        { question: 'In the sentence, "The student solved the problem.", which word is the object?', options: ["The", "student", "solved", "problem"], answer: "problem" },
        { question: 'What is the correct word order for the sentence, "ran, dog, The."?', options: ["Ran dog the.", "The ran dog.", "The dog ran.", "Dog the ran."], answer: "The dog ran." },
        { question: 'What is the minimum requirement for a complete sentence?', options: ["A noun and a verb", "A subject and a verb", "A subject and an object", "A verb and an adjective"], answer: "A subject and a verb" },
        { question: 'In the sentence, "She ate an apple.", what is the object?', options: ["an", "ate", "apple", "She"], answer: "apple" },
        { question: 'A sentence must contain at least a subject and a verb. True or False?', options: ["True", "False"], answer: "True" },
        { question: 'Which of these words is a verb?', options: ["Quickly", "Jumped", "Happy", "Beautiful"], answer: "Jumped" },
        { question: 'Which of these sentences is an example of a Subject-Verb-Object (S-V-O) structure?', options: ["He ran.", "She likes chocolate.", "They are happy.", "The dog barks loudly."], answer: "She likes chocolate." },
        { question: 'What is the function of the word "beautiful" in the sentence "The beautiful flower bloomed."?', options: ["Subject", "Verb", "Adjective", "Adverb"], answer: "Adjective" },
        { question: 'Which of these words is a preposition?', options: ["on", "quickly", "beautiful", "ran"], answer: "on" },
        { question: 'In the sentence, "He gave her a gift.", which part is the verb?', options: ["He", "gave", "her", "a gift"], answer: "gave" }
    ],
    medium: [
        { question: 'In the sentence, "He walked to the store.", what is the part of the sentence in bold?', options: ["A subject", "A gerund", "A prepositional phrase", "A dependent clause"], answer: "A prepositional phrase" },
        { question: 'Which of the following sentences correctly uses a conjunction?', options: ["The sun shone brightly, we stayed indoors.", "The sun shone brightly but we stayed indoors.", "The sun shone brightly, but we stayed indoors.", "The sun shone brightly but, we stayed indoors."], answer: "The sun shone brightly, but we stayed indoors." },
        { question: 'What is the purpose of a conjunction?', options: ["To describe a noun.", "To show action.", "To connect clauses or sentences.", "To replace a subject."], answer: "To connect clauses or sentences." },
        { question: 'In the sentence, "The cat, which was black, slept soundly.", what is the function of the part in bold?', options: ["A subordinate clause", "A relative clause", "A prepositional phrase", "An independent clause"], answer: "A relative clause" },
        { question: 'Which word is the subordinate conjunction in the sentence, "We will go to the park if it stops raining."?', options: ["We", "will", "if", "stops"], answer: "if" },
        { question: 'In the sentence, "I was tired, but I was happy.", what is the part of the sentence in bold?', options: ["An independent clause", "A subordinate clause", "A prepositional phrase", "A dangling modifier"], answer: "An independent clause" },
        { question: 'How would you correctly connect two simple sentences, "He studied hard." and "He passed the test."?', options: ["He studied hard, he passed the test.", "He studied hard and passed the test.", "He studied hard, and he passed the test.", "He studied hard, but he passed the test."], answer: "He studied hard, and he passed the test." },
        { question: 'Which of these sentences contains a prepositional phrase?', options: ["The car is fast.", "She ran quickly.", "The dog is in the box.", "They are happy."], answer: "The dog is in the box." },
        { question: 'What is the difference between an independent clause and a dependent clause?', options: ["An independent clause is longer than a dependent clause.", "An independent clause can stand alone as a sentence.", "A dependent clause can stand alone as a sentence.", "An independent clause contains a conjunction."], answer: "An independent clause can stand alone as a sentence." },
        { question: 'What is a common function of a subordinate clause?', options: ["To act as a subject", "To describe a verb or noun", "To replace an object", "To be the main idea of a sentence"], answer: "To describe a verb or noun" }
    ],
    hard: [
        { question: 'Identify the gerund in the sentence, "She loves running in the morning."', options: ["loves", "running", "morning", "in"], answer: "running" },
        { question: 'What type of clause is "who was wearing a red hat" in the sentence, "The woman, who was wearing a red hat, ran away."?', options: ["An independent clause", "A relative clause", "A conditional clause", "A main clause"], answer: "A relative clause" },
        { question: 'Which sentence contains a dangling modifier?', options: ["Walking to the store, the sky grew dark.", "After we finished the pizza, we watched a movie.", "While running, she tripped.", "He saw the boy with the telescope."], answer: "Walking to the store, the sky grew dark." },
        { question: 'Identify the elliptical construction in the sentence, "John can run faster than Bill."', options: ["John", "run faster", "than Bill", "Bill"], answer: "than Bill" },
        { question: 'Which sentence contains an infinitive?', options: ["She loves cooking.", "We went to the park.", "They want to eat.", "Running is fun."], answer: "They want to eat." },
        { question: 'What is the function of the subordinate clause in the sentence, "I will not go unless you come with me."?', options: ["It is a noun clause.", "It is a prepositional phrase.", "It is an adverbial clause.", "It is a relative clause."], answer: "An adverbial clause." },
        { question: 'Which sentence has a comma splice?', options: ["It was a beautiful day, we went for a walk.", "It was a beautiful day; we went for a walk.", "It was a beautiful day, and we went for a walk.", "It was a beautiful day. We went for a walk."], answer: "It was a beautiful day, we went for a walk." },
        { question: 'Identify the ambiguous phrase in the sentence, "The man saw the boy with the telescope."', options: ["The man", "saw the boy", "with the telescope", "the boy"], answer: "with the telescope" },
        { question: 'What is the difference between a phrase and a clause?', options: ["A phrase contains a subject and a verb.", "A clause does not contain a subject and a verb.", "A clause contains a subject and a verb, while a phrase does not.", "A phrase is a type of clause."], answer: "A clause contains a subject and a verb, while a phrase does not." },
        { question: 'What is the primary purpose of syntax?', options: ["To define the meaning of words.", "To describe the relationship between clauses.", "To determine the grammatical correctness of a sentence.", "To define the correct spelling of words."], answer: "To determine the grammatical correctness of a sentence." }
    ]
};
// --- END OF constants.ts ---


// --- CONSOLIDATED FROM App.tsx ---
// Helper function to shuffle arrays
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Type definition for saved game state
interface SavedGameState {
    proficiency: Proficiency;
    currentQuestionIndex: number;
    score: number;
    timer: number;
}

// Word with a unique ID for drag-and-drop
interface IdentifiedWord extends Word {
    id: string;
}

const App: React.FC = () => {
    // Game State
    const [view, setView] = useState<'menu' | 'game' | 'quiz'>('menu');
    const [modal, setModal] = useState<'mode' | 'single-setup' | 'quiz-setup' | 'multi-setup' | 'multi-proficiency' | 'waiting-room' | 'game-over' | null>('mode');
    const [gameMode, setGameMode] = useState<GameMode>(null);
    const [proficiency, setProficiency] = useState<Proficiency>('easy');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(50);
    const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const [grammar, setGrammar] = useState<any>(null);

    // Card Game State
    const [trayWords, setTrayWords] = useState<IdentifiedWord[]>([]);
    const [poolWords, setPoolWords] = useState<IdentifiedWord[]>([]);
    
    // Typing Game State
    const [typingInput, setTypingInput] = useState('');

    // Quiz Game State
    const [quizProficiency, setQuizProficiency] = useState<Proficiency>('easy');
    const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [shuffledQuizOptions, setShuffledQuizOptions] = useState<string[]>([]);
    const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<{ answer: string; isCorrect: boolean } | null>(null);

    // Multiplayer State
    const [socket, setSocket] = useState<Socket | null>(null);
    const [playerData, setPlayerData] = useState<Player>({ id: '', nickname: '', score: 0 });
    const [groupCode, setGroupCode] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [nickname, setNickname] = useState('');
    const [joinGroupCode, setJoinGroupCode] = useState('');
    const [multiplayerFeedback, setMultiplayerFeedback] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
    const [multiplayerTab, setMultiplayerTab] = useState<'create' | 'join'>('create');

    // UI & Feedback State
    const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState({ title: '', message: '' });

    // Safely initialize grammar after component mounts to prevent race conditions
    useEffect(() => {
        try {
            const grammarScript = document.getElementById('grammar');
            if (grammarScript && typeof (window as any).ohm !== 'undefined' && grammarScript.textContent) {
                setGrammar((window as any).ohm.grammar(grammarScript.textContent));
            } else if (typeof (window as any).ohm === 'undefined') {
                console.error("ohm.js library is not loaded.");
            } else {
                console.error("Grammar script tag not found in the DOM or is empty.");
            }
        } catch (e) {
            console.error("Failed to initialize Ohm grammar:", e);
        }
    }, []);

    // --- Game Flow ---

    const startTimer = useCallback(() => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        timerInterval.current = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
    }, []);

    const resetTimer = useCallback(() => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        setTimer(50);
    }, []);
    
    const loadQuestion = useCallback((index: number, prof: Proficiency) => {
        setFeedback(null);
        setIsAnswerChecked(false);
        const questionData = levels[prof][index];

        if (prof !== 'hard') {
            const q = questionData as CardQuestion;
            const wordsWithIds = q.words.map((word, idx) => ({ ...word, id: `${index}-${idx}` }));
            setTrayWords([]);
            setPoolWords(shuffleArray([...wordsWithIds]));
        }
        setTypingInput('');
        
        resetTimer();
        startTimer();
    }, [resetTimer, startTimer]);
    
    const endGame = useCallback((title: string, message: string) => {
        if(timerInterval.current) clearInterval(timerInterval.current);
        setGameOverMessage({ title, message });
        setModal('game-over');
        if (gameMode === 'single') {
            localStorage.removeItem('syntaxGameState');
        }
    }, [gameMode]);
    
    const loadQuizQuestion = useCallback((index: number) => {
      setFeedback(null);
      setSelectedQuizAnswer(null);
      setIsAnswerChecked(false);
      const question = quizData[quizProficiency][index];
      setShuffledQuizOptions(shuffleArray([...question.options]));
    }, [quizProficiency]);
    
    const nextQuestion = useCallback(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < levels[proficiency].length) {
            setCurrentQuestionIndex(nextIndex);
            loadQuestion(nextIndex, proficiency);
        } else {
            endGame(
                `'${proficiency.charAt(0).toUpperCase() + proficiency.slice(1)}' Level Complete!`, 
                "You've answered all questions for this difficulty."
            );
        }
    }, [currentQuestionIndex, proficiency, loadQuestion, endGame]);

    const nextQuizQuestion = useCallback(() => {
      const nextIndex = currentQuizQuestionIndex + 1;
      if (nextIndex < quizData[quizProficiency].length) {
          setCurrentQuizQuestionIndex(nextIndex);
          loadQuizQuestion(nextIndex);
      } else {
          endGame("Quiz Complete!", "You've finished all the quiz questions.");
      }
    }, [currentQuizQuestionIndex, quizProficiency, loadQuizQuestion, endGame]);
    
    const startGame = useCallback((resumedState: SavedGameState | null = null, profOverride?: Proficiency) => {
        const prof = profOverride || resumedState?.proficiency || proficiency;
        const qIndex = resumedState?.currentQuestionIndex || 0;
        const initialScore = resumedState?.score || 0;

        setModal(null);
        setView('game');
        setProficiency(prof);
        setCurrentQuestionIndex(qIndex);
        setScore(initialScore);

        loadQuestion(qIndex, prof);

        if (resumedState?.timer) {
            setTimer(resumedState.timer > 0 ? resumedState.timer : 50);
        }
        startTimer();
    }, [proficiency, loadQuestion, startTimer]);

    const startQuiz = useCallback(() => {
      setModal(null);
      setView('quiz');
      setCurrentQuizQuestionIndex(0);
      setQuizScore(0);
      loadQuizQuestion(0);
    }, [loadQuizQuestion]);

    // --- Effects ---
    
    // Timer Effect
    useEffect(() => {
        if (timer <= 0 && view !== 'menu' && !isAnswerChecked) {
            if(timerInterval.current) clearInterval(timerInterval.current);
            setFeedback({ message: "Time's up! Moving to the next question.", type: 'incorrect' });
            const timeoutId = setTimeout(() => gameMode === 'quiz' ? nextQuizQuestion() : nextQuestion(), 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [timer, view, isAnswerChecked, gameMode, nextQuestion, nextQuizQuestion]);

    // Cleanup timer on unmount/view change
    useEffect(() => {
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, [view]);

    // Save game state on browser close for single player
    useEffect(() => {
        const saveGameState = () => {
            if (gameMode === 'single' && view === 'game') {
                const stateToSave: SavedGameState = { proficiency, currentQuestionIndex, score, timer };
                localStorage.setItem('syntaxGameState', JSON.stringify(stateToSave));
            }
        };
        window.addEventListener('beforeunload', saveGameState);
        return () => window.removeEventListener('beforeunload', saveGameState);
    }, [gameMode, proficiency, currentQuestionIndex, score, timer, view]);

    // Check for saved game
    useEffect(() => {
      if (modal === 'single-setup') {
        setHasSavedGame(!!localStorage.getItem('syntaxGameState'));
      }
    }, [modal]);

    const resetToMenu = useCallback(() => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        if (socket) socket.disconnect();
        
        setView('menu');
        setModal('mode');
        setGameMode(null);
        setProficiency('easy');
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimer(50);
        setTrayWords([]);
        setPoolWords([]);
        setTypingInput('');
        setQuizProficiency('easy');
        setCurrentQuizQuestionIndex(0);
        setQuizScore(0);
        setSocket(null);
        setPlayerData({ id: '', nickname: '', score: 0 });
        setGroupCode(null);
        setPlayers([]);
        setNickname('');
        setJoinGroupCode('');
        setFeedback(null);
        setIsAnswerChecked(false);
        setConnectionStatus('idle');
        setMultiplayerFeedback('');

        localStorage.removeItem('syntaxGameState');
    }, [socket]);

    const initializeSocket = useCallback(() => {
        if (connectionStatus === 'connecting') return;

        if (socket) {
            socket.disconnect();
        }

        const newSocket = io();
        setSocket(newSocket);
        setConnectionStatus('connecting');
        setMultiplayerFeedback('Connecting to server...');

        newSocket.on('connect', () => {
            setPlayerData(prev => ({ ...prev, id: newSocket.id || '' }));
            setConnectionStatus('connected');
            setMultiplayerFeedback('');
        });

        newSocket.on('connect_error', () => {
            setConnectionStatus('failed');
            setMultiplayerFeedback('Failed to connect to server. Please check your connection.');
            newSocket.disconnect();
            setSocket(null);
        });
        
        newSocket.on('disconnect', () => {
            if (view !== 'menu') {
                setMultiplayerFeedback("You have been disconnected. Returning to the menu.");
                setTimeout(() => resetToMenu(), 3000);
            }
        });

        newSocket.on('groupCreated', ({ groupCode: code, players: playerList }) => {
            setGroupCode(code);
            setPlayers(playerList);
            setModal('multi-proficiency');
        });

        newSocket.on('joinSuccess', ({ groupCode: code }) => {
            setGroupCode(code);
            setModal('waiting-room');
        });

        newSocket.on('joinError', (message) => {
            setMultiplayerFeedback(message);
        });

        newSocket.on('updatePlayers', (playerList) => {
            setPlayers(playerList);
        });

        newSocket.on('gameStarted', ({ proficiency: prof }) => {
            startGame(null, prof);
        });

        return newSocket;
    }, [socket, connectionStatus, startGame, view, resetToMenu]);

    // Effect to initialize socket connection for multiplayer
    useEffect(() => {
        if (modal === 'multi-setup' && connectionStatus === 'idle') {
            initializeSocket();
        }
    }, [modal, connectionStatus, initializeSocket]);

    const checkAnswer = () => {
        let isCorrect = false;
        
        if (proficiency === 'hard') {
            const correctAnswer = (levels[proficiency][currentQuestionIndex] as HardQuestion).answer;
            const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, ' ');
            isCorrect = normalize(typingInput) === normalize(correctAnswer);
        } else {
            if (!grammar) {
                setFeedback({ message: 'Grammar engine is not ready. Please wait.', type: 'incorrect' });
                setTimeout(() => setFeedback(null), 2000);
                return;
            }
            if (trayWords.length === 0) {
              setFeedback({ message: 'Please build a sentence first.', type: 'incorrect'});
              setTimeout(() => setFeedback(null), 2000);
              return;
            }
            const sentenceTypes = trayWords.map(w => w.type).join(' ');
            const currentRule = (levels[proficiency][currentQuestionIndex] as CardQuestion).rule;
            const match = grammar.match(sentenceTypes, currentRule);
            isCorrect = match.succeeded();
        }

        if (isCorrect) {
            if(timerInterval.current) clearInterval(timerInterval.current);
            setIsAnswerChecked(true);

            const points = 100 + Math.max(0, timer * 2);
            setFeedback({ message: `Correct! +${points} points`, type: 'correct' });
            
            if (gameMode === 'single') {
                const newScore = score + points;
                setScore(newScore);
            } else if (gameMode === 'multi' && socket) {
                socket.emit('correctAnswer', { groupCode, timeRemaining: timer });
            }
            
            setTimeout(nextQuestion, 1500);
        } else {
            setFeedback({ message: "That's not quite right. Try again!", type: 'incorrect' });
            setTimeout(() => setFeedback(null), 2000);
        }
    };
    
    const checkQuizAnswer = (selectedAnswer: string) => {
      setIsAnswerChecked(true);
      const correctAnswer = quizData[quizProficiency][currentQuizQuestionIndex].answer;
      const isCorrect = selectedAnswer === correctAnswer;

      if(isCorrect) {
        setQuizScore(prev => prev + 100);
        setFeedback({ message: 'Correct!', type: 'correct' });
      } else {
        setFeedback({ message: `Incorrect. The correct answer is "${correctAnswer}".`, type: 'incorrect' });
      }
      setSelectedQuizAnswer({ answer: selectedAnswer, isCorrect });
    };

    const resumeGame = () => {
        const savedStateJSON = localStorage.getItem('syntaxGameState');
        if (savedStateJSON) {
            const savedState: SavedGameState = JSON.parse(savedStateJSON);
            startGame(savedState);
        }
    };

    // --- Multiplayer ---
    
    const handleCreateGroup = () => {
      if(nickname && socket) {
        const pData = { ...playerData, nickname };
        setPlayerData(pData);
        socket.emit('createGroup', pData);
      }
    };

    const handleJoinGroup = () => {
      if(nickname && joinGroupCode && socket) {
        const pData = { ...playerData, nickname };
        setPlayerData(pData);
        socket.emit('joinGroup', { playerData: pData, groupCode: joinGroupCode });
      }
    };
    
    const handleSetMultiplayerProficiency = (prof: Proficiency) => {
      setProficiency(prof);
      socket?.emit('setProficiency', { groupCode, proficiency: prof });
      setModal('waiting-room');
    };
    
    const handleStartGameRequest = () => {
      socket?.emit('startGameRequest', { groupCode, proficiency });
    }

    // --- Drag and Drop Handlers ---
    const draggedTile = useRef<IdentifiedWord | null>(null);
    const draggedFrom = useRef<'pool' | 'tray' | null>(null);

    const onDragStart = (word: IdentifiedWord, from: 'pool' | 'tray') => {
        draggedTile.current = word;
        draggedFrom.current = from;
    };

    const onDrop = (target: 'pool' | 'tray') => {
        if (!draggedTile.current || !draggedFrom.current) return;
        
        const droppedWord = draggedTile.current;
        const source = draggedFrom.current;

        draggedTile.current = null;
        draggedFrom.current = null;

        if (source === target) {
            if (source === 'pool') {
                setPoolWords(prev => [ ...prev.filter(w => w.id !== droppedWord.id), droppedWord ]);
            } else {
                setTrayWords(prev => [ ...prev.filter(w => w.id !== droppedWord.id), droppedWord ]);
            }
        } else {
            if (source === 'pool') {
                setPoolWords(prev => prev.filter(w => w.id !== droppedWord.id));
                setTrayWords(prev => [...prev, droppedWord]);
            } else {
                setTrayWords(prev => prev.filter(w => w.id !== droppedWord.id));
                setPoolWords(prev => [...prev, droppedWord]);
            }
        }
    };

    const handleWordClick = (wordToMove: IdentifiedWord, from: 'pool' | 'tray') => {
        if (from === 'pool') {
            setPoolWords(prev => prev.filter(word => word.id !== wordToMove.id));
            setTrayWords(prev => [...prev, wordToMove]);
        } else {
            setTrayWords(prev => prev.filter(word => word.id !== wordToMove.id));
            setPoolWords(prev => [...prev, wordToMove]);
        }
    };

    // --- Render Logic ---
    
    const renderModal = () => {
        if (!modal) return null;

        const baseModal = (title: string, children: React.ReactNode) => (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{title}</h2>
                    {children}
                </div>
            </div>
        );

        switch (modal) {
            case 'mode':
                return baseModal('Welcome to The Syntax Card Game!', <>
                    <h3>Choose Your Mode</h3>
                    <div className="button-group">
                        <button onClick={() => { setGameMode('single'); setModal('single-setup'); }}>Single Player</button>
                        <button onClick={() => { setGameMode('multi'); setModal('multi-setup'); }}>Multiplayer</button>
                        <button onClick={() => { setGameMode('quiz'); setModal('quiz-setup'); }}>Syntax Quiz</button>
                    </div>
                </>);
            case 'single-setup':
                return baseModal('Player Setup', <>
                    <h3>Select Your Proficiency</h3>
                    <div className="button-group">
                        {(['easy', 'medium', 'hard'] as Proficiency[]).map(level => 
                            <button key={level} onClick={() => startGame(null, level)}>{level.charAt(0).toUpperCase() + level.slice(1)}</button>
                        )}
                    </div>
                    {hasSavedGame && <div style={{ marginTop: 20 }}><p>Or</p><button onClick={resumeGame} className="secondary">Resume Previous Game</button></div>}
                    <div className="button-group" style={{ marginTop: '1rem' }}><button onClick={() => setModal('mode')} className="secondary">Back</button></div>
                </>);
            case 'quiz-setup':
                return baseModal('Syntax Quiz Setup', <>
                  <h3>Select Your Difficulty</h3>
                  <div className="button-group">
                      {(['easy', 'medium', 'hard'] as Proficiency[]).map(level => 
                          <button key={level} onClick={() => { setQuizProficiency(level); startQuiz(); }}>{level.charAt(0).toUpperCase() + level.slice(1)}</button>
                      )}
                  </div>
                  <div className="button-group" style={{ marginTop: '1rem' }}><button onClick={() => setModal('mode')} className="secondary">Back</button></div>
              </>);
            case 'multi-setup':
                const isNicknameValid = nickname.trim().length > 0;
                return baseModal('Multiplayer Setup', <>
                    <div className="segmented-control">
                        <button className={multiplayerTab === 'create' ? 'active' : ''} onClick={() => setMultiplayerTab('create')}>Create Group</button>
                        <button className={multiplayerTab === 'join' ? 'active' : ''} onClick={() => setMultiplayerTab('join')}>Join Group</button>
                    </div>
                    <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Enter your nickname (max 15 chars)" maxLength={15} />
                    {multiplayerTab === 'join' && <input type="text" value={joinGroupCode} onChange={e => setJoinGroupCode(e.target.value)} placeholder="Enter 3-digit group code" maxLength={3} />}
                    <div id="multiplayer-feedback">{multiplayerFeedback}</div>
                    <div className="button-group">
                        {connectionStatus === 'failed' ? (
                            <button onClick={initializeSocket}>Retry Connection</button>
                        ) : (
                            <>
                                {multiplayerTab === 'create' && <button onClick={handleCreateGroup} disabled={!isNicknameValid || connectionStatus !== 'connected'}>Create Group</button>}
                                {multiplayerTab === 'join' && <button onClick={handleJoinGroup} disabled={!isNicknameValid || joinGroupCode.length !== 3 || connectionStatus !== 'connected'}>Join Group</button>}
                            </>
                        )}
                        <button onClick={resetToMenu} className="secondary">Back</button>
                    </div>
                </>);
            case 'multi-proficiency':
              return baseModal('Choose Game Difficulty', <>
                <h3 style={{ color: 'var(--text-dark)', fontSize: '1rem', marginBottom: '2rem' }}>The host selects the proficiency for all players.</h3>
                <div className="button-group">
                    {(['easy', 'medium', 'hard'] as Proficiency[]).map(level =>
                        <button key={level} onClick={() => handleSetMultiplayerProficiency(level)}>{level.charAt(0).toUpperCase() + level.slice(1)}</button>
                    )}
                </div>
                <div className="button-group" style={{ marginTop: '1rem' }}><button onClick={resetToMenu} className="secondary">Back</button></div>
              </>);
            case 'waiting-room':
              const isHost = players.length > 0 && players[0].id === playerData.id;
              return baseModal('Waiting Room', <>
                <p>Share this code with your friends!</p>
                <div id="group-code-display">Group Code: <strong>{groupCode}</strong></div>
                <h3>Players Joined:</h3>
                <ul id="waiting-room-player-list">
                    {players.map(p => <li key={p.id}>{p.nickname}{p.id === playerData.id ? ' (You)' : ''}</li>)}
                </ul>
                <div className="button-group">
                    {isHost && <button onClick={handleStartGameRequest}>Start Game</button>}
                    <button onClick={resetToMenu} className="secondary">Back</button>
                </div>
              </>);
            case 'game-over':
                return baseModal(gameOverMessage.title, <>
                    <p>{gameOverMessage.message}</p>
                    <h3>Final Score: <span id="final-score">{gameMode === 'quiz' ? quizScore : score}</span></h3>
                    <div className="button-group"><button onClick={resetToMenu}>Back to Menu</button></div>
                </>);
            default: return null;
        }
    };
    
    const renderGameView = () => {
        const totalQuestions = levels[proficiency].length;
        const currentQuestion = levels[proficiency][currentQuestionIndex];

        return (<>
            <header>
                <button onClick={resetToMenu} className="menu-btn btn btn-secondary">Menu</button>
                <h1>The Syntax Card Game</h1>
                <p>{proficiency === 'hard' ? 'Type the sentence based on the prompt below.' : 'Arrange the words to match the target sentence structure.'}</p>
                <div id="timer">Time: {timer}</div>
            </header>
            <main>
                <div className="progress-tracker">
                    <div>Proficiency: {proficiency.charAt(0).toUpperCase() + proficiency.slice(1)}</div>
                    <div>Question: {currentQuestionIndex + 1}/{totalQuestions}</div>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                </div>

                {proficiency === 'hard' ? (
                    <div id="typing-challenge-container">
                        <div id="typing-prompt-area">
                            <h3>Prompt:</h3>
                            <p>{(currentQuestion as HardQuestion).prompt}</p>
                        </div>
                        <div id="typing-word-set-area">
                            <h4>Word Set (Hint):</h4>
                            <p>{(currentQuestion as HardQuestion).wordSet.join(', ')}</p>
                        </div>
                        <textarea id="typing-input" rows={3} value={typingInput} onChange={e => setTypingInput(e.target.value)} placeholder="Type your sentence here..."></textarea>
                    </div>
                ) : (
                    <>
                        <div id="challenge-display">
                            <h2>TARGET: <span>{(currentQuestion as CardQuestion).displayRule}</span></h2>
                        </div>
                        <div className="sentence-tray droppable" onDragOver={e => e.preventDefault()} onDrop={() => onDrop('tray')}>
                            {trayWords.map(word => <div key={word.id} className="word-tile" draggable onDragStart={() => onDragStart(word, 'tray')} onClick={() => handleWordClick(word, 'tray')}>{word.word}</div>)}
                        </div>
                        <div className="word-pool droppable" onDragOver={e => e.preventDefault()} onDrop={() => onDrop('pool')}>
                            {poolWords.map(word => <div key={word.id} className="word-tile" draggable onDragStart={() => onDragStart(word, 'pool')} onClick={() => handleWordClick(word, 'pool')}>{word.word}</div>)}
                        </div>
                    </>
                )}

                <div className={`feedback-area ${feedback ? `feedback-${feedback.type}` : ''}`}>{feedback?.message}</div>
                <div id="action-buttons">
                    <button onClick={() => loadQuestion(currentQuestionIndex, proficiency)} className="btn btn-secondary">Reset</button>
                    <button 
                        onClick={checkAnswer} 
                        className="btn btn-primary" 
                        disabled={isAnswerChecked || (proficiency !== 'hard' && !grammar)}
                    >
                        Check Answer
                    </button>
                </div>

                {gameMode === 'multi' && (
                    <div id="multiplayer-scoreboard">
                        <h3>Scoreboard</h3>
                        <ul id="player-scores">
                            {players.map(p => (
                                <li key={p.id}>
                                    <span className="player-name">{p.nickname}{p.id === playerData.id ? ' (You)' : ''}</span>
                                    <span className="player-score">{p.score}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </>);
    };

    const renderQuizView = () => {
      const totalQuestions = quizData[quizProficiency].length;
      const currentQuestion = quizData[quizProficiency][currentQuizQuestionIndex];

      const getButtonClass = (option: string) => {
        if (!selectedQuizAnswer) return 'quiz-option-btn';
        if (option === currentQuestion.answer) return 'quiz-option-btn correct';
        if (option === selectedQuizAnswer.answer && !selectedQuizAnswer.isCorrect) return 'quiz-option-btn incorrect';
        return 'quiz-option-btn';
      };

      return (<>
          <header>
              <button onClick={resetToMenu} className="menu-btn btn btn-secondary">Menu</button>
              <h1>Syntax Quiz</h1>
              <p>Test your grammar knowledge.</p>
          </header>
          <main>
              <div className="progress-tracker">
                  <div>Difficulty: {quizProficiency.charAt(0).toUpperCase() + quizProficiency.slice(1)}</div>
                  <div>Question: {currentQuizQuestionIndex + 1}/{totalQuestions}</div>
              </div>
              <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${((currentQuizQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
              </div>
              <div id="quiz-question-area">
                  <h2 id="quiz-question-text">{currentQuestion.question}</h2>
              </div>
              <div id="quiz-options-area">
                {shuffledQuizOptions.map(option => (
                  <button 
                    key={option} 
                    className={getButtonClass(option)}
                    onClick={() => checkQuizAnswer(option)}
                    disabled={isAnswerChecked}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div id="quiz-feedback-area" style={{ color: feedback?.type === 'correct' ? 'var(--success)' : 'var(--error)'}}>{feedback?.message}</div>
              <div id="quiz-action-buttons">
                  {isAnswerChecked && <button onClick={nextQuizQuestion} className="btn btn-primary">Next Question</button>}
              </div>
          </main>
      </>);
    };

    return (
        <>
            {renderModal()}
            {(view === 'game' || view === 'quiz') && (
                <div id="game-container">
                    {view === 'game' && renderGameView()}
                    {view === 'quiz' && renderQuizView()}
                </div>
            )}
        </>
    );
};
// --- END OF App.tsx ---


// --- RENDER CALL ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
    console.error('Failed to find the root element');
}