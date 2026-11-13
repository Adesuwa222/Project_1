/* =========================================================
   ESCAPE BUTTERCUP BAKESHOP
   CCT360 Project: The Curious Case

   Uses: variables, functions, booleans, if / else if / else,
   relational and logical operators, arrays (push, length),
   for loops, getElementById, getElementsByClassName,
   innerHTML, style, addEventListener, mouse clientX and
   clientY, and the audio play(), pause() and currentTime.
   ========================================================= */


/* ---------- 1. VARIABLES (what the game remembers) ---------- */

let inventory = [];        // items in your bag, e.g. "flashlight"
let clues = [];            // clues in your notebook, e.g. "receipt"
let accused = "";          // "emma", "vanessa" or "daniel"
let accusedName = "";      // their full name, e.g. "Emma Davis"
let currentRoom = "start";

let freezerOpen = false;   // booleans: true or false
let officeOpen = false;
let soundOn = true;

let temperature = 0;       // oven puzzle
let code = "";             // keypad puzzle


/* ---------- 2. HELPER FUNCTIONS ---------- */

// is this item in the bag? loops through the array to check
function hasItem(name) {
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i] === name) {
      return true;
    }
  }
  return false;
}

// is this clue in the notebook?
function hasClue(name) {
  for (let i = 0; i < clues.length; i++) {
    if (clues[i] === name) {
      return true;
    }
  }
  return false;
}

// play a sound effect from the start
function playSound(name) {
  if (soundOn === true) {
    let sound = document.getElementById("sfx-" + name);
    sound.currentTime = 0;
    sound.play();
  }
}

// show text in the message bubble
function say(text) {
  document.getElementById("message-text").innerHTML = text;
  document.getElementById("message").style.display = "block";
}

function hideMessage() {
  document.getElementById("message").style.display = "none";
}


/* ---------- 3. CHANGING ROOMS ---------- */

function goTo(room) {
  // hide every scene
  let scenes = document.getElementsByClassName("scene");
  for (let i = 0; i < scenes.length; i++) {
    scenes[i].style.display = "none";
  }

  // show the one we want
  document.getElementById(room).style.display = "block";
  currentRoom = room;
  hideMessage();

  // update the room name in the top bar
  let roomName = document.getElementById("room-name");
  if (room === "counter") {
    roomName.innerHTML = "Front Counter";
  } else if (room === "kitchen") {
    roomName.innerHTML = "Kitchen";
  } else if (room === "pantry") {
    roomName.innerHTML = "Pantry";
  } else if (room === "freezer") {
    roomName.innerHTML = "Freezer";
  } else if (room === "office") {
    roomName.innerHTML = "Back Office";
  }

  // the pantry is dark unless you have the flashlight
  if (room === "pantry") {
    if (hasItem("flashlight")) {
      document.getElementById("darkness").style.display = "none";
      document.getElementById("light").style.display = "block";
    } else {
      document.getElementById("darkness").style.display = "block";
      document.getElementById("light").style.display = "none";
      say("It's pitch black in here. You can't see a thing.");
    }
  }
}


/* ---------- 4. BAG AND NOTEBOOK ---------- */

function addItem(name) {
  inventory.push(name);
  playSound("pickup");

  // hide the item in the room picture (the patch covers it up)
  let patch = document.getElementById("patch-" + name);
  if (patch !== null) {
    patch.style.display = "block";
  }

  drawBag();
}

// put a picture in each bag slot
function drawBag() {
  let slots = document.getElementsByClassName("slot");
  for (let i = 0; i < inventory.length; i++) {
    slots[i].innerHTML = '<img src="assets/images/item-' + inventory[i] + '.png" alt="' + inventory[i] + '">';
    slots[i].style.backgroundColor = "white";
  }
}

function addClue(name) {
  if (!hasClue(name)) {            // only add it the first time
    clues.push(name);
    playSound("clue");

    // swap "???" for the real clue in the notebook
    document.getElementById("unknown-" + name).style.display = "none";
    document.getElementById("clue-" + name).style.display = "inline";

    document.getElementById("clue-count").innerHTML = clues.length + "/8";
  }
}


/* ---------- 5. POP UP WINDOWS ---------- */

function openPopup(id) {
  let popups = document.getElementsByClassName("popup");
  for (let i = 0; i < popups.length; i++) {
    popups[i].style.display = "none";
  }
  document.getElementById("overlay").style.display = "flex";
  document.getElementById(id).style.display = "block";
}

function closePopup() {
  document.getElementById("overlay").style.display = "none";
}

let closeButtons = document.getElementsByClassName("close-btn");
for (let i = 0; i < closeButtons.length; i++) {
  closeButtons[i].addEventListener("click", closePopup);
}


/* ---------- 6. START ---------- */

document.getElementById("play-btn").addEventListener("click", function () {
  goTo("counter");
  document.getElementById("bag").style.display = "flex";

  let music = document.getElementById("music");
  music.volume = 0.35;
  music.play();

  say("You wake up on a stool. It's almost midnight and every door is locked. Click around to search for a way out.");
});


/* ---------- 7. LOOK AROUND (plain descriptions) ----------
   Every button with the class "look" just shows the text
   written inside it. One loop handles all of them. */

let looks = document.getElementsByClassName("look");
for (let i = 0; i < looks.length; i++) {
  looks[i].addEventListener("click", function () {
    if (currentRoom === "pantry" && !hasItem("flashlight")) {
      playSound("wrong");
      say("It's too dark to see anything. You need some kind of light.");
    } else {
      playSound("click");
      say(looks[i].innerHTML);
    }
  });
}


/* ---------- 8. FRONT COUNTER ---------- */

document.getElementById("counter-kitchen-door").addEventListener("click", function () {
  playSound("click");
  goTo("kitchen");
});

document.getElementById("counter-pantry-door").addEventListener("click", function () {
  playSound("click");
  goTo("pantry");
});

document.getElementById("counter-register").addEventListener("click", function () {
  if (!hasItem("receipt")) {
    addItem("receipt");
    addClue("receipt");
    say("A receipt is sticking out of the register. It was printed at 11:47 PM, almost three hours after closing! Only the cashier uses this register.");
  } else {
    say("The screen still says $47.50. Who was buying cake at midnight?");
  }
});

document.getElementById("counter-bell").addEventListener("click", function () {
  playSound("ding");
  say("Ding! ...Nobody comes.");
});

document.getElementById("counter-exit-door").addEventListener("click", function () {
  if (!hasItem("door-key")) {
    playSound("wrong");
    say("The front door is padlocked. You need the front door key.");
  } else if (accused === "") {
    document.getElementById("leave-text").innerHTML = "You can unlock the door, but you haven't named the thief yet. The board in the Back Office is where you make your accusation.";
    openPopup("leave-popup");
  } else {
    document.getElementById("leave-text").innerHTML = "You're accusing " + accusedName + ". Ready to escape?";
    openPopup("leave-popup");
  }
});

document.getElementById("stay-btn").addEventListener("click", closePopup);
document.getElementById("leave-btn").addEventListener("click", function () {
  closePopup();
  endGame();
});


/* ---------- 9. KITCHEN ---------- */

document.getElementById("kitchen-back").addEventListener("click", function () {
  playSound("click");
  goTo("counter");
});

document.getElementById("kitchen-freezer-door").addEventListener("click", function () {
  if (freezerOpen === true) {
    playSound("click");
    goTo("freezer");
  } else if (hasItem("freezer-key")) {
    freezerOpen = true;
    playSound("unlock");
    goTo("freezer");
    say("The frosty key fits! The freezer door swings open. Brrr.");
  } else {
    playSound("wrong");
    say("The freezer is locked with a little pink padlock. The key must be somewhere around here.");
  }
});

document.getElementById("kitchen-office-door").addEventListener("click", function () {
  if (officeOpen === true) {
    playSound("click");
    goTo("office");
  } else {
    code = "";
    document.getElementById("keypad-display").innerHTML = "____";
    openPopup("keypad-popup");
  }
});

document.getElementById("kitchen-drawer-right").addEventListener("click", function () {
  if (!hasItem("flashlight")) {
    addItem("flashlight");
    say("You found a flashlight in the drawer! That will help somewhere dark.");
  } else {
    say("Just rubber bands and a broken spatula now.");
  }
});

document.getElementById("kitchen-bowl").addEventListener("click", function () {
  if (!hasItem("recipe-scrap")) {
    addItem("recipe-scrap");
    say("A torn scrap of paper is tucked under the bowl. It's part of the Rainbow Cake recipe! It says: Bake at 350°.");
  } else {
    say("An empty mixing bowl. Someone left in a hurry.");
  }
});

document.getElementById("kitchen-oven").addEventListener("click", function () {
  if (hasItem("cookie-code")) {
    say("The oven is cooling down now.");
  } else {
    temperature = 0;
    document.getElementById("oven-display").innerHTML = "0°";
    openPopup("oven-popup");
  }
});


/* ---------- 10. OVEN PUZZLE ---------- */

document.getElementById("oven-up").addEventListener("click", function () {
  if (temperature < 500) {
    temperature += 25;
  }
  playSound("click");
  document.getElementById("oven-display").innerHTML = temperature + "°";
});

document.getElementById("oven-down").addEventListener("click", function () {
  if (temperature > 0) {
    temperature -= 25;
  }
  playSound("click");
  document.getElementById("oven-display").innerHTML = temperature + "°";
});

document.getElementById("oven-bake").addEventListener("click", function () {
  if (temperature === 350) {
    playSound("ding");
    closePopup();
    addItem("cookie-code");
    say("Ding! The cookies are done. One of them has 1147 piped on it in pink icing. That looks like a code!");
  } else if (temperature > 350) {
    playSound("wrong");
    say("Too hot! The cookies would burn.");
  } else {
    playSound("wrong");
    say("Too cold. Nothing is happening.");
  }
});


/* ---------- 11. KEYPAD PUZZLE ---------- */

let keys = document.getElementsByClassName("key");
for (let i = 0; i < keys.length; i++) {
  keys[i].addEventListener("click", function () {
    if (code.length < 4) {
      code = code + keys[i].innerHTML;     // add the number to the code
      playSound("click");
      document.getElementById("keypad-display").innerHTML = code;
    }
  });
}

document.getElementById("key-clear").addEventListener("click", function () {
  code = "";
  playSound("click");
  document.getElementById("keypad-display").innerHTML = "____";
});

document.getElementById("key-enter").addEventListener("click", function () {
  if (code === "1147") {
    officeOpen = true;
    playSound("unlock");
    closePopup();
    goTo("office");
    say("Beep beep! The office door unlocks.");
  } else {
    playSound("wrong");
    code = "";
    document.getElementById("keypad-display").innerHTML = "NOPE";
  }
});


/* ---------- 12. PANTRY ---------- */

document.getElementById("pantry-back").addEventListener("click", function () {
  playSound("click");
  goTo("counter");
});

document.getElementById("pantry-sack").addEventListener("click", function () {
  if (!hasItem("flashlight")) {
    playSound("wrong");
    say("It's too dark to see anything. You need some kind of light.");
  } else if (!hasItem("freezer-key")) {
    addItem("freezer-key");
    say("The big sack has a torn corner and something shiny inside. It's a key with a snowflake on it!");
  } else {
    say("Just flour now.");
  }
});

document.getElementById("pantry-board").addEventListener("click", function () {
  if (!hasItem("flashlight")) {
    playSound("wrong");
    say("It's too dark to see anything. You need some kind of light.");
  } else {
    addClue("shifts");
    say("The shift list says Emma closed the shop tonight. Vanessa opens tomorrow. Daniel's delivery was at 9 PM.");
  }
});

// FLASHLIGHT: the light follows the mouse (clientX and clientY, Class 5)
// The light is a big picture with a see through circle in the middle,
// so we move it by half its size to keep the circle under the mouse.
window.addEventListener("mousemove", function (event) {
  let light = document.getElementById("light");
  let cX = event.clientX;
  let cY = event.clientY;
  light.style.left = (cX - 1000) + "px";
  light.style.top = (cY - 1000) + "px";
});


/* ---------- 13. FREEZER ---------- */

document.getElementById("freezer-back").addEventListener("click", function () {
  playSound("click");
  goTo("kitchen");
});

document.getElementById("freezer-cake").addEventListener("click", function () {
  if (!hasItem("door-key")) {
    addItem("door-key");
    say("Something gold is poking out of the frozen cake. You wiggle it free. It's the front door key!");
  } else {
    say("A frozen Rainbow Cake with a key shaped hole in it. Oops.");
  }
});

document.getElementById("freezer-ice").addEventListener("click", function () {
  if (hasItem("recipe")) {
    say("Just slush now.");
  } else if (hasItem("space-heater")) {
    addItem("recipe");
    playSound("win");
    say("You switch on the space heater. Drip, drip, drip... the ice melts and you pull out a pink envelope. It's the TOP SECRET Rainbow Cake recipe!");
  } else {
    playSound("wrong");
    say("A pink envelope is frozen inside a block of ice! It's rock solid. You need something warm to melt it.");
  }
});

document.getElementById("freezer-name-tag").addEventListener("click", function () {
  if (!hasItem("name-tag")) {
    addItem("name-tag");
    addClue("name-tag");
    say("A sparkly name tag on the floor. It says EMMA. Why would the cashier be in the freezer?");
  } else {
    say("Nothing else on the floor except frost.");
  }
});


/* ---------- 14. BACK OFFICE ---------- */

document.getElementById("office-back").addEventListener("click", function () {
  playSound("click");
  goTo("kitchen");
});

document.getElementById("office-board").addEventListener("click", function () {
  playSound("click");
  openPopup("accuse-popup");
});

document.getElementById("office-monitor").addEventListener("click", function () {
  addClue("camera");
  say("The security camera shows a blurry figure with a ponytail at the counter. The time stamp says 11:47 PM.");
});

document.getElementById("office-safe").addEventListener("click", function () {
  addClue("glitter");
  say("The safe is open and empty. This is where the recipe was kept. There's a smudge of pink glitter nail polish by the dial...");
});

document.getElementById("office-footprints").addEventListener("click", function () {
  addClue("footprints");
  say("Floury footprints lead to the safe. Vanessa is always covered in flour... but so is anyone who walks through the pantry.");
});

document.getElementById("office-slip").addEventListener("click", function () {
  addClue("slip");
  say("A delivery slip signed by Daniel at 9:02 PM. He dropped off the flour and left.");
});

document.getElementById("office-cardigan").addEventListener("click", function () {
  addClue("cardigan");
  say("A sparkly pink cardigan. The glitter looks just like the smudge on the safe.");
});

document.getElementById("office-heater").addEventListener("click", function () {
  if (!hasItem("space-heater")) {
    addItem("space-heater");
    say("A little space heater under the desk. You take it. It could melt something...");
  } else {
    say("Just dust bunnies under the desk now.");
  }
});


/* ---------- 15. ACCUSING A SUSPECT ---------- */

function accuse(name, fullName) {
  accused = name;
  accusedName = fullName;
  playSound("clue");
  closePopup();

  // highlight the chosen photo
  document.getElementById("accuse-emma").style.backgroundColor = "transparent";
  document.getElementById("accuse-vanessa").style.backgroundColor = "transparent";
  document.getElementById("accuse-daniel").style.backgroundColor = "transparent";
  document.getElementById("accuse-" + name).style.backgroundColor = "#FFE3EC";

  document.getElementById("accused-note").innerHTML = "You are accusing " + fullName + ".";
  say("You pin " + fullName + "'s photo to the board. Now get out of here with the front door key!");
}

document.getElementById("accuse-emma").addEventListener("click", function () {
  accuse("emma", "Emma Davis");
});
document.getElementById("accuse-vanessa").addEventListener("click", function () {
  accuse("vanessa", "Vanessa Brown");
});
document.getElementById("accuse-daniel").addEventListener("click", function () {
  accuse("daniel", "Daniel John");
});


/* ---------- 16. TOP BAR BUTTONS ---------- */

document.getElementById("notebook-btn").addEventListener("click", function () {
  playSound("click");
  openPopup("notebook-popup");
});

document.getElementById("sound-btn").addEventListener("click", function () {
  soundOn = !soundOn;                    // flip true and false
  let music = document.getElementById("music");
  if (soundOn === true) {
    document.getElementById("sound-btn").innerHTML = "Sound on";
    if (currentRoom !== "start") {
      music.play();
    }
  } else {
    document.getElementById("sound-btn").innerHTML = "Sound off";
    music.pause();
  }
});

// HINTS: checks the puzzles in order and gives the next step
document.getElementById("hint-btn").addEventListener("click", function () {
  playSound("click");

  if (currentRoom === "start") {
    say("Press Play first!");
  } else if (!hasItem("recipe-scrap")) {
    say("Hint: Check the mixing bowl in the kitchen. Something is tucked underneath it.");
  } else if (!hasItem("cookie-code")) {
    say("Hint: The recipe scrap says to bake at 350°. Try the oven.");
  } else if (!hasItem("flashlight")) {
    say("Hint: Kitchen drawers are great for hiding small things.");
  } else if (!hasItem("freezer-key")) {
    say("Hint: With your flashlight, search the pantry. One flour sack has a torn corner.");
  } else if (officeOpen === false) {
    say("Hint: The office keypad needs 4 numbers. Did something come out of the oven?");
  } else if (!hasItem("space-heater")) {
    say("Hint: Look under the desk in the Back Office.");
  } else if (!hasItem("door-key")) {
    say("Hint: The frozen cake in the freezer has something shiny sticking out of it.");
  } else if (!hasItem("recipe")) {
    say("Hint: That block of ice won't melt by itself. You have something warm now.");
  } else if (clues.length < 5) {
    say("Hint: You have the key, but a real detective finds more clues. Check the cash register, safe and camera screen.");
  } else if (accused === "") {
    say("Hint: Open your clue notebook, then pin the thief on the board in the Back Office.");
  } else {
    say("Hint: You're ready! Use the front door key on the exit.");
  }
});


/* ---------- 17. ENDINGS ---------- */

function endGame() {
  let music = document.getElementById("music");
  music.pause();

  let endImg = document.getElementById("end-img");
  let tag = document.getElementById("end-tag");
  let title = document.getElementById("end-title");
  let text = document.getElementById("end-text");

  if (accused === "emma" && hasItem("recipe")) {
    playSound("win");
    endImg.src = "assets/images/screen-best.png";
    tag.innerHTML = "Best Ending";
    title.innerHTML = "Case closed!";
    text.innerHTML = "You escape at sunrise with the secret recipe in hand. The receipt, the camera, the glitter and the name tag all pointed to Emma Davis. Buttercup Bakeshop will bake Rainbow Cake again!";
  } else if (accused === "vanessa" || accused === "daniel") {
    playSound("wrong");
    endImg.src = "assets/images/screen-wrong.png";
    tag.innerHTML = "Wrong Ending";
    title.innerHTML = "Oops... wrong person!";
    text.innerHTML = "You blamed the wrong person. While everyone argued, a blonde ponytail slipped out the back with a pink envelope. The real thief got away.";
  } else if (accused === "emma") {
    playSound("win");
    endImg.src = "assets/images/screen-okay.png";
    tag.innerHTML = "Okay Ending";
    title.innerHTML = "Right thief, missing recipe";
    text.innerHTML = "You were right about Emma Davis, but without the recipe there's no proof. Maybe something in the freezer was worth melting?";
  } else {
    playSound("win");
    endImg.src = "assets/images/screen-okay.png";
    tag.innerHTML = "Okay Ending";
    title.innerHTML = "You escaped!";
    text.innerHTML = "You're free and the sun is coming up, but nobody knows who stole the Rainbow Cake recipe. The mystery is still unsolved.";
  }

  document.getElementById("end-clues").innerHTML = clues.length + "/8";
  document.getElementById("end-items").innerHTML = inventory.length + "/9";
  document.getElementById("room-name").innerHTML = tag.innerHTML;
  document.getElementById("bag").style.display = "none";
  goTo("ending");
}
