const axios = require("axios").default;
const dotenv = require("dotenv");
dotenv.config();

async function busArrival(inputValue) {
  const data = await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${inputValue}`, { headers: { AccountKey: process.env.LTA_ACCOUNT_KEY } }).then((res) => {
    return res.data;
  });
  return data.Services;
}

async function busStops() {
  const data = await axios.get("http://datamall2.mytransport.sg/ltaodataservice/BusStops", { headers: { AccountKey: process.env.LTA_ACCOUNT_KEY } }).then((res) => {
    return res.data;
  });
  return data.value;
}
busStops().then((res) => console.log(res));
module.exports = { busArrival: busArrival };
