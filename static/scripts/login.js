const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const passwordInputCheck = document.getElementById("password_check");
const buttonlogin = document.getElementById("button_login");
const buttonsignup = document.getElementById("button_signup");
const warningP = document.getElementById('warning');

buttonlogin.addEventListener("click", async () => {
    const username = usernameInput.value; // Read the value of the username input
    const password = passwordInput.value; // Read the value of the password input
    const warning = warningP.value;
    console.log("Username:", username);
    console.log("Password:", password);
    
    fetch("/api/login", {
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
        warningP.textContent = '';
        console.log("Server replied:", data);
        if (data.message === "Login successful") {
            console.log("Login was successful!");
            window.location.href = "index.html";
        // Do something on success, e.g., redirect or show a message
        } else {
            console.log("Login failed:", data.detail);
            warningP.textContent = data.detail;
        }
    })
    .catch(error => console.error("Error:", error));
    
    
});


buttonsignup.addEventListener("click", async () => {
    const username = usernameInput.value; // Read the value of the username input
    const password = passwordInput.value; // Read the value of the password input
    const password_check = passwordInputCheck.value; // Read the value of the password input
    const warning = warningP.value;

    warningP.textContent = "";

    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Password Check:", password_check);

    if (password !== password_check) {
        warningP.textContent = "Passwords do not match!";
        return; // Stop the rest of the function
    }
    
     fetch("/api/signup", {
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
        if (data.message === "User created successfully") {
            console.log("Login was successful!");
            window.location.href = "create_success.html";
        // Do something on success, e.g., redirect or show a message
        } else if (data.detail === "Username already exists") {
            warningP.textContent = data.detail;
        }
    })
    .catch(error => console.error("Error:", error));


        
});
