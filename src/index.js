const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('electron-db');
const bcrypt = require('bcryptjs');
const fs = require('fs')
//modifica fatta da Lu
const saltRounds = 10;
const ipc = ipcMain;
const location = path.join(__dirname, '/databases');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

console.log(location);

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      contextIsolation:false,
      devTools:true,
    //preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();


  db.getAll('user',location,(succ,data)=>{
    let controllo = false
    if(data.length == 0){
      mainWindow.loadFile(__dirname+'/view/register.html')
    } else {
      db.getRows('user',location,{
        check: true
      },(succ,result)=>{
        controllo = result.length > 0;
      })
      if(controllo == false){
        mainWindow.loadFile( __dirname+'/view/login.html')
        mainWindow.once('ready-to-show', () => {
          mainWindow.show()
        })
      } else {
        mainWindow.loadFile( __dirname+'/view/home.html')
        mainWindow.center()
        mainWindow.once('ready-to-show', () => {
          mainWindow.show()
        })
      }
    }
  })

};

// funzione crea il DB per l'utente
function createRouteDB(){
  var dir = location ;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    db.createTable('user', location, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      if (succ) {
        console.log(msg)
      } else {
        console.log('An error has occured. ' + msg);
      }
    })
  } else{
    console.log("La cartella databases è già presente")
  }
}



createRouteDB()

ipc.on('creaUtente',(event,arg)=>{
  console.log("risposta dal main");
  if (db.valid('user',location)) {
    let password = arg.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        arg.password = hash;
        db.insertTableContent('user',location, arg, (succ, msg) => {
          // succ - boolean, tells if the call is successful
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        })
    });
  }
})

ipc.on("tentativoLogin",(event,arg)=>{
  console.log("iniziato tentativo Login");
  if(cercaUtente(arg)){
    event.reply('rispostaTentativo',"Successo")
  } else {
    event.reply('rispostaTentativo',"Errore")
  }
})


function cercaUtente(Utente){
  let risposta = false
  db.getRows('user', location, {
      email: Utente.email
  },(succ, result) => {
  // succ ritorna true se il DB esiste
    if(result.length == 0){  
      console.log("Nessuna corispondenza trovata");  
    } else {
    let checkPSW = bcrypt.compareSync(Utente.password, result[0].password);
      if(checkPSW){
        console.log("Corrispondenza Trovata, password corretta");
        risposta = true;
      } else {
        console.log("Utente trovato, Password errata");
      }
    } 
  })
  return risposta
}













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







/*
TESTO PLANNER LOCAL

function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 800,
    minWidth: 600,
    webPreferences: {
        nodeIntegration:true,
        contextIsolation:false,
        devTools:true,
      //preload: path.join(__dirname, 'preload.js')
    }
  })

  db.getAll('users',location, (succ, data) => {
    let controllo = false
    if(data.length == 0){
      mainWindow.loadFile( __dirname+'/pagine/register.ejs')
    } else {
      db.getRows('users',location, {
      check: true
    }, (succ, result) => {
      controllo = result.length > 0;
    })
      if(controllo == false){
        mainWindow.loadFile( __dirname+'/pagine/login.ejs')
        mainWindow.once('ready-to-show', () => {
        mainWindow.show()
      })
      } else {
        mainWindow.loadFile( __dirname+'/pagine/home.ejs')
        mainWindow.setSize(1500,900)
        mainWindow.center()
        mainWindow.once('ready-to-show', () => {
          mainWindow.show()
        })
      }
    }
  })
  
  ipc.on('login',(event,arg)=>{
    mainWindow.loadFile( __dirname+'/pagine/login.ejs')
        mainWindow.once('ready-to-show', () => {
        mainWindow.show()
  })
})

ipc.on('home',(event,arg)=>{
  mainWindow.loadFile( __dirname+'/pagine/home.ejs')
  mainWindow.setSize(1500,900)
  mainWindow.center()
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

})
  
  ipc.on("tentativoLogin",(event,arg)=>{
    if(cercaUtente(arg)){
      event.reply('rispostaTentativo',"Successo")
      
    } else {
      event.reply('rispostaTentativo',"Errore")
    }
  })

  ipc.on("successoLogin",(event,arg)=>{
        mainWindow.loadFile( __dirname+'/pagine/home.ejs')
        mainWindow.setSize(1500,900)
        mainWindow.center()
        mainWindow.once('ready-to-show', () => {
          mainWindow.show()
        })
  })
}



createRouteDB()
createRouteDBappuntamenti()

ipc.on('creaUtente',(event,arg)=>{
    if (db.valid('users',location)) {

       let password = arg.password;
       bcrypt.hash(password, saltRounds, function(err, hash) {
           arg.password = hash;
        db.insertTableContent('users',location, arg, (succ, msg) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log("Message: " + msg);
          })
    });
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})


function createRouteDB(){
  var dir = location ;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    db.createTable('users', location, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      if (succ) {
        console.log(msg)
      } else {
        console.log('An error has occured. ' + msg);
      }
    })
  }
}

function createRouteDBappuntamenti(){
  var fs = require('fs');
  var dir = location ;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    db.createTable('appuntamenti', location, (succ, msg) => {
      // succ - boolean, tells if the call is successful
    if (succ) {
      console.log(msg)
    } else {
      console.log('An error has occured. ' + msg);
    }
  })
}else{
  db.createTable('appuntamenti', location, (succ, msg) => {
    // succ - boolean, tells if the call is successful
  if (succ) {
    console.log(msg)
  } else {
    console.log('An error has occured. ' + msg);
  }
})
}

}

//Appuntamenti

ipc.on("inserisciAppuntamento", (event,arg)=>{
  if (db.valid('appuntamenti',location)) {
     db.insertTableContent('appuntamenti',location, arg, (succ, msg) => {
         // succ - boolean, tells if the call is successful
         console.log("Success: " + succ);
         console.log("Message: " + msg);
       })
 };
})

function cercaUtente(nomeUtente){
  let risposta = false
  db.getRows('users', location, {
      name: nomeUtente.name
  },(succ, result) => {
  // succ ritorna true se il DB esiste
    if(result.length == 0){  
      console.log("Nessuna corispondenza trovata");  
    } else {
    let checkPSW = bcrypt.compareSync(nomeUtente.password, result[0].password);
      if(checkPSW){
        let set = {check : nomeUtente.check}
        let where = {name : nomeUtente.name}
        db.updateRow('users', location, where, set, (succ, msg) => {
        });
        console.log("Corrispondenza Trovata, password corretta");
        risposta = true;
      } else {
        console.log("Utente trovato, Password errata");
      }
    } 
  })
  return risposta
}




*/