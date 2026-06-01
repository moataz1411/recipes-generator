const searchinput=document.getElementById("searchinput");
const searchbutton=document.getElementById("searchbutton");
const mealcontainer=document.getElementById("mealscontainer");
const erroralert=document.getElementById("erroralert");
const mealdetails=document.getElementById("mealdetails");
const mealdetailscontent =document.querySelector(".mealscontent");
const resultheading=document.getElementById("resultheading");
const backbutton=document.getElementById("backbutton");
const backmusic=document.getElementById("backmusic");
backmusic.volume=0.25;
const musicbtn=document.getElementById("musicbutton");
document.addEventListener("click",()=>{
        backmusic.play().catch(()=>{});
    },{once:true});
    musicbtn.addEventListener("click",()=>{
        if(backmusic.paused){
            backmusic.play();
            musicbtn.textContent="Mute Music";
        }
        else{
            backmusic.pause();
            musicbtn.textContent="Turn ON The Music";
        }
    });
const BASE_URL="https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL=`${BASE_URL}search.php?s=`;
const LOOKUP_URL=`${BASE_URL}lookup.php?i=`;
searchbutton.addEventListener("click",searchMeals)
mealcontainer.addEventListener("click",handleMealClick)
backbutton.addEventListener("click",()=>mealdetails.classList.add("hidden"));

searchinput.addEventListener("keypress",(e)=>{
    if(e.key==="Enter") searchMeals();
})
async function searchMeals(){
    const searchterm=searchinput.value.trim();
    if(!searchterm){
        erroralert.textContent="If you don't want a recipe, get out.."
        erroralert.classList.remove("hidden");
        return;
    }
    try{
        resultheading.textContent=`Searching for "${searchterm}"...`
        mealcontainer.innerHTML="";
        erroralert.classList.add("hidden");
        const response=await fetch(`${SEARCH_URL}${searchterm}`)
        const data=await response.json();
        if(data.meals===null){
            resultheading.textContent=``
            mealcontainer.innerHTML="";
            erroralert.textContent=`No meals found for "${searchterm}". Try another search, if u hungry!`
            erroralert.classList.remove("hidden")
        }
        else{
            resultheading.textContent=`Search results for "${searchterm}":`;
            displayMeals(data.meals)
            searchinput.value=""
        }
        }
        catch(error){
            erroralert.textContent="Something went wrong. Please try again later.";
            erroralert.classList.remove("hidden");

        }
}
function displayMeals(meals){
    mealcontainer.innerHTML="";
    meals.forEach(meal=>{
        mealcontainer.innerHTML+=`
        <div class="meal" data-mealid="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info">
        <h3 class="meal-title">${meal.strMeal}</h3>
        ${meal.strCategory?`<div class="meal-category">${meal.strCategory}</div>`:""}
        </div>
        </div>
        `;
    });
}
async function handleMealClick(event){
    const mealEl=event.target.closest(".meal");
    if(!mealEl) return;
    const mealId=mealEl.getAttribute("data-mealid");
    try{
        const response=await fetch(`${LOOKUP_URL}${mealId}`);
        const data=await response.json();
        if(data.meals && data.meals[0]){
            const meal=data.meals[0];
            const ingredients=[];
            for(let i=1; i<=20;i++){
                if(meal[`strIngredient${i}`]&&meal[`strIngredient${i}`].trim()!==""){
                    ingredients.push({
                        ingredient:meal[`strIngredient${i}`],
                        measure:meal[`strMeasure${i}`]
                    })
                }
            }
            mealdetailscontent.innerHTML=`
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="mealdetails-img">
            <h2 class="mealdetails-title">${meal.strMeal}</h2>
            <div class="mealdetails-category">
            <span>${meal.strCategory || "uncategorized"}</span>
            </div>
            <div class="mealdetails-instructions">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
            </div>
            <div class="mealdetails-ingredients">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
                ${ingredients.map((item) => `<li><i class="fas fa-check"></i> ${item.measure} - ${item.ingredient}</li>`).join("")}
            </ul>
            </div>
            ${meal.strYoutube?`
                <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
                <i class="fab fa-youtube"></i> Watch Video
                </a>
            `:""}
        `;
            mealdetails.classList.remove("hidden");
        }
    }
    catch(error){
        erroralert.textContent="Something went wrong. Please try again later.";
        erroralert.classList.remove("hidden");
    }
        }



