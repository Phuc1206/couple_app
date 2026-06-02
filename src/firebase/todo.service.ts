import { db } from "./config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export interface ITodo {
  id: string; // Tự tạo chuỗi ID ngẫu nhiên bằng crypto.randomUUID()
  title: string;
  completed: boolean;
  createdBy: "Phuc" | "Linh";
}

// Lấy reference tới document dùng chung duy nhất của 2 đứa
const todoDocRef = doc(db, "app_data", "shared_todos");

// 1. Lắng nghe danh sách todo (Vị trí mảng như nào thì giao diện hiện đúng như thế)
export const listenTodos = (callback: (todos: ITodo[]) => void) => {
  return onSnapshot(todoDocRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().list || []);
    } else {
      callback([]);
    }
  });
};

// 2. Hàm cập nhật lại toàn bộ mảng (Dùng chung cho cả Thêm, Sửa, Xóa, Kéo thả)
export const saveTodosToFirebase = async (newTodoList: ITodo[]) => {
  await setDoc(todoDocRef, { list: newTodoList }, { merge: true });
};
