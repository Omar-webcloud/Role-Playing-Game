// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV4DFRbs7BkYZrouWHoKlv6siT-ZjVSRk",
  authDomain: "dragon-repeller.firebaseapp.com",
  projectId: "dragon-repeller",
  storageBucket: "dragon-repeller.firebasestorage.app",
  messagingSenderId: "97911975891",
  appId: "1:97911975891:web:cc7e1ffb6c2c304ee50926"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth for use in other files
const auth = firebase.auth();