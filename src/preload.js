// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


const {
    contextBridge,
    ipcRenderer
} = require("electron");


// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
          // whitelist channels
            let validChannels = ["toMain", "loadFile", "sTRX"];
            if (validChannels.includes(channel)) {

                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, data) => {
            let validChannels = ["fromMain", "returnFile"];
            if (validChannels.includes(channel)) {
                return ipcRenderer.on(channel, data);
            }
        },
        sendSync: (channel, data) => {
            let validChannels = ["loadFile", "getTimestep"];
            if (validChannels.includes(channel)) {
                return ipcRenderer.sendSync(channel, data);
            }

        },

        invoke: (channel, data) => {
            let validChannels = ["getTimestep"];
            if (validChannels.includes(channel)) {

                return ipcRenderer.invoke(channel, data);

                //ipcRenderer.invoke(channel, data).then((result) => {
                //    console.log("invocation result")
                //    var _result = result
                //    console.log(_result);
                //    return _result;
                //})
            }
        }
    }
);