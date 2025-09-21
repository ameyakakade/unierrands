const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const buttonlogin = document.getElementById("button_login");

buttonlogin.addEventListener("click", async () => {
    const username = usernameInput.value; // Read the value of the username input
    const password = passwordInput.value; // Read the value of the password input
    
    console.log("Username:", username);
    console.log("Password:", password);
    
    fetch("/api/send_string", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            username: username,
            password: password })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server replied:", data);
    })
    .catch(error => console.error("Error:", error));
    
});
