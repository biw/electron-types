import { expectTypeOf } from "expect-type";
import { describe, it } from "vitest";

/// <reference path="../dist/electron.d.ts" />

describe("Electron types", () => {
  describe("Core classes", () => {
    it("BrowserWindow", () => {
      expectTypeOf<Electron.BrowserWindow>().not.toBeAny();
      expectTypeOf<Electron.BrowserWindow>().toHaveProperty("show");
      expectTypeOf<Electron.BrowserWindow>().toHaveProperty("loadURL");
      expectTypeOf<Electron.BrowserWindow>().toHaveProperty("close");
      expectTypeOf<Electron.BrowserWindow>().toHaveProperty("webContents");
    });

    it("App", () => {
      expectTypeOf<Electron.App>().not.toBeAny();
      expectTypeOf<Electron.App>().toHaveProperty("getName");
      expectTypeOf<Electron.App>().toHaveProperty("quit");
      expectTypeOf<Electron.App>().toHaveProperty("on");
      expectTypeOf<Electron.App>().toHaveProperty("whenReady");
    });

    it("WebContents", () => {
      expectTypeOf<Electron.WebContents>().not.toBeAny();
      expectTypeOf<Electron.WebContents>().toHaveProperty("send");
      expectTypeOf<Electron.WebContents>().toHaveProperty("loadURL");
      expectTypeOf<Electron.WebContents>().toHaveProperty("executeJavaScript");
    });

    it("Session", () => {
      expectTypeOf<Electron.Session>().not.toBeAny();
      expectTypeOf<Electron.Session>().toHaveProperty("cookies");
      expectTypeOf<Electron.Session>().toHaveProperty("clearCache");
      expectTypeOf<Electron.Session>().toHaveProperty("setProxy");
    });
  });

  describe("System tray and notifications", () => {
    it("Tray", () => {
      expectTypeOf<Electron.Tray>().not.toBeAny();
      expectTypeOf<Electron.Tray>().toHaveProperty("setImage");
      expectTypeOf<Electron.Tray>().toHaveProperty("setContextMenu");
      expectTypeOf<Electron.Tray>().toHaveProperty("setToolTip");
    });

    it("Notification", () => {
      expectTypeOf<Electron.Notification>().not.toBeAny();
      expectTypeOf<Electron.Notification>().toHaveProperty("show");
      expectTypeOf<Electron.Notification>().toHaveProperty("close");
    });
  });

  describe("Image handling", () => {
    it("NativeImage", () => {
      expectTypeOf<Electron.NativeImage>().not.toBeAny();
      expectTypeOf<Electron.NativeImage>().toHaveProperty("toPNG");
      expectTypeOf<Electron.NativeImage>().toHaveProperty("toJPEG");
      expectTypeOf<Electron.NativeImage>().toHaveProperty("toDataURL");
      expectTypeOf<Electron.NativeImage>().toHaveProperty("getSize");
    });
  });

  describe("IPC types", () => {
    it("IpcMain", () => {
      expectTypeOf<Electron.IpcMain>().not.toBeAny();
      expectTypeOf<Electron.IpcMain>().toHaveProperty("on");
      expectTypeOf<Electron.IpcMain>().toHaveProperty("handle");
      expectTypeOf<Electron.IpcMain>().toHaveProperty("removeHandler");
    });

    it("IpcRenderer", () => {
      expectTypeOf<Electron.IpcRenderer>().not.toBeAny();
      expectTypeOf<Electron.IpcRenderer>().toHaveProperty("send");
      expectTypeOf<Electron.IpcRenderer>().toHaveProperty("invoke");
      expectTypeOf<Electron.IpcRenderer>().toHaveProperty("on");
    });

    it("ContextBridge", () => {
      expectTypeOf<Electron.ContextBridge>().not.toBeAny();
      expectTypeOf<Electron.ContextBridge>().toHaveProperty("exposeInMainWorld");
    });
  });

  describe("UI types", () => {
    it("Menu", () => {
      expectTypeOf<Electron.Menu>().not.toBeAny();
      expectTypeOf<Electron.Menu>().toHaveProperty("append");
      expectTypeOf<Electron.Menu>().toHaveProperty("popup");
    });

    it("MenuItem", () => {
      expectTypeOf<Electron.MenuItem>().not.toBeAny();
      expectTypeOf<Electron.MenuItem>().toHaveProperty("label");
      expectTypeOf<Electron.MenuItem>().toHaveProperty("click");
    });

    it("Dialog", () => {
      expectTypeOf<Electron.Dialog>().not.toBeAny();
      expectTypeOf<Electron.Dialog>().toHaveProperty("showOpenDialog");
      expectTypeOf<Electron.Dialog>().toHaveProperty("showSaveDialog");
      expectTypeOf<Electron.Dialog>().toHaveProperty("showMessageBox");
    });
  });

  describe("System interfaces", () => {
    it("Clipboard", () => {
      expectTypeOf<Electron.Clipboard>().not.toBeAny();
      expectTypeOf<Electron.Clipboard>().toHaveProperty("readText");
      expectTypeOf<Electron.Clipboard>().toHaveProperty("writeText");
      expectTypeOf<Electron.Clipboard>().toHaveProperty("readImage");
    });

    it("GlobalShortcut", () => {
      expectTypeOf<Electron.GlobalShortcut>().not.toBeAny();
      expectTypeOf<Electron.GlobalShortcut>().toHaveProperty("register");
      expectTypeOf<Electron.GlobalShortcut>().toHaveProperty("unregister");
      expectTypeOf<Electron.GlobalShortcut>().toHaveProperty("isRegistered");
    });

    it("Screen", () => {
      expectTypeOf<Electron.Screen>().not.toBeAny();
      expectTypeOf<Electron.Screen>().toHaveProperty("getPrimaryDisplay");
      expectTypeOf<Electron.Screen>().toHaveProperty("getAllDisplays");
      expectTypeOf<Electron.Screen>().toHaveProperty("getCursorScreenPoint");
    });

    it("Shell", () => {
      expectTypeOf<Electron.Shell>().not.toBeAny();
      expectTypeOf<Electron.Shell>().toHaveProperty("openExternal");
      expectTypeOf<Electron.Shell>().toHaveProperty("openPath");
      expectTypeOf<Electron.Shell>().toHaveProperty("showItemInFolder");
    });

    it("PowerMonitor", () => {
      expectTypeOf<Electron.PowerMonitor>().not.toBeAny();
      expectTypeOf<Electron.PowerMonitor>().toHaveProperty("on");
      expectTypeOf<Electron.PowerMonitor>().toHaveProperty("getSystemIdleState");
    });

    it("NativeTheme", () => {
      expectTypeOf<Electron.NativeTheme>().not.toBeAny();
      expectTypeOf<Electron.NativeTheme>().toHaveProperty("shouldUseDarkColors");
      expectTypeOf<Electron.NativeTheme>().toHaveProperty("themeSource");
    });
  });

  describe("Networking", () => {
    it("Net", () => {
      expectTypeOf<Electron.Net>().not.toBeAny();
      expectTypeOf<Electron.Net>().toHaveProperty("request");
      expectTypeOf<Electron.Net>().toHaveProperty("fetch");
    });

    it("Protocol", () => {
      expectTypeOf<Electron.Protocol>().not.toBeAny();
      expectTypeOf<Electron.Protocol>().toHaveProperty("registerFileProtocol");
      expectTypeOf<Electron.Protocol>().toHaveProperty("handle");
    });
  });

  describe("Downloads", () => {
    it("DownloadItem", () => {
      expectTypeOf<Electron.DownloadItem>().not.toBeAny();
      expectTypeOf<Electron.DownloadItem>().toHaveProperty("getFilename");
      expectTypeOf<Electron.DownloadItem>().toHaveProperty("getSavePath");
      expectTypeOf<Electron.DownloadItem>().toHaveProperty("cancel");
      expectTypeOf<Electron.DownloadItem>().toHaveProperty("pause");
    });
  });

  describe("Configuration types", () => {
    it("BrowserWindowConstructorOptions", () => {
      expectTypeOf<Electron.BrowserWindowConstructorOptions>().not.toBeAny();
      expectTypeOf<Electron.BrowserWindowConstructorOptions>().toHaveProperty("width");
      expectTypeOf<Electron.BrowserWindowConstructorOptions>().toHaveProperty("height");
      expectTypeOf<Electron.BrowserWindowConstructorOptions>().toHaveProperty("webPreferences");
    });

    it("WebPreferences", () => {
      expectTypeOf<Electron.WebPreferences>().not.toBeAny();
      expectTypeOf<Electron.WebPreferences>().toHaveProperty("nodeIntegration");
      expectTypeOf<Electron.WebPreferences>().toHaveProperty("contextIsolation");
      expectTypeOf<Electron.WebPreferences>().toHaveProperty("preload");
    });
  });

  describe("Process types", () => {
    it("Main process exports", () => {
      expectTypeOf<typeof Electron.Main>().not.toBeAny();
    });

    it("Renderer process exports", () => {
      expectTypeOf<typeof Electron.Renderer>().not.toBeAny();
    });
  });
});
