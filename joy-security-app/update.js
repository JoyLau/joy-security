const electron = require('electron').app ? require('electron') : window.electron.remote;
const {app, BrowserWindow} = electron;
const electronLocalshortcut = require('electron-localshortcut') || window.electronLocalshortcut;

const update = {
    init: function() {
        let win = new BrowserWindow({
            width: 350,
            height: 550,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                preload: `${__dirname}/public/renderer.js`
            },
            frame: false,
            // titleBarStyle: 'hidden',
            alwaysOnTop: true,
            // parent: electron.remote.getCurrentWindow(),
            // modal: true,
            resizable: false,
            // movable: false,
            minimizable: false,
            maximizable: false,
        });

        win.on('close', function () {
            win = null
        });
        if (app.isPackaged) {
            win.loadURL(`file://${__dirname}/build/update.html`);
        } else {
            win.loadURL('http://localhost:3000/update.html');
        }

        // 注册快捷键
        electronLocalshortcut.register(win, 'F12', function () {
            win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools();
        });
    }
};

module.exports = update;