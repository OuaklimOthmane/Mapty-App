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

let map, mapEvent;

//! Setting the map :
//? The Navigator.geolocation read-only property returns a Geolocation object that gives Web content access to the location of the device. This allows a Web site or app to offer customized results based on the user's location.
//? As an arguments it takes two function whether the first means the actions when the user allows to get inforamtions about his position ,on the other hand means the actions when the user blocks the same exact pemission to get access to the location.
if (navigator.geolocation) {
  //* Getting coordinates :
  navigator.geolocation.getCurrentPosition(
    function (position) {
      //   const latitude = position.coords.latitude;
      //   const longitude = position.coords.longitude;
      const { latitude, longitude } = position.coords;
      // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      //* Displaying the Map :
      const coords = [latitude, longitude];

      //? wheter string in the map() function like "map" refers to ID name of an element innerHTML whitin the map will be diplayed.
      //? coords refer to the coordinates of position given, and it expects an array as an argument,the "13" refers to the zoom depth.
      //? "L" is an object given by Leaflet wich includes some methods as tileLayer(),map(),marker(),...

      map = L.map("map").setView(coords, 13);

      //? Used to load and display tile layers on the map. Note that most tile servers require attribution, which you can set under Layer. Extends GridLayer.

      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", function (mapE) {
        mapEvent = mapE; // should assign this value to mapEvent for some use cases outside this scope.
        form.classList.remove("hidden");
        inputDistance.focus();
      });
    },
    function () {
      console.log("Couldn't get your position !!");
    }
  );
}

//! Adding & Displaying a map Marker :
//? L.Marker is used to display clickable/draggable icons on the map. Extends Layer.
// We need to display a Marker wherever we click in the map that's why we have to attach an ordinary event handler ,however we can't apply an eventListener because we will never know where the user clicks to getting the coordinates on the map because this data only the map knows, So instead we can use a method that is available on Leaflit library.
// So here comes the pupose of the "map" variable declared,'cause within we can have to add an eventListener wich called "on()" , wich holds as an argument a value that includes information about the map.

form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent the default behavior of forms when it is submitted,wich in this case the marker should be opened without disappearing.

  //* Clear input fields :
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      "";

  //* Display marker :
  // console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng; // getting the coordinates of the point on the map where the user clicks.

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false, // To keep the popup opened when another popup is opened.
        closeOnClick: false, // prevent the popup from closing whenever the user clicks on the map.
        className: "running-popup",
      })
    )
    .setPopupContent("othmane")
    .openPopup();
});
