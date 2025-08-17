const API_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API placeholder
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// -------------------------
// Show a random quote
// -------------------------
function showRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (categoryFilter !== "all") {
    filteredQuotes = quotes.filter(q => q.category === categoryFilter);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").innerText = filteredQuotes[randomIndex].text;
}

// -------------------------
// Populate categories dropdown
// -------------------------
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// -------------------------
// Add a new quote locally + post to server
// -------------------------
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQ = { text, category };
    quotes.push(newQ);

    // Save locally
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Post to server
    postQuoteToServer(newQ);

    // Update UI
    populateCategories();

    textInput.value = "";
    categoryInput.value = "";
  }
}

// -------------------------
// Fetch quotes from server
// -------------------------
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Simulate that server "posts" contain quotes with categories
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    mergeQuotes(serverQuotes);
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}

// -------------------------
// Post a new quote to server
// -------------------------
async function postQuoteToServer(quote) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });

    const saved = await res.json();
    console.log("Posted to server:", saved);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// -------------------------
// Sync quotes (resolve conflicts)
// -------------------------
function syncQuotes() {
  console.log("Syncing with server...");
  fetchQuotesFromServer();
}

// -------------------------
// Merge + resolve conflicts
// -------------------------
function mergeQuotes(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    if (!quotes.some(localQuote => localQuote.text === serverQuote.text)) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    notifyUpdate();
  }
}

// -------------------------
// UI Notification for updates
// -------------------------
function notifyUpdate(message = "Quotes updated from server!", isConflict = false) {
  const noteArea = document.getElementById("notificationArea");
  noteArea.textContent = message;
  noteArea.style.background = isConflict ? "lightcoral" : "lightgreen";
  noteArea.style.border = "1px solid " + (isConflict ? "red" : "green");
}


// -------------------------
// Event listeners
// -------------------------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", showRandomQuote);

// -------------------------
// Periodically sync
// -------------------------
setInterval(syncQuotes, 15000); // every 15 sec

// -------------------------
// Initialize
// -------------------------
populateCategories();
fetchQuotesFromServer();
