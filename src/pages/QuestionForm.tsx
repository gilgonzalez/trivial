import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { addDoc, collection } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { db } from "../firebase";
import { Question } from "../store/types";

interface Props {
	open: boolean;
	handleClose: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IFormInput {
	question: string;
	urlImage: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	correctAnswer: number;
}

export default function QuestionForm({ open, handleClose }: Props) {
	const cancelClick = () => {
		handleClose(false);
	};
	const acceptClick = () => {
		handleClose(false);
	};
	const handleNewQuestion = async (payload: Question) => {
		const docRef = collection(db, "questions");
		await addDoc(docRef, payload);
	};
	const schema = Yup.object().shape({
		question: Yup.string()
			.min(5, "¡Demasiado corto!")
			.max(500, "¡Demasiado largo!")
			.required("Required"),
		urlImage: Yup.string().notRequired(),
		option1: Yup.string()
			.min(1, "¡Demasiado corto!")
			.max(200, "¡Demasiado largo!"),
		option2: Yup.string()
			.min(1, "¡Demasiado corto!")
			.max(200, "¡Demasiado largo!"),
		option3: Yup.string()
			.min(1, "¡Demasiado corto!")
			.max(200, "¡Demasiado largo!"),
		option4: Yup.string()
			.min(1, "¡Demasiado corto!")
			.max(200, "¡Demasiado largo!"),
		correctAnswer: Yup.number()
			.typeError(
				"La respuesta correcta se especifica con el número de la opción",
			)
			.min(1, "La respuesta correcta debe ser un número entre 1 y 4")
			.max(4, "La respuesta correcta debe ser un número entre 1 y 4")
			.required("Debes especificar cuál es la respuesta correcta"),
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IFormInput>({
		resolver: yupResolver(schema),
	});
	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		const {
			correctAnswer,
			option1,
			option2,
			option3,
			option4,
			question,
			urlImage,
		} = data;
		const newQuestion: Partial<Question> = {
			question,
			answers: [option1, option2, option3, option4],
			correctAnswer: correctAnswer - 1,
			urlImage: urlImage ? urlImage : "",
		};
		handleNewQuestion(newQuestion as Question);
		acceptClick();
		reset();
		console.log(data);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>¡Ayúdame a conseguir más preguntas!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Si crees que falta alguna pregunta sobre el universo Harry Potter
						que debería aparecer, no dudes en incluirla
					</DialogContentText>
					<form style={{ gap: "10px" }} onSubmit={handleSubmit(onSubmit)}>
						<TextField
							{...register("question")}
							margin="dense"
							id="name"
							label="Aquí va la pregunta"
							type="text"
							fullWidth
							variant="standard"
							autoFocus
						/>
						{errors.question && (
							<p className="error">{errors.question.message}</p>
						)}
						<TextField
							{...register("urlImage")}
							margin="dense"
							id="name"
							label="Añadir url de una imagen (Opcional)"
							type="text"
							fullWidth
							variant="standard"
						/>

						<Grid container spacing={2} marginTop={"12px"}>
							<Grid item xs={6}>
								<TextField
									{...register("option1")}
									size="small"
									label="Opcion 1"
								/>
								{errors.option1 && (
									<p className="error">{errors.option1.message}</p>
								)}
							</Grid>
							<Grid item xs={6}>
								<TextField
									{...register("option2")}
									size="small"
									label="Opcion 2"
								/>
								{errors.option2 && (
									<p className="error">{errors.option2.message}</p>
								)}
							</Grid>
							<Grid item xs={6}>
								<TextField
									{...register("option3")}
									size="small"
									label="Opcion 3"
								/>
								{errors.option3 && (
									<p className="error">{errors.option3.message}</p>
								)}
							</Grid>
							<Grid item xs={6}>
								<TextField
									{...register("option4")}
									size="small"
									label="Opcion 4"
								/>
								{errors.option4 && (
									<p className="error">{errors.option4.message}</p>
								)}
							</Grid>
						</Grid>
						<Stack display={"flex"} alignItems={"center"} marginTop={"12px"}>
							<TextField
								{...register("correctAnswer")}
								type='number'
								size="small"
								label="Opción correcta"
							/>
							{errors.correctAnswer && (
								<p className="error">{errors.correctAnswer.message}</p>
							)}
						</Stack>
						<DialogActions>
							<Button
								variant="contained"
								size="small"
								color="error"
								onClick={cancelClick}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="success"
								size="small"
							>
								Generar Pregunta
							</Button>
						</DialogActions>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
