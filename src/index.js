const { getDay } = require("date-fns");

const input = document.querySelector("input");
const searchBtn = document.getElementById("searchBtn");
const current = document.getElementById("current");
const hourly = document.getElementById("hourly");
const forcast = document.getElementById("forcast");

searchBtn.addEventListener("click", () => {
  if (input.value != "") {
    clearData();
    getUrl();
    search(url);
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value != "") {
    clearData();
    getUrl();
    search(url);
  }
});

function clearData() {
  // remove any children of static HTML elements
  if (forcast.childElementCount > 0) {
    let forcastChildren = Array.from(forcast.children);
    forcastChildren.forEach((element) => {
      element.remove();
      let currentChildren = Array.from(current.children);
      currentChildren.forEach((element) => {
        element.remove();
        let hourlyChildren = Array.from(hourly.children);
        hourlyChildren.forEach((element) => {
          element.remove();
        });
      });
    });
  }
}

function getUrl() {
  let city = input.value;
  if (city != "") {
    return (url =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
      city +
      "?key=QNT6S5FQ8G75ZCZS47Z2E5ZCF");
  }
}

async function search(url) {
  try {
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    getCurrent(weatherData);
    getIcon(weatherData);
    getWind(weatherData);
    getWet(weatherData);
    getHours(weatherData);
    getTable(weatherData);
    console.log(weatherData);
  } catch (error) {
    console.log(error);
    alert("Whoops! Something went wrong. Please try your search again.");
  }
}

function getCurrent(weatherData) {
  let h3 = document.createElement("h3");
  let location = weatherData.resolvedAddress;
  let modLoc = location.split(",").slice(0, 2);
  let conditions = weatherData.currentConditions.conditions;
  let modCon = conditions.toLowerCase();
  let time = weatherData.currentConditions.datetime;
  formatTime(time);
  h3.textContent =
    "Weather in " + modLoc + " is " + modCon + " as of " + modTime + ".";
  current.appendChild(h3);
}

function formatTime(time) {
  let hours = time.slice(0, 2);
  let AmOrPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  let minutes = time.slice(3, 5);
  return (modTime = hours + ":" + minutes + " " + AmOrPm);
}

function getIcon(weatherData) {
  let div = document.createElement("div");
  div.id = "iconBlock";
  let temp = document.createElement("p");
  temp.textContent = weatherData.currentConditions.temp + "°";
  let img = document.createElement("img");
  let icon = weatherData.currentConditions.icon;
  img.setAttribute("src", "../src/icons/" + icon + ".svg");
  img.setAttribute("alt", icon + " weather graphic icon");
  let p = document.createElement("p");
  let description = weatherData.description;
  p.textContent = description;
  div.appendChild(temp);
  div.appendChild(img);
  current.appendChild(div);
  current.appendChild(p);
}

function getWind(weatherData) {
  let div = document.createElement("div");
  let p = document.createElement("p");
  let windspeed = weatherData.currentConditions.windspeed;
  let winddir = weatherData.currentConditions.winddir;
  getDirection(winddir);
  p.textContent = "Winds " + direction + " at " + windspeed + " mph." + " ";
  div.appendChild(p);
  current.appendChild(div);
}

function getDirection(num) {
  var val = Math.floor(num / 22.5 + 0.5);
  var arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return (direction = arr[val % 16]);
}

function getWet(weatherData) {
  let div = document.createElement("div");
  let p = document.createElement("p");
  let precipprob = weatherData.currentConditions.precipprob;
  p.textContent = precipprob + "% chance of precipitation.";
  div.appendChild(p);
  current.appendChild(div);
}

function getHours(weatherData) {
  // get array of selected hour data for all of today & tomorrow
  let hours = weatherData.days[0].hours.concat(weatherData.days[1].hours);
  let array = [];
  hours.forEach((obj) => {
    let partialObj = {};
    partialObj.datetime = obj.datetime;
    partialObj.temp = obj.temp;
    partialObj.icon = obj.icon;
    array.push(partialObj);
  });

  // get array of hour data for only the next 24 hours (starting now)
  let hour = weatherData.currentConditions.datetime.slice(0, 2);
  let stopIndex = Number(hour) + 25;
  let hours24 = array.slice(hour, stopIndex);
  displayHours(hours24);
}

function displayHours(hours24) {
  for (let i = 0; i < hours24.length; i++) {
    let card = document.createElement("div");
    card.className = "card";

    let p1 = document.createElement("p");
    let time = hours24[i].datetime.slice(0, 2);
    formatHours(time);
    p1.textContent = modHour;

    let img = document.createElement("img");
    let icon = hours24[i].icon;
    img.setAttribute("src", "../src/icons/" + icon + ".svg");
    img.setAttribute("alt", icon + " weather graphic icon");

    let p2 = document.createElement("p");
    p2.textContent = hours24[i].temp + "°";

    card.appendChild(p1);
    card.appendChild(img);
    card.appendChild(p2);
    hourly.appendChild(card);
  }
}

function formatHours(time) {
  let hour = time.slice(0, 2);
  let AmOrPm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return (modHour = hour + AmOrPm);
}

function getTable(weatherData) {
  let table = document.createElement("table");
  let th1 = document.createElement("th");
  th1.textContent = "2-week forcast:";
  let th2 = document.createElement("th");
  th2.textContent = "temp-low";
  let th3 = document.createElement("th");
  th3.textContent = "temp-high";
  table.appendChild(th1);
  table.appendChild(th2);
  table.appendChild(th3);

  let days = weatherData.days;

  for (let i = 0; i < days.length; i++) {
    let row = table.insertRow();
    let cell1 = row.insertCell();

    if (days[i].datetime === days[0].datetime) {
      cell1.textContent = "Today";
    } else {
      let date = days[i].datetime.replace(/-/g, ",");
      getDayOfWeek(date);
      cell1.textContent = day;
    }

    let cell2 = row.insertCell();
    cell2.textContent = days[i].tempmin + "°";
    let cell3 = row.insertCell();
    cell3.textContent = days[i].tempmax + "°";
  }
  forcast.appendChild(table);
}

function getDayOfWeek(date) {
  switch (getDay(new Date(date))) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }
}
