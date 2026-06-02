import { ipcMain as d, Notification as s, app as o, nativeTheme as f, BrowserWindow as r } from "electron";
import { fileURLToPath as h, pathToFileURL as m } from "node:url";
import n from "node:path";
const a = n.dirname(h(import.meta.url));
process.env.APP_ROOT = n.join(a, "..");
const i = process.env.VITE_DEV_SERVER_URL, w = n.join(process.env.APP_ROOT, "dist-electron"), l = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? n.join(process.env.APP_ROOT, "public") : l;
let e = null;
function c() {
  if (e = new r({
    width: 380,
    height: 720,
    minWidth: 340,
    minHeight: 600,
    transparent: !0,
    frame: !1,
    hasShadow: !1,
    vibrancy: "sidebar",
    visualEffectState: "active",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: {
      x: 16,
      y: 16
    },
    backgroundColor: "#00000000",
    icon: n.join(process.env.VITE_PUBLIC, "love-letter.png"),
    webPreferences: {
      preload: n.join(a, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), i)
    e.webContents.openDevTools(), e.loadURL(i);
  else {
    const t = m(n.join(l, "index.html")).href;
    e.loadURL(t);
  }
  e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.on("closed", () => {
    e = null;
  });
}
d.on("push-love-notification", (t, p) => {
  s.isSupported() && new s({
    title: "Cục cưng nhắn gửi 💖",
    icon: n.join(process.env.VITE_PUBLIC, "love-letter.png"),
    body: p,
    silent: !1
  }).show();
});
o.whenReady().then(() => {
  f.themeSource = "dark", o.setLoginItemSettings({
    openAtLogin: !0
  });
  const t = n.join(process.env.VITE_PUBLIC, "love-letter.png");
  process.platform === "darwin" && o.dock.setIcon(t), c();
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
o.on("activate", () => {
  r.getAllWindows().length === 0 && c();
});
export {
  w as MAIN_DIST,
  l as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
