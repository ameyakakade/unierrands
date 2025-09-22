window.addEventListener("DOMContentLoaded", checkLogin);
const counterSpan = document.getElementById("counter");
const incrementBtn = document.getElementById("incrementBtn");
const logout = document.getElementById("logoutbutton");
const geterrands = document.getElementById("get_errands");

async function fetchCounter() {
    const response = await fetch("/api/counter");
    const data = await response.json();
    counterSpan.textContent = data.value;  
}

async function incrementCounter() {
    const response = await fetch("/api/counter/increment", { method: "POST" });
    const data = await response.json();
    counterSpan.textContent = data.value; 
}

incrementBtn.addEventListener("click", incrementCounter);
logout.addEventListener("click", logOut);
geterrands.addEventListener("click", loadErrands);
document.getElementById("location").addEventListener("click", loadClosestLocation);

// Load initial counter
fetchCounter();

   async function checkLogin() {
      const response = await fetch("/api/me");  // GET request
      const warn = document.getElementById("warn");

      if (!response.ok) {
        // User is not logged in → show warning
        warn.innerHTML = "<div id='warning' class='warning_div'> <p>You are not logged in!</p><a href='login.html'>Go to Login Page</a></div>";
        console.log("User Logged Out")
        return;
      }

      const data = await response.json();
      console.log("Logged in as:", data.username);
    }

async function logOut() {
    const response = await fetch("/api/logout", { method: "POST" });
    const data = await response.json();
    console.log(data.message) 
    window.location.href = "login.html";
}

 async function loadErrands() {
      const container = document.getElementById("errands-container");
      const currentLocation = document.getElementById("current_location");
      container.innerHTML = ""; // clear previous content
      const location = currentLocation.value; // input value

      const response = await fetch("/api/errands", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ startLocation: location })
      });

      if (!response.ok) {
          container.innerHTML = "<p>You are not logged in.</p>";
          return;
      }

      const errands = await response.json(); // backend sends errands directly

      if (errands.length === 0) {
          container.innerHTML = "<p>No errands yet!</p>";
          return;
      }

      // Create a div for each errand
      errands.forEach(errand => {
        const div = document.createElement("div");
        div.className = "card";
        
        // Create <h1> for main info (e.g., from → to)
        const task = document.createElement("h1");
        task.textContent = `${errand.task}`;

        const location = document.createElement("h3");
        location.textContent = `${errand.from} → ${errand.to}`;

        // Create <p> for user
        const user = document.createElement("p");
        user.textContent = `User: ${errand.user}`;

        // Create <p> for id
        const id = document.createElement("p");
        id.textContent = `Task: ${errand.description}`;

            // Append everything to the card
        div.appendChild(task);
        div.appendChild(location);
        div.appendChild(user);
        div.appendChild(id);

        container.appendChild(div);
        console.log('Added a div');
      });
    }






// Haversine formula: distance in meters
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;     // distance in km
    return distanceKm * 1000;     // convert to meters
}

// Find closest location with minimum distance in meters
function findClosest(currentLat, currentLng, locations, minDistanceM = 0) {
    let closest = null;
    let minDistance = Infinity;

    locations.forEach(loc => {
        const distance = getDistance(currentLat, currentLng, loc.lat, loc.lng);
        if (distance < minDistance) {
            minDistance = distance;
            closest = loc;
        }
    });

    if (minDistance > minDistanceM) {
        console.log(`Closest location is farther than minimum distance (${minDistance.toFixed(0)} m)`);
        return null; // no location is close enough
    }

    console.log(`Closest location: ${closest.name}, Distance: ${minDistance.toFixed(0)} m`);
    return { ...closest, distanceM: minDistance }; // add distance to returned object
}
function loadClosestLocation() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const currentLat = position.coords.latitude;
            const currentLng = position.coords.longitude;
            console.log('Position obtained:', currentLat, currentLng);

            fetch("locations.json")
                .then(res => res.json())
                .then(locations => {
                    const minDistanceM = 5000; // 5 km
                    const closest = findClosest(currentLat, currentLng, locations, minDistanceM);

                    if (!closest) {
                        console.log("No nearby locations within the minimum distance.");
                    } else {
                        console.log("Nearest location object:", closest);
                    }
                });
        },
        error => {
            // Handle errors
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.error("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    console.error("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                default:
                    console.error("An unknown error occurred.", error);
                    break;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

