import {
  loadShoppingItems,
  saveShoppingItems
} from "./shopping-storage.mjs";

const form = document.querySelector("#shopping-form");
const input = document.querySelector("#ingredient-input");
const list = document.querySelector("#shopping-items");
const emptyMessage = document.querySelector("#shopping-empty");
const statusMessage = document.querySelector("#shopping-message");
const progressText = document.querySelector("#shopping-progress-text");
const progressBar = document.querySelector("#shopping-progress");

function loadItems() {
  try {
    return loadShoppingItems();
  } catch {
    statusMessage.textContent =
      "Your saved shopping list could not be loaded.";
    return [];
  }
}

function saveItems() {
  try {
    saveShoppingItems(items);
    statusMessage.textContent = "";
  } catch {
    statusMessage.textContent =
      "Changes could not be saved in this browser.";
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
