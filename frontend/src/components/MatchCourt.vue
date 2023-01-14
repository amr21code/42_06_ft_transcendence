<template>
	<canvas id="match-court"></canvas>
	<!-- <div class="match-court">
		Match Court
		<div class="player_one"></div>
		<div class="player_two"></div>
		<div class="play-ball"></div>
	</div>	 -->
</template>


<!-- <script src="../TMP_GAME.ts"></script> -->

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({

	// components: {},
	// data () {
	// 	return {
	// 		game: {} as Game
	// 		// HEREEEEEEE
	// 	}
	// },
	// methods: {
	// 	gameLoop(){
	// 		this.game.update();
	// 		this.game.draw();
	// 		requestAnimationFrame(this.game.gameLoop);
	// 	}
	// },
	// mounted () {
	// 	var game = new Game();
	// 	requestAnimationFrame(this.game.gameLoop);

	// }

	mounted () {
		enum KeyBindings{
			UP = 38,
			DOWN = 40
		}

		class Game{
			private gameCanvas: any;
			private gameContext: any;
			public static keysPressed: boolean[] = [];
			public static playerScore: number = 0;
			public static computerScore: number = 0;
			private player1: Paddle;
			private computerPlayer: ComputerPaddle;
			private ball: Ball;
			constructor(){
				this.gameCanvas = document.getElementById("match-court");
				// console.log(this.gameCanvas);
				this.gameContext = this.gameCanvas.getContext("2d");
				this.gameContext.font = "30px monospace";
				
				window.addEventListener("keydown",function(e){
				Game.keysPressed[e.which] = true;
				});
				
				window.addEventListener("keyup",function(e){
					Game.keysPressed[e.which] = false;
				});
				
				var paddleWidth:number = this.gameCanvas.width/25;
				var paddleHeight:number = this.gameCanvas.height/4;
				var ballSize:number = this.gameCanvas.width/25;
				var wallOffset:number = this.gameCanvas.width/25;
				
				this.player1 = new Paddle(paddleWidth,paddleHeight,wallOffset,this.gameCanvas.height / 2 - paddleHeight / 2); 
				this.computerPlayer = new ComputerPaddle(paddleWidth,paddleHeight,this.gameCanvas.width - (wallOffset + paddleWidth) ,this.gameCanvas.height / 2 - paddleHeight / 2);
				this.ball = new Ball(ballSize,ballSize,this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2);    
				
			}
			drawBoardDetails(){
				
				//draw court outline
				this.gameContext.strokeStyle = "#fff";
				this.gameContext.lineWidth = 5;
				this.gameContext.centerLineWidth = 5;
				this.gameContext.centerLineHeight = 20;
				this.gameContext.strokeRect(0,0,this.gameCanvas.width,this.gameCanvas.height);
				
				//draw center lines
				// FIND A WAY TO CENTER THIS
				for (var i = 0; i < this.gameCanvas.height; i += this.gameCanvas.height / 5) {
					this.gameContext.fillStyle = "#fff";
					this.gameContext.fillRect(this.gameCanvas.width / 2 + this.gameContext.lineWidth - (this.gameContext.centerLineWidth / 2), i, this.gameContext.centerLineWidth, this.gameContext.centerLineHeight);
				}
				
				//draw scores
				this.gameContext.fillText(Game.playerScore, this.gameCanvas.width / 5 + this.gameContext.lineWidth, this.gameCanvas.height / 4);
				this.gameContext.fillText(Game.computerScore, this.gameCanvas.width - this.gameContext.lineWidth * 2 - (this.gameCanvas.width / 5 + this.gameContext.lineWidth), this.gameCanvas.height / 4);
				
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
			gameLoop(){
				game.update();
				game.draw();
				requestAnimationFrame(game.gameLoop);
			}
		}

		class Entity{
			width:number;
			height:number;
			x:number;
			y:number;
			xVel:number = 0;
			yVel:number = 0;
			constructor(w:number,h:number,x:number,y:number){       
				this.width = w;
				this.height = h;
				this.x = x;
				this.y = y;
			}
			draw(context: any){
				context.fillStyle = "#fff";
				context.fillRect(this.x,this.y,this.width,this.height);
			}
		}

		class Paddle extends Entity{
			
			private speed:number = 10;
			
			constructor(w:number,h:number,x:number,y:number){
				super(w,h,x,y);
			}
			
			update(canvas: any){
			if( Game.keysPressed[KeyBindings.UP] ){
				this.yVel = -1;
				if(this.y <= 20){
					this.yVel = 0
				}
			}else if(Game.keysPressed[KeyBindings.DOWN]){
				this.yVel = 1;
				if(this.y + this.height >= canvas.height - 20){
					this.yVel = 0;
				}
			}else{
				this.yVel = 0;
			}
			
			this.y += this.yVel * this.speed;
			
			}
		}

		class ComputerPaddle extends Entity{
			
			private speed:number = 10;
			
			constructor(w:number,h:number,x:number,y:number){
				super(w,h,x,y);        
			}
			
			update(ball:Ball, canvas: any){ 
			
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

		class Ball extends Entity{
			
			private speed:number = 5;
			
			constructor(w:number,h:number,x:number,y:number){
				super(w,h,x,y);
				var randomDirection = Math.floor(Math.random() * 2) + 1; 
				if(randomDirection % 2){
					this.xVel = 1;
				}else{
					this.xVel = -1;
				}
				this.yVel = 1;
			}
			
			update(player:Paddle,computer:ComputerPaddle,canvas: any){
			
				//check top canvas bounds
				if(this.y <= 10){
					this.yVel = 1;
				}
				
				//check bottom canvas bounds
				if(this.y + this.height >= canvas.height - 10){
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
				if(this.x <= player.x + player.width){
					if(this.y >= player.y && this.y + this.height <= player.y + player.height){
						this.xVel = 1;
					}
				}
				
				//check computer collision
				if(this.x + this.width >= computer.x){
					if(this.y >= computer.y && this.y + this.height <= computer.y + computer.height){
						this.xVel = -1;
					}
				}
			
				this.x += this.xVel * this.speed;
				this.y += this.yVel * this.speed;
			}
		}

		
		var game = new Game();
		// COMMENT BELOW OUT TO NOT SHOW THE GAME
		requestAnimationFrame(game.gameLoop);
	}
})
</script>

<style scoped>
	/* #match-court { */
		/* background-color: var(--second-bg-color);
		border: white solid;
		color: red;
		text-align: center;
		aspect-ratio: 5/3;
		border-radius: 4px;
		background-image:
			radial-gradient(circle at 50% 50%, transparent 15%, white 0 16%, transparent 16%),
			radial-gradient(circle at 50% 50%, transparent 15%, white , transparent 500%),
			radial-gradient(circle at 50% 50%, white 0 14.75%, transparent 15%),
			linear-gradient(to right, transparent 49.75%, white 0 50.25%, transparent 0);
		padding: 30px; */
	/* } */
	#match-court {
		width: 100%;
		background-color: green;
	}

	.player_one {
		/* background-color: blueviolet; */
		height: 100px; /* MAKE ADJUSTABLE AND RESPONSIVE */
		border-left: 10px solid blueviolet;
		margin: 10px;
	}
	.player_two {
		/* background-color: blueviolet; */
		height: 100px; /* MAKE ADJUSTABLE AND RESPONSIVE */
		border-right: 10px solid blueviolet;
		margin: 10px;
	}
	.play-ball {
		background-color: yellow;
		height: 25px;
		width: 25px;
		border-radius: 50%;
		margin-left: 100px;
	}
</style>