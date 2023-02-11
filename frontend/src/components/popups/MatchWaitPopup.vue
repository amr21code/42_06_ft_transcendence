<template>
	<div class="popup" @keyup.esc="stopWaitingForPlayer" tabindex="0">
		<div class="popup-inner">
			<slot/>
			<h2>waiting for second player...</h2>
			<button class="stopWaitingForPlayerButton" @click="stopWaitingForPlayer">Quit (don't wait anymore)</button>
		</div>
	</div>
</template>



<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "match-wait-popup",

	props: ['removeMatchWaitPopup'],

	setup(props) {
		const stopWaitingForPlayer = () => {
			// send signal to player2 that player1 is not waiting anymore (if exists)
			props.removeMatchWaitPopup();
		}
		return { stopWaitingForPlayer };
	}
})
</script>



<style scoped>
.popup {
	text-align: left;
	background-color: rgba(0,0,0,0.8);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 98; /*brings to highest front-layer*/
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-inner {
	background-color: var(--second-bg-color);
	padding: 1rem 2rem;
	border-radius: 2px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.popup-inner h2 {
	text-align: center;
}

.popup-inner button {
	margin: 0 auto;
	display: block;
}

</style>
