// Notices Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeNoticeFilters()
  initializeNoticeActions()
})

function initializeNoticeFilters() {
  const categoryFilters = document.querySelectorAll(".category-filter")

  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Remove active class from all filters
      categoryFilters.forEach((f) => f.classList.remove("active"))

      // Add active class to clicked filter
      this.classList.add("active")

      // Filter notices
      const category = this.dataset.category
      filterNotices(category)
    })
  })
}

function filterNotices(category) {
  const noticeCards = document.querySelectorAll(".notice-card")

  noticeCards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block"
      // Add fade-in animation
      card.style.opacity = "0"
      setTimeout(() => {
        card.style.opacity = "1"
      }, 100)
    } else {
      card.style.display = "none"
    }
  })
}

function initializeNoticeActions() {
  // Initialize notice action buttons
  const noticeCards = document.querySelectorAll(".notice-card")

  noticeCards.forEach((card) => {
    // Add click event to entire card for better UX
    card.addEventListener("click", function (e) {
      // Don't trigger if clicking on action buttons
      if (!e.target.closest(".notice-actions")) {
        const noticeId = this.dataset.noticeId || "sample-notice"
        viewNotice(noticeId)
      }
    })
  })
}

function viewNotice(noticeId) {
  // Create modal for notice details
  const modal = createNoticeModal(noticeId)
  document.body.appendChild(modal)

  showNotification(`Opening notice: ${noticeId}`, "info")
}

function createNoticeModal(noticeId) {
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
            <h3 style="margin: 0; color: #1f2937;">Notice Details</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <div style="color: #6b7280; line-height: 1.6;">
            <p><strong>Notice ID:</strong> ${noticeId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Category:</strong> Academic</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p>This is a detailed view of the notice. In a real application, this would contain the full notice content, attachments, and related information.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="downloadNotice('${noticeId}')" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="close-modal" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                Close
            </button>
        </div>
    `

  modal.appendChild(modalContent)

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

function downloadNotice(noticeId) {
  showNotification(`Downloading notice: ${noticeId}`, "success")
  // In a real application, this would trigger a file download
}

function registerEvent(eventId) {
  showNotification(`Registering for event: ${eventId}`, "success")
  // In a real application, this would open a registration form
}

function loadMoreNotices() {
  const noticesGrid = document.querySelector(".notices-grid")
  const loadMoreBtn = document.querySelector(".btn-load-more")

  // Show loading state
  loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
  loadMoreBtn.disabled = true

  // Simulate loading delay
  setTimeout(() => {
    // Add more notice cards (in a real app, this would fetch from server)
    const additionalNotices = createAdditionalNotices()
    additionalNotices.forEach((notice) => {
      noticesGrid.appendChild(notice)
    })

    // Reset button
    loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Notices'
    loadMoreBtn.disabled = false

    showNotification("More notices loaded!", "success")
  }, 1500)
}

function createAdditionalNotices() {
  const notices = []
  const sampleNotices = [
    {
      category: "general",
      badge: "General",
      date: "Dec 1, 2024",
      title: "Campus Maintenance Schedule",
      content: "Scheduled maintenance work will be carried out in various campus buildings during the winter break.",
      views: "423",
    },
    {
      category: "academic",
      badge: "Academic",
      date: "Nov 28, 2024",
      title: "Research Paper Submission Guidelines",
      content: "Updated guidelines for research paper submissions for the upcoming academic conference.",
      views: "567",
    },
  ]

  sampleNotices.forEach((noticeData) => {
    const noticeCard = document.createElement("div")
    noticeCard.className = "notice-card"
    noticeCard.dataset.category = noticeData.category

    noticeCard.innerHTML = `
            <div class="notice-header">
                <div class="notice-badge">${noticeData.badge}</div>
                <div class="notice-date">${noticeData.date}</div>
            </div>
            <div class="notice-content">
                <h3>${noticeData.title}</h3>
                <p>${noticeData.content}</p>
                <div class="notice-meta">
                    <span><i class="fas fa-tag"></i> ${noticeData.badge}</span>
                    <span><i class="fas fa-eye"></i> ${noticeData.views} views</span>
                </div>
            </div>
            <div class="notice-actions">
                <button class="btn-primary" onclick="viewNotice('${noticeData.title.toLowerCase().replace(/\s+/g, "-")}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        `

    notices.push(noticeCard)
  })

  return notices
}

function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
  // In a real application, this would display a notification to the user
}
