import confetti from "canvas-confetti";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LIMIT_QUESTIONS } from "../App";
import { type Question } from "../store/types";

interface State {
	questions: Question[];
	currentQuestion: number;
	unAnswered: number;
	completed: boolean;
	clickNext: boolean;
	loadQuestions: (questions: Question[]) => void;
	selectAnswer: (questionId: string, answerIndex: number) => void;
	goNextQuestion: () => void;
	goPrevQuestion: () => void;
	setCompleted: () => void;
	setClickNext: (clicked: boolean) => void;
	resetGame: () => void;
}
const count = 200;
const defaults = {
	origin: { y: 0.7 },
	ticks: 100,
};
function fire(particleRatio: number, opts: {}) {
	confetti(
		Object.assign({}, defaults, opts, {
			particleCount: Math.floor(count * particleRatio),
		}),
	);
}

export const useQuestionStore = create<State>()(
	persist(
		(set, get) => {
			return {
				questions: [],
				currentQuestion: 0,
				unAnswered: 0,
				completed: false,
				clickNext: false,

				loadQuestions: (questions: Question[]) => {
					const unSortedQuestions = questions
						.sort(() => Math.random() - 0.5)
						.slice(0, LIMIT_QUESTIONS);
					set({
						questions: unSortedQuestions,
						unAnswered: unSortedQuestions.length,
					});
				},
				setCompleted: () => {
					set({ completed: true });
				},
				setClickNext: (clicked: boolean) => {
					set({ clickNext: clicked });
				},

				selectAnswer(questionId: string, answerIndex: number) {
					const { questions } = get();
					//usando structuredClone
					const newQuestions = structuredClone(questions);

					//buscando el id de la pregunta
					const questionIndex = newQuestions.findIndex(
						(q: Question) => q.id === questionId,
					);
					const questionInfo = newQuestions[questionIndex];
					const isCorrectAnswer = questionInfo.correctAnswer === answerIndex;

					//Confetti
					if (isCorrectAnswer) {
						fire(0.25, {
							spread: 26,
							startVelocity: 55,
						});
						fire(0.2, {
							spread: 60,
						});
						fire(0.35, {
							spread: 100,
							decay: 0.91,
							scalar: 0.8,
						});
						fire(0.1, {
							spread: 120,
							startVelocity: 25,
							decay: 0.92,
							scalar: 1.2,
						});
						fire(0.1, {
							spread: 120,
							startVelocity: 45,
						});
					}

					//Actualizar el estado
					newQuestions[questionIndex] = {
						...questionInfo,
						selectedAnswer: answerIndex,
						isCorrectUserAnswer: isCorrectAnswer,
					};
					set({ questions: newQuestions, unAnswered: get().unAnswered - 1 });
				},
				goNextQuestion: () => {
					const { currentQuestion, questions } = get();
					const nexQuestion = currentQuestion + 1;

					if (nexQuestion < questions.length) {
						set({ currentQuestion: nexQuestion });
					}
				},
				goPrevQuestion: () => {
					const { currentQuestion } = get();
					const prevQuestion = currentQuestion - 1;
					if (prevQuestion >= 0) {
						set({ currentQuestion: prevQuestion });
					}
				},
				resetGame: () => {
					set({
						currentQuestion: 0,
						questions: [],
						completed: false,
						unAnswered: 0,
					});
				},
			};
		},
		{
			name: "questions",
		},
	),
);
