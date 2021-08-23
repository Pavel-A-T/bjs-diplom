"use strict";

let logoutButton = new LogoutButton();
let rateBoard = new RatesBoard();
let moneyManager = new MoneyManager();
let favoritesWidget = new FavoritesWidget();

function show(response, message) {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(true, message);
    } else {
        moneyManager.setMessage(false, `Произошла ошибка ${response.error}`);
    }
}

//Профиль текущего пользователя
let current = ApiConnector.current((response) => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
    } else {
        console.error('Ошибка вывода профиля');
    }
});

//Разлогинивание
logoutButton.action = (data) => {
    ApiConnector.logout(data, (response) => {
        if (response.success === true) {
            location.reload();
        } else {
            console.error(`${response.error}`);
        }
    });
};

//Получение курсов валют и построение таблицы
function getCurrencyRate() {
    ApiConnector.getStocks((response) => {
        if (response.success === true) {
            rateBoard.clearTable();
            rateBoard.fillTable(response.data);
        } else {
            console.error("Ошибка получения курсов валют");
        }
    });
}

getCurrencyRate();

setInterval(getCurrencyRate(), 60000);

moneyManager.addMoneyCallback = ((data) => {
    ApiConnector.addMoney(data, (response) => {
        show(response, 'Деньги пришли!!!');
    });
});

moneyManager.conversionMoneyCallback = ((data) => {
    ApiConnector.convertMoney(data, (response) => {
        show(response, 'Обмен произведён.');
    });
});

moneyManager.sendMoneyCallback = ((data) => {
    ApiConnector.transferMoney(data, (response) => {
        show(response, 'Деньги переведены.');
    });
});

//Заполнить список избранного
ApiConnector.getFavorites((response) => {
    if (response.success === true) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = ((data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь был успешно добавлен.');
        } else {
            favoritesWidget.setMessage(false, `Произошла ошибка ${response.error}`);
        }
    });
});

favoritesWidget.removeUserCallback = ((data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success === true) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь был успешно удалён.');
        } else {
            favoritesWidget.setMessage(false, `Произошла ошибка ${response.error}`);
        }
    });
});
