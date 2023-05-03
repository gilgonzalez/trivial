// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBWFfp-xJIIhHaquCaM__x2tjd6foucskI",
	authDomain: "quiz-zustand.firebaseapp.com",
	projectId: "quiz-zustand",
	storageBucket: "quiz-zustand.appspot.com",
	messagingSenderId: "159751843339",
	appId: "1:159751843339:web:cf246168020913fc53e10e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
export default app;
