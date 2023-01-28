<template>
	<div class="popup" @keyup.esc="toggleUserDataPopup" tabindex="0">
		<div class="popup-inner">
			<slot />
			<h2>{{ user.userid }}'s user data</h2>
			<div class="user-data-wrapper">
				<div>intra name: </div>
				<input disabled type="text" :value="user.userid" /> 
			</div>
			<div class="user-data-wrapper">
				<div>user alias: </div>
				<input type="text" :value="user.username" />
			</div>
			<div class="user-data-wrapper">
				<div>avatar:</div>
				<img id="user-photo" :src="user.picurl" alt="user-photo" width="40" height="40">
			</div>
			<div class="user-data-wrapper">
				<div>member since: {{ memberSince }}</div>
			</div>
			<div class="user-data-wrapper">
				<div>wins: {{ user.wins }}</div>
			</div>
			<div class="user-data-wrapper">
				<div>losses: {{ user.losses }}</div>
			</div>
			<div class="user-data-wrapper">
				<div>achievements:</div>
			</div>
			<div class="user-data-wrapper">
				<div>2-factor-authentication:</div>
			</div>
			<button class="popup-close" @click="toggleUserDataPopup"> 
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
			user: {} as IUser,
			memberSince: {} as string
		}
	},

	props: ['toggleUserDataPopup'],
	methods: {
		retrieveCurrentUser() {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data[0];
				console.log(response.data[0]);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
		formatDate() {
			this.memberSince = new Intl.DateTimeFormat('en-us').format(this.user.created);
		},
	},

	mounted () {
		this.retrieveCurrentUser();
		this.formatDate();
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


</style>

<!-- member since, avatar auswahl, wins, losses, user status, achievements-->