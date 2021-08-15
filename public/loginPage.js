"use strict";

let userForm = new UserForm();


userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response)=>{
        if (response.sucsess === true) {
            location.reload();
        }
        else {
            console.error(`Произошла ошибка: ${response.error}`);
        }
    });
};

userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
       if (response.success === true) {
           userForm.id = response.id;
           location.reload();
       }
       else {
           console.error(`Произошла ошибка регистрации пользователя ${data.login}: ${response.error}`);
       }
    });
}

