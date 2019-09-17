import React, {Component} from 'react';

const path = require('path');
const electron = window.electron;
const {app,BrowserWindow} = electron.remote;

class Copyright extends Component {

    updateVersion() {
        let win = new BrowserWindow({
            width: 300,
            height: 400,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, './public/renderer.js')
            },
            // frame: false,
            // parent: electron.remote.getCurrentWindow(),
            // modal: true
        });

        win.on('close', function () {
            win = null
        });
        if (app.isPackaged) {
            win.loadURL(`file://${__dirname}/build/update.html`);
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