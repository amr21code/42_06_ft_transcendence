<template>
	<canvas ref="matchCourtRef" id="match-court"></canvas>
</template>


<!-- <script src="../TMP_GAME.ts"></script> -->

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Game from "../models/Game"

export default defineComponent({
	
	data () {
		return {
			game: {} as Game,
			playerScore1: {} as number,
			playerScore2: {} as number,
		}
	},

	methods: {
		gameLoop(){
			if (!this.game.paused) // PROBLEM HERE
			{
				this.game.update();
				this.game.draw();
				// this.playerScore1 = this.game.playerScore1;
				// this.playerScore1 = this.Game.playerScore2;
			}
			// console.log("player one has ", this.playerScore1);
			requestAnimationFrame(this.gameLoop);
		}
	},

	mounted () {
		this.game = new Game();
		// COMMENT BELOW OUT TO NOT SHOW THE GAME
		requestAnimationFrame(this.gameLoop);
		
	},

})
</script>

<style scoped>
	/* #match-court { */
		/* background-color: var(--second-bg-color);
		border: white solid;
		color: red;
		text-align: center;
		border-radius: 4px;
		background-image:
		radial-gradient(circle at 50% 50%, transparent 15%, white 0 16%, transparent 16%),
		radial-gradient(circle at 50% 50%, transparent 15%, white , transparent 500%),
		radial-gradient(circle at 50% 50%, white 0 14.75%, transparent 15%),
		linear-gradient(to right, transparent 49.75%, white 0 50.25%, transparent 0);
		padding: 30px; */
		/* } */
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