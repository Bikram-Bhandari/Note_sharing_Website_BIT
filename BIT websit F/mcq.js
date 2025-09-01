// MCQ Page JavaScript

let currentQuiz = null
let currentQuestionIndex = 0
let userAnswers = []
let quizTimer = null
let timeRemaining = 0

// Sample quiz data
const quizData = {
  programming: {
    title: "Programming Fundamentals",
    timeLimit: 15, // minutes
    questions: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1,
        explanation:
          "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      },
      {
        question: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1,
        explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
      },
      {
        question: "What does 'void' mean in C programming?",
        options: ["Empty function", "No return value", "Invalid syntax", "Memory allocation"],
        correct: 1,
        explanation: "The 'void' keyword indicates that a function does not return any value.",
      },
      {
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
        correct: 2,
        explanation:
          "Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting.",
      },
      {
        question: "What is recursion in programming?",
        options: ["A loop structure", "A function calling itself", "Memory allocation", "Variable declaration"],
        correct: 1,
        explanation: "Recursion is a programming technique where a function calls itself to solve a problem.",
      },
    ],
  },
  database: {
    title: "Database Management",
    timeLimit: 20,
    questions: [
      {
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "Standard Query Language",
          "System Query Language",
        ],
        correct: 0,
        explanation: "SQL stands for Structured Query Language, used for managing relational databases.",
      },
      {
        question: "Which normal form eliminates transitive dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correct: 2,
        explanation: "Third Normal Form (3NF) eliminates transitive dependencies in database tables.",
      },
      {
        question: "What is a primary key?",
        options: ["A foreign reference", "A unique identifier", "An index", "A constraint"],
        correct: 1,
        explanation: "A primary key is a unique identifier for each record in a database table.",
      },
      {
        question: "Which JOIN returns all records from both tables?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
        correct: 3,
        explanation: "FULL OUTER JOIN returns all records from both tables, including unmatched records.",
      },
    ],
  },
}

function showNotification(message, type) {
  console.log(`Notification: ${message} (Type: ${type})`)
}

function startQuiz(category) {
  if (!quizData[category]) {
    showNotification("Quiz category not found!", "error")
    return
  }

  currentQuiz = quizData[category]
  currentQuestionIndex = 0
  userAnswers = new Array(currentQuiz.questions.length).fill(null)
  timeRemaining = currentQuiz.timeLimit * 60 // Convert to seconds

  // Hide categories and show quiz interface
  document.querySelector(".mcq-categories").style.display = "none"
  document.getElementById("quizInterface").style.display = "block"

  // Start timer
  startTimer()

  // Load first question
  loadQuestion()

  showNotification(`Started ${currentQuiz.title} quiz!`, "success")
}

function startTimer() {
  const timerElement = document.getElementById("timer")

  quizTimer = setInterval(() => {
    timeRemaining--

    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60

    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

    // Change color when time is running low
    if (timeRemaining <= 300) {
      // 5 minutes
      timerElement.style.color = "#ef4444"
    }

    if (timeRemaining <= 0) {
      clearInterval(quizTimer)
      submitQuiz()
    }
  }, 1000)
}

function loadQuestion() {
  if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) return

  const question = currentQuiz.questions[currentQuestionIndex]
  const questionText = document.getElementById("questionText")
  const optionsContainer = document.getElementById("optionsContainer")
  const progressFill = document.getElementById("progressFill")
  const progressText = document.getElementById("progressText")

  // Update question text
  questionText.textContent = question.question

  // Clear and populate options
  optionsContainer.innerHTML = ""
  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div")
    optionElement.className = "option"
    optionElement.textContent = option
    optionElement.addEventListener("click", () => selectOption(index))

    // Restore previous selection
    if (userAnswers[currentQuestionIndex] === index) {
      optionElement.classList.add("selected")
    }

    optionsContainer.appendChild(optionElement)
  })

  // Update progress
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
  progressFill.style.width = `${progress}%`
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`

  // Update navigation buttons
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const submitBtn = document.getElementById("submitBtn")

  prevBtn.style.display = currentQuestionIndex === 0 ? "none" : "block"

  if (currentQuestionIndex === currentQuiz.questions.length - 1) {
    nextBtn.style.display = "none"
    submitBtn.style.display = "block"
  } else {
    nextBtn.style.display = "block"
    submitBtn.style.display = "none"
  }
}

function selectOption(optionIndex) {
  // Remove previous selection
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("selected")
  })

  // Add selection to clicked option
  document.querySelectorAll(".option")[optionIndex].classList.add("selected")

  // Store answer
  userAnswers[currentQuestionIndex] = optionIndex
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--
    loadQuestion()
  }
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    currentQuestionIndex++
    loadQuestion()
  }
}

function submitQuiz() {
  // Stop timer
  if (quizTimer) {
    clearInterval(quizTimer)
  }

  // Calculate results
  let correctAnswers = 0
  currentQuiz.questions.forEach((question, index) => {
    if (userAnswers[index] === question.correct) {
      correctAnswers++
    }
  })

  const totalQuestions = currentQuiz.questions.length
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  // Hide quiz interface and show results
  document.getElementById("quizInterface").style.display = "none"
  document.getElementById("quizResults").style.display = "block"

  // Update results display
  document.getElementById("scorePercentage").textContent = `${percentage}%`
  document.getElementById("correctAnswers").textContent = correctAnswers
  document.getElementById("totalQuestions").textContent = totalQuestions

  // Set score message
  const scoreMessage = document.getElementById("scoreMessage")
  if (percentage >= 90) {
    scoreMessage.textContent = "Excellent work!"
    scoreMessage.style.color = "#10b981"
  } else if (percentage >= 70) {
    scoreMessage.textContent = "Good job!"
    scoreMessage.style.color = "#6366f1"
  } else if (percentage >= 50) {
    scoreMessage.textContent = "Keep practicing!"
    scoreMessage.style.color = "#f59e0b"
  } else {
    scoreMessage.textContent = "Need more study!"
    scoreMessage.style.color = "#ef4444"
  }

  showNotification(`Quiz completed! You scored ${percentage}%`, "success")
}

function retakeQuiz() {
  // Reset quiz state
  currentQuestionIndex = 0
  userAnswers = new Array(currentQuiz.questions.length).fill(null)
  timeRemaining = currentQuiz.timeLimit * 60

  // Hide results and show quiz interface
  document.getElementById("quizResults").style.display = "none"
  document.getElementById("quizInterface").style.display = "block"

  // Restart timer and load first question
  startTimer()
  loadQuestion()
}

function viewAnswers() {
  // This would show a detailed review of all questions and answers
  showNotification("Answer review feature coming soon!", "info")
}

function backToCategories() {
  // Reset everything and go back to categories
  if (quizTimer) {
    clearInterval(quizTimer)
  }

  document.getElementById("quizResults").style.display = "none"
  document.getElementById("quizInterface").style.display = "none"
  document.querySelector(".mcq-categories").style.display = "block"

  currentQuiz = null
  currentQuestionIndex = 0
  userAnswers = []
}
