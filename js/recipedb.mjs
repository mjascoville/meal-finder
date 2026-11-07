const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

async function fetchJson(endpoint, params) {
	const url = new URL(endpoint, API_BASE_URL);
	url.search = new URLSearchParams(params).toString();

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	return response.json();
}

export async function searchMealsByName(name) {
	const data = await fetchJson("search.php", { s: name });
	return data.meals ?? [];
}

export async function searchMealsByIngredient(ingredient) {
	const data = await fetchJson("filter.php", { i: ingredient });
	return data.meals ?? [];
}

export async function searchMealsByCategory(category) {
	const data = await fetchJson("filter.php", { c: category });
	return data.meals ?? [];
}

export async function getMealCategories() {
	const data = await fetchJson("list.php", { c: "list" });
	return data.meals?.map((meal) => meal.strCategory) ?? [];
}

export async function getMealsByArea(area) {
	const data = await fetchJson("filter.php", { a: area });
	return data.meals ?? [];
}

export async function getMealAreas() {
	const data = await fetchJson("list.php", { a: "list" });
	return data.meals?.map((meal) => meal.strArea) ?? [];
}

export async function getMealById(id) {
	const data = await fetchJson("lookup.php", { i: id });
	return data.meals?.[0] ?? null;
}

export async function getRandomMeal() {
	const data = await fetchJson("random.php", {});
	return data.meals?.[0] ?? null;
}