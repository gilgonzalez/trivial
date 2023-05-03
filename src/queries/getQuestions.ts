import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, limit, query } from "firebase/firestore";
import { db } from "../firebase";

export const getQuestions = (limitQuestion: number) => {
	const colRef = query(collection(db, "questions"), limit(limitQuestion));
	const { data } = useFirestoreQuery(
		["questions"],
		colRef,
		{},
		{
			select: (data) => data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
		},
	);

	return { data };
};
