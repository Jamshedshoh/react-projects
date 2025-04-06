import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: Meal;
  date: Date;
}

interface DailyGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const CalorieCounter = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [meal, setMeal] = useState<Meal>('breakfast');
  const [date, setDate] = useState(new Date());
  const [goals, setGoals] = useState<DailyGoal>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  });
  const [editingGoals, setEditingGoals] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedFoodItems = localStorage.getItem('foodItems');
    const savedGoals = localStorage.getItem('calorieGoals');
    
    if (savedFoodItems) {
      try {
        const parsedItems = JSON.parse(savedFoodItems);
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setFoodItems(itemsWithDates);
      } catch (e) {
        console.error('Failed to parse food items', e);
      }
    }

    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error('Failed to parse goals', e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('calorieGoals', JSON.stringify(goals));
  }, [goals]);

  const addFoodItem = () => {
    if (!name || !calories) return;

    const newItem: FoodItem = {
      id: uuidv4(),
      name,
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      meal,
      date: new Date(date)
    };

    setFoodItems([...foodItems, newItem]);
    resetForm();
  };

  const removeFoodItem = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const getTotal = (nutrient: keyof Omit<DailyGoal, 'calories'> | 'calories') => {
    return foodItems
      .filter(item => isSameDay(item.date, date))
      .reduce((sum, item) => sum + item[nutrient], 0);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getMealItems = (mealType: Meal) => {
    return foodItems
      .filter(item => item.meal === mealType && isSameDay(item.date, date))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const getRemaining = (nutrient: keyof DailyGoal) => {
    const total = getTotal(nutrient);
    return Math.max(0, goals[nutrient] - total);
  };

  const getPercentage = (nutrient: keyof DailyGoal) => {
    const total = getTotal(nutrient);
    return Math.min(100, (total / goals[nutrient]) * 100);
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };

  const openNutritionModal = (food: FoodItem) => {
    setSelectedFood(food);
    setShowNutritionModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Calorie Counter</h1>
        
        {/* Date Navigation */}
        <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-lg shadow-sm">
          <button 
            onClick={() => handleDateChange(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="text-lg font-medium">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <button 
            onClick={() => handleDateChange(1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Daily Summary</h2>
            <button 
              onClick={() => setEditingGoals(!editingGoals)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {editingGoals ? 'Cancel' : 'Edit Goals'}
            </button>
          </div>

          {editingGoals ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={goals.calories}
                  onChange={(e) => setGoals({...goals, calories: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={goals.protein}
                  onChange={(e) => setGoals({...goals, protein: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={goals.carbs}
                  onChange={(e) => setGoals({...goals, carbs: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={goals.fat}
                  onChange={(e) => setGoals({...goals, fat: parseInt(e.target.value) || 0})}
                />
              </div>
              <button
                onClick={() => setEditingGoals(false)}
                className="col-span-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Goals
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Calories</span>
                  <span className="text-sm font-medium">
                    {getTotal('calories')} / {goals.calories} ({Math.round(getPercentage('calories'))}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${getPercentage('calories')}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Protein</div>
                  <div className="text-lg font-bold">{getTotal('protein')}g</div>
                  <div className="text-xs text-blue-600">Remaining: {getRemaining('protein')}g</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Carbs</div>
                  <div className="text-lg font-bold">{getTotal('carbs')}g</div>
                  <div className="text-xs text-green-600">Remaining: {getRemaining('carbs')}g</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">Fat</div>
                  <div className="text-lg font-bold">{getTotal('fat')}g</div>
                  <div className="text-xs text-yellow-600">Remaining: {getRemaining('fat')}g</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Food Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Food</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chicken Breast"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={meal}
                onChange={(e) => setMeal(e.target.value as Meal)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="kcal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="g"
              />
            </div>
          </div>

          <button
            onClick={addFoodItem}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            disabled={!name || !calories}
          >
            Add Food
          </button>
        </div>

        {/* Meal Sections */}
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as Meal[]).map((mealType) => {
          const items = getMealItems(mealType);
          if (items.length === 0) return null;

          return (
            <div key={mealType} className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{mealType}</h2>
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {item.calories} kcal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openNutritionModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFoodItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Nutrition Modal */}
      {showNutritionModal && selectedFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedFood.name}</h3>
              <button
                onClick={() => setShowNutritionModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-sm font-medium text-blue-800">Calories</div>
                <div className="text-lg font-bold">{selectedFood.calories}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-sm font-medium text-green-800">Protein</div>
                <div className="text-lg font-bold">{selectedFood.protein}g</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-sm font-medium text-yellow-800">Meal</div>
                <div className="text-lg font-bold capitalize">{selectedFood.meal}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Protein:</span>
                <span className="font-medium">{selectedFood.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Carbohydrates:</span>
                <span className="font-medium">{selectedFood.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Fat:</span>
                <span className="font-medium">{selectedFood.fat}g</span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                <span className="text-gray-700">Added on:</span>
                <span className="font-medium">
                  {selectedFood.date.toLocaleDateString()} at {selectedFood.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieCounter;