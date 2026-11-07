const STORAGE_KEY = "meal-finder:saved-recipes";

export function getSavedRecipes() {
	let savedData;

	try {
		savedData = localStorage.getItem(STORAGE_KEY);
	} catch {
		throw new Error("Saved recipes could not be read from browser storage.");
	}

	if (!savedData) return [];

	try {
		const recipes = JSON.parse(savedData);
		if (!Array.isArray(recipes)) {
			throw new Error("Saved recipes data is not a list.");
		}

		return recipes.filter((recipe) => recipe && typeof recipe.idMeal === "string");
	} catch {
		throw new Error("Saved recipes data is invalid. Clear the browser storage entry to continue.");
	}
}

export function isRecipeSaved(mealId) {
	return getSavedRecipes().some((recipe) => recipe.idMeal === String(mealId));
}

function storeRecipes(recipes) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
	} catch {
		throw new Error("Saved recipes could not be updated in browser storage.");
	}
}

export function saveRecipe(meal) {
	if (!meal?.idMeal || !meal?.strMeal) {
		throw new TypeError("A valid meal is required to save a recipe.");
	}

	const recipes = getSavedRecipes().filter((recipe) => recipe.idMeal !== String(meal.idMeal));
	storeRecipes([meal, ...recipes]);
}

export function removeSavedRecipe(mealId) {
	const recipes = getSavedRecipes().filter((recipe) => recipe.idMeal !== String(mealId));
	storeRecipes(recipes);
}

function createRecipeCard(meal) {
	const card = document.createElement("article");
	card.className = "saved-recipe-card";

	if (meal.strMealThumb) {
		const image = document.createElement("img");
		image.className = "saved-recipe-card__image";
		image.src = meal.strMealThumb;
		image.alt = `Photo of ${meal.strMeal}`;
		image.loading = "lazy";
		card.append(image);
	}

	const content = document.createElement("div");
	content.className = "saved-recipe-card__content";

	const title = document.createElement("h2");
	title.className = "saved-recipe-card__title";
	const link = document.createElement("a");
	link.href = `recipe.html?id=${encodeURIComponent(meal.idMeal)}`;
	link.textContent = meal.strMeal;
	title.append(link);
	content.append(title);

	const details = [meal.strCategory, meal.strArea].filter(Boolean).join(" / ");
	if (details) {
		const info = document.createElement("p");
		info.textContent = details;
		content.append(info);
	}

	const removeButton = document.createElement("button");
	removeButton.className = "saved-recipe-card__remove";
	removeButton.type = "button";
	removeButton.dataset.mealId = meal.idMeal;
	removeButton.textContent = "Remove";
	removeButton.setAttribute("aria-label", `Remove ${meal.strMeal} from saved recipes`);
	content.append(removeButton);

	card.append(content);
	return card;
}

function showSavedRecipes() {
	const list = document.querySelector("#saved-recipes");
	const status = document.querySelector("#saved-recipes-status");

	try {
		const recipes = getSavedRecipes();
		list.replaceChildren(...recipes.map(createRecipeCard));
		status.textContent = recipes.length
			? `${recipes.length} saved ${recipes.length === 1 ? "recipe" : "recipes"}.`
			: "You have not saved any recipes yet.";
	} catch (error) {
		console.error("Could not load saved recipes:", error);
		list.replaceChildren();
		status.textContent = error.message;
	}
}

const savedList = document.querySelector("#saved-recipes");

if (savedList) {
	savedList.addEventListener("click", (event) => {
		const removeButton = event.target.closest(".saved-recipe-card__remove");
		if (!removeButton) return;

		try {
			removeSavedRecipe(removeButton.dataset.mealId);
			showSavedRecipes();
		} catch (error) {
			console.error("Could not remove saved recipe:", error);
			document.querySelector("#saved-recipes-status").textContent = error.message;
		}
	});

	showSavedRecipes();
}
