/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { listenMessages, sendMessageToFirebase, IMessage } from "../firebase/message.service";
import soundUrl from "../assets/sounds/message.mp3";
import { sendLoveNotification } from "../utils/notification";

export const useMessages = (currentUsers: "Phuc" | "Linh") => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const firstLoad = useRef(true);

  // Xác định xem ai là đối phương để ghi tên vào thông báo cho rõ ràng
  const partnerName = currentUsers === "Phuc" ? "Linh" : "Phuc";

  useEffect(() => {
    const unsub = listenMessages((list) => {
      setMessages(list);

      // Phát âm thanh & bắn thông báo Electron nếu có tin nhắn mới từ đối phương
      if (!firstLoad.current && list.length > 0) {
        const lastMsg = list[list.length - 1];

        // Nếu tin nhắn cuối cùng KHÔNG phải do mình gửi (tức là người yêu gửi)
        if (lastMsg.sender !== currentUsers) {
          // 1. Phát âm thanh tích hợp sẵn của bạn
          const audio = new Audio(soundUrl);
          audio.volume = 0.5;
          audio.play().catch(() => console.log("Audio blocked"));

          sendLoveNotification(`${partnerName} vừa nhắn: "${lastMsg.content || "📷 [Hình ảnh/Sticker]"}"`);
        }
      }
      firstLoad.current = false;
    });

    return () => unsub();
  }, [currentUsers, partnerName]);

  const sendMessage = async (value: string) => {
    await sendMessageToFirebase(currentUsers, value);
  };

  return {
    messages,
    sendMessage
  };
};
