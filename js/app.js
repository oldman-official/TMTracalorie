class CalorieTracker {
    constructor() {
        this._calorieLimit = 3000 ,
        this._totalCalories = 0 ,
        this._meals = [],
        this._workouts = [];
        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned()
        this._displayCaloriesRemaining()
        this._displayCaloriesProgress()
    }
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewMeal(meal)
        this._render()
        // console.log(this._meals)
    }
    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
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
        // console.log(meal)
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
        // console.log(workout)
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
    removeMeal(id) {
        this._meals.forEach(meal => {
            if (meal.id !== id) {
                return
            } else {
                this._totalCalories -= meal.calories;
                this._render()
            }
        })
    }
    removeWorkout(id) {
        this._workouts.forEach(workout => {
            if (workout.id !== id) {
                return;
            } else {
                this._totalCalories += workout.calories;
                this._render()
            }
        })
    }
    resetApp() {
        this._totalCalories = 0
        this._meals = []
        this._workouts = []
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
class App {
    constructor() {
        this._tracker = new CalorieTracker();
        document.querySelector("#meal-form").addEventListener("submit" , this._addMealOrWorkout.bind(this , "meal"));
        document.querySelector("#workout-form").addEventListener("submit" , this._addMealOrWorkout.bind(this , "workout"));
        document.querySelector("#meal-items").addEventListener("click" , this._removeItem.bind(this , "meal"))
        document.querySelector("#workout-items").addEventListener("click" , this._removeItem.bind(this , "workout"))
        document.querySelector("#filter-meals").addEventListener("keyup" , this._filterItems.bind(this , "meal"))
        document.querySelector("#filter-workouts").addEventListener("keyup" , this._filterItems.bind(this , "workout"))
        document.querySelector("#reset").addEventListener("click" , this._reset.bind(this))
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
            // console.log(type);
            if(confirm("Are You Sure You Wanna Delete This Item?")) {
                e.target.closest(".card").remove()
                let elementID = e.target.closest(".card").dataset.id;
                type === "meal" ? this._tracker.removeMeal(elementID) : this._tracker.removeWorkout(elementID)
            }

        }
    }
    _filterItems(type, e) {
        let text = e.target.value.toLowerCase();
        // console.log(text)
        let cards = document.querySelectorAll(`#${type}-items > .card`);
        // console.log(cards)
        cards.forEach(card => {
            let name = card.firstElementChild.firstElementChild.textContent.toLowerCase();
            console.log(name)
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
    }

}
let app = new App()