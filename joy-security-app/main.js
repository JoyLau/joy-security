const path = require('path');
const os = require('os');
const appConfig =  require('./config');
const {app, BrowserWindow, Menu, ipcMain, dialog, autoUpdater} = require('electron');
const electronLocalshortcut = require('electron-localshortcut');

let win;

const gotTheLock = app.requestSingleInstanceLock();

const PROTOCOL = appConfig.PROTOCOL;

// 共享对象
global.shareObject = {
    osInfo: os,
    path: `${__dirname}`
};

let windowConfig = {
    width: 800,
    height: 600,
    title: "Joy Security",
    webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './public/renderer.js')
    }
};

let menuTemplate = [{
    label: 'Joy Security',
    submenu: [{
        label: '退出',
        role: 'quit'
    }, {
        label: `关于 ${windowConfig.title}`,
        role: 'about'
    }]
}];


if (!gotTheLock) {
    app.quit()
} else {
    // 添加 arg 参数为当前目录只为对 Windows 环境下生效
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [`${__dirname}`]);

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,主动对焦
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
            win.show();

            let message = handleArgv(commandLine);
            processSend(message);
        }
    });

    // macOS
    app.on('open-url', (event, urlStr) => {
        if (win) {
            win.showInactive();
            let message = handleArgv(urlStr);
            processSend(message);
        } else {
            global.shareObject.message = handleArgv(urlStr);
            global.shareObject.isSend = true;
        }

    });

    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        app.quit();
    });

    app.on('activate', () => {
        if (win == null) {
            createWindow();
        }
    });
}


function createWindow() {
    // 隐藏菜单栏,兼容 MAC
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));

    win = new BrowserWindow(windowConfig);

    if (app.isPackaged) {
        win.loadURL(`file://${__dirname}/build/index.html`);
    } else {
        win.loadURL('http://localhost:3000');
    }

    win.on('close', () => {
        //回收BrowserWindow对象
        win = null;
    });

    win.on('resize', () => {
        // win.reload();
    });

    // 注册快捷键
    electronLocalshortcut.register(win, 'F12', function () {
        win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools();
    });

    electronLocalshortcut.register(win, 'F5', function () {
        win.reload();
    });

    // Windows 下最后一项会包含参数
    let argv = process.argv;
    if (argv[argv.length - 1].indexOf(PROTOCOL + "://") > -1) {
        global.shareObject.message = handleArgv(argv);
        global.shareObject.isSend = true;
    }

}

function processSend(message) {
    global.shareObject.message = message;
    win.webContents.send('ch-1', 'send');
}

function handleArgv(argv) {
    let urlObj = [];
    if (Array.isArray(argv)) {
        urlObj = argv[argv.length - 1].replace(PROTOCOL + "://", "").split("_");
    } else {
        urlObj = argv.replace(PROTOCOL + "://", "").split("_");
    }
    return urlObj.length >= 2 ? {sessionId: urlObj[0], url: urlObj[1], macInfo: os.networkInterfaces()} : {};
}