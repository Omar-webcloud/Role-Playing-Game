// DOM Elements
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const userDisplay = document.getElementById('user-display');
const logoutButton = document.getElementById('logout-button');
const gameContainer = document.getElementById('game');
const authTabBtns = document.querySelectorAll('.auth-tab-btn');
const authTabContents = document.querySelectorAll('.auth-tab-content');
const closeModalBtn = document.querySelector('.close');

// Show auth modal on page load if user is not logged in
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      userDisplay.textContent = `Welcome, ${user.email}`;
      logoutButton.style.display = 'inline-block';
      gameContainer.style.display = 'block';
      authModal.style.display = 'none';
      
      // Save user data to MongoDB (via serverless function)
      saveUserData(user);
    } else {
      // No user is signed in, show auth modal
      authModal.style.display = 'block';
      gameContainer.style.display = 'none';
      logoutButton.style.display = 'none';
    }
  });
});

// Tab switching functionality
authTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    // Update active tab button
    authTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Show selected tab content
    authTabContents.forEach(content => {
      content.style.display = content.id === `${tabName}-tab` ? 'block' : 'none';
    });
  });
});

// Close modal button
closeModalBtn.addEventListener('click', () => {
  // Only allow closing if user is logged in
  if (auth.currentUser) {
    authModal.style.display = 'none';
  }
});

// Login form submission
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  loginError.textContent = '';
  
  // Sign in with Firebase
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Signed in successfully
      authModal.style.display = 'none';
      loginForm.reset();
    })
    .catch(error => {
      // Handle errors
      loginError.textContent = error.message;
    });
});

// Signup form submission
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;
  
  signupError.textContent = '';
  
  // Check if passwords match
  if (password !== confirmPassword) {
    signupError.textContent = 'Passwords do not match';
    return;
  }
  
  // Create user with Firebase
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Signed up successfully
      authModal.style.display = 'none';
      signupForm.reset();
    })
    .catch(error => {
      // Handle errors
      signupError.textContent = error.message;
    });
});

// Logout button
logoutButton.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      // Sign-out successful
      authModal.style.display = 'block';
      gameContainer.style.display = 'none';
    })
    .catch(error => {
      console.error('Error signing out:', error);
    });
});

// Function to save user data to MongoDB (via serverless function)
function saveUserData(user) {
  // This function will be implemented when we set up the MongoDB connection
  // For now, we'll just log the user data
  console.log('User data to be saved:', user.uid, user.email);
  
  // In a real implementation, we would make an API call to a serverless function
  // that connects to MongoDB and saves the user data
  // Example:
  // fetch('/api/saveUserData', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     uid: user.uid,
  //     email: user.email,
  //     lastLogin: new Date().toISOString()
  //   }),
  // });
}