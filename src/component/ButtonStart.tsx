import { Button } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { getQuestions } from "../queries/getQuestions";
import { useQuestionStore } from "../store/questions";
import { Question } from "../store/types";

const ButtonStart = () => {
	const loadQuestions = useQuestionStore((state) => state.loadQuestions);
	const { data } = getQuestions();
	const questions = data?.map((question: DocumentData) => ({
		id: question.id,
		question: question.question,
		answers: question.answers,
		correctAnswer: question.correctAnswer,
		urlImage: question?.urlImage,
	}));
	const handleClick = () => loadQuestions(questions || ({} as Question[]));
	return (
		<Button onClick={handleClick} variant="contained" color="info" size="small">
			A jugar!
		</Button>
	);
};

export default ButtonStart;
