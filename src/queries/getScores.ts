import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../firebase";

export const getScores = () => {
	const colRef = collection(db, "scores");
	const { data: scoresData } = useFirestoreQuery(
		["scores"],
		colRef,
		{},
		{
			refetchOnWindowFocus: true,
			select: (data) => data.docs.map((doc) => doc.data()),
		},
	);

	return { scoresData };
};
