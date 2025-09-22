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
document.getElementById("createErrandForm").addEventListener("click", createErrands);

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


async function createErrands() {
    console.log('function runs');
    const errand = {
        startlocation: document.getElementById("from").value,
        finallocation: document.getElementById("to").value,
        task: document.getElementById("task").value,
        description: document.getElementById("description").value,
        endtime: 'none',
        runner: 'none'
    };
    console.log(errand);
    const messageDiv = document.getElementById("create-errand-message");

    try {
        const response = await fetch("/api/errands/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // important: send session cookies
            body: JSON.stringify(errand)
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = data.message;
            document.getElementById("createErrandForm").reset();
            // Optional: refresh errands list
            if (typeof loadErrands === "function") loadErrands();
        } else {
            messageDiv.textContent = "Error: " + data.detail;
        }
    } catch (err) {
        messageDiv.textContent = "Network error: " + err.message;
    }
    window.location.href = "index.html";
};






