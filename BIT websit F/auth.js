// Authentication JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeAuth()
  initializePasswordStrength()
  initializeFormValidation()
})

function initializeAuth() {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }

  // Initialize user menu if user is logged in
  initializeUserMenu()
}

function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")
  const remember = formData.get("remember")

  // Show loading state
  const submitBtn = e.target.querySelector(".auth-btn")
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...'
  submitBtn.disabled = true

  // Simulate login process
  setTimeout(() => {
    // Store user data (in real app, this would come from server)
    const userData = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: email,
      avatar: "/generic-user-avatar.png",
      semester: "3",
      university: "Tech University",
      membershipType: "Premium",
      loginTime: new Date().toISOString(),
    }

    // Store in localStorage (in real app, use secure tokens)
    localStorage.setItem("user", JSON.stringify(userData))
    if (remember) {
      localStorage.setItem("rememberMe", "true")
    }

    showNotification("Login successful! Welcome back.", "success")

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1000)
  }, 2000)
}

function handleRegister(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const semester = formData.get("semester")
  const university = formData.get("university")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const terms = formData.get("terms")
  const newsletter = formData.get("newsletter")

  // Validation
  if (password !== confirmPassword) {
    showNotification("Passwords do not match!", "error")
    return
  }

  if (!terms) {
    showNotification("Please accept the Terms of Service", "error")
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector(".auth-btn")
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...'
  submitBtn.disabled = true

  // Simulate registration process
  setTimeout(() => {
    // Create user data
    const userData = {
      id: Date.now(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      avatar: "/generic-user-avatar.png",
      semester: semester,
      university: university,
      membershipType: "Free",
      newsletter: newsletter,
      registrationTime: new Date().toISOString(),
    }

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(userData))

    showNotification("Account created successfully! Welcome to EduLearn.", "success")

    // Show welcome modal
    showWelcomeModal(firstName)

    // Reset form
    e.target.reset()
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }, 2500)
}

function initializePasswordStrength() {
  const passwordInput = document.getElementById("password")
  if (!passwordInput) return

  passwordInput.addEventListener("input", function () {
    const password = this.value
    const strengthIndicator = document.getElementById("passwordStrength")
    if (!strengthIndicator) return

    const strength = calculatePasswordStrength(password)
    const strengthFill = strengthIndicator.querySelector(".strength-fill")
    const strengthText = strengthIndicator.querySelector(".strength-text")

    // Remove existing classes
    strengthFill.className = "strength-fill"

    if (password.length === 0) {
      strengthText.textContent = "Password strength"
      return
    }

    switch (strength.level) {
      case 1:
        strengthFill.classList.add("weak")
        strengthText.textContent = "Weak password"
        break
      case 2:
        strengthFill.classList.add("fair")
        strengthText.textContent = "Fair password"
        break
      case 3:
        strengthFill.classList.add("good")
        strengthText.textContent = "Good password"
        break
      case 4:
        strengthFill.classList.add("strong")
        strengthText.textContent = "Strong password"
        break
    }
  })
}

function calculatePasswordStrength(password) {
  let score = 0
  let level = 0

  // Length check
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  // Determine level
  if (score <= 2)
    level = 1 // Weak
  else if (score <= 4)
    level = 2 // Fair
  else if (score <= 5)
    level = 3 // Good
  else level = 4 // Strong

  return { score, level }
}

function initializeFormValidation() {
  // Real-time email validation
  const emailInputs = document.querySelectorAll('input[type="email"]')
  emailInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = "#ef4444"
        showFieldError(this, "Please enter a valid email address")
      } else {
        this.style.borderColor = "#e5e7eb"
        hideFieldError(this)
      }
    })
  })

  // Password confirmation validation
  const confirmPasswordInput = document.getElementById("confirmPassword")
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("blur", function () {
      const passwordInput = document.getElementById("password")
      if (this.value && passwordInput.value !== this.value) {
        this.style.borderColor = "#ef4444"
        showFieldError(this, "Passwords do not match")
      } else {
        this.style.borderColor = "#e5e7eb"
        hideFieldError(this)
      }
    })
  }
}

function showFieldError(input, message) {
  hideFieldError(input) // Remove existing error

  const errorElement = document.createElement("div")
  errorElement.className = "field-error"
  errorElement.style.cssText = `
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
    `
  errorElement.textContent = message

  input.parentElement.parentElement.appendChild(errorElement)
}

function hideFieldError(input) {
  const existingError = input.parentElement.parentElement.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const toggle = input.parentElement.querySelector(".password-toggle i")

  if (input.type === "password") {
    input.type = "text"
    toggle.className = "fas fa-eye-slash"
  } else {
    input.type = "password"
    toggle.className = "fas fa-eye"
  }
}

function socialLogin(provider) {
  showNotification(`${provider} login is not implemented in this demo`, "info")
  // In a real application, this would redirect to the OAuth provider
}

function showTerms() {
  const modal = createModal("Terms of Service", getTermsContent())
  document.body.appendChild(modal)
}

function showPrivacy() {
  const modal = createModal("Privacy Policy", getPrivacyContent())
  document.body.appendChild(modal)
}

function createModal(title, content) {
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
        padding: 30px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `

  modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #1f2937;">${title}</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <div style="color: #6b7280; line-height: 1.6;">
            ${content}
        </div>
    `

  modal.appendChild(modalContent)

  // Close modal functionality
  const closeBtn = modal.querySelector(".close-modal")
  closeBtn.addEventListener("click", () => modal.remove())

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })

  return modal
}

function getTermsContent() {
  return `
        <h4>Terms of Service</h4>
        <p>Welcome to EduLearn. By using our service, you agree to these terms.</p>
        <h5>1. Acceptance of Terms</h5>
        <p>By accessing and using EduLearn, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <h5>2. Use License</h5>
        <p>Permission is granted to temporarily access the materials on EduLearn for personal, non-commercial transitory viewing only.</p>
        <h5>3. Disclaimer</h5>
        <p>The materials on EduLearn are provided on an 'as is' basis. EduLearn makes no warranties, expressed or implied.</p>
        <h5>4. Limitations</h5>
        <p>In no event shall EduLearn be liable for any damages arising out of the use or inability to use the materials.</p>
        <p><em>This is a demo version. In a real application, complete terms would be provided.</em></p>
    `
}

function getPrivacyContent() {
  return `
        <h4>Privacy Policy</h4>
        <p>Your privacy is important to us. This policy explains how we collect and use your information.</p>
        <h5>Information We Collect</h5>
        <p>We collect information you provide directly to us, such as when you create an account or contact us.</p>
        <h5>How We Use Information</h5>
        <p>We use the information we collect to provide, maintain, and improve our services.</p>
        <h5>Information Sharing</h5>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
        <h5>Data Security</h5>
        <p>We implement appropriate security measures to protect your personal information.</p>
        <p><em>This is a demo version. In a real application, complete privacy policy would be provided.</em></p>
    `
}

function showWelcomeModal(firstName) {
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
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 100%;
        text-align: center;
    `

  modalContent.innerHTML = `
        <div style="color: #10b981; font-size: 64px; margin-bottom: 20px;">
            🎉
        </div>
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 28px;">Welcome to EduLearn, ${firstName}!</h3>
        <p style="color: #6b7280; margin-bottom: 30px; font-size: 16px;">
            Your account has been created successfully. You're now part of our learning community!
        </p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <h4 style="margin: 0 0 15px 0; color: #1f2937;">What's next?</h4>
            <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check" style="color: #10b981;"></i>
                    <span>Explore our study materials</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check" style="color: #10b981;"></i>
                    <span>Take practice quizzes</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check" style="color: #10b981;"></i>
                    <span>Track your progress</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check" style="color: #10b981;"></i>
                    <span>Connect with other students</span>
                </div>
            </div>
        </div>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button onclick="window.location.href='dashboard.html'" style="background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                Go to Dashboard
            </button>
            <button class="close-modal" style="background: #f3f4f6; color: #374151; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                Explore Later
            </button>
        </div>
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
}

function initializeUserMenu() {
  const userMenuToggle = document.getElementById("userMenuToggle")
  const userDropdown = document.getElementById("userDropdown")

  if (userMenuToggle && userDropdown) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      userDropdown.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      userDropdown.classList.remove("show")
    })

    // Prevent dropdown from closing when clicking inside
    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  // Load user data if logged in
  loadUserData()
}

function loadUserData() {
  const userData = localStorage.getItem("user")
  if (userData) {
    const user = JSON.parse(userData)
    updateUserInterface(user)
  }
}

function updateUserInterface(user) {
  // Update user name in navigation
  const userName = document.getElementById("userName")
  const dashboardUserName = document.getElementById("dashboardUserName")
  const userAvatar = document.getElementById("userAvatar")

  if (userName) {
    userName.textContent = `${user.firstName} ${user.lastName}`
  }

  if (dashboardUserName) {
    dashboardUserName.textContent = user.firstName
  }

  if (userAvatar) {
    userAvatar.src = user.avatar
  }

  // Update user dropdown info
  const userDropdown = document.getElementById("userDropdown")
  if (userDropdown) {
    const userInfo = userDropdown.querySelector(".user-details")
    if (userInfo) {
      userInfo.querySelector("h4").textContent = `${user.firstName} ${user.lastName}`
      userInfo.querySelector("p").textContent = user.email
    }
  }
}

function logout() {
  // Clear user data
  localStorage.removeItem("user")
  localStorage.removeItem("rememberMe")

  showNotification("You have been logged out successfully", "success")

  // Redirect to home page
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "info" ? "#6366f1" : "#ef4444"};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10001;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `

  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 300)
  }, 4000)
}

// Check if user is logged in and redirect if necessary
function checkAuthStatus() {
  const currentPage = window.location.pathname.split("/").pop()
  const userData = localStorage.getItem("user")

  // Protected pages that require login
  const protectedPages = ["dashboard.html", "profile.html", "settings.html"]

  if (protectedPages.includes(currentPage) && !userData) {
    window.location.href = "login.html"
    return
  }

  // Redirect logged-in users away from auth pages
  const authPages = ["login.html", "register.html"]
  if (authPages.includes(currentPage) && userData) {
    window.location.href = "dashboard.html"
    return
  }
}

// Run auth check on page load
document.addEventListener("DOMContentLoaded", checkAuthStatus)
