<template>
	<div class="popup" @keyup.esc="stopWaitingForPlayer" tabindex="0">
		<div class="popup-inner">
			<slot/>
			<h2>Waiting for second player...</h2>
			<button class="stopWaitingForPlayerButton" @click="stopWaitingForPlayer">Quit (don't wait anymore)</button>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import LoginService from '../services/LoginService'
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'

export default defineComponent({
	name: "match-wait-popup",

	props: ['removeMatchWaitPopup'],

	methods: {
		stopWaitingForPlayer() {
			// dataservice @DESIREE
			// send signal to player2 that player1 is not waiting anymore (if exists)
			this.removeMatchWaitPopup();
		}
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
	padding: 10px 26px;
	/* border-radius: 10%; */
	border-radius: 2px;
	/* width: 50%;
	height: 50%; */

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.popup-inner h2 {
	text-align: center;
}

.user-data-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
}

button {
	margin: 0 auto;
	display: block;
}
</style>
