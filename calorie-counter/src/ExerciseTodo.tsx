import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  category: 'cardio' | 'strength' | 'flexibility' | 'other';
  duration?: number; // in minutes for cardio
  weight?: number; // for strength training
  dateAdded: Date;
};

type FilterType = 'all' | 'active' | 'completed' | 'cardio' | 'strength' | 'flexibility';

const ExerciseTodo = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [category, setCategory] = useState<'cardio' | 'strength' | 'flexibility' | 'other'>('strength');
  const [duration, setDuration] = useState(30);
  const [weight, setWeight] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Exercise>>({});

  // Load exercises from localStorage
  useEffect(() => {
    const savedExercises = localStorage.getItem('exerciseTodos');
    if (savedExercises) {
      try {
        const parsedExercises = JSON.parse(savedExercises);
        const exercisesWithDates = parsedExercises.map((ex: any) => ({
          ...ex,
          dateAdded: new Date(ex.dateAdded)
        }));
        setExercises(exercisesWithDates);
      } catch (e) {
        console.error('Failed to parse exercises', e);
      }
    }
  }, []);

  // Save exercises to localStorage
  useEffect(() => {
    localStorage.setItem('exerciseTodos', JSON.stringify(exercises));
  }, [exercises]);

  const addExercise = () => {
    if (!inputValue.trim()) return;

    const newExercise: Exercise = {
      id: uuidv4(),
      name: inputValue.trim(),
      sets,
      reps,
      completed: false,
      category,
      dateAdded: new Date(),
      ...(category === 'cardio' && { duration }),
      ...(category === 'strength' && { weight })
    };

    setExercises([newExercise, ...exercises]);
    resetForm();
  };

  const toggleComplete = (id: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const startEditing = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setEditValues({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      category: exercise.category,
      duration: exercise.duration,
      weight: exercise.weight
    });
  };

  const saveEdit = () => {
    if (!editingId || !editValues.name?.trim()) return;

    setExercises(exercises.map(ex => 
      ex.id === editingId ? { 
        ...ex, 
        name: editValues.name || ex.name,
        sets: editValues.sets || ex.sets,
        reps: editValues.reps || ex.reps,
        category: editValues.category || ex.category,
        duration: editValues.duration || ex.duration,
        weight: editValues.weight || ex.weight
      } : ex
    ));
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const resetForm = () => {
    setInputValue('');
    setSets(3);
    setReps(10);
    setCategory('strength');
    setDuration(30);
    setWeight(0);
  };

  const clearCompleted = () => {
    setExercises(exercises.filter(ex => !ex.completed));
  };

  const filteredExercises = exercises.filter(ex => {
    if (filter === 'all') return true;
    if (filter === 'active') return !ex.completed;
    if (filter === 'completed') return ex.completed;
    return ex.category === filter;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'cardio': return 'bg-red-100 text-red-800';
      case 'strength': return 'bg-blue-100 text-blue-800';
      case 'flexibility': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Exercise To-Do</h1>
        <p className="text-center text-gray-600 mb-8">Track your workout routine</p>

        {/* Add Exercise Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700 mb-1">
              Exercise Name
            </label>
            <input
              type="text"
              id="exerciseName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., Bench Press, Running"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="sets" className="block text-sm font-medium text-gray-700 mb-1">
                Sets
              </label>
              <input
                type="number"
                id="sets"
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
                Reps/Duration
              </label>
              <input
                type="number"
                id="reps"
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={category === 'cardio' ? duration : reps}
                onChange={(e) => 
                  category === 'cardio' 
                    ? setDuration(parseInt(e.target.value) || 0) 
                    : setReps(parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {category === 'strength' && (
            <div className="mb-4">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          <button
            onClick={addExercise}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!inputValue.trim()}
          >
            Add Exercise
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {(['all', 'active', 'completed', 'cardio', 'strength', 'flexibility'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === f 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No exercises found. Add some exercises to get started!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredExercises.map((exercise) => (
                <li key={exercise.id} className={`p-4 ${exercise.completed ? 'bg-gray-50' : ''}`}>
                  {editingId === exercise.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={editValues.name || ''}
                        onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                      />
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Sets</label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            value={editValues.sets || 0}
                            onChange={(e) => setEditValues({...editValues, sets: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {editValues.category === 'cardio' ? 'Mins' : 'Reps'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            value={
                              editValues.category === 'cardio' 
                                ? (editValues.duration || 0)
                                : (editValues.reps || 0)
                            }
                            onChange={(e) => 
                              editValues.category === 'cardio'
                                ? setEditValues({...editValues, duration: parseInt(e.target.value) || 0})
                                : setEditValues({...editValues, reps: parseInt(e.target.value) || 0})
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <select
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            value={editValues.category || 'strength'}
                            onChange={(e) => setEditValues({...editValues, category: e.target.value as any})}
                          >
                            <option value="strength">Strength</option>
                            <option value="cardio">Cardio</option>
                            <option value="flexibility">Flexibility</option>
                          </select>
                        </div>
                      </div>

                      {editValues.category === 'strength' && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            value={editValues.weight || 0}
                            onChange={(e) => setEditValues({...editValues, weight: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <button
                        onClick={() => toggleComplete(exercise.id)}
                        className={`mt-1 flex-shrink-0 h-5 w-5 rounded border ${
                          exercise.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300'
                        }`}
                      >
                        {exercise.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mx-auto">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      <div className="ml-3 flex-1">
                        <div className={`flex justify-between ${exercise.completed ? 'opacity-70' : ''}`}>
                          <span className={`block ${exercise.completed ? 'line-through' : ''}`}>
                            {exercise.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(exercise.dateAdded).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(exercise.category)}`}>
                            {exercise.category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {exercise.sets} × {exercise.category === 'cardio' ? `${exercise.duration} mins` : `${exercise.reps} reps`}
                            {exercise.category === 'strength' && exercise.weight && ` @ ${exercise.weight}kg`}
                          </span>
                        </div>
                      </div>

                      <div className="ml-2 flex space-x-1">
                        <button
                          onClick={() => startEditing(exercise)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteExercise(exercise.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats and Actions */}
        <div className="mt-4 flex flex-wrap justify-between items-center text-sm text-gray-600">
          <div>
            {exercises.filter(ex => !ex.completed).length} exercises remaining
          </div>
          <div>
            {exercises.filter(ex => ex.completed).length > 0 && (
              <button
                onClick={clearCompleted}
                className="text-red-600 hover:text-red-800"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTodo;