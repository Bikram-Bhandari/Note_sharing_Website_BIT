// Old Questions Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeFilters()
  initializeQuestionActions()
})

function initializeFilters() {
  const yearFilter = document.getElementById("yearFilter")
  const semesterFilter = document.getElementById("semesterFilter")
  const examFilter = document.getElementById("examFilter")
  const resetButton = document.getElementById("resetFilters")

  // Add event listeners to filters
  ;[yearFilter, semesterFilter, examFilter].forEach((filter) => {
    if (filter) {
      filter.addEventListener("change", applyFilters)
    }
  })

  // Reset filters
  if (resetButton) {
    resetButton.addEventListener("click", resetFilters)
  }
}

function applyFilters() {
  const yearFilter = document.getElementById("yearFilter").value
  const semesterFilter = document.getElementById("semesterFilter").value
  const examFilter = document.getElementById("examFilter").value

  const questionCards = document.querySelectorAll(".question-card")
  const noResults = document.getElementById("noResults")
  let visibleCount = 0

  questionCards.forEach((card) => {
    const cardYear = card.dataset.year
    const cardSemester = card.dataset.semester
    const cardType = card.dataset.type

    const yearMatch = !yearFilter || cardYear === yearFilter
    const semesterMatch = !semesterFilter || cardSemester === semesterFilter
    const typeMatch = !examFilter || cardType === examFilter

    if (yearMatch && semesterMatch && typeMatch) {
      card.style.display = "block"
      visibleCount++
    } else {
      card.style.display = "none"
    }
  })

  // Show/hide no results message
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? "block" : "none"
  }
}

function resetFilters() {
  document.getElementById("yearFilter").value = ""
  document.getElementById("semesterFilter").value = ""
  document.getElementById("examFilter").value = ""

  // Show all cards
  const questionCards = document.querySelectorAll(".question-card")
  questionCards.forEach((card) => {
    card.style.display = "block"
  })

  // Hide no results message
  const noResults = document.getElementById("noResults")
  if (noResults) {
    noResults.style.display = "none"
  }
}

function initializeQuestionActions() {
  // These functions would typically interact with a backend
  // For demo purposes, they show notifications
}

function viewQuestion(questionId) {
  showNotification(`Opening question: ${questionId}`, "info")
  // In a real application, this would open the question in a modal or new page
}

function downloadQuestion(questionId) {
  showNotification(`Downloading question: ${questionId}`, "success")
  // In a real application, this would trigger a file download
}

function viewSolution(questionId) {
  showNotification(`Opening solution for: ${questionId}`, "info")
  // In a real application, this would show the solution
}

function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
  // Implement actual notification logic here
}
