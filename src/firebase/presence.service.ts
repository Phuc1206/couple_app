import { doc, setDoc } from "firebase/firestore";

import { db } from "./config";

export const setOnline = async (userId: string) => {
	await setDoc(doc(db, "presence", userId), {
		online: true,
		lastSeen: Date.now(),
	});
};
