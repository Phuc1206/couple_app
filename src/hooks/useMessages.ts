import { useEffect, useRef, useState } from "react";

import { listenMessage, updateMessage } from "../firebase/message.service";
import soundUrl from "../assets/sounds/message.mp3";
export const useMessages = () => {
	const [text, setText] = useState("");

	const firstLoad = useRef(true);

	// đánh dấu message do mình gửi
	const isSending = useRef(false);

	useEffect(() => {
		const unsub = listenMessage((newText) => {
			setText(newText);

			// ignore lần load đầu
			if (firstLoad.current) {
				firstLoad.current = false;

				return;
			}

			// ignore sound do chính mình gửi
			if (isSending.current) {
				isSending.current = false;

				return;
			}

			const audio = new Audio(soundUrl);

			audio.volume = 0.5;

			audio.play().catch(() => {
				console.log("Audio blocked");
			});
		});

		return () => unsub();
	}, []);

	const sendMessage = async (value: string) => {
		// đánh dấu mình đang gửi
		isSending.current = true;

		await updateMessage(value);
	};

	return {
		text,
		sendMessage,
	};
};
