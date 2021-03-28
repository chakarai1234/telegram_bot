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
  let links = [
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${0}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${500}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${1000}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${1500}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${2000}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${2500}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${3000}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${3500}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${4000}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${4500}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
    await axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${5000}`, {
      headers: { AccountKey: process.env.LTA_ACCOUNT_KEY },
    }),
  ];
  const data = axios.all(links).then(
    axios.spread((...allData) => {
      const data1 = allData[0].data.value;
      const data2 = allData[1].data.value;
      const data3 = allData[2].data.value;
      const data4 = allData[3].data.value;
      const data5 = allData[4].data.value;
      const data6 = allData[5].data.value;
      const data7 = allData[6].data.value;
      const data8 = allData[7].data.value;
      const data9 = allData[8].data.value;
      const data10 = allData[9].data.value;
      const data11 = allData[10].data.value;

      const newData = [
        ...data1,
        ...data2,
        ...data3,
        ...data4,
        ...data5,
        ...data6,
        ...data7,
        ...data8,
        ...data9,
        ...data10,
        ...data11,
      ];
      return newData;
    }),
  );
  return data;
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
