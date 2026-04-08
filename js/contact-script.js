document.addEventListener("DOMContentLoaded", () => {
  // 1. Fade-in animation for the contact section
  const contactSection = document.querySelector(".contact-section");
  if (contactSection) {
    contactSection.classList.add("animate-fade");
  }

  // 2. Input field glow effect
  const formInputs = document.querySelectorAll(".contact-form input, .contact-form textarea");

  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.style.boxShadow = "0 0 8px rgba(0, 170, 255, 0.7)";
    });

    input.addEventListener("blur", () => {
      input.style.boxShadow = "none";
    });
  });

  // 3. REAL Submit Function (Updated)
  const contactForm = document.getElementById("contact-form");
  const submitButton = document.querySelector(".contact-form button");
  const statusMessage = document.getElementById("form-status"); // Make sure this ID is in your HTML!

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Stop page reload

      // UI Feedback: Start Sending
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      submitButton.style.backgroundColor = "#005f99";

      const formData = new FormData(contactForm);
      const scriptURL = contactForm.action;

      // Send the data to your Google Script
      fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors", // Crucial for Google Apps Script
      })
        .then(() => {
          // SUCCESS logic
          alert("Your message has been sent successfully!");
          contactForm.reset();
          if (statusMessage) {
            statusMessage.textContent = "Message sent! I'll get back to you soon.";
            statusMessage.style.color = "green";
          }
        })
        .catch((error) => {
          // ERROR logic
          alert("Oops! Something went wrong. Please try again.");
          console.error("Submission error:", error);
        })
        .finally(() => {
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = "Submit";
          submitButton.style.backgroundColor = ""; // Resets to your CSS original color
        });
    });
  }
});