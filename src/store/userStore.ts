import { create } from "zustand";
import { persist } from "zustand/middleware";

// Định nghĩa kiểu dữ liệu cho Store
interface UserState {
  currentUser: "Phuc" | "Linh";
  setCurrentUser: (user: "Phuc" | "Linh") => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: "Phuc", // Mặc định ban đầu là Phúc
      setCurrentUser: (user) => set({ currentUser: user })
    }),
    {
      name: "love-app-user-storage" // Tên key lưu dưới localStorage
    }
  )
);
