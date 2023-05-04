import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { doc, setDoc } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { db } from "../firebase";

interface Props {
	open: boolean;
	handleClose: React.Dispatch<React.SetStateAction<boolean>>;
	setSaved: React.Dispatch<React.SetStateAction<boolean>>;
	correct: number;
	incorrect: number;
	percentage: number;
	saved: boolean;
}
interface IFormInput {
	name: string;
}

export default function SaveScoreModal({
	open,
	handleClose,
	correct,
	incorrect,
	percentage,
	saved,
	setSaved,
}: Props) {
	const cancelClick = () => {
		handleClose(false);
	};
	const acceptClick = () => {
		handleClose(false);
	};
	const handleNewQuestion = async (id: string) => {
		const docRef = doc(db, "scores", id);
		const payload = { name: id, correct, incorrect, percentage };
		await setDoc(docRef, payload);
	};
	const schema = Yup.object().shape({
		name: Yup.string()
			.min(5, "¡Demasiado corto!")
			.max(20, "¡Demasiado largo!")
			.required("Required"),
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
		const { name } = data;
		if (saved) {
			alert("Ya has guardado tu puntuación, no seas tramposo");
			return null;
		}
		handleNewQuestion(name);
		acceptClick();
		reset();
		setSaved(true);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>¡Registra tu nombre en el ranking!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Para guardar tu puntuación, simplemente escribe tu nombre
					</DialogContentText>
					<form style={{ gap: "10px" }} onSubmit={handleSubmit(onSubmit)}>
						<TextField
							{...register("name")}
							margin="dense"
							id="name"
							label="Escribe tu nombre"
							type="text"
							fullWidth
							variant="standard"
							autoFocus
						/>
						{errors.name && <p className="error"> {errors.name.message}</p>}
						<DialogActions>
							<Button
								variant="contained"
								size="small"
								color="error"
								onClick={cancelClick}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								variant="contained"
								color="success"
								size="small"
							>
								Guardad mi puntuación
							</Button>
						</DialogActions>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
