// Enhanced Semester Management System
document.addEventListener("DOMContentLoaded", () => {
  initSemesterSystem()
  initSubjectInteractions()
  initProgressTracking()
  initSearchAndFilter()
})

// Initialize the semester system
function initSemesterSystem() {
  const tabs = document.querySelectorAll(".semester-tab")
  const panels = document.querySelectorAll(".semester-panel")

  // Add click event listeners to tabs
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const semester = this.dataset.semester
      switchSemester(semester, tabs, panels)
    })
  })

  // Initialize with first semester
  if (tabs.length > 0) {
    switchSemester("1", tabs, panels)
  }

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key >= "1" && e.key <= "8") {
      e.preventDefault()
      const semester = e.key
      switchSemester(semester, tabs, panels)
    }
  })
}

// Switch between semesters
function switchSemester(semester, tabs, panels) {
  // Remove active class from all tabs and panels
  tabs.forEach((t) => t.classList.remove("active"))
  panels.forEach((p) => p.classList.remove("active"))

  // Add active class to selected tab and panel
  const activeTab = document.querySelector(`[data-semester="${semester}"]`)
  const activePanel = document.getElementById(`semester${semester}`)

  if (activeTab && activePanel) {
    activeTab.classList.add("active")
    activePanel.classList.add("active")

    // Animate subject cards
    animateSubjectCards(activePanel)

    // Update URL without page reload
    updateURL(semester)

    // Track analytics
    trackSemesterView(semester)

    // Update progress indicators
    updateSemesterProgress(semester)
  }
}

// Animate subject cards when switching semesters
function animateSubjectCards(panel) {
  const cards = panel.querySelectorAll(".subject-card")

  cards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"

    setTimeout(() => {
      card.style.transition = "all 0.6s ease"
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 100)
  })
}

// Initialize subject interactions
function initSubjectInteractions() {
  // View Notes functionality
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-primary")) {
      e.preventDefault()
      const subjectCard = e.target.closest(".subject-card")
      const subjectName = subjectCard.querySelector("h3").textContent
      openSubjectModal(subjectName, "notes")
    }
  })

  // Download functionality
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-secondary")) {
      e.preventDefault()
      const subjectCard = e.target.closest(".subject-card")
      const subjectName = subjectCard.querySelector("h3").textContent
      downloadSubjectMaterial(subjectName)
    }
  })

  // Video functionality
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-tertiary")) {
      e.preventDefault()
      const subjectCard = e.target.closest(".subject-card")
      const subjectName = subjectCard.querySelector("h3").textContent
      openSubjectModal(subjectName, "videos")
    }
  })
}

// Open subject modal
function openSubjectModal(subjectName, type) {
  const modal = createSubjectModal(subjectName, type)
  document.body.appendChild(modal)

  // Animate modal in
  setTimeout(() => {
    modal.classList.add("show")
  }, 10)

  // Close modal functionality
  const closeBtn = modal.querySelector(".close-modal")
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(modal)
    }, 300)
  })

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeBtn.click()
    }
  })
}

// Create subject modal
function createSubjectModal(subjectName, type) {
  const modal = document.createElement("div")
  modal.className = "subject-modal"
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `

  const content = getSubjectContent(subjectName, type)

  modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="margin: 0; color: #1f2937; font-size: 28px;">${subjectName}</h2>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 5px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                ">&times;</button>
            </div>
            ${content}
        </div>
    `

  modal.classList.add = function (className) {
    if (className === "show") {
      this.style.opacity = "1"
      this.querySelector(".modal-content").style.transform = "translateY(0)"
    }
  }

  modal.classList.remove = function (className) {
    if (className === "show") {
      this.style.opacity = "0"
      this.querySelector(".modal-content").style.transform = "translateY(20px)"
    }
  }

  return modal
}

// Get subject content based on type
function getSubjectContent(subjectName, type) {
  const contentMap = {
    notes: generateNotesContent(subjectName),
    videos: generateVideosContent(subjectName),
    assignments: generateAssignmentsContent(subjectName),
  }

  return contentMap[type] || contentMap.notes
}

// Generate notes content
function generateNotesContent(subjectName) {
  const topics = getSubjectTopics(subjectName)

  return `
        <div class="subject-content">
            <div style="margin-bottom: 30px;">
                <h3 style="color: #6366f1; margin-bottom: 15px;">📚 Study Materials</h3>
                <p style="color: #6b7280; line-height: 1.6;">
                    Comprehensive notes and study materials for ${subjectName}. 
                    Click on any topic to access detailed content.
                </p>
            </div>
            
            <div class="topics-grid" style="display: grid; gap: 15px;">
                ${topics
                  .map(
                    (topic, index) => `
                    <div class="topic-item" style="
                        padding: 20px;
                        background: #f8fafc;
                        border-radius: 12px;
                        border-left: 4px solid #6366f1;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">
                                    ${topic.title}
                                </h4>
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                    ${topic.description}
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <span style="
                                    background: #6366f1;
                                    color: white;
                                    padding: 4px 8px;
                                    border-radius: 12px;
                                    font-size: 12px;
                                    font-weight: 500;
                                ">${topic.pages} pages</span>
                                <i class="fas fa-chevron-right" style="color: #6b7280;"></i>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button style="
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fas fa-download" style="margin-right: 8px;"></i>
                    Download All Notes
                </button>
            </div>
        </div>
    `
}

// Generate videos content
function generateVideosContent(subjectName) {
  const videos = getSubjectVideos(subjectName)

  return `
        <div class="subject-content">
            <div style="margin-bottom: 30px;">
                <h3 style="color: #6366f1; margin-bottom: 15px;">🎥 Video Lectures</h3>
                <p style="color: #6b7280; line-height: 1.6;">
                    Watch comprehensive video lectures for ${subjectName}. 
                    All videos are available in HD quality with subtitles.
                </p>
            </div>
            
            <div class="videos-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                ${videos
                  .map(
                    (video, index) => `
                    <div class="video-item" style="
                        background: #f8fafc;
                        border-radius: 12px;
                        overflow: hidden;
                        transition: all 0.3s ease;
                        cursor: pointer;
                    " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="
                            height: 180px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                        ">
                            <div style="
                                width: 60px;
                                height: 60px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 24px;
                            ">
                                <i class="fas fa-play"></i>
                            </div>
                            <div style="
                                position: absolute;
                                bottom: 10px;
                                right: 10px;
                                background: rgba(0, 0, 0, 0.7);
                                color: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                font-size: 12px;
                            ">${video.duration}</div>
                        </div>
                        <div style="padding: 20px;">
                            <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">
                                ${video.title}
                            </h4>
                            <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
                                ${video.description}
                            </p>
                            <div style="display: flex; justify-content: between; align-items: center; font-size: 12px; color: #9ca3af;">
                                <span><i class="fas fa-eye" style="margin-right: 4px;"></i>${video.views} views</span>
                                <span><i class="fas fa-clock" style="margin-right: 4px;"></i>${video.uploaded}</span>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
}

// Generate assignments content
function generateAssignmentsContent(subjectName) {
  const assignments = getSubjectAssignments(subjectName)

  return `
        <div class="subject-content">
            <div style="margin-bottom: 30px;">
                <h3 style="color: #6366f1; margin-bottom: 15px;">📝 Assignments</h3>
                <p style="color: #6b7280; line-height: 1.6;">
                    Complete assignments for ${subjectName}. 
                    Click on any assignment to view details.
                </p>
            </div>
            
            <div class="assignments-grid" style="display: grid; gap: 15px;">
                ${assignments
                  .map(
                    (assignment, index) => `
                    <div class="assignment-item" style="
                        padding: 20px;
                        background: #f8fafc;
                        border-radius: 12px;
                        border-left: 4px solid #6366f1;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">
                                    ${assignment.title}
                                </h4>
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                    ${assignment.description}
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <span style="
                                    background: #6366f1;
                                    color: white;
                                    padding: 4px 8px;
                                    border-radius: 12px;
                                    font-size: 12px;
                                    font-weight: 500;
                                ">Due: ${assignment.dueDate}</span>
                                <i class="fas fa-chevron-right" style="color: #6b7280;"></i>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
}

// Get subject topics (mock data)
function getSubjectTopics(subjectName) {
  const topicsMap = {
    "Mathematics I": [
      { title: "Differential Calculus", description: "Limits, derivatives, and applications", pages: 45 },
      { title: "Integral Calculus", description: "Integration techniques and applications", pages: 38 },
      { title: "Linear Algebra", description: "Matrices, vectors, and systems", pages: 52 },
      { title: "Differential Equations", description: "First and second order equations", pages: 41 },
    ],
    "Programming Fundamentals": [
      { title: "Introduction to C", description: "Syntax, variables, and data types", pages: 32 },
      { title: "Control Structures", description: "Loops, conditions, and branching", pages: 28 },
      { title: "Functions and Arrays", description: "Function design and array manipulation", pages: 35 },
      { title: "Pointers and Memory", description: "Memory management and pointer arithmetic", pages: 42 },
    ],
  }

  return (
    topicsMap[subjectName] || [
      { title: "Topic 1", description: "Introduction and fundamentals", pages: 25 },
      { title: "Topic 2", description: "Advanced concepts", pages: 30 },
      { title: "Topic 3", description: "Practical applications", pages: 35 },
    ]
  )
}

// Get subject videos (mock data)
function getSubjectVideos(subjectName) {
  return [
    {
      title: `${subjectName} - Lecture 1`,
      description: "Introduction and course overview",
      duration: "45:32",
      views: "1.2K",
      uploaded: "2 days ago",
    },
    {
      title: `${subjectName} - Lecture 2`,
      description: "Core concepts and principles",
      duration: "52:18",
      views: "987",
      uploaded: "5 days ago",
    },
    {
      title: `${subjectName} - Practical Session`,
      description: "Hands-on examples and exercises",
      duration: "38:45",
      views: "756",
      uploaded: "1 week ago",
    },
    {
      title: `${subjectName} - Problem Solving`,
      description: "Common problems and solutions",
      duration: "41:22",
      views: "643",
      uploaded: "1 week ago",
    },
  ]
}

// Get subject assignments (mock data)
function getSubjectAssignments(subjectName) {
  return [
    {
      title: `${subjectName} - Assignment 1`,
      description: "Introduction to programming concepts",
      dueDate: "2023-10-15",
    },
    {
      title: `${subjectName} - Assignment 2`,
      description: "Control structures and loops",
      dueDate: "2023-10-22",
    },
    {
      title: `${subjectName} - Assignment 3`,
      description: "Functions and arrays",
      dueDate: "2023-10-29",
    },
  ]
}

// Download subject material
function downloadSubjectMaterial(subjectName) {
  // Show loading state
  showNotification("Preparing download...", "info")

  // Simulate download process
  setTimeout(() => {
    // Create mock download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `${subjectName.replace(/\s+/g, "_")}_Notes.pdf`

    // Show success message
    showNotification(`${subjectName} materials downloaded successfully!`, "success")

    // Track download
    trackDownload(subjectName)
  }, 1500)
}

// Initialize progress tracking
function initProgressTracking() {
  // Update progress bars with animation
  const progressBars = document.querySelectorAll(".progress-fill")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target
        const width = progressBar.style.width
        progressBar.style.width = "0%"

        setTimeout(() => {
          progressBar.style.width = width
        }, 200)

        observer.unobserve(progressBar)
      }
    })
  })

  progressBars.forEach((bar) => observer.observe(bar))
}

// Initialize search and filter functionality
function initSearchAndFilter() {
  // Add search functionality
  const searchContainer = document.querySelector(".search-container")
  if (searchContainer) {
    const searchInput = searchContainer.querySelector(".search-input")
    if (searchInput) {
      searchInput.addEventListener("input", debounce(handleSubjectSearch, 300))
    }
  }

  // Add filter buttons
  addFilterButtons()
}

// Handle subject search
function handleSubjectSearch(e) {
  const query = e.target.value.toLowerCase()
  const activePanel = document.querySelector(".semester-panel.active")

  if (!activePanel) return

  const subjectCards = activePanel.querySelectorAll(".subject-card")

  subjectCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase()
    const description = card.querySelector("p").textContent.toLowerCase()

    if (title.includes(query) || description.includes(query)) {
      card.style.display = "block"
      card.style.opacity = "1"
    } else {
      card.style.display = "none"
      card.style.opacity = "0"
    }
  })

  // Show no results message if needed
  const visibleCards = Array.from(subjectCards).filter((card) => card.style.display !== "none")
  showNoResultsMessage(activePanel, visibleCards.length === 0 && query.length > 0)
}

// Add filter buttons
function addFilterButtons() {
  const semesterNav = document.querySelector(".semester-nav .container")
  if (!semesterNav) return

  const filterContainer = document.createElement("div")
  filterContainer.className = "subject-filters"
  filterContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 20px;
        flex-wrap: wrap;
    `

  const filters = [
    { label: "All", value: "all", active: true },
    { label: "Core", value: "core" },
    { label: "Elective", value: "elective" },
    { label: "General", value: "general" },
    { label: "Project", value: "project" },
  ]

  filters.forEach((filter) => {
    const button = document.createElement("button")
    button.className = `filter-btn ${filter.active ? "active" : ""}`
    button.textContent = filter.label
    button.dataset.filter = filter.value
    button.style.cssText = `
            background: ${filter.active ? "#6366f1" : "#f8fafc"};
            color: ${filter.active ? "white" : "#6b7280"};
            border: 2px solid ${filter.active ? "#6366f1" : "#e5e7eb"};
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        `

    button.addEventListener("click", () => handleSubjectFilter(filter.value, button))
    filterContainer.appendChild(button)
  })

  semesterNav.appendChild(filterContainer)
}

// Handle subject filtering
function handleSubjectFilter(filterValue, clickedButton) {
  // Update active filter button
  const filterButtons = document.querySelectorAll(".filter-btn")
  filterButtons.forEach((btn) => {
    btn.classList.remove("active")
    btn.style.background = "#f8fafc"
    btn.style.color = "#6b7280"
    btn.style.borderColor = "#e5e7eb"
  })

  clickedButton.classList.add("active")
  clickedButton.style.background = "#6366f1"
  clickedButton.style.color = "white"
  clickedButton.style.borderColor = "#6366f1"

  // Filter subjects
  const activePanel = document.querySelector(".semester-panel.active")
  if (!activePanel) return

  const subjectCards = activePanel.querySelectorAll(".subject-card")

  subjectCards.forEach((card) => {
    const badge = card.querySelector(".subject-badge")
    const badgeType = badge ? badge.className.split(" ").pop() : "general"

    if (filterValue === "all" || badgeType === filterValue) {
      card.style.display = "block"
      setTimeout(() => {
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, 50)
    } else {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      setTimeout(() => {
        card.style.display = "none"
      }, 300)
    }
  })
}

// Show no results message
function showNoResultsMessage(container, show) {
  let noResultsDiv = container.querySelector(".no-results-semester")

  if (show && !noResultsDiv) {
    noResultsDiv = document.createElement("div")
    noResultsDiv.className = "no-results-semester"
    noResultsDiv.style.cssText = `
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
        `
    noResultsDiv.innerHTML = `
            <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
            <h3 style="font-size: 24px; margin-bottom: 10px;">No subjects found</h3>
            <p>Try adjusting your search terms or filters.</p>
        `
    container.appendChild(noResultsDiv)
  } else if (!show && noResultsDiv) {
    noResultsDiv.remove()
  }
}

// Update URL without page reload
function updateURL(semester) {
  const url = new URL(window.location)
  url.searchParams.set("semester", semester)
  window.history.pushState({}, "", url)
}

// Update semester progress
function updateSemesterProgress(semester) {
  // This would typically fetch real progress data
  const progressData = getSemesterProgressData(semester)
  updateProgressIndicators(progressData)
}

// Get semester progress data (mock)
function getSemesterProgressData(semester) {
  const progressMap = {
    1: { completed: 4, total: 6, percentage: 67 },
    2: { completed: 3, total: 6, percentage: 50 },
    3: { completed: 2, total: 6, percentage: 33 },
    4: { completed: 1, total: 6, percentage: 17 },
    5: { completed: 0, total: 6, percentage: 0 },
    6: { completed: 0, total: 6, percentage: 0 },
    7: { completed: 0, total: 6, percentage: 0 },
    8: { completed: 0, total: 5, percentage: 0 },
  }

  return progressMap[semester] || { completed: 0, total: 6, percentage: 0 }
}

// Update progress indicators
function updateProgressIndicators(progressData) {
  // Update any global progress indicators
  const progressElements = document.querySelectorAll(".semester-progress")
  progressElements.forEach((element) => {
    element.textContent = `${progressData.completed}/${progressData.total} subjects completed`
  })
}

// Track semester view for analytics
function trackSemesterView(semester) {
  // Analytics tracking would go here
  console.log(`Semester ${semester} viewed`)
}

// Track download for analytics
function trackDownload(subjectName) {
  // Analytics tracking would go here
  console.log(`Downloaded: ${subjectName}`)
}

// Utility function for debouncing
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

// Show notification function (reuse from main script)
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

// Initialize semester system on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSemesterSystem)
} else {
  initSemesterSystem()
}
