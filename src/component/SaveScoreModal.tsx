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
import { Toaster, toast } from "react-hot-toast";
import * as Yup from "yup";
import { db } from "../firebase";
import { useQuestionStore } from "../store/questions";

interface Props {
	open: boolean;
	handleClose: React.Dispatch<React.SetStateAction<boolean>>;
	correct: number;
	incorrect: number;
	percentage: number;
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
}: Props) {
	const cancelClick = () => {
		handleClose(false);
	};
	const acceptClick = () => {
		handleClose(false);
	};
	const setCompleted = useQuestionStore((state) => state.setCompleted);
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
		handleNewQuestion(name);
		acceptClick();
		reset();
		setCompleted();
		toast.success("Puntuación guardada con éxito", {
			duration: 3000,
			icon: "😎",
		});
	};
	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<Toaster />
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
