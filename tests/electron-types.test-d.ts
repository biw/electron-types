import { expectTypeOf } from "expect-type";
import { describe, it } from "vitest";

/// <reference path="../dist/electron.d.ts" />

describe("Electron types", () => {
  describe("Core classes exist and are not any", () => {
    it("BrowserWindow", () => {
      expectTypeOf<Electron.BrowserWindow>().not.toBeAny();
      expectTypeOf<Electron.BrowserWindow>().toHaveProperty("show");
      expectTypeOf<Electron.BrowserWindow>().toHaveProperty("loadURL");
      expectTypeOf<Electron.BrowserWindow>().toHaveProperty("close");
    });

    it("App", () => {
      expectTypeOf<Electron.App>().not.toBeAny();
      expectTypeOf<Electron.App>().toHaveProperty("getName");
      expectTypeOf<Electron.App>().toHaveProperty("quit");
      expectTypeOf<Electron.App>().toHaveProperty("on");
    });

    it("WebContents", () => {
      expectTypeOf<Electron.WebContents>().not.toBeAny();
      expectTypeOf<Electron.WebContents>().toHaveProperty("send");
    });
  });

  describe("IPC types", () => {
    it("IpcMain", () => {
      expectTypeOf<Electron.IpcMain>().not.toBeAny();
      expectTypeOf<Electron.IpcMain>().toHaveProperty("on");
      expectTypeOf<Electron.IpcMain>().toHaveProperty("handle");
    });

    it("IpcRenderer", () => {
      expectTypeOf<Electron.IpcRenderer>().not.toBeAny();
      expectTypeOf<Electron.IpcRenderer>().toHaveProperty("send");
      expectTypeOf<Electron.IpcRenderer>().toHaveProperty("invoke");
    });
  });

  describe("UI types", () => {
    it("Menu", () => {
      expectTypeOf<Electron.Menu>().not.toBeAny();
    });

    it("MenuItem", () => {
      expectTypeOf<Electron.MenuItem>().not.toBeAny();
    });

    it("Dialog", () => {
      expectTypeOf<Electron.Dialog>().not.toBeAny();
      expectTypeOf<Electron.Dialog>().toHaveProperty("showOpenDialog");
    });
  });

  describe("Configuration types", () => {
    it("BrowserWindowConstructorOptions", () => {
      expectTypeOf<Electron.BrowserWindowConstructorOptions>().not.toBeAny();
      expectTypeOf<Electron.BrowserWindowConstructorOptions>().toHaveProperty("width");
      expectTypeOf<Electron.BrowserWindowConstructorOptions>().toHaveProperty("height");
    });

    it("WebPreferences", () => {
      expectTypeOf<Electron.WebPreferences>().not.toBeAny();
      expectTypeOf<Electron.WebPreferences>().toHaveProperty("nodeIntegration");
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
