<template>
	<div class="popup" @keyup.esc="(togglegotKicked)" tabindex="0">
		<div class="popup-inner">
			<slot />
			<div class="text-wrapper">
				<div>
					<h2>You got kicked from the channel</h2>
                    <button class="close-button" @click="(togglegotKicked)">close</button>
					<a></a><br>
				</div>
			</div>
			
		</div>
	</div>
</template>



<script lang="ts">
import { defineComponent } from 'vue'
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'
import SocketioService from '../../services/SocketioService'

export default defineComponent({
	name: "gotKickedPopup",
	
	data () {
		return {
			user: {} as IUser,
			socket: SocketioService.socket,
			password: '' as string
		}
	},

	props: {
		['togglegotKicked'] : {
			required: true,
			type: Function
		},
	},

	methods: {
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data[0];
				console.log(response.data[0]);
			})
			.catch((e: Error) => {
				// console.log(e);
			});
		},
	},

	mounted () {
		this.retrieveCurrentUser();
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
	/* border-radius: 10%; */
	border-radius: 2px;
}

.popup-inner h2 {
	text-align: center;
}

.text-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
    color: white;
}

</style>
