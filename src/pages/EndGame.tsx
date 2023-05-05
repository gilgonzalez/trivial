import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import {
	Button,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import SaveScoreModal from "../component/SaveScoreModal";
import { getScores } from "../queries/getScores";
import { useQuestionStore } from "../store/questions";

const EndGame = () => {
	const [openModalSaveScore, setOpenModalSaveScore] = useState(false);
	const resetGame = useQuestionStore((state) => state.resetGame);
	const questions = useQuestionStore((state) => state.questions);
	const completed = useQuestionStore((state) => state.completed);
	const correctQuestions = questions.reduce((acc, curr) => {
		if (curr.isCorrectUserAnswer) acc++;
		return acc;
	}, 0);
	const incorrect = questions.length - correctQuestions;
	const percentage = Math.round((correctQuestions / questions.length) * 100);
	const { scoresData } = getScores();
	const scoresSorted = scoresData
		?.sort((a, b) => {
			return b.percentage - a.percentage;
		})
		.slice(0, 10);

	// * FUNCTIONS TO SNOW
	const duration = 5 * 1000;
	const animationEnd = Date.now() + duration;
	let skew = 1;

	function randomInRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	function snow() {
		const timeLeft = animationEnd - Date.now();
		const ticks = Math.max(50, 100 * (timeLeft / duration));
		skew = Math.max(0.2, skew - 0.001);

		confetti({
			particleCount: 1,
			startVelocity: 0,
			ticks: ticks,
			origin: {
				x: Math.random(),
				// since particles fall down, skew start toward the top
				y: Math.random() * skew - 0.2,
			},
			colors: ["#ffffff"],
			shapes: ["circle"],
			gravity: randomInRange(0.4, 0.6),
			scalar: randomInRange(0.4, 1),
			drift: randomInRange(-0.4, 0.4),
		});
		if (timeLeft > 0) {
			requestAnimationFrame(snow);
		}
	}
	// * FUNCTIONS TO WIN

	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	useEffect(() => {
		if (percentage < 50) snow();
		if (percentage === 100) {
			const interval = setInterval(function () {
				const timeLeft = animationEnd - Date.now();

				if (timeLeft <= 0) {
					return clearInterval(interval);
				}

				const particleCount = 50 * (timeLeft / duration);
				// since particles fall down, start a bit higher than random
				confetti(
					Object.assign({}, defaults, {
						particleCount,
						origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
					}),
				);
				confetti(
					Object.assign({}, defaults, {
						particleCount,
						origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
					}),
				);
			}, 250);
		}
	}, []);

	return (
		<>
			<Stack marginTop={"16px"} marginBottom={"16px"} gap={4}>
				<Toaster />
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
						size="small"
						onClick={resetGame}
						variant="contained"
						color="success"
						startIcon={<RestartAltIcon sx={{ color: "white" }} />}
					>
						Reiniciar juego
					</Button>
					<Button
						size="small"
						onClick={() => setOpenModalSaveScore(true)}
						variant="contained"
						sx={{
							"&.Mui-disabled": {
								background: "#333",
								color: "#ddd",
							},
						}}
						startIcon={
							<SaveIcon sx={{ color: `${completed ? "gray" : "white"}` }} />
						}
						disabled={completed}
					>
						{completed ? "Puntuación guardada" : "Guardar puntuación"}
					</Button>
				</Stack>
				<Typography component={"h4"} variant={"h5"}>
					RESULTADOS DE OTROS FANS
				</Typography>
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Pos</TableCell>
								<TableCell align="left">Nombre Hechicero</TableCell>
								<TableCell align="right">Aciertos</TableCell>
								<TableCell align="right">Errores</TableCell>
								<TableCell align="right">% aciertos</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{!!scoresSorted &&
								scoresSorted?.map((score, index) => (
									<TableRow
										key={score.name}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell component="th">{index + 1}</TableCell>
										<TableCell align="left">{score.name}</TableCell>
										<TableCell align="right">{score.correct}</TableCell>
										<TableCell align="right">{score.incorrect}</TableCell>
										<TableCell align="right">{score.percentage}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Stack>
		</>
	);
};

export default EndGame;
