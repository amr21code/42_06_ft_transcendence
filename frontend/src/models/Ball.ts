import Entity from "./Entity"
import Game from "./Game"
import PlayerPaddle from "./Paddles"
import ComputerPaddle from "./Paddles"

export default class Ball extends Entity{
	
	private speed:number = 3;
	
	constructor(w:number,h:number,x:number,y:number){
		super(w,h,x,y);
		// var randomDirection = Math.floor(Math.random() * 2) + 1; 
		// if (randomDirection % 2) {
		// 	this.xVel = 1;
		// } else {
		// 	this.xVel = -1;
		// }
		this.xVel = -1;
		this.yVel = 1;
	}
	
	update (player: PlayerPaddle, computer: ComputerPaddle, canvas: any){
	
		//check top canvas bounds
		if(this.y <= 0){
			this.yVel = 1;
		}
		
		//check bottom canvas bounds
		if(this.y + this.height >= canvas.height){
			this.yVel = -1;
		}
		
		//check left canvas bounds
		if(this.x <= 0){  
			this.x = canvas.width / 2 - this.width / 2;
			Game.computerScore += 1;
		}
		
		//check right canvas bounds
		if(this.x + this.width >= canvas.width){
			this.x = canvas.width / 2 - this.width / 2;
			Game.playerScore += 1;
		}
		
		//check player collision
		if (this.x <= player.x + player.width){
			if (this.y >= player.y && this.y <= player.y + player.height){
				this.xVel = 1;
				// player.update(Game.)
			}
		}
		
		//check computer collision
		if(this.x + this.width >= computer.x){
			if(this.y >= computer.y && this.y <= computer.y + computer.height){
				this.xVel = -1;
			}
		}
	
		this.x += this.xVel * this.speed;
		this.y += this.yVel * this.speed;
	}
}