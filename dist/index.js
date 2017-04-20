"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
let options = require('../voyager');
const path = require("path");
let win = null;
let plugins = new Map();
let tlds = [];
for (let plugin of options.plugins) {
    let plug = require(plugin);
    console.log(typeof plug);
    plugins.set(plugin, plug(electron));
}
function createWindow() {
    win = new electron.BrowserWindow({ width: 800, height: 900 });
    win.loadURL(`file://${path.resolve(__dirname, '../voyager-frontend/index.html')}`);
    win.on("closed", () => {
        win = null;
    });
}
electron.ipcMain.on('voyagerOpen', (evt) => {
    sendPluginInfo(evt.sender);
});
electron.ipcMain.on('voyagerPluginDir', (evt, plugin, dir) => __awaiter(this, void 0, void 0, function* () {
    let plug = plugins.get(plugin);
    evt.sender.send('pluginDir', plugin, dir, yield plug.getDirContents(dir));
}));
electron.ipcMain.on('voyagerPluginFile', (evt, plugin, path) => __awaiter(this, void 0, void 0, function* () {
    let plug = plugins.get(plugin);
    plug.openFile(path);
}));
function sendPluginInfo(chan) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let [pluginName, plugin] of plugins) {
            let tlds = yield plugin.getTLDs();
            chan.send('pluginInfo', pluginName, plugin, yield plugin.getTLDs());
        }
    });
}
electron.app.on("ready", createWindow);
electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron.app.quit();
    }
});
electron.app.on("activate", () => {
    if (win === null)
        createWindow();
});
