import { db } from "./config";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

export interface IDiaryEntry {
  mood: string;
  note: string;
  whatILove: string;
  updatedBy: string;
  updatedAt: string;
}

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// 1. Lưu nhật ký của hôm nay
export const saveTodayDiary = async (user: "Phuc" | "Linh", data: { mood: string; note: string; whatILove: string }) => {
  const todayStr = getTodayStr();

  // 🚀 ĐỔI VỊ TRÍ: "diary_shared" đứng trước (làm tên Subcollection), todayStr đứng sau (làm Document ID)
  const docRef = doc(db, "app_data", "homepage_data", "diary_shared", todayStr);

  // Bỏ bớt bước getDoc check existingDoc để app chạy nhanh hơn, { merge: true } của Firestore lo hết rồi nha!
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

// 2. Lấy dữ liệu nhật ký hôm nay của User
export const getTodayDiary = async (user: "Phuc" | "Linh"): Promise<{ mood: string; note: string; whatILove: string } | null> => {
  const todayStr = getTodayStr();

  // 🚀 Đồng bộ lại đường dẫn giống hàm lưu ở trên
  const docRef = doc(db, "app_data", "homepage_data", "diary_shared", todayStr);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    return user === "Phuc" ? data.phucData || null : data.linhData || null;
  }
  return null;
};

export interface IDiaryTimelineItem {
  id: string; // Document ID chính là ngày dạng YYYY-MM-DD
  phucData?: { mood: string; note: string; whatILove: string; updatedAt: string };
  linhData?: { mood: string; note: string; whatILove: string; updatedAt: string };
}

// 🚀 HÀM LẤY TOÀN BỘ NHẬT KÝ TỪ APP_DATA (Xếp ngày mới nhất lên đầu)
export const getAllDiaries = async (): Promise<IDiaryTimelineItem[]> => {
  // Trỏ đúng vào đường dẫn Subcollection con nằm trong app_data
  const diaryCollection = collection(db, "app_data", "homepage_data", "diary_shared");

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
