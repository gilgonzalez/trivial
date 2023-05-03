export interface Question {
	id: string;
	question: string;
	answers: Array<string>;
	correctAnswer: number;
	isCorrectUserAnswer?: boolean;
	selectedAnswer?: number;
	urlImage?: string;
}
