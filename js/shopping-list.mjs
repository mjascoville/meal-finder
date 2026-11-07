
// Keep this separate from Ryan's "meal-finder:saved-recipes" key.
const STORAGE_KEY = "meal-finder:shopping-list";

const form = document.querySelector("#shopping-form");
const input = document.querySelector("#ingredient-input");
const list = document.querySelector("#shopping-items");
const emptyMessage = document.querySelector("#shopping-empty");
const statusMessage = document.querySelector("#shopping-message");
const progressText = document.querySelector("#shopping-progress-text");
const progressBar = document.querySelector("#shopping-progress");

// Read the saved items when the page first loads.
function loadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("Invalid list format");

    return parsed.filter(item =>
      item && typeof item.id === "string" &&
      typeof item.name === "string" && typeof item.completed === "boolean"
    );
  } catch {
    statusMessage.textContent = "Your saved shopping list could not be loaded.";
    return [];
  }
}

// Save after every change: add, check/uncheck, or remove.
function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    statusMessage.textContent = "";
  } catch {
    statusMessage.textContent = "Changes could not be saved in this browser.";
  }
}

let items = loadItems();

function renderItems() {
  list.replaceChildren();

  items.forEach(item => {
    const row = document.createElement("li");
    row.className = "shopping-item";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;
      saveItems();
      renderItems();
    });

    const name = document.createElement("span");
    name.textContent = item.name; // textContent safely displays user-entered text.
    if (item.completed) name.className = "shopping-item__completed";

    label.append(checkbox, name);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "shopping-item__remove";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${item.name}`);
    removeButton.addEventListener("click", () => {
      items = items.filter(savedItem => savedItem.id !== item.id);
      saveItems();
      renderItems();
    });

    row.append(label, removeButton);
    list.append(row);
  });

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  progressText.textContent = `${completedCount} of ${totalCount} items completed`;
  progressBar.value = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
  emptyMessage.hidden = totalCount !== 0;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  items.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    completed: false
  });

  saveItems();
  renderItems();
  form.reset();
  input.focus();
});

renderItems();
