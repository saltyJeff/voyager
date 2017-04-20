import * as electron from 'electron';
import {TLD, VoyagerPlugin} from './Plugin';
let options: Options = require('../voyager');
import * as path from 'path';
import * as fs from 'fs';

let win = null;
let plugins: Map<string, VoyagerPlugin> = new Map<string, VoyagerPlugin>();
let tlds: TLD[] = [];
for(let plugin of options.plugins) {
    let plug = require(plugin);
    console.log(typeof plug);
    plugins.set(plugin, plug(electron));
}
function createWindow () {
    win = new electron.BrowserWindow({width:800, height: 900});
    win.loadURL(`file://${path.resolve(__dirname, '../voyager-frontend/index.html')}`);
    win.on("closed", () => {
        win = null;
    });
}
electron.ipcMain.on('voyagerOpen', (evt) => {
    sendPluginInfo(evt.sender);
});
electron.ipcMain.on('voyagerPluginDir', async (evt, plugin: string, dir: string) => {
    let plug = plugins.get(plugin);
    evt.sender.send('pluginDir', plugin, dir, await plug.getDirContents(dir));
});
electron.ipcMain.on('voyagerPluginFile', async (evt, plugin, path) => {
    let plug = plugins.get(plugin);
    plug.openFile(path);
});
async function sendPluginInfo (chan) {
    for(let [pluginName, plugin] of plugins) {
        let tlds = await plugin.getTLDs();
        chan.send('pluginInfo', pluginName, plugin, await plugin.getTLDs());
    }
}
electron.app.on("ready", createWindow);
electron.app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        electron.app.quit();
    }
});
 
electron.app.on("activate", () => {
    if(win === null) createWindow();
});
interface Options {
    plugins: string[];
}