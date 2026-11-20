
const STORAGE_KEY = "meal-finder:shopping-list";

// Retrieve existing shopping list items.
export function loadShoppingItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  const parsed = JSON.parse(saved);

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid shopping list format");
  }

  return parsed.filter(item =>
    item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.completed === "boolean"
  );
}

// Save the shopping list.
export function saveShoppingItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Add multiple ingredients to the shopping list.
export function addShoppingIngredients(ingredientNames) {
  const names = ingredientNames
    .filter(name => typeof name === "string")
    .map(name => name.trim())
    .filter(Boolean);

  if (names.length === 0) return 0;

  const items = loadShoppingItems();

  const newItems = names.map((name, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    name,
    completed: false
  }));

  saveShoppingItems([...items, ...newItems]);

  return newItems.length;
}
