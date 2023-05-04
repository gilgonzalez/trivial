import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button, Stack, Table, TableHead, Typography } from "@mui/material";
import { useQuestionStore } from "../store/questions";

const EndGame = () => {
	const resetGame = useQuestionStore((state) => state.resetGame);
	const questions = useQuestionStore((state) => state.questions);
	const correctQuestions = questions.reduce((acc, curr) => {
		if (curr.isCorrectUserAnswer) acc++;
		return acc;
	}, 0);
	const errors = questions.length - correctQuestions;
	const percentage = Math.round((correctQuestions / questions.length) * 100);
	return (
		<>
			<Stack marginTop={"16px"} marginBottom={"16px"} gap={4}>
				<Typography component={"h4"} variant={"h5"}>
					RESULTADOS
				</Typography>
				<Table>
					<TableHead>
						<th>Aciertos</th>
						<th>Errores</th>
						<th>% de acierto</th>
					</TableHead>
					<tbody>
						<td>{correctQuestions}</td>
						<td>{errors}</td>
						<td>{percentage} %</td>
					</tbody>
				</Table>
			</Stack>
			<Button
				onClick={resetGame}
				variant="contained"
				color="success"
				endIcon={<RestartAltIcon sx={{ color: "white" }} />}
			>
				Reiniciar juego
			</Button>
		</>
	);
};

export default EndGame;
