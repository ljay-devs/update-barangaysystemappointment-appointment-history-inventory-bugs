document.querySelector('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    // Get the value of UserId and Password
    let username = document.getElementById('UserId').value;
    const password = document.getElementById('Password').value;
    // Convert username to uppercase
    username = username.toUpperCase();

    try {
        const response = await fetch('http://localhost:6969/api/login', {
            method: 'POST',
            mode: 'cors', // Ensure CORS mode is enabled
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.success) {
            // Save user ID to localStorage for later use
            localStorage.setItem('userid', username);
            window.location.href = '/public/Dashboard.html';
        } else {
            document.getElementById('loginResult').textContent = result.message;
        }
    } catch (error) {
        document.getElementById('loginResult').textContent = 'An error occurred. Please try again.';
        console.error('Error:', error);
    }
});
