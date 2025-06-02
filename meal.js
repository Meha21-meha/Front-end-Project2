const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value.trim();

  if (term) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>No results found. Try again!</p>`;
          mealsEl.innerHTML = ""; // Clear meals list when no result is found
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                   <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                   <div class="meal-info" data-mealID="${meal.idMeal}">
                   <h3>${meal.strMeal}</h3>
                   </div>
                </div>
              `
            )
            .join("");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        resultHeading.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
      });
  } else {
    alert("Please enter a search term.");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    })
    .catch((err) => {
      console.error("Error fetching meal details:", err);
    });
}

// Fetch a random meal
function getRandomMeal() {
  // Clear search and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    })
    .catch((err) => {
      console.error("Error fetching random meal:", err);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) { // Corrected loop index (start from 1)
    if (meal[`strIngredient${i}`]) { // Corrected property name
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
            </ul>
        </div>
    </div>
  `;
}

// Event listener for form submit
submit.addEventListener("submit", searchMeal);

// Event listener for meal click
mealsEl.addEventListener("click", e => {
  const mealInfo = e.composedPath().find(item => item.classList && item.classList.contains("meal-info"));

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID"); // Fixed attribute case
    getMealById(mealID);
  }
});

// Event listener for random meal button
random.addEventListener("click", getRandomMeal);
 