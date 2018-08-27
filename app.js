const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN || require('./credentials/token');

// sample data
const ingridientsArray = require('./ingridients.json');

const usersData = {}; // Object as DB in order to handle few different users' requests at same time

function getAvailableIngridients(amount) {
    let newArr = [...ingridientsArray];
    let result = new Array(amount);
    while (amount--) {
        let length = newArr.length;
        const x = Math.floor(Math.random() * length);
        result[amount] = newArr.splice(x, 1)[0];
    }
    return result;
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Hello, ${msg.from.first_name}!`);
});

bot.onText(/(.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    // generate max amount of available items to get together in one cup
    usersData[chatId] = {maxItems: Math.floor(Math.random() * (10 - 6 + 1)) + 6 };

    // generate array of random items to prepare smoothie from
    const ingridients = getAvailableIngridients(Math.floor(Math.random() * (6 - 3 + 1)) + 3);

    console.log(JSON.stringify(ingridients));

    const codeToRun = match[1];

    bot.sendMessage(chatId, dummyFunction(ingridients, codeToRun));
});

function dummyFunction(array, codeString) {
    // TODO: improve logic to interact with user
    let fn = new Function("array", codeString);
    return fn(array);
}