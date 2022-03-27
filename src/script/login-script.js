const { ipcRenderer } = require('electron');
const ipc = ipcRenderer

function validaEmail(email){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isEmail = re.test(email);
    if( email != "" && isEmail){
        return true
    }
    return false
}

function validaPassword(password){
    if(password != ""){
        return true
    }
    return false
}

function validaInput(email,password){
    if(validaEmail(email)&& validaPassword(password)){
        return true
    }
    return false
}

document.getElementById('submit').addEventListener('click', (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    if(validaInput(email,password)){
        let utente = new Object()
        utente.password = password;
        utente.email = email
        ipc.send("tentativoLogin",utente)
        ipc.on('rispostaTentativo',(event, arg) => {
            if(arg == "Successo"){
              console.log("successo");
            } else {
              console.log("errore");
            }
          })
    }
})