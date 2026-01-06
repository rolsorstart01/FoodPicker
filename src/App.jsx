import { useState, useEffect } from 'react';
import data from '../db.json';
import './App.css';

// --- Google Ads Component ---
const AdBanner = () => {
  useEffect(() => {
    try {
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
           data-ad-client="pub-5270573117216515"
           data-ad-slot="5558403184"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

function App() {
  const [view, setView] = useState('home'); // home, privacy, terms
  const [recipes] = useState(data.recipes);
  const [categories, setCategories] = useState({});
  const [cuisines, setCuisines] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedIngs, setSelectedIngs] = useState([""]);
  const [foundRecipe, setFoundRecipe] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const groups = {};
    recipes.forEach(r => {
      r.ingredients.forEach(ing => {
        const cat = r.category || "General";
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
    
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [recipes, darkMode]);

  const changeView = (v) => { setView(v); window.scrollTo(0,0); };
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
    const fridge = selectedIngs.filter(i => i !== "").map(i => i.toLowerCase());
    const matches = recipes.filter(recipe => {
      const cuisineMatch = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
      const canMake = recipe.ingredients.every(ing => fridge.includes(ing.toLowerCase()));
      return cuisineMatch && canMake;
    });

    if (matches.length > 0) {
      const otherMatches = matches.length > 1 && foundRecipe 
        ? matches.filter(m => m.id !== foundRecipe.id) : matches;
      setFoundRecipe(otherMatches[Math.floor(Math.random() * otherMatches.length)]);
    } else {
      setFoundRecipe(null);
    }
  };

  // --- View Logic ---
  if (view === 'privacy') return <PrivacyPage goBack={() => setView('home')} />;
  if (view === 'terms') return <TermsPage goBack={() => setView('home')} />;

  return (
    <div className="engine-container">
      <nav className="top-nav">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      <header>
        <h1>FodPick</h1>
        <p>Cook with what you have. No store runs.</p>
      </header>

      <div className="filter-group">
        <label>Cuisine Style</label>
        <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Your Fridge</label>
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
        {foundRecipe ? "REROLL" : "DECIDE FOR ME"}
      </button>

      {foundRecipe ? (
        <div className="recipe-card animate-in">
          <div className="card-header">
            <span className="cuisine-tag">{foundRecipe.cuisine}</span>
            <span className="time-tag">⏱ {foundRecipe.time}</span>
          </div>
          <h2>{foundRecipe.title}</h2>
          <div className="method">
            <h3>Method:</h3>
            <p>{foundRecipe.instructions}</p>
          </div>
          <AdBanner />
        </div>
      ) : hasSearched && (
        <div className="no-match-box animate-in">
          <p>❌ No exact matches. Add pantry staples like <b>Water</b>, <b>Salt</b>, or <b>Oil</b>.</p>
        </div>
      )}

      {!foundRecipe && <AdBanner />}

      <footer className="app-footer">
        <p>© 2026 -FodPick</p>
        <div className="footer-links">
          <span onClick={() => changeView('privacy')}>Privacy Policy</span>
          <span onClick={() => changeView('terms')}>Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}

// --- Legal Sub-Components ---

const PrivacyPage = ({ goBack }) => (
  <div className="legal-container animate-in">
    <span className="back-btn" onClick={goBack}>← Back to App</span>
    <h1>Privacy Policy</h1>
    <p>Effective Date: January 6, 2026</p>
    <section>
      <h2>1. Introduction</h2>
      <p>This Privacy Policy explains how FodPick ("we", "us") handles information. We are committed to protecting your privacy.</p>
    </section>
    <section>
      <h2>2. Data Collection</h2>
      <p>We do not collect personal identification information. Your ingredient selections are processed locally on your device and are not stored on our servers.</p>
    </section>
    <section>
      <h2>3. Google AdSense & Cookies</h2>
      <p>We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.</p>
    </section>
    <section>
      <h2>4. Third-Party Links</h2>
      <p>Our application contains advertisements. Clicking on these ads may direct you to third-party websites with their own privacy policies.</p>
    </section>
  </div>
);

const TermsPage = ({ goBack }) => (
  <div className="legal-container animate-in">
    <span className="back-btn" onClick={goBack}>← Back to App</span>
    <h1>Terms of Service</h1>
    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>By using the FodPick, you agree to these terms. If you do not agree, please do not use the application.</p>
    </section>
    <section>
      <h2>2. Disclaimer of Warranty</h2>
      <p>The service is provided "as is". We make no warranty that recipe suggestions are accurate or safe for all dietary requirements. Use recipes at your own risk.</p>
    </section>
    <section>
      <h2>3. Limitation of Liability</h2>
      <p>We are not liable for any damages, including but not limited to kitchen accidents, food poisoning, or allergic reactions resulting from the use of this app.</p>
    </section>
  </div>
);

export default App;