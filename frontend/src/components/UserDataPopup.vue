<template>
	<div class="popup" @keyup.esc="toggleUserDataPopup" tabindex="0">
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
				<img id="user-photo" :src="user.picurl" alt="user-photo">
			</div>
			<div class="user-data-wrapper">
				<div>select new avatar:</div>
				<img @click="changeAvatar(42)" id="select-photo" :src="user.profilepic42" alt="avatar-photo">
				<img @click="changeAvatar(0)" id="select-photo" src="../assets/bitcoin-black-white.png" alt="avatar-photo">
				<img @click="changeAvatar(1)" id="select-photo" src="../assets/DefaultBoy.png" alt="avatar-photo">
				<img @click="changeAvatar(2)" id="select-photo" src="../assets/DefaultGirl.png" alt="avatar-photo">
				<img @click="changeAvatar(3)" id="select-photo" src="../assets/mrburns.png" alt="avatar-photo">
				<img @click="changeAvatar(4)" id="select-photo" src="../assets/gui.png" alt="avatar-photo">
				<!-- <a v-if="toggleAvatar === true">Hier könnte Ihre Werbung stehen!</a> -->
			</div>
			<div class="user-data-wrapper game-color-wrapper">
				<div>select game color:</div>
				<div @click="changePaddleColor('ffffff')" class="select-color" id="select-color1"></div>
				<div @click="changePaddleColor('444040')" class="select-color" id="select-color2"></div>
				<div @click="changePaddleColor('00cc00')" class="select-color" id="select-color3"></div>
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
import { ref, defineComponent, onMounted } from 'vue'
import DataService from '../services/DataService'
import { useUserDataStore } from '../stores/myUserDataStore'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'

export default defineComponent({

	props: ['toggleUserDataPopup'],

	setup() {
		// ADD STORE HERE!
		const store = useUserDataStore();
		const user = ref({} as IUser);
		const memberSince = ref('');
		const newUsername = ref('');
		const toggleUsername = ref(false);

		onMounted(async () => {
			await DataService.getUser()
			.then((response: ResponseData) => {
				user.value = response.data[0];
				// console.log(user);
				if (user.value.paddlecolor === "ffffff") {
					document.getElementById("select-color1")!.style.border = "2px solid black";
					document.getElementById("select-color1")!.style.opacity = "100%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (user.value.paddlecolor === "444040") {	
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "2px solid black";
					document.getElementById("select-color2")!.style.opacity = "100%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (user.value.paddlecolor === "00cc00") {
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "2px solid black";
					document.getElementById("select-color3")!.style.opacity = "100%";
				}
			})
			.catch((e: Error) => {
				console.log(e);
			});
		});

		const formatDate = () => {
			memberSince.value = new Intl.DateTimeFormat('en-us').format(user.value.created);
		}

		const toggleChangeUsername = () => {
			toggleUsername.value = !toggleUsername.value;
		}

		formatDate();

		return { user, memberSince, toggleUsername, newUsername, toggleChangeUsername };
	},

	methods: {
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data[0];
				if (this.user.paddlecolor === "ffffff") {
					document.getElementById("select-color1")!.style.border = "2px solid black";
					document.getElementById("select-color1")!.style.opacity = "100%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (this.user.paddlecolor === "444040") {	
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "2px solid black";
					document.getElementById("select-color2")!.style.opacity = "100%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (this.user.paddlecolor === "00cc00") {
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "2px solid black";
					document.getElementById("select-color3")!.style.opacity = "100%";
				}
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},		

		async changeUsername(newUsername : string){
			await DataService.changeUsername(this.user.userid, newUsername);
			this.newUsername = '';
			this.retrieveCurrentUser();
		},

		async changeAvatar(id : number) {
			await DataService.changeAvatar(this.user.userid, id)
			.then((response: ResponseData) => {
				this.retrieveCurrentUser();
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		async changePaddleColor(color : string) {
			await DataService.changePaddleColor(this.user.userid, color)
			.then((response: ResponseData) => {
				this.retrieveCurrentUser();
			})
			.catch((e: Error) => {
				console.log(e);
			});
		}
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
	width : 7rem;
	height: 7rem;
	object-fit: cover;
	border-radius: 50%;
	background: white;
	margin: 3%;
}

#select-photo {
	height: 70px;
	width: 70px;
	object-fit: cover;
	cursor: pointer;
	margin: 1rem;
	background: white;
	border-radius: 50%;
}

#select-photo:hover {
	opacity: 50%;
}
.select-color {
	height: 70px;
	width: 70px;
	object-fit: cover;
	cursor: pointer;
	margin: 1rem;
	border: none;
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
}

/* ISSUE HERE */
#select-color1:hover {
	background-color: black;
	opacity: 100%;
}

#select-color2:hover {
	background-color: black;
	opacity: 100%;
}

#select-color3:hover {
	background-color: black;
	opacity: 100%;
}
/* ISSUE ABOVE */

#select-color1 {
	background: white;
}

#select-color2 {
	
	background: var(--first-highlight-color);
}

#select-color3 {
	background: var(--second-highlight-color);;
}

</style>

<!-- member since, avatar auswahl, wins, losses, user status, achievements-->