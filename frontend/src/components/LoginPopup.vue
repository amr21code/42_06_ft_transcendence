<template>
	<div class="popup" tabindex="0">
		<div class="popup-inner">
			<slot/>
			<h2>welcome to ft_pong</h2>
			<p>please sign in with your 42 account first</p>
			<button class="login_button">
				<a :href="apiLink42" @click="callLoginApi">Sign in with 42</a>
			</button>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import LoginService from '../services/LoginService'
import type { ResponseData } from '../types/ResponseData'

export default defineComponent({
	name: "login-popup",
	
	props: ['toggleLoginPopup'],
	
	setup() {
		const apiLink42 = import.meta.env.VITE_API_42_URL;
		const callLoginApi = () => {
			LoginService.login()
			.then((response: ResponseData)=> {

				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log("Error in login process", e)
			});	
		}
		return { apiLink42, callLoginApi }
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
	padding: 1rem 2rem;
	/* border-radius: 10%; */
	border-radius: 2px;
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

/* unvisited link */
a:link {
	color: var(--first-highlight-color);
}

/* visited link */
a:visited {
	color: var(--first-highlight-color);
}

/* mouse over link */
/* a:hover {
  color: hotpink;
} */

/* selected link */
a:active {
  color: var(--first-highlight-color);
}
</style>
