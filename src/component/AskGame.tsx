import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IconButton, Stack, Typography } from "@mui/material";
import { useQuestionStore } from "../store/questions";
import { Question } from "../store/types";
import AskElement from "./AskElement";
import Footer from "./Footer";

const AskGame = () => {
	const questions = useQuestionStore((state) => state.questions);
	const currentQuestion = useQuestionStore((state) => state.currentQuestion);
	const questionInfo: Question = questions[currentQuestion];

	const goNextQuestion = useQuestionStore((state) => state.goNextQuestion);
	const goPreviousQuestion = useQuestionStore((state) => state.goPrevQuestion);
	const clickedNext = useQuestionStore((state) => state.clickNext);
	return (
		<>
			<AskElement info={questionInfo} />
			<Stack
				direction={"row"}
				gap={2}
				alignItems={"center"}
				justifyContent={"center"}
			>
				<IconButton
					onClick={goPreviousQuestion}
					disabled={currentQuestion === 0}
					sx={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
				>
					<ArrowBackIcon sx={{ color: "white" }} />
				</IconButton>
				<Typography>
					{currentQuestion + 1} / {questions.length}
				</Typography>
				<IconButton
					onClick={() => {
						goNextQuestion();
					}}
					disabled={currentQuestion >= questions.length - 1 || clickedNext}
					sx={{ opacity: currentQuestion >= questions.length - 1 ? 0.5 : 1 }}
				>
					<ArrowForwardIcon sx={{ color: "white" }} />
				</IconButton>
			</Stack>
			<Footer />
		</>
	);
};

export default AskGame;
