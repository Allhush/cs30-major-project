// Major Project
// Alliam Hushagen
// Wednesday May 1st 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class SwordTroop{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.health = 100;
    this.damage = 50;
    this.height = 5;
    this.width = 3;
    this.cost = 20;
    this.colour = "black";
  }

  display(){
    noStroke();
    fill(this.colour);
    rect(this.x, this.y, this.width, this.height);
  }

  // attackEnemy(){

  // }
}

class Zombie{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.health = 50;
    this.damage = 10;
    this.speed = 20;
    this.height = 5;
    this.width = 3;
    this.colour = "green";
    this.coin = 5;
  }

  display(){
    noStroke();
    fill(this.colour);
    rect(this.x, this.y, this.width, this.height);
  }

  // attackTroops(){

  // }

}

let theTroops = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
}

function mousePressed(){
  if(keyIsDown(90)){
    let someTroop = new SwordTroop(mouseX, mouseY);
    theTroops.push(someTroop);
  }
  if(keyIsDown(88)){
    
  }
}