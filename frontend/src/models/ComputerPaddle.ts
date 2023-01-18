import Entity from "./Entity"
import type Ball from "./Ball"

export default class ComputerPaddle extends Entity{
	
	private speed:number = 5;
	
	constructor(w:number,h:number,x:number,y:number){
		super(w,h,x,y);        
	}
	
	update(ball:Ball, canvas: any) { 
	
		//chase ball
		if(ball.y < this.y && ball.xVel == 1){
				this.yVel = -1; 
				
				if(this.y <= 20){
					this.yVel = 0;
				}
		}
		else if(ball.y > this.y + this.height && ball.xVel == 1){
			this.yVel = 1;
			
			if(this.y + this.height >= canvas.height - 20){
				this.yVel = 0;
			}
		}
		else{
			this.yVel = 0;
		}
		
		this.y += this.yVel * this.speed;
	}
}
