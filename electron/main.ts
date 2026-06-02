import { app, BrowserWindow, Notification, nativeTheme, ipcMain, Tray, Menu } from "electron";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* -------------------------------- */
/* ENV */
/* -------------------------------- */

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

/* -------------------------------- */
/* WINDOW & TRAY */
/* -------------------------------- */

let win: BrowserWindow | null = null;
let tray: Tray | null = null;
// Biến cờ hiệu để kiểm tra xem người dùng muốn thoát hẳn app hay chỉ đóng cửa sổ tạm thời
let isQuitting = false;

function createWindow() {
  win = new BrowserWindow({
    width: 380,
    height: 720,
    minWidth: 340,
    minHeight: 600,
    transparent: true,
    frame: false,
    hasShadow: false,
    vibrancy: "sidebar",
    visualEffectState: "active",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: {
      x: 16,
      y: 16
    },
    backgroundColor: "#00000000",
    icon: path.join(process.env.VITE_PUBLIC!, "love-letter.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  /* DEVTOOLS */
  if (VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    const indexUrl = pathToFileURL(path.join(RENDERER_DIST, "index.html")).href;
    win.loadURL(indexUrl);
  }

  /* READY */
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  /* INTERCEPT CLOSE EVENT (CHẶN NÚT X ĐỂ CHẠY NGẦM) */
  win.on("close", (event) => {
    // Nếu không phải lệnh thoát hẳn app từ khay hệ thống, chỉ ẩn cửa sổ xuống ngầm
    if (!isQuitting) {
      event.preventDefault();
      win?.hide();
    }
  });

  /* CLOSED */
  win.on("closed", () => {
    win = null;
  });
}

/* -------------------------------- */
/* SYSTEM TRAY (KHAY HỆ THỐNG CHẠY NGẦM) */
/* -------------------------------- */
function createTray() {
  const iconPath = path.join(process.env.VITE_PUBLIC!, "love-letter.png");
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Mở Không Gian Đôi ❤️",
      click: () => {
        win?.show();
      }
    },
    { type: "separator" },
    {
      label: "Thoát Hẳn Ứng Dụng",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip("Không gian tình yêu bất tận ✨");
  tray.setContextMenu(contextMenu);

  // Đúp chuột vào icon khay hệ thống để bật nhanh lại ứng dụng
  tray.on("double-click", () => {
    win?.show();
  });
}

/* -------------------------------- */
/* NOTIFICATION */
/* -------------------------------- */
ipcMain.on("push-love-notification", (_event, text: string) => {
  if (!Notification.isSupported()) return;

  new Notification({
    title: "Cục cưng nhắn gửi 💖",
    icon: path.join(process.env.VITE_PUBLIC!, "love-letter.png"),
    body: text,
    silent: false
  }).show();
});

/* -------------------------------- */
/* APP EVENTS */
/* -------------------------------- */

app.whenReady().then(() => {
  /* DARK MODE */
  nativeTheme.themeSource = "dark";

  /* AUTO STARTUP */
  app.setLoginItemSettings({
    openAtLogin: true
  });

  /* DOCK ICON (MAC) */
  const imagePath = path.join(process.env.VITE_PUBLIC!, "love-letter.png");
  if (process.platform === "darwin") {
    app.dock.setIcon(imagePath);
  }

  /* CREATE WINDOW & TRAY */
  createWindow();
  createTray(); // Kích hoạt khay hệ thống ngay khi app sẵn sàng
});

/* CLOSE */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Không gọi app.quit() ở đây nữa để đảm bảo ứng dụng chạy nền liên tục khi tắt hết window
  }
});

/* MAC REOPEN & TOGGLE BACK FROM BACKGROUND */
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    win?.show();
  }
});

// Trước khi ứng dụng đóng hoàn toàn (Khi bấm Thoát hẳn ở Tray)
app.on("before-quit", () => {
  isQuitting = true;
});
