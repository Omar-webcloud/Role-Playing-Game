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

function drawSky(){

    for(let y=0;y<160;y+=8){

        pixel(
            0,
            y,
            canvas.width,
            "#4c7cff"
        );

    }

}

function drawGround(){

    for(let y=160;y<320;y+=8){

        pixel(
            0,
            y,
            canvas.width,
            "#2c8a3a"
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

  button1.textContent = "Store";
  button2.textContent = "Forest";
  button3.textContent = "Dungeon";

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

  button1.textContent =
      "Buy Potion (10g)";

  button2.textContent =
      "Blacksmith";

  button3.textContent =
      "Town";

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

  button1.textContent =
      "Fight Wolf";

  button2.textContent =
      "Fight Goblin";

  button3.textContent =
      "Town";

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

  button1.textContent =
      "Fight Skeleton";

  button2.textContent =
      "Fight Troll";

  button3.textContent =
      "Town";

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

  button1.textContent =
      "Heal";

  button2.textContent =
      "Accept Quest";

  button3.textContent =
      "Town";

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

  button1.textContent =
      "Rest (15g)";

  button2.textContent =
      "Temple";

  button3.textContent =
      "Town";

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

  button1.textContent =
      "Upgrade Weapon";

  button2.textContent =
      "Buy Armor";

  button3.textContent =
      "Town";

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

  button1.textContent =
      "Attack";

  button2.textContent =
      "Block";

  button3.textContent =
      "Dodge";

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

    rect(
        180,
        100,
        120,
        80,
        "#9b5a2e"
    );

    rect(
        200,
        70,
        80,
        40,
        "#c0392b"
    );

}

// =====================================
// STORE
// =====================================

function drawStoreScene(){

    clearCanvas();

    rect(
        0,
        0,
        640,
        320,
        "#3c2a1e"
    );

    rect(
        100,
        80,
        400,
        150,
        "#654321"
    );

}

// =====================================
// FOREST
// =====================================

function drawForestScene(){

    clearCanvas();

    drawSky();

    drawGround();

    for(
        let i=0;
        i<6;
        i++
    ){

        rect(
            50+(i*90),
            100,
            25,
            100,
            "#5d3a1a"
        );

        rect(
            30+(i*90),
            40,
            70,
            70,
            "#27ae60"
        );

    }

}

// =====================================
// DUNGEON
// =====================================

function drawDungeonScene(){

    clearCanvas();

    rect(
        0,
        0,
        640,
        320,
        "#1b1b1b"
    );

    for(
        let i=0;
        i<640;
        i+=32
    ){

        rect(
            i,
            100,
            30,
            120,
            "#444"
        );

    }

}

// =====================================
// TEMPLE
// =====================================

function drawTempleScene(){

    clearCanvas();

    rect(
        0,
        0,
        640,
        320,
        "#f4f4f4"
    );

    rect(
        260,
        60,
        120,
        180,
        "#dcdcdc"
    );

}

// =====================================
// INN
// =====================================

function drawInnScene(){

    clearCanvas();

    rect(
        0,
        0,
        640,
        320,
        "#8e5e3b"
    );

    rect(
        200,
        120,
        220,
        80,
        "#5c3d26"
    );

}

// =====================================
// BLACKSMITH
// =====================================

function drawBlacksmithScene(){

    clearCanvas();

    rect(
        0,
        0,
        640,
        320,
        "#2b2b2b"
    );

    rect(
        350,
        120,
        120,
        90,
        "#ff6600"
    );

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

function drawSlime(){

    clearCanvas();

    drawGround();

    const bounce =
        Math.sin(
            animationFrame * .08
        ) * 6;

    rect(
        260,
        180 + bounce,
        100,
        70,
        "#2ecc71"
    );

}

function drawWolf(){

    clearCanvas();

    drawGround();

    const walk =
        Math.sin(
            animationFrame*.1
        )*5;

    rect(
        250+walk,
        150,
        120,
        70,
        "#999"
    );

}

function drawGoblin(){

    clearCanvas();

    drawGround();

    const bounce =
        Math.sin(
            animationFrame*.08
        )*8;

    rect(
        260,
        140+bounce,
        90,
        120,
        "#2ecc71"
    );

}

function drawSkeleton(){

    clearCanvas();

    drawGround();

    rect(
        270,
        110,
        70,
        150,
        "#f1f1f1"
    );

}

function drawTroll(){

    clearCanvas();

    drawGround();

    rect(
        220,
        100,
        170,
        170,
        "#4caf50"
    );

}

function drawDragon(){

    clearCanvas();

    const flap =
        Math.sin(
            animationFrame*.15
        )*10;

    rect(
        160,
        90,
        300,
        150,
        "#c0392b"
    );

    rect(
        100,
        60-flap,
        120,
        60,
        "#922b21"
    );

    rect(
        400,
        60+flap,
        120,
        60,
        "#922b21"
    );

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

async function saveGameData(){

    if(
        !currentUser
    ){

        saveLocal();

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
                    currentUser.uid,

                    gameData:
                    buildSaveData()

                })

            });

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

        saveGameData();

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

    button1.textContent =
        "Shadow Lord";

    button2.textContent =
        "Ancient Dragon";

    button3.textContent =
        "Town";

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