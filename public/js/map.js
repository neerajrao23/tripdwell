const lat = coordinates[1];
const lng = coordinates[0];

var map = L.map('map').setView([lat, lng], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);

var circle = L.circle([lat, lng], {
  color: 'red',
  fillColor: 'red',
  fillOpacity: 0.2,
  radius: 500,
}).addTo(map);
