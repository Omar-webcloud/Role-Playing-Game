// =====================================
// PIXEL RPG ENGINE V2
// PART 1
// =====================================

// ---------- DOM ----------

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const saveButton = document.querySelector("#save-button");

const text = document.querySelector("#text");

const xpText = document.querySelector("#xpText");
const goldText = document.querySelector("#goldText");
const levelText = document.querySelector("#levelText");

const healthText = document.querySelector("#healthText");
const xpProgressText = document.querySelector("#xpProgressText");

const healthBar = document.querySelector("#healthBar");
const xpBar = document.querySelector("#xpBar");

const defenseText = document.querySelector("#defenseText");

const weaponText = document.querySelector("#weaponText");
const armorText = document.querySelector("#armorText");

const inventoryList = document.querySelector("#inventoryList");
const equipmentList = document.querySelector("#equipmentList");
const questList = document.querySelector("#questList");

const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterLevel = document.querySelector("#monsterLevel");
const monsterHealth = document.querySelector("#monsterHealth");
const monsterHealthBar = document.querySelector("#monsterHealthBar");

const locationName = document.querySelector("#locationName");

const combatLog = document.querySelector("#combat-log");

const canvas = document.querySelector("#sceneCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const actionIcons = {

    "Store":"🏪",
    "Forest":"🌲",
    "Dungeon":"🕳️",
    "Buy Potion (10g)":"🧪",
    "Blacksmith":"⚒️",
    "Town":"🏘️",
    "Fight Wolf":"🐺",
    "Fight Goblin":"👺",
    "Fight Skeleton":"☠️",
    "Fight Troll":"🪨",
    "Heal":"✚",
    "Accept Quest":"📜",
    "Rest (15g)":"🛏️",
    "Temple":"⛪",
    "Upgrade Weapon":"⚔️",
    "Buy Armor":"🛡️",
    "Attack":"⚔️",
    "Block":"🛡️",
    "Dodge":"↩️",
    "Shadow Lord":"👤",
    "Ancient Dragon":"🐉"

};

function withIcon(label){

    const icon =
        actionIcons[label];

    return icon
        ? `${icon} ${label}`
        : label;

}

function setActionButtons(first, second, third){

    button1.textContent =
        withIcon(first);

    button2.textContent =
        withIcon(second);

    button3.textContent =
        withIcon(third);

}

// =====================================
// GAME DATA
// =====================================

const GAME_VERSION = "2.0";

const XP_PER_LEVEL = 20;

const PLAYER = {
    level: 1,
    xp: 0,
    hp: 100,
    maxHp: 100,
    gold: 50,
    defense: 0,
    skillPoints: 0
};

// =====================================
// WEAPONS
// =====================================

const weapons = [

{
    id:"stick",
    name:"Stick",
    power:5,
    price:0,
    rarity:"Common",
    type:"Melee"
},

{
    id:"dagger",
    name:"Dagger",
    power:15,
    price:30,
    rarity:"Common",
    type:"Melee"
},

{
    id:"bow",
    name:"Hunter Bow",
    power:28,
    price:60,
    rarity:"Rare",
    type:"Ranged"
},

{
    id:"staff",
    name:"Mage Staff",
    power:35,
    price:90,
    rarity:"Rare",
    type:"Magic"
},

{
    id:"axe",
    name:"Battle Axe",
    power:55,
    price:140,
    rarity:"Epic",
    type:"Melee"
},

{
    id:"sword",
    name:"Knight Sword",
    power:85,
    price:250,
    rarity:"Legendary",
    type:"Melee"
}

];

// =====================================
// ARMOR
// =====================================

const armors = [

{
    id:"cloth",
    name:"Cloth Armor",
    defense:0,
    price:0
},

{
    id:"leather",
    name:"Leather Armor",
    defense:5,
    price:50
},

{
    id:"chain",
    name:"Chainmail",
    defense:10,
    price:100
},

{
    id:"steel",
    name:"Steel Armor",
    defense:20,
    price:250
}

];

// =====================================
// MONSTERS
// =====================================

const monsters = [

{
    id:"slime",
    name:"Slime",
    level:2,
    hp:20,
    gold:10,
    xp:5
},

{
    id:"wolf",
    name:"Wolf",
    level:4,
    hp:40,
    gold:20,
    xp:10
},

{
    id:"goblin",
    name:"Goblin",
    level:6,
    hp:60,
    gold:35,
    xp:15
},

{
    id:"skeleton",
    name:"Skeleton",
    level:10,
    hp:100,
    gold:60,
    xp:25
},

{
    id:"troll",
    name:"Troll",
    level:15,
    hp:180,
    gold:120,
    xp:50
},

{
    id:"dragon",
    name:"Dragon",
    level:25,
    hp:500,
    gold:500,
    xp:200
}

];

// =====================================
// PLAYER INVENTORY
// =====================================

const inventory = {

    weapons:["stick"],

    armor:["cloth"],

    consumables:[
        {
            name:"Health Potion",
            amount:2
        }
    ]

};

// =====================================
// EQUIPPED ITEMS
// =====================================

const equipment = {

    weapon:"stick",

    armor:"cloth"

};

// =====================================
// QUEST SYSTEM
// =====================================

const questDatabase = [

{
    id:1,
    title:"Wolf Hunter",
    description:"Defeat 3 wolves",
    target:"wolf",
    required:3,
    rewardGold:100,
    rewardXp:30
},

{
    id:2,
    title:"Goblin Menace",
    description:"Defeat 5 goblins",
    target:"goblin",
    required:5,
    rewardGold:150,
    rewardXp:50
},

{
    id:3,
    title:"Skeleton Purge",
    description:"Defeat 4 skeletons",
    target:"skeleton",
    required:4,
    rewardGold:250,
    rewardXp:100
}

];

let activeQuests = [];

// =====================================
// COMBAT STATE
// =====================================

let currentMonster = null;
let monsterCurrentHp = 0;

let specialReady = true;

let currentLocation = "town";

// =====================================
// LOCATION DATA
// =====================================

const locations = {

town:{
    name:"Town Square",
    buttons:[
        "Store",
        "Forest",
        "Dungeon"
    ]
},

store:{
    name:"General Store",
    buttons:[
        "Buy Potion",
        "Blacksmith",
        "Town"
    ]
},

forest:{
    name:"Forest",
    buttons:[
        "Fight Wolf",
        "Fight Goblin",
        "Town"
    ]
},

dungeon:{
    name:"Dungeon",
    buttons:[
        "Fight Skeleton",
        "Fight Troll",
        "Town"
    ]
},

inn:{
    name:"Traveler Inn",
    buttons:[
        "Rest",
        "Temple",
        "Town"
    ]
},

blacksmith:{
    name:"Blacksmith",
    buttons:[
        "Upgrade",
        "Buy Armor",
        "Town"
    ]
}

};

// =====================================
// COMBAT LOG
// =====================================

function addLog(message){

    const div = document.createElement("div");

    div.className = "combat-entry";

    div.textContent = message;

    combatLog.prepend(div);

    while(combatLog.children.length > 25){

        combatLog.removeChild(
            combatLog.lastChild
        );

    }

}

// =====================================
// LEVEL SYSTEM
// =====================================

function getLevel(){

    return PLAYER.level;

}

function gainXp(amount){

    PLAYER.xp += amount;

    while(
        PLAYER.xp >= PLAYER.level * XP_PER_LEVEL
    ){

        PLAYER.xp -= PLAYER.level * XP_PER_LEVEL;

        PLAYER.level++;

        PLAYER.maxHp += 20;

        PLAYER.hp = PLAYER.maxHp;

        PLAYER.skillPoints++;

        addLog(
            `Level Up! Level ${PLAYER.level}`
        );

    }

}

// =====================================
// EQUIPMENT HELPERS
// =====================================

function getWeapon(){

    return weapons.find(
        w => w.id === equipment.weapon
    );

}

function getArmor(){

    return armors.find(
        a => a.id === equipment.armor
    );

}

function updateDefense(){

    PLAYER.defense =
        getArmor().defense;

}

// =====================================
// UI RENDERING
// =====================================

function renderStats(){

    updateDefense();

    levelText.textContent =
        PLAYER.level;

    xpText.textContent =
        PLAYER.xp;

    goldText.textContent =
        PLAYER.gold;

    defenseText.textContent =
        PLAYER.defense;

    weaponText.textContent =
        getWeapon().name;

    armorText.textContent =
        getArmor().name;

    healthText.textContent =
        `${PLAYER.hp}/${PLAYER.maxHp}`;

    const xpNeeded =
        PLAYER.level * XP_PER_LEVEL;

    xpProgressText.textContent =
        `${PLAYER.xp}/${xpNeeded}`;

    healthBar.style.width =
        `${(PLAYER.hp / PLAYER.maxHp)*100}%`;

    xpBar.style.width =
        `${(PLAYER.xp / xpNeeded)*100}%`;

}

// =====================================
// INVENTORY RENDER
// =====================================

function renderInventory(){

    inventoryList.innerHTML = "";

    inventory.weapons.forEach(id=>{

        const item =
            weapons.find(
                w=>w.id===id
            );

        const div =
            document.createElement("div");

        div.className =
            "inventory-item";

        div.textContent =
            item.name;

        inventoryList.appendChild(div);

    });

    inventory.armor.forEach(id => {

        const item = armors.find(a => a.id === id);

        if (!item) return;

        const div = document.createElement("div");

        div.className = "inventory-item";

        div.textContent = `${item.name} (${item.defense} DEF)`;

        inventoryList.appendChild(div);

    });

    inventory.consumables.forEach(consumable => {

        const div = document.createElement("div");

        div.className = "inventory-item";

        div.innerHTML = `
        <strong>${consumable.name}</strong>
        <small>x${consumable.amount}</small>
        `;

        inventoryList.appendChild(div);

    });

}

// =====================================
// EQUIPMENT PANEL
// =====================================

function renderEquipment(){

    equipmentList.innerHTML = "";

    const weaponDiv =
        document.createElement("div");

    weaponDiv.className =
        "equipment-item";

    weaponDiv.textContent =
        `Weapon: ${getWeapon().name}`;

    equipmentList.appendChild(
        weaponDiv
    );

    const armorDiv =
        document.createElement("div");

    armorDiv.className =
        "equipment-item";

    armorDiv.textContent =
        `Armor: ${getArmor().name}`;

    equipmentList.appendChild(
        armorDiv
    );

}

// =====================================
// QUEST RENDER
// =====================================

function renderQuests(){

    questList.innerHTML = "";

    activeQuests.forEach(quest=>{

        const div =
            document.createElement("div");

        div.className =
            "quest-item";

        div.innerHTML = `
        <strong>${quest.title}</strong>
        <br>
        ${quest.progress}/${quest.required}
        <small>${quest.description}</small>
        `;

        questList.appendChild(div);

    });

}

// =====================================
// SAVE STRUCTURE
// =====================================

function buildSaveData(){

    return {

        version:GAME_VERSION,

        player:PLAYER,

        inventory,

        equipment,

        activeQuests

    };

}

// =====================================
// CANVAS FOUNDATION
// =====================================

function clearCanvas(){

    ctx.fillStyle = "#111";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}

function pixel(x,y,size,color){

    ctx.fillStyle = color;

    ctx.fillRect(
        x,
        y,
        size,
        size
    );

}

function fillBands(bands){

    bands.forEach(
        band => {

            rect(
                0,
                band.y,
                canvas.width,
                band.h,
                band.color
            );

        }
    );

}

function drawCloud(x, y, scale = 1){

    const s = 8 * scale;
    const p = (dx, dy, w, h, color = "#f5fbff") => rect(x + dx * s, y + dy * s, w * s, h * s, color);

    p(0, 1, 2, 1);
    p(1, 0, 2, 2);
    p(2, 0, 2, 3);
    p(3, 1, 3, 2);
    p(5, 1, 2, 1);
    p(6, 0, 2, 2);
    p(7, 1, 2, 1);

}

function drawStar(x, y, color = "#fff5cf"){

    rect(x, y, 4, 4, color);
    rect(x + 4, y + 4, 4, 4, color);
    rect(x + 4, y, 4, 4, color);
    rect(x, y + 4, 4, 4, color);

}

function drawPath(x, y, w, h, color = "#caa46a"){

    rect(x, y, w, h, color);
    rect(x + 6, y + 2, w - 12, h - 4, "#b78f54");
    rect(x + 12, y + 4, w - 24, h - 8, "#9f7742");

}

function drawHouse(x, y, scale = 1, wall = "#9d6438", roof = "#ba5143", trim = "#f0d2a2"){

    const s = 8 * scale;
    const p = (dx, dy, w, h, color) => rect(x + dx * s, y + dy * s, w * s, h * s, color);

    p(2, 3, 10, 7, wall);
    p(1, 2, 12, 2, roof);
    p(2, 1, 10, 1, roof);
    p(3, 0, 8, 1, roof);
    p(5, 5, 2, 5, trim);
    p(4, 5, 1, 1, "#d2b27d");
    p(7, 5, 1, 1, "#d2b27d");
    p(2, 3, 1, 7, "#6b4325");
    p(11, 3, 1, 7, "#6b4325");
    p(5, 7, 2, 3, "#41261a");
    p(5, 4, 2, 1, "#f8de8a");

}

function drawFence(x, y, count = 6){

    for(
        let i = 0;
        i < count;
        i++
    ){

        rect(x + i * 18, y, 6, 22, "#a57a46");
        rect(x + i * 18 - 2, y + 8, 10, 3, "#c69c62");

    }

}

function drawTree(x, y, scale = 1, trunk = "#5c3a1c", leaf = "#2f9a52"){

    const s = 8 * scale;
    const p = (dx, dy, w, h, color) => rect(x + dx * s, y + dy * s, w * s, h * s, color);

    p(2, 5, 1, 4, trunk);
    p(3, 5, 1, 4, trunk);
    p(1, 2, 5, 3, leaf);
    p(0, 3, 7, 2, leaf);
    p(1, 1, 5, 2, leaf);
    p(2, 0, 3, 1, leaf);

}

function drawTorch(x, y){

    rect(x, y, 4, 18, "#6b4325");
    rect(x - 2, y - 8, 8, 8, "#ffcf66");
    rect(x - 1, y - 12, 6, 6, "#fff3a2");

}

function drawSky(){

    fillBands([
        { y: 0, h: 48, color: "#6d9cff" },
        { y: 48, h: 56, color: "#5f88ef" },
        { y: 104, h: 56, color: "#436cc6" }
    ]);

    for(
        let i = 0;
        i < 7;
        i++
    ){

        drawCloud(
            40 + i * 82,
            18 + (i % 2) * 10,
            i % 3 === 0 ? 1.1 : 1
        );

    }

}

function drawGround(){

    fillBands([
        { y: 160, h: 56, color: "#315d2d" },
        { y: 216, h: 56, color: "#274824" },
        { y: 272, h: 48, color: "#1f341d" }
    ]);

    for(
        let x = 0;
        x < canvas.width;
        x += 16
    ){

        rect(
            x,
            156 + (x % 32 === 0 ? 2 : 0),
            8,
            4,
            "#78a45a"
        );

        rect(
            x + 6,
            244 + (x % 48 === 0 ? 1 : 0),
            10,
            3,
            "#3c6b33"
        );

    }

}

// =====================================
// INITIALIZE
// =====================================

function initializeGame(){

    renderStats();

    renderInventory();

    renderEquipment();

    renderQuests();

    clearCanvas();

    drawSky();

    drawGround();

    text.innerHTML =
    "Welcome to Pixel RPG. Your adventure begins in Town Square.";

}

initializeGame();

// =====================================
// PART 2
// COMBAT + LOCATIONS
// =====================================

// ---------- LOCATION ROUTING ----------

function goTown() {

  currentLocation = "town";

  locationName.textContent =
      "Town Square";

  text.innerHTML =
      "The center of civilization. Adventurers gather here.";

  setActionButtons("Store", "Forest", "Dungeon");

  button1.onclick = goStore;
  button2.onclick = goForest;
  button3.onclick = goDungeon;

  drawTownScene();
}

function goStore() {

  currentLocation = "store";

  locationName.textContent =
      "General Store";

  text.innerHTML =
      "Potions and supplies line the shelves.";

  setActionButtons(
      "Buy Potion (10g)",
      "Blacksmith",
      "Town"
  );

  button1.onclick = buyPotion;
  button2.onclick = goBlacksmith;
  button3.onclick = goTown;

  drawStoreScene();
}

function goForest() {

  currentLocation = "forest";

  locationName.textContent =
      "Forest";

  text.innerHTML =
      "Ancient trees surround you.";

  setActionButtons(
      "Fight Wolf",
      "Fight Goblin",
      "Town"
  );

  button1.onclick =
      () => startFight("wolf");

  button2.onclick =
      () => startFight("goblin");

  button3.onclick =
      goTown;

  drawForestScene();
}

function goDungeon() {

  currentLocation = "dungeon";

  locationName.textContent =
      "Dungeon";

  text.innerHTML =
      "Dark stone corridors stretch ahead.";

  setActionButtons(
      "Fight Skeleton",
      "Fight Troll",
      "Town"
  );

  button1.onclick =
      () => startFight("skeleton");

  button2.onclick =
      () => startFight("troll");

  button3.onclick =
      goTown;

  drawDungeonScene();
}

function goTemple() {

  currentLocation = "temple";

  locationName.textContent =
      "Temple";

  text.innerHTML =
      "Holy light fills the room.";

  setActionButtons(
      "Heal",
      "Accept Quest",
      "Town"
  );

  button1.onclick =
      healAtTemple;

  button2.onclick =
      acceptQuest;

  button3.onclick =
      goTown;

  drawTempleScene();
}

function goInn() {

  currentLocation = "inn";

  locationName.textContent =
      "Inn";

  text.innerHTML =
      "Travelers rest here.";

  setActionButtons(
      "Rest (15g)",
      "Temple",
      "Town"
  );

  button1.onclick =
      restAtInn;

  button2.onclick =
      goTemple;

  button3.onclick =
      goTown;

  drawInnScene();
}

function goBlacksmith() {

  currentLocation =
      "blacksmith";

  locationName.textContent =
      "Blacksmith";

  text.innerHTML =
      "The forge burns brightly.";

  setActionButtons(
      "Upgrade Weapon",
      "Buy Armor",
      "Town"
  );

  button1.onclick =
      upgradeWeapon;

  button2.onclick =
      buyArmor;

  button3.onclick =
      goTown;

  drawBlacksmithScene();
}

// =====================================
// STORE
// =====================================

function buyPotion() {

  if(PLAYER.gold < 10){

      text.innerHTML =
          "Not enough gold.";

      return;
  }

  PLAYER.gold -= 10;

  let potion =
      inventory.consumables.find(
          c => c.name ===
          "Health Potion"
      );

  if(potion){

      potion.amount++;

  }else{

      inventory.consumables.push({

          name:"Health Potion",
          amount:1

      });

  }

  renderStats();

  text.innerHTML =
      "Potion purchased.";
}

// =====================================
// BLACKSMITH
// =====================================

function upgradeWeapon() {

  const cost = 50;

  if(PLAYER.gold < cost){

      text.innerHTML =
          "Need more gold.";

      return;
  }

  PLAYER.gold -= cost;

  const weapon =
      getWeapon();

  weapon.power += 10;

  renderStats();

  text.innerHTML =
      `${weapon.name}
      upgraded to
      ${weapon.power} power`;
}

function buyArmor() {

  const nextArmor =
      armors.find(
          a => a.defense >
          getArmor().defense
      );

  if(!nextArmor){

      text.innerHTML =
          "Best armor owned.";

      return;
  }

  if(PLAYER.gold <
     nextArmor.price){

      text.innerHTML =
          "Not enough gold.";

      return;
  }

  PLAYER.gold -=
      nextArmor.price;

  equipment.armor =
      nextArmor.id;

  renderStats();

  text.innerHTML =
      `Equipped ${nextArmor.name}`;
}

// =====================================
// TEMPLE
// =====================================

function healAtTemple(){

  PLAYER.hp =
      PLAYER.maxHp;

  renderStats();

  text.innerHTML =
      "You feel restored.";
}

// =====================================
// INN
// =====================================

function restAtInn(){

  if(PLAYER.gold < 15){

      text.innerHTML =
          "Need 15 gold.";

      return;
  }

  PLAYER.gold -= 15;

  PLAYER.hp =
      PLAYER.maxHp;

  renderStats();

  text.innerHTML =
      "You rested peacefully.";
}

// =====================================
// QUESTS
// =====================================

function acceptQuest(){

  const available =
      questDatabase.find(
          q =>
          !activeQuests.some(
              a=>a.id===q.id
          )
      );

  if(!available){

      text.innerHTML =
          "No quests available.";

      return;
  }

  activeQuests.push({

      ...available,

      progress:0

  });

  renderQuests();

  text.innerHTML =
      `Quest Accepted:
      ${available.title}`;
}

function updateQuestProgress(
  monsterId
){

  activeQuests.forEach(
      quest=>{

      if(
          quest.target ===
          monsterId
      ){

          quest.progress++;

          if(
              quest.progress >=
              quest.required
          ){

              completeQuest(
                  quest
              );

          }

      }

  });

  renderQuests();
}

function completeQuest(
  quest
){

  PLAYER.gold +=
      quest.rewardGold;

  gainXp(
      quest.rewardXp
  );

  activeQuests =
      activeQuests.filter(
          q => q.id !==
          quest.id
      );

  addLog(
      `Quest Complete:
       ${quest.title}`
  );

  renderStats();
}

// =====================================
// COMBAT
// =====================================

function startFight(id){

  const monster =
      monsters.find(
          m=>m.id===id
      );

  currentMonster =
      monster;

  monsterCurrentHp =
      monster.hp;

  monsterStats.style.display =
      "block";

  monsterName.textContent =
      monster.name;

  monsterLevel.textContent =
      `Lv ${monster.level}`;

  updateMonsterBar();

  setActionButtons(
      "Attack",
      "Block",
      "Dodge"
  );

  button1.onclick =
      attack;

  button2.onclick =
      blockAttack;

  button3.onclick =
      dodgeAttack;

  text.innerHTML =
      `${monster.name}
      appears!`;

  drawMonster(
      monster.id
  );
}

function updateMonsterBar(){

  monsterHealth.textContent =
      `${monsterCurrentHp}
      /${currentMonster.hp}`;

  monsterHealthBar.style.width =
      `${
          (
          monsterCurrentHp /
          currentMonster.hp
          )*100
      }%`;
}

// =====================================
// ATTACK
// =====================================

function attack(){

  const weapon =
      getWeapon();

  let damage =
      weapon.power +
      Math.floor(
          Math.random()*10
      );

  if(
      Math.random() < .15
  ){

      damage *= 2;

      addLog(
          "Critical Hit!"
      );

  }

  monsterCurrentHp -=
      damage;

  addLog(
      `You hit for
      ${damage}`
  );

  updateMonsterBar();

  if(
      monsterCurrentHp <= 0
  ){

      defeatMonster();

      return;
  }

  monsterAttack();
}

// =====================================
// BLOCK
// =====================================

function blockAttack(){

  const dmg =
      Math.max(
          0,
          getMonsterDamage()
          - PLAYER.defense
          - 10
      );

  PLAYER.hp -= dmg;

  addLog(
      `Blocked.
       Took ${dmg}`
  );

  renderStats();

  checkDefeat();
}

// =====================================
// DODGE
// =====================================

function dodgeAttack(){

  if(
      Math.random() < .5
  ){

      addLog(
          "Dodged!"
      );

      return;
  }

  const dmg =
      getMonsterDamage();

  PLAYER.hp -= dmg;

  addLog(
      `Failed dodge.
      ${dmg} damage`
  );

  renderStats();

  checkDefeat();
}

// =====================================
// MONSTER ATTACK
// =====================================

function monsterAttack(){

  const dmg =
      Math.max(
          0,
          getMonsterDamage()
          -
          PLAYER.defense
      );

  PLAYER.hp -= dmg;

  addLog(
      `${currentMonster.name}
      hit for ${dmg}`
  );

  renderStats();

  checkDefeat();
}

function getMonsterDamage(){

  return (
      currentMonster.level * 2
  ) +
  Math.floor(
      Math.random()*10
  );
}

// =====================================
// WIN
// =====================================

function defeatMonster(){

  PLAYER.gold +=
      currentMonster.gold;

  gainXp(
      currentMonster.xp
  );

  updateQuestProgress(
      currentMonster.id
  );

  renderStats();

  addLog(
      `${currentMonster.name}
      defeated`
  );

  text.innerHTML =
      `Victory!
       +${currentMonster.gold}g
       +${currentMonster.xp}xp`;

  monsterStats.style.display =
      "none";

  if(
      currentMonster.id ===
      "dragon"
  ){

      text.innerHTML =
          "YOU SAVED THE KINGDOM!";
  }

  goTown();
}

// =====================================
// DEFEAT
// =====================================

function checkDefeat(){

  if(
      PLAYER.hp > 0
  ) return;

  PLAYER.hp = 1;

  text.innerHTML =
      "You were defeated.";

  addLog(
      "Defeat"
  );

  goTown();
}

// =====================================
// DRAGON BOSS
// =====================================

function fightDragon(){

  startFight(
      "dragon"
  );
}

// =====================================
// PART 3
// PIXEL RENDERER
// SAVE SYSTEM
// INVENTORY ACTIONS
// =====================================

// ---------- ANIMATION ----------

let animationFrame = 0;

function gameLoop() {

    animationFrame++;

    if (
        currentMonster
    ) {

        drawMonster(
            currentMonster.id
        );

    }

    requestAnimationFrame(
        gameLoop
    );

}

requestAnimationFrame(
    gameLoop
);

// =====================================
// PIXEL HELPERS
// =====================================

function rect(
    x,
    y,
    w,
    h,
    color
){

    ctx.fillStyle =
        color;

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

}

// =====================================
// TOWN
// =====================================

function drawTownScene(){

    clearCanvas();

    drawSky();

    drawGround();

    drawPath(238, 160, 164, 92);
    drawHouse(172, 76, 1.1);
    drawHouse(330, 84, 0.9, "#ad7241", "#d86c4e", "#f7dfb1");
    drawFence(96, 216, 4);
    drawFence(456, 216, 4);
    drawTree(38, 164, 1);
    drawTree(558, 164, 1);
    drawTorch(150, 210);
    drawTorch(490, 210);

}

// =====================================
// STORE
// =====================================

function drawStoreScene(){

    clearCanvas();

    fillBands([
        { y: 0, h: 160, color: "#6c4b30" },
        { y: 160, h: 160, color: "#3c2619" }
    ]);

    drawHouse(144, 64, 1.45, "#855335", "#c46e3b", "#efd7ab");
    drawFence(68, 222, 8);
    drawFence(468, 222, 8);
    drawTorch(118, 200);
    drawTorch(514, 200);
    rect(266, 132, 108, 36, "#f0cf7c");
    rect(274, 138, 92, 24, "#7e532e");

}

// =====================================
// FOREST
// =====================================

function drawForestScene(){

    clearCanvas();

    drawSky();

    drawGround();

    rect(220, 166, 200, 24, "#7a5a30");
    rect(232, 160, 176, 12, "#9a7b4a");
    drawTree(24, 140, 1.1);
    drawTree(110, 130, 0.9, "#4f3115", "#1f7d41");
    drawTree(188, 146, 1.2, "#5b371b", "#2f8f4d");
    drawTree(470, 136, 1.1, "#57361a", "#238046");
    drawTree(548, 144, 0.95, "#5c3a1c", "#2d9650");
    drawTree(346, 120, 1.35, "#4f3115", "#2b7f45");
    drawCloud(450, 24, 0.9);
    drawCloud(92, 36, 0.8);

}

// =====================================
// DUNGEON
// =====================================

function drawDungeonScene(){

    clearCanvas();

    fillBands([
        { y: 0, h: 88, color: "#171724" },
        { y: 88, h: 96, color: "#232334" },
        { y: 184, h: 136, color: "#11131d" }
    ]);

    for(
        let x = 0;
        x < 640;
        x += 40
    ){

        rect(x, 92, 34, 132, "#3c404e");
        rect(x + 4, 100, 26, 116, "#2a2d39");
        rect(x + 8, 110, 18, 8, "#666b7d");

    }

    rect(116, 58, 408, 22, "#44495b");
    rect(124, 66, 392, 10, "#2f3442");
    rect(160, 204, 320, 10, "#4a4f60");
    drawTorch(82, 204);
    drawTorch(550, 204);

}

// =====================================
// TEMPLE
// =====================================

function drawTempleScene(){

    clearCanvas();

    fillBands([
        { y: 0, h: 148, color: "#dce4ef" },
        { y: 148, h: 172, color: "#bfcad8" }
    ]);

    rect(236, 64, 168, 168, "#e7edf5");
    rect(252, 80, 136, 136, "#cdd8e4");
    rect(272, 48, 96, 26, "#f7f0c2");
    rect(296, 82, 48, 104, "#7b8aa0");
    rect(284, 70, 72, 8, "#f8f0c7");
    drawTorch(184, 196);
    drawTorch(454, 196);
    drawCloud(92, 30, 0.7);
    drawCloud(506, 34, 0.7);

}

// =====================================
// INN
// =====================================

function drawInnScene(){

    clearCanvas();

    fillBands([
        { y: 0, h: 138, color: "#a66a42" },
        { y: 138, h: 182, color: "#6f452c" }
    ]);

    drawHouse(166, 76, 1.15, "#7b4d31", "#8d442f", "#efd7a9");
    rect(224, 148, 192, 28, "#5d3821");
    rect(236, 156, 168, 12, "#3d2415");
    drawFence(102, 218, 6);
    drawFence(452, 218, 6);
    drawTorch(208, 192);
    drawTorch(428, 192);

}

// =====================================
// BLACKSMITH
// =====================================

function drawBlacksmithScene(){

    clearCanvas();

    fillBands([
        { y: 0, h: 160, color: "#2a2322" },
        { y: 160, h: 160, color: "#140f10" }
    ]);

    rect(196, 126, 248, 86, "#42312c");
    rect(212, 108, 216, 18, "#5a3c2e");
    rect(228, 96, 184, 16, "#7d4b2f");
    rect(322, 116, 36, 52, "#ffd36d");
    rect(306, 124, 68, 36, "#ff7a28");
    rect(314, 132, 52, 20, "#ffb14d");
    drawTorch(146, 198);
    drawTorch(510, 198);

}

// =====================================
// MONSTER SPRITES
// =====================================

function drawMonster(id){

    switch(id){

        case "wolf":
            drawWolf();
            break;

        case "goblin":
            drawGoblin();
            break;

        case "skeleton":
            drawSkeleton();
            break;

        case "troll":
            drawTroll();
            break;

        case "dragon":
            drawDragon();
            break;

        case "slime":
            drawSlime();
            break;

    }

}

function monsterBob(speed, amount){

    return Math.sin(animationFrame * speed) * amount;

}

function drawEyes(x, y, color = "#fff"){

    rect(x, y, 6, 6, color);
    rect(x + 16, y, 6, 6, color);

}

function drawSlime(){

    clearCanvas();

    drawGround();

    const bounce =
        monsterBob(.08, 6);

    rect(220, 192 + bounce, 200, 68, "#0d5c31");
    rect(228, 184 + bounce, 184, 56, "#1f9e52");
    rect(238, 176 + bounce, 164, 44, "#35d16c");
    rect(254, 204 + bounce, 132, 28, "#1a7d40");
    drawEyes(278, 194 + bounce);
    rect(316, 210 + bounce, 12, 8, "#8cf4ab");
    rect(300, 220 + bounce, 44, 8, "#0c4023");

}

function drawWolf(){

    clearCanvas();

    drawGround();

    const walk =
        monsterBob(.1, 5);

    rect(196 + walk, 162, 180, 74, "#2a2e34");
    rect(208 + walk, 154, 160, 54, "#747a83");
    rect(232 + walk, 144, 44, 34, "#8c9299");
    rect(262 + walk, 130, 28, 24, "#8c9299");
    rect(278 + walk, 140, 8, 8, "#111");
    rect(286 + walk, 164, 14, 14, "#f7f7f7");
    rect(216 + walk, 212, 22, 28, "#2a2e34");
    rect(250 + walk, 212, 22, 28, "#2a2e34");
    rect(316 + walk, 212, 22, 28, "#2a2e34");
    rect(350 + walk, 212, 18, 28, "#2a2e34");
    rect(354 + walk, 176, 34, 10, "#747a83");

}

function drawGoblin(){

    clearCanvas();

    drawGround();

    const bounce =
        monsterBob(.08, 8);

    rect(248, 136 + bounce, 144, 136, "#125d34");
    rect(260, 124 + bounce, 120, 96, "#26a953");
    rect(276, 108 + bounce, 88, 56, "#2fcf67");
    rect(286, 102 + bounce, 24, 16, "#111");
    rect(330, 102 + bounce, 24, 16, "#111");
    rect(296, 126 + bounce, 16, 10, "#fff0b2");
    rect(294, 162 + bounce, 24, 14, "#8d3d2c");
    rect(270, 220 + bounce, 22, 26, "#125d34");
    rect(318, 220 + bounce, 22, 26, "#125d34");
    rect(234, 146 + bounce, 22, 56, "#26a953");
    rect(360, 146 + bounce, 22, 56, "#26a953");

}

function drawSkeleton(){

    clearCanvas();

    drawGround();

    const sway =
        monsterBob(.05, 3);

    rect(256, 114, 128, 150, "#4b4d53");
    rect(268, 102, 104, 134, "#f3f1ea");
    rect(280, 116, 80, 18, "#1b1b1b");
    rect(292, 128, 12, 12, "#1b1b1b");
    rect(332, 128, 12, 12, "#1b1b1b");
    rect(304, 146, 16, 20, "#b9b2a5");
    rect(280, 168, 64, 12, "#dcd6ca");
    rect(262, 150, 20, 82, "#f3f1ea");
    rect(354, 150, 20, 82, "#f3f1ea");
    rect(290, 248 + sway, 22, 28, "#f3f1ea");
    rect(328, 248 - sway, 22, 28, "#f3f1ea");

}

function drawTroll(){

    clearCanvas();

    drawGround();

    const sway =
        monsterBob(.06, 4);

    rect(184, 122 + sway, 260, 154, "#14431f");
    rect(206, 104 + sway, 216, 118, "#2a8d43");
    rect(228, 88 + sway, 172, 72, "#47b85e");
    rect(248, 106 + sway, 24, 18, "#1b1b1b");
    rect(340, 106 + sway, 24, 18, "#1b1b1b");
    rect(288, 136 + sway, 48, 14, "#d16b52");
    rect(214, 208 + sway, 34, 52, "#14431f");
    rect(392, 208 + sway, 34, 52, "#14431f");
    rect(250, 188 + sway, 26, 24, "#2a8d43");
    rect(364, 188 + sway, 26, 24, "#2a8d43");

}

function drawDragon(){

    clearCanvas();

    const flap =
        monsterBob(.15, 10);

    fillBands([
        { y: 0, h: 156, color: "#5e88f0" },
        { y: 156, h: 164, color: "#284522" }
    ]);

    rect(114, 108, 344, 118, "#7f1f22");
    rect(144, 94, 286, 74, "#b83333");
    rect(174, 78, 206, 48, "#e15345");
    rect(248, 128, 76, 42, "#fff1ce");
    rect(272, 136, 12, 12, "#1d1d1d");
    rect(302, 136, 12, 12, "#1d1d1d");
    rect(234, 116, 24, 12, "#fff1ce");
    rect(350, 116, 24, 12, "#fff1ce");
    rect(86, 72 - flap, 132, 56, "#7d1f24");
    rect(422, 72 + flap, 132, 56, "#7d1f24");
    rect(68, 88 - flap, 54, 20, "#ffa54c");
    rect(510, 88 + flap, 54, 20, "#ffa54c");
    rect(154, 196, 80, 20, "#611316");
    rect(404, 196, 80, 20, "#611316");
    rect(180, 206, 24, 28, "#521215");
    rect(438, 206, 24, 28, "#521215");
    drawStar(38, 26, "#ffeaa1");
    drawStar(570, 34, "#ffeaa1");

}

// =====================================
// INVENTORY
// =====================================

function usePotion(){

    const potion =
        inventory.consumables.find(
            c =>
            c.name ===
            "Health Potion"
        );

    if(
        !potion ||
        potion.amount <= 0
    ){

        addLog(
            "No potions."
        );

        return;
    }

    potion.amount--;

    PLAYER.hp =
        Math.min(
            PLAYER.maxHp,
            PLAYER.hp + 50
        );

    renderStats();

    addLog(
        "Potion used."
    );

}

function equipWeapon(id){

    if(
        inventory.weapons.includes(id)
    ){

        equipment.weapon =
            id;

        renderEquipment();

        renderStats();

    }

}

function equipArmor(id){

    if(
        inventory.armor.includes(id)
    ){

        equipment.armor =
            id;

        renderEquipment();

        renderStats();

    }

}

// =====================================
// LOOT
// =====================================

function rollLoot(monster){

    const chance =
        Math.random();

    if(
        chance < .15
    ){

        inventory.consumables.push({

            name:"Health Potion",
            amount:1

        });

        addLog(
            "Potion dropped."
        );

    }

    if(
        chance < .05
    ){

        inventory.weapons.push(
            "bow"
        );

        addLog(
            "Bow found!"
        );

    }

    renderInventory();

}

// =====================================
// OVERRIDE WIN
// =====================================

const originalDefeatMonster =
    defeatMonster;

defeatMonster = function(){

    rollLoot(
        currentMonster
    );

    originalDefeatMonster();

};

// =====================================
// SAVE SYSTEM
// =====================================

function saveLocal(){

    localStorage.setItem(

        "pixel-rpg-save",

        JSON.stringify(
            buildSaveData()
        )

    );

    addLog(
        "Game Saved"
    );

}

function loadLocal(){

    const raw =
        localStorage.getItem(
            "pixel-rpg-save"
        );

    if(!raw) return;

    const data =
        JSON.parse(raw);

    Object.assign(
        PLAYER,
        data.player
    );

    Object.assign(
        equipment,
        data.equipment
    );

    Object.assign(
        inventory,
        data.inventory
    );

    activeQuests =
        data.activeQuests || [];

    renderStats();

    renderInventory();

    renderEquipment();

    renderQuests();

    addLog(
        "Save Loaded"
    );

}

// =====================================
// FIREBASE SAVE
// =====================================

async function saveGameData(options = {}){

    const promptForAuth =
        options.promptForAuth !== false;

    const activeUser =
        window.currentUser ||
        (typeof auth !== "undefined"
            ? auth.currentUser
            : null);

    if(!activeUser){

        saveLocal();

        if(
            promptForAuth &&
            typeof authModal !== "undefined" &&
            authModal
        ){

            authModal.style.display =
                "block";

            addLog(
                "Sign in to sync saves."
            );

        }

        return;
    }

    try{

        const response =
            await fetch(
                "/api/save-game",
                {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    uid:
                    activeUser.uid,

                    gameData:
                    buildSaveData()

                })

            });

        if(!response.ok){
            throw new Error(
                `Save failed with status ${response.status}`
            );
        }

        await response.json();

        addLog(
            "Cloud Save"
        );

    }
    catch(err){

        console.error(err);

        saveLocal();

    }

}

// =====================================
// FIREBASE LOAD
// =====================================

async function loadGameData(uid){

    try{

        const response =
            await fetch(
            `/api/game-data/${uid}`
        );

        if(!response.ok){
            throw new Error(
                `Load failed with status ${response.status}`
            );
        }

        const data =
            await response.json();

        if(
            data.gameData
        ){

            Object.assign(
                PLAYER,
                data.gameData.player
            );

            Object.assign(
                inventory,
                data.gameData.inventory
            );

            Object.assign(
                equipment,
                data.gameData.equipment
            );

            activeQuests =
                data.gameData.activeQuests
                || [];

            renderStats();

            renderInventory();

            renderEquipment();

            renderQuests();

        }

    }
    catch(err){

        console.error(err);

        loadLocal();

    }

}

// =====================================
// AUTOSAVE
// =====================================

setInterval(

    ()=>{

        saveGameData({
            promptForAuth:false
        });

    },

    30000

);

// =====================================
// SAVE BUTTON
// =====================================

if(saveButton){

    saveButton.onclick =
        saveGameData;

}

window.addEventListener("keydown", event => {

    if(
        document.activeElement &&
        [
            "INPUT",
            "TEXTAREA"
        ].includes(
            document.activeElement.tagName
        )
    ) return;

    if(
        event.key === "1" &&
        button1.textContent
    ){

        button1.click();

    }

    if(
        event.key === "2" &&
        button2.textContent
    ){

        button2.click();

    }

    if(
        event.key === "3" &&
        button3.textContent
    ){

        button3.click();

    }

});

// =====================================
// GAME START
// =====================================

function startGame(){

    renderStats();

    renderInventory();

    renderEquipment();

    renderQuests();

    goTown();

    loadLocal();

}

startGame();

// =====================================
// PART 4
// ENDGAME SYSTEMS
// =====================================

// =====================================
// DAY NIGHT CYCLE
// =====================================

let worldTime = 0;

function updateWorldTime(){

    worldTime++;

    if(worldTime > 2400){

        worldTime = 0;

    }

}

setInterval(
    updateWorldTime,
    1000
);

function isNight(){

    return (
        worldTime > 1200
    );

}

// =====================================
// SKY COLORS
// =====================================

function drawDynamicSky(){

    if(isNight()){

        rect(
            0,
            0,
            640,
            160,
            "#101c3d"
        );

    }else{

        rect(
            0,
            0,
            640,
            160,
            "#5fa9ff"
        );

    }

}

// =====================================
// PLAYER SKILLS
// =====================================

const skillTree = {

    strength:0,

    vitality:0,

    agility:0,

    magic:0

};

function spendSkillPoint(skill){

    if(
        PLAYER.skillPoints <= 0
    ){

        addLog(
            "No skill points."
        );

        return;
    }

    PLAYER.skillPoints--;

    skillTree[skill]++;

    applySkillEffects();

}

function applySkillEffects(){

    PLAYER.maxHp =
        100 +
        (
            skillTree.vitality * 20
        );

    PLAYER.defense =
        getArmor().defense +
        (
            skillTree.strength * 2
        );

    if(
        PLAYER.hp >
        PLAYER.maxHp
    ){

        PLAYER.hp =
            PLAYER.maxHp;

    }

    renderStats();

}

// =====================================
// SKILL DAMAGE BONUS
// =====================================

function getSkillBonus(){

    return (
        skillTree.strength * 3
    );

}

// =====================================
// PATCH ATTACK
// =====================================

const originalAttack =
    attack;

attack = function(){

    const weapon =
        getWeapon();

    let damage =
        weapon.power +
        getSkillBonus() +
        Math.floor(
            Math.random()*10
        );

    if(
        Math.random() <
        (
            0.15 +
            skillTree.agility *
            0.02
        )
    ){

        damage *= 2;

        addLog(
            "Critical!"
        );

    }

    monsterCurrentHp -=
        damage;

    addLog(
        `${damage} damage`
    );

    updateMonsterBar();

    if(
        monsterCurrentHp <= 0
    ){

        defeatMonster();

        return;
    }

    monsterAttack();

};

// =====================================
// ACHIEVEMENTS
// =====================================

const achievements = {

    firstKill:false,

    level10:false,

    dragonSlayer:false,

    rich:false

};

function unlockAchievement(name){

    if(
        achievements[name]
    ) return;

    achievements[name] =
        true;

    addLog(
        `Achievement:
        ${name}`
    );

}

function checkAchievements(){

    if(
        PLAYER.level >= 10
    ){

        unlockAchievement(
            "level10"
        );

    }

    if(
        PLAYER.gold >= 1000
    ){

        unlockAchievement(
            "rich"
        );

    }

}

// =====================================
// PATCH MONSTER WIN
// =====================================

const oldDefeat =
    defeatMonster;

defeatMonster = function(){

    unlockAchievement(
        "firstKill"
    );

    if(
        currentMonster.id ===
        "dragon"
    ){

        unlockAchievement(
            "dragonSlayer"
        );

    }

    oldDefeat();

    checkAchievements();

};

// =====================================
// ELITE MONSTERS
// =====================================

const eliteMonsters = [

{
    id:"shadowlord",

    name:"Shadow Lord",

    hp:1000,

    level:40,

    gold:2000,

    xp:1000

},

{
    id:"ancientdragon",

    name:"Ancient Dragon",

    hp:2000,

    level:60,

    gold:5000,

    xp:2500

}

];

// =====================================
// ELITE BOSS FIGHT
// =====================================

function fightShadowLord(){

    currentMonster =
        eliteMonsters[0];

    monsterCurrentHp =
        currentMonster.hp;

    startBossFight();

}

function fightAncientDragon(){

    currentMonster =
        eliteMonsters[1];

    monsterCurrentHp =
        currentMonster.hp;

    startBossFight();

}

function startBossFight(){

    monsterStats.style.display =
        "block";

    monsterName.textContent =
        currentMonster.name;

    monsterLevel.textContent =
        `Boss Lv
        ${currentMonster.level}`;

    updateMonsterBar();

    button1.onclick =
        attack;

    button2.onclick =
        blockAttack;

    button3.onclick =
        dodgeAttack;

}

// =====================================
// DYNAMIC SHOP
// =====================================

let shopInventory = [];

function generateShopInventory(){

    shopInventory = [];

    weapons.forEach(
        weapon=>{

        if(
            Math.random() > .4
        ){

            shopInventory.push(
                weapon
            );

        }

    });

}

generateShopInventory();

setInterval(

    generateShopInventory,

    600000

);

// =====================================
// CRAFTING
// =====================================

const craftingRecipes = [

{
    result:"battleaxe",

    materials:[
        "bow",
        "dagger"
    ]
},

{
    result:"sword",

    materials:[
        "axe",
        "staff"
    ]
}

];

function craft(recipeId){

    const recipe =
        craftingRecipes[
            recipeId
        ];

    const hasItems =
        recipe.materials.every(

            item=>

            inventory.weapons.includes(
                item
            )

        );

    if(!hasItems){

        addLog(
            "Missing materials."
        );

        return;
    }

    recipe.materials.forEach(
        item=>{

        const index =
            inventory.weapons.indexOf(
                item
            );

        inventory.weapons.splice(
            index,
            1
        );

    });

    inventory.weapons.push(
        recipe.result
    );

    renderInventory();

    addLog(
        "Craft successful."
    );

}

// =====================================
// RARE LOOT TABLE
// =====================================

function rollRareLoot(){

    const roll =
        Math.random();

    if(
        roll < 0.02
    ){

        inventory.weapons.push(
            "sword"
        );

        addLog(
            "Legendary Sword!"
        );

    }

    if(
        roll < 0.01
    ){

        inventory.armor.push(
            "steel"
        );

        addLog(
            "Steel Armor!"
        );

    }

}

// =====================================
// PATCH DEFEAT MONSTER
// =====================================

const previousVictory =
    defeatMonster;

defeatMonster = function(){

    rollRareLoot();

    previousVictory();

};

// =====================================
// RANDOM ENCOUNTERS
// =====================================

function randomEncounter(){

    if(
        currentLocation !==
        "forest"
    ) return;

    if(
        Math.random() < .15
    ){

        startFight(
            Math.random() > .5
            ? "wolf"
            : "goblin"
        );

    }

}

setInterval(

    randomEncounter,

    30000

);

// =====================================
// SAVE EXTENSIONS
// =====================================

const oldBuildSave =
    buildSaveData;

buildSaveData =
function(){

    const save =
        oldBuildSave();

    save.skillTree =
        skillTree;

    save.achievements =
        achievements;

    save.worldTime =
        worldTime;

    return save;

};

// =====================================
// PATCH LOAD
// =====================================

const oldLoadLocal =
    loadLocal;

loadLocal = function(){

    oldLoadLocal();

    const raw =
        localStorage.getItem(
            "pixel-rpg-save"
        );

    if(!raw) return;

    const data =
        JSON.parse(raw);

    if(data.skillTree){

        Object.assign(
            skillTree,
            data.skillTree
        );

    }

    if(data.achievements){

        Object.assign(
            achievements,
            data.achievements
        );

    }

    if(data.worldTime){

        worldTime =
            data.worldTime;

    }

};

// =====================================
// ENDGAME CONTENT
// =====================================

function unlockEndgame(){

    if(
        !achievements.dragonSlayer
    ) return;

    setActionButtons(
        "Shadow Lord",
        "Ancient Dragon",
        "Town"
    );

    button1.onclick =
        fightShadowLord;

    button2.onclick =
        fightAncientDragon;

    button3.onclick =
        goTown;

}

// =====================================
// PERIODIC CHECK
// =====================================

setInterval(

    unlockEndgame,

    3000

);
