<template>
	<div class="div-wrapper">
		<!--<MatchWaitPopup id="MatchWaitPopup" v-if="opponentArrived === false" />-->
		<MatchWaitPopup style="display:none" ref="matchCourtWaiting" id="MatchWaitPopup" :removeMatchWaitPopup=" () => removeMatchWaitPopup()"/>
		<div id="matchSelectionDiv">
			<h2>no game started yet...</h2>
			<p>do you want to play yourself or watch a game?</p>
			<div class="button-div">
				<button id="joinMatchQueueBtn">join match queue</button>
				<button id="watchMatchBtn">watch random game</button>
			</div>
		</div>
		<canvas style="display:none" ref="matchCourtRef" id="matchScreen"></canvas>
	</div>
</template>


<script lang="ts">
import DataService from '../services/DataService'
import { ref, computed, defineComponent } from 'vue'
import SocketioService from '../services/SocketioService.js'
import MatchWaitPopup from './MatchWaitPopup.vue';

export default defineComponent({

	setup() {

		// #################  VARIABLES ######################
		let canvas: any;
		let ctx: any;
		let matchSelectionDiv: any;
		let joinMatchQueueBtn: any;
		let watchMatchBtn: any;
		let playerNumber: number;
		let matchWaitPopup: any;
		const opponentArrived = ref(false);
		
		
		// #################  HANDLERS #######################
        const handlePlayerNumber = (nbr: number) => {
			if(!playerNumber)
				playerNumber = nbr;
			console.log("your player number is: ", playerNumber);
		}
		
		const handleGameState = (gameState: any) => {
			
			if (!gameState) {
				return;
			}

			//console.log("game starts");
			canvas.style.display = 'block';
			matchWaitPopup.style.display = 'none';
			matchSelectionDiv.style.display = 'none';
			gameState = JSON.parse(gameState);
            requestAnimationFrame(() => paintGame(gameState));
        };

		const handleGameOver = (gameState: any) => {
            if (!gameState) {
				return;
			}
			gameState = JSON.parse(gameState);
			requestAnimationFrame(() => paintGame(gameState)); // kommt raus
			if (gameState.scorePlayer1 == 3) {
				// DataService.gameOver(gameState, playerNumber);
				if (playerNumber === 1)
					alert("You win! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
				else
					alert("You lose! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
			}
			else if (gameState.scorePlayer2 == 3) {
				// DataService.gameOver(gameState, playerNumber);
				if (playerNumber === 1)
					alert("You lose! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
				else
					alert("You win! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
			}
			playerNumber=0;
			// 	matchSelectionDiv.style.display = 'block';
			// 	matchWaitPopup.style.display = 'none';
			// 	matchSelectionDiv.style.display = 'none';
			reset();
        };


		const handleOpponentArrived = (data: any) => {
			console.log("opponent arrived")
			console.log(data)
			opponentArrived.value = data.data; 
			if (!opponentArrived.value){
				matchSelectionDiv.style.display = 'none';
				matchWaitPopup.style.display = 'block';
			}
			else {
				matchSelectionDiv.style.display = 'none';
				canvas.style.display = 'block';
	
				// REMOVE BLURRINESS ((IF no blurriness errrors anymore: remove this!))
				// let dpi = window.devicePixelRatio;
				// const fix_dpi = () => {
				// 	let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
				// 	let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
				// 	canvas.setAttribute("height", styleHeight * dpi);
				// 	canvas.setAttribute("width", styleWidth * dpi);
				// };
				// fix_dpi();
				// console.log(canvas.height, canvas.width);
				// REMOVE BLURRINESS END

				socket.emit('startGame', canvas.height, canvas.width);
			}
		};

		const handleJoinGame = (gameState:any, roomNumber: number) => {
			socket.emit('joinGame', gameState, roomNumber);
		}

		const handleJoinedEmptyGame = () => {
			reset();
			alert("You joined an empty room. WTF, how did you do that?");
		}

		const handleTooManyPlayers = () => {
			reset();
			alert("This game is full and in progress");
		}

		const reset = () => {
			playerNumber = 0;
			matchSelectionDiv.style.display = "inline-flex";
			canvas.style.display = "none";
			matchWaitPopup.style.display = "none";
		}


		// #################  KEY SIGNALING #######################
		const keydown = (e: any) => {
			socket.emit('keydown', e.keyCode);
		};

		const joinMatchQueue = () => {
			// DataService.joinMatchQueue();
			
			// sets opponentStatus
			SocketioService.createNewGame(canvas);
		};


		// ################# INIT CANVAS #######################
        const initCanvas = () => {
			matchSelectionDiv = document.getElementById("matchSelectionDiv");
			joinMatchQueueBtn = document.getElementById("joinMatchQueueBtn");
			watchMatchBtn = document.getElementById("watchMatchBtn");
			matchWaitPopup = document.getElementById("MatchWaitPopup");
			canvas = document.getElementById("matchScreen");
            ctx = canvas.getContext("2d");

            ctx.fillStyle = "#444040";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.addEventListener("keydown", keydown);
			joinMatchQueueBtn.addEventListener("click", joinMatchQueue);
            
			// SPÄTER:
			// watchMatchBtn.addEventListener("click", watchGame);
        };


		// ########### PAINTING ###################################################################################################
        const removeBlurriness = (canvas: any) => {
			// Lookup the size the browser is displaying the canvas in CSS pixels.
			const displayWidth  = canvas.clientWidth;
			const displayHeight = canvas.clientHeight;
			
			// Check if the canvas is not the same size.
			const needResize = canvas.width  !== displayWidth ||
								canvas.height !== displayHeight;
			
			if (needResize) {
				// Make the canvas the same size
				canvas.width  = displayWidth;
				canvas.height = displayHeight;
			}
		}

		const scaleUpGameStateForPlayer = (state: any) => {
			state.canvasHeight = state.canvasHeight / 120 * canvas.height;
			state.canvasWidth = state.canvasWidth / 200 * canvas.width;
			
			// static stuff (no movement involved)
			state.paddleWidth = state.canvasWidth / 25;
			state.paddleHeight = state.canvasHeight / 4;
			state.ballSize = state.canvasWidth / 25;
			state.wallOffset = state.canvasWidth / 25;
			state.player1.pos.x = state.wallOffset;
			state.player2.pos.x = state.canvasWidth - (state.wallOffset + state.paddleWidth);
			state.paddleSpeed = state.canvasHeight / 75;
			state.ballSpeed = state.canvasHeight / 7
			
			// dynamic stuff (movement involved)
			state.player1.pos.y = state.player1.pos.y / 120 * canvas.height;
			state.player2.pos.y = state.player2.pos.y / 120 * canvas.height;
			state.ball.pos.x = state.ball.pos.x / 200 * canvas.width;
			state.ball.pos.y = state.ball.pos.y / 120 * canvas.height;
		}

		const paintGame = (state: any) => {
			removeBlurriness(canvas); // comment IN again!
			scaleUpGameStateForPlayer(state);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.strokeStyle = "#fff";
			ctx.lineWidth = state.drawLineWidth;
			ctx.centerLineWidth = state.drawLineWidth;
			ctx.centerLineHeight = canvas.height / 10;
			ctx.strokeRect(0, 0, canvas.width, canvas.height);
			//draw center lines
			for (var i = (canvas.height / 5 / 5); i < canvas.height; i += canvas.height / 5) {
				ctx.fillStyle = "#444040";
				ctx.fillRect(canvas.width / 2 + ctx.lineWidth - (ctx.centerLineWidth / 2), i + ctx.lineWidth, ctx.centerLineWidth, ctx.centerLineHeight);
			}
			paintScoresAndNames(state);
            paintPlayersAndBall(state);
        };

        const paintPlayersAndBall = (state: any) => {
			// scaleUpGameStateForPlayer(state);
            ctx.fillStyle = "#b04716";
            // ctx.fillStyle = "#fff";
            ctx.fillRect(state.player1.pos.x, state.player1.pos.y, state.paddleWidth, state.paddleHeight);
            ctx.fillRect(state.player2.pos.x, state.player2.pos.y, state.paddleWidth, state.paddleHeight);
            ctx.fillRect(state.ball.pos.x, state.ball.pos.y, state.ballSize, state.ballSize);
        };

		const paintScoresAndNames = (state: any) => {
            ctx.fillStyle = "#444040";
			ctx.textalign = "center";
			var fontSize = canvas.height / 2.5;
			ctx.font = (fontSize|0) + 'px monspace';

			ctx.fillText(state.scorePlayer1, (canvas.width / 5), canvas.height / 2 + ((ctx.measureText(state.scorePlayer1).actualBoundingBoxAscent + ctx.measureText(state.scorePlayer1).actualBoundingBoxDescent) / 2));
			ctx.fillText(state.scorePlayer2,  canvas.width - (canvas.width / 5) - ctx.measureText(state.scorePlayer2).width , canvas.height / 2 + ((ctx.measureText(state.scorePlayer2).actualBoundingBoxAscent + ctx.measureText(state.scorePlayer2).actualBoundingBoxDescent) / 2));
       
			fontSize = canvas.height / 8;
			ctx.font = (fontSize|0) + 'px monspace';
			const biggerMeasureAscent = ctx.measureText(state.player1.userid).actualBoundingBoxAscent > ctx.measureText(state.player2.userid).actualBoundingBoxAscent ? ctx.measureText(state.player1.userid).actualBoundingBoxAscent : ctx.measureText(state.player2.userid).actualBoundingBoxAscent;
			const biggerMeasureDescent = ctx.measureText(state.player1.userid).actualBoundingBoxDescent > ctx.measureText(state.player2.userid).actualBoundingBoxDescent ? ctx.measureText(state.player1.userid).actualBoundingBoxDescent : ctx.measureText(state.player2.userid).actualBoundingBoxDescent;
			ctx.fillText(state.player1.userid, (canvas.width / 4 - (ctx.measureText(state.player1.userid).width / 2)), (canvas.height - canvas.height / 6) + ((biggerMeasureAscent + biggerMeasureDescent) / 2));
			ctx.fillText(state.player2.userid,  canvas.width - (canvas.width / 4) - ctx.measureText(state.player2.userid).width / 2 , (canvas.height - canvas.height / 6) + ((biggerMeasureAscent+ biggerMeasureDescent) / 2));
		};
		// ########### PAINTING ###################################################################################################

		const removeMatchWaitPopup = () => {
			matchWaitPopup.style.display = 'none';
			matchSelectionDiv.style.display = 'inline-flex';
			DataService.denyChallenge();
		}

		//############# SOCKETIO ##############
		const socket = SocketioService.socket;
		socket.on('init', handlePlayerNumber);
		socket.on("opponent-status", handleOpponentArrived);
		socket.on('gameState', handleGameState);
		socket.on('gameOver', handleGameOver);
		socket.on('joinedEmptyGame', handleJoinedEmptyGame);
		socket.on('tooManyPlayers', handleTooManyPlayers); //two players in room already
		socket.on('joinGame', handleJoinGame);
		////############# SOCKETIO #############

        return { canvas, opponentArrived, initCanvas, paintGame, removeMatchWaitPopup };
    },

    mounted() {
		this.initCanvas();
    },

    components: { MatchWaitPopup }
});

</script>

<style scoped>
	#matchScreen {
		width: 80%;
		aspect-ratio: 5/3;
		background: white;
		min-width: 200px; /*FIND DYNAMIC WAY*/
		/* outline: 10px solid red; */
		border-radius: 2px;
		/* margin: 30px; */
	}

	#matchSelectionDiv {
		width: 80%;
		aspect-ratio: 5/3;
		background: var(--second-bg-color);
		min-width: 200px; /*FIND DYNAMIC WAY*/

		padding: 2rem;

		/* make element inline flex-container */
  		/* this will make its children flex-items */
		display: inline-flex;
		/* align-items items in column */
		flex-direction: column;
		/* center items horizontally */
		align-items: center;
		/* center items vertically */
		justify-content: center;
	}

	#matchSelectionDiv h2 {
		margin-bottom: 1.5rem;
	}


button {
    margin: 0 0.5rem;
}

</style>