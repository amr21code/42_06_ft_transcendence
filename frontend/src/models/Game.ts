import Entity from "./Entity"
// import Ball from "./Ball"
// import { PlayerPaddel, ComputerPaddle  from "./Paddles"



export default class Game {
	private gameCanvas: any;
	private gameContext: any;
	public static keysPressed: boolean[] = [];
	public static playerScore: number = 0;
	public static computerScore: number = 0;
	paused: boolean;
	private player1: PlayerPaddle;
	private computerPlayer: ComputerPaddle;
	private ball: Ball;

	constructor(){
		this.paused = false;
		this.gameCanvas = document.getElementById("match-court");
		this.gameContext = this.gameCanvas.getContext("2d");


		// REMOVE BLURRINESS ---------------------------------------------------
		let dpi = window.devicePixelRatio;
		const fix_dpi = () => {
			let styleHeight = +getComputedStyle(this.gameCanvas).getPropertyValue("height").slice(0, -2);
			let styleWidth = +getComputedStyle(this.gameCanvas).getPropertyValue("width").slice(0, -2);
			this.gameCanvas.setAttribute('height', styleHeight * dpi);
			this.gameCanvas.setAttribute('width', styleWidth * dpi);
		}
		fix_dpi();
		// REMOVE BLURRINESS END ---------------------------------------------------
		

		window.addEventListener("keydown",function(e){
			Game.keysPressed[e.which] = true;
			console.log("Key down pressed");
		});
		
		window.addEventListener("keyup",function(e){
			Game.keysPressed[e.which] = false;
		});

		// remove default arrow scrolling
		window.addEventListener("keydown", function(e) {
			if(["Space", "ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
				e.preventDefault();
			}
		}, false);

		// pause game, if "SPACE" is clicked
		// this.$refs.matchCourtRef.querySelector('#match-court').addEventListener('keydown', (e: any) => {
		window.addEventListener('keydown', (e: any) => {
			var key = e.code;
			if (["Space"].indexOf(e.code) > -1 || ["KeyP"].indexOf(e.code) > -1 )// p key
			{
				this.togglePause(); // HOW?
				console.log("called toggle");
			}
		});
		
		var paddleWidth:number = this.gameCanvas.width/25;
		var paddleHeight:number = this.gameCanvas.height/4;
		var ballSize:number = this.gameCanvas.width/25;
		var wallOffset:number = this.gameCanvas.width/25;
		
		this.player1 = new PlayerPaddle(paddleWidth,paddleHeight,wallOffset,this.gameCanvas.height / 2 - paddleHeight / 2); 
		this.computerPlayer = new ComputerPaddle(paddleWidth,paddleHeight,this.gameCanvas.width - (wallOffset + paddleWidth) ,this.gameCanvas.height / 2 - paddleHeight / 2);
		this.ball = new Ball(ballSize,ballSize,this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);    
		
	}
	
	drawBoardDetails(){
		
		//draw court outline
		this.gameContext.strokeStyle = "#fff";
		this.gameContext.font = "200px monspace";
		this.gameContext.lineWidth = 5;
		this.gameContext.centerLineWidth = 5;
		this.gameContext.centerLineHeight = 20;
		this.gameContext.strokeRect(0,0,this.gameCanvas.width,this.gameCanvas.height);
		
		//draw center lines
		for (var i = 0; i < this.gameCanvas.height; i += this.gameCanvas.height / 5) {
			this.gameContext.fillStyle = "#fff";
			this.gameContext.fillRect(this.gameCanvas.width / 2 + this.gameContext.lineWidth - (this.gameContext.centerLineWidth / 2), i, this.gameContext.centerLineWidth, this.gameContext.centerLineHeight);
		}
		
		//draw scores
		this.gameContext.fillStyle = "#444040";
		this.gameContext.textalign = "center";
		// this.gameContext.fillText(Game.playerScore, this.gameCanvas.width / 5 + this.gameContext.lineWidth, this.gameCanvas.height / 4);
		// this.gameContext.fillText(Game.computerScore, this.gameCanvas.width - this.gameContext.lineWidth * 2 - (this.gameCanvas.width / 5 + this.gameContext.lineWidth), this.gameCanvas.height / 4);
		// this.gameContext.fillText(Game.playerScore, this.gameCanvas.width / 5 + this.gameContext.lineWidth + (this.gameContext.measureText(Game.playerScore).width / 2), this.gameCanvas.height / 4);
		// this.gameContext.fillText(Game.computerScore, this.gameCanvas.width - this.gameContext.lineWidth - (this.gameCanvas.width / 5) - (this.gameContext.measureText(Game.playerScore).width / 2), this.gameCanvas.height / 4);
		
		this.gameContext.fillText(Game.playerScore, (this.gameCanvas.width / 5), this.gameCanvas.height / 4);
		this.gameContext.fillText(Game.computerScore,  this.gameCanvas.width - (this.gameCanvas.width / 5) - this.gameContext.measureText(Game.playerScore).width , this.gameCanvas.height / 4);
	}

	update(){
		this.player1.update(this.gameCanvas);
		this.computerPlayer.update(this.ball,this.gameCanvas);
		this.ball.update(this.player1,this.computerPlayer,this.gameCanvas);
	}

	draw(){
		this.gameContext.fillStyle = "#000";
		this.gameContext.fillRect(0,0,this.gameCanvas.width,this.gameCanvas.height);
			
		this.drawBoardDetails();
		this.player1.draw(this.gameContext);
		this.computerPlayer.draw(this.gameContext);
		this.ball.draw(this.gameContext);
	}

	togglePause(){
		this.paused = !this.paused;
	}
	
	// gameLoop(){
	// 	if (!Game.paused) // PROBLEM HERE
	// 	{
	// 		game.update();
	// 		game.draw();
	// 	}
	// 	requestAnimationFrame(game.gameLoop);
	// }
}

// class Entity{
// 	width:number;
// 	height:number;
// 	x:number;
// 	y:number;
// 	xVel:number = 0;
// 	yVel:number = 0;
// 	constructor(w:number,h:number,x:number,y:number){       
// 		this.width = w;
// 		this.height = h;
// 		this.x = x;
// 		this.y = y;
// 	}
// 	draw(context: any){
// 		context.fillStyle = "#AC4018";
// 		context.fillRect(this.x,this.y,this.width,this.height);
// 	}
// }

// class PlayerPaddle extends Entity{
	
// 	private speed:number = 5;
	
// 	constructor(w:number,h:number,x:number,y:number){
// 		super(w,h,x,y);
// 	}
	
// 	update(canvas: any) {
// 		if (Game.keysPressed[KeyBindings.UP]) {
// 			this.yVel = -1;
// 			if (this.y <= 20) {
// 				this.yVel = 0
// 			}
// 		} else if (Game.keysPressed[KeyBindings.DOWN]) {
// 			this.yVel = 1;
// 			if (this.y + this.height >= canvas.height - 20){
// 				this.yVel = 0;
// 			}
// 		} else {
// 			this.yVel = 0;
// 		}
		
// 		this.y += this.yVel * this.speed;
// 	}
// }

// class ComputerPaddle extends Entity{
	
// 	private speed:number = 5;
	
// 	constructor(w:number,h:number,x:number,y:number){
// 		super(w,h,x,y);        
// 	}
	
// 	update(ball:Ball, canvas: any) { 
	
// 		//chase ball
// 		if(ball.y < this.y && ball.xVel == 1){
// 				this.yVel = -1; 
				
// 				if(this.y <= 20){
// 					this.yVel = 0;
// 				}
// 		}
// 		else if(ball.y > this.y + this.height && ball.xVel == 1){
// 			this.yVel = 1;
			
// 			if(this.y + this.height >= canvas.height - 20){
// 				this.yVel = 0;
// 			}
// 		}
// 		else{
// 			this.yVel = 0;
// 		}
		
// 		this.y += this.yVel * this.speed;
// 	}
// }

// class Ball extends Entity{
	
// 	private speed:number = 3;
	
// 	constructor(w:number,h:number,x:number,y:number){
// 		super(w,h,x,y);
// 		// var randomDirection = Math.floor(Math.random() * 2) + 1; 
// 		// if (randomDirection % 2) {
// 		// 	this.xVel = 1;
// 		// } else {
// 		// 	this.xVel = -1;
// 		// }
// 		this.xVel = -1;
// 		this.yVel = 1;
// 	}
	
// 	update (player: PlayerPaddle, computer: ComputerPaddle, canvas: any){
	
// 		//check top canvas bounds
// 		if(this.y <= 0){
// 			this.yVel = 1;
// 		}
		
// 		//check bottom canvas bounds
// 		if(this.y + this.height >= canvas.height){
// 			this.yVel = -1;
// 		}
		
// 		//check left canvas bounds
// 		if(this.x <= 0){  
// 			this.x = canvas.width / 2 - this.width / 2;
// 			Game.computerScore += 1;
// 		}
		
// 		//check right canvas bounds
// 		if(this.x + this.width >= canvas.width){
// 			this.x = canvas.width / 2 - this.width / 2;
// 			Game.playerScore += 1;
// 		}
		
// 		//check player collision
// 		if (this.x <= player.x + player.width){
// 			if (this.y >= player.y && this.y <= player.y + player.height){
// 				this.xVel = 1;
// 				// player.update(Game.)
// 			}
// 		}
		
// 		//check computer collision
// 		if(this.x + this.width >= computer.x){
// 			if(this.y >= computer.y && this.y <= computer.y + computer.height){
// 				this.xVel = -1;
// 			}
// 		}
	
// 		this.x += this.xVel * this.speed;
// 		this.y += this.yVel * this.speed;
// 	}
// }

