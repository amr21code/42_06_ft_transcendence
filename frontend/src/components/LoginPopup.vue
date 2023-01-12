<template>
	<div class="popup" @keyup.esc="toggleLoginPopup" tabindex="0">
		<div class="popup-inner">
			<slot />
			<!-- NON-DYNAMIC <h2>raweber's user data</h2> -->
			<h2>welcome to ft_pong</h2>
			<p>please sign in with your 42 account first</p>
			<button class="login_button" @click="callLoginApi"> 
				Sign in with 42
			</button>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import LoginService from '../services/LoginService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'

export default defineComponent({
	name: "login-popup",
	
	data () {
		return {
			user: {} as IUser
		}
	},

	props: ['toggleLoginPopup'],
	methods: {
		callLoginApi() {

			// LoginService.login();
			LoginService.login()
			.then(()=> console.log("success"))
			.catch((e: Error) => console.log(e));
			// this.toggleLoginPopup();
		}
		// retrieveCurrentUser() {
		// 	DataService.getUser()
		// 	.then((response: ResponseData) => {
		// 		this.user = response.data;
		// 		console.log(response.data);
		// 	})
		// 	.catch((e: Error) => {
		// 		console.log(e);
		// 	});
		// }
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
	z-index: 99; /*brings to highest front-layer*/
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-inner {
	background-color: var(--second-bg-color);
	padding: 10px 26px;
	border-radius: 10%;
}

.popup-inner h2 {
	text-align: center;
}

.user-data-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
}

button {
	/* background-color: #48c774; */
	border-radius: 10%;
	margin: 0 auto;
	display: block;
}
</style>