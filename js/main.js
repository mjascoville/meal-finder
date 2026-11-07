import { getMealCategories, getRandomMeal } from "./recipedb.mjs";

const categoryList = document.querySelector("#category-list");
const categoryStatus = document.querySelector("#category-status");
const mealList = document.querySelector("#random-meals");
const mealStatus = document.querySelector("#meal-status");
const refreshMealsButton = document.querySelector("#refresh-meals");

function chooseRandomItems(items, count) {
	const remainingItems = [...items];
	const chosenItems = [];

	while (chosenItems.length < count && remainingItems.length > 0) {
		const randomIndex = Math.floor(Math.random() * remainingItems.length);
		chosenItems.push(remainingItems.splice(randomIndex, 1)[0]);
	}

	return chosenItems;
}

async function displayRandomCategories() {
	try {
		const categories = await getMealCategories();
		const randomCategories = chooseRandomItems(categories, 3);

		categoryList.replaceChildren(
			...randomCategories.map((category) => {
				const item = document.createElement("li");
				const link = document.createElement("a");
				link.className = "category-link";
				link.href = `search.html?type=category&q=${encodeURIComponent(category)}`;
				link.textContent = category;
				item.append(link);
				return item;
			}),
		);
		categoryStatus.textContent = randomCategories.length
			? ""
			: "No categories are available right now.";
	} catch (error) {
		console.error("Could not load meal categories:", error);
		categoryStatus.textContent = "Unable to load categories right now. Please try again later.";
	}
}

async function getDistinctRandomMeals(count) {
	const meals = new Map();
	const maxAttempts = count * 3;

	for (let attempt = 0; attempt < maxAttempts && meals.size < count; attempt += 1) {
		const meal = await getRandomMeal();
		if (meal?.idMeal) {
			meals.set(meal.idMeal, meal);
		}
	}

	return [...meals.values()];
}

function createRandomMealCard(meal) {
	const card = document.createElement("article");
	card.className = "recipe";

	if (meal.strMealThumb) {
		const image = document.createElement("img");
		image.className = "recipe-image";
		image.src = meal.strMealThumb;
		image.alt = `Photo of ${meal.strMeal}`;
		image.loading = "lazy";
		card.append(image);
	}

	const category = document.createElement("p");
	category.className = "recipe-type";
	category.textContent = meal.strCategory || "Recipe";

	const title = document.createElement("h3");
	title.className = "recipe-title";
	title.textContent = meal.strMeal || "Untitled recipe";

	const details = document.createElement("p");
	details.className = "recipe-text";
	details.textContent = meal.strArea ? `${meal.strArea} cuisine` : "";

	const link = document.createElement("a");
	link.className = "recipe-link";
	link.href = `recipe.html?id=${encodeURIComponent(meal.idMeal)}`;
	link.textContent = "View recipe";

	card.append(category, title);
	if (details.textContent) {
		card.append(details);
	}
	card.append(link);
	return card;
}

async function displayRandomMeals() {
	refreshMealsButton.disabled = true;
	mealStatus.textContent = "Loading random meals...";

	try {
		const meals = await getDistinctRandomMeals(3);
		mealList.replaceChildren(...meals.map(createRandomMealCard));
		mealStatus.textContent = meals.length === 3
			? ""
			: meals.length
				? `Only ${meals.length} unique meals are available right now.`
				: "No meals are available right now. Please try again later.";
	} catch (error) {
		console.error("Could not load random meals:", error);
		mealList.replaceChildren();
		mealStatus.textContent = "Unable to load meals right now. Please try again.";
	} finally {
		refreshMealsButton.disabled = false;
	}
}

refreshMealsButton.addEventListener("click", displayRandomMeals);

displayRandomCategories();
displayRandomMeals();