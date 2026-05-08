import {
    googleLogin,
    logoutUser
}
from "./firebase.js";

window.googleLogin = googleLogin;
window.logoutUser = logoutUser;


// ================= API KEY =================

const API_KEY =
"1534f44afe97449d8b1017b15fc3d4f8";


// ================= LOGIN BUTTONS =================

const loginBtn =
document.getElementById("loginBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const savedUser =

JSON.parse(
    localStorage.getItem(
        "recipeUser"
    )
);

if(loginBtn && logoutBtn){

    if(savedUser){

        loginBtn.style.display =
        "none";

        logoutBtn.style.display =
        "inline-block";

    }else{

        logoutBtn.style.display =
        "none";
    }

    loginBtn?.addEventListener(
        "click",
        googleLogin
    );

    logoutBtn?.addEventListener(
        "click",
        logoutUser
    );
}


// ================= PROGRESS BAR =================

window.addEventListener(
"scroll",
() => {

    const scrollTop =

    document.documentElement.scrollTop;

    const scrollHeight =

    document.documentElement.scrollHeight -

    document.documentElement.clientHeight;

    const scrollPercent =

    (scrollTop / scrollHeight) * 100;

    const progressBar =

    document.getElementById(
        "progressBar"
    );

    if(progressBar){

        progressBar.style.width =
        scrollPercent + "%";
    }
});


// ================= THEME =================

function toggleDarkMode(){

    if(
        document.body.classList.contains(
            "light"
        )
    ){

        document.body.classList.remove(
            "light"
        );

        localStorage.setItem(
            "theme",
            "dark"
        );

    }else{

        document.body.classList.add(
            "light"
        );

        localStorage.setItem(
            "theme",
            "light"
        );
    }
}

window.toggleDarkMode =
toggleDarkMode;


// ================= LOAD THEME =================

window.addEventListener(
"DOMContentLoaded",
() => {

    const savedTheme =

    localStorage.getItem(
        "theme"
    );

    if(savedTheme === "light"){

        document.body.classList.add(
            "light"
        );
    }

    loadFavorites();
});


// ================= LOADER =================

function showLoader(){

    const loader =

    document.getElementById(
        "loader"
    );

    if(loader){

        loader.style.display =
        "block";
    }
}

function hideLoader(){

    const loader =

    document.getElementById(
        "loader"
    );

    if(loader){

        loader.style.display =
        "none";
    }
}


// ================= ERROR =================

function showError(
message = "Something went wrong!"
){

    const result =

    document.getElementById(
        "result"
    );

    if(result){

        result.innerHTML = `

        <div class="empty-state">

            <h2>
                😔 Oops!
            </h2>

            <p>
                ${message}
            </p>

        </div>
        `;
    }
}


// ================= SEARCH RECIPE =================

async function searchRecipe(){

    const query =

    document.getElementById(
        "searchInput"
    ).value;

    const category =

    document.getElementById(
        "category"
    )?.value || "";

    const diet =

    document.getElementById(
        "diet"
    )?.value || "";

    if(!query.trim()){

        showError(
            "Please enter recipe name."
        );

        return;
    }

    showLoader();

    try{

        const url =

`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&type=${encodeURIComponent(category)}&diet=${encodeURIComponent(diet)}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;

        const res =
        await fetch(url);

        const data =
        await res.json();

        if(data.status === "failure"){

            showError(
                "API limit reached. Try again tomorrow."
            );

            hideLoader();

            return;
        }

        if(
            !data.results ||
            data.results.length === 0
        ){

            showError(
                "No recipes found."
            );

        }else{

            displayRecipes(
                data.results
            );
        }

    }catch(error){

        console.log(error);

        showError(
            "Failed to load recipes."
        );
    }

    hideLoader();
}

window.searchRecipe =
searchRecipe;


// ================= SEARCH BY INGREDIENTS =================

async function searchByIngredients(){

    const ingredients =

    document.getElementById(
        "ingredientInput"
    ).value;

    if(!ingredients.trim()){

        showError(
            "Please enter ingredients."
        );

        return;
    }

    showLoader();

    try{

        const url =

`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=12&apiKey=${API_KEY}`;

        const res =
        await fetch(url);

        const data =
        await res.json();

        if(data.status === "failure"){

            showError(
                "API limit reached. Try again tomorrow."
            );

            hideLoader();

            return;
        }

        if(!data.length){

            showError(
                "No recipes found."
            );

        }else{

            displayRecipes(data);
        }

    }catch(error){

        console.log(error);

        showError(
            "Failed to load recipes."
        );
    }

    hideLoader();
}

window.searchByIngredients =
searchByIngredients;


// ================= SUGGEST RECIPES =================

async function suggestRecipes(){

    const ideas = [

        "pizza",
        "paneer",
        "burger",
        "cake",
        "dessert",
        "salad",
        "noodles",
        "pasta"
    ];

    const random =

    ideas[
        Math.floor(
            Math.random() *
            ideas.length
        )
    ];

    showLoader();

    try{

        const url =

`https://api.spoonacular.com/recipes/complexSearch?query=${random}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;

        const res =
        await fetch(url);

        const data =
        await res.json();

        if(
            !data.results ||
            data.results.length === 0
        ){

            showError(
                "No recipes found."
            );

        }else{

            displayRecipes(
                data.results
            );
        }

    }catch(error){

        console.log(error);

        showError(
            "Failed to load recipes."
        );
    }

    hideLoader();
}

window.suggestRecipes =
suggestRecipes;


// ================= DISPLAY RECIPES =================

function displayRecipes(recipes){

    const result =

    document.getElementById(
        "result"
    );

    let html = "";

    recipes.forEach(recipe => {

        const safeTitle =

        recipe.title
        .replace(/'/g,"")
        .replace(/"/g,"");

        html += `

        <div class="card fade-in">

            <img
                src="${recipe.image}"
                alt="${safeTitle}"
            >

            <div class="card-content">

                <h3>
                    ${safeTitle}
                </h3>

                <p>

                    Delicious recipe with
                    rich flavors and easy
                    cooking instructions.

                </p>

                <div class="card-buttons">

                    <button
                    onclick="viewRecipe(${recipe.id})">

                        View Recipe

                    </button>

                    <button
                    onclick="saveFavorite(
                        ${recipe.id},
                        \`${safeTitle}\`,
                        \`${recipe.image}\`
                    )">

                        ❤️ Save

                    </button>

                </div>

            </div>

        </div>
        `;
    });

    result.innerHTML = html;
}


// ================= VIEW RECIPE =================

async function viewRecipe(id){

    showLoader();

    try{

        const res =
        await fetch(

`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`

        );

        const recipe =
        await res.json();

        const ingredients =

        recipe.extendedIngredients
        ?.map(item =>

            `<li>${item.original}</li>`

        )
        .join("");

        const steps =

        recipe.analyzedInstructions?.[0]
        ?.steps
        ?.map(step =>

            `<li>${step.step}</li>`

        )
        .join("");

        document.getElementById(
            "result"
        ).innerHTML = `

        <div class="details-card fade-in">

            <img
                src="${recipe.image}"
                class="details-image"
            >

            <div class="details-content">

                <h2>
                    ${recipe.title}
                </h2>

                <div class="recipe-info">

                    <p>
                        ⏱ ${recipe.readyInMinutes} mins
                    </p>

                    <p>
                        🔥 ${recipe.healthScore} Score
                    </p>

                    <p>
                        🍽 ${recipe.dishTypes}
                    </p>

                </div>

                <h3>
                    Ingredients
                </h3>

                <ul>
                    ${ingredients || "<li>No ingredients available</li>"}
                </ul>

                <h3>
                    Instructions
                </h3>

                <ol>
                    ${steps || "<li>No instructions available</li>"}
                </ol>

                <div class="card-buttons">

                    <button
                    onclick="location.reload()">

                        ⬅ Back

                    </button>

                </div>

            </div>

        </div>
        `;

    }catch(error){

        console.log(error);

        showError(
            "Failed to load recipe details."
        );
    }

    hideLoader();
}

window.viewRecipe =
viewRecipe;


// ================= FAVORITES =================

function saveFavorite(
id,
title,
image
){

    let favorites =

    JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];

    const alreadySaved =

    favorites.some(
        recipe => recipe.id === id
    );

    if(alreadySaved){

        alert(
            "Recipe already saved!"
        );

        return;
    }

    favorites.push({

        id,
        title,
        image
    });

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)
    );

    alert(
        "Recipe saved ❤️"
    );
}

window.saveFavorite =
saveFavorite;


// ================= LOAD FAVORITES =================

function loadFavorites(){

    const favoritesList =

    document.getElementById(
        "favoritesList"
    );

    if(!favoritesList) return;

    let favorites =

    JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];

    const emptyState =

    document.getElementById(
        "emptyState"
    );

    if(favorites.length === 0){

        if(emptyState){

            emptyState.style.display =
            "block";
        }

        return;
    }

    let html = "";

    favorites.forEach(
    (recipe,index) => {

        html += `

        <div class="card fade-in">

            <img
                src="${recipe.image}"
                alt="${recipe.title}"
            >

            <div class="card-content">

                <h3>
                    ${recipe.title}
                </h3>

                <div class="card-buttons">

                    <button
                    onclick="removeFav(${index})">

                        Remove

                    </button>

                </div>

            </div>

        </div>
        `;
    });

    favoritesList.innerHTML =
    html;
}


// ================= REMOVE FAVORITE =================

function removeFav(index){

    let favorites =

    JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];

    favorites.splice(index,1);

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)
    );

    location.reload();
}

window.removeFav =
removeFav;