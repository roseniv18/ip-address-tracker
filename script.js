let map = L.map('map').setView([51.505, -0.09], 13);

// DOM elements
const input = document.querySelector('.search > input');
const submitBtn = document.querySelector('#submitBtn');
const ipText = document.getElementById('ip-text');
const locationText = document.getElementById('location-text');
const timezoneText = document.getElementById('timezone-text');
const ispText = document.getElementById('isp-text');

// Links using either IP address or Domain
const linkIp = `https://geo.ipify.org/api/v2/country,city?apiKey=at_DesGfVEZkOJzlv3IB49SQFWBciqq1&ipAddress=`;
const linkDomain = `https://geo.ipify.org/api/v2/country,city?apiKey=at_DesGfVEZkOJzlv3IB49SQFWBciqq1&domain=`;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYXZpdG9ob2wiLCJhIjoiY2t0Y3h0aXB2MmFoNzJwbjkxZ3U5b2thYyJ9.ZmYdJZeO53XTIaT4tf0P9g'
}).addTo(map);

let marker = L.marker([51.505, -0.09]).addTo(map);


const regExpLetters = /[a-zA-Z]/g;

const getInfo = async (input_parameter) => {
    // Check whether the input value is an IP address or a Domain name.
    if(regExpLetters.test(input_parameter)) {
        const response = await fetch(`${linkDomain}${input_parameter}`);
        const data = response.json();
        return data;
    } else {
        const response = await fetch(`${linkIp}${input_parameter}`);
        const data = response.json();
        return data;
    }
}


const showInfo = () => {
    // Always remove previous marker on submit
    marker.remove();
    if(input.value.trim !== "") {

        getInfo(input.value).then(data => {
            ipText.innerHTML = data.ip;
            locationText.innerHTML = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
            timezoneText.innerHTML = `UTC ${data.location.timezone}`;
            ispText.innerHTML = data.isp;

            
            map.panTo(new L.LatLng(data.location.lat, data.location.lng)).getBounds(500);
            marker = L.marker([data.location.lat, data.location.lng]).addTo(map);

        }).catch(err => console.log(err));  

    // Load the user IP on page load or on empty input submit
    } else {
        getInfo(myIp).then(data => {
            ipText.innerHTML = data.ip;
            locationText.innerHTML = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
            timezoneText.innerHTML = `UTC ${data.location.timezone}`;
            ispText.innerHTML = data.isp;

            map.panTo(new L.LatLng(data.location.lat, data.location.lng)).getBounds(500);
            L.marker([data.location.lat, data.location.lng]).addTo(map);
        }).catch(err => console.log(err));
    }
}

const getMyIp = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data;
}

let myIp;

getMyIp().then(data => {
    myIp = data.ip;
    getInfo(myIp).then(showInfo()).catch(err => console.log(err));
}).catch(err => console.log(err));

submitBtn.addEventListener('click', showInfo);
input.addEventListener('keyup', e => {
    if(e.keyCode === 13) {
        showInfo();
    }
})