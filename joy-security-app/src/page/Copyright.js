import React, {Component} from 'react';

const electron = window.electron;
const electronLocalshortcut = window.electronLocalshortcut;
const {app, BrowserWindow} = electron.remote;

class Copyright extends Component {

    updateVersion() {
        const path = electron.remote.getGlobal('shareObject').path;
        let win = new BrowserWindow({
            width: 350,
            height: 420,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                preload: path + '/public/renderer.js'
            },
            // frame: false,
            titleBarStyle: 'hidden',
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
            win.loadURL('file://' + path + '/build/update.html');
        } else {
            win.loadURL('http://localhost:3000/update.html');
        }

        // 注册快捷键
        electronLocalshortcut.register(win, 'F12', function () {
            win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools();
        });

    }


    render() {
        return (
            <div style={{margin: '10px 0px', textAlign: 'center', fontWeight: 'lighter'}}><a
                onClick={() => this.updateVersion()}>Made with ❤ by JoyLau ❤</a></div>
        )
    }
}

export default Copyright;