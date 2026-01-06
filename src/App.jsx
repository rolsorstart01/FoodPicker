import { useState, useEffect } from 'react';
import data from '../db.json';
import './App.css';

function App() {
  const [recipes] = useState(data.recipes);
  const [availableIngs, setAvailableIngs] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  
  // User selections
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedIngs, setSelectedIngs] = useState([""]); // Starts with one empty input
  const [foundRecipe, setFoundRecipe] = useState(null);

  useEffect(() => {
    // Extract unique ingredients and cuisines
    const allIngs = [...new Set(recipes.flatMap(r => r.ingredients))].sort();
    const allCuisines = ["All", ...new Set(recipes.map(r => r.cuisine))].sort();
    setAvailableIngs(allIngs);
    setCuisines(allCuisines);
  }, [recipes]);

  // Handle adding/removing ingredient dropdowns
  const addIngredientSlot = () => setSelectedIngs([...selectedIngs, ""]);
  const updateIng = (index, val) => {
    const next = [...selectedIngs];
    next[index] = val;
    setSelectedIngs(next);
  };

  const findRecipe = () => {
    const activeIngs = selectedIngs.filter(i => i !== "");
    
    const matches = recipes.filter(r => {
      const cuisineMatch = selectedCuisine === "All" || r.cuisine === selectedCuisine;
      const ingMatch = r.ingredients.some(ing => activeIngs.includes(ing));
      return cuisineMatch && ingMatch;
    });

    if (matches.length > 0) {
      setFoundRecipe(matches[Math.floor(Math.random() * matches.length)]);
    } else {
      alert("No recipes found! Try widening your cuisine or ingredients.");
    }
  };

  return (
    <div className="engine-container">
      <h1>🚫 Anti-Decision Engine</h1>

      <div className="filter-group">
        <label>Step 1: Pick a Cuisine</label>
        <select onChange={(e) => setSelectedCuisine(e.target.value)}>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Step 2: What's in your fridge?</label>
        {selectedIngs.map((val, idx) => (
          <select key={idx} value={val} onChange={(e) => updateIng(idx, e.target.value)}>
            <option value="">Select Ingredient...</option>
            {availableIngs.map(ing => <option key={ing} value={ing}>{ing}</option>)}
          </select>
        ))}
        <button className="add-btn" onClick={addIngredientSlot}>+ Add More Ingredients</button>
      </div>

      <button className="main-btn" onClick={findRecipe}>DECIDE MY MEAL</button>

      {foundRecipe && (
        <div className="recipe-card animate-in">
          <div className="card-header">
            <span className="cuisine-tag">{foundRecipe.cuisine}</span>
            <span className="time-tag">{foundRecipe.time}</span>
          </div>
          <h2>{foundRecipe.title}</h2>
          <div className="method">
            <h3>Method:</h3>
            <p>{foundRecipe.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;