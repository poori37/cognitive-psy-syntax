export interface Word {
    word: string;
    type: string;
}

export interface CardQuestion {
    rule: string;
    displayRule: string;
    words: Word[];
}

export interface HardQuestion {
    prompt: string;
    wordSet: string[];
    answer: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

export type Proficiency = 'easy' | 'medium' | 'hard';
export type GameMode = 'single' | 'multi' | 'quiz' | null;

export interface Player {
    id: string;
    nickname: string;
    score: number;
}
