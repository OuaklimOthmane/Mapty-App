"use strict";

//! REFACTORING FOR PROJECT ARCHITECTURE :

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()} `;
  }
}

class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription(); // it works by inheritance
  }

  calcPace() {
    // "min/km" :
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // this.type = "cycling";
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // "km/h" :
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//! ELEMENTS :
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//! APPLICATION ARCHITECTURE :

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    // When a new object is created after the page has loaded,so that means the constructor is also executed immediately when the page is loaded, so therefore is simply getting "_getPosition()" in constructor.
    // so the Load page has triggered the constructor which he then triggers "_getPosition()", so as we receive the position the "_loadMap(position)" will called.
    this._getPosition();

    // "this._newWorkout()" is an event handler function has the "this" keyword is pointed to the "form" element and no longer the "app" object, so once again we will use the "bind" solution.
    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // the "_loadMap()" method is actually called by ".getCurrentPosition()" function,and it will be treated as a regular function not a method call, so when it's a regular function then the "this" keyword will set to "undefined",therefore as a solution we use "bind()" method to set manually the "this" keyword to the "this" wich points to the current object,and we know that "bind()" will simply return a new function and that's what we need inside the ".getCurrentPosition()"
        this._loadMap.bind(this),
        function () {
          alert("Couldn't get your position !!");
        }
      );
    }
  }

  _loadMap(position) {
    //* Display the map :
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //* Show the form :
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    //* Clear input fields :
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    //* Hide form :
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(event) {
    const validInputs = (...inputs) =>
      inputs.every((input) => Number.isFinite(input));

    const allPositive = (...inputs) => inputs.every((input) => input > 0);

    event.preventDefault();

    //* Get Data from Form :
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //* If workout "running", create running object :
    if (type === "running") {
      const cadence = +inputCadence.value;
      // Checking the data validation :
      if (
        //. !Number.isFinite(distance) ||
        //. !Number.isFinite(duration) ||
        //. !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive numbers !");

      workout = new Running([lat, lng], distance, duration, cadence);
      // Add new object to workout array :
      this.#workouts.push(workout);
    }

    //* If workout "cycling", create cycling object :
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      // Checking the data validation :
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers !");

      workout = new Cycling([lat, lng], distance, duration, elevation);
      // Add new object to workout array :
      this.#workouts.push(workout);
    }

    //* Render workout on map as a marker :
    // In this function we used the "this" within,however not a problem in this case because here we call the function as a method of the "this" keyword so its not a callBack function of another function,and therefore the "this" keyword in this method will still be the same current object and so no need to use "bind()"
    this._renderWorkoutMarker(workout);

    //* Render workout in list :
    this._renderWorkoutList(workout);

    //* Hide form  :
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkoutList(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="1234567890">
      <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
       </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
         <span class="workout__unit">min</span>
       </div>`;

    if (workout.type === "running") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
    </li>`;
    }

    if (workout.type === "cycling") {
      html += `
         <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
         </div>
         <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
         </div>
        </li>`;
    }

    form.insertAdjacentHTML("afterend", html);
  }
}

const app = new App();

//! ____________________________________________________________________________________________________________________
//? ____________________________________________________________________________________________________________________
//* ____________________________________________________________________________________________________________________

//! REFACTORING ON FUNCTIONNAL PROGRAMMING :

/* 
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

      //? whither string in the map() function like "map" refers to ID name of an element innerHTML whitin the map will be diplayed.
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

//! Hide and display the corresponding field :
inputType.addEventListener("change", function () {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
 */
