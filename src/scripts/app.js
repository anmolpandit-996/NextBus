const apiKey = 'AU_jMzvljRU2bGPyGkq0';
const streetUrl = `https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}`;

const stopsUrl = `https://api.winnipegtransit.com/v3/stops.json?api-key=${apiKey}`;

const searchForm = document.forms[0];
const streetOptionsEle = document.querySelector('.streets');

const searchStreet = async (streetName) => {
  const request = await fetch(`${streetUrl}&name=${streetName}`);
  const data = await request.json();

  return data.streets;
}

const getStops = async (streetKey)=>{
  const request = await fetch(`${stopsUrl}&street=${streetKey}&usage=long`);
  const data = await request.json();

  return data.stops;
}

const renderStreetsNameHTML =(streets)=>{
  streetOptionsEle.innerHTML='';
  for(let street of streets){
    streetOptionsEle.innerHTML +=`<a href="#" data-street-key=${street.key}>${street.name}</a>`;
  }
  
}

searchForm.addEventListener('submit',(event)=>{
   event.preventDefault();
   searchStreet(event.target[0].value)
   .then((data)=>renderStreetsNameHTML(data));
  //  event.target[0].value='';
});





