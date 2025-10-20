# Dragon Repeller RPG with Firebase Authentication and MongoDB

This is a role-playing game with user authentication using Firebase and game data storage using MongoDB.

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Add a web app to your project
3. Enable Email/Password authentication in the Authentication section
4. Copy your Firebase configuration from Project Settings
5. Open `firebase-config.js` and replace the placeholder values with your actual Firebase configuration

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

### 2. MongoDB Setup

1. Create a free MongoDB Atlas account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient)
3. Set up a database user with password
4. Get your connection string from MongoDB Atlas
5. Open the `.env` file and replace the placeholder MongoDB URI with your actual connection string

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/dragon-repeller?retryWrites=true&w=majority
```

### 3. Install Dependencies and Run the Server

1. Install Node.js if you haven't already
2. Open a terminal in the project directory
3. Install dependencies:

```
npm install
```

4. Start the server:

```
npm start
```

## Deploying to GitHub Pages

To deploy this game to GitHub Pages, you'll need to make a few adjustments since GitHub Pages only supports static content:

### 1. Deploy the Backend

First, deploy your Node.js backend to a service that supports server-side code:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/) with Netlify Functions
- [Heroku](https://www.heroku.com/)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)

### 2. Update API URLs

After deploying your backend, update the API URLs in `script.js`:

1. Find the `saveGameData` and `loadGameData` functions
2. Replace `https://your-deployed-backend-url.com` with your actual deployed backend URL

### 3. Deploy to GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select your main branch as the source
4. Click Save

Your game will be available at `https://yourusername.github.io/repository-name/`
```

5. Open your browser and navigate to `http://localhost:3000`

## Features

- User authentication (signup, login, logout)
- Game progress automatically saved to MongoDB
- Manual save option with save button
- Game state persists between sessions

## Game Instructions

1. Sign up or log in to start playing
2. Navigate through the game using the buttons
3. Your progress is automatically saved every 30 seconds
4. You can manually save your progress using the Save Game button

## Technologies Used

- HTML, CSS, JavaScript
- Firebase Authentication
- MongoDB for data storage
- Express.js for the server
