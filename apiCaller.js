const axios = require("axios").default;
const dotenv = require("dotenv");
dotenv.config();

async function apiCaller(inputValue) {
  const data = await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${inputValue}`, { headers: { AccountKey: process.env.LTA_ACCOUNT_KEY } }).then((res) => {
    return res.data;
  });
  return data.Services;
}

module.exports = { apiCaller: apiCaller };
