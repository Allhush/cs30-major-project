// Major Project
// Alliam Hushagen
// Wednesday May 1st 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// cost of sword troop
const SWORDCOST = 20;
// zombie danger value
const ZOMBIEDANGER = 10;
// cost of a spear troop
const SPEARCOST = 30;

// holds all of the troops bought by the player
let theTroops = [];
// hold all of the enemies that spawn
let theEnemies = [];
// holds the coins the player uses to buy troops
let coins = 100;
// danger value of the wave of the wave 
let dangerScore = 100;
// counts rounds
let roundCounter = 0;
// used to make sound for sword troop
let swordSlash;
// used to make sound for zombies
let zombieGroan;
// helps with targeting for the enemies
let doubleCheck = "no";
// makes sure that double check has enough time to reset the targeting
let doubleCheckHelper = 0;

let lifted = false;

function preload(){
  swordSlash = loadSound("Assets/soundEffects/sword-slash-and-swing-185432.mp3");
  zombieGroan = loadSound("Assets/soundEffects/zombie.mp3.mp3");
}

// most basic troop that the player can buy
class SwordTroop{
  constructor(x,y){
    // identifys troop to see if certain functions apply
    this.identify = "sword";
    // troops x value
    this.x = x;
    // troops y value
    this.y = y;
    // troops health
    this.health = 75;
    // troops damage
    this.damage = 20;
    // troops height
    this.height = 30;
    // troops width
    this.width = 30;
    // troops coin cost
    this.cost = SWORDCOST;
    // temporary color for the sword troop
    this.colour = "black";
    // range the sword troop can attack from
    this.range = 50;
    // checks if the player is moving the troop
    this.liftState = false;
    // small delay used in some functions
    this.delay = 100;
    this.space = 15;
  }

  // displays the troop
  display(){
    noStroke();
    // centers troop
    rectMode(CENTER);
    // sets troops temporary color
    fill(this.colour);
    // places troop at correct position with correct height and length
    rect(this.x, this.y, this.width, this.height);
  }

  // lets troops attack enemies
  attackTroops(theEnemies){
    // goes through all the enemies
    for(let target of theEnemies){
      // checks range
      let enemyDistance = dist(this.x, this.y, target.x, target.y);
      // attacks enemies
      if(enemyDistance < this.range && frameCount%60 === 0){
        target.health -= this.damage;
        // plays sound effect
        swordSlash.play();
      }
    }
  }


  mouseMoveSetup(){
    // checks values to see if the player is trying to move
    if(mouseX > this.x - this.width/2  && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2 && mouseIsPressed && keyIsDown(90) === false){
      // moves the troop around
      this.liftState = true;
      lifted = true;
    }
    else{
      // doesn't move your troops around
      this.liftState = false;
      lifted = false;
    }
  }

  // moves troops
  mouseMove(){
    if(this.liftState){
      // makes troop track the mouse
      this.x = mouseX;
      this.y = mouseY;

    }
  }

  spaceOut(trooper){
    for(let i = trooper.length - 1; i >= 0; i--){
      if(this !== trooper[i] && trooper.length > 1 && lifted){
        if(trooper[i].x - this.x < this.space){
          trooper[i].x += this.space;
        }
      }
    }
  }

}

class SpearMan{
  constructor(x,y){
    // identifys troop to see if certain functions apply
    this.identify = "spear";
    // troops x value
    this.x = x;
    // troops y value
    this.y = y;
    // troops health
    this.health = 50;
    // troops damage beyond a range of 25
    this.damage25Plus = 40;
    // troops damage less than a range of 25
    this.damge25Minus = 5;
    // troops height
    this.height = 30;
    // troops width
    this.width = 30;
    // troops coin cost
    this.cost = SPEARCOST;
    // temporary color for the sword troop
    this.colour = "blue";
    // range the spear troop can attack from
    this.range1 = 75;
    // range spear troops are less effective at
    this.range2 = 25;
    // checks if the player is moving the troop
    this.liftState = false;
    // small delay used in some functions
    this.delay = 100;
    this.space = 15;
    // all of these are used to identify the closest troop so it can't one shot everything
    this.enemyX = width;
    this.enemyY = height;
    this.enemyDistance;
    this.closestTroopIndex = -1;
    this.enemyNumbers = 0;
  }

  // displays the troop
  display(){
    noStroke();
    // centers troop
    rectMode(CENTER);
    // sets troops temporary color
    fill(this.colour);
    // places troop at correct position with correct height and length
    rect(this.x, this.y, this.width, this.height);
  }

  // lets troops attack enemies
  attackTroops(theEnemies){
    
    if(theEnemies.length < this.enemyNumbers){
      // resets targeting for the enemies
      this.enemyX = width;
      this.enemyY = height;
    }
    for(let target = theEnemies.length - 1; target >= 0; target --){
      // checks the distance of the current troop in the array
      this.enemyDistance = dist(this.x, this.y, theEnemies[target].x, theEnemies[target].y);
      // checks if another troop is closer
      if(this.enemyDistance < dist(this.x, this.y, this.enemyX, this.enemyY)){
        // resets target if it is closer
        this.enemyX = theEnemies[target].x;
        this.enemyY = theEnemies[target].y;
        // targets the new troops]
        this.closestTroopIndex = target;
        // console.log(this.closestTroopIndex);
      }
      else{
        // resets circuit to see if another troop is closer
        this.enemyNumbers = theTroops.length;
      }
    }
    
    // if(theEnemies.length < this.enemyNumbers){
    //   // resets targeting for the enemies
    //   this.enemyX = width;
    //   this.enemyY = height;
    // }
    // attacks enemies
    let enemyDistance = dist(this.x, this.y, this.enemyX, this.enemyY);
    if(enemyDistance < this.range1 && enemyDistance > this.range2 && frameCount%60 === 0 && this.closestTroopIndex < theEnemies.length && this.closestTroopIndex >= 0){
      theEnemies[this.closestTroopIndex].health -= 50;
      // plays sound effect
      swordSlash.play();
      // console.log("damaging");
      this.closestTroopIndex = -1;
    }
    else if(enemyDistance <= this.range2 && frameCount%60 === 0 && this.closestTroopIndex < theEnemies.length){
      theEnemies[this.closestTroopIndex].health -= 5;
      // plays sound effect
      swordSlash.play();
      // console.log("damaging2");
    }
  }

  // checks if the player is trying to move the troops
  mouseMoveSetup(){
    // checks values to see if the player is trying to move
    if(mouseX > this.x - this.width/2  && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2 && mouseIsPressed && keyIsDown(68) === false){
      // moves the troop around
      this.liftState = true;
      lifted = true;
    }
    else{
      // doesn't move your troops around
      this.liftState = false;
      lifted = false;
    }
  }

  // moves troops
  mouseMove(){
    if(this.liftState){
      // makes troop track the mouse
      this.x = mouseX;
      this.y = mouseY;

    }
  }
}


// simplest enemy
class Zombie{
  constructor(x,y){
    // almost identacle to swordTroop definitions, look above to see
    this.x = x;
    this.y = y;
    this.health = 50;
    this.damage = 15;
    this.speed = 1;
    this.height = 30;
    this.width = 30;
    this.colour = "green";
    // how many coins the zombie gives on death
    this.coin = 5;
    this.range = 20;
    // decideds if there are troops close enough to attack
    this.attackState = "calm";
    // dead code
    this.closestTroop = width;
    // saves the ndex of the closest troop so that it can be tracked
    this.closestTroopIndex = 0;
    // how close an enemy needs to be to attarct enemy attention
    this.agitationRange = 80;
    // sees how close the eneimes are
    this.enemyDistance = width;
    // used in targeting to see enemies x coordinate
    this.enemyX = width;
    // used in targeting to see enemies y coordinate
    this.enemyY = height;
    // makes sure the enemies is a valid target
    this.enemyNumbers = 0;
  }

  // displays zombies
  display(){
    noStroke();
    rectMode(CENTER);
    fill(this.colour);
    rect(this.x, this.y, this.width, this.height);
  }

  // dead code
  registerDeath(){
    if(this.health <= 0){
      console.log("I'm dead");
    }
  }

  // checks if troops are close enough then attacks them
  attackTroops(theTroops){
    for(let target of theTroops){
      this.enemyDistance = dist(this.x, this.y, target.x, target.y);
      if(this.enemyDistance < this.range && frameCount%60 === 0){
        target.health -= this.damage;
      }
    }
  }
  
  // if(frameCount%5 === 0 && trooper.length > 0){
  //   //for
  //   this.closestTroop = this.enemyDistance;
  //   this.closestTroopIndex = 0;
  // }
  seeTroops(trooper){
    // checks to see if a troops has been deleted
    if(trooper.length < this.enemyNumbers){
      // resets targeting for the enemies
      this.enemyX = width;
      this.enemyY = height;
    }
    // goes through all possible targets
    for(let target = trooper.length - 1; target >= 0; target --){
      // checks the distance of the current troop in the array
      this.enemyDistance = dist(this.x, this.y, theTroops[target].x, theTroops[target].y);
      // checks if another troop is closer
      if(this.enemyDistance < dist(this.x, this.y, this.enemyX, this.enemyY)){
        // resets target if it is closer
        this.enemyX = trooper[target].x;
        this.enemyY = trooper[target].y;
        // targets the new troops]
        this.closestTroopIndex = target;
        // test stuff, not important
        // console.log(dist(this.x, this.y, this.enemyX, this.enemyY));
      }
      else{
        // resets circuit to see if another troop is closer
        this.enemyNumbers = theTroops.length;
      }
      // if(frameCount%30 === 0){
      //   console.log(this.enemyDistance);
      // }
    }
  }

  agitation(theTroops){
    // goes through all possible targets
    for(let target = theTroops.length - 1; target >= 0; target --){
      // checks how close the targets
      this.enemyDistance = dist(this.x, this.y, theTroops[target].x, theTroops[target].y);
      // if targets are cloes enough the enemy becomes agitated
      if(this.enemyDistance < this.agitationRange){
        this.attackState = "agitated";
      }
    }
    if(this.closestTroopIndex > theTroops.length - 1){
      this.attackState = "calm";
    }
  }

  // checks values when player moves troops around
  doubleCheckMouseLift(){
    // checks if player is lifting troops
    if(doubleCheck === "yes"){
      // resets values
      this.enemyX = width;
      this.enemyY = height;
      this.enemyDistance = width;
      // turns off double check function
      if(millis() > doubleCheckHelper){
        doubleCheck = "no";
      }
    }
  }

  move(){
    // normal state
    if(this.attackState === "calm" && this.x < width){
      this.x += this.speed;
    }
    if(this.attackState === "agitated" && this.x < width && theTroops.length - 1 >= this.closestTroopIndex){
      if(this.enemyX > this.x){
        this.x += this.speed;
      }
      if(this.enemyY > this.y){
        this.y += this.speed;
      }
      if(this.enemyY < this.y){
        this.y -= this.speed;
      }
      if(this.enemyX < this.x){
        this.x -= this.speed;
      }
    }
    // makes sure the enemies are in agitation range
    if (this.enemyDistance > this.agitationRange){
      this.attackState = "calm";
    }
  }


  // makes zombies groan every so often
  soundEffects(){
    if(frameCount%Math.round(random(12, 36)*10) === 0){
      // plays sound effect
      zombieGroan.play();
    }
  }

  // temporary code meant to see what the zombies are targeting
  target(pointsArray){
    for(let otherPoint of pointsArray){
      let pointDistance = dist(this.x, this.y, otherPoint.x, otherPoint.y);
      if(pointDistance < this.agitationRange){
        stroke("green");
        line(this.x, this.y, otherPoint.x, otherPoint.y);
      }
      
    }
  }

}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  // carries out functions needed to control the troops
  // spawnEnemies();
  buyTroops();
  for(let troops of theTroops){
    // shows the troops
    troops.display();
    // lets troops attack enemies
    troops.attackTroops(theEnemies);
    // lets you move the troops around with your mouse
    troops.mouseMove();
    // checks to see if you're allowed to move the troops
    troops.mouseMoveSetup();
    // currently out of order
    troops.spaceOut(theTroops);
  }
  // carries out functions needed to control the enemies
  for(let enemy of theEnemies){
    // shows the enemy
    enemy.display();
    // lets the enemies attack the troops
    enemy.attackTroops(theTroops);
    // targets the troops for the enemies
    enemy.seeTroops(theTroops);
    // moves troops
    enemy.move();
    // shows what troops the enemy is looking at, will remove later
    enemy.target(theTroops);
    // checks if troops are close enough to cause agitation
    enemy.agitation(theTroops);
    // makes sound effects
    enemy.soundEffects();
    // resets values in case the player moves their troops around
    enemy.doubleCheckMouseLift();
  }
  // gets rid of dead enemies/troops
  killTheDead();
}

// gets rid of dead troops/enemies
function killTheDead(){
  // looks through all enemies
  for(let i = theEnemies.length - 1; i >= 0; i --){
    // checks to see if the enemies still have health
    if(theEnemies[i].health <= 0){
      // add enemy coins to purse
      coins += theEnemies[i].coin;
      // gets rid of enemy
      theEnemies.splice(i, 1);
    }
  }
  // looks through all troops
  for(let j = theTroops.length - 1; j >= 0; j --){
    // checks to see if troops still have health
    if(theTroops[j].health <= 0){
      // kills troops without health
      theTroops.splice(j, 1);
    }
  }
}

function mousePressed(){
  // spawns troops
  if(keyIsDown(90)){
    let someTroop = new SwordTroop(mouseX, mouseY);
    theTroops.push(someTroop);
    coins -= SWORDCOST;
  }
  if(keyIsDown(68)){
    let someTroop = new SpearMan(mouseX, mouseY);
    theTroops.push(someTroop);
    coins -= SPEARCOST;
  }
  // spawns enemies(not intended as a feature will be removed and replaced with spawn enemies function)
  if(keyIsDown(67)){
    let someEnemy = new Zombie(mouseX, mouseY);
    theEnemies.push(someEnemy);
  }
}


// will eventually spawn enemies in waves based on difficulty
function spawnEnemies(){
  // makes sure all previous enemies are dead
  if(theEnemies.length < 1){
    // adds enemies based on the danger score
    for(let q = dangerScore; q > 0; q -= ZOMBIEDANGER){
      let someEnemy = new Zombie(30 + random(-30, 30), random(30, height - 30));
      theEnemies.push(someEnemy);
    }
    // increases danger score for next round
    dangerScore += Math.round(random(2,4))*10;
    // increases the round number
    roundCounter ++;
    console.log(theEnemies.length);
  }
}


function keyPressed(){
  if(key === "x"){
    theTroops.splice(0,1);
  }
}

function buyTroops(){
  rectMode(CENTER);
  fill("red");
  rect(width - width/10, 0 + height/8, width/24, height/12);
  rect(width - (width/12 - width/ 46), 0 + height/8, width/24, height/12);
}