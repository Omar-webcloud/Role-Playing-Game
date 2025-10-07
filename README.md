# 🐉 Role-Playing Game (RPG)

A simple **browser-based RPG** built using **HTML, CSS, and JavaScript**, inspired by the [freeCodeCamp JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/) course project — *“Build a Role-Playing Game.”*

---

## 🎮 Features

- 💰 Player stats: **XP**, **Health**, **Gold**
- ⚔️ Multiple actions: *Go to Store*, *Go to Cave*, *Fight Dragon*
- 🛒 Buy health or weapons (if you have enough gold)
- 🧟 Monster battles with random hit chance
- 🧰 Inventory system (weapons can break!)
- 🏆 Win or lose depending on your battle outcomes

---

## 🧩 Project Structure

├── index.html # Base HTML layout and buttons

├── styles.css # Styling for layout and game interface

└── script.js # Main game logic and event handling



**Main Functions:**
- `goStore()` – navigates to the store screen  
- `buyHealth()` / `buyWeapon()` – updates gold, health, or weapons  
- `goCave()` / `fightDragon()` – triggers monster encounters  
- `attack()` – manages combat logic and monster damage  
- `isMonsterHit()` – random hit calculation  
- `defeatMonster()`, `lose()`, `winGame()` – end conditions  

---

## 🕹️ How to Play

1. **Clone this repository:**
   ```bash
   git clone https://github.com/Omar-webcloud/Role-Playing-Game.git
Open the game:

Simply open the index.html file in your browser.

Play:

Click the buttons (Go to store, Go to cave, Fight dragon)

Earn gold, buy better weapons, and defeat monsters.

Watch your stats (XP, Health, Gold) update in real-time.

## 🧠 How It Works
You start with a stick and 50 gold.

Defeating monsters grants XP and gold.

Buying weapons increases attack power.

Random chance determines if your hits land.

Sometimes your weapon breaks — so plan carefully!

Win by defeating the dragon 🐲



## 📝 License
This project is open-source and available under the MIT License.

## 👨‍💻 Developed by Omar
Built with ❤️ and JavaScript
