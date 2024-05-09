// // Initialize communication with the platform: This is where you set up the
// // HERE platform with your API key. This is like buying a ticket to a train
// // ride where the ticket is your API key.This like you are telling here platform
// // that I'm making this request to use your sevices and I'm authorized to make this request.
// const platform = new H.service.Platform({
//   apikey: "h6Oeq0Ftw3TTcHUOwoBQYymt2JXR85-6WwIDudh5sQg",
// });

// // Default options for the base layers: Here, you’re setting up the base layers for the map.
// // This is like choosing the type of train you want to ride (express, local, etc.).
// var defaultLayers = platform.createDefaultLayers();

// // Initialize the map: This is where you’ re setting up the map with the default layers
// // and initial settings such as the zoom level and center of the map.
// // This is like choosing your seat in the train.
// var map = new H.Map(
//   document.getElementById("map"),
//   defaultLayers.vector.normal.map,
//   {
//     zoom: 5,
//   }
// );

// // Add a resize listener: This ensures that the map occupies
// // the whole container even when the window size changes.
// // This is like adjusting your seat for a comfortable ride.
// window.addEventListener("resize", () => map.getViewPort().resize());

// // MapEvents enables the event system
// // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
// var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// // Create the default UI components
// //
// //
// var ui = H.ui.UI.createDefault(map, defaultLayers);

// //* Geocoding Code
// //* Geocoding Code
// //* Geocoding Code
// const hereApi = {
//   apikey: "h6Oeq0Ftw3TTcHUOwoBQYymt2JXR85-6WwIDudh5sQg",
//   geocodeUrl: "https://geocode.search.hereapi.com/v1/geocode",
// };

// async function geocodeLocation() {
//   // Getting the Address: Sherlock first gets the address that he needs to find.
//   // This is like Sherlock receiving a letter with the address of the
//   // place he needs to find.
//   //      \/
//   const address = "<%=listing.location%>"; // Replace with the actual address

//   try {
//     // Making the Inquiry: Next, Sherlock sends a letter to the HERE Geocoding API,
//     // asking for information about the location of the address. He includes the address
//     // in his letter. This is done by sending a GET request to the API with the address
//     // URL-encoded in the query parameters.
//     const response = await fetch(
//       `${hereApi.geocodeUrl}?apiKey=${hereApi.apikey}&q=${encodeURIComponent(
//         address
//       )}`
//     );
//     // Receiving the Response: Sherlock then waits for a response
//     // from the API. Once he receives the response, he opens it and
//     // reads the information inside. This is done by converting the
//     // response from JSON format into a JavaScript object.
//     const data = await response.json();
//     // Analyzing the Information: Sherlock checks if the response includes
//     // any geocoded items. If it does, he extracts the position
//     // (which includes the latitude and longitude) of the first item
//     // and notes it down. This is like Sherlock finding the exact location
//     // on a map based on the information he received.
//     if (data.items && data.items.length > 0) {
//       const location = data.items[0].position;
//       // console.log(`The geocoded information for ${address} is:`, location);

//       // Updating the Map: Sherlock then updates his map to center on
//       // the geocoded location and adds a marker at that location.
//       // This is like Sherlock marking the location on his map.

//       // Set the map's center to the geocoded location
//       map.setCenter({
//         lat: location.lat,
//         lng: location.lng,
//       });
//       map.setZoom(14); // Adjust the zoom level as needed

//       // Create a marker for the geocoded location
//       const marker = new H.map.Marker({
//         lat: location.lat,
//         lng: location.lng,
//       });

//       // Add the marker to the map
//       map.addObject(marker);

//       // Create an info bubble for the marker
//       const bubble = new H.ui.InfoBubble(
//         {
//           lat: location.lat,
//           lng: location.lng,
//         },
//         {
//           content: "This Is Where You Will Be",
//         }
//       );

//       // Add the info bubble to the UI
//       ui.addBubble(bubble);

//       // Add a tap event listener to the marker to show an info bubble with a custom message when the marker is clicked
//       marker.addEventListener(
//         "tap",
//         function () {
//           const bubble = new H.ui.InfoBubble(
//             {
//               lat: location.lat,
//               lng: location.lng,
//             },
//             {
//               content: "<p><b><%=listing.location%></b></p>", // Replace with your custom message
//             }
//           );
//           ui.addBubble(bubble);
//         },
//         false
//       );
//     } else {
//       console.log("No results found for that address.");
//     }
//   } catch (error) {
//     console.error("Error with the geocoding request:", error);
//   }
// }
// geocodeLocation();

// let latitude, longitude;

// function getLocation() {
//   // Geolocation Object:
//   // The navigator.geolocation object is used to get the geographical position of the user.
//   // Technical Example: When you call navigator.geolocation, the browser’ s Geolocation API
//   // is accessed.This API interacts with the device’ s GPS or other location services to get
//   //  the geographical coordinates.Personified Example: Think of navigator.geolocation as
//   //  asking a person(the‘ navigator’) who has a map(the‘ geolocation’ object) for directions.
//   if (navigator.geolocation) {
//     // getCurrentPosition() Method:
//     // The getCurrentPosition() method is used to get the current geographical location
//     // of the user.Technical Example: When you call
//     // navigator.geolocation.getCurrentPosition(), the browser prompts the user
//     // for permission to access their location data.If the user grants permission,
//     // the method retrieves the current geographical coordinates.Personified
//     // Example: This is like asking the person with the map(from the previous example)
//     // to point out your current location on the map.
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }
// // Position Object: The position object that is passed to the callback
// // function contains two properties: coords.latitude and coords.longitude,
// // which represent the geographical coordinates of the user.
// // Technical Example: The position object is the result returned by the
// // getCurrentPosition() method.It contains various properties,
// // but the most commonly used are coords.latitude and coords.longitude,
// // which represent the geographical coordinates.
// // Personified Example: This is like the person with the map telling you
// // your exact coordinates on the map.
// function showPosition(position) {
//   // Assign values to the global variables
//   latitude = position.coords.latitude;
//   longitude = position.coords.longitude;

//   // Autofill the location input field
//   var locationInput = document.querySelector('input[name="listing[location]"]');
//   locationInput.value = "Latitude: " + latitude + ", Longitude: " + longitude;

//   // Submit the form
//   document.getElementById("advanceSearchForm").submit();
// }
