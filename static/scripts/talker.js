window.addEventListener("DOMContentLoaded", checkLogin);
const counterSpan = document.getElementById("counter");
const incrementBtn = document.getElementById("incrementBtn");
const logout = document.getElementById("logoutbutton");

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
}