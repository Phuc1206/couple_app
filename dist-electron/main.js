import { app, nativeTheme, BrowserWindow, Notification } from "electron";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win = null;
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
    icon: path.join(process.env.VITE_PUBLIC, "love-letter.png"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    const indexUrl = pathToFileURL(path.join(RENDERER_DIST, "index.html")).href;
    win.loadURL(indexUrl);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.on("closed", () => {
    win = null;
  });
}
function showNotification(body) {
  if (!Notification.isSupported()) return;
  new Notification({
    title: "My love",
    icon: path.join(process.env.VITE_PUBLIC, "love-letter.png"),
    body,
    silent: false
  }).show();
}
app.whenReady().then(() => {
  nativeTheme.themeSource = "dark";
  app.setLoginItemSettings({
    openAtLogin: true
  });
  app.dock.setIcon(path.join(process.env.APP_ROOT, "public/love-letter.png"));
  createWindow();
  setTimeout(() => {
    showNotification("Connected successfully ❤️");
  }, 1500);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
