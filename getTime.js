const getMinutes = (date) => {
  let nextBus = new Date(date);
  let currentTime = new Date();
  let difference = (nextBus - currentTime) / (1000 * 60);

  if (difference <= 0) {
    return " is Arrived";
  } else {
    return " is " + String(Math.floor(difference)) + " Minutes away";
  }
};

module.exports = { getMinutes: getMinutes };
