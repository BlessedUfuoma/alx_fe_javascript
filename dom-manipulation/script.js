// --- Global state ---
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" }
];
const serverURL = "https://jsonplaceholder.typicode.com/posts";

// --- UI Functions ---
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = "";

  const categories = [...new Set(quotes.map(q => q.category))];
  const allOpt = document.createElement("option");
  allOpt.value = "all";
  allOpt.textContent = "All Categories";
  filter.appendChild(allOpt);

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
}

function showRandomQuote() {
  const filter = document.getElementById("categoryFilter").value;
  const filtered = filter === "all" ? quotes : quotes.filter(q => q.category === filter);

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  const display = document.getElementById("quoteDisplay");
  display.textContent = quote ? `"${quote.text}" (${quote.category})` : "No quotes available.";
}

function createAddQuoteForm() {
  const form = document.getElementById("formContainer");
  form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    showRandomQuote();
    postQuoteToServer(newQuote);
  }
}

// --- Notification system ---
function notifyUpdate(message = "Quotes updated from server!", isConflict = false) {
  const noteArea = document.getElementById("notificationArea");
  noteArea.textContent = message;
  noteArea.style.background = isConflict ? "lightcoral" : "lightgreen";
  noteArea.style.border = "1px solid " + (isConflict ? "red" : "green");
}

// --- Mock API Integration ---
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(serverURL);
    const data = await res.json();
    // Map server response into quote-like objects
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (err) {
    console.error("Fetch failed", err);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(serverURL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    notifyUpdate("Quote posted to server!");
  } catch (err) {
    console.error("Post failed", err);
  }
}

// --- Sync Logic ---
function mergeQuotes(serverQuotes) {
  let updated = false;
  let conflict = false;

  serverQuotes.forEach(serverQuote => {
    const localQuote = quotes.find(q => q.text === serverQuote.text);

    if (!localQuote) {
      quotes.push(serverQuote);
      updated = true;
    } else if (localQuote.category !== serverQuote.category) {
      // conflict detected
      conflict = true;
      // resolve by keeping local version
    }
  });

  if (updated) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
  }

  if (updated || conflict) {
    notifyUpdate(
      conflict ? "⚠️ Conflict detected while syncing with server!" : "✅ Quotes updated from server!",
      conflict
    );
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  mergeQuotes(serverQuotes);
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  createAddQuoteForm();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", showRandomQuote);
  showRandomQuote();
  syncQuotes();
  setInterval(syncQuotes, 10000); // sync every 10s
});
