// async function getData() {
   
   const urlCord='https://api.openweathermap.org/data/2.5/weather?lat=33.44&lon=-94.04&appid=260b48b3ff6ffd666a2e1b3ec8b4c068'


//pass url got responce



//input container  
const imp=document.getElementById("input");

//buttons
const seaechBtn=document.querySelector(".search");
const currloc=document.querySelector(".currloc");

//main display
const background=document.querySelector(".background");
const main=document.querySelector(".main-container");
const cityName=document.querySelector(".cityName");
const temp=document.querySelector(".temp");
const weather=document.querySelector(".weather");
const weatherImg=document.querySelector(".weather-Img");
const feelsLike=document.querySelector(".feels_like");
const sunrise=document.querySelector(".sunrise");
const sunset=document.querySelector(".sunset");
const humidity=document.querySelector(".humidity");
const wind=document.querySelector(".wind");
const visibility=document.querySelector(".visibility");

//function to find current location
const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Successfully got position
          const result = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(result); // resolve the Promise
        },
        (error) => {
          reject(error); // reject if error
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by your browser"));
    }
  });
};

async function current(){
  try {
    const location = await getCurrentLocation();
    return location;
    // Example output: { latitude: 12.9716, longitude: 77.5946 }
  } catch (err) {
    console.error("Error getting location:", err.message);
  }
};


//function for api call
async function getData(url){
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
    //console.log(result);
  } catch (error) {
    console.error(error.message);
    return error.message;
  }
}
//Initialize the map
let map = L.map("map",{
  zoom: 13,
  zoomControl: false // 👈 disables the + and - buttons
}).setView([0, 0], 2); // initialize map
 L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',  {
     maxZoom: 1
 }).addTo(map)
let marker; // store the marker

 //  update the map pointer
function updateMarker(lat, lon) {
  // If marker exists, remove it
  if (marker) {
    map.removeLayer(marker);
  }

  // Add a new marker at new position
  marker = L.marker([lat, lon]).addTo(map);
  map.setView([lat, lon], 13); // optional: move map center
}



//function convert timestamp into AM PM time
function timeConvert(timegiven){
  const date = new Date(timegiven * 1000);
const time = date.toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});
return time;
}
//function for display thr result
function showResult(data){
updateMarker(data.coord.lat,data.coord.lon);
cityName.textContent=`${data.name},${data.sys.country}`;
temp.textContent=data.main.temp+'°C';
weather.textContent=data.weather[0].main;
weatherImg.src=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
feelsLike.textContent=`Feels Like: ${data.main.feels_like}°C`;
sunrise.innerHTML=`Sunrise: ${timeConvert(data.sys.sunrise)} <i class="fas fa-sun" aria-hidden="true"></i>`
sunset.innerHTML=`Sunrise: ${timeConvert(data.sys.sunset)} <i class="fas fa-moon" aria-hidden="true"></i>`
humidity.innerHTML=`Humidity: ${data.main.humidity}% <i class="fas fa-tint" aria-hidden="true"></i>`;
wind.innerHTML=`Wind: ${data.wind.speed} m/s <i class="fas fa-wind" aria-hidden="true"></i>`;
visibility.innerHTML=`Visibility: ${(data.visibility/1000.0)} km <i class="fas fa-eye" aria-hidden="true"></i>`;
current();
}
//Event happen after search bar press
seaechBtn.addEventListener('click',()=>{
  if(imp.value){
const urlName= `https://api.openweathermap.org/data/2.5/weather?q=${imp.value}&units=metric&appid=260b48b3ff6ffd666a2e1b3ec8b4c068`;
    getData(urlName).then(res=>{
  showResult(res);
});
imp.value='';
  }
  else{
    console.log('no');
  }
main.classList.remove("disp");
})
//Event happen after curren location btn pressed
currloc.addEventListener('click',()=>{
  current().then(res=>{
const urlName= `https://api.openweathermap.org/data/2.5/weather?lat=${res.latitude}&lon=${res.longitude}&appid=260b48b3ff6ffd666a2e1b3ec8b4c068`;
    getData(urlName).then(res=>{
  showResult(res);
  main.classList.remove("disp");
});
imp.value='';
  })
  
});


















