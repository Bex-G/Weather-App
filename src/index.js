const input = document.querySelector("input");
const searchBtn = document.getElementById("searchBtn");
const current = document.getElementById("current");
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
  if (forcast.childElementCount > 0) {
    let forcastChildren = Array.from(forcast.children);
    forcastChildren.forEach((element) => {
      element.remove();
      let currentChildren = Array.from(current.children);
      currentChildren.forEach((element) => {
        element.remove();
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
    setTable(weatherData);
    getWind(weatherData);
    getWet(weatherData);
    console.log(weatherData);
  } catch (error) {
    console.log(error);
    alert("Whoops! Something went wrong. Please try your search again.");
  }
}

function getCurrent(weatherData) {
  let h3 = document.createElement("h3");
  let div = document.createElement("div");
  div.id = "iconBlock";
  let temp = document.createElement("p");
  let img = document.createElement("img");
  let p = document.createElement("p");

  let lString = weatherData.resolvedAddress;
  let location = lString.split(",").slice(0, 2);
  let icon = weatherData.currentConditions.icon;
  let description = weatherData.description;

  let cString = weatherData.currentConditions.conditions;
  let conditions = cString.toLowerCase();
  h3.textContent = "Current weather in " + location + " is " + conditions + ".";
  temp.textContent = weatherData.currentConditions.temp + "°";
  img.setAttribute("src", "../src/icons/" + icon + ".svg");
  img.setAttribute("alt", icon + " weather graphic icon");
  p.textContent = description;

  div.appendChild(temp);
  div.appendChild(img);
  current.appendChild(h3);
  current.appendChild(div);
  current.appendChild(p);
}

function setTable(weatherData) {
  const table = document.createElement("table");
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
    cell1.textContent = days[i].datetime;
    let cell2 = row.insertCell();
    cell2.textContent = days[i].tempmin;
    let cell3 = row.insertCell();
    cell3.textContent = days[i].tempmax;
  }
  forcast.appendChild(table);
}

function getWind(weatherData) {
  let div = document.createElement("div");
  let p = document.createElement("p");
  let windspeed = weatherData.currentConditions.windspeed;
  let winddir = weatherData.currentConditions.winddir;
  degToCompass(winddir);
  p.textContent = "Winds " + direction + " at " + windspeed + " mph.";
  div.appendChild(p);
  current.appendChild(div);
}

function degToCompass(num) {
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
