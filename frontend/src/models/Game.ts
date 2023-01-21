import Ball from "./Ball"
import PlayerPaddle from "./PlayerPaddle"
import ComputerPaddle from "./ComputerPaddle"

export default class Game {
	private gameCanvas: any;
	private gameContext: any;
	public static keysPressed: boolean[] = [];
	public static playerScore1: number = 0;
	public static playerScore2: number = 0;
	paused: boolean;
	private player1: PlayerPaddle;
	private computerPlayer: ComputerPaddle;
	private ball: Ball;

	constructor(savedScore1: number, savedScore2: number){
		this.paused = false;
		this.gameCanvas = document.getElementById("match-court");
		this.gameContext = this.gameCanvas.getContext("2d");
		Game.playerScore1 = savedScore1;
		Game.playerScore2 = savedScore2;

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
			// if (!e.target.matches('#match-court'))
			// 	return;
			var key = e.code;
			if (["Space"].indexOf(e.code) > -1 || ["KeyP"].indexOf(e.code) > -1 )// p key
			{
				this.togglePause();
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
	
		this.gameContext.fillText(Game.playerScore1, (this.gameCanvas.width / 5), this.gameCanvas.height / 2 + ((this.gameContext.measureText(Game.playerScore2).actualBoundingBoxAscent + this.gameContext.measureText(Game.playerScore2).actualBoundingBoxDescent) / 2));
		this.gameContext.fillText(Game.playerScore2,  this.gameCanvas.width - (this.gameCanvas.width / 5) - this.gameContext.measureText(Game.playerScore2).width , this.gameCanvas.height / 2 + ((this.gameContext.measureText(Game.playerScore2).actualBoundingBoxAscent + this.gameContext.measureText(Game.playerScore2).actualBoundingBoxDescent) / 2));
	}

	update(){
		this.player1.update(this.gameCanvas);
		this.computerPlayer.update(this.ball, this.gameCanvas);
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

	togglePause() {
		this.paused = !this.paused;
	}

	public static playerTwoScores() {
		this.playerScore2++;
	}

	public static playerOneScores() {
		this.playerScore1++;
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
