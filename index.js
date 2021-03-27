const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { busArrival } = require("./apiCaller");
const { getMinutes } = require("./getTime");
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

let person_location = {};
let person_message = {};
let nearest_location = {
  maxLatitude: null,
  minLatitude: null,
  maxLongitude: null,
  minLongitude: null,
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp =
    "Welcome to the Bus Tracer Bot\n\nI want to know your location so use\n\n /geolocation to give your location to me. Keep in mind this one you press one hor";
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/(.+[0-9])/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  person_message[msg.chat.id] = { busstop: resp };
  console.log(person_message);
  busArrival(resp).then((res) => {
    var text = "";
    if (res.length == 0) {
      text = "No Bus Available Sorry";
    } else {
      for (i = 0; i < res.length; i++) {
        text +=
          "Service No: " + res[i].ServiceNo + getMinutes(res[i].NextBus.EstimatedArrival) + "\n\n";
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
  if (!person[msg.chat.id]) {
    bot.sendMessage(msg.chat.id, "Where are you?", opts);
  }
});

bot.on("location", (msg) => {
  person_location[msg.chat.id] = {
    msg_id: msg.chat.id,
    latitude: parseFloat(msg.location.latitude.toFixed(5)),
    longitude: parseFloat(msg.location.longitude.toFixed(5)),
  };
  nearest_location = {
    maxLatitude: parseFloat((person_location[msg.chat.id].latitude + 0.005).toFixed(5)),
    maxLongitude: parseFloat((person_location[msg.chat.id].longitude + 0.005).toFixed(5)),
    minLatitude: parseFloat((person_location[msg.chat.id].latitude - 0.005).toFixed(5)),
    minLongitude: parseFloat((person_location[msg.chat.id].longitude - 0.005).toFixed(5)),
  };
  console.log(person_location);
  console.log(person_message);
  console.log(nearest_location);
});
