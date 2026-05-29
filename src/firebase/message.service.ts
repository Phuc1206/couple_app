import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { db } from "./config";

export const listenMessage = (callback: (text: string) => void) => {
	return onSnapshot(doc(db, "shared", "message"), (snap) => {
		callback(snap.data()?.text || "");
	});
};

export const updateMessage = async (text: string) => {
	await setDoc(doc(db, "shared", "message"), {
		text,
	});
};
