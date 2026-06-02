import { useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { updateOnlineStatus } from "../firebase/home.service";

export const usePresence = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    if (!currentUser) return;

    // 1. Vừa vào app -> Báo cáo là ONLINE liền
    updateOnlineStatus(currentUser, true);

    // 2. Set Interval cứ mỗi 30 giây "đập" một phát để giữ trạng thái luôn tươi mới
    const heartbeat = setInterval(() => {
      updateOnlineStatus(currentUser, true);
    }, 30000);

    // 3. Sự kiện khi người dùng tắt app hoặc reload (Hữu ích cho cả Electron)
    const handleBeforeUnload = () => {
      updateOnlineStatus(currentUser, false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: Khi component này unmount (hoặc đổi user) -> Báo OFFLINE
    return () => {
      clearInterval(heartbeat);
      updateOnlineStatus(currentUser, false);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUser]);
};
