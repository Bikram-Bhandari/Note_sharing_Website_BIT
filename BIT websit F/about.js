// About Page JavaScript

// Declare showNotification function
function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
}

document.addEventListener("DOMContentLoaded", () => {
  initializeContactForm()
  initializeAnimations()
})

function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmission)
  }
}

function handleContactSubmission(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const name = formData.get("name")
  const email = formData.get("email")
  const subject = formData.get("subject")
  const message = formData.get("message")

  // Validate form
  if (!name || !email || !subject || !message) {
    showNotification("Please fill in all required fields", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector(".btn-submit")
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    // Reset form
    e.target.reset()

    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show success message
    showNotification("Thank you for your message! We'll get back to you soon.", "success")

    // Show confirmation modal
    showContactConfirmation(name, email, subject)
  }, 2000)
}

function showContactConfirmation(name, email, subject) {
  const modal = document.createElement("div")
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `

  const modalContent = document.createElement("div")
  modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 40px;
        max-width: 500px;
        width: 100%;
        text-align: center;
    `

  modalContent.innerHTML = `
        <div style="color: #10b981; font-size: 48px; margin-bottom: 20px;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="margin: 0 0 15px 0; color: #1f2937;">Message Sent Successfully!</h3>
        <p style="color: #6b7280; margin-bottom: 20px;">
            Thank you, <strong>${name}</strong>! We've received your message about "<strong>${subject}</strong>" 
            and will respond to <strong>${email}</strong> within 24 hours.
        </p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h4 style="margin: 0 0 10px 0; color: #1f2937;">What happens next?</h4>
            <ul style="text-align: left; color: #6b7280; margin: 0; padding-left: 20px;">
                <li>Our team will review your message</li>
                <li>You'll receive a confirmation email shortly</li>
                <li>We'll respond within 24 hours</li>
                <li>For urgent matters, call us directly</li>
            </ul>
        </div>
        <button class="close-modal" style="background: #6366f1; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Got it, thanks!
        </button>
    `

  modal.appendChild(modalContent)
  document.body.appendChild(modal)

  // Close modal functionality
  const closeBtn = modal.querySelector(".close-modal")
  closeBtn.addEventListener("click", () => modal.remove())

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })

  // Auto close after 10 seconds
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove()
    }
  }, 10000)
}

function initializeAnimations() {
  // Animate team members on scroll
  const teamMembers = document.querySelectorAll(".team-member")
  const aboutFeatures = document.querySelectorAll(".about-feature")
  const illustrationElements = document.querySelectorAll(".illustration-element")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe team members
  teamMembers.forEach((member, index) => {
    member.style.opacity = "0"
    member.style.transform = "translateY(30px)"
    member.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(member)
  })

  // Observe about features
  aboutFeatures.forEach((feature, index) => {
    feature.style.opacity = "0"
    feature.style.transform = "translateY(30px)"
    feature.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(feature)
  })

  // Animate illustration elements
  illustrationElements.forEach((element, index) => {
    element.style.opacity = "0"
    element.style.transform = "scale(0.8) rotate(-10deg)"
    element.style.transition = `all 0.6s ease ${index * 0.2}s`

    setTimeout(
      () => {
        element.style.opacity = "1"
        element.style.transform = "scale(1) rotate(0deg)"
      },
      500 + index * 200,
    )
  })

  // Add hover effects to contact methods
  const contactMethods = document.querySelectorAll(".contact-method")
  contactMethods.forEach((method) => {
    method.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(10px)"
      this.style.transition = "transform 0.3s ease"
    })

    method.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)"
    })
  })
}

// Utility function for email validation (if not already defined in main script.js)
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Add some interactive features
document.addEventListener("DOMContentLoaded", () => {
  // Add click-to-copy functionality for contact information
  const contactDetails = document.querySelectorAll(".contact-details p")
  contactDetails.forEach((detail) => {
    if (detail.textContent.includes("@") || detail.textContent.includes("+")) {
      detail.style.cursor = "pointer"
      detail.title = "Click to copy"

      detail.addEventListener("click", function () {
        const text = this.textContent.trim()
        navigator.clipboard
          .writeText(text)
          .then(() => {
            showNotification(`Copied: ${text}`, "success")
          })
          .catch(() => {
            showNotification("Failed to copy to clipboard", "error")
          })
      })
    }
  })

  // Add social media link interactions
  const socialLinks = document.querySelectorAll(".social-links a, .member-social a")
  socialLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      showNotification("Social media links are for demonstration only", "info")
    })
  })
})
