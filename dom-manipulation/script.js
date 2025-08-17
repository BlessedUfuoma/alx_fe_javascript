// ----------------------------
// Quotes (local copy)
// ----------------------------
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react.", category: "Life" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const formContainer = document.getElementById("formContainer");

// ----------------------------
// Show Random Quote
// ----------------------------
function showRandomQuote() {
  const category = categoryFilter.value;
  const filteredQuotes = category === "All" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.innerText = `"${filteredQuotes[random].text}" — ${filteredQuotes[random].category}`;
}

// ----------------------------
// Add New Quote (local + server sync)
// ----------------------------
function addQuote(text, category) {
  if (!text || !category) return;

  const newQuote = { text, category };
  quotes.push(newQuote);

  // Post to mock server
  fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newQuote)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Quote synced to server:", data);
      syncWithServer(); // fetch updates again
    })
    .catch(err => console.error("Error syncing:", err));

  updateCategoryOptions();
  showRandomQuote();
}

// ----------------------------
// Create Add Quote Form
// ----------------------------
function createAddQuoteForm() {
  const form = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";

  addBtn.addEventListener("click", () => {
    addQuote(inputText.value, inputCategory.value);
    inputText.value = "";
    inputCategory.value = "";
  });

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addBtn);

  formContainer.appendChild(form);
}

// ----------------------------
// Update Category Options
// ----------------------------
function updateCategoryOptions() {
  const categories = ["All", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// ----------------------------
// Server Sync + Conflict Resolution
// ----------------------------
function syncWithServer() {
  fetch(SERVER_URL)
    .then(res => res.json())
    .then(serverData => {
      // Simulate server quotes (only taking first 5 posts as "quotes")
      const serverQuotes = serverData.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));

      // Conflict resolution: Server data wins
      quotes = [...quotes, ...serverQuotes];
      quotes = Array.from(new Set(quotes.map(q => q.text))) // dedupe by text
        .map(text => quotes.find(q => q.text === text));

      console.log("Quotes after sync:", quotes);

      updateCategoryOptions();
      showRandomQuote();

      // Notify user
      alert("Quotes synced with server. Conflicts resolved (server data kept).");
    })
    .catch(err => console.error("Sync failed:", err));
}

// ----------------------------
// Init
// ----------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", showRandomQuote);

updateCategoryOptions();
showRandomQuote();
createAddQuoteForm();

// Periodic sync every 30s
setInterval(syncWithServer, 30000);
