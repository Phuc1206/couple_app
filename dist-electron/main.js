import { app as n, nativeTheme as d, BrowserWindow as r, Notification as s } from "electron";
import { fileURLToPath as p, pathToFileURL as f } from "node:url";
import o from "node:path";
const a = o.dirname(p(import.meta.url));
process.env.APP_ROOT = o.join(a, "..");
const i = process.env.VITE_DEV_SERVER_URL, u = o.join(process.env.APP_ROOT, "dist-electron"), l = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? o.join(process.env.APP_ROOT, "public") : l;
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
    icon: o.join(process.env.VITE_PUBLIC, "love-letter.png"),
    webPreferences: {
      preload: o.join(a, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), i)
    e.webContents.openDevTools(), e.loadURL(i);
  else {
    const t = f(o.join(l, "index.html")).href;
    e.loadURL(t);
  }
  e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.on("closed", () => {
    e = null;
  });
}
function m(t) {
  s.isSupported() && new s({
    title: "My love",
    icon: o.join(process.env.VITE_PUBLIC, "love-letter.png"),
    body: t,
    silent: !1
  }).show();
}
n.whenReady().then(() => {
  d.themeSource = "dark", n.setLoginItemSettings({
    openAtLogin: !0
  });
  const t = o.join(process.env.VITE_PUBLIC, "love-letter.png");
  process.platform === "darwin" && n.dock.setIcon(t), c(), setTimeout(() => {
    m("Connected successfully ❤️");
  }, 1500);
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && n.quit();
});
n.on("activate", () => {
  r.getAllWindows().length === 0 && c();
});
export {
  u as MAIN_DIST,
  l as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
