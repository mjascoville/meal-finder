const header = document.querySelector(".site-header");

if (!header) {
  throw new Error("The page is missing the site header mount point.");
}

header.innerHTML = `
  <div class="container site-header__inner">
    <a class="site-brand" href="index.html">Meal Finder</a>

    <button
      class="menu-toggle"
      type="button"
      aria-controls="primary-navigation"
      aria-expanded="false"
    >
      <span aria-hidden="true">&#9776;</span>
      Menu
    </button>

    <nav
      id="primary-navigation"
      class="primary-nav"
      aria-label="Main navigation"
    >
      <a class="nav-link" href="index.html">Home</a>
      <a class="nav-link" href="search.html">Find Recipes</a>
      <a class="nav-link" href="saved.html">Saved Recipes</a>
      <a class="nav-link" href="add-recipe.html">Add a Recipe</a>
      <a class="nav-link" href="shopping-list.html">Shopping List</a>
    </nav>
  </div>
`;

const menuButton = header.querySelector(".menu-toggle");
const navigation = header.querySelector("#primary-navigation");

// Function to set the menu open or closed
function setMenuOpen(isOpen) {
  navigation.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

// Toggle the menu open/closed when the button is clicked
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

// Close the menu when the Escape key is pressed
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

// Close the menu when the viewport is resized to desktop size
const desktop = window.matchMedia("(min-width: 901px)");

// Listen for changes in the viewport size
desktop.addEventListener("change", event => {
  if (event.matches) {
    setMenuOpen(false);
  }
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Highlight the current page in the navigation
navigation.querySelectorAll("a[href]").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});
