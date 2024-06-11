// Major Project
// Alliam Hushagen
// Wednesday May 1st 2024
//
// Extra for Experts:
// the targeting system(it took forever)

// cost of sword troop
const SWORDCOST = 20;
// zombie danger value
const ZOMBIEDANGER = 10;
// cost of a spear troop
const SPEARCOST = 30;
// skeleton danger value
const SKELEDANGER = 20;
// healer cost
const HEALCOST = 25;

// holds all of the troops bought by the player
let theTroops = [];
// hold all of the enemies that spawn
let theEnemies = [];
// holds the coins the player uses to buy troops
let coins = 300;
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
// tells the game what it should display
let gameState = "start";
// checks to see if the troops are being moved around
let lifted = false;
// makes sure you can't spam pause and unpause
let q = 0;
// keeps track of how many zombie should be spawned each round
let roundDanger;
// used to make sound for skeletons
let skeleClink;
// used to make sound for speartroops
let spearSound;
// used to display troops and enemies
let swordImage;
let spearImage;
let zombieImage;
let skeleImage;
let swordImage2;
let spearImage2;
let zombieImage2;
let skeleImage2;
let healerImage;
let healerImage2;
let zombieOWImage;
let skeleOWImage;
let swordOWImage;
let spearOWImage;
let bossImage;
let bossImageOW;
let bossImage2;
let bossImage2OW;
// used in pause state so player can see different things
let seeState = "main";
// used to time healer animation
let healtime = 0;
// used to make boss animation
let bossAttack = 0;
// decides how many bosses to spawn
let bossCount = 1;

function preload(){
  swordSlash = loadSound("Assets/soundEffects/sword-slash-and-swing-185432.mp3");
  zombieGroan = loadSound("Assets/soundEffects/zombie.mp3.mp3");
  skeleClink = loadSound("Assets/soundEffects/bones-2-88481.mp3");
  spearSound = loadSound("Assets/soundEffects/spear.mp3");
  swordImage = loadImage("Assets/Images/Sword1.png");
  // swordImage2 = loadImage("Assets/Images/Sword2.png");
  spearImage = loadImage("Assets/Images/Spear1.png");
  // spearImage2 = loadImage("Assets/Images/Spear2.png");
  zombieImage = loadImage("Assets/Images/Zombie1.png");
  // zombieImage2 = loadImage("Assets/Images/Zombie2.png");
  skeleImage = loadImage("Assets/Images/Skeleton1.png");
  // skeleImage2 = loadImage("Assets/Images/Skeleton2.png");
  healerImage = loadImage("Assets/Images/Healer1.png");
  healerImage2 = loadImage("Assets/Images/Healer2.png");
  zombieOWImage = loadImage("Assets/Images/zombie1OW.png");
  skeleOWImage = loadImage("Assets/Images/skeleton1OW.png");
  swordOWImage = loadImage("Assets/Images/sword1OW.png");
  spearOWImage = loadImage("Assets/Images/spear1OW.png");
  bossImage = loadImage("Assets/Images/Boss1a.png");
  bossImageOW = loadImage("Assets/Images/Boss1aOW.png");
  bossImage2 = loadImage("Assets/Images/Boss2a.png");
  bossImage2OW = loadImage("Assets/Images/Boss2aOW.png");
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
    this.health = 60;
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
    this.space = 20;
    this.enemyCount = 0;
    this.enemyX = width;
    this.enemyY = height;
  }

  // displays the troop
  display(){
    noStroke();
    // creates health bar
    fill(this.colour);
    rectMode(CENTER);
    rect(this.x, this.y - this.height + 15, this.health/2, 3);
    // centers troop
    imageMode(CENTER);
    // places troop at correct position with correct height and length
    image(swordImage,this.x, this.y, 30, 30);
  }

  // lets troops attack enemies
  attackTroops(theEnemies){
    // goes through all the enemies
    for(let target of theEnemies){
      // checks range
      let enemyDistance = dist(this.x, this.y, target.x, target.y);
      // attacks enemies
      if(enemyDistance < this.range && frameCount%60 === 0){
        if(this.enemyCount <= 2){
          target.health -= this.damage;
          console.log("damage1");
        }
        else if(this.enemyCount < 5){
          target.health -= this.damage/2;
          console.log("damage2");
        }
        else{
          target.health -= this.damage/5;
          console.log("damage3");
        }
        // plays sound effect
        if(target.health < 10){
          this.enemyCount --;
        }
        swordSlash.play();
      }
    }
  }

  mouseMoveSetup(){
    // checks values to see if the player is trying to move
    if(mouseX > this.x - this.width/2  && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2 && mouseIsPressed && keyIsDown(90) === false){
      // moves the troop around
      this.liftState = true;
      doubleCheck = "yes";
      doubleCheckHelper = millis() + this.delay;
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

  // makes sure you can't stack troops on top of one another
  spaceOut(trooper){
    // goes through all the troops
    for(let i = trooper.length - 1; i >= 0; i--){
      // makes sure the troop cannot target itself
      if(this !== trooper[i] && trooper.length > 1 && lifted){
        // checks the distance of the troops
        if(dist(this.x, this.y, trooper[i].x, trooper[i].y) - 15 < this.space){
          // moves troops away if they are too close
          if(this.x - trooper[i].x < this.space){
            trooper[i].x += this.space;
          }
          if(this.x - trooper[i].x > this.space){
            trooper[i].x -= this.space;
          }
          if(this.y - trooper[i].y < this.space){
            trooper[i].y += this.space;
          }
          if(this.y - trooper[i].y > this.space){
            trooper[i].y -= this.space;
          }
          if(this.x === trooper[i].x){
            trooper[i].x += this.space;
          }
        }
      }
    }
  }

  boundsCheck(){
    if(this.x > width){
      this.x -= 10;
    }
    if(this.x < 0){
      this.x +=10;
    }
    if(this.y > height){
      this.y -= 10;
    }
    if(this.y < 0){
      this.y +=10;
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
    this.health = 51;
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
    this.space = 20;
    // all of these are used to identify the closest troop so it can't one shot everything
    this.enemyX = width;
    this.enemyY = height;
    this.enemyDistance;
    this.closestTroopIndex = -1;
    this.enemyNumbers = 0;
    this.enemyCount = 0;
  }

  // displays the troop
  display(){
    noStroke();
    // centers troop
    imageMode(CENTER);
    // creates health bar
    fill(this.colour);
    rectMode(CENTER);
    rect(this.x, this.y - this.height + 15, this.health/2, 3);
    // places troop at correct position with correct height and length
    image(spearImage,this.x, this.y, this.width, this.height);
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
      spearSound.play();
      // console.log("damaging");
      this.closestTroopIndex = -1;
    }
    else if(enemyDistance <= this.range2 && frameCount%60 === 0 && this.closestTroopIndex < theEnemies.length){
      theEnemies[this.closestTroopIndex].health -= 5;
      // plays sound effect
      spearSound.play();
      // console.log("damaging2");
    }
  }

  // checks if the player is trying to move the troops
  mouseMoveSetup(){
    // checks values to see if the player is trying to move
    if(mouseX > this.x - this.width/2  && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2 && mouseIsPressed && keyIsDown(68) === false){
      // moves the troop around
      this.liftState = true;
      doubleCheck = "yes";
      doubleCheckHelper = millis() + this.delay;
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

  boundsCheck(){
    if(this.x > width){
      this.x -= 10;
    }
    if(this.x < 0){
      this.x +=10;
    }
    if(this.y > height){
      this.y -= 10;
    }
    if(this.y < 0){
      this.y +=10;
    }
  }

  // makes sure you can't stack troops on top of one another
  spaceOut(trooper){
    // goes through all the troops
    for(let i = trooper.length - 1; i >= 0; i--){
      // makes sure the troop cannot target itself
      if(this !== trooper[i] && trooper.length > 1 && lifted){
        // checks the distance of the troops
        if(dist(this.x, this.y, trooper[i].x, trooper[i].y) - 15 < this.space){
          // moves troops away if they are too close
          if(this.x - trooper[i].x < this.space){
            trooper[i].x += this.space;
          }
          if(this.x - trooper[i].x > this.space){
            trooper[i].x -= this.space;
          }
          if(this.y - trooper[i].y < this.space){
            trooper[i].y += this.space;
          }
          if(this.y - trooper[i].y > this.space){
            trooper[i].y -= this.space;
          }
          if(this.x === trooper[i].x){
            trooper[i].x += this.space;
          }
        }
      }
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
    this.coin = Math.round(random(6, 10));
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
    // helps with sowrd damage drop off
    this.counter = true;
  }

  // displays zombies
  display(){
    noStroke();
    imageMode(CENTER);
    fill(this.colour);
    if(this.x - this.enemyX < 0 && this.enemyDistance < this.agitationRange){
      image(zombieImage,this.x, this.y, this.width, this.height);
    }
    else if(this.x - this.enemyX > 0 && this.enemyDistance < this.agitationRange){
      image(zombieOWImage, this.x, this.y, this.width, this.height); 
    }
    else{
      image(zombieImage,this.x, this.y, this.width, this.height);
    }
    
    // creates health bar
    fill(this.colour);
    rectMode(CENTER);
    rect(this.x, this.y - this.height + 15, this.health/2, 3);
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
        // tells zombie it can count to enemy damage drop off again
        this.counter = true;
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
      if(dist(this.x, this.y, this.enemyX, this.enemyY) < this.agitation && this.counter){
        theTroops[this.closestTroopIndex].enemyCount ++;
        this.counter = false;
        console.log("yes");
      }
    }
    // makes sure the enemies are in agitation range
    if (this.enemyDistance > this.agitationRange){
      this.attackState = "calm";
    }
  }


  // makes zombies groan every so often
  soundEffects(){
    if(frameCount%Math.round(random(60, 120)*10) === 0){
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

class Skeleton{
  constructor(x,y){
    // almost identacle to swordTroop definitions, look above to see
    this.x = x;
    this.y = y;
    this.health = 40;
    this.damage = 26;
    this.speed = 2;
    this.height = 30;
    this.width = 30;
    this.colour = "white";
    // how many coins the zombie gives on death
    this.coin = Math.round(random(8, 12));
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
    this.spearCheck = true;
  }

  // displays skeleton
  display(){
    noStroke();
    imageMode(CENTER);
    fill(this.colour);
    if(this.x - this.enemyX < 0 && this.enemyDistance < this.agitationRange){
      image(skeleImage,this.x, this.y, this.width, this.height);
    }
    else if(this.x - this.enemyX > 0 && this.enemyDistance < this.agitationRange){
      image(skeleOWImage, this.x, this.y, this.width, this.height); 
    }
    else{
      image(skeleImage,this.x, this.y, this.width, this.height);
    }
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
      if(this.enemyDistance < this.range && frameCount%40 === 0){
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
      }
      else{
        // resets circuit to see if another troop is closer
        this.enemyNumbers = theTroops.length;
      } 
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
    if(frameCount%Math.round(random(60, 120)*10) === 0){
      // plays sound effect
      skeleClink.play();
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

class BossMonster{
  constructor(x,y){
    this.identify = "BossMonster";
    this.x = x;
    this.y = y;
    this.health = 500;
    this.damage = 50;
    this.speed = 1;
    this.width = 50;
    this.height = 50;
    this.coin = 200;
    this.colour = "yellow";
    this.range = 30;
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
    this.knockback = 50;
    this.attacking = "false";
  }

  // displays boss
  display(){
    noStroke();
    imageMode(CENTER);
    if(this.attacking === "false"){
      if(this.x - this.enemyX < 0 && this.enemyDistance < this.agitationRange){
        image(bossImage,this.x, this.y, this.width, this.height);
      }
      else if(this.x - this.enemyX > 0 && this.enemyDistance < this.agitationRange){
        image(bossImageOW, this.x, this.y, this.width, this.height); 
      }
      else{
        image(bossImage,this.x, this.y, this.width, this.height);
      }
    }
    else if(this.attacking === "true"){
      if(this.x - this.enemyX < 0 && this.enemyDistance < this.agitationRange){
        image(bossImage2,this.x, this.y, this.width, this.height);
      }
      else if(this.x - this.enemyX > 0 && this.enemyDistance < this.agitationRange){
        image(bossImage2OW, this.x, this.y, this.width, this.height); 
      }
      else{
        image(bossImage2,this.x, this.y, this.width, this.height);
      }
      if(millis() > bossAttack){
        this.attacking = "false";
      }
    }
  }

  attackTroops(theTroops){
    for(let target of theTroops){
      // checks of the troop is close enough to attack
      this.enemyDistance = dist(this.x, this.y, target.x, target.y);
      if(this.enemyDistance < this.range && frameCount%30 === 0){
        if(millis() > bossAttack){
          this.attacking = "true";
          bossAttack = millis() + 500;
        }
        // does damage to the enemy
        target.health -= this.damage;
        // does knockback to enemy
        if(target.x > this.x){
          target.x += this.knockback;
          this.enemyX = width;
          this.enemyY = height;
        }
        else if(target.x < this.x){
          target.x -= this.knockback;
          this.enemyX = width;
          this.enemyY = height;
        }
        if(target.y > this.y){
          target.y += this.knockback;
          this.enemyX = width;
          this.enemyY = height;
        }
        else if(target.y < this.y){
          target.y -= this.knockback;
          this.enemyX = width;
          this.enemyY = height;
        }
        if(target.x === this.x){
          if(random(2) > 1){
            target.x += this.knockback;
          }
          else{
            target.x -= this.knockback;
          }
          this.enemyX = width;
          this.enemyY = height;
        }
        if(target.y === this.y){
          if(random(2) > 1){
            target.y += this.knockback;
          }
          else{
            target.y -= this.knockback;
          }
          this.enemyX = width;
          this.enemyY = height;
        }
      }
    }
  }

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
    // moves enemy to closest target to attack them
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

  // test code
  target(pointsArray){
    for(let otherPoint of pointsArray){
      let pointDistance = dist(this.x, this.y, otherPoint.x, otherPoint.y);
      if(pointDistance < this.agitationRange){
        stroke("green");
        line(this.x, this.y, otherPoint.x, otherPoint.y);
      }
      
    }
  }

  // te,porary sound effect, will change later
  soundEffects(){
    if(frameCount%Math.round(random(60, 120)*10) === 0){
      // plays sound effect
      zombieGroan.play();
    }
  }

}

class Healer{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.health = 100;
    this.damage = 0;
    this.height = 30;
    this.width = 30;
    this.identify = "heal";
    this.colour = "brown";
    this.healRange = 100;
    this.healthPlus = 10;
    this.liftState = false;
    this.space = 20;
    this.animationState = 1;
    this.animation2 = "false";
  }
  display(){
    noStroke();
    imageMode(CENTER);
    fill(100, 200, 75, 50);
    circle(this.x, this.y, this.healRange);
    if(this.animation2 === "false"){
      image(healerImage, this.x, this.y, this.width, this.height);
    }
    else if(this.animation2 === "true"){
      image(healerImage2, this.x, this.y, this.width, this.height);
    }
    // creates health bar
    fill(this.colour);
    rectMode(CENTER);
    rect(this.x, this.y - this.height + 15, this.health/3, 3);
  }
  heal(theTroops){
    for(let troop of theTroops){
      let healDistance = dist(this.x, this.y, troop.x, troop.y);
      if(healDistance < this.healRange && theEnemies.length > 1 && frameCount%60 === 0){
        if(troop.identify === "spear" && troop.health <= 51){
          troop.health += this.healthPlus;
          if(this.animationState === 1 && millis() > healtime){
            this.animation2 = "true";
            healtime = millis() + 1000;
            this.animationState = 2;
          }
        }
        else if(troop.identify === "sword" && troop.health <= 60){
          troop.health += this.healthPlus;
          if(this.animationState === 1 && millis() > healtime){
            this.animation2 = "true";
            healtime = millis() + 1000;
            this.animationState = 2;
          }
        }
      }
    }
    if(healtime < millis()){
      this.animation2 = "false";
      this.animationState = 1;
    }
  }

  // checks if the player is trying to move the troops
  mouseMoveSetup(){
    // checks values to see if the player is trying to move
    if(mouseX > this.x - this.width/2  && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2 && mouseIsPressed && keyIsDown(68) === false){
      // moves the troop around
      this.liftState = true;
      doubleCheck = "yes";
      doubleCheckHelper = millis() + this.delay;
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

  // makes sure the troop is in the bounds
  boundsCheck(){
    if(this.x > width){
      this.x -= 10;
    }
    if(this.x < 0){
      this.x +=10;
    }
    if(this.y > height){
      this.y -= 10;
    }
    if(this.y < 0){
      this.y +=10;
    }
  }

  // makes sure you can't stack troops on top of one another
  spaceOut(trooper){
    // goes through all the troops
    for(let i = trooper.length - 1; i >= 0; i--){
      // makes sure the troop cannot target itself
      if(this !== trooper[i] && trooper.length > 1 && lifted){
        // checks the distance of the troops
        if(dist(this.x, this.y, trooper[i].x, trooper[i].y) - 15 < this.space){
          // moves troops away if they are too close
          if(this.x - trooper[i].x < this.space){
            trooper[i].x += this.space;
          }
          if(this.x - trooper[i].x > this.space){
            trooper[i].x -= this.space;
          }
          if(this.y - trooper[i].y < this.space){
            trooper[i].y += this.space;
          }
          if(this.y - trooper[i].y > this.space){
            trooper[i].y -= this.space;
          }
          if(this.x === trooper[i].x){
            trooper[i].x += this.space;
          }
        }
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  pause();
  // carries out functions needed to control the troops
  for(let troops of theTroops){
    if(gameState === "pause" || gameState === "go"){
      // shows the troops
      troops.display();
      // makes sure you can't force troops out of bounds
      troops.boundsCheck();
    }
    if(gameState === "go"){
      // lets you move the troops around with your mouse
      troops.mouseMove();
      // checks to see if you're allowed to move the troops
      troops.mouseMoveSetup();
      // makes sure the troops don't stack
      troops.spaceOut(theTroops);
      if(troops.identify === "spear" || troops.identify === "sword"){
        // lets troops attack enemies
        troops.attackTroops(theEnemies);
      }
      else{
        troops.heal(theTroops);
      }
    }
  }
  // carries out functions needed to control the enemies
  for(let enemy of theEnemies){
    if(gameState === "pause" || gameState === "go"){
      // shows the enemy
      enemy.display();
    }
    if(gameState === "go"){
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
  }
  if(gameState === "pause" || gameState === "go"){
    // lets you buy troops
    buyTroops();
    // gets rid of dead enemies/troops
    killTheDead();
    // spawns troops
    spawnEnemies();
    // ends game if you die
    theEndAndTheDeath();
  }

}

// gets rid of dead troops/enemies
function killTheDead(){
  // looks through all enemies
  for(let i = theEnemies.length - 1; i >= 0; i --){
    // checks to see if the enemies still have health
    if(theEnemies[i].health <= 0){
      if(roundCounter <= 3){
        // add enemy coins to purse
        coins += theEnemies[i].coin;
      }
      else if(roundCounter <= 5 || theEnemies[i].identify === "BossMonster"){
        coins += Math.round(theEnemies[i].coin/2);
      }
      else if (roundCounter <= 10){
        coins += 5;
      }
      else{
        coins +=2;
      }
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
  if(gameState === "go"){
    if(coins >= 20){
      if(keyIsDown(90)){
        let someTroop = new SwordTroop(mouseX, mouseY);
        theTroops.push(someTroop);
        coins -= SWORDCOST;
      }
    }
    if(coins >= 30){
      if(keyIsDown(68)){
        let someTroop = new SpearMan(mouseX, mouseY);
        theTroops.push(someTroop);
        coins -= SPEARCOST;
      }
    }
    if(coins >=25){
      if(keyIsDown(72)){
        let someTroop = new Healer(mouseX, mouseY);
        theTroops.push(someTroop);
        coins -= HEALCOST;
      }
    }
  }
  // spawns enemies(not intended as a feature will be removed and replaced with spawn enemies function) to be used in testing
  if(keyIsDown(67)){
    let someEnemy = new Zombie(mouseX, mouseY);
    theEnemies.push(someEnemy);
  }


  if(keyIsDown(65)){
    let someEnemy = new Skeleton(mouseX, mouseY);
    theEnemies.push(someEnemy);
  }

  if(keyIsDown(66)){
    let someEnemy = new BossMonster(mouseX, mouseY);
    theEnemies.push(someEnemy);
  }
}


// spanws enemys to fight against
function spawnEnemies(){
  let roundDanger = dangerScore;
  // tells player how to spawn next wave
  if(theEnemies.length < 1){
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Press Q to spawn next wave", width/2, height/2);
  }
  // spawns new enemies if the player starts the bext wave
  if(theEnemies.length < 1 && keyIsDown(81)){
    // increases the round number
    roundCounter ++;
    // adds enemies based on the danger score
    while(roundDanger > 0){
      if(roundCounter > 1){
        let z = random(100);
        if(z > 50){
          let someEnemy = new Zombie(30 + random(-30, 30), random(30, height - 30));
          theEnemies.push(someEnemy);
          roundDanger  -= ZOMBIEDANGER;
        }
        else{
          let someEnemy = new Skeleton(30 + random(-30, 30), random(30, height - 30));
          theEnemies.push(someEnemy);
          roundDanger -= SKELEDANGER;
        }
      }
      else if(roundCounter > 2){
        let z = random(100);
        if(z > 33){
          let someEnemy = new Zombie(30 + random(-30, 30), random(30, height - 30));
          theEnemies.push(someEnemy);
          roundDanger  -= ZOMBIEDANGER;
        }
        else{
          let someEnemy = new Skeleton(30 + random(-30, 30), random(30, height - 30));
          theEnemies.push(someEnemy);
          roundDanger -= SKELEDANGER;
        }
      }
      else{
        let someEnemy = new Zombie(30 + random(-30, 30), random(30, height - 30));
        theEnemies.push(someEnemy);
        roundDanger  -= ZOMBIEDANGER;
      }
    }
    // spawns bosses every 5 rounds 
    if(roundCounter%5 ===0 && roundCounter > 1){
      for(let i = bossCount; i > 0; i--){
        let someEnemy = new BossMonster(30 + random(-30, 30), random(30, height - 30));
        theEnemies.push(someEnemy);
      }
      bossCount ++;
    }
    // increases danger score for next round
    dangerScore += Math.round(random(3,7))*10*roundCounter;
    console.log(theEnemies.length);
  }
}

// old code that was meant to test targeting system
function keyPressed(){
  // was meant for testing, is no longer useful, will remove later
  // if(key === "x"){
  //   theTroops.splice(0,1);
  // }
}

// not actually what functions says, instead displays the amount of coins you have
function buyTroops(){
  fill("black");
  textAlign(CENTER, CENTER);
  textSize(15);
  text("You have " + coins +" coins", width/2, height/30);
  text("Round: " + roundCounter, width/2 + width/4, height/30);
}

// lets the player pause the game
function pause(){
  // makes sure the player can actually pause the game and can't spam it
  if(keyIsDown(80) && gameState === "go" && millis() > q){
    gameState = "pause";
    q = millis() + 500;
  }
  else if(keyIsDown(80) && gameState === "pause" && millis() > q){
    gameState = "go";
    q = millis() + 500;
  }
  // displays pause text so that the player knows what the game is about
  if(gameState === "pause"){
    if(seeState === "main"){
      textAlign(CENTER, CENTER);
      textSize(30);
      fill("red");
      textSize(15);
      text("Press Z to learn about sword troop, press D to learn about spear troop, press H to learn about the healer", width/2, height/2 + height/10);
      text("If you press and hold one one the troops with your mouse you can move them around", width/2, height/2 + height/7.5);
      text("Don't let the enemies touch the right wall, you lose if they do", width/2, height/2 + height/15);
      text("Your coins are displayed at the top of the screen you get more by killing enemies, and can use them to buy troops", width/2, height/2 +height/10 +height/15);
      text("Press P to unpause", width/2, height/2 + height/5);
    }
    if(keyIsDown(90) && seeState === "main" && millis() > q){ // sword troop
      seeState = "sword";
      q = millis() + 500;
    }
    else if(keyIsDown(68) && seeState === "main" && millis() > q){ // spear troop
      seeState = "spear";
      q = millis() + 500;
    }
    else if(keyIsDown(72) && seeState === "main" && millis() > q){ // healer
      seeState = "healer";
      q = millis() + 500;
    }
    if(seeState === "sword"){
      textSize(15);
      fill("red");
      text("The sword troop is short range melee troop, costing 20 coins. Press the mouse and Z to spawn a sword troop.", width/2, height/2 + height/10);
      text("Press Z to return to main pause menu", width/2, height/2 + height/7.5);
      if(keyIsDown(90) && millis() > q){
        seeState = "main";
        q = millis() + 500;
      }
    }
    if(seeState === "spear"){
      textSize(15);
      fill("red");
      text("The spear troop is mid range melee troop doing less damage at close range, costing 30 coins. Press the mouse and D to spawn a spear troop.", width/2, height/2 + height/10);
      text("Press D to return to main pause menu", width/2, height/2 + height/7.5);
      if(keyIsDown(68) && millis() > q){
        seeState = "main";
        q = millis() + 500;
      }
    }
    if(seeState === "healer"){
      textSize(15);
      fill("red");
      text("The healer troop does not do damage but does heal troops in its healing aura. Press the mouse and H to spawn a healer.", width/2, height/2 + height/10);
      text("Press H to return to main pause menu", width/2, height/2 + height/7.5);
      if(keyIsDown(72) && millis() > q){
        seeState = "main";
        q = millis() + 500;
      }
    }
  }
  // tells the player how to pause and what they can see in the pause menu
  if(gameState === "go"){
    textAlign(LEFT, CENTER);
    textSize(15);
    fill(0);
    text("Press P to pause the game and see the controls", 0, height/30);
  }
  // starts the game
  if((gameState === "start" || gameState === "over") && keyIsDown(71)){
    gameState = "go";
  }
  // start screen 
  if(gameState === "start"){
    textAlign(CENTER, CENTER);
    textSize(30);
    fill(0);
    text("press G to start", width/2, height/2);
  }

  if(gameState === "over"){
    textAlign(CENTER, CENTER);
    textSize(30);
    fill(0);
    text("You died, press G to restart.", width/2, height/2);
  }
}

function theEndAndTheDeath(){
  for(let enemy of theEnemies){
    if(enemy.x >= width){
      gameState = "over";
    }
  }
  if(gameState === "over"){
    theEnemies.splice(0, theEnemies.length);
    theTroops.splice(0,theTroops.length);
    coins = 300;
    roundCounter = 0;
    dangerScore = 100;
  }
  if(keyIsDown(71)){
    gameState = "go";
  }
}