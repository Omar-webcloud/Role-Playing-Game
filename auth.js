const authModal = document.getElementById("auth-modal");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");
const userDisplay = document.getElementById("user-display");
const logoutButton = document.getElementById("logout-button");
const gameContainer = document.getElementById("game");
const authTabBtns = document.querySelectorAll(".auth-tab-btn");
const authTabContents = document.querySelectorAll(".auth-tab-content");
const closeModalBtn = document.querySelector(".close");

window.currentUser = null;
userDisplay.textContent = "Guest mode - local saves";
logoutButton.textContent = "Sign In";
logoutButton.style.display = "inline-flex";
gameContainer.style.display = "block";
authModal.style.display = "none";

function setAuthView(user) {
  if (user) {
    userDisplay.textContent = `Cloud sync on: ${user.email}`;
    logoutButton.textContent = "Logout";
    logoutButton.style.display = "inline-flex";
    gameContainer.style.display = "block";
    authModal.style.display = "none";
    window.currentUser = user;

    if (typeof loadGameData === "function") {
      loadGameData(user.uid);
    }

    if (typeof saveUserData === "function") {
      saveUserData(user);
    }
    return;
  }

  window.currentUser = null;
  userDisplay.textContent = "Guest mode - local saves";
  logoutButton.textContent = "Sign In";
  logoutButton.style.display = "inline-flex";
  gameContainer.style.display = "block";
  authModal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    setAuthView(user);
  });
});

authTabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabName = btn.getAttribute("data-tab");

    authTabBtns.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");

    authTabContents.forEach((content) => {
      content.style.display = content.id === `${tabName}-tab` ? "block" : "none";
    });
  });
});

closeModalBtn.addEventListener("click", () => {
  authModal.style.display = "none";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  loginError.textContent = "";

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      authModal.style.display = "none";
      loginForm.reset();
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm").value;

  signupError.textContent = "";

  if (password !== confirmPassword) {
    signupError.textContent = "Passwords do not match";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      authModal.style.display = "none";
      signupForm.reset();
    })
    .catch((error) => {
      signupError.textContent = error.message;
    });
});

logoutButton.addEventListener("click", () => {
  if (!auth.currentUser) {
    authModal.style.display = "block";
    return;
  }

  auth.signOut()
    .then(() => {
      window.currentUser = null;
      authModal.style.display = "none";
      gameContainer.style.display = "block";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});

function saveUserData(user) {
  console.log("User session ready:", user.uid, user.email);
}
