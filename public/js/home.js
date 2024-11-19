// Get the checkbox, buttons, and appointment link
const agreeCheckbox = document.getElementById("agree"),
      certificationBtn = document.getElementById("certificationBtn"),
      healthCenterBtn = document.getElementById("healthCenterBtn"),
      appointmentLink = document.getElementById("appointmentLink")

   // Function to check if checkbox is checked
function validateCheckbox() {
       if (agreeCheckbox.checked) {
           certificationBtn.disabled = false;
           healthCenterBtn.disabled = false;
       } else {
           certificationBtn.disabled = true;
           healthCenterBtn.disabled = true;
       }
   }

   // Listen for change event on checkbox
   agreeCheckbox.addEventListener("change", validateCheckbox);

   // Prevent link navigation if checkbox is not checked
   appointmentLink.addEventListener("click", function(event) {
       if (!agreeCheckbox.checked) {
           event.preventDefault() // Prevent navigation
           alert("Please accept the terms and conditions to proceed with the appointment.")
       }
 })

 function proceedToAppointment(event) {
    if (agreeCheckbox.checked) {
        const target = event.target.id; // Get the ID of the clicked button
        let destination = "/public/Appointment.html";

        if (target === "certificationBtn") {
            destination += "?section=certificates"; // Add query parameter for certificates
        } else if (target === "healthCenterBtn") {
            destination += "?section=health"; // Add query parameter for health center
        }

        window.location.href = destination; // Redirect to Appointment page
    } else {
        alert("Please accept the terms and conditions to proceed with the appointment.");
    }
}

// Attach the proceedToAppointment function to both buttons
certificationBtn.addEventListener("click", proceedToAppointment);
healthCenterBtn.addEventListener("click", proceedToAppointment);
