<template>
	<div class="popup" @keyup.esc="(ChatUserdatatogglePopup)" tabindex="0">
		<div class="popup-inner">
			<slot />
			<h2>{{ user.username }}'s user data</h2>
			<div class="user-data-wrapper">
				<div>intra name: </div>
				<input disabled type="text" :value="user.userid" /> 
			</div>
			<div class="user-data-wrapper">
				<div>user alias: </div>
				<input disabled type="text" :value="user.username" v-if="toggleUsername === false"/>
				<button @click="toggleChangeUsername()" v-if="toggleUsername === false">change</button>

				<input type="text" v-model="newUsername" v-if="toggleUsername === true">
				<button @click="(changeUsername(newUsername), toggleChangeUsername())" v-if="toggleUsername === true">submit</button>
			</div>
			<div class="user-data-wrapper">
				<div>avatar:</div>
				<img id="user-photo" :src="user.picurl" alt="user-photo" v-if="toggleAvatar === false">
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
			<button class="popup-close" @click="(ChatUserdatatogglePopup)"> 
				Close
			</button>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'

export default defineComponent({
	name: "ChatUserdataPopup",
	
	data () {
		return {
			user: {} as IUser,
			memberSince: {} as string,
			newUsername: '' as string,
			toggleUsername: false as boolean,
			toggleAvatar: false as boolean,
			avatarError: false as boolean,
		}
	},

	props: {
        ['ChatUserdatatogglePopup'] : {
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
				console.log(e);
			});
		},
		formatDate() {
			this.memberSince = new Intl.DateTimeFormat('en-us').format(this.user.created);
		},
		toggleChangeUsername() {
			this.toggleUsername = !this.toggleUsername;
		},

		async changeUsername(newUsername : string){
			await DataService.changeUsername(this.user.userid, newUsername);
			this.newUsername = '';
			this.retrieveCurrentUser();
		},

		toggleChangeAvatar() {
			this.toggleAvatar = !this.toggleAvatar;
			this.avatarError = false;
		},

		async changeAvatar(id : number) {
			await DataService.changeAvatar(this.user.userid, id)
			.then((response: ResponseData) => {
				this.toggleChangeAvatar();
				this.retrieveCurrentUser();
			})
			.catch((e: Error) => {
				console.log(e);
				this.avatarError = true;
			});
		}
	},

	mounted () {
		this.retrieveCurrentUser();
		this.formatDate();
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
	z-index: 98; /*brings to second front-layer (behind login popup)*/
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-inner {
	background-color: var(--second-bg-color);
	padding: 1rem 2rem;
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
	width: 15%;
	height: 15%;
	margin: 3%;
	background: white;
	border-radius: 50%;
}

#select-photo {
	height: 70px;
	width: 70px;
	cursor: pointer;
	margin: 1rem;
	background: white;
	border-radius: 50%;
}


#select-photo:hover {
	opacity: 50%;
}


</style>

<!-- member since, avatar auswahl, wins, losses, user status, achievements-->