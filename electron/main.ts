import { app, BrowserWindow, Notification, nativeTheme, ipcMain } from "electron";

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
/* WINDOW */
/* -------------------------------- */

let win: BrowserWindow | null = null;

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

  /* CLOSED */

  win.on("closed", () => {
    win = null;
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

  /* DOCK ICON */
  const imagePath = path.join(process.env.VITE_PUBLIC!, "love-letter.png");
  if (process.platform === "darwin") {
    app.dock.setIcon(imagePath);
  }
  /* CREATE */
  createWindow();
});

/* CLOSE */

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/* MAC REOPEN */

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
