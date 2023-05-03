import {
	Card,
	CardContent,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import { useQuestionStore } from "../store/questions";
import { Question } from "../store/types";

const getBackGroundColor = (info: Question, index: number) => {
	const { correctAnswer, selectedAnswer } = info;

	//Usuario no ha seleccionado respuesta
	if (selectedAnswer === undefined) return "transparent";
	if (index !== correctAnswer && index !== selectedAnswer) return "transparent";
	if (index === correctAnswer) return "green";
	if (index === selectedAnswer) return "red";
	return "transparent";
};

const AskElement = ({ info }: { info: Question }) => {
	const selectAnswer = useQuestionStore((state) => state.selectAnswer);

	const createHandleClick = (answerIndex: number) => () => {
		selectAnswer(info.id, answerIndex);
	};

	return (
		<Card
			variant="elevation"
			elevation={2}
			sx={{ width: "90%" }}
			className="card"
			style={{ padding: "0px" }}
		>
			<CardContent>
				<Stack gap={2} alignItems={"center"} justifyContent={"center"}>
					<Typography variant="h6" component="h6">
						{info.question}
					</Typography>
					{info.urlImage && (
						<img
							style={{ borderRadius: "10px", width: "70%" }}
							src={info.urlImage}
							alt=""
						/>
					)}
					<List disablePadding sx={{ width: "100%" }}>
						{info.answers.map((answer, index) => (
							<ListItem
								// rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								disablePadding
								sx={{
									bgcolor: "#444",
									border: "2px solid #fff",
									borderRadius: "10px",
									marginBottom: "5px",
								}}
							>
								<ListItemButton
									sx={{ bgcolor: getBackGroundColor(info, index) }}
									onClick={createHandleClick(index)}
									disabled={info.selectedAnswer !== undefined}
								>
									<ListItemText
										sx={{
											fontSize: "16px",
											textAlign: "center",
											color: "#fff",
										}}
										primary={answer}
										disableTypography
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default AskElement;
