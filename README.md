# Pixel RPG Adventure

A browser-based pixel-style role-playing game featuring authentication, persistent cloud saves, quests, equipment, crafting, boss battles, and RPG progression. User accounts are managed with Firebase Authentication, while game progress is stored in MongoDB.

## Features

### Authentication

* User registration and login
* Secure Firebase Authentication
* Persistent player profiles
* Automatic session management

### RPG Gameplay

* Multiple locations including Town, Forest, Dungeon, Temple, Inn, and Blacksmith
* Character leveling system
* Experience and progression mechanics
* Gold economy
* Inventory management
* Equipment and armor system
* Weapon upgrades
* Quests and rewards
* Crafting system
* Boss battles
* Achievement system
* Skill tree progression
* Auto-save and cloud-save support

### Pixel RPG Experience

* Pixel-art inspired visuals
* Animated monsters
* Dynamic environments
* Day and night cycle
* Responsive design for desktop and mobile devices

## Technology Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Canvas API

### Authentication

* Firebase Authentication

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

## Project Structure

```text
project-root/
│
├── index.html
├── styles.css
├── script.js
├── firebase-config.js
│
├── server/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── middleware/
│
├── .env
├── package.json
└── README.md
```

## Firebase Setup

### Create a Firebase Project

1. Visit Firebase Console
2. Create a new project
3. Add a Web Application
4. Enable Email/Password Authentication

### Configure Firebase

Open `firebase-config.js` and replace the placeholders:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## MongoDB Setup

### Create a MongoDB Atlas Cluster

1. Create a MongoDB Atlas account
2. Create a cluster
3. Create a database user
4. Whitelist your IP address
5. Copy your connection string

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/pixel-rpg?retryWrites=true&w=majority

PORT=3000
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/pixel-rpg-adventure.git

cd pixel-rpg-adventure
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## Saving Progress

Player data is automatically saved every 30 seconds.

Saved data includes:

* Character level
* Experience points
* Gold
* Health
* Inventory
* Weapons
* Armor
* Equipment
* Quests
* Achievements
* Skill tree progress
* World progression

Players can also manually save using the Save Game button.

## Gameplay Guide

### Starting Your Adventure

1. Create an account or sign in
2. Enter Town Square
3. Accept quests at the Temple
4. Explore the Forest and Dungeon
5. Defeat monsters to earn XP and gold
6. Upgrade equipment at the Blacksmith
7. Purchase supplies from the Store
8. Rest at the Inn when needed
9. Defeat bosses to unlock endgame content

### Character Progression

Players can improve:

* Strength
* Vitality
* Agility
* Magic

Skill points are earned through leveling up.

### Equipment

Available weapon types include:

* Stick
* Dagger
* Bow
* Staff
* Battle Axe
* Sword

Armor progression includes:

* Cloth Armor
* Leather Armor
* Chainmail
* Steel Armor

## Deployment

### Backend Deployment

Deploy the Node.js backend to a platform that supports server-side applications:

* Vercel
* Railway
* Render
* Firebase Functions
* Heroku

### Update API Endpoints

After deployment, replace local API URLs with your production backend URL.

Example:

```javascript
https://your-backend-domain.com/api/save-game
```

### Frontend Deployment

Deploy the frontend to GitHub Pages:

1. Push your code to GitHub
2. Open Repository Settings
3. Navigate to Pages
4. Select the main branch
5. Save changes

Your game will be available at:

```text
https://yourusername.github.io/pixel-rpg-adventure
```

## Future Roadmap

* Real pixel-art sprite sheets
* Sound effects and background music
* Additional classes and skill trees
* Crafting expansion
* Trading system
* Guild system
* PvP Arena
* Multiplayer support
* Seasonal events
* Additional endgame bosses

## License

This project is available for personal and educational use.

## Credits

UI and Game Design: Fariha Munir

Development: Md. Omar Faruk Chowdhury
