document.addEventListener("DOMContentLoaded", async () => {
    const navbarContainer = document.getElementById("navbar");

    try {
        const response = await fetch("/static/navbar.html"); // path to navbar.html
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        navbarContainer.innerHTML = html;
    } catch (err) {
        console.error("Failed to load navbar:", err);
        navbarContainer.innerHTML = "<p>Navbar failed to load.</p>";
    }
});
