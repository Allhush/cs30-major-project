// Major Project
// Alliam Hushagen
// Wednesday May 1st 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let theTroops = [];
let theEnemies = [];
let coins = 0;


class SwordTroop{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.health = 100;
    this.damage = 10;
    this.height = 30;
    this.width = 30;
    this.cost = 20;
    this.colour = "black";
    this.range = 50;
    this.liftState = false;
  }

  display(){
    noStroke();
    rectMode(CENTER);
    fill(this.colour);
    rect(this.x, this.y, this.width, this.height);
  }

  attackTroops(theEnemies){
    for(let target of theEnemies){
      let enemyDistance = dist(this.x, this.y, target.x, target.y);
      if(enemyDistance < this.range && frameCount%10 === 0){
        target.health -= this.damage;
      }
    }
  }

  mouseMoveSetup(){
    if(mouseX > this.x - this.width/2  && mouseX < this.x + this.width/2 && mouseY > this.y - this.height/2 && mouseY < this.y + this.height/2 && mouseIsPressed && keyIsDown(90) === false){
      this.liftState = true;
    }
    else{
      this.liftState = false;
    }
  }

  mouseMove(){
    if(this.liftState){
      this.x = mouseX;
      this.y = mouseY;
    }
  }

}

class Zombie{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.health = 50;
    this.damage = 10;
    this.speed = 2;
    this.height = 30;
    this.width = 30;
    this.colour = "green";
    this.coin = 5;
    this.range = 20;
    this.attackState = "calm";
    this.closestTroop = width;
    this.closestTroopIndex = 0;
    this.agitationRange = 120;
    this.enemyDistance = width;
  }

  display(){
    noStroke();
    rectMode(CENTER);
    fill(this.colour);
    rect(this.x, this.y, this.width, this.height);
  }

  registerDeath(){
    if(this.health <= 0){
      console.log("I'm dead");
    }
  }

  attackTroops(theTroops){
    for(let target of theTroops){
      this.enemyDistance = dist(this.x, this.y, target.x, target.y);
      if(this.enemyDistance < this.range && frameCount%10 === 0){
        target.health -= this.damage;
      }
    }
  }

  seeTroops(theTroops){
    for(let target = theTroops.length - 1; target >= 0; target --){
      this.enemyDistance = dist(this.x, this.y, theTroops[target].x, theTroops[target].y);
      if(this.enemyDistance < this.agitationRange){
        this.attackState = "agitated";
        if(this.enemyDistance < this.closestTroop){
          this.closestTroop = this.enemyDistance;
          this.closestTroopIndex = target;
        }
      }
      if(theTroops.length - 1 < this.closestTroopIndex){
        this.attackState = "calm";
      }
    }
  }
  
  move(){
    if(this.attackState === "calm" && this.x < width){
      this.x += this.speed;
    }
    if(this.attackState === "agitated" && this.x < width && theTroops.length - 1 >= this.closestTroopIndex){
      if(theTroops[this.closestTroopIndex].x > this.x){
        this.x += this.speed;
      }
      if(theTroops[this.closestTroopIndex].y > this.y){
        this.y += this.speed;
      }
      if(theTroops[this.closestTroopIndex].y < this.y){
        this.y -= this.speed;
      }
      if(theTroops[this.closestTroopIndex].x < this.x){
        this.x -= this.speed;
      }
    }
    if (this.enemyDistance > this.agitationRange){
      this.attackState = "calm";
    }
  }

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
  for(let troops of theTroops){
    troops.display();
    troops.attackTroops(theEnemies);
    troops.mouseMove();
    troops.mouseMoveSetup();
  }
  for(let enemy of theEnemies){
    enemy.display();
    enemy.attackTroops(theTroops);
    enemy.seeTroops(theTroops);
    enemy.move();
    enemy.target(theTroops);
    if(theTroops.length === 0){
      enemy.attackState = "calm";
    }
  }
  killTheDead();
}

function mousePressed(){
  if(keyIsDown(90)){
    let someTroop = new SwordTroop(mouseX, mouseY);
    theTroops.push(someTroop);
  }
  if(keyIsDown(67)){
    let someEnemy = new Zombie(mouseX, mouseY);
    theEnemies.push(someEnemy);
  }
}

function killTheDead(){
  for(let i = theEnemies.length - 1; i >= 0; i --){
    if(theEnemies[i].health <= 0){
      coins += theEnemies[i].coin;
      theEnemies.splice(i, 1);
    }
  }
  for(let j = theTroops.length - 1; j >= 0; j --){
    if(theTroops[j].health <= 0){
      theTroops.splice(j, 1);
    }
  }
}