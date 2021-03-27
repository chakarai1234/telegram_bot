const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { apiCaller } = require("./apiCaller");
const { getMinutes } = require("./getTime");
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

let person_location = { latitude: null, longitude: null };

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp = "Welcome to the Bus Tracer Bot\n\nI want to know your location so use /geolocation to give your location to me. Keep in mind this one you press one hor";
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/(.+[0-9])/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  apiCaller(resp).then((res) => {
    var text = "";
    if (res.length == 0) {
      text = "No Bus Available Sorry";
    } else {
      for (i = 0; i < res.length; i++) {
        text += "Service No: " + res[i].ServiceNo + " is " + getMinutes(res[i].NextBus.EstimatedArrival) + " Minutes away " + "\n";
      }
    }
    bot.sendMessage(chatId, text);
  });
});

bot.onText(/\/(geolocation)/, (msg) => {
  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: "Send Location 📍", request_location: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  };
  bot.sendMessage(msg.chat.id, "Where are you?", opts);
});

bot.on("location", (msg) => {
  person_location = { latitude: msg.location.latitude, longitude: msg.location.longitude };
  console.log(person_location);
});
