import confetti from "canvas-confetti";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Question } from "../store/types";

interface State {
	questions: Question[];
	currentQuestion: number;
	unAnswered: number;
	loadQuestions: (questions: Question[]) => void;
	selectAnswer: (questionId: string, answerIndex: number) => void;
	goNextQuestion: () => void;
	goPrevQuestion: () => void;
	resetGame: () => void;
}

export const useQuestionStore = create<State>()(
	persist(
		(set, get) => {
			return {
				questions: [],
				currentQuestion: 0,
				unAnswered: 0,

				loadQuestions: (questions: Question[]) => {
					const unSortedQuestions = questions
						.sort(() => Math.random() - 0.5)
						.slice(0, 10);
					set({ questions: unSortedQuestions, unAnswered: questions.length });
				},
				selectAnswer(questionId: string, answerIndex: number) {
					const { questions } = get();
					//usando structuredClone
					const newQuestions = structuredClone(questions);

					//buscando el id de la pregunta
					const questionIndex = newQuestions.findIndex(
						(q) => q.id === questionId,
					);
					const questionInfo = newQuestions[questionIndex];
					const isCorrectAnswer = questionInfo.correctAnswer === answerIndex;

					//Confetti
					if (isCorrectAnswer) confetti();

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
					set({ currentQuestion: 0, questions: [] });
				},
			};
		},
		{
			name: "questions",
		},
	),
);
