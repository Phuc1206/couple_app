import { useEffect, useRef, useState } from "react";
import { listenMessages, sendMessageToFirebase, IMessage } from "../firebase/message.service";
import soundUrl from "../assets/sounds/message.mp3";

export const useMessages = (currentUsers: "Phuc" | "Linh") => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const firstLoad = useRef(true);

  useEffect(() => {
    const unsub = listenMessages((list) => {
      setMessages(list);

      // Phát âm thanh nếu có tin nhắn mới từ đối phương
      if (!firstLoad.current && list.length > 0) {
        const lastMsg = list[list.length - 1];
        if (lastMsg.sender !== currentUsers) {
          const audio = new Audio(soundUrl);
          audio.volume = 0.5;
          audio.play().catch(() => console.log("Audio blocked"));
        }
      }
      firstLoad.current = false;
    });

    return () => unsub();
  }, [currentUsers]);

  const sendMessage = async (value: string) => {
    await sendMessageToFirebase(currentUsers, value);
  };

  return {
    messages,
    sendMessage
  };
};
