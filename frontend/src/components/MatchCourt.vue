<template>
	<div class="match-court">
		Match Court
		<div class="player_one"></div>
		<div class="player_two"></div>
		<div class="play-ball"></div>
	</div>	
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({

	components: {}
})
</script>

<style>
	.match-court {
		background-color: var(--second-bg-color);
		border: white solid;
		color: red;
		text-align: center;
		aspect-ratio: 5/3;
		border-radius: 4px;
		background-image:
			radial-gradient(circle at 50% 50%, transparent 15%, white 0 16%, transparent 16%),
			/* radial-gradient(circle at 50% 50%, transparent 15%, white , transparent 500%), */
			/* radial-gradient(circle at 50% 50%, white 0 14.75%, transparent 15%), */
			linear-gradient(to right, transparent 49.75%, white 0 50.25%, transparent 0);
		/* padding: 30px; */
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