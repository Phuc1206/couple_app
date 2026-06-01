import { db } from "./config"; // File cấu hình firebase của bạn
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export interface IMessage {
  id?: string;
  sender: "Phuc" | "Linh";
  content: string;
  timestamp: { seconds: number; nanoseconds: number } | null;
}

// Lắng nghe danh sách tin nhắn theo thời gian thực
export const listenMessages = (callback: (messages: IMessage[]) => void) => {
  const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: IMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as IMessage);
    });
    callback(messages);
  });
};

// Hàm gửi tin nhắn mới
export const sendMessageToFirebase = async (sender: "Phuc" | "Linh", content: string) => {
  if (!content.trim()) return;
  await addDoc(collection(db, "chats"), {
    sender,
    content,
    timestamp: serverTimestamp()
  });
};
