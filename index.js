const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { apiCaller } = require("./apiCaller");
const { getMinutes } = require("./getTime");
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

let person = {};
// let person = { msg_id: null, chat_name: null, latitude: null, longitude: null };
let nearest_location = { maxLatitude: null, minLatitude: null, maxLongitude: null, minLongitude: null };

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
  busArrival(resp).then((res) => {
    var text = "";
    if (res.length == 0) {
      text = "No Bus Available Sorry";
    } else {
      for (i = 0; i < res.length; i++) {
        text += "Service No: " + res[i].ServiceNo + " is " + getMinutes(res[i].NextBus.EstimatedArrival) + "\n\n";
      }
    }
    bot.sendMessage(chatId, text);
  });
});

bot.onText(/\/(geolocation)/, (msg) => {
  if (msg.chat.type === "private") {
    const opts = {
      reply_markup: JSON.stringify({
	keyboard: [[{ text: "Send Location 📍", request_location: true }]],
	resize_keyboard: true,
	one_time_keyboard: true,
      }),
    };
    if (!person[msg.chat.id]) {
      bot.sendMessage(msg.chat.id, "Where are you?", opts);
    }
  } else {
    bot.sendMessage(msg.chat.id, "This function only works in private messages.");
  }
});

bot.on("location", (msg) => {
  person[msg.chat.id] = { latitude: msg.location.latitude, longitude: msg.location.longitude };
  nearest_location = {
    maxLatitude: person[msg.chat.id].latitude + 0.005,
    minLatitude: person[msg.chat.id].longitude + 0.005,
    maxLongitude: person[msg.chat.id].latitude + 0.005,
    minLongitude: person[msg.chat.id].longitude + 0.005,
  };
});
