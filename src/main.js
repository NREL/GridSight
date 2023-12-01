const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
// const { time } = require('console');
const {timeSeriesLoader} = require('./DataManagement/dataManager.js');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let childWindow;
let df;
let gen_df;
let curt_df;

const pq_filepath = path.resolve( __dirname, 'layers/power_flow_actual.parquet' )
const gen_filepath = path.resolve( __dirname, 'layers/generators.parquet' )
const curt_filepath = path.resolve( __dirname, 'layers/curtailment.parquet' )

const createWindow = () => {
  // Create the browser window.

  //load dataframe
  console.log("loading frame")
  df = new timeSeriesLoader(pq_filepath);
  gen_df = new timeSeriesLoader(gen_filepath);
  curt_df = new timeSeriesLoader(curt_filepath);
  console.log("done loading frame")

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '/icons/favicon.ico'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  childWindow = new BrowserWindow({
    parent: mainWindow,
    width: 800,
    height: 600,
    icon: path.join(__dirname, '/icons/favicon.ico'),
    webPreferences: {
      preload: CHILD_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });



  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  childWindow.loadURL(CHILD_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};






// IPC comms
ipcMain.on("toMain", (event, args) => {
  console.log("entering test comms channel")

  //console.log(event, args)
  console.log(args)
  //win.webContents.send("fromMain", "Message from Main");

});



// From MAP window to Plotly Window
ipcMain.on("sTRX", (event, args) => {

  console.log("entering Selected TRX channel");
  // recieve selected transmission IDs


  var data = df.colToJSON(args)
  // query the dataframe for data

  // send data to plotly window // data instead of args

  childWindow.webContents.send('selectedTRX', data)

});

// get timestep
ipcMain.handle("getTimestep",  (event, timesteps) => {

    var result = {
      'line': df.rowToJSON(timesteps) ,
      'generator': gen_df.rowToJSON(timesteps),
      'curtailment': curt_df.rowToJSON(timesteps)
    }
    return result

})


ipcMain.on("loadFile", (event, filename) => {

  const filepath = path.resolve( __dirname, `layers/${filename}` )

  console.log(filepath)

  function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', (err, data) => {

       if(err){
          //alert("An error ocurred reading the file :" + err.message)
          console.log(`error loading data ${err.message}`)
          return
       }
       console.log("returning data, no error")


       //event.sender.send('returnFile', data)
       event.returnValue = data
       // handle the file content
      //     return data
  })
  }

  readFile(filepath)

});





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);





// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

