import { useState, useEffect } from 'react';
import data from '../db.json';
import './App.css';

// --- Google Ads Component ---
const AdBanner = () => {
  useEffect(() => {
    try {
      // The push call needs to happen once the component is mounted
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="ad-wrapper">
      <small>ADVERTISEMENT</small>
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-5270573117216515" // Your Verified ID
           data-ad-slot="5558403184"             // Your Slot ID
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

function App() {
  const [recipes] = useState(data.recipes);
  const [categories, setCategories] = useState({});
  const [cuisines, setCuisines] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedIngs, setSelectedIngs] = useState([""]);
  const [foundRecipe, setFoundRecipe] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // 1. Group ingredients by category for the dropdowns
    const groups = {};
    recipes.forEach(r => {
      r.ingredients.forEach(ing => {
        const cat = r.category || "Other";
        if (!groups[cat]) groups[cat] = new Set();
        groups[cat].add(ing);
      });
    });
    
    const formattedGroups = {};
    Object.keys(groups).forEach(key => {
      formattedGroups[key] = [...groups[key]].sort();
    });

    setCategories(formattedGroups);
    setCuisines(["All", ...new Set(recipes.map(r => r.cuisine))].sort());
    
    // 2. Dark Mode Toggle
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [recipes, darkMode]);

  const addIngredientSlot = () => setSelectedIngs([...selectedIngs, ""]);
  
  const updateIng = (idx, val) => {
    const next = [...selectedIngs];
    next[idx] = val;
    setSelectedIngs(next);
  };

  const clearAll = () => {
    setSelectedIngs([""]);
    setSelectedCuisine("All");
    setFoundRecipe(null);
    setHasSearched(false);
  };

  const findRecipe = () => {
    setHasSearched(true);
    // Fridge-First: We use what the user selected
    const fridge = selectedIngs.filter(i => i !== "").map(i => i.toLowerCase());
    
    const matches = recipes.filter(recipe => {
      const cuisineMatch = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
      
      // Strict Check: Every ingredient in the recipe MUST be in your fridge selection
      const canMake = recipe.ingredients.every(ing => 
        fridge.includes(ing.toLowerCase())
      );
      return cuisineMatch && canMake;
    });

    if (matches.length > 0) {
      // Pick a random one, preferably different from current
      const otherMatches = matches.length > 1 && foundRecipe 
        ? matches.filter(m => m.id !== foundRecipe.id) : matches;
      setFoundRecipe(otherMatches[Math.floor(Math.random() * otherMatches.length)]);
    } else {
      setFoundRecipe(null);
    }
  };

  return (
    <div className="engine-container">
      <nav className="top-nav">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>

      <header>
        <h1>FodPick</h1>
        <p>No extra trips to the store. Use what you have.</p>
      </header>

      <div className="filter-group">
        <label>Cuisine Style</label>
        <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Ingredients in your Fridge</label>
        <div className="dropdown-list">
          {selectedIngs.map((val, idx) => (
            <select key={idx} value={val} onChange={(e) => updateIng(idx, e.target.value)}>
              <option value="">Select Ingredient...</option>
              {Object.keys(categories).map(cat => (
                <optgroup key={cat} label={cat}>
                  {categories[cat].map(ing => (
                    <option key={ing} value={ing}>{ing}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          ))}
        </div>
        <div className="button-row">
          <button className="add-btn" onClick={addIngredientSlot}>+ Add Item</button>
          <button className="clear-btn" onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <button className="main-btn" onClick={findRecipe}>
        {foundRecipe ? "NOT THIS ONE, REROLL" : "DECIDE FOR ME"}
      </button>

      {foundRecipe ? (
        <div className="recipe-card animate-in">
          <div className="card-header">
            <span className="cuisine-tag">{foundRecipe.cuisine}</span>
            <span className="time-tag">⏱ {foundRecipe.time}</span>
          </div>
          <h2>{foundRecipe.title}</h2>
          <p className="recipe-meta">Ingredients: {foundRecipe.ingredients.join(", ")}</p>
          <div className="method">
            <h3>Method:</h3>
            <p>{foundRecipe.instructions}</p>
          </div>
          <AdBanner /> {/* Ad inside the card */}
        </div>
      ) : hasSearched && (
        <div className="no-match-box animate-in">
          <p>❌ No recipes in our DB match these exact items.</p>
          <span>Try adding basics like <b>Flour</b>, <b>Sugar</b>, or <b>Milk</b>.</span>
        </div>
      )}

      {!foundRecipe && <AdBanner />} {/* Ad at bottom if no recipe found */}
      
      <footer className="app-footer">
        <p>© 2026 FodPick • Privacy Policy</p>
      </footer>
    </div>
  );
}

export default App;