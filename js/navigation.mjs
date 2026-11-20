const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuButton && navigation) {
  function setMenuOpen(isOpen) {
    navigation.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  }

  // Open or close the mobile menu.
  menuButton.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    setMenuOpen(!isOpen);
  });

  // Close the menu when Escape is pressed.
  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  // Reset the menu when switching to desktop view.
  const desktop = window.matchMedia("(min-width: 901px)");

  desktop.addEventListener("change", event => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });

  // Highlight the current page in the navigation.
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  navigation.querySelectorAll("a[href]").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}
