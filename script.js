let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let dodgeCount = 0;
let pickCount = 0;
let monsterHealth;
let inventory = ["stick"];


const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const text = document.querySelector("#text");

const weapons = [
    {
    name: "stick", 
    power: 5
    },
    { 
    name: "dagger", 
    power: 30 
    },
    {
    name: "claw hammer", 
    power: 50 
    },
    { 
    name: "sword", 
    power: 100 
}
]

const monsters = [
    {
        name: "Mud Goblin",
        level: 2,
        health: 15
    },
    {
        name: "Arcane Skeleton",
        level: 8,
        health: 60
    },
    {
        name: "Shadow Dragon",
        level: 20,
        health: 300
    }
]

const locations = [
    {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight Shadow Dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
    },
    {
    name: "cave",
    "button text": ["Fight Mud Golem", "Fight Arcane Skeleton", "Go to town square"],
    "button functions": [fightGoblin, fightSkeleton, goTown],
    text: "You enter the cave. You see some monsters."
    },
    {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
    },
    {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, easterEgg, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
    name: "lose",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You die ☠️"
    },
    {
    name: "win",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉" 
    },
    {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win! You have 3 attempts, good luck 😁"
    }
]

// Initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function updateButtons(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goTown() {
    updateButtons(locations[0]);
    pickCount = 0;
}

function goStore() {
    updateButtons(locations[1]);
}

function goCave() {
    updateButtons(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            inventory.push(weapons[currentWeapon].name);
            console.log(inventory);
            text.innerText = `Now you have a ${inventory[currentWeapon]}.`;
            text.innerText += ` In the inventory you have: ${inventory}`;
        }   else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }   
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
}
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = `You sold a ${currentWeapon}.`;
        text.innerText += ` In your inventory you have: ${inventory}.`;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

function fightGoblin() {
    fighting = 0;
    goFight();
}

function fightSkeleton() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    updateButtons(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = `The ${monsters[fighting].name} attacks.`;
    text.innerText += ` You attack it with your ${weapons[currentWeapon].name}.`;
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " You miss.";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
        defeatMonster();
    }
    }   
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += `Your ${inventory.pop()} breaks`;
        currentWeapon--;
    }
}   

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
   
    let evasionBasePercentage = 60;
    let xpAditionalEvasionPercentage;
    let totalEvasionPercentage;

if (dodgeCount < 3) {

if (xp > 0) {
xpAditionalEvasionPercentage = xp;
} else {
    xpAditionalEvasionPercentage = 0;
}

totalEvasionPercentage = evasionBasePercentage + xpAditionalEvasionPercentage;

const evasionPossibility = Math.floor(Math.random() * 101);

if (evasionPossibility < totalEvasionPercentage) {
text.innerText = "You have dodged the attack of the monster! Your attack increases by 15%.";

const incrementedAttack = Math.floor(weapons[currentWeapon].power * 1.15);
monsterHealth -= incrementedAttack;
monsterHealthText.innerText = monsterHealth;

} else {
text.innerText = "You didn't quite manage to dodge the monster's attack.";

const monsterThreeQuartersDmg = Math.floor(getMonsterAttackValue(monsters[fighting].level) * 0.75);
health -= monsterThreeQuartersDmg;
healthText.innerText = health;
}

dodgeCount++;

if (health <= 0) {
    lose();
} else if (monsterHealth <= 0) {
    if (fighting === 2) {
        winGame();
    } else {
    defeatMonster();
}
}
} else {
    text.innerText = "You already dodged 3 times";
}
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    dodgeCount = 0;
    updateButtons(locations[4]);
}

function lose() {
updateButtons(locations[5]);
}

function winGame() {
updateButtons(locations[6]);
}

function restart() {
xp = 0;
health = 100;
gold = 50;
currentWeapon = 0;
inventory = ["stick"];
dodgeCount = 0;
xpText.innerText = xp;
healthText.innerText = health;
goldText.innerText = gold;
goTown();
}

function easterEgg() {
    updateButtons(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    const numbers = [];

    if (pickCount < 3) {
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = `You picked "${guess}". Here are the random numbers:\n`;
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.includes(guess)) {
        text.innerText += "Right! You win 30 gold!";
        gold += 30;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
    pickCount++;
} else {
    text.innerText = "You have used up all 3 attempts."
}
}
