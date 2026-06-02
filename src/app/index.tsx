/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { usePresence } from "../hooks/usePresence";
import { router } from "../routes";
import { useUserStore } from "../store/userStore"; // Trỏ đúng đường dẫn store của bạn

// Firebase imports
import { doc, onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config"; // Trỏ đúng đường dẫn config firebase của bạn
import { sendLoveNotification } from "../utils/notification";

function App() {
  usePresence();

  const currentUser = useUserStore((state) => state.currentUser);
  const partner: "Phuc" | "Linh" = currentUser === "Phuc" ? "Linh" : "Phuc";

  // Các mốc useRef giữ giá trị cũ chạy ngầm để so sánh (tránh tự bắn thông báo lúc vừa mở app)
  const isFirstLoadHome = useRef(true);
  const prevWidgetText = useRef<string | null>(null);
  const prevSpecialDaysLength = useRef<number | null>(null);
  const prevDiaryNote = useRef<string | null>(null);

  // 🚀 THÊM 2 MỐC NÀY ĐỂ THEO DÕI TRẠNG THÁI ĐỐI PHƯƠNG
  const prevPartnerMood = useRef<string | null>(null);
  const prevPartnerOnline = useRef<boolean | null>(null);

  const isFirstLoadChat = useRef(true);
  const lastMessageId = useRef<string | null>(null);
  useEffect(() => {
    // Nếu chưa đăng nhập (currentUser là null hoặc trống), chưa kích hoạt nghe ngầm
    if (!currentUser) return;

    // =================================================================
    // 1. NGHE NGẦM TRANG CHỦ (WIDGET ĐÔI & NGÀY ĐẶC BIỆT)
    // =================================================================
    const homeDocRef = doc(db, "app_data", "homepage_shared");

    const unsubscribeHome = onSnapshot(homeDocRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      const partnerStatus = partner === "Phuc" ? data.phucStatus : data.linhStatus;
      // Nạp dữ liệu mốc đầu tiên
      if (isFirstLoadHome.current) {
        prevWidgetText.current = data.widgetText || "";
        prevSpecialDaysLength.current = data.specialDays?.length || 0;
        if (partnerStatus) {
          prevPartnerMood.current = partnerStatus.mood || "";
          prevPartnerOnline.current = !!partnerStatus.online;
        }
        isFirstLoadHome.current = false;
        return;
      }

      // Check nếu người cập nhật là đối phương (partner)
      if (data.widgetUpdatedBy === partner) {
        // Sửa Lời nhắn gửi
        if (data.widgetText !== prevWidgetText.current) {
          sendLoveNotification(`${partner === "Phuc" ? "Phúc" : "Linh"} vừa gửi lời nhắn mới: "${data.widgetText}" 💬`);
          prevWidgetText.current = data.widgetText;
        }

        // Thêm Ngày đặc biệt
        const currentDaysLength = data.specialDays?.length || 0;
        if (currentDaysLength !== prevSpecialDaysLength.current) {
          if (currentDaysLength > (prevSpecialDaysLength.current ?? 0)) {
            sendLoveNotification(`${partner === "Phuc" ? "Phúc" : "Linh"} vừa tạo một mốc thời gian mong đợi mới đó! ✨`);
          }
          prevSpecialDaysLength.current = currentDaysLength;
        }
      }
      if (partnerStatus) {
        const partnerNameDisplay = partner === "Phuc" ? "Phúc" : "Linh";

        // 1. Kiểm tra thay đổi Tâm Trạng (Mood)
        const currentMood = partnerStatus.mood || "";
        if (currentMood !== prevPartnerMood.current) {
          sendLoveNotification(`${partnerNameDisplay} vừa đổi tâm trạng: ${currentMood}`);
          prevPartnerMood.current = currentMood; // Cập nhật lại mốc cũ
        }

        // 2. Kiểm tra thay đổi Trạng thái Online / Offline
        const currentOnline = !!partnerStatus.online;
        if (currentOnline !== prevPartnerOnline.current) {
          if (currentOnline) {
            sendLoveNotification(`Người yêu ${partnerNameDisplay} vừa mới truy cập ứng dụng kìa! 🥰`);
          } else {
            sendLoveNotification(`${partnerNameDisplay} đã rời ứng dụng rồi 😴`);
          }
          prevPartnerOnline.current = currentOnline; // Cập nhật lại mốc cũ
        }
      }
    });

    // =================================================================
    // 2. NGHE NGẦM NHẬT KÝ HÔM NAY
    // =================================================================
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const diaryDocRef = doc(db, "app_data", "homepage_shared", "diary_shared", todayStr);

    const unsubscribeDiary = onSnapshot(diaryDocRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();

      const partnerDiary = partner === "Phuc" ? data.phucData : data.linhData;
      if (!partnerDiary) return;

      // Nạp dữ liệu mốc đầu tiên
      if (prevDiaryNote.current === null) {
        prevDiaryNote.current = partnerDiary.note || "";
        return;
      }

      // Nếu đối phương thay đổi nội dung ghi chép nhật ký
      if (partnerDiary.note !== prevDiaryNote.current) {
        sendLoveNotification(`${partner === "Phuc" ? "Phúc" : "Linh"} vừa ghi nhật ký hôm nay: "${partnerDiary.note}" 📖`);
        prevDiaryNote.current = partnerDiary.note;
      }
    });

    // =================================================================
    // 3. NGHE NGẦM TIN NHẮN CHAT MỚI
    // =================================================================
    // Query lấy ra đúng 1 tin nhắn mới nhất trong subcollection messages của phòng đôi
    const messagesRef = collection(db, "chats");
    const chatQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(1));

    const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
      if (snapshot.empty) return;

      const lastDoc = snapshot.docs[0];
      const lastMsgData = lastDoc.data();
      console.log("Tin nhắn mới về:", lastMsgData);
      // Nạp mốc ID tin nhắn cũ nhất lúc vừa bật app
      if (isFirstLoadChat.current) {
        lastMessageId.current = lastDoc.id;
        isFirstLoadChat.current = false;
        return;
      }

      // Nếu tin nhắn mới về có ID khác ID cũ, và KHÔNG phải do chính mình gửi
      if (lastDoc.id !== lastMessageId.current && lastMsgData.sender !== currentUser) {
        sendLoveNotification(`${partner === "Phuc" ? "Phúc" : "Linh"} vừa nhắn: "${lastMsgData.content || "📷 [Hình ảnh/Sticker]"}"`);
        lastMessageId.current = lastDoc.id; // Cập nhật mốc ID mới
      }
    });
    // Hủy đăng ký tất cả radar khi User Logout hoặc tắt app
    return () => {
      unsubscribeHome();
      unsubscribeDiary();
      unsubscribeChat();
    };
  }, [currentUser, partner]);

  return <RouterProvider router={router} />;
}

export default App;
