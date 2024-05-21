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
    this.health = 500000;
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

  seeTroops(trooper){ 

    // if(frameCount%5 === 0 && trooper.length > 0){
    //   //for
    //   this.closestTroop = this.enemyDistance;
    //   this.closestTroopIndex = 0;
    // }
    for(let target = trooper.length - 1; target >= 0; target --){
      this.enemyDistance = dist(this.x, this.y, theTroops[target].x, theTroops[target].y);
      if(this.enemyDistance < this.closestTroop){
        this.closestTroop = this.enemyDistance;
        this.closestTroopIndex = target;
        console.log(this.closestTroop);
      }
    }
  }

  agitation(theTroops){
    for(let target = theTroops.length - 1; target >= 0; target --){
      this.enemyDistance = dist(this.x, this.y, theTroops[target].x, theTroops[target].y);
      if(this.enemyDistance < this.agitationRange){
        this.attackState = "agitated";
      }
      else{
        this.attackState = "calm";
      }
    }
  }

  move(){
    // normal state
    if(this.attackState === "calm" && this.x < width){
      this.x += this.speed;
    }
    // if(this.attackState === "agitated" && this.x < width && theTroops.length - 1 >= this.closestTroopIndex){
    //   if(theTroops[this.closestTroopIndex].x > this.x){
    //     this.x += this.speed;
    //   }
    //   if(theTroops[this.closestTroopIndex].y > this.y){
    //     this.y += this.speed;
    //   }
    //   if(theTroops[this.closestTroopIndex].y < this.y){
    //     this.y -= this.speed;
    //   }
    //   if(theTroops[this.closestTroopIndex].x < this.x){
    //     this.x -= this.speed;
    //   }
    // }
    // makes sure the enemies are in agitation range
    if (this.enemyDistance > this.agitationRange){
      this.attackState = "calm";
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
    troops.display();
    troops.attackTroops(theEnemies);
    troops.mouseMove();
    troops.mouseMoveSetup();
  }
  // carries out functions needed to control the enemies
  for(let enemy of theEnemies){
    
    // enemy.display();
    // enemy.attackTroops(theTroops);
    // enemy.seeTroops(theTroops);
    // enemy.move();
    // enemy.target(theTroops);
    // meant to test responses to certatin situations, key needs to be pressed to carry out functions
    if(keyIsDown(65)){
      enemy.display();
      enemy.attackTroops(theTroops);
      enemy.move();
      enemy.target(theTroops);
      enemy.seeTroops(theTroops);
      // enemy.agitation(theTroops);
    }
    else{
      enemy.attackState = "stop";
    }
    if(theTroops.length === 0){
      enemy.attackState = "calm";
    }
    // console.log(enemy.health);
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


// // checks to see if troops are close enough to draw attention
// seeTroops(trooper){
//   // examines all of the troops
//   for(let target = trooper.length - 1; target >= 0; target --){
//     // checks to see how close the enemies are
//     this.enemyDistance = dist(this.x, this.y, theTroops[target].x, theTroops[target].y);
//     // checks to see if the troops are close to draw attention
//     if(this.enemyDistance < this.agitationRange){
//       // sets zombie to attack mode
//       this.attackState = "agitated";
//     }
//     // resets aggresion once the zombies have killed a troop
//     if(theTroops.length - 1 < this.closestTroopIndex){
//       this.attackState = "calm";
//       this.closestTroop = width;
//     }
//   }
// }

// seeTargets(theTroops){
//   for(let target = theTroops.length - 1; target >= 0; target --){
//     this.enemyDistance = dist(this.x, this.y, theTroops[target].x, theTroops[target].y);
      
      
//   }
// }
  