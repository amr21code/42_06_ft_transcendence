import Entity from "./Entity"
import Game from "./Game"

enum KeyBindings{
	UP = 38,
	DOWN = 40
}

export default class PlayerPaddle extends Entity{
	
	private speed:number = 5;
	
	constructor(w:number,h:number,x:number,y:number){
		super(w,h,x,y);
	}
	
	update(canvas: any) {
		if (Game.keysPressed[KeyBindings.UP]) {
			this.yVel = -1;
			if (this.y <= 20) {
				this.yVel = 0
			}
		} else if (Game.keysPressed[KeyBindings.DOWN]) {
			this.yVel = 1;
			if (this.y + this.height >= canvas.height - 20){
				this.yVel = 0;
			}
		} else {
			this.yVel = 0;
		}
		
		this.y += this.yVel * this.speed;
	}
}
