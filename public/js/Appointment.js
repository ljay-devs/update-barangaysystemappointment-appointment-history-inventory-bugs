// Get the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const section = urlParams.get("section");

// Get the form containers
const certificateSection = document.querySelector(".container.certificate:first-child");
const healthSection = document.querySelector(".container.certificate:last-child");

// Show the appropriate form based on the query parameter
if (section === "certificates") {
    certificateSection.style.display = "block";
    healthSection.style.display = "none";
} else if (section === "health") {
    certificateSection.style.display = "none";
    healthSection.style.display = "block";
} else {
    // Default behavior: show both forms
    certificateSection.style.display = "block";
    healthSection.style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle certificate form submission
    const certificateForm = document.querySelector('form') // Replace with the specific selector for the certificate form if needed
    certificateForm.addEventListener('submit', async (event) => {
      event.preventDefault()
  
      const formData = {
        fname: document.getElementById('firstName').value.trim(),
        lname: document.getElementById('lastName').value.trim(),
        street: document.getElementById('InputStreet').value,
        date: document.getElementById('InputDate').value,
        time: document.getElementById('InputTime').value,
        certificates: document.getElementById('InputCertificate').value,
        purpose: document.getElementById('InputPurpose').value
      }
  
      try {
        const response = await fetch('http://localhost:6969/api/POST/Certificates', {
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
  
        const result = await response.json()
        if (response.ok) {
            alert(result.message) // Notify user of success
            window.location.href = '/public/home.html' // Redirect to home.html
          } else {
            alert(result.message || 'An error occurred')
          }
      } catch (error) {
        console.error('Error submitting certificate form', error)
      }
    })
  
    // Handle health center form submission
    const healthForm = document.querySelectorAll('form')[1] // Adjust selector if needed
    healthForm.addEventListener('submit', async (event) => {
      event.preventDefault()
    
      const formData = {
        fname: document.getElementById('firstNameHC').value.trim(),
        lname: document.getElementById('lastNameHC').value.trim(),
        age: document.getElementById('InputAgeHC').value.trim(),
        street: document.getElementById('HealthCenterStreet').value,
        date: document.getElementById('InputDateHC').value,
        time: document.getElementById('InputTimeHC').value,
        purpose: document.getElementById('InputForHealth').value
      }
    
      // Check if any field is empty
      if (!formData.fname || !formData.lname || !formData.age || !formData.street || !formData.date || !formData.time || !formData.purpose) {
        alert('Please fill all fields') // Alert user if any field is empty
        return
      }
    
      try {
        const response = await fetch('http://localhost:6969/api/POST/HealthCenter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
    
        const result = await response.json()
    
        if (response.ok) {
          alert(result.message) // Notify user of success
          window.location.href = '/public/home.html' // Redirect to home.html
        } else {
          alert(result.message || 'An error occurred')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to submit the form')
      }
    })
    
  }) 