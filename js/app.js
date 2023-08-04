class CalorieTracker {
    constructor() {
        this._calorieLimit = 3000 ,
        this._totalCalories = 0 ,
        this._meals = [],
        this._workouts = [];
        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesRemaining()
    }
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._render()
    }
    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
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
        caloriesRemainingElm.innerHTML = this._calorieLimit - this._totalCalories;
    }
    _render() {
        this._displayCaloriesTotal()
        this._displayCaloriesConsumed()
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining()
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

let tracker = new CalorieTracker()
let breakfast = new Meal("Breakfast" , 400);
let dinner = new Meal("Dinner" , 600);
let pushups = new Workout("Pushups" , 300);
let running = new Workout("Running" , 600);
tracker.addMeal(breakfast)
tracker.addMeal(dinner)
tracker.addWorkout(pushups)
tracker.addWorkout(running)
// console.log(breakfast)
// console.log(pushups)
// console.log(tracker._totalCalories)