const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const button = document.getElementById("button");

button.addEventListener("click", async () => {
    const username = usernameInput.value; // Read the value of the username input
    const password = passwordInput.value; // Read the value of the password input
    
    console.log("Username:", username);
    console.log("Password:", password);

    
});
