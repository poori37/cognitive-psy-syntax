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
