const electron = require('electron');
const {app,ipcMain} = electron;
const update = require('./update');

const listener = {
    init: function() {
        ipcMain.on('check-update', (event, arg) => {
            update.init();
        });
    }
};

module.exports = listener;