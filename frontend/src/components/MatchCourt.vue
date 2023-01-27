<template>
	<div class="div-wrapper">
		<!--<MatchWaitPopup id="MatchWaitPopup" v-if="opponentArrived === false" />-->
		<MatchWaitPopup style="display:none" ref="matchCourtWaiting" id="MatchWaitPopup" />
		<div style="background: red; height: 100px" id="matchSelectionDiv">
			game not started
			<button id="joinMatchQueueBtn">join match queue</button>
			<button id="watchMatchBtn">watch random game</button>
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
		let MatchWaitPopup: any;
		const opponentArrived = ref(false); // CHANGE BACK TO FALSE!
		
		
		// #################  HANDLERS #######################
        const handleGameState = (gameState: any) => {
            if (!gameState) {
				return;
			}
			gameState = JSON.parse(gameState);
			if (gameState.scorePlayer1 == 3) {
				console.log("Game Over, Player One wins");
				DataService.gameOver(gameState);
			}
			else if (gameState.scorePlayer2 == 3) {
				console.log("Game Over, Player Two wins");
				DataService.gameOver(gameState);
			}
			else
			{
				matchSelectionDiv.style.display = 'block';
				MatchWaitPopup.style.display = 'none';
				matchSelectionDiv.style.display = 'none';
			}
            requestAnimationFrame(() => paintGame(gameState));
        };


		const handleOpponentArrived = (data: any) => {
			opponentArrived.value = data.data; 
			if (!playerNumber && !opponentArrived.value){
				playerNumber = 1;
				matchSelectionDiv.style.display = 'none';
				MatchWaitPopup.style.display = 'block';
			}
			else if (!playerNumber){
				playerNumber = 2;
				matchSelectionDiv.style.display = 'none';
				canvas.style.display = 'block';
	
				// REMOVE BLURRINESS
				let dpi = window.devicePixelRatio;
				const fix_dpi = () => {
					let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
					let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
					canvas.setAttribute("height", styleHeight * dpi);
					canvas.setAttribute("width", styleWidth * dpi);
				};
				fix_dpi();
				console.log(canvas.height, canvas.width);
				// REMOVE BLURRINESS END
	
				socket.emit('joinGame'); // MAKE CONDITIONAL -> IF SECOND PLAYER ARRIVED

			}
			console.log("your player number is: ", playerNumber);
		};


		// #################  KEY SIGNALING #######################
		const keydown = (e: any) => {
			socket.emit('keydown', e.keyCode);
		};

		const joinMatchQueue = () => {
			// DataService.openSingleMatch(); // ERSETZEN 
			DataService.joinMatchQueue();
			
			// sets opponentStatus
			SocketioService.createNewGame(canvas); // SET CONDITION TO STOP STUFF
			// ############### HEEEEEEEEEEEEEERE GO ON TOMORROW

			// MARKER: RENDER WAITING POPUP IF OPPONENTSTATUS = FALSE

			//console.log("opponent arrived: ", opponentArrived.value);
			//if (opponentArrived.value === false) {

			//	matchSelectionDiv.style.display = 'none';
			//	MatchWaitPopup.style.display = 'block';
			//}
			
			//else if (opponentArrived.value === true) { // WE NEVER GET IN HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE

			//	matchSelectionDiv.style.display = 'none';
			//	canvas.style.display = 'block';
	
			//	// REMOVE BLURRINESS
			//	let dpi = window.devicePixelRatio;
			//	const fix_dpi = () => {
			//		let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
			//		let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
			//		canvas.setAttribute("height", styleHeight * dpi);
			//		canvas.setAttribute("width", styleWidth * dpi);
			//	};
			//	fix_dpi();
			//	console.log(canvas.height, canvas.width);
			//	// REMOVE BLURRINESS END
	
			//	socket.emit('joinGame'); // MAKE CONDITIONAL -> IF SECOND PLAYER ARRIVED
			//}
		};


		// ################# INIT CANVAS #######################
        const initCanvas = () => {
			matchSelectionDiv = document.getElementById("matchSelectionDiv");
			joinMatchQueueBtn = document.getElementById("joinMatchQueueBtn");
			watchMatchBtn = document.getElementById("watchMatchBtn");
			canvas = document.getElementById("matchScreen");
            ctx = canvas.getContext("2d");
			MatchWaitPopup=document.getElementById("MatchWaitPopup");

            ctx.fillStyle = "#444040";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.addEventListener("keydown", keydown);
			joinMatchQueueBtn.addEventListener("click", joinMatchQueue);
            
			// SPÄTER:
			// watchMatchBtn.addEventListener("click", watchGame);
        };


		// ########### PAINTING ###################################################################################################
        const paintGame = (state: any) => {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.strokeStyle = "#fff";
			ctx.font = "200px monspace";
			ctx.lineWidth = 7;
			ctx.centerLineWidth = 7;
			ctx.centerLineHeight = canvas.height / 10;
			ctx.strokeRect(0, 0, canvas.width, canvas.height);
			//draw center lines
			for (var i = (canvas.height / 5 / 5); i < canvas.height; i += canvas.height / 5) {
				ctx.fillStyle = "#444040";
				ctx.fillRect(canvas.width / 2 + ctx.lineWidth - (ctx.centerLineWidth / 2), i + ctx.lineWidth, ctx.centerLineWidth, ctx.centerLineHeight);
			}
			paintScores(state);
            paintPlayersAndBall(state);
        };

        const paintPlayersAndBall = (state: any) => {
            ctx.fillStyle = "#b04716";
            // ctx.fillStyle = "#fff";
            ctx.fillRect(state.player1.pos.x, state.player1.pos.y, state.paddleWidth, state.paddleHeight);
            ctx.fillRect(state.player2.pos.x, state.player2.pos.y, state.paddleWidth, state.paddleHeight);
            ctx.fillRect(state.ball.pos.x, state.ball.pos.y, state.ballSize, state.ballSize);
        };

		const paintScores = (state: any) => {
            ctx.fillStyle = "#444040";
			ctx.textalign = "center";
			
			ctx.fillText(state.scorePlayer1, (canvas.width / 5), canvas.height / 2 + ((ctx.measureText(state.scorePlayer1).actualBoundingBoxAscent + ctx.measureText(state.scorePlayer1).actualBoundingBoxDescent) / 2));
			ctx.fillText(state.scorePlayer2,  canvas.width - (canvas.width / 5) - ctx.measureText(state.scorePlayer2).width , canvas.height / 2 + ((ctx.measureText(state.scorePlayer2).actualBoundingBoxAscent + ctx.measureText(state.scorePlayer2).actualBoundingBoxDescent) / 2));
        };
		// ########### PAINTING ###################################################################################################


		//############# SOCKETIO ##############
		const socket = SocketioService.socket;
		socket.on("opponent-status", handleOpponentArrived);
		socket.on('gameState', handleGameState);
		socket.on('gameOver', handleGameState);
		// socket.on('gameCode', handleGameCode);
		// socket.on('unknownCode', handleGameState);
		// socket.on('gameFull', handleGameState); //two players in room already
		////############# SOCKETIO #############

		
        return { canvas, opponentArrived, initCanvas, paintGame };
    },

	methods: {
		
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
		background-color: white;
		min-width: 200px; /*FIND DYNAMIC WAY*/
		/* outline: 10px solid red; */
		border-radius: 2px;
		/* margin: 30px; */
	}

</style>


<!-- 
gameState.canvasHeight = canvas.height;
gameState.canvasWidth = canvas.width;
gameState.paddleWidth = canvas.width / 25;
gameState.paddleHeight = canvas.height / 4;
gameState.ballSize = canvas.width / 25;
gameState.wallOffset = canvas.width / 25;
gameState.player1.pos.x = gameState.wallOffset;
gameState.player1.pos.y = canvas.height / 2 - gameState.paddleHeight / 2;
gameState.player2.pos.x = canvas.width - (gameState.wallOffset + gameState.paddleWidth);
gameState.player2.pos.y = canvas.height / 2 - gameState.paddleHeight / 2;
gameState.ball.pos.x = canvas.width / 2 - gameState.ballSize / 2;
gameState.ball.pos.y = canvas.height / 2 - gameState.ballSize / 2; 
-->
