const apiKey = "AU_jMzvljRU2bGPyGkq0";
const streetUrl = `https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}`;
const stopsUrl = `https://api.winnipegtransit.com/v3/stops.json?api-key=${apiKey}`;

const searchForm = document.forms[0];
const streetOptionsEle = document.querySelector(".streets");
const titleBarEle = document.querySelector("#street-name");

const searchStreet = async (streetName) => {
  const request = await fetch(`${streetUrl}&name=${streetName}`);
  const data = await request.json();
  if(!Response.ok){
    titleBarEle .innerHTML =`<div class="no-results">No Streets found</div>`;  
  }
  return data.streets;
  
};

const getStops = async (streetKey) => {
  const request = await fetch(`${stopsUrl}&street=${streetKey}&usage=long`);
  const data = await request.json();

  return data.stops;
};

const getStopSchedule = async (stopKey) => {
  const request = await fetch(
    `https://api.winnipegtransit.com/v3/stops/${stopKey}/schedule.json?api-key=${apiKey}`
  );
  const data = await request.json();

  return data;
};

const renderStreetsNameHTML = (streets) => {
  streetOptionsEle.innerHTML = "";
  for (let street of streets) {
    streetOptionsEle.innerHTML += `<a href="#" data-street-key=${street.key}>${street.name}</a>`;
  }
};

const renderTitleBar = (stops) => { 
  titleBarEle.innerHTML = `Displaying results for ${stops[0].street.name}`;
};

const renderSchedule = (scheduleArray) => {
  const scheduleTBody = document.getElementsByTagName("tbody");
  scheduleTBody[0].innerHTML = "";

  for (let schedule of scheduleArray) {
    if(schedule["stop-schedule"]["route-schedules"].length!==0){
    const busDetailedTime =
      schedule["stop-schedule"]["route-schedules"][0]["scheduled-stops"][0][
        "times"
      ]["arrival"].scheduled;

    const busTime = new Date(busDetailedTime).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    scheduleTBody[0].innerHTML += `
  <tr>
    <td>${schedule["stop-schedule"].stop.name}</td>
    <td>${schedule["stop-schedule"].stop["cross-street"].name}</td> 
    <td>${schedule["stop-schedule"].stop.direction}</td>
    <td>${schedule["stop-schedule"]["route-schedules"][0].route.number}</td>
    <td>${busTime}</td>
  </tr>
    `;
  }else{
    titleBarEle .innerHTML =`Sorry for the inconvenience, no schedule available for now`; 
  }
}
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchStreet(event.target[0].value).then((data) => { 
    renderStreetsNameHTML(data);
    
  });
  
});

streetOptionsEle.addEventListener("click", (event) => {
  event.preventDefault();
  let streetKey = event.target.getAttribute("data-street-key");
  getStops(streetKey).then((data) => {
    const scheduleArray = [];
    data.forEach((element) => {
      scheduleArray.push(getStopSchedule(element.key));
    });
    Promise.all(scheduleArray).then((schedules) => {
     if(schedules.length!==0){
      renderTitleBar(data);
      renderSchedule(schedules);
      
     }
    });
  });
});
