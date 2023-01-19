export default class Entity{
	width: number;
	height: number;
	x: number;
	y: number;
	xVel: number = 0;
	yVel: number = 0;
	constructor(w: number, h: number, x: number, y: number){       
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
	}
	draw(context: any){
		context.fillStyle = "#AC4018";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}