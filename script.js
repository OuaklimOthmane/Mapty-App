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
    },
    function () {
      console.log("Couldn't get your position !!");
    }
  );
}
