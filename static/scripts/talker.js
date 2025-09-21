const counterSpan = document.getElementById("counter");
const incrementBtn = document.getElementById("incrementBtn");

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

// Load initial counter
fetchCounter();