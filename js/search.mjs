import {
	searchMealsByCategory,
	searchMealsByIngredient,
	searchMealsByName,
} from "./recipedb.mjs";

const searchInput = document.querySelector("#recipe-search");
const searchType = document.querySelector("#search-type");
const searchTypeButton = document.querySelector("#search-type-button");
const searchTypeOptions = document.querySelector("#search-type-options");
const searchActions = document.querySelector("#search-actions");
const searchInputLabel = document.querySelector("#search-input-label");
const resultsContainer = document.querySelector("#search-results");
const statusMessage = document.querySelector("#search-status");
const searchParams = new URLSearchParams(window.location.search);
const searchTerm = searchParams.get("q")?.trim() || "";
const searchFunctions = {
	name: searchMealsByName,
	ingredient: searchMealsByIngredient,
	category: searchMealsByCategory,
};
const searchLabels = {
	name: "meal name",
	ingredient: "ingredient",
	category: "category",
};
let searchMode = searchParams.get("type");

if (!searchFunctions[searchMode]) {
	searchMode = "name";
}

function updateSearchField() {
	searchType.value = searchMode;
	searchTypeButton.setAttribute(
		"aria-label",
		`Search type: ${searchLabels[searchMode]}. Choose search type`,
	);

	searchInputLabel.textContent = `Search by ${searchLabels[searchMode]}:`;
	if (searchMode === "ingredient") {
		searchInput.placeholder = 'Try "chicken" or "tomato"';
	} else if (searchMode === "category") {
		searchInput.placeholder = 'Try "Seafood" or "Vegetarian"';
	} else {
		searchInput.placeholder = 'Try "pasta" or "chicken"';
	}

	document.querySelectorAll(".search-type-option").forEach((button) => {
		button.setAttribute("aria-pressed", button.dataset.searchType === searchMode);
	});
}

function closeSearchOptions() {
	searchTypeButton.setAttribute("aria-expanded", "false");
	searchTypeOptions.setAttribute("aria-hidden", "true");
	searchActions.classList.remove("is-open");
}

searchTypeButton.addEventListener("click", () => {
	const isOpen = searchTypeButton.getAttribute("aria-expanded") === "true";
	searchTypeButton.setAttribute("aria-expanded", String(!isOpen));
	searchTypeOptions.setAttribute("aria-hidden", String(isOpen));
	searchActions.classList.toggle("is-open", !isOpen);
});

searchTypeOptions.addEventListener("click", (event) => {
	const option = event.target.closest(".search-type-option");
	if (!option) return;

	searchMode = option.dataset.searchType;
	closeSearchOptions();
	updateSearchField();
});

searchActions.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeSearchOptions();
		searchTypeButton.focus();
	}
});

function createMealCard(meal) {
	const card = document.createElement("article");
	card.className = "meal-card";

	if (meal.strMealThumb) {
		const image = document.createElement("img");
		image.className = "meal-card__image";
		image.src = meal.strMealThumb;
		image.alt = `Photo of ${meal.strMeal}`;
		image.loading = "lazy";
		card.append(image);
	}

	const content = document.createElement("div");
	content.className = "meal-card__content";

	const title = document.createElement("h2");
	title.className = "meal-card__title";

	const link = document.createElement("a");
	link.href = `recipe.html?id=${encodeURIComponent(meal.idMeal)}`;
	link.textContent = meal.strMeal || "Untitled recipe";
	title.append(link);
	content.append(title);

	const details = [meal.strCategory, meal.strArea].filter(Boolean).join(" · ");
	if (details) {
		const metadata = document.createElement("p");
		metadata.className = "meal-card__details";
		metadata.textContent = details;
		content.append(metadata);
	}

	card.append(content);
	return card;
}

async function showSearchResults() {
	if (!searchTerm) {
		statusMessage.textContent = `Enter a ${searchLabels[searchMode]} to search for recipes.`;
		return;
	}

	statusMessage.textContent = `Searching by ${searchLabels[searchMode]}...`;

	try {
		const meals = await searchFunctions[searchMode](searchTerm);
		resultsContainer.replaceChildren(...meals.map(createMealCard));

		if (meals.length) {
			statusMessage.textContent = `${meals.length} recipes found for "${searchTerm}".`;
		} else {
			statusMessage.textContent = `No recipes found for "${searchTerm}". Try another search.`;
		}
	} catch (error) {
		console.error("TheMealDB search failed:", error);
		statusMessage.textContent = "Unable to load recipes right now. Please try again.";
	}
}

searchInput.value = searchTerm;
updateSearchField();
showSearchResults();
