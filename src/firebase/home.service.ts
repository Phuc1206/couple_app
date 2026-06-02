/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./config";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
export interface ISpecialDay {
  id: string;
  title: string;
  date: string; // Định dạng YYYY-MM-DD
  type: "anniversary" | "birthday" | "valentine" | "travel";
}
export interface IHomeData {
  widgetText: string;
  widgetUpdatedBy: string;
  phucStatus: { online: boolean; mood: string; lastActive: any };
  linhStatus: { online: boolean; mood: string; lastActive: any };
  specialDays: ISpecialDay[];
}

const homeDocRef = doc(db, "app_data", "homepage_shared");

// 1. Lắng nghe dữ liệu Trang chủ Realtime (Widget chữ, trạng thái online)
export const listenHomeData = (callback: (data: IHomeData) => void) => {
  return onSnapshot(homeDocRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as IHomeData);
    } else {
      // Thiết lập data mặc định nếu chưa có trên DB
      const defaultData: IHomeData = {
        widgetText: "Hôm nay Phúc yêu Linh nhiều lắm! ❤️",
        widgetUpdatedBy: "Phuc",
        phucStatus: { online: true, mood: "🥰 Hạnh phúc", lastActive: new Date() },
        linhStatus: { online: false, mood: "😴 Đang ngủ", lastActive: new Date() },
        specialDays: [
          { id: "1", title: "Kỷ niệm yêu nhau", date: "2026-02-14", type: "anniversary" },
          { id: "2", title: "Sinh nhật Linh công chúa 🎂", date: "2026-10-20", type: "birthday" },
          { id: "3", title: "Valentine ngọt ngào", date: "2027-02-14", type: "valentine" },
          { id: "4", title: "Chuyến du lịch Đà Lạt 🏕️", date: "2026-08-15", type: "travel" }
        ]
      };
      setDoc(homeDocRef, defaultData);
      callback(defaultData);
    }
  });
};

// 2. Cập nhật chữ trong Widget đôi
export const updateWidgetText = async (text: string, sender: "Phuc" | "Linh") => {
  await updateDoc(homeDocRef, {
    widgetText: text,
    widgetUpdatedBy: sender
  });
};

// 3. Cập nhật Tâm trạng (Mood)
export const updateMyMood = async (user: "Phuc" | "Linh", mood: string) => {
  const fieldToUpdate = user === "Phuc" ? "phucStatus.mood" : "linhStatus.mood";
  await updateDoc(homeDocRef, {
    [fieldToUpdate]: mood
  });
};

// Hàm cập nhật trạng thái Online/Offline và thời gian hoạt động cuối cùng
export const updateOnlineStatus = async (user: "Phuc" | "Linh", isOnline: boolean) => {
  const statusField = user === "Phuc" ? "phucStatus" : "linhStatus";

  await updateDoc(homeDocRef, {
    [`${statusField}.online`]: isOnline,
    [`${statusField}.lastActive`]: new Date() // Lưu lại lúc mấy giờ luôn
  });
};

export const updateSpecialDays = async (newDays: ISpecialDay[]) => {
  await updateDoc(homeDocRef, {
    specialDays: newDays
  });
};
