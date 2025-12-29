// Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn")
const navLinks = document.getElementById("navLinks")

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active")
})

// Close mobile menu when a link is clicked
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#") {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  })
})

// Contact Form Validation and Submission
const contactForm = document.getElementById("contactForm")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const messageInput = document.getElementById("message")

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showError(input, errorElement, message) {
  errorElement.textContent = message
  errorElement.classList.add("show")
  input.style.borderColor = "#ef4444"
}

function clearError(input, errorElement) {
  errorElement.textContent = ""
  errorElement.classList.remove("show")
  input.style.borderColor = ""
}

nameInput.addEventListener("blur", () => {
  if (nameInput.value.trim() === "") {
    showError(nameInput, document.getElementById("nameError"), "Name is required")
  } else {
    clearError(nameInput, document.getElementById("nameError"))
  }
})

emailInput.addEventListener("blur", () => {
  if (emailInput.value.trim() === "") {
    showError(emailInput, document.getElementById("emailError"), "Email is required")
  } else if (!validateEmail(emailInput.value)) {
    showError(emailInput, document.getElementById("emailError"), "Please enter a valid email")
  } else {
    clearError(emailInput, document.getElementById("emailError"))
  }
})

messageInput.addEventListener("blur", () => {
  if (messageInput.value.trim() === "") {
    showError(messageInput, document.getElementById("messageError"), "Message is required")
  } else {
    clearError(messageInput, document.getElementById("messageError"))
  }
})

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  let isValid = true
  const submitBtn = document.getElementById("submitBtn")
  const successMessage = document.getElementById("successMessage")

  // Validate all fields
  if (nameInput.value.trim() === "") {
    showError(nameInput, document.getElementById("nameError"), "Name is required")
    isValid = false
  } else {
    clearError(nameInput, document.getElementById("nameError"))
  }

  if (emailInput.value.trim() === "") {
    showError(emailInput, document.getElementById("emailError"), "Email is required")
    isValid = false
  } else if (!validateEmail(emailInput.value)) {
    showError(emailInput, document.getElementById("emailError"), "Please enter a valid email")
    isValid = false
  } else {
    clearError(emailInput, document.getElementById("emailError"))
  }

  if (messageInput.value.trim() === "") {
    showError(messageInput, document.getElementById("messageError"), "Message is required")
    isValid = false
  } else {
    clearError(messageInput, document.getElementById("messageError"))
  }

  if (isValid) {
    // Disable button and show loading state
    submitBtn.disabled = true
    submitBtn.textContent = "Sending..."
    submitBtn.classList.add("loading")
    successMessage.classList.remove("show")

    try {
      // Send email via API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
        }),
      })

      if (response.ok) {
        // Show success message
        successMessage.textContent = "✓ Message sent successfully! I'll get back to you soon."
        successMessage.classList.add("show")

        // Reset form
        contactForm.reset()

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false
          submitBtn.textContent = "Send Message"
          submitBtn.classList.remove("loading")
        }, 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      successMessage.textContent = "✗ Failed to send message. Please try again."
      successMessage.classList.add("show", "error")

      // Reset button
      submitBtn.disabled = false
      submitBtn.textContent = "Send Message"
      submitBtn.classList.remove("loading")
    }
  }
})

// Scroll animation for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease forwards"
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

document.querySelectorAll(".project-card, .info-card, .skill-category").forEach((el) => {
  observer.observe(el)
})

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.1)"
  } else {
    navbar.style.boxShadow = "none"
  }
})
