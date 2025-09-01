// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initMobileMenu()
  initSmoothScrolling()
  initBackToTop()
  initSearchFunctionality()
  initAnimations()
  initDropdowns()
  initNewsletterForm()
})

// Mobile Menu Functionality
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
      document.body.classList.toggle("menu-open")
    })

    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
        document.body.classList.remove("menu-open")
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
        document.body.classList.remove("menu-open")
      }
    })
  }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetSection.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop")

  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show")
      } else {
        backToTopBtn.classList.remove("show")
      }
    })

    // Scroll to top when clicked
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
}

// Search Functionality
function initSearchFunctionality() {
  const searchInputs = document.querySelectorAll(".search-input, .hero-search-input")
  const searchButtons = document.querySelectorAll(".search-btn, .hero-search-btn")

  // Sample search data (in a real application, this would come from a database)
  const searchData = [
    { title: "Data Structures and Algorithms", category: "Notes", url: "semester-notes.html" },
    { title: "Object Oriented Programming", category: "Notes", url: "semester-notes.html" },
    { title: "Database Management System", category: "Notes", url: "semester-notes.html" },
    { title: "Computer Networks", category: "Notes", url: "semester-notes.html" },
    { title: "Operating Systems", category: "Notes", url: "semester-notes.html" },
    { title: "Software Engineering", category: "Notes", url: "semester-notes.html" },
    { title: "Web Technology", category: "Notes", url: "semester-notes.html" },
    { title: "Artificial Intelligence", category: "Notes", url: "semester-notes.html" },
    { title: "2023 Final Exam Questions", category: "Questions", url: "old-questions.html" },
    { title: "2022 Mid-term Questions", category: "Questions", url: "old-questions.html" },
    { title: "Programming MCQs", category: "MCQ", url: "mcqs.html" },
    { title: "Database MCQs", category: "MCQ", url: "mcqs.html" },
  ]

  // Handle search input
  searchInputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch(this.value)
      }
    })

    // Add autocomplete functionality
    input.addEventListener("input", function () {
      showSearchSuggestions(this, this.value)
    })
  })

  // Handle search button clicks
  searchButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input") || this.previousElementSibling
      if (input) {
        performSearch(input.value)
      }
    })
  })

  function performSearch(query) {
    if (!query.trim()) {
      showNotification("Please enter a search term", "warning")
      return
    }

    // Show loading state
    const searchBtn = document.querySelector(".hero-search-btn")
    if (searchBtn) {
      const originalText = searchBtn.textContent
      searchBtn.innerHTML = '<i class="fas fa-spinner search-loading"></i> Searching...'

      // Simulate search delay
      setTimeout(() => {
        searchBtn.textContent = originalText

        // Filter search results
        const results = searchData.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()),
        )

        displaySearchResults(results, query)
      }, 1000)
    }
  }

  function showSearchSuggestions(input, query) {
    // Remove existing suggestions
    const existingSuggestions = document.querySelector(".search-suggestions")
    if (existingSuggestions) {
      existingSuggestions.remove()
    }

    if (query.length < 2) return

    const suggestions = searchData.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5)

    if (suggestions.length > 0) {
      const suggestionBox = document.createElement("div")
      suggestionBox.className = "search-suggestions"
      suggestionBox.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
            `

      suggestions.forEach((item) => {
        const suggestionItem = document.createElement("div")
        suggestionItem.style.cssText = `
                    padding: 10px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid #f3f4f6;
                    transition: background-color 0.2s ease;
                `
        suggestionItem.innerHTML = `
                    <div style="font-weight: 500; color: #1f2937;">${item.title}</div>
                    <div style="font-size: 12px; color: #6b7280;">${item.category}</div>
                `

        suggestionItem.addEventListener("mouseenter", function () {
          this.style.backgroundColor = "#f8fafc"
        })

        suggestionItem.addEventListener("mouseleave", function () {
          this.style.backgroundColor = "transparent"
        })

        suggestionItem.addEventListener("click", () => {
          input.value = item.title
          suggestionBox.remove()
          performSearch(item.title)
        })

        suggestionBox.appendChild(suggestionItem)
      })

      input.parentElement.style.position = "relative"
      input.parentElement.appendChild(suggestionBox)
    }
  }

  function displaySearchResults(results, query) {
    if (results.length === 0) {
      showNotification(`No results found for "${query}"`, "info")
      return
    }

    // Create and show results modal
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
                <h3 style="margin: 0; color: #1f2937;">Search Results for "${query}"</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
            </div>
            <div class="search-results">
                ${results
                  .map(
                    (result) => `
                    <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s ease;" 
                         onclick="window.location.href='${result.url}'" 
                         onmouseenter="this.style.backgroundColor='#f8fafc'; this.style.borderColor='#6366f1';"
                         onmouseleave="this.style.backgroundColor='white'; this.style.borderColor='#e5e7eb';">
                        <div style="font-weight: 600; color: #1f2937; margin-bottom: 5px;">${result.title}</div>
                        <div style="font-size: 14px; color: #6366f1; font-weight: 500;">${result.category}</div>
                    </div>
                `,
                  )
                  .join("")}
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

    showNotification(`Found ${results.length} result(s) for "${query}"`, "success")
  }
}

// Dropdown Menu Functionality
function initDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const menu = dropdown.querySelector(".dropdown-menu")

    if (toggle && menu) {
      // Handle hover for desktop
      dropdown.addEventListener("mouseenter", () => {
        if (window.innerWidth > 768) {
          menu.style.opacity = "1"
          menu.style.visibility = "visible"
          menu.style.transform = "translateY(0)"
        }
      })

      dropdown.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768) {
          menu.style.opacity = "0"
          menu.style.visibility = "hidden"
          menu.style.transform = "translateY(-10px)"
        }
      })

      // Handle click for mobile
      toggle.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault()
          const isOpen = menu.style.display === "block"

          // Close all other dropdowns
          document.querySelectorAll(".dropdown-menu").forEach((m) => {
            m.style.display = "none"
          })

          // Toggle current dropdown
          menu.style.display = isOpen ? "none" : "block"
          menu.style.position = "static"
          menu.style.opacity = "1"
          menu.style.visibility = "visible"
          menu.style.transform = "none"
          menu.style.boxShadow = "none"
          menu.style.marginTop = "10px"
        }
      })
    }
  })
}

// Animation on Scroll
function initAnimations() {
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

  // Observe feature cards
  const featureCards = document.querySelectorAll(".feature-card")
  featureCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(card)
  })

  // Observe stat items
  const statItems = document.querySelectorAll(".stat-item")
  statItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(30px)"
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(item)
  })

  // Counter animation for stats
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

// Counter Animation
function animateCounter(element) {
  const target = Number.parseInt(element.textContent.replace(/[^\d]/g, ""))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    const suffix = element.textContent.includes("+") ? "+" : element.textContent.includes("%") ? "%" : ""
    element.textContent = Math.floor(current).toLocaleString() + suffix
  }, 16)
}

// Newsletter Form
function initNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter")

  if (newsletterForm) {
    const input = newsletterForm.querySelector("input")
    const button = newsletterForm.querySelector("button")

    button.addEventListener("click", (e) => {
      e.preventDefault()
      const email = input.value.trim()

      if (!email) {
        showNotification("Please enter your email address", "warning")
        return
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error")
        return
      }

      // Simulate subscription
      button.textContent = "Subscribing..."
      button.disabled = true

      setTimeout(() => {
        showNotification("Thank you for subscribing!", "success")
        input.value = ""
        button.textContent = "Subscribe"
        button.disabled = false
      }, 1500)
    })

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        button.click()
      }
    })
  }
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  const notification = document.createElement("div")
  notification.className = "notification"

  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#6366f1",
  }

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
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

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.background = "#fff"
    header.style.backdropFilter = "none"
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // ESC key to close modals and dropdowns
  if (e.key === "Escape") {
    // Close search suggestions
    const suggestions = document.querySelector(".search-suggestions")
    if (suggestions) suggestions.remove()

    // Close mobile menu
    const hamburger = document.querySelector(".hamburger")
    const navMenu = document.querySelector(".nav-menu")
    if (hamburger && navMenu) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.classList.remove("menu-open")
    }

    // Close any modals
    const modals = document.querySelectorAll('[style*="position: fixed"]')
    modals.forEach((modal) => {
      if (modal.style.zIndex === "10000") {
        modal.remove()
      }
    })
  }
})

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
  // Any scroll-based functionality can be added here
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)
