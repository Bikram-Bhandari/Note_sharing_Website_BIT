// Resources Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeResourceTabs()
  initializeResourceActions()
})

function initializeResourceTabs() {
  const resourceTabs = document.querySelectorAll(".resource-tab")
  const resourceContents = document.querySelectorAll(".resource-content")

  resourceTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetTab = this.dataset.tab

      // Remove active class from all tabs and contents
      resourceTabs.forEach((t) => t.classList.remove("active"))
      resourceContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      this.classList.add("active")
      const targetContent = document.getElementById(targetTab)
      if (targetContent) {
        targetContent.classList.add("active")
      }
    })
  })
}

function initializeResourceActions() {
  // Initialize all resource action buttons
  initializeDownloadButtons()
  initializePreviewButtons()
  initializeVideoButtons()
  initializeTestButtons()
  initializeBookButtons()
  initializeToolButtons()
}

function initializeDownloadButtons() {
  const downloadButtons = document.querySelectorAll('[onclick*="downloadResource"]')
  // Download buttons are handled by onclick attributes in HTML
}

function initializePreviewButtons() {
  const previewButtons = document.querySelectorAll('[onclick*="previewResource"]')
  // Preview buttons are handled by onclick attributes in HTML
}

function initializeVideoButtons() {
  const playButtons = document.querySelectorAll('[onclick*="playVideo"]')
  // Video buttons are handled by onclick attributes in HTML
}

function initializeTestButtons() {
  const testButtons = document.querySelectorAll('[onclick*="startTest"]')
  // Test buttons are handled by onclick attributes in HTML
}

function initializeBookButtons() {
  const bookButtons = document.querySelectorAll('[onclick*="viewBook"], [onclick*="downloadBook"]')
  // Book buttons are handled by onclick attributes in HTML
}

function initializeToolButtons() {
  const toolButtons = document.querySelectorAll('[onclick*="openTool"]')
  // Tool buttons are handled by onclick attributes in HTML
}

// Resource Action Functions
function downloadResource(resourceId) {
  showNotification(`Downloading resource: ${resourceId}`, "success")

  // Simulate download progress
  const progressModal = createProgressModal("Downloading...")
  document.body.appendChild(progressModal)

  let progress = 0
  const progressBar = progressModal.querySelector(".progress-fill")
  const progressText = progressModal.querySelector(".progress-text")

  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress > 100) progress = 100

    progressBar.style.width = `${progress}%`
    progressText.textContent = `${Math.round(progress)}%`

    if (progress >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        progressModal.remove()
        showNotification("Download completed!", "success")
      }, 500)
    }
  }, 200)
}

function previewResource(resourceId) {
  const modal = createPreviewModal(resourceId)
  document.body.appendChild(modal)
  showNotification(`Opening preview: ${resourceId}`, "info")
}

function playVideo(videoId) {
  const modal = createVideoModal(videoId)
  document.body.appendChild(modal)
  showNotification(`Playing video: ${videoId}`, "info")
}

function startTest(testId) {
  showNotification(`Starting test: ${testId}`, "info")
  // Redirect to MCQ page with specific test
  setTimeout(() => {
    window.location.href = "mcqs.html"
  }, 1000)
}

function viewTestDetails(testId) {
  const modal = createTestDetailsModal(testId)
  document.body.appendChild(modal)
}

function viewBook(bookId) {
  const modal = createBookDetailsModal(bookId)
  document.body.appendChild(modal)
}

function downloadBook(bookId) {
  showNotification(`Downloading book: ${bookId}`, "success")
  downloadResource(bookId) // Reuse download function
}

function openTool(toolId) {
  showNotification(`Opening tool: ${toolId}`, "info")
  // In a real application, this would open the tool in a new window/tab
  window.open("#", "_blank")
}

// Modal Creation Functions
function createProgressModal(title) {
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
        max-width: 400px;
        width: 100%;
        text-align: center;
    `

  modalContent.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #1f2937;">${title}</h3>
        <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
            <div class="progress-fill" style="height: 100%; background: #6366f1; width: 0%; transition: width 0.3s ease;"></div>
        </div>
        <div class="progress-text" style="color: #6b7280; font-weight: 500;">0%</div>
    `

  modal.appendChild(modalContent)
  return modal
}

function createPreviewModal(resourceId) {
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
        max-width: 800px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `

  modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #1f2937;">Resource Preview: ${resourceId}</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #6b7280; margin: 0;">This is a preview of the resource content. In a real application, this would show the actual document preview, images, or content excerpts.</p>
        </div>
        <div style="text-align: center;">
            <button onclick="downloadResource('${resourceId}')" style="background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-right: 10px;">
                <i class="fas fa-download"></i> Download Full Resource
            </button>
            <button class="close-modal" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                Close Preview
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

function createVideoModal(videoId) {
  const modal = document.createElement("div")
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
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
        padding: 20px;
        max-width: 900px;
        width: 100%;
    `

  modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: #1f2937;">Video: ${videoId}</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <div style="aspect-ratio: 16/9; background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
            <div style="text-align: center;">
                <i class="fas fa-play-circle" style="font-size: 64px; margin-bottom: 15px; display: block;"></i>
                Video Player Placeholder<br>
                <small style="opacity: 0.7;">In a real application, this would be an embedded video player</small>
            </div>
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <button class="close-modal" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                Close Video
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

function createTestDetailsModal(testId) {
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
            <h3 style="margin: 0; color: #1f2937;">Test Details: ${testId}</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <div style="color: #6b7280; line-height: 1.6;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937;">Test Information</h4>
                <p><strong>Duration:</strong> 45 minutes</p>
                <p><strong>Questions:</strong> 30 multiple choice</p>
                <p><strong>Difficulty:</strong> Intermediate</p>
                <p><strong>Topics Covered:</strong> Core concepts, practical applications, problem solving</p>
            </div>
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">Instructions</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Read each question carefully</li>
                    <li>Select the best answer from the given options</li>
                    <li>You can navigate between questions</li>
                    <li>Submit before time runs out</li>
                </ul>
            </div>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="startTest('${testId}')" style="background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-play"></i> Start Test
            </button>
            <button class="close-modal" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
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

function createBookDetailsModal(bookId) {
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
            <h3 style="margin: 0; color: #1f2937;">Book Details: ${bookId}</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="width: 100px; height: 130px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; flex-shrink: 0;">
                <i class="fas fa-book"></i>
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 10px 0; color: #1f2937;">Book Information</h4>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Author:</strong> Sample Author</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Publisher:</strong> Academic Press</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Edition:</strong> 3rd Edition</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Pages:</strong> 450</p>
                <div style="margin-top: 10px;">
                    <div style="color: #fbbf24; margin-bottom: 5px;">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                    <span style="font-size: 14px; color: #6b7280;">4.5/5 (1,234 reviews)</span>
                </div>
            </div>
        </div>
        <div style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            <h4 style="color: #1f2937;">Description</h4>
            <p>This comprehensive textbook covers all essential topics in the subject area. Written by industry experts, it provides both theoretical foundations and practical applications. Perfect for students and professionals alike.</p>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="downloadBook('${bookId}')" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="close-modal" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
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

// Notification Function
function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "info" ? "#6366f1" : "#ef4444"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10001;
    `

  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}
