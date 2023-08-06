class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCaloriesLimit() ;
        this._totalCalories = Storage.getTotalCalorie() ;
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts() ;
        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned()
        this._displayCaloriesRemaining()
        this._displayCaloriesProgress();
        this._loadItems()
    }
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalorie(this._totalCalories);
        Storage.saveMeal(meal) 
        this._displayNewMeal(meal)
        this._render()
    }
    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalorie(this._totalCalories)
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout)
        this._render()
    }
    _displayCalorieLimit() {
        let calorielimitElm = document.querySelector("#calories-limit");
        calorielimitElm.innerHTML = this._calorieLimit;
    }
    _displayCaloriesTotal() {
        let caloriesTotalElm = document.querySelector("#calories-total");
        caloriesTotalElm.innerHTML = this._totalCalories
    }
    _displayCaloriesConsumed() {
        let caloriesConsumedElm = document.querySelector("#calories-consumed");
        let caloriesSummed = this._meals.reduce((total , meal) => total + meal.calories , 0)
        caloriesConsumedElm.innerHTML = caloriesSummed;
    }
    _displayCaloriesBurned() {
        let caloriesBurnedElm = document.querySelector("#calories-burned");
        let burnedCaloriesSummed = this._workouts.reduce((total , workout) => total + workout.calories , 0)
        caloriesBurnedElm.innerHTML = burnedCaloriesSummed;
    }
    _displayCaloriesRemaining() {
        let caloriesRemainingElm = document.querySelector("#calories-remaining");
        let caloriesRemaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingElm.innerHTML = caloriesRemaining;
        if(caloriesRemaining <= 0) {
            caloriesRemainingElm.parentElement.parentElement.classList.remove("bg-light")
            caloriesRemainingElm.parentElement.parentElement.classList.add("bg-danger")
        } else {
            caloriesRemainingElm.parentElement.parentElement.classList.remove("bg-danger")
            caloriesRemainingElm.parentElement.parentElement.classList.add("bg-light")
        }
    }
    // Progress Bar 
    _displayCaloriesProgress() {
        let progressElm = document.querySelector("#calorie-progress");
        let percentage = (this._totalCalories / this._calorieLimit) * 100;
        progressElm.style.width = `${percentage}%`;
        if(this._calorieLimit - this._totalCalories <= 0) {
            progressElm.classList.add("bg-danger");
        } else {
            progressElm.classList.remove("bg-danger");
        }
    }
    // Display Meals 
    _displayNewMeal(meal) {
        let mealItem = document.createElement("div");
        mealItem.classList.add("card", "my-2");
        mealItem.setAttribute("data-id" , meal.id)
        mealItem.innerHTML = `
        <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
              `
        document.querySelector("#meal-items").appendChild(mealItem)
    }
    // Display Workouts
    _displayNewWorkout(workout) {
        let workoutItem = document.createElement("div");
        workoutItem.classList.add("card", "my-2");
        workoutItem.setAttribute("data-id" , workout.id)
        workoutItem.innerHTML = `
        <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
              `
        document.querySelector("#workout-items").appendChild(workoutItem)
    }
    _loadItems() {
        this._meals.forEach(meal => this._displayNewMeal(meal))
        this._workouts.forEach(workout => this._displayNewWorkout(workout))
    }
    //Private Methods 
    removeMeal(id) {
        this._meals.forEach((meal , index) => {
            if (meal.id !== id) {
                return
            } else {
                this._totalCalories -= meal.calories;
                this._meals.splice(index , 1)
                Storage.updateTotalCalorie(this._totalCalories);
                Storage.removeMeal(id)
                this._render()
            }
        })
    }
    removeWorkout(id) {
        this._workouts.forEach((workout , index) => {
            if (workout.id !== id) {
                return;
            } else {
                this._totalCalories += workout.calories;
                this._workouts.splice(index , 1)
                Storage.updateTotalCalorie(this._totalCalories);
                Storage.removeWorkout(id);
                this._render()
            }
        })
    }
    resetApp() {
        this._totalCalories = 0
        Storage.updateTotalCalorie(this._totalCalories)
        this._meals = []
        this._workouts = []
        this._render()
    }
    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        document.querySelector("#limit").value = calorieLimit
        Storage.setCalorieLimit(calorieLimit)
        this._displayCalorieLimit();
        this._render()
    }
    _render() {
        this._displayCaloriesTotal()
        this._displayCaloriesConsumed()
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining()
        this._displayCaloriesProgress()
    }
}
class Meal {
    constructor(name , calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name,
        this.calories = calories
    }
}
class Workout {
    constructor(name , calories) {
        this.id = Math.random().toString(16).slice(2)
        this.name = name,
        this.calories = calories
    }
}
class Storage {
    static getCaloriesLimit(limit = 2000) {
        let calorieLimit;
        if(localStorage.getItem("calorieLimit") === null) {
            calorieLimit = limit;
        } else {
            calorieLimit = localStorage.getItem("calorieLimit")
        }
        return calorieLimit
    }
    static setCalorieLimit(limit) {
        localStorage.setItem("calorieLimit" , limit);
    }
    static getTotalCalorie(defaultTotal = 0) {
        let totalCalories;
        if(localStorage.getItem("totalCalories") === null) {
            totalCalories = defaultTotal;
        } else {
            totalCalories = +localStorage.getItem("totalCalories");
        }
        return totalCalories;
    }
    static updateTotalCalorie(newTotalCalorie) {
        localStorage.setItem("totalCalories" , newTotalCalorie);
    }
    static getMeals(){
        let meals;
        if(localStorage.getItem("meals") === null) {
            meals = []
        } else {
            meals = JSON.parse(localStorage.getItem("meals"))
        }
        return meals;
    }
    static saveMeal(meal) {
        let meals = this.getMeals();
        meals.push(meal);
        localStorage.setItem("meals" , JSON.stringify(meals))
    }
    static removeMeal(id) {
        let meals = this.getMeals();
        meals.forEach((meal , index) => {
            if(meal.id === id) {
                meals.splice(index , 1);
            }
        })
        localStorage.setItem("meals" , JSON.stringify(meals))
    }
    static getWorkouts(){
        let workouts;
        if(localStorage.getItem("workouts") === null) {
            workouts = []
        } else {
            workouts = JSON.parse(localStorage.getItem("workouts"))
        }
        return workouts;
    }
    static saveWorkout(workout) {
        let workouts = this.getWorkouts();
        workouts.push(workout);
        localStorage.setItem("workouts" , JSON.stringify(workouts))
    }
    static removeWorkout(id) {
        let workouts = this.getWorkouts();
        workouts.forEach((workout , index) => {
            if(workout.id === id) {
                workouts.splice(index , 1);
            }
        })
        localStorage.setItem("workouts" , JSON.stringify(workouts))
    }
    static resetStorage() {
        ["meals" , "workouts" , "totalCalories"].forEach((item) => localStorage.removeItem(item));
    }
}
class App {
    constructor() {
        this._tracker = new CalorieTracker();
        document.querySelector("#limit").value = this._tracker._calorieLimit;
        this._addEvents()
    }
    _addEvents(){
        document.querySelector("#meal-form").addEventListener("submit" , this._addMealOrWorkout.bind(this , "meal"));
        document.querySelector("#workout-form").addEventListener("submit" , this._addMealOrWorkout.bind(this , "workout"));
        document.querySelector("#meal-items").addEventListener("click" , this._removeItem.bind(this , "meal"))
        document.querySelector("#workout-items").addEventListener("click" , this._removeItem.bind(this , "workout"))
        document.querySelector("#filter-meals").addEventListener("keyup" , this._filterItems.bind(this , "meal"))
        document.querySelector("#filter-workouts").addEventListener("keyup" , this._filterItems.bind(this , "workout"))
        document.querySelector("#reset").addEventListener("click" , this._reset.bind(this))
        document.querySelector("#limit-form").addEventListener("submit" , this._setLimit.bind(this))
    }
    _addMealOrWorkout(type , event) {
        event.preventDefault();
        let name = document.querySelector(`#${type}-name`);
        let calories = document.querySelector(`#${type}-calories`);
        if(!name.value || !calories.value) {
            alert(`Please enter name and calories of the ${type}`)
            return;
        }
        if(type === "meal") {
            let newMeal = new Meal(name.value , +calories.value);
            this._tracker.addMeal(newMeal)
        } else {
            let newWorkout = new Workout(name.value , +calories.value);
            this._tracker.addWorkout(newWorkout)
        }
        name.value = calories.value = "";
        let collapseItem = document.querySelector(`#collapse-${type}`)
        let bsCollapse = new bootstrap.Collapse(collapseItem , {
            toggle : true
        })
    }
    _removeItem(type , e) {
        if(e.target.classList.contains("delete") || e.target.classList.contains("fa-xmark")) {
            if(confirm("Are You Sure You Wanna Delete This Item?")) {
                e.target.closest(".card").remove()
                let elementID = e.target.closest(".card").dataset.id;
                type === "meal" ? this._tracker.removeMeal(elementID) : this._tracker.removeWorkout(elementID)
            }

        }
    }
    _filterItems(type, e) {
        let text = e.target.value.toLowerCase();
        let cards = document.querySelectorAll(`#${type}-items > .card`);
        cards.forEach(card => {
            let name = card.firstElementChild.firstElementChild.textContent.toLowerCase();
            if(name.indexOf(text) !== -1) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        })
    }
    _reset() {
        this._tracker.resetApp();
        document.querySelector("#meal-items").innerHTML = '';
        document.querySelector("#workout-items").innerHTML = '';
        document.querySelector("#filter-meals").value = '';
        document.querySelector("#filter-workouts").value = '';
        Storage.resetStorage()
    }
    _setLimit(e) {
        e.preventDefault();
        let limitElm = document.querySelector("#limit");
        this._tracker.setLimit(+limitElm.value);
        limitElm.value = "";
        let limitModal = document.querySelector("#limit-modal");
        let modal = bootstrap.Modal.getInstance(limitModal);
        modal.hide()
    }
}
let app = new App()