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

  // Extract unique ingredients and cuisines on load
  useEffect(() => {
    const allIngs = [...new Set(recipes.flatMap(r => r.ingredients))].sort();
    const allCuisines = ["All", ...new Set(recipes.map(r => r.cuisine))].sort();
    setAvailableIngs(allIngs);
    setCuisines(allCuisines);
  }, [recipes]);

  const addIngredientSlot = () => setSelectedIngs([...selectedIngs, ""]);
  
  const updateIng = (index, val) => {
    const next = [...selectedIngs];
    next[index] = val;
    setSelectedIngs(next);
  };

  const resetEngine = () => {
    setSelectedIngs([""]);
    setSelectedCuisine("All");
    setFoundRecipe(null);
  };

  const findRecipe = () => {
    const activeIngs = selectedIngs.filter(i => i !== "");
    
    // The "Anti-Decision" Filter
    const matches = recipes.filter(r => {
      const cuisineMatch = selectedCuisine === "All" || r.cuisine === selectedCuisine;
      const ingMatch = r.ingredients.some(ing => activeIngs.includes(ing));
      return cuisineMatch && ingMatch;
    });

    if (matches.length > 0) {
      // Pick a random one that isn't the current one (if possible)
      const otherMatches = matches.length > 1 && foundRecipe 
        ? matches.filter(m => m.id !== foundRecipe.id) 
        : matches;
      
      const randomItem = otherMatches[Math.floor(Math.random() * otherMatches.length)];
      setFoundRecipe(randomItem);
    } else {
      alert("No recipes found! Try adding more common ingredients like 'Garlic' or 'Pasta'.");
    }
  };

  return (
    <div className="engine-container">
      <header>
        <h1>FodPick</h1>
        <p>Stop thinking. Start cooking.</p>
      </header>

      <div className="filter-group">
        <label>1. Choose Style</label>
        <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>2. Your Ingredients</label>
        <div className="dropdown-list">
          {selectedIngs.map((val, idx) => (
            <select key={idx} value={val} onChange={(e) => updateIng(idx, e.target.value)}>
              <option value="">Select Ingredient...</option>
              {availableIngs.map(ing => <option key={ing} value={ing}>{ing}</option>)}
            </select>
          ))}
        </div>
        <button className="add-btn" onClick={addIngredientSlot}>+ Add Another Item</button>
      </div>

      <div className="action-row">
        <button className="main-btn" onClick={findRecipe}>
          {foundRecipe ? "NOT FEELING IT? REROLL" : "DECIDE FOR ME"}
        </button>
        {foundRecipe && <button className="reset-link" onClick={resetEngine}>Clear All</button>}
      </div>

      {foundRecipe && (
        <div className="recipe-card animate-in">
          <div className="card-header">
            <span className="cuisine-tag">{foundRecipe.cuisine}</span>
            <span className="time-tag">⏱ {foundRecipe.time}</span>
          </div>
          <h2>{foundRecipe.title}</h2>
          <div className="ingredients-needed">
             <strong>Needs:</strong> {foundRecipe.ingredients.join(", ")}
          </div>
          <div className="method">
            <h3>How to make it:</h3>
            <p>{foundRecipe.instructions}</p>
          </div>
        </div>
      )}

      <div className="ad-box">ADVERTISEMENT SUPPORTING THE CREATOR</div>
    </div>
  );
}

export default App;