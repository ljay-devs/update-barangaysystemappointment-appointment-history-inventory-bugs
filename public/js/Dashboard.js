function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('d-none'));
    // Show the selected section
    document.getElementById(sectionId).classList.remove('d-none');
}

async function logout() {
    try {
        const response = await fetch('http://localhost:6969/api/logout', {
            method: 'POST',
            mode: 'cors', // Ensure CORS mode is enabled
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        if (result.success) {
            // Clear localStorage and redirect to login page
            localStorage.removeItem('userid');
            window.location.href = '/public/login.html';
        } else {
            alert('Log out failed. Please try again.');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
        console.error('Error:', error);
    }
}

async function loadAdminName() {
    // Get the logged-in user ID from localStorage
    const userid = localStorage.getItem('userid');
    if (!userid) {
        alert('User not logged in. Redirecting to login page.');
        window.location.href = '/public/login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:6969/api/GET/admin/${userid}`, {
            mode: 'cors',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        if (response.ok) {
            // Update the Admin Name on the dashboard
            document.getElementById('AdminName').textContent = result.fullname;
        } else {
            console.error('Failed to fetch admin name:', result.message);
        }
    } catch (error) {
        console.error('Error fetching admin name:', error);
    }
}

// Load admin name when the dashboard page loads
document.addEventListener('DOMContentLoaded', loadAdminName);


// Adjust the dashboard based on the user type
async function loadAppointments() {
    const userid = localStorage.getItem('userid');
    if (!userid) {
        alert('User not logged in. Redirecting to login page.');
        window.location.href = '/public/login.html';
        return;
    }

    const userType = userid.substring(0, 3); // Extract user type (BSH or HSH)
    const endpoint = userType === 'BSH' ? '/api/GET/appointment-barangay' : '/api/GET/appointment-health';

    try {
        const response = await fetch(`http://localhost:6969${endpoint}`, {
            mode: 'cors',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const appointments = await response.json();
        const tbody = document.getElementById('tbody-appointment');
        tbody.innerHTML = ''; // Clear existing data

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.CertiID}</td>
                <td>${appointment.fname}</td>
                <td>${appointment.lname}</td>
                <td>${appointment.certificates || 'N/A'}</td>
                <td>${appointment.purpose}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td style="display: flex;">
                    <button class="btn btn-success" style=" margin-right: 5px;" onclick="acceptAppointment(${appointment.CertiID}, '${userType}')">Accept</button>
                    <button class="btn btn-danger" onclick="declineAppointment(${appointment.CertiID}, '${userType}')">Decline</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

// Call loadAppointments on page load
document.addEventListener('DOMContentLoaded', loadAppointments);


async function acceptAppointment(CertiID, userType) {
    const endpoint = userType === 'BSH' ? '/api/POST/accept-barangay' : '/api/POST/accept-health';
    try {
        const response = await fetch(`http://localhost:6969${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CertiID }),
        });

        const result = await response.json();
        if (result.success) {
            alert('Appointment accepted.');
            loadAppointments(); // Refresh the list
        } else {
            alert('Failed to accept appointment.');
        }
    } catch (error) {
        console.error('Error accepting appointment:', error);
    }
}
