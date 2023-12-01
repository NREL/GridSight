
const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        receive: (channel, listener) => {
            console.log("recieving selected TRX")
            let validChannels = ['selectedTRX']
            if (validChannels.includes(channel)){
                ipcRenderer.on(channel, (event, ...args) => listener(...args));
            }

        }
    }
);