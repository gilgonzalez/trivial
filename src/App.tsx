import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import AskGame from "./component/AskGame";
import ButtonStart from "./component/ButtonStart";
import EndGame from "./pages/EndGame";
import QuestionForm from "./pages/QuestionForm";
import { useQuestionStore } from "./store/questions";
function App() {
	const questions = useQuestionStore((state) => state.questions);
	const unAnswered = useQuestionStore((state) => state.unAnswered);
	const [openQuestionForm, setOpenQuestionForm] = useState<boolean>(false);
	console.log(questions);

	return (
		<main>
			<Container maxWidth={"sm"}>
				<Toaster />
				<Stack gap={2} alignItems={"center"}>
					<Stack
						direction={"row"}
						spacing={2}
						justifyContent={"center"}
						alignItems={"center"}
						gap={2}
						margin={0}
						width={"100%"}
					>
						<img
							src="https://examberrypapers.co.uk/wp-content/uploads/2021/11/harry-potter.svg"
							alt="logo"
							height={100}
							width={100}
						/>
						<Typography variant='h3' component='h1'>
							<span>T</span>rivial{" "}
							<span className="title-harry">Harry Potter</span> con{" "}
							<span>Z</span>ustand
						</Typography>
					</Stack>
					{questions.length === 0 && <ButtonStart />}
					{questions.length === 0 && (
						<Button
							onClick={() => setOpenQuestionForm(true)}
							sx={{ fontSize: "10px" }}
							color="info"
							startIcon={
								<HistoryEduIcon fontSize="large" sx={{ color: "white" }} />
							}
							size="medium"
							variant="contained"
						>
							Aportar pregunta
						</Button>
					)}
					{questions.length > 0 && unAnswered > 0 && <AskGame />}
				</Stack>
				{questions.length > 0 && unAnswered === 0 && <EndGame />}
				<QuestionForm
					open={openQuestionForm}
					handleClose={setOpenQuestionForm}
				/>
			</Container>
		</main>
	);
}

export default App;
