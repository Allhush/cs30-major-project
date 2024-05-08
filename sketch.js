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
      let enemyDistance = dist(this.x, this.y, target.x, target.y);
      if(enemyDistance < this.range && frameCount%10 === 0){
        target.health -= this.damage;
      }
    }
  }

  move(){
    if(this.attackState === "calm" && this.x < width){
      this.x += this.speed;
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
  }
  for(let enemy of theEnemies){
    enemy.display();
    enemy.attackTroops(theTroops);
    enemy.move();
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