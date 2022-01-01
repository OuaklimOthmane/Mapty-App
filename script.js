"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//! ELEMENTS :
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//! Geolocation API :
//? The Navigator.geolocation read-only property returns a Geolocation object that gives Web content access to the location of the device. This allows a Web site or app to offer customized results based on the user's location.
//? As an arguments it takes two function whether the first means the actions when the user allows to get inforamtions about his position ,on the other hand means the actions when the user blocks the same exact pemission to get access to the location.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      //   const latitude = position.coords.latitude;
      //   const longitude = position.coords.longitude;
      const { latitude, longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      //* Displaying Map :
      const coords = [latitude, longitude];
      //? wheter string in the map() function like "map" refers to ID name of an element innerHTML whitin the map will be diplayed.
      //? coords refer to the coordinates of position given, and it expects an array as an argument,the "13" refers to the zoom depth.
      //? "L" is an object given by Leaflet wich includes some methods as tileLayer(),map(),marker(),...
      const map = L.map("map").setView(coords, 13);

      //? Used to load and display tile layers on the map. Note that most tile servers require attribution, which you can set under Layer. Extends GridLayer.
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //* Displaying a map Marker :
      //? L.Marker is used to display clickable/draggable icons on the map. Extends Layer.
      L.marker(coords)
        .addTo(map)
        .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
        .openPopup();
    },
    function () {
      console.log("Couldn't get your position !!");
    }
  );
}
