import { useEffect, useState } from "react";

import { listenMessage, updateMessage } from "../firebase/message.service";

export const useMessages = () => {
	const [text, setText] = useState("");

	useEffect(() => {
		const unsub = listenMessage(setText);

		return () => unsub();
	}, []);

	const sendMessage = async (value: string) => {
		setText(value);

		await updateMessage(value);
	};

	return {
		text,
		sendMessage,
	};
};
