<template>
	<div class="popup" @keyup.esc="(toggleGotChallengedPopup)" tabindex="0">
		<div class="popup-inner">
			<slot />
			<div class="user-data-wrapper">
				<h2>You just got challenged by {{ challenger }}: </h2>
			</div>
			<div class="button-wrapper">
				<button class="challengeAccept" @click="( sendAcceptSignal(), toggleGotChallengedPopup() )">
					Accept
				</button>
				<button class="popup-close" @click="( sendDenySignal(), toggleGotChallengedPopup() )"> 
					Deny
				</button>
			</div>
		</div>
	</div>
</template>



<script lang="ts">
import { defineComponent, ref } from 'vue'
import DataService from '../../services/DataService'
import SocketioService from '../../services/SocketioService'
import { useUserDataStore } from '../../stores/myUserDataStore'

export default defineComponent({
	name: "got-challenged-popup",
	
	data () {
		return {
			socket: SocketioService.socket,
		}
	},

	props: {
		['toggleGotChallengedPopup'] : {
			required: true,
			type: Function
		},
		challenger : {
			required: true,
			type: String
		},
	},

	setup() {
		const store = useUserDataStore();
		const socket = SocketioService.socket;

		const sendAcceptSignal = () => {
			// console.log("accepting challenge", store.user);
			socket.emit('create-new-game', store.user.userid);
		};

		const sendDenySignal = async () => {
			// console.log("denying challenge");
			await DataService.denyChallenge();
		}

		return { store, sendAcceptSignal, sendDenySignal };
	},
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
	max-width: 80vw;
}

.popup-inner h2 {
	text-align: center;
}

.user-data-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
}

.button-wrapper {
	text-align: center;
}

.button-wrapper button {
	margin: 0.5rem;
}

</style>