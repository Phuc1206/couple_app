/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Hàm viết tắt để gửi nhanh thông báo lên hệ thống thông qua Electron IPC
 * @param message Nội dung thông báo hiển thị cho người yêu
 */
export const sendLoveNotification = (message: string) => {
  if (typeof window !== "undefined") {
    (window as any).ipcRenderer?.send("push-love-notification", message);
  }
};
