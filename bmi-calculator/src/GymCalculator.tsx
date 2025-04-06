import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  unit: "kg" | "lb";
  completed: boolean;
  date?: Date;
};

type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
  date: Date;
};

const GymCalculator = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(0);
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("workoutHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const historyWithDates = parsedHistory.map((workout: any) => ({
          ...workout,
          date: new Date(workout.date),
          exercises: workout.exercises.map((ex: any) => ({
            ...ex,
            date: ex.date ? new Date(ex.date) : undefined,
          })),
        }));
        setWorkoutHistory(historyWithDates);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (workoutHistory.length > 0) {
      localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
    }
  }, [workoutHistory]);

  const addExercise = () => {
    if (!exerciseName) return;

    const newExercise: Exercise = {
      id: uuidv4(),
      name: exerciseName,
      sets,
      reps,
      weight,
      unit,
      completed: false,
    };

    setExercises([...exercises, newExercise]);
    setExerciseName("");
    setWeight(0);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const toggleExerciseComplete = (id: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const saveWorkout = () => {
    if (!workoutName || exercises.length === 0) return;

    const completedExercises = exercises.map((ex) => ({
      ...ex,
      date: new Date(),
    }));

    const newWorkout: Workout = {
      id: uuidv4(),
      name: workoutName,
      exercises: completedExercises,
      date: new Date(),
    };

    setWorkoutHistory([newWorkout, ...workoutHistory]);
    setExercises([]);
    setWorkoutName("");
  };

  const calculateOneRepMax = (weight: number, reps: number): number => {
    // Using Epley formula: 1RM = w × (1 + r/30)
    return Math.round(weight * (1 + reps / 30));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Gym Workout Calculator
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Workout Builder */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Build Your Workout
            </h2>

            <div className="mb-4">
              <label
                htmlFor="workoutName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Workout Name
              </label>
              <input
                type="text"
                id="workoutName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Push Day, Leg Day"
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Add Exercises
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="exerciseName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    id="exerciseName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="e.g., Bench Press"
                  />
                </div>

                <div className="flex items-end space-x-2">
                  <div>
                    <label
                      htmlFor="unit"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Unit
                    </label>
                    <select
                      id="unit"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                  <button
                    onClick={addExercise}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="sets"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sets
                  </label>
                  <input
                    type="number"
                    id="sets"
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={sets}
                    onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="reps"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reps
                  </label>
                  <input
                    type="number"
                    id="reps"
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Weight ({unit})
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
              </div>

              {exercises.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    Current Exercises
                  </h3>
                  <ul className="space-y-2">
                    {exercises.map((exercise) => (
                      <li
                        key={exercise.id}
                        className={`p-3 border rounded-md flex justify-between items-center ${
                          exercise.completed
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-gray-600">
                            {exercise.sets} × {exercise.reps} @{" "}
                            {exercise.weight}
                            {exercise.unit}
                            {exercise.reps > 1 && (
                              <span className="ml-2 text-xs text-gray-500">
                                (1RM: ~
                                {calculateOneRepMax(
                                  exercise.weight,
                                  exercise.reps
                                )}
                                {exercise.unit})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleExerciseComplete(exercise.id)}
                            className={`p-1 rounded ${
                              exercise.completed
                                ? "text-green-600 hover:text-green-800"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                            title={
                              exercise.completed
                                ? "Mark incomplete"
                                : "Mark complete"
                            }
                          >
                            {exercise.completed ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                            title="Remove exercise"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <button
                      onClick={saveWorkout}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      disabled={exercises.length === 0 || !workoutName}
                    >
                      Save Workout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Workout History */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Workout History
              </h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md"
              >
                {showHistory ? "Hide" : "Show"}
              </button>
            </div>

            {showHistory &&
              (workoutHistory.length > 0 ? (
                <div className="space-y-4">
                  {workoutHistory.map((workout) => (
                    <div
                      key={workout.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                        <h3 className="font-medium">{workout.name}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {workout.exercises.map((exercise) => (
                          <li key={exercise.id} className="px-4 py-3">
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-gray-600">
                              {exercise.sets} × {exercise.reps} @{" "}
                              {exercise.weight}
                              {exercise.unit}
                              {exercise.reps > 1 && (
                                <span className="ml-2 text-xs text-gray-500">
                                  (1RM: ~
                                  {calculateOneRepMax(
                                    exercise.weight,
                                    exercise.reps
                                  )}
                                  {exercise.unit})
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No workout history yet. Save your first workout to see it
                  here.
                </div>
              ))}

            {/* 1RM Calculator */}
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                One-Rep Max Calculator
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Estimate your one-rep max (1RM) using the Epley formula: 1RM = w
                × (1 + r/30)
              </p>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <label
                    htmlFor="rm-weight"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Weight
                  </label>
                  <input
                    type="number"
                    id="rm-weight"
                    min="0"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rm-reps"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reps
                  </label>
                  <input
                    type="number"
                    id="rm-reps"
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rm-unit"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Unit
                  </label>
                  <select
                    id="rm-unit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  const weight =
                    parseFloat(
                      (document.getElementById("rm-weight") as HTMLInputElement)
                        .value
                    ) || 0;
                  const reps =
                    parseFloat(
                      (document.getElementById("rm-reps") as HTMLInputElement)
                        .value
                    ) || 0;
                  const unit = (
                    document.getElementById("rm-unit") as HTMLSelectElement
                  ).value as "kg" | "lb";
                  const oneRepMax = calculateOneRepMax(weight, reps);
                  alert(`Your estimated 1RM: ${oneRepMax}${unit}`);
                }}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Calculate 1RM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymCalculator;
