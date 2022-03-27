//Validaione

    //Validazione della email
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isEmail = re.test(email);
        console.log(isEmail);
        if(email.value == ""){
            return 2;
        } else if(isEmail == false) {
            return 3;
        }
        return 0
    }

    //Validazione della password
    function validaPassword(password,password2){
        if(password == ""){
            return  4
        }else if(password.length < 8){
            return  5
        }else if(password.length > 20){
            return  6
        }else if(password != password2){
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
        let usernameValidationResult = validaUsername(user.username);
        let emailValidationResult = validaEmail(user.email);
        let passwordValidationResult = validaPassword(user.password,user.password2);
        if(usernameValidationResult + emailValidationResult +passwordValidationResult){
            showError(passwordValidationResult)
            showError(emailValidationResult)
            showError(usernameValidationResult)
            return false
        }
        return true
    }