import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import { Button, Stack, Typography } from "@mui/material";
import { useQuestionStore } from "../store/questions";

const Footer = () => {
	const questions = useQuestionStore((state) => state.questions);
	const resetGame = useQuestionStore((state) => state.resetGame);

	let correct = 0;
	let incorrect = 0;
	let unanswered = 0;

	questions.forEach((question) => {
		const { selectedAnswer, isCorrectUserAnswer } = question;

		if (selectedAnswer === undefined) unanswered++;
		else if (isCorrectUserAnswer) correct++;
		else incorrect++;
	});

	return (
		<footer>
			<Stack direction="row" spacing={1}>
				<DoneRoundedIcon sx={{ color: "green" }} />
				<Typography>{correct}</Typography>
				<ClearRoundedIcon sx={{ color: "tomato" }} />
				<Typography>{incorrect}</Typography>
				<QuestionMarkRoundedIcon sx={{ color: "yellow" }} />
				<Typography>{unanswered}</Typography>
			</Stack>
			<Button onClick={resetGame}> Resetear Juego</Button>
		</footer>
	);
};

export default Footer;
