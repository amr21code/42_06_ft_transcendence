<template>
	<div class="div-wrapper">
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
			<button style="display:none" id="leave-match-button">leave game</button>
	</div>
</template>


<script lang="ts">
import DataService from '../services/DataService'
import { ref, defineComponent } from 'vue'
import SocketioService from '../services/SocketioService.js'
import MatchWaitPopup from './popups/MatchWaitPopup.vue';
import { useUserDataStore } from '../stores/myUserDataStore';

export default defineComponent({

	setup() {

		// #################  VARIABLES ######################
		const store = useUserDataStore();
		let canvas: any;
		let ctx: any;
		let matchSelectionDiv: any;
		let joinMatchQueueBtn: any;
		let leaveMatchButton: any;
		let watchMatchBtn: any;
		let playerNumber: number;
		let matchWaitPopup: any;
		let gameOver: boolean;
		const opponentArrived = ref(false);
		//let spectatorLeftMatch = false;
		
		// #################  HANDLERS #######################
        const handlePlayerNumber = (nbr: number) => {
			if(!playerNumber)
				playerNumber = nbr;
			console.log("your player number is: ", playerNumber);
		}

		const handleWatchError = (msg: string) => {
			if (msg === 'failed') {
				leaveMatchButton.style.display = "none";
				alert("There are no matches to watch right now. Try again later!");
			}
		}
		
		const handleGameState = (gameState: any) => {
			console.log("gamestate always");
			if (!gameState) {
				return;
			}
			//else if (spectatorLeftMatch) {
			//	// if (store.user.userid === gameState.player1.userid || store.user.userid === gameState.player2.userid)
			//	// 	socket.emit("playerLeft", gameState);
			//	// else
			//	socket.emit("spectatorLeftMatch", gameState);
			//	return;
			//}
			else if (gameState.prematureEnd || gameOver) {
				reset();
				return;
			}
			console.log("gamestate after leave");
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
			if (gameState.scorePlayer1 == 11) {
				// DataService.gameOver(gameState, playerNumber);
				if (playerNumber === 1)
					alert("You win! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
				else if (playerNumber === 2)
					alert("You lose! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
			}
			else if (gameState.scorePlayer2 == 11) {
				// DataService.gameOver(gameState, playerNumber);
				if (playerNumber === 1)
					alert("You lose! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
				else if (playerNumber === 2)
					alert("You win! " + gameState.scorePlayer1 + ":" + gameState.scorePlayer2);
			}
			playerNumber = 0;
			reset();
        };


		const handleOpponentArrived = (data: any) => {
			opponentArrived.value = data.data; 
			if (!opponentArrived.value){
				matchSelectionDiv.style.display = 'none';
				matchWaitPopup.style.display = 'block';
			}
			else {
				matchSelectionDiv.style.display = 'none';
				canvas.style.display = 'block';
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

		// const handleTooManyPlayers = () => {
		// 	reset();
		// 	alert("This game is full and in progress");
		// }

		const handleOpponentLeft = (matchid:number, userid: string) => {
			socket.emit('opponentLeft', matchid);
			console.log("opponent left");
			gameOver = true;
			reset();
			alert(userid +" left the game, opponent wins!");
		}

		const reset = () => {
			playerNumber = 0;
			matchSelectionDiv.style.display = "inline-flex";
			canvas.style.display = "none";
			matchWaitPopup.style.display = "none";
			leaveMatchButton.style.display = "none";
		}


		// #################  KEY SIGNALING #######################
		const keydown = (e: any) => {
			socket.emit('keydown', e.keyCode);
		};

		const joinMatchQueue = () => {
			gameOver = false;
			//spectatorLeftMatch = false;
			SocketioService.createNewGame(canvas);
		};

		const watchGame = () => {
			//spectatorLeftMatch = false;
			socket.emit('watchGame');
			leaveMatchButton.style.display = "block";
			// check that I cannot stear the paddle
			// check what happens if watcher/player leaves the room
			// check what happens if there is no game open? Message to user: no game
		}

		const spectatorLeavesMatch = () => {
			//spectatorLeftMatch = true;
			socket.emit("spectatorLeftMatch");
			reset();
		}


		// ################# INIT CANVAS #######################
        const initCanvas = () => {
			matchSelectionDiv = document.getElementById("matchSelectionDiv");
			joinMatchQueueBtn = document.getElementById("joinMatchQueueBtn");
			watchMatchBtn = document.getElementById("watchMatchBtn");
			matchWaitPopup = document.getElementById("MatchWaitPopup");
			leaveMatchButton = document.getElementById("leave-match-button");
			canvas = document.getElementById("matchScreen");
            ctx = canvas.getContext("2d");

            ctx.fillStyle = "#444040";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.addEventListener("keydown", keydown);
			joinMatchQueueBtn.addEventListener("click", joinMatchQueue);
			watchMatchBtn.addEventListener("click", watchGame);
			leaveMatchButton.addEventListener("click", spectatorLeavesMatch);

			window.addEventListener("keydown", function(e) {
				if(["ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
					e.preventDefault();
				}
			}, false);
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
			state.paddleWidth = state.canvasWidth / 50;
			state.paddleHeight = state.canvasHeight / 6;
			state.ballSize = state.canvasWidth / 50;
			state.wallOffset = state.canvasWidth / 50;
			state.player1.pos.x = state.wallOffset;
			state.player2.pos.x = state.canvasWidth - (state.wallOffset + state.paddleWidth);
			state.paddleSpeed = state.canvasHeight / 50;
			state.ballSpeed = state.canvasHeight / 75;
			
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
				// ctx.fillRect(canvas.width / 2 + ctx.lineWidth - (ctx.centerLineWidth / 2), i + ctx.lineWidth, ctx.centerLineWidth, ctx.centerLineHeight);
				ctx.fillRect(canvas.width / 2 - (ctx.centerLineWidth / 2), i + ctx.lineWidth, ctx.centerLineWidth, ctx.centerLineHeight - ctx.lineWidth);
			}
			paintScoresAndNames(state);
            paintPlayersAndBall(state);
        };

        const paintPlayersAndBall = (state: any) => {
            ctx.fillStyle = "#" + store.user.paddlecolor;
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
		const removeMatchWaitPopup = async () => {
			matchWaitPopup.style.display = 'none';
			matchSelectionDiv.style.display = 'inline-flex';
			await DataService.denyChallenge();
		}

		//############# SOCKETIO ##################################################################################################
		const socket = SocketioService.socket;
		socket.on('init', handlePlayerNumber);
		socket.on("opponent-status", handleOpponentArrived);
		socket.on('watchGame', handleWatchError);
		socket.on('gameState', handleGameState);
		socket.on('gameOver', handleGameOver);
		socket.on('joinedEmptyGame', handleJoinedEmptyGame);
		// socket.on('tooManyPlayers', handleTooManyPlayers); //two players in room already
		socket.on('joinGame', handleJoinGame);
		socket.on('opponentLeft', handleOpponentLeft);
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
		margin-left: 10%;
		margin-right: 10%;
		aspect-ratio: 5/3;
		background: white;
		min-width: 200px; /*FIND DYNAMIC WAY*/
		/* outline: 10px solid red; */
		border-radius: 2px;
		/* margin: 30px; */
	}

	#leave-match-button {
		margin: 2rem auto;
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