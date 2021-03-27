const axios = require("axios").default;
const dotenv = require("dotenv");
dotenv.config();

async function busArrival(inputValue) {
  const data = await axios
    .get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${inputValue}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    })
    .then((res) => {
      return res.data;
    });
  return data.Services;
}

async function busStops() {
  const data = await axios
    .get("http://datamall2.mytransport.sg/ltaodataservice/BusStops", {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    })
    .then((res) => {
      return res.data;
    });
  return data.value;
}

async function nearestBusStop(newLocation) {
  return busStops().then((res) =>
    res.filter(
      (location) =>
        location.Latitude > newLocation.minLatitude &&
        location.Latitude < newLocation.maxLatitude &&
        location.Longitude > newLocation.minLongitude &&
        location.Longitude < newLocation.maxLongitude,
    ),
  );
}
module.exports = { busArrival: busArrival, nearestBusStop: nearestBusStop };
