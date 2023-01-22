<template>
	<canvas ref="matchCourtRef" id="match-court"></canvas>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Game from "../models/Game"
import SocketioService from '../services/SocketioService.js'
import { io } from 'socket.io-client'; // OUTSOURCE LATER

export default defineComponent({
	
	setup () {
		let canvas: any, ctx: any;

		// ---------- SOCKETIO: OUTSOURCE TO SERVICE
		const handleInit = (msg: any) => {
			console.log(msg);
		}

		const handleGameState = (gameState: any) => {
			gameState = JSON.parse(gameState);
			requestAnimationFrame( () => paintGame(gameState));
		}

		const socket = io('http://localhost:3003');
		socket.on('init', handleInit);
		socket.on('gameState', handleGameState);
		// ---------- SOCKETIO: OUTSOURCE TO SERVICE END
		


		const init = () => {
			canvas = document.getElementById('match-court');
			ctx = canvas.getContext('2d');

			// REMOVE BLURRINESS ---------------------------------------------------
			let dpi = window.devicePixelRatio;
			const fix_dpi = () => {
				let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
				let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
				canvas.setAttribute('height', styleHeight * dpi);
				canvas.setAttribute('width', styleWidth * dpi);
			}
			fix_dpi();
			// REMOVE BLURRINESS END ---------------------------------------------------

			gameState.paddleWidth = canvas.width/25;
			gameState.paddleHeight = canvas.height/4;
			gameState.ballSize = canvas.width/25;
			gameState.wallOffset = canvas.width/25;
			gameState.player1.pos.x = gameState.wallOffset;
			gameState.player1.pos.y = canvas.height / 2 - gameState.paddleHeight / 2;
			gameState.player2.pos.x = canvas.width - (gameState.wallOffset + gameState.paddleWidth);
			gameState.player2.pos.y = canvas.height / 2 - gameState.paddleHeight / 2;
			gameState.ball.pos.x = canvas.width / 2 - gameState.ballSize / 2;
			gameState.ball.pos.y = canvas.height / 2 - gameState.ballSize / 2;

			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			document.addEventListener('keydown', keydown);
		}

		const keydown = (e: any) => {
			console.log(e.keyCode);
		}

		const paintGame = (state: any) => {
			ctx.fillStyle = "#fff"; // CHANGE BACK TO GAME COLOR
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// maybe remove blurriness HERE

			paintPlayers(state);
		}

		const paintPlayers = (state: any) => {
			ctx.fillStyle = "#AC4018";
			ctx.fillRect(state.player1.pos.x, state.player1.pos.y, state.paddleWidth, state.paddleHeight);
			ctx.fillRect(state.player2.pos.x, state.player2.pos.y, state.paddleWidth, state.paddleHeight);
			ctx.fillRect(state.ball.pos.x, state.ball.pos.y, state.ballSize, state.ballSize);
		}
		
		return { gameState, init, paintGame };
	},

	mounted () {

		this.init();
		this.paintGame(this.gameState);
	}
});
</script>

<style scoped>
	#match-court {
		/* max-width: 100%; */
		/* max-height: 60%; */
		width: 100%;
		/* max-height: 100%; */
		aspect-ratio: 5/3;
		background-color: green;
		min-width: 200px; /*FIND DYNAMIC WAY*/
		/* outline: 10px solid red; */
	}

</style>