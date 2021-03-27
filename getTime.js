// let today = new Date("2021-03-27T19:20:20+08:00");
// let newdate = new Date();

// console.log((today - newdate) / (1000 * 60));

const getMinutes = (date) => {
  let nextBus = new Date(date);
  let currentTime = new Date();
  let difference = (nextBus - currentTime) / (1000 * 60);
  return String(difference.toFixed(2));
};

module.exports = { getMinutes: getMinutes };
