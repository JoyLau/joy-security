import React, {Component} from 'react';

const electron = window.electron;
const {app, BrowserWindow} = electron.remote;

class Copyright extends Component {

    updateVersion() {
        const path = electron.remote.getGlobal('shareObject').path;
        let win = new BrowserWindow({
            width: 350,
            height: 400,
            webPreferences: {
                nodeIntegration: true,
                preload: path + '/public/renderer.js'
            },
            frame: false,
            parent: electron.remote.getCurrentWindow(),
            modal: true,
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            closable: false
        });

        win.on('close', function () {
            win = null
        });
        if (app.isPackaged) {
            win.loadURL('file://' + path + '/build/update.html');
        } else {
            win.loadURL('http://localhost:3000/update.html');
        }
    }


    render() {
        return (
            <div style={{margin: '10px 0px', textAlign: 'center', fontWeight: 'lighter'}}><a
                onClick={() => this.updateVersion()}>Made with ❤ by JoyLau ❤</a></div>
        )
    }
}

export default Copyright;