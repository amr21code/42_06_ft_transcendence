<template>
	<div class="div-wrapper">
		<MatchWaitPopup id="MatchWaitPopup" v-if="opponentArrived === false" />
		<canvas ref="matchCourtRef" id="match-court"></canvas>
	</div>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import SocketioService from '../services/SocketioService.js'
import { io } from 'socket.io-client'; // OUTSOURCE LATER
import MatchWaitPopup from './MatchWaitPopup.vue';

export default defineComponent({
    setup() {
		// toggle Popup when opponent arrives
		const opponentArrived = ref(false);
		const toggleMatchWaitPopup = (isArrived: boolean) => {
			opponentArrived.value = isArrived;
		}
        let canvas: any, ctx: any;
        // ---------- SOCKETIO: OUTSOURCE TO SERVICE
        // const handleInit = (msg: any) => {
        //     console.log(msg);
        // };
        const handleGameState = (gameState: any) => {
            gameState = JSON.parse(gameState);
            requestAnimationFrame(() => paintGame(gameState));
        };
		
		// ---------- SOCKETIO: OUTSOURCE TO SERVICE END
        const init = () => {
			canvas = document.getElementById("match-court");
            ctx = canvas.getContext("2d");
            // REMOVE BLURRINESS ---------------------------------------------------
            let dpi = window.devicePixelRatio;
            const fix_dpi = () => {
                let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
                let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
                canvas.setAttribute("height", styleHeight * dpi);
                canvas.setAttribute("width", styleWidth * dpi);
            };
            fix_dpi();
            // REMOVE BLURRINESS END ---------------------------------------------------

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
			gameState.canvasHeight = canvas.height;
			gameState.canvasWidth = canvas.width;

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.addEventListener("keydown", keydown);
        };

		function createGameState() {
			return {
				player1: {
					pos: {
						x: 0,
						y: 0,
					},
					y_vel: 0,
				},
				player2: {
					pos: {
						x: 0,
						y: 0,
					},
					y_vel: 0,
				},
				ball: {
					pos: {
						x: 0,
						y: 0,
					},
					vel: {
						x: 0,
						y: 0,
					}
				},
				paddleWidth: 0,
				paddleHeight: 0,
				ballSize: 0,
				wallOffset: 0,
				canvasHeight: 0,
				canvasWidth: 0,
			}
		}

		
        const keydown = (e: any) => {
			console.log(e.keyCode);
        };
		
        const paintGame = (state: any) => {
            ctx.fillStyle = "#fff"; // CHANGE BACK TO GAME COLOR
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            paintPlayers(state);
        };

        const paintPlayers = (state: any) => {
            ctx.fillStyle = "#AC4018";
            ctx.fillRect(state.player1.pos.x, state.player1.pos.y, state.paddleWidth, state.paddleHeight);
            ctx.fillRect(state.player2.pos.x, state.player2.pos.y, state.paddleWidth, state.paddleHeight);
            ctx.fillRect(state.ball.pos.x, state.ball.pos.y, state.ballSize, state.ballSize);
        };
		
		// TEMP##############################

		const gameState = createGameState();

		
		// TEMP##############################

		//############# SOCKETIO ##############
		const socket = SocketioService.socket;
		// socket.on("init", handleInit);
		socket.on("opponent-status", (data: any) => {
			toggleMatchWaitPopup(data);
			console.log(data.data);
		});
		socket.on('gameState', handleGameState);
		////############# SOCKETIO #############
		
        return { opponentArrived, gameState, toggleMatchWaitPopup, init, paintGame };
    },

	methods: {
		checkOpponentStatus() {
			SocketioService.getOpponentStatus()
		},
	},
	

    mounted() {
        // while (this.opponentArrived === false) {
		this.checkOpponentStatus(); // SET CONDITION TO STOP STUFF
		// }
		this.init();
        this.paintGame(this.gameState);
    },
    components: { MatchWaitPopup }
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