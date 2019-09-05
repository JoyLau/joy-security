const path = require('path');

const {app, BrowserWindow, Menu,ipcMain} = require('electron');

let win;

const gotTheLock = app.requestSingleInstanceLock();

const PROTOCOL = 'joy-security';

const args = [];


let windowConfig = {
    width: 800,
    height: 600,
    title: "Joy Security",
    webPreferences: {
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
    if (!app.isPackaged) {
        args.push(path.resolve(process.argv[1]));
    }
    args.push('--');

    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, []);

    handleArgv(process.argv);



    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
            win.show()
        }

        if (process.platform === 'win32') {
            // Windows
            handleArgv(commandLine);
        }
    });

    // macOS
    app.on('open-url', (event, urlStr) => {
        handleUrl(urlStr);
        win.webContents.send('ch-1', 'nihao');
        ipcMain.on('ch-2',function (event, args) {
            console.info('收到渲染进程发送的消息',args)
        })
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

    // console.info(require('os').networkInterfaces());
    win = new BrowserWindow(windowConfig);
    // win.loadURL(`file://${__dirname}/index.html`);
    win.loadURL('http://localhost:3000');
    //开启调试工具
    win.webContents.openDevTools();
    win.on('close', () => {
        //回收BrowserWindow对象
        win = null;
    });
    win.on('resize', () => {
        // win.reload();
    })
}

function handleArgv(argv) {
    console.info('argv:',argv)
}

function handleUrl(urlStr) {
    console.info('urlStr',urlStr)
}
