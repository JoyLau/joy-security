const path = require('path');

const {app, BrowserWindow, Menu} = require('electron');

let win;

const gotTheLock = app.requestSingleInstanceLock();

const PROTOCOL = 'joy-security';

const args = [];


let windowConfig = {
    width: 800,
    height: 600,
    title: "Joy Security"
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
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

    console.info(require('os').networkInterfaces());
    win = new BrowserWindow(windowConfig);
    // win.loadURL(`file://${__dirname}/index.html`);
    win.loadURL('http://localhost:3000');
    //开启调试工具
    // win.webContents.openDevTools();
    win.on('close', () => {
        //回收BrowserWindow对象
        win = null;
    });
    win.on('resize', () => {
        win.reload();
    })
}

function handleArgv(argv) {
    console.info(argv)
    const prefix = `${PROTOCOL}:`;
    const offset = app.isPackaged ? 1 : 2;
    const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix));
    if (url) handleUrl(url);
}

function handleUrl(urlStr) {
    console.info(urlStr)
    // myapp:?a=1&b=2
    const urlObj = new URL(urlStr);
    console.info(urlObj);
    const { searchParams } = urlObj;
    console.log(urlObj.query); // -> a=1&b=2
    console.log(searchParams.get('a')); // -> 1
    console.log(searchParams.get('b')); // -> 2
}
