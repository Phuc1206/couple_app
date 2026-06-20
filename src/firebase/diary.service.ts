import { db } from "./config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

export interface IDiaryEntry {
  mood: string;
  note: string;
  whatILove: string;
  updatedBy: string;
  updatedAt: string;
}
export const formatDate = (date: Date = new Date()) => {
  return date.toLocaleDateString("en-CA");
};
const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// 1. Lưu nhật ký của hôm nay
export const saveTodayDiary = async (
  user: "Phuc" | "Linh",
  data: {
    mood: string;
    note: string;
    whatILove: string;
  }
) => {
  return saveDiary(user, getTodayStr(), data);
};
export const saveDiary = async (
  user: "Phuc" | "Linh",
  date: string,
  data: {
    mood: string;
    note: string;
    whatILove: string;
  }
) => {
  const docRef = doc(db, "app_data", "homepage_shared", "diary_shared", date);

  await setDoc(
    docRef,
    {
      [user === "Phuc" ? "phucData" : "linhData"]: {
        ...data,
        updatedAt: new Date().toISOString()
      }
    },
    { merge: true }
  );
};
export const getDiary = async (
  user: "Phuc" | "Linh",
  date: string
): Promise<{
  mood: string;
  note: string;
  whatILove: string;
} | null> => {
  const docRef = doc(db, "app_data", "homepage_shared", "diary_shared", date);

  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();

    return user === "Phuc" ? data.phucData || null : data.linhData || null;
  }

  return null;
};
// 2. Lấy dữ liệu nhật ký hôm nay của User
export const getTodayDiary = async (user: "Phuc" | "Linh") => {
  return getDiary(user, getTodayStr());
};

export interface IDiaryTimelineItem {
  id: string; // Document ID chính là ngày dạng YYYY-MM-DD
  phucData?: { mood: string; note: string; whatILove: string; updatedAt: string };
  linhData?: { mood: string; note: string; whatILove: string; updatedAt: string };
}

// 🚀 HÀM LẤY TOÀN BỘ NHẬT KÝ TỪ APP_DATA (Xếp ngày mới nhất lên đầu)
export const getAllDiaries = async (): Promise<IDiaryTimelineItem[]> => {
  // Trỏ đúng vào đường dẫn Subcollection con nằm trong app_data
  const diaryCollection = collection(db, "app_data", "homepage_shared", "diary_shared");

  // Sắp xếp theo ID của document (ngày YYYY-MM-DD) giảm dần để ngày mới nhất nằm trên cùng
  const snapshot = await getDocs(diaryCollection);

  const diaries: IDiaryTimelineItem[] = [];
  snapshot.forEach((doc) => {
    diaries.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return diaries.sort((a, b) => b.id.localeCompare(a.id));
};
