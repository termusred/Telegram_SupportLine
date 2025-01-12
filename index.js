import TelegramBot from "node-telegram-bot-api";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();

const requiredVars = ['TOKEN', 'PORT'];
requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});


import {
    BACK, 
    CONNECT,
    DELIVERY,
    FINANCE,
    PRODUCT_CONSULT,
    QUALITY,
    SMM,
    SOLVED_PROBLEMS,
    START,
    WEBSITE,
    WEB_ERROR
} from "./constants/commands.js";
import { 
    MAIN ,
    OPERATOR ,
    TALKING ,
    WEB ,
    SOLVED
} from "./constants/menuOptions.js";
import { 
    operator_response,
    web_response,
    solved_response,
    buttons_reminder,
    greeting,
    finance_response,
    operatorPendingText
} from "./constants/response.js";

const token = process.env.TOKEN;

const bot = new TelegramBot(token , {polling : true});
const app = express();

let menu;
let waitingForUserInput = false;

const deafult_keyboard = [
    [{text : CONNECT}],
    [{text : WEBSITE} , {text : SOLVED_PROBLEMS}]
];
const operator_keyboard = [
    [{text : FINANCE}, {text : PRODUCT_CONSULT}],
    [{text : DELIVERY} , {text : QUALITY}],
    [{text : BACK}]
];
const web_keyboard = [
    [{text : WEB_ERROR}, {text : SMM}],
    [{text : BACK}]
];
const solved_keyboard = [
    [{text : "PLACEHOLDER"}, {text : "PLACEHOLDER"}],
    [{text : BACK}]
];
const talking_keyboard = [
    [{text : "Muammoyimga yechim topdim"}],
    [{text : BACK}]
];
const main_markup = {
    reply_markup:{
        keyboard: deafult_keyboard,
    }
};
const operator_markup = {
    reply_markup:{
        keyboard: operator_keyboard,
    }
};
const web_markup = {
    reply_markup:{
        keyboard: web_keyboard,
    }
};
const solved_markup = {
    reply_markup:{
        keyboard: solved_keyboard,
    }
};
const talking_markup = {
    reply_markup:{
        keyboard: talking_keyboard,
    }
};

bot.on("message" , (msg) => {
    if (waitingForUserInput) {
        bot.sendMessage(msg.chat.id, operatorPendingText);
        waitingForUserInput = false; 
        return;
    }

    if(msg.text === START) {
        menu = MAIN;
        bot.sendMessage(msg.chat.id, greeting);
        bot.sendMessage(msg.chat.id , buttons_reminder ,main_markup);
    }
    if(msg.text === BACK && !waitingForUserInput){
        if(menu == OPERATOR){
            menu = MAIN;
            bot.sendMessage(msg.chat.id , buttons_reminder ,main_markup);
        }
        if(menu == WEB){
            menu = MAIN;
            bot.sendMessage(msg.chat.id , buttons_reminder ,main_markup);
        }
        if(menu == SOLVED){
            menu = MAIN;
            bot.sendMessage(msg.chat.id , buttons_reminder ,main_markup);
        }
    }
    //operator
    if(msg.text === CONNECT && menu == MAIN){
        menu = OPERATOR;
        bot.sendMessage(msg.chat.id, operator_response);
        bot.sendMessage(msg.chat.id, buttons_reminder ,operator_markup);
    }
    if(msg.text === FINANCE && menu == OPERATOR){
        menu = TALKING;
        bot.sendMessage(msg.chat.id, finance_response , talking_markup);
        waitingForUserInput = true;
    }

    //website
    if(msg.text === WEB && menu == MAIN){
        menu = WEB;
        bot.sendMessage(msg.chat.id,web_response);
        bot.sendMessage(msg.chat.id, buttons_reminder ,web_markup);
    }

    //solved
    if(msg.text === SOLVED_PROBLEMS && menu == MAIN){
        menu = SOLVED;
        bot.sendMessage(msg.chat.id, solved_response);
        bot.sendMessage(msg.chat.id, buttons_reminder ,solved_markup);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});
