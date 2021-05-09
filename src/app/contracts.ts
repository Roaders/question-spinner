export type Question = {
    text: string;
    enabled: boolean;
    answered: boolean;
};

export type SavedData = { timeout: number; spinDuration: number; questions: Question[] };
