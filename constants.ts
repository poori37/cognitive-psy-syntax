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
        { question: 'What is the function of the subordinate clause in the sentence, "I will not go unless you come with me."?', options: ["It is a noun clause.", "It is a prepositional phrase.", "It is an adverbial clause.", "It is a relative clause."], answer: "It is an adverbial clause." },
        { question: 'Which sentence has a comma splice?', options: ["It was a beautiful day, we went for a walk.", "It was a beautiful day; we went for a walk.", "It was a beautiful day, and we went for a walk.", "It was a beautiful day. We went for a walk."], answer: "It was a beautiful day, we went for a walk." },
        { question: 'Identify the ambiguous phrase in the sentence, "The man saw the boy with the telescope."', options: ["The man", "saw the boy", "with the telescope", "the boy"], answer: "with the telescope" },
        { question: 'What is the difference between a phrase and a clause?', options: ["A phrase contains a subject and a verb.", "A clause does not contain a subject and a verb.", "A clause contains a subject and a verb, while a phrase does not.", "A phrase is a type of clause."], answer: "A clause contains a subject and a verb, while a phrase does not." },
        { question: 'What is the primary purpose of syntax?', options: ["To define the meaning of words.", "To describe the relationship between clauses.", "To determine the grammatical correctness of a sentence.", "To define the correct spelling of words."], answer: "To determine the grammatical correctness of a sentence." }
    ]
};