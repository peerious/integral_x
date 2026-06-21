const startScreen =
document.getElementById("startScreen");

const gameArea =
document.getElementById("gameArea");

const resultScreen =
document.getElementById("resultScreen");

const bossButtons =
document.querySelectorAll(".boss-btn");

const bossHpFill =
document.getElementById("bossHpFill");

const playerHpFill =
document.getElementById("playerHpFill");

const bossHpText =
document.getElementById("bossHpText");

const playerHpText =
document.getElementById("playerHpText");

const questionEl =
document.getElementById("question");

const timeEl =
document.getElementById("time");

const comboEl =
document.getElementById("combo");

const damageEl =
document.getElementById("damage");

const messageEl =
document.getElementById("message");

const resultTitle =
document.getElementById("resultTitle");

const resultStats =
document.getElementById("resultStats");

const restartBtn =
document.getElementById("restartBtn");

const choiceBtns = [
document.getElementById("choice0"),
document.getElementById("choice1"),
document.getElementById("choice2"),
document.getElementById("choice3")
];

const hitSound =
new Audio("sounds/hit.wav");

const wrongSound =
new Audio("sounds/wrong.wav");

const victorySound =
new Audio("sounds/victory.wav");

let bossHp = 1000;
let bossMaxHp = 1000;

let playerHp = 100;
let playerMaxHp = 100;

let combo = 0;

let timeLeft = 60;
let timer;

let correctAnswer = "";
let questionStartTime = 0;

function shuffle(array){

for(let i=array.length-1;i>0;i--){

    const j =
    Math.floor(
        Math.random()*(i+1)
    );

    [array[i],array[j]]
    =
    [array[j],array[i]];
}

return array;

}

function updateBars(){

bossHpFill.style.width =
(bossHp/bossMaxHp*100) + "%";

playerHpFill.style.width =
(playerHp/playerMaxHp*100) + "%";

bossHpText.textContent =
bossHp + " / " + bossMaxHp;

playerHpText.textContent =
playerHp + " / " + playerMaxHp;

}

function toSuperscript(n){

const sup = {
    "0":"⁰",
    "1":"¹",
    "2":"²",
    "3":"³",
    "4":"⁴",
    "5":"⁵",
    "6":"⁶",
    "7":"⁷",
    "8":"⁸",
    "9":"⁹",
    "-":"⁻"
};

return String(n)
    .split("")
    .map(ch => sup[ch] || ch)
    .join("");

}

function gcd(a,b){

while(b !== 0){

    let t = b;
    b = a % b;
    a = t;
}

return Math.abs(a);

}

function simplify(num,den){

const g = gcd(num,den);

return [
    num/g,
    den/g
];

}

function generateQuestion(){

const a =
Math.floor(Math.random()*5)+1;

const b =
Math.floor(Math.random()*5)+1;

const n =
Math.floor(Math.random()*5)+2;

const m =
Math.floor(Math.random()*5)+2;

const p1 = n + 1;
const p2 = m + 1;

questionEl.textContent =
"∫ (" +
a +
"x" +
toSuperscript(n) +
" + " +
b +
"x" +
toSuperscript(m) +
") dx";

const s1 =
simplify(a,p1);

const s2 =
simplify(b,p2);

const correct =
s1[0] +
"x" +
toSuperscript(p1) +
"/" +
s1[1] +
" + " +
s2[0] +
"x" +
toSuperscript(p2) +
"/" +
s2[1] +
" + C";

const wrong1 =
a +
"x" +
toSuperscript(n) +
"/" +
n +
" + " +
b +
"x" +
toSuperscript(m) +
"/" +
m +
" + C";

const wrong2 =
a +
"x" +
toSuperscript(p1+1) +
"/" +
(p1+1) +
" + " +
b +
"x" +
toSuperscript(p2+1) +
"/" +
(p2+1) +
" + C";

const wrong3 =
p1 +
"x" +
toSuperscript(p1) +
" + " +
p2 +
"x" +
toSuperscript(p2) +
" + C";

correctAnswer = correct;

const choices = [
    correct,
    wrong1,
    wrong2,
    wrong3
];

shuffle(choices);

for(let i=0;i<4;i++){

    choiceBtns[i].textContent =
    choices[i];
}

questionStartTime =
Date.now();

}

function startBattle(hp){

bossHp = hp;
bossMaxHp = hp;

playerHp = 100;

combo = 0;

if(hp === 200){

    timeLeft = 60;
}
else if(hp === 500){

    timeLeft = 90;
}
else{

    timeLeft = 120;
}

startScreen.classList.add(
    "hidden"
);

resultScreen.classList.add(
    "hidden"
);

gameArea.classList.remove(
    "hidden"
);

updateBars();

comboEl.textContent = 0;
damageEl.textContent = 0;
timeEl.textContent = timeLeft;

generateQuestion();

clearInterval(timer);

timer =
setInterval(()=>{

    timeLeft--;

    timeEl.textContent =
    timeLeft;

    if(timeLeft <= 0){

        clearInterval(timer);

        gameOver(true);
    }

},1000);

}

bossButtons.forEach(btn=>{

btn.addEventListener(
    "click",
    ()=>{

        startBattle(
            parseInt(
                btn.dataset.hp
            )
        );

    }
);

});

function attackBoss(isCritical){

combo++;

let damage =
20 * combo;

if(isCritical){

    damage += 30;

    messageEl.textContent =
    "💥 CRITICAL HIT!";
}
else{

    messageEl.textContent =
    "⚔️ HIT!";
}

bossHp -= damage;

if(bossHp < 0){
    bossHp = 0;
}

damageEl.textContent =
damage;

comboEl.textContent =
combo;

hitSound.currentTime = 0;
hitSound.play();

document.body.classList.add(
    "hit"
);

setTimeout(()=>{

    document.body.classList.remove(
        "hit"
    );

},250);

updateBars();

if(bossHp <= 0){

    victory();
    return;
}

generateQuestion();

}

function bossAttack(){

combo = 0;

comboEl.textContent = 0;

playerHp -= 15;

if(playerHp < 0){
    playerHp = 0;
}

damageEl.textContent = 0;

messageEl.textContent =
"👹 Boss Attack!";

wrongSound.currentTime = 0;
wrongSound.play();

updateBars();

if(playerHp <= 0){

    gameOver(false);
}

}

function handleChoice(choice){

const elapsedSeconds =
(Date.now() -
 questionStartTime) / 1000;

const isCritical =
elapsedSeconds < 2;

if(choice === correctAnswer){

    attackBoss(
        isCritical
    );
}
else{

    bossAttack();

    generateQuestion();
}

}

choiceBtns.forEach(btn=>{

btn.addEventListener(
    "click",
    ()=>{

        handleChoice(
            btn.textContent
        );

    }
);

});

function victory(){

clearInterval(timer);

victorySound.currentTime = 0;
victorySound.play();

gameArea.classList.add(
    "hidden"
);

resultScreen.classList.remove(
    "hidden"
);

resultTitle.textContent =
"🏆 Boss Defeated!";

resultStats.textContent =
"Time Left: " +
timeLeft +
" s";

}

function gameOver(timeout){

clearInterval(timer);

gameArea.classList.add(
    "hidden"
);

resultScreen.classList.remove(
    "hidden"
);

if(timeout){

    resultTitle.textContent =
    "⏰ Time Over";
}
else{

    resultTitle.textContent =
    "💀 You Died";
}

resultStats.textContent =
"Boss HP Remaining: " +
bossHp;

}

restartBtn.addEventListener(
"click",
()=>{

    resultScreen.classList.add(
        "hidden"
    );

    startScreen.classList.remove(
        "hidden"
    );
}

);
