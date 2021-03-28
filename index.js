const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { busArrival, nearestBusStop } = require("./apiCaller");
const { getMinutes } = require("./getTime");
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const distance = 0.003;

const bot = new TelegramBot(token, {
  polling: true,
});

let person_location = {};
let person_message = {};
let nearest_location = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp =
    "Welcome to the Bus Tracer Bot\n\nI want to know your location so use\n\n/geolocation to give your location to me. Keep in mind this one you press one hor";
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/(.+[0-9])/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  console.log(typeof resp);
  person_message[msg.chat.id] = { busstop: resp };
  busArrival(resp).then((res) => {
    var text = "";
    if (res.length == 0) {
      text = "No Bus Available Sorry";
    } else {
      for (i = 0; i < res.length; i++) {
        text += "Service No: " + res[i].ServiceNo + getMinutes(res[i].NextBus.EstimatedArrival) + "\n\n";
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
    if (!person_location[msg.chat.id]) {
      bot.sendMessage(msg.chat.id, "Where are you?", opts);
    } else {
      nearest_location[msg.chat.id] = {
        maxLatitude: parseFloat(person_location[msg.chat.id].latitude + distance),
        maxLongitude: parseFloat(person_location[msg.chat.id].longitude + distance),
        minLatitude: parseFloat(person_location[msg.chat.id].latitude - distance),
        minLongitude: parseFloat(person_location[msg.chat.id].longitude - distance),
      };
      nearestBusStop(nearest_location[msg.chat.id]).then((res) => {
        bot.sendChatAction(msg.chat.id, "typing");
        bot.sendMessage(msg.chat.id, "Here are the bus stops", {
          reply_markup: {
            inline_keyboard: res.map((v, i) => {
              return [{ text: `${v.Description}`, callback_data: `${v.BusStopCode}` }];
            }),
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
      });
    }
  }
});

bot.on("location", (msg) => {
  person_location[msg.chat.id] = {
    msg_id: msg.chat.id,
    latitude: parseFloat(msg.location.latitude),
    longitude: parseFloat(msg.location.longitude),
  };
  nearest_location[msg.chat.id] = {
    maxLatitude: parseFloat(person_location[msg.chat.id].latitude + distance),
    maxLongitude: parseFloat(person_location[msg.chat.id].longitude + distance),
    minLatitude: parseFloat(person_location[msg.chat.id].latitude - distance),
    minLongitude: parseFloat(person_location[msg.chat.id].longitude - distance),
  };

  nearestBusStop(nearest_location[msg.chat.id]).then((res) => {
    bot.sendChatAction(msg.chat.id, "typing");
    var text = "";
    if (res.length == 0) {
      text = "No Bus Stops Available";
    } else {
      for (i = 0; i < res.length; i++) {
        // text = "";
        text += "Bus Stop No: " + `/${res[i].BusStopCode}\n` + "Bus Stop Name: " + res[i].Description + "\n\n";
      }
    }
    bot.sendMessage(msg.chat.id, text, {
      reply_markup: {
        inline_keyboard: res.map((v, i) => {
          return [{ text: `${v.Description}`, callback_data: `${v.BusStopCode}` }];
        }),
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
  });
});

bot.on("callback_query", (query) => {
  let busstop = query.data;
  let chatId = query.message.chat.id;
  busArrival(busstop).then((res) => {
    var text = "";
    if (res.length == 0) {
      text = "No Bus Available Sorry";
    } else {
      for (i = 0; i < res.length; i++) {
        text += "Service No: " + res[i].ServiceNo + getMinutes(res[i].NextBus.EstimatedArrival) + "\n\n";
      }
    }
    bot.sendMessage(chatId, text);
  });
});

bot.on("polling_error", (err) => {
  console.error(err);
});
