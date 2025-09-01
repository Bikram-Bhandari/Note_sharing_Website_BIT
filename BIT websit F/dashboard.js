// Dashboard JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
  initializeProgressChart()
  initializeGoals()
  loadDashboardData()
})

function initializeDashboard() {
  // Initialize chart controls
  const chartButtons = document.querySelectorAll(".chart-btn")
  chartButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      chartButtons.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
      updateProgressChart(this.dataset.period)
    })
  })

  // Initialize quick actions
  initializeQuickActions()
}

function initializeQuickActions() {
  // Quick actions are handled by onclick attributes in HTML
  // This function can be extended for additional quick action functionality
}

function startQuickQuiz() {
  showNotification("Starting quick quiz...", "info")
  setTimeout(() => {
    window.location.href = "mcqs.html"
  }, 1000)
}

function viewBookmarks() {
  showNotification("Opening bookmarks...", "info")
  // In a real application, this would show a bookmarks modal or page
  showBookmarksModal()
}

function downloadProgress() {
  showNotification("Generating progress report...", "info")

  // Simulate report generation
  setTimeout(() => {
    const reportData = generateProgressReport()
    downloadFile("progress-report.json", JSON.stringify(reportData, null, 2))
    showNotification("Progress report downloaded!", "success")
  }, 2000)
}

function generateProgressReport() {
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  return {
    user: {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      semester: userData.semester,
    },
    stats: {
      resourcesAccessed: 24,
      quizQuestions: 156,
      averageScore: 87,
      studyTime: "12.5h",
    },
    recentActivity: [
      { type: "quiz", subject: "Database", score: 92, date: new Date().toISOString() },
      { type: "download", resource: "Data Structures Guide", date: new Date().toISOString() },
      { type: "bookmark", resource: "Computer Networks", date: new Date().toISOString() },
    ],
    goals: [
      { name: "Complete Database Course", progress: 75 },
      { name: "Master Data Structures", progress: 45 },
      { name: "Network Fundamentals", progress: 20 },
    ],
    generatedAt: new Date().toISOString(),
  }
}

function downloadFile(filename, content) {
  const element = document.createElement("a")
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
  element.setAttribute("download", filename)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function initializeProgressChart() {
  const canvas = document.getElementById("progressChart")
  if (!canvas) return

  // Simple canvas-based chart (in a real app, you'd use Chart.js or similar)
  const ctx = canvas.getContext("2d")
  drawProgressChart(ctx, "week")
}

function drawProgressChart(ctx, period) {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Sample data
  const weekData = [20, 35, 45, 30, 55, 40, 65]
  const monthData = [120, 150, 180, 160, 200, 175, 220, 190, 240, 210, 260, 230, 280, 250, 300]

  const data = period === "week" ? weekData : monthData.slice(0, 7) // Show last 7 days of month data
  const labels = period === "week" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["W1", "W2", "W3", "W4"]

  // Chart dimensions
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Find max value for scaling
  const maxValue = Math.max(...data)
  const scale = chartHeight / maxValue

  // Draw grid lines
  ctx.strokeStyle = "#e5e7eb"
  ctx.lineWidth = 1

  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  // Draw data line
  ctx.strokeStyle = "#6366f1"
  ctx.lineWidth = 3
  ctx.beginPath()

  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = height - padding - value * scale

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Draw data points
  ctx.fillStyle = "#6366f1"
  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = height - padding - value * scale

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Draw labels
  ctx.fillStyle = "#6b7280"
  ctx.font = "12px Inter"
  ctx.textAlign = "center"

  data.forEach((value, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const label = labels[index] || `D${index + 1}`
    ctx.fillText(label, x, height - 10)
  })
}

function updateProgressChart(period) {
  const canvas = document.getElementById("progressChart")
  if (canvas) {
    const ctx = canvas.getContext("2d")
    drawProgressChart(ctx, period)
  }
}

function initializeGoals() {
  // Initialize progress circles
  const progressCircles = document.querySelectorAll(".progress-circle")
  progressCircles.forEach((circle) => {
    const progress = Number.parseInt(circle.dataset.progress)
    const degrees = (progress / 100) * 360
    circle.style.setProperty("--progress", `${degrees}deg`)
  })
}

function addGoal() {
  const modal = createAddGoalModal()
  document.body.appendChild(modal)
}

function createAddGoalModal() {
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
        max-width: 500px;
        width: 100%;
    `

  modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h3 style="margin: 0; color: #1f2937;">Add New Goal</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <form id="addGoalForm">
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Goal Title</label>
                <input type="text" name="title" placeholder="Enter goal title" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Description</label>
                <textarea name="description" placeholder="Describe your goal" rows="3" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
            </div>
            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">Target Date</label>
                <input type="date" name="targetDate" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px;">
            </div>
            <div style="display: flex; gap: 15px; justify-content: flex-end;">
                <button type="button" class="close-modal" style="background: #f3f4f6; color: #374151; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
                    Cancel
                </button>
                <button type="submit" style="background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
                    Add Goal
                </button>
            </div>
        </form>
    `

  modal.appendChild(modalContent)

  // Handle form submission
  const form = modalContent.querySelector("#addGoalForm")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const goalData = {
      title: formData.get("title"),
      description: formData.get("description"),
      targetDate: formData.get("targetDate"),
      progress: 0,
      createdAt: new Date().toISOString(),
    }

    // Save goal (in real app, this would go to server)
    saveGoal(goalData)
    showNotification("Goal added successfully!", "success")
    modal.remove()
    loadDashboardData() // Refresh dashboard
  })

  // Close modal functionality
  const closeButtons = modal.querySelectorAll(".close-modal")
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => modal.remove())
  })

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })

  return modal
}

function saveGoal(goalData) {
  const existingGoals = JSON.parse(localStorage.getItem("userGoals") || "[]")
  existingGoals.push(goalData)
  localStorage.setItem("userGoals", JSON.stringify(existingGoals))
}

function showBookmarksModal() {
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
        max-width: 700px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `

  modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h3 style="margin: 0; color: #1f2937;">Your Bookmarks</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <div class="bookmarks-list">
            ${generateBookmarksList()}
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

function generateBookmarksList() {
  const bookmarks = [
    {
      title: "Data Structures and Algorithms",
      type: "Study Material",
      subject: "Computer Science",
      date: "2 days ago",
      icon: "fas fa-book",
    },
    {
      title: "Database Normalization Quiz",
      type: "Quiz",
      subject: "Database Management",
      date: "1 week ago",
      icon: "fas fa-question-circle",
    },
    {
      title: "Network Security Fundamentals",
      type: "Video Lecture",
      subject: "Computer Networks",
      date: "2 weeks ago",
      icon: "fas fa-play-circle",
    },
    {
      title: "Object-Oriented Programming Guide",
      type: "Reference",
      subject: "Programming",
      date: "3 weeks ago",
      icon: "fas fa-file-alt",
    },
  ]

  return bookmarks
    .map(
      (bookmark) => `
        <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 10px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">
                <i class="${bookmark.icon}"></i>
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 4px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${bookmark.title}</h4>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${bookmark.subject} • ${bookmark.type}</p>
                <span style="color: #9ca3af; font-size: 12px;">Bookmarked ${bookmark.date}</span>
            </div>
            <button style="background: none; border: none; color: #6b7280; cursor: pointer; padding: 5px;" title="Remove bookmark">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `,
    )
    .join("")
}

function loadDashboardData() {
  // Load user-specific dashboard data
  const userData = JSON.parse(localStorage.getItem("user") || "{}")
  const userGoals = JSON.parse(localStorage.getItem("userGoals") || "[]")

  // Update dashboard with user data
  updateDashboardStats()
  updateRecentActivity()
  updateGoalsList(userGoals)
}

function updateDashboardStats() {
  // In a real application, this would fetch actual user statistics
  // For demo purposes, we'll use static data with some randomization
  const stats = {
    resources: Math.floor(Math.random() * 10) + 20,
    questions: Math.floor(Math.random() * 50) + 130,
    score: Math.floor(Math.random() * 15) + 80,
    studyTime: (Math.random() * 5 + 10).toFixed(1),
  }

  // Update stat cards if they exist
  const statCards = document.querySelectorAll(".stat-card")
  if (statCards.length >= 4) {
    statCards[0].querySelector("h3").textContent = stats.resources
    statCards[1].querySelector("h3").textContent = stats.questions
    statCards[2].querySelector("h3").textContent = `${stats.score}%`
    statCards[3].querySelector("h3").textContent = `${stats.studyTime}h`
  }
}

function updateRecentActivity() {
  // Generate recent activity based on user actions
  // In a real app, this would come from a database
  const activities = [
    {
      icon: "fas fa-file-alt",
      title: "Completed Database Quiz",
      description: `Scored ${Math.floor(Math.random() * 20) + 80}% on Database Management quiz`,
      time: "2 hours ago",
      score: Math.floor(Math.random() * 20) + 80,
    },
    {
      icon: "fas fa-download",
      title: "Downloaded Study Material",
      description: "Data Structures and Algorithms Guide",
      time: "5 hours ago",
    },
    {
      icon: "fas fa-bookmark",
      title: "Bookmarked Resource",
      description: "Computer Networks - OSI Model",
      time: "1 day ago",
    },
    {
      icon: "fas fa-video",
      title: "Watched Video Lecture",
      description: "Object-Oriented Programming Concepts",
      time: "2 days ago",
    },
  ]

  // Update activity list if it exists
  const activityList = document.querySelector(".activity-list")
  if (activityList) {
    activityList.innerHTML = activities
      .map(
        (activity) => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
                ${activity.score ? `<div class="activity-score">${activity.score}%</div>` : ""}
            </div>
        `,
      )
      .join("")
  }
}

function updateGoalsList(goals) {
  if (goals.length === 0) return

  const goalsList = document.querySelector(".goals-list")
  if (goalsList) {
    // Add user goals to existing goals
    goals.forEach((goal) => {
      const goalElement = document.createElement("div")
      goalElement.className = "goal-item"
      goalElement.innerHTML = `
                <div class="goal-content">
                    <h4>${goal.title}</h4>
                    <p>${goal.description}</p>
                </div>
                <div class="goal-progress">
                    <div class="progress-circle" data-progress="${goal.progress}" style="--progress: ${(goal.progress / 100) * 360}deg">
                        <span>${goal.progress}%</span>
                    </div>
                </div>
            `
      goalsList.appendChild(goalElement)
    })
  }
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

// Initialize dashboard animations
function initializeDashboardAnimations() {
  // Animate stats cards on load
  const statCards = document.querySelectorAll(".stat-card")
  statCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    setTimeout(() => {
      card.style.transition = "all 0.6s ease"
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 100)
  })

  // Animate dashboard cards
  const dashboardCards = document.querySelectorAll(".dashboard-card")
  dashboardCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    setTimeout(
      () => {
        card.style.transition = "all 0.6s ease"
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      },
      200 + index * 150,
    )
  })
}

// Run animations when dashboard loads
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeDashboardAnimations, 500)
})
