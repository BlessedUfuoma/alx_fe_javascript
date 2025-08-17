// -------------------------
// Quotes Initialization
// -------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportBtn");

// -------------------------
// Utility Functions
// -------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -------------------------
// Show Random Quote
// -------------------------
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <p><em>${quote.category}</em></p>
  `;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// -------------------------
// Create Add Quote Form
// -------------------------
function createAddQuoteForm() {
  const formDiv = document.getElementById("formContainer");

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addButton);
}

// -------------------------
// Add Quote Function
// -------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes(); // persist to localStorage

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

// -------------------------
// JSON Export
// -------------------------
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// -------------------------
// JSON Import
// -------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -------------------------
// Event Listeners
// -------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// -------------------------
// Init
// -------------------------
createAddQuoteForm();

// If there's a last viewed quote in sessionStorage, show it first
if (sessionStorage.getItem("lastQuote")) {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  quoteDisplay.innerHTML = `
    <p>"${lastQuote.text}"</p>
    <p><em>${lastQuote.category}</em></p>
  `;
} else {
  showRandomQuote();
}
