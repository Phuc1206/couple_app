import { db } from "./config"; // File cấu hình firebase gốc của bạn
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export interface ITodo {
  id?: string;
  title: string;
  completed: boolean;
  createdBy: "Phuc" | "Linh";
  timestamp: { seconds: number; nanoseconds: number } | null;
}

// 1. Lắng nghe danh sách việc cần làm theo thời gian thực
export const listenTodos = (callback: (todos: ITodo[]) => void) => {
  const q = query(collection(db, "todos"), orderBy("timestamp", "desc"));

  return onSnapshot(q, (snapshot) => {
    const todos: ITodo[] = [];
    snapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() } as ITodo);
    });
    callback(todos);
  });
};

// 2. Thêm một việc cần làm mới
export const addTodo = async (title: string, creator: "Phuc" | "Linh") => {
  if (!title.trim()) return;
  await addDoc(collection(db, "todos"), {
    title,
    completed: false,
    createdBy: creator,
    timestamp: serverTimestamp()
  });
};

// 3. Đánh dấu Hoàn thành / Chưa hoàn thành
export const toggleTodoComplete = async (id: string, currentStatus: boolean) => {
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, {
    completed: !currentStatus
  });
};

// 4. Xóa một việc khỏi danh sách
export const deleteTodo = async (id: string) => {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
};
