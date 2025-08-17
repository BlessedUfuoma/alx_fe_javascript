// Initial quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteBtn = document.getElementById("newQuote");

// Populate category dropdown
function updateCategoryOptions() {
  categorySelect.innerHTML = "<option value='all'>All Categories</option>";
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show random quote
function showRandomQuote() {
  let selectedCategory = categorySelect.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category yet.</p>";
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p class="quote-text">"${quote.text}"</p>
    <p class="quote-category">— ${quote.category}</p>
  `;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  updateCategoryOptions();

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", showRandomQuote);

// Init
updateCategoryOptions();
showRandomQuote();
