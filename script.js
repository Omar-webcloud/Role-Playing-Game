// Game state
let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let monsterMaxHealth;
let inventory = ["stick"];
let currentUser = null;
let specialAttackReady = true;
let currentLocation = 0;

const XP_PER_LEVEL = 10;
const BASE_HEALTH = 100;
const HEALTH_PER_LEVEL = 15;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const saveButton = document.querySelector("#save-button");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const levelText = document.querySelector("#levelText");
const weaponText = document.querySelector("#weaponText");
const healthBar = document.querySelector("#healthBar");
const xpBar = document.querySelector("#xpBar");
const xpProgressText = document.querySelector("#xpProgressText");
const monsterName = document.querySelector("#monsterName");
const monsterStats = document.querySelector("#monsterStats");
const monsterHealthText = document.querySelector("#monsterHealth");
const monsterHealthBar = document.querySelector("#monsterHealthBar");
const monsterLevel = document.querySelector("#monsterLevel");
const locationName = document.querySelector("#locationName");
const combatLog = document.querySelector("#combat-log");
const gameContainer = document.querySelector("#game");

const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 }
];

const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 }
];

const locations = [
  {
    name: "town square",
    displayName: "Town Square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You stand in the bustling town square. Merchants call out from the store, and a dark cave mouth yawns in the distance. The dragon's shadow looms over everything."
  },
  {
    name: "store",
    displayName: "Store",
    "button text": ["Buy health (10g)", "Buy weapon (30g)", "Leave store"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "The storekeeper greets you warmly. Potions and weapons line the shelves."
  },
  {
    name: "cave",
    displayName: "Cave",
    "button text": ["Fight slime", "Fight beast", "Leave cave"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Damp air fills the cave. You hear creatures stirring in the darkness."
  },
  {
    name: "fight",
    displayName: "Combat",
    "button text": ["Attack", "Power Strike", "Run"],
    "button functions": [attack, specialAttack, goTown],
    text: "A monster blocks your path. Choose your action!"
  },
  {
    name: "kill monster",
    displayName: "Victory",
    "button text": ["Return to town", "Return to town", "Secret game?"],
    "button functions": [goTown, goTown, easterEgg],
    text: "The monster falls with a final cry. You gain experience and loot its body."
  },
  {
    name: "lose",
    displayName: "Defeat",
    "button text": ["Try again", "Try again", "Try again"],
    "button functions": [restart, restart, restart],
    text: "You collapse to the ground. The world fades to black. &#x2620;"
  },
  {
    name: "win",
    displayName: "Victory!",
    "button text": ["Play again", "Play again", "Play again"],
    "button functions": [restart, restart, restart],
    text: "The dragon crashes to the earth! The town is free at last. YOU WIN! &#x1F389;"
  },
  {
    name: "easter egg",
    displayName: "Secret Game",
    "button text": ["Pick 2", "Pick 8", "Leave"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You discover a hidden gambling den. Pick a number — ten random numbers (0–10) will be drawn. Match yours to win 20 gold!"
  }
];

// --- Level & stats helpers ---

function getLevel() {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function getMaxHealth() {
  return BASE_HEALTH + (getLevel() - 1) * HEALTH_PER_LEVEL;
}

function getXpProgress() {
  return xp % XP_PER_LEVEL;
}

function getDamageBonus() {
  return Math.floor(getLevel() / 2);
}

function refreshStats() {
  const maxHp = getMaxHealth();
  const level = getLevel();
  const xpProg = getXpProgress();

  levelText.innerText = level;
  xpText.innerText = xp;
  goldText.innerText = gold;
  healthText.innerText = `${health} / ${maxHp}`;
  weaponText.innerText = weapons[currentWeaponIndex].name;
  xpProgressText.innerText = `${xpProg} / ${XP_PER_LEVEL}`;

  healthBar.style.width = `${Math.max(0, (health / maxHp) * 100)}%`;
  xpBar.style.width = `${(xpProg / XP_PER_LEVEL) * 100}%`;
}

function addCombatLog(message, type = "") {
  combatLog.classList.add("active");
  const entry = document.createElement("div");
  entry.className = `combat-entry ${type}`;
  entry.textContent = message;
  combatLog.prepend(entry);

  while (combatLog.children.length > 8) {
    combatLog.removeChild(combatLog.lastChild);
  }
}

function clearCombatLog() {
  combatLog.innerHTML = "";
  combatLog.classList.remove("active");
}

function flashGame(className) {
  gameContainer.classList.remove("shake", "player-hit", "monster-hit");
  void gameContainer.offsetWidth;
  gameContainer.classList.add(className);
  setTimeout(() => gameContainer.classList.remove(className), 400);
}

function checkLevelUp(oldXp) {
  const prevLevel = Math.floor(oldXp / XP_PER_LEVEL) + 1;
  const newLevel = getLevel();
  if (newLevel > prevLevel) {
    const maxHp = getMaxHealth();
    health = maxHp;
    addCombatLog(`Level up! You are now level ${newLevel}. Max HP increased!`, "level-up");
    text.innerHTML += `<br><br><strong style="color:#ffcc00">LEVEL UP!</strong> You reached level ${newLevel}. Your max health is now ${maxHp}.`;
  }
}

// --- Auth & save/load ---

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loadGameData(user.uid);
  } else {
    currentUser = null;
  }
});

async function saveGameData() {
  if (!currentUser) return;

  try {
    const gameData = { xp, health, gold, inventory, currentWeaponIndex };
    const apiUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000/api/save-game"
      : "https://rpg-backend-puce.vercel.app/api/save-game";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: currentUser.uid, gameData })
    });

    return await response.json();
  } catch (error) {
    console.error("Error saving game:", error);
  }
}

async function loadGameData(uid) {
  try {
    const apiUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? `http://localhost:3000/api/game-data/${uid}`
      : `https://rpg-backend-puce.vercel.app/api/game-data/${uid}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.gameData) {
      xp = data.gameData.xp;
      health = data.gameData.health;
      gold = data.gameData.gold;
      inventory = data.gameData.inventory;
      currentWeaponIndex = data.gameData.currentWeaponIndex;
      updateLocation(locations[0]);
    }
  } catch (error) {
    console.error("Error loading game data:", error);
  }
}

setInterval(() => {
  if (currentUser) saveGameData();
}, 30000);

saveButton.addEventListener("click", () => {
  if (currentUser) {
    saveGameData();
    text.innerHTML = "Game saved successfully!";
    setTimeout(() => updateLocation(locations[currentLocation]), 1500);
  } else {
    text.innerHTML = "You must be logged in to save your game.";
  }
});

// --- Navigation ---

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function updateLocation(location) {
  currentLocation = locations.indexOf(location);
  monsterStats.style.display = "none";

  if (location.name !== "fight") {
    clearCombatLog();
    specialAttackReady = true;
  }

  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];

  button1.className = "action-btn";
  button2.className = location.name === "fight" && specialAttackReady ? "action-btn special" : "action-btn";
  button3.className = "action-btn";
  button2.disabled = location.name === "fight" && !specialAttackReady;

  locationName.textContent = location.displayName || location.name;
  text.innerHTML = location.text;
  text.classList.remove("fade-in");
  void text.offsetWidth;
  text.classList.add("fade-in");

  refreshStats();
}

function goTown() { updateLocation(locations[0]); }
function goStore() { updateLocation(locations[1]); }
function goCave() { updateLocation(locations[2]); }

// --- Store ---

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    const maxHp = getMaxHealth();
    health = Math.min(health + 20, maxHp);
    addCombatLog("Purchased a health potion (+20 HP).", "heal");
    text.innerHTML = "You drink a health potion and feel rejuvenated. <strong>+20 HP</strong>";
    refreshStats();
  } else {
    text.innerHTML = "You don't have enough gold. You need 10 gold.";
  }
}

function buyWeapon() {
  if (currentWeaponIndex < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeaponIndex++;
      const newWeapon = weapons[currentWeaponIndex].name;
      inventory.push(newWeapon);
      text.innerHTML = `You bought a <strong>${newWeapon}</strong>! Damage: ${weapons[currentWeaponIndex].power}`;
      refreshStats();
    } else {
      text.innerHTML = "You don't have enough gold. Weapons cost 30 gold.";
    }
  } else {
    text.innerHTML = "You already wield the finest weapon! You can sell extras for 15 gold.";
    button2.innerText = "Sell weapon (15g)";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    const sold = inventory.shift();
    text.innerHTML = `You sold a ${sold} for 15 gold.`;
    refreshStats();
  } else {
    text.innerHTML = "You can't sell your only weapon!";
  }
}

// --- Combat ---

function fightSlime() { fighting = 0; goFight(); }
function fightBeast() { fighting = 1; goFight(); }
function fightDragon() { fighting = 2; goFight(); }

function goFight() {
  updateLocation(locations[3]);
  monsterMaxHealth = monsters[fighting].health;
  monsterHealth = monsterMaxHealth;
  specialAttackReady = true;

  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterLevel.innerText = `Lv. ${monsters[fighting].level}`;
  updateMonsterHealthBar();

  addCombatLog(`A ${monsters[fighting].name} appears!`, "enemy");
}

function updateMonsterHealthBar() {
  const pct = Math.max(0, (monsterHealth / monsterMaxHealth) * 100);
  monsterHealthBar.style.width = `${pct}%`;
  monsterHealthText.innerText = `${Math.max(0, monsterHealth)} / ${monsterMaxHealth}`;
}

function attack() {
  performAttack(false);
}

function specialAttack() {
  if (!specialAttackReady) {
    text.innerHTML = "Power Strike is recharging! Use a regular attack.";
    return;
  }
  performAttack(true);
  specialAttackReady = false;
  button2.className = "action-btn";
  button2.disabled = true;
}

function performAttack(isSpecial) {
  const weapon = weapons[currentWeaponIndex];
  const monster = monsters[fighting];
  const logEntries = [];
  let isCritical = false;

  const monsterDmg = getMonsterAttackValue(monster.level);
  health -= monsterDmg;
  logEntries.push({ msg: `${monster.name} hits you for ${monsterDmg} damage.`, type: "enemy" });

  if (isMonsterHit()) {
    let dmg = weapon.power + getDamageBonus() + Math.floor(Math.random() * (getLevel() + 1));

    if (isSpecial) {
      dmg = Math.floor(dmg * 2.5);
      logEntries.push({ msg: `Power Strike! You slam the ${weapon.name} for ${dmg} damage!`, type: "critical" });
    } else if (Math.random() < 0.15 + getLevel() * 0.01) {
      dmg = Math.floor(dmg * 1.8);
      isCritical = true;
      logEntries.push({ msg: `Critical hit! ${dmg} damage with your ${weapon.name}!`, type: "critical" });
    } else {
      logEntries.push({ msg: `You hit for ${dmg} damage.`, type: "player" });
    }

    monsterHealth -= dmg;
    flashGame("monster-hit");
  } else {
    logEntries.push({ msg: "Your attack missed!", type: "player" });
  }

  logEntries.forEach(({ msg, type }) => addCombatLog(msg, type));

  refreshStats();
  updateMonsterHealthBar();

  if (health <= 0) {
    flashGame("player-hit");
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  } else if (Math.random() <= 0.1 && inventory.length > 1) {
    const broken = inventory.pop();
    currentWeaponIndex = Math.max(0, currentWeaponIndex - 1);
    addCombatLog(`Your ${broken} broke!`, "enemy");
    text.innerHTML += `<br>Your <strong>${broken}</strong> shatters mid-fight!`;
    refreshStats();
  } else {
    const action = isSpecial ? "Power Strike" : isCritical ? "critical hit" : "attack";
    text.innerHTML = `The ${monster.name} strikes back for <strong>${monsterDmg}</strong> damage. Your ${action} ${monsterHealth > 0 ? `leaves it at ${Math.max(0, monsterHealth)} HP` : "finishes it!"}.`;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * (xp + getLevel() * 2));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function defeatMonster() {
  const reward = Math.floor(monsters[fighting].level * 6.7);
  const xpGain = monsters[fighting].level;
  const oldXp = xp;
  gold += reward;
  xp += xpGain;
  addCombatLog(`Victory! +${xpGain} XP, +${reward} gold.`, "level-up");
  checkLevelUp(oldXp);
  refreshStats();
  updateLocation(locations[4]);
}

function lose() {
  updateLocation(locations[5]);
}

function winGame() {
  updateLocation(locations[6]);
}

function restart() {
  xp = 0;
  health = BASE_HEALTH;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  specialAttackReady = true;
  clearCombatLog();
  refreshStats();
  goTown();
}

// --- Easter egg ---

function easterEgg() {
  updateLocation(locations[7]);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  text.innerHTML = `You picked <strong>${guess}</strong>. The numbers drawn: ${numbers.join(", ")}.`;

  if (numbers.includes(guess)) {
    text.innerHTML += "<br><br>You win <strong>20 gold</strong>!";
    gold += 20;
  } else {
    text.innerHTML += "<br><br>Wrong! You lose <strong>10 HP</strong>.";
    health -= 10;
    if (health <= 0) lose();
  }
  refreshStats();
}

function pickTwo() { pick(2); }
function pickEight() { pick(8); }

// Initial render
refreshStats();
