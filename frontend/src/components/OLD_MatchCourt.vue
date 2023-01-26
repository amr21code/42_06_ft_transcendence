<template>
	<canvas ref="matchCourtRef" id="match-court"></canvas>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Game from "../models/Game"
import SocketioService from '../services/SocketioService.js'

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
				this.playerScore1 = Game.playerScore1;
				this.playerScore2 = Game.playerScore2;
			}
			// console.log("player one has ", this.playerScore1);
			requestAnimationFrame(this.gameLoop);
		}
	},
	created () {
		this.playerScore1 = 0;
		this.playerScore2 = 0;
		console.log("beforeMount called");
	},

	mounted () {
		this.game = new Game(this.playerScore1, this.playerScore2);
		// COMMENT BELOW OUT TO NOT SHOW THE GAME
		console.log("mounted called");
		requestAnimationFrame(this.gameLoop);
	},
})
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