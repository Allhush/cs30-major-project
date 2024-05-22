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
let zombieGroan

function preload(){
  swordSlash = loadSound("Assets/soundEffects/sword-slash-and-swing-185432.mp3");
  zombieGroan = loadSound("Assets/soundEffects/zombie.mp3.mp3")
}

// most basic troop that the player can buy
class SwordTroop{
  constructor(x,y){
    // troops x value
    this.x = x;
    // troops y value
    this.y = y;
    // troops health
    this.health = 200;
    // troops damage
    this.damage = 10;
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
      if(enemyDistance < this.range && frameCount%15 === 0){
        target.health -= this.damage;
        swordSlash.play();
      }
    }
  }

  // checks if the player is trying to move the troops
  mouseMoveSetup(){
    // checks values to see if the player is trying to move
    if(mouseX > this.x - this.width/2  && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2 && mouseIsPressed && keyIsDown(90) === false){
      this.liftState = true;
    }
    else{
      this.liftState = false;
    }
  }

  // moves troops
  mouseMove(){
    if(this.liftState){
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
    this.damage = 50;
    this.speed = 2;
    this.height = 30;
    this.width = 30;
    this.colour = "green";
    this.coin = 5;
    this.range = 20;
    // decideds if there are troops close enough to attack
    this.attackState = "calm";
    // useful later
    this.closestTroop = width;
    // useful later
    this.closestTroopIndex = 0;
    // how close an enemy needs to be to attarct enemy attention
    this.agitationRange = 120;
    // useful later
    this.enemyDistance = width;

    this.enemyX = width;

    this.enemyY = height;

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
      if(this.enemyDistance < this.range && frameCount%30 === 0){
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
        console.log(dist(this.x, this.y, this.enemyX, this.enemyY));
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
    if(frameCount%(Math.round(random(12, 36)*10)) === 0){
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
  for(let troops of theTroops){
    // shows the troops
    troops.display();
    // lets troops attack enemies
    troops.attackTroops(theEnemies);
    // lets you move the troops around with your mouse
    troops.mouseMove();
    // checks to see if you're allowed to move the troops
    troops.mouseMoveSetup();
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
      let someEnemy = new Zombie(30 + random(-10, 10), random(30, height - 30));
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
