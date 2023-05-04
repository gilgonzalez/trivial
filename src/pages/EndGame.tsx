import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Stack, Table, TableHead, Typography } from "@mui/material";
import { useState } from "react";
import SaveScoreModal from "../component/SaveScoreModal";
import { getScores } from "../queries/getScores";
import { useQuestionStore } from "../store/questions";

const EndGame = () => {
	const [openModalSaveScore, setOpenModalSaveScore] = useState(false);
	const [saved, setSaved] = useState(false);
	const resetGame = useQuestionStore((state) => state.resetGame);
	const questions = useQuestionStore((state) => state.questions);
	const correctQuestions = questions.reduce((acc, curr) => {
		if (curr.isCorrectUserAnswer) acc++;
		return acc;
	}, 0);
	const incorrect = questions.length - correctQuestions;
	const percentage = Math.round((correctQuestions / questions.length) * 100);
	const { scoresData } = getScores();
	const scoresSorted = scoresData?.sort((a, b) => {
		return b.percentage - a.percentage;
	});
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
						<td>{incorrect}</td>
						<td>{percentage} %</td>
					</tbody>
				</Table>
			</Stack>
			<Stack marginTop={"32px"} marginBottom={"16px"} gap={4}>
				{openModalSaveScore && (
					<SaveScoreModal
						open={openModalSaveScore}
						handleClose={setOpenModalSaveScore}
						correct={correctQuestions}
						incorrect={incorrect}
						percentage={percentage}
						saved={saved}
						setSaved={setSaved}
					/>
				)}
				<Stack
					gap={4}
					direction={"row"}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<Button
						onClick={resetGame}
						variant="contained"
						color="success"
						startIcon={<RestartAltIcon sx={{ color: "white" }} />}
					>
						Reiniciar juego
					</Button>
					<Button
						onClick={() => setOpenModalSaveScore(true)}
						variant="contained"
						color="success"
						startIcon={<SaveIcon sx={{ color: "white" }} />}
					>
						Guardar mi puntuación
					</Button>
				</Stack>
				<Typography component={"h4"} variant={"h5"}>
					RESULTADOS DE OTROS FANS
				</Typography>
				<Table>
					<TableHead>
						<th>Nombre de hechicero</th>
						<th>Aciertos</th>
						<th>Errores</th>
						<th>% de acierto</th>
					</TableHead>
					<tbody>
						{!!scoresSorted &&
							scoresSorted?.map((score) => (
								<tr key={score.name}>
									<td>{score.name}</td>
									<td>{score.correct}</td>
									<td>{score.incorrect}</td>
									<td>{score.percentage} %</td>
								</tr>
							))}
					</tbody>
				</Table>
			</Stack>
		</>
	);
};

export default EndGame;
