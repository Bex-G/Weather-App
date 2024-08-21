const { getDay } = require("date-fns");

const input = document.querySelector("input");
const searchBtn = document.getElementById("searchBtn");
const current = document.getElementById("current");
const hourly = document.getElementById("hourly");
const daily = document.getElementById("daily");
const fahrenheit = document.getElementById("fahrenheit");
const celsius = document.getElementById("celsius");

// search on click or 'enter' key
searchBtn.addEventListener("click", () => {
  if (input.value != "") {
    clearData();
    getUrl();
    search(url);
    input.value = "";
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value != "") {
    clearData();
    getUrl();
    search(url);
    input.value = "";
  }
});

// reload with appropriate conversion on event
fahrenheit.addEventListener("click", () => {
  if (current.childElementCount > 0) {
    clearData();
    getUrl();
    search(url);
  }
});

celsius.addEventListener("click", () => {
  if (current.childElementCount > 0) {
    clearData();
    getUrl();
    search(url);
  }
});

// remove any children of static HTML elements
function clearData() {
  if (current.childElementCount > 0) {
    let currentChildren = Array.from(current.children);
    currentChildren.forEach((element) => {
      element.remove();
      let dailyChildren = Array.from(daily.children);
      dailyChildren.forEach((element) => {
        element.remove();
        let hourlyChildren = Array.from(hourly.children);
        hourlyChildren.forEach((element) => {
          element.remove();
          hourly.classList.remove("blue-back");
        });
      });
    });
  }
}

// api request
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
    getDescription(weatherData);
    arrayHours(weatherData);
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
  let p = document.createElement("p");
  p.id = "currentTemp";
  let temp = Number(weatherData.currentConditions.temp);
  if (celsius.checked) {
    fToC(temp);
    temp = cTemp;
  }
  let modTemp = Math.round(temp);
  p.textContent = modTemp + "°";
  let img = document.createElement("img");
  let icon = weatherData.currentConditions.icon;
  img.setAttribute("src", "../src/icons/" + icon + ".svg");
  img.setAttribute("alt", icon + " weather graphic icon");
  div.appendChild(p);
  div.appendChild(img);
  current.appendChild(div);
}

function getDescription(weatherData) {
  let div = document.createElement("div");
  div.id = "description";
  let p = document.createElement("p");
  p.id = "description";
  let description = weatherData.description;
  let windspeed = weatherData.currentConditions.windspeed;
  let winddir = weatherData.currentConditions.winddir;
  getDirection(winddir);
  let wind = "Winds " + direction + " at " + windspeed + " mph.";
  let precipprob = weatherData.currentConditions.precipprob;
  let precipitation = precipprob + "% chance of precipitation.";
  p.textContent = description + " " + wind + " " + precipitation;
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

function arrayHours(weatherData) {
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
  getHours(hours24);
}

function getHours(hours24) {
  for (let i = 0; i < hours24.length; i++) {
    let card = document.createElement("div");
    card.className = "card";
    let p1 = document.createElement("p");

    if (i == 0) {
      p1.textContent = "Now";
    } else {
      let time = hours24[i].datetime.slice(0, 2);
      formatHours(time);
      p1.textContent = modHour;
    }

    let img = document.createElement("img");
    let icon = hours24[i].icon;
    img.setAttribute("src", "../src/icons/" + icon + ".svg");
    img.setAttribute("alt", icon + " weather graphic icon");

    let p2 = document.createElement("p");
    let temp = Number(hours24[i].temp);
    if (celsius.checked) {
      fToC(temp);
      temp = cTemp;
    }
    let modTemp = Math.round(temp);
    p2.textContent = modTemp + "°";

    card.appendChild(p1);
    card.appendChild(img);
    card.appendChild(p2);
    hourly.appendChild(card);
    hourly.classList.add("blue-back");
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
  table.classList.add("blue-back");
  let th1 = document.createElement("th");
  th1.textContent = "10-day forecast:";
  let th2 = document.createElement("th");
  th2.textContent = "";
  let th3 = document.createElement("th");
  th3.textContent = "temp-low";
  let th4 = document.createElement("th");
  th4.textContent = "temp-high";
  table.appendChild(th1);
  table.appendChild(th2);
  table.appendChild(th3);
  table.appendChild(th4);

  let days = weatherData.days;

  for (let i = 0; i < 10; i++) {
    let row = table.insertRow();
    let cell1 = row.insertCell();

    if (i == 0) {
      cell1.textContent = "Today";
    } else {
      let date = days[i].datetime.replace(/-/g, ",");
      getDayOfWeek(date);
      cell1.textContent = day;
    }

    let cell2 = row.insertCell();
    let img = document.createElement("img");
    let icon = days[i].icon;
    img.setAttribute("src", "../src/icons/" + icon + ".svg");
    cell2.appendChild(img);

    let cell3 = row.insertCell();
    let min = Number(days[i].tempmin);
    if (celsius.checked) {
      fToC(min);
      min = cTemp;
    }
    let modMin = Math.round(min);
    cell3.textContent = modMin + "°";
    let cell4 = row.insertCell();
    let max = Number(days[i].tempmax);
    if (celsius.checked) {
      fToC(max);
      max = cTemp;
    }
    let modMax = Math.round(max);
    cell4.textContent = modMax + "°";
  }
  daily.appendChild(table);
}

function fToC(fahrenheit) {
  return (cTemp = ((fahrenheit - 32) * 5) / 9);
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
