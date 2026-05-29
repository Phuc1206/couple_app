import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAlA8p_NjTgMSRojgFb5vN5LrqfHfdQ70g",
	authDomain: "couple-app-4b8ed.firebaseapp.com",
	projectId: "couple-app-4b8ed",
	storageBucket: "couple-app-4b8ed.firebasestorage.app",
	messagingSenderId: "973593272919",
	appId: "1:973593272919:web:95a18dca4a1a9caef27912",
	measurementId: "G-DTQ3XPBBDN",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
