# Fodpick

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**Stop the scroll. Start the stove.** Fodpick is a minimalist web application designed to cure "Decision Fatigue." Instead of giving you 1,000 recipes you *can't* make, it gives you **exactly one** recipe you *can* make, based on what is actually in your fridge.

[Live Demo Link (Replace with your Netlify/GitHub URL)]

---

## ✨ Features

- **Decision-Free UI:** No endless scrolling. Input your ingredients and get a single, curated suggestion.
- **Reroll Logic:** Don't like the result? One click gives you a new random match from your filtered criteria.
- **Cuisine Filtering:** Sort by Italian, Asian, Mexican, or Mediterranean styles.
- **Dynamic Ingredients:** Input as many ingredients as you have—the engine handles the rest.
- **Ultra-Lightweight:** 100% Static React app. Zero backend dependencies. Lightning fast.

---

## 🚀 Tech Stack

- **Frontend:** React.js (Hooks, State Management)
- **Styling:** Custom CSS3 (Glassmorphism, CSS Variables, Animations)
- **Data:** Local JSON (Static Database)
- **Build Tool:** Vite
- **Deployment:** Netlify / GitHub Pages

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/rolsorstart01/FoodPicker.git](https://github.com/rolsorstart01/FoodPicker.git
   Navigate to the project folder:Bashcd YOUR_NEW_REPO_NAME
Install dependencies:Bashnpm install
Start the development server:Bashnpm run dev
🥗 Adding Your Own RecipesThe engine runs on db.json. To add your own recipes, simply append to the recipes array in this format:JSON{
  "id": 101,
  "title": "Your Recipe Name",
  "cuisine": "Mexican",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "instructions": "1. Step one. 2. Step two.",
  "time": "15 min"
}
📸 ScreenshotsDashboardRecipe Reveal🤝 ContributingThis project was built to be open-source and community-driven. If you have a great 3-ingredient recipe or a UI improvement, feel free to fork this repo and submit a Pull Request!📜 LicenseDistributed under the MIT License. See LICENSE for more information.Built with ❤️rolsorstart01