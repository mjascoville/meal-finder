import { getMealById } from "./recipedb.mjs";
import { isRecipeSaved, removeSavedRecipe, saveRecipe } from "./saved.mjs";

const recipeStatus = document.querySelector("#recipe-status");
const recipeDetails = document.querySelector("#recipe-details");
const saveButton = document.querySelector("#save-recipe-button");
const saveStatus = document.querySelector("#save-recipe-status");
const mealId = new URLSearchParams(window.location.search).get("id");
let currentMeal;

function updateSaveButton() {
	try {
		const saved = isRecipeSaved(currentMeal.idMeal);
		saveButton.textContent = saved ? "Remove from saved" : "Save recipe";
		saveButton.classList.toggle("save-recipe-button--remove", saved);
		saveButton.disabled = false;
	} catch (error) {
		console.error("Could not check saved recipes:", error);
		saveStatus.textContent = error.message;
		saveButton.disabled = true;
	}
}

function showIngredients(meal) {
	const list = document.querySelector("#recipe-ingredients");

	for (let number = 1; number <= 20; number += 1) {
		const ingredient = meal[`strIngredient${number}`]?.trim();
		if (!ingredient) continue;

		const measure = meal[`strMeasure${number}`]?.trim();
		const item = document.createElement("li");
		item.textContent = measure ? `${measure} ${ingredient}` : ingredient;
		list.append(item);
	}
}

function showInstructions(meal) {
	const instructions = document.querySelector("#recipe-instructions");
	const steps = (meal.strInstructions || "")
		.split(/\r?\n/)
		.map((step) => step.trim())
		.filter(Boolean);

	if (steps.length === 0) {
		steps.push("Instructions are not available.");
	}

	for (const step of steps) {
		const paragraph = document.createElement("p");
		paragraph.textContent = step;
		instructions.append(paragraph);
	}
}

function showRecipe(meal) {
	currentMeal = meal;
	document.title = `${meal.strMeal} | Meal Finder`;
	document.querySelector("#recipe-title").textContent = meal.strMeal;
	document.querySelector("#recipe-meta").textContent =
		[meal.strCategory, meal.strArea].filter(Boolean).join(" / ");

	const image = document.querySelector("#recipe-image");
	if (meal.strMealThumb) {
		image.src = meal.strMealThumb;
		image.alt = `Photo of ${meal.strMeal}`;
		image.hidden = false;
	}

	showIngredients(meal);
	showInstructions(meal);
	recipeDetails.hidden = false;
	recipeStatus.hidden = true;
	updateSaveButton();
}

saveButton.addEventListener("click", () => {
	try {
		if (isRecipeSaved(currentMeal.idMeal)) {
			removeSavedRecipe(currentMeal.idMeal);
			saveStatus.textContent = `${currentMeal.strMeal} was removed from your saved recipes.`;
		} else {
			saveRecipe(currentMeal);
			saveStatus.textContent = `${currentMeal.strMeal} was added to your saved recipes.`;
		}

		updateSaveButton();
	} catch (error) {
		console.error("Could not update saved recipe:", error);
		saveStatus.textContent = error.message;
	}
});

async function loadRecipe() {
	if (!mealId) {
		recipeStatus.textContent = "No recipe was specified. Search for a meal to view its details.";
		return;
	}

	try {
		const meal = await getMealById(mealId);
		if (!meal) {
			recipeStatus.textContent = "Recipe not found. It may no longer be available.";
			return;
		}

		showRecipe(meal);
	} catch (error) {
		console.error("TheMealDB recipe lookup failed:", error);
		recipeStatus.textContent = "Unable to load this recipe right now. Please try again.";
	}
}

loadRecipe();
