const { ipcRenderer } = require('electron');
const ipc = ipcRenderer

//Variabili per la regestrazione dell'user

let userInput = new Object();
const modal= document.getElementById('exampleModalToggle')



//click mostra la password
  function mostra() {
    let password1 = document.getElementById("Password1")
    let password2 = document.getElementById("Password2")
    if (password1.type === "password") {
      password1.type = "text";
      password2.type = "text";
    } else {
      password1.type = "password";
      password2.type = "password";
    }
  }

 //Validaione

    //Validazione della email
    function validaEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let isEmail = re.test(email);
      

      if(email == ""){
          return 2;
      }
      if(isEmail == false) {
          return 3;
      }
      return 0
  }

  //Validazione della password
  function validaPassword(password,password2){
      if(password == ""){
          return  4
      }
      if(password.length < 8){
          return  5
      }
      if(password.length > 20){
          return  6
      }
      if(password != password2){
          return  7
      }
      return 0
  }

  //Validazione username
  function validaUsername(username){
      if(username == ""){
        return 1
      }
      return 0
  }

  //Mostra i vari tipi di errore
  function showError(A){
      switch(A){
          case 1:
              document.getElementById("avviso_text_nome").innerHTML = "Il nome utente non può essere vuoto";
              visibile("avvisoNome")
          break;
          case 2:
              document.getElementById("avviso_text_email").innerHTML = "La email non può essere vuota";
              visibile("avvisoEmail")
          break;
          case 3:
              document.getElementById("avviso_text_email").innerHTML = "La email non è valida";
              visibile("avvisoEmail")
          break;
          case 4:
              document.getElementById("avviso_text_password").innerHTML = "La password non può essere vuota";
              visibile("avvisoPassword")
          break;
          case 5:
              document.getElementById("avviso_text_password").innerHTML = "Password troppo corta, deve essere più di 8 caratteri";
              visibile("avvisoPassword")
          break;
          case 6:
              document.getElementById("avviso_text_password").innerHTML = "Password troppo lunga, deve essere meno di 20 caratteri";
              visibile("avvisoPassword")
          break;
          case 7:
              document.getElementById("avviso_text_password").innerHTML = "Le password inserite non coincidono";
              visibile("avvisoPassword")
          break;
      }
  }






  //Funzione di validazione completa
  function validateForm(user) {
    let password2 = document.getElementById('Password2').value.trim();
      let usernameValidationResult = validaUsername(user.username);
      let emailValidationResult = validaEmail(user.email);
      let passwordValidationResult = validaPassword(user.password,password2);
      if(usernameValidationResult == 0){
        invisibile("avvisoNome")
      }
      if(passwordValidationResult == 0){
       invisibile("avvisoPassword")
     }
     if(emailValidationResult == 0){
       invisibile("avvisoEmail")
     }
      if(usernameValidationResult + emailValidationResult +passwordValidationResult){
          console.log("userName error value "+usernameValidationResult);
          console.log("email error value "+emailValidationResult);
          console.log("password error value "+passwordValidationResult);
          showError(passwordValidationResult)
          showError(emailValidationResult)
          showError(usernameValidationResult)
        return false
      }
      
     
      return true
  }


  //Funzione invio al main per registrazione
  
  document.getElementById('submit').addEventListener('click', (event) => {
    event.preventDefault()
    userInput.username = document.getElementById('username').value.trim();
    userInput.password = document.getElementById('Password1').value.trim();
    userInput.email= document.getElementById('Email1').value.trim();
      console.log("Chiamata la funzione dal submit");
      if(validateForm(userInput)){
        ipc.send("creaUtente",userInput);
        apri()
      }
  })

  //Funzione che apre il modale con il messaggio di successo
  function apri() {
    $('#exampleModalToggle').modal('show');
    chiudi()
  };

  //Funzione che serve a chiudere il modale automaticamente
  function chiudi() {
    setTimeout(function() {
      $('#exampleModalToggle').modal('hide');
    }, 5000);
  };

  //Funzione che invia il comando al main per passara alla schermata di home 
  modal.addEventListener('hidden.bs.modal', function (event) {
    ipc.send("home");
  })

//Helpers
  function visibile(tag){
    document.getElementById(tag).classList.remove("avviso")
    document.getElementById(tag).classList.add("avvisoAttivo")
  }
  function invisibile(tag){
    document.getElementById(tag).classList.remove("avvisoAttivo")
    document.getElementById(tag).classList.add("avviso")
  }

  