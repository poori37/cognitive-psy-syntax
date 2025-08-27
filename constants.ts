import { CardQuestion, HardQuestion, Proficiency, QuizQuestion } from './types';

type Levels = {
    [key in Proficiency]: (CardQuestion | HardQuestion)[];
};

type QuizData = {
    [key in Proficiency]: QuizQuestion[];
};

export const levels: Levels = {
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
        // Prompt 1: Single subject, two actions
        {
            rule: "Determiner_Noun_Verb_Determiner_Noun_Conjunction_Verb_Adverb_Punctuation",
            displayRule: 'Single Subject, Two Actions',
            words: [
                {word: "The", type: "Determiner"}, {word: "dog", type: "Noun"}, {word: "chased", type: "Verb"},
                {word: "the", type: "Determiner"}, {word: "ball", type: "Noun"}, {word: "and", type: "Conjunction"},
                {word: "barked", type: "Verb"}, {word: "loudly", type: "Adverb"}, {word: ".", type: "Punctuation"},
                {word: "on", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "lawn", type: "Noun"} // Distractors
            ]
        },
        // Prompt 2: Prepositional phrase of purpose
        {
            rule: "Pronoun_Verb_Preposition_Determiner_Noun_Preposition_Determiner_Noun_Preposition_Noun_Punctuation",
            displayRule: 'Prepositional Phrase of Purpose',
            words: [
                {word: "She", type: "Pronoun"}, {word: "went", type: "Verb"}, {word: "to", type: "Preposition"},
                {word: "the", type: "Determiner"}, {word: "store", type: "Noun"}, {word: "for", type: "Preposition"},
                {word: "a", type: "Determiner"}, {word: "loaf", type: "Noun"}, {word: "of", type: "Preposition"},
                {word: "bread", type: "Noun"}, {word: ".", type: "Punctuation"},
                {word: "her", type: "Possessive"}, {word: "friend", type: "Noun"}, {word: "ran", type: "Verb"} // Distractors
            ]
        },
        // Prompt 3: Compound sentence
        {
            rule: "Pronoun_Verb_Determiner_Noun_Comma_Conjunction_Pronoun_Verb_Adjective_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Compound Sentence with Conjunction',
            words: [
                {word: "He", type: "Pronoun"}, {word: "studied", type: "Verb"}, {word: "all", type: "Determiner"},
                {word: "night", type: "Noun"}, {word: ",", type: "Comma"}, {word: "so", type: "Conjunction"},
                {word: "he", type: "Pronoun"}, {word: "was", type: "Verb"}, {word: "tired", type: "Adjective"},
                {word: "in", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "morning", type: "Noun"},
                {word: ".", type: "Punctuation"}, {word: "happy", type: "Adjective"} // Distractor
            ]
        },
        // Prompt 4: Adverbial clause of reason
        {
            rule: "Determiner_Noun_Verb_Conjunction_Determiner_Noun_Verb_Adjective_Punctuation",
            displayRule: 'Adverbial Clause of Reason',
            words: [
                {word: "The", type: "Determiner"}, {word: "machine", type: "Noun"}, {word: "broke", type: "Verb"},
                {word: "because", type: "Conjunction"}, {word: "the", type: "Determiner"}, {word: "part", type: "Noun"},
                {word: "was", type: "Verb"}, {word: "old", type: "Adjective"}, {word: ".", type: "Punctuation"},
                {word: "the", type: "Determiner"}, {word: "engineer", type: "Noun"}, {word: "repaired", type: "Verb"}, {word: "it", type: "Pronoun"} // Distractors
            ]
        },
        // Prompt 5: Dependent clause first
        {
            rule: "Conjunction_Pronoun_Verb_Ving_Determiner_Adjective_Noun_Comma_Pronoun_Verb_Preposition_Verb_Punctuation",
            displayRule: 'Dependent Clause First',
            words: [
                {word: "While", type: "Conjunction"}, {word: "she", type: "Pronoun"}, {word: "was", type: "Verb"},
                {word: "watching", type: "Ving"}, {word: "a", type: "Determiner"}, {word: "sad", type: "Adjective"},
                {word: "movie", type: "Noun"}, {word: ",", type: "Comma"}, {word: "she", type: "Pronoun"},
                {word: "started", type: "Verb"}, {word: "to", type: "Preposition"}, {word: "cry", type: "Verb"},
                {word: ".", type: "Punctuation"}, {word: "the", type: "Determiner"}, {word: "actor", type: "Noun"} // Distractors
            ]
        },
        // Prompt 6: Adjective clause
        {
            rule: "Determiner_Noun_Comma_Pronoun_Verb_Verb_Preposition_Noun_Comma_Verb_Determiner_Adjective_Noun_Punctuation",
            displayRule: 'Adjective Clause with Relative Pronoun',
            words: [
                {word: "The", type: "Determiner"}, {word: "house", type: "Noun"}, {word: ",", type: "Comma"},
                {word: "which", type: "Pronoun"}, {word: "was", type: "Verb"}, {word: "built", type: "Verb"},
                {word: "in", type: "Preposition"}, {word: "1950", type: "Noun"}, {word: ",", type: "Comma"},
                {word: "has", type: "Verb"}, {word: "a", type: "Determiner"}, {word: "big", type: "Adjective"},
                {word: "yard", type: "Noun"}, {word: ".", type: "Punctuation"}, {word: "old", type: "Adjective"} // Distractor
            ]
        },
        // Prompt 7: Multiple modifiers
        {
            rule: "Determiner_Adjective_Comma_Adjective_Noun_Verb_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Multiple Modifiers on a Noun',
            words: [
                {word: "The", type: "Determiner"}, {word: "tall", type: "Adjective"}, {word: ",", type: "Comma"},
                {word: "red", type: "Adjective"}, {word: "building", type: "Noun"}, {word: "stands", type: "Verb"},
                {word: "on", type: "Preposition"}, {word: "a", type: "Determiner"}, {word: "hill", type: "Noun"},
                {word: ".", type: "Punctuation"},
                {word: "a", type: "Determiner"}, {word: "skyscraper", type: "Noun"}, {word: "high", type: "Adjective"} // Distractors
            ]
        },
        // Prompt 8: Negative conditional
        {
            rule: "Determiner_Noun_Verb_Adverb_Verb_Determiner_Noun_Conjunction_Pronoun_Verb_Determiner_Noun_Punctuation",
            displayRule: 'Negative Conditional with "unless"',
            words: [
                {word: "The", type: "Determiner"}, {word: "teacher", type: "Noun"}, {word: "will", type: "Verb"},
                {word: "not", type: "Adverb"}, {word: "explain", type: "Verb"}, {word: "the", type: "Determiner"},
                {word: "lesson", type: "Noun"}, {word: "unless", type: "Conjunction"}, {word: "you", type: "Pronoun"},
                {word: "ask", type: "Verb"}, {word: "a", type: "Determiner"}, {word: "question", type: "Noun"},
                {word: ".", type: "Punctuation"}, {word: "in", type: "Preposition"}, {word: "class", type: "Noun"} // Distractors
            ]
        },
        // Prompt 9: Gerund phrase as object
        {
            rule: "Pronoun_Verb_Ving_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Gerund Phrase as Object',
            words: [
                {word: "He", type: "Pronoun"}, {word: "loves", type: "Verb"}, {word: "swimming", type: "Ving"},
                {word: "in", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "ocean", type: "Noun"},
                {word: ".", type: "Punctuation"},
                {word: "a", type: "Determiner"}, {word: "sport", type: "Noun"}, {word: "a", type: "Determiner"}, {word: "vacation", type: "Noun"} // Distractors
            ]
        },
        // Prompt 10: Prepositional phrase of location
        {
            rule: "Determiner_Noun_Verb_Preposition_Determiner_Noun_Punctuation",
            displayRule: 'Prepositional Phrase of Location',
            words: [
                {word: "The", type: "Determiner"}, {word: "children", type: "Noun"}, {word: "played", type: "Verb"},
                {word: "in", type: "Preposition"}, {word: "the", type: "Determiner"}, {word: "backyard", type: "Noun"},
                {word: ".", type: "Punctuation"},
                {word: "the", type: "Determiner"}, {word: "rain", type: "Noun"}, {word: "happily", type: "Adverb"}, {word: "toy", type: "Noun"} // Distractors
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

export const quizData: QuizData = {
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