require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;
console.log("Connecting to MongoDB with URI:", uri.substring(0, 20) + "...");
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
}

// API Routes
app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    
    const database = client.db('dragon-repeller');
    const users = database.collection('users');
    
    // Check if user already exists
    const existingUser = await users.findOne({ uid });
    
    if (existingUser) {
      // Update last login time
      await users.updateOne(
        { uid },
        { $set: { lastLogin: new Date() } }
      );
      return res.status(200).json({ message: 'User login recorded' });
    }
    
    // Create new user document
    const newUser = {
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      createdAt: new Date(),
      lastLogin: new Date(),
      gameData: {
        xp: 0,
        health: 100,
        gold: 50,
        inventory: ["stick"],
        currentWeaponIndex: 0
      }
    };
    
    await users.insertOne(newUser);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error handling user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save game data
app.post('/api/save-game', async (req, res) => {
  try {
    const { uid, gameData } = req.body;
    
    if (!uid || !gameData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const database = client.db('dragon-repeller');
    const users = database.collection('users');
    
    await users.updateOne(
      { uid },
      { $set: { 
        gameData,
        lastSaved: new Date()
      }}
    );
    
    res.status(200).json({ message: 'Game saved successfully' });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get game data
app.get('/api/game-data/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const database = client.db('dragon-repeller');
    const users = database.collection('users');
    
    const user = await users.findOne({ uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ gameData: user.gameData });
  } catch (error) {
    console.error('Error retrieving game data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB and start server
connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected - game ready to use`);
      
      // Only show localhost message in development
      if (PORT === 3000) {
        console.log(`Open http://localhost:${PORT} to play the game`);
      }
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    // Start server anyway to handle requests gracefully
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} without MongoDB connection`);
    });
  });