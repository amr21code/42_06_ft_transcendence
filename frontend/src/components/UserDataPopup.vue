<template>
	<div class="popup" @keyup.esc="togglePopup" tabindex="0">
		<div class="popup-inner">
			<slot />
			<!-- NON-DYNAMIC <h2>raweber's user data</h2> -->
			<h2>{{ user.userid }}'s user data</h2>
			<div class="user-data-wrapper">
				<div>intra name: </div>
				<!-- NON-DYNAMIC <input disabled type="text" value="raweber" /> -->
				<input disabled type="text" :value="user.userid" /> 
			</div>
			<div class="user-data-wrapper">
				<div>user alias: </div>
				<!-- NON-DYNAMIC <input type="text" value="Ralf" /> -->
				<input type="text" :value="user.username" />
			</div>
			<div class="user-data-wrapper">
				<div>Profile picture:</div>
				<img id="user-photo" src="../assets/bitcoin-black-white.png" alt="user-photo" width="40" height="40">
				<!-- <img id="user-photo" src="DB-CONNECTION GOES HERE" alt="user-photo" width="40" height="40"> -->
			</div>
			<div class="user-data-wrapper">
				<div>2-factor-authentication:</div>
			</div>
			<button class="popup-close" @click="togglePopup"> 
				Close
			</button>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'

export default defineComponent({
	name: "user-data-popup",
	
	data () {
		return {
			user: {} as IUser
		}
	},

	props: ['togglePopup'],
	methods: {
		retrieveCurrentUser() {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		}
	},

	mounted () {
		this.retrieveCurrentUser();
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



#user-photo {
	cursor: pointer;
	width: 30%;
	height: 30%;
	margin: 3%;
	background: white;
	border-radius: 50%;
}


#user-photo:hover {
	opacity: 50%;
}

button {
	border-radius: 10%;
}
</style>