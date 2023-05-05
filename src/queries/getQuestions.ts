import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase";

export const getQuestions = () => {
	const colRef = query(collection(db, "questions"));
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
