<template>
	<div class="popup" @keyup.esc="toggleUserDataPopup" tabindex="0">
		<div class="popup-inner">
			<slot />
			<h2>{{ user.username }}'s user data</h2>
			<div class="user-data-wrapper">
				<div class="center-user-summary">
					<div id="leaderboard-position-wrapper">
						<div id="leaderboard-position" title="leaderboard rank">#{{ leaderboardRank }}</div>
					</div>
					<div>
						<img id="user-photo" :src="user.picurl" alt="user-photo">
					</div>
					<div id="wins-vs-losses">
						<div class="game-statistic">
							<a title="matches won"> won: {{ user.wins }} </a>
						</div>
						<div class="game-statistic">
							<a title="matches lost"> lost: {{ user.losses }} </a>
						</div>
					</div>
				</div>
			</div>
			<div class="user-data-wrapper">
				<div class="achievements">
					<div class="achievement-wrapper" title="Successfully changed name to one french staff member's name">
						<a id="achievement-gui">the gui</a>
					</div>
					<div class="achievement-wrapper" title="Won a game 11:0">
						<a id="achievement-tooEasy">too easy</a>
					</div>
					<div class="achievement-wrapper" title="Scored first goal in a match">
						<a id="achievement-firstGoal">first blood</a>	
					</div>
				</div>
			</div>
			<div class="user-data-wrapper">
				<div class="naming-wrapper">
					<div>intra name: </div>
					<input disabled type="text" :value="user.userid" /> 
				</div>
				<div class="naming-wrapper">
					<div>user alias: </div>
					<input type="text" @keyup.enter="changeUsername(newUsername)" :placeholder="user.username" v-model="newUsername"/>
				</div>
			</div>
			<div class="user-data-wrapper">
				<div>select new avatar:</div>
				<img @click="changeAvatar(42)" class="select-photo" :src="user.profilepic42" alt="avatar-photo">
				<img @click="changeAvatar(0)" class="select-photo" src="../../avatars/bitcoin.png" alt="avatar-photo">
				<img @click="changeAvatar(1)" class="select-photo" src="../../avatars/mrburns.png" alt="avatar-photo">
				<!-- <img @click="changeAvatar(1)" id="select-photo" src="../../assets/DefaultBoy.png" alt="avatar-photo"> -->
				<!-- <img @click="changeAvatar(2)" id="select-photo" src="../../assets/DefaultGirl.png" alt="avatar-photo"> -->
				<label id="upload-photo-label">
					<input type="file" accept=".png" ref="file" @change="uploadAvatar()" name="" id="2"/>
					<img class="select-photo" src="../../assets/plus_icon.png" alt="avatar-upload" title="upload your own avatar">
				</label>
				<!-- <a v-if="toggleAvatar === true">Hier könnte Ihre Werbung stehen!</a> -->
			</div>
			<div class="user-data-wrapper game-color-wrapper">
				<div>select paddle color:</div>
				<div @click="changePaddleColor('ffffff')" class="select-color" id="select-color1"></div>
				<div @click="changePaddleColor('b04716')" class="select-color" id="select-color2"></div>
				<div @click="changePaddleColor('00cc00')" class="select-color" id="select-color3"></div>
			</div>
			<div class="user-data-wrapper">
				<div>member since: {{ memberSince }}</div>
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
import DataService from '../../services/DataService'
import { useUserDataStore } from '../../stores/myUserDataStore'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'
import moment from 'moment'
import SocketioService from '../../services/SocketioService.js';

export default defineComponent({

	props: ['toggleUserDataPopup'],

	setup() {
		// ADD STORE HERE!
		const store = useUserDataStore();
		const user = ref({} as IUser);
		const memberSince = ref('');
		const newUsername = ref('');
		const leaderboardRank = ref({} as number);
		const file = ref(null);
		const socket = SocketioService.socket;

		onMounted(async () => {
			await DataService.getUser()
			.then((response: ResponseData) => {
				user.value = response.data[0];
				if (user.value.paddlecolor === "ffffff") {
					document.getElementById("select-color1")!.style.border = "2px solid white";
					document.getElementById("select-color1")!.style.opacity = "100%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (user.value.paddlecolor === "b04716") {	
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "2px solid #b04716";
					document.getElementById("select-color2")!.style.opacity = "100%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (user.value.paddlecolor === "00cc00") {
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "2px solid #00cc00";
					document.getElementById("select-color3")!.style.opacity = "100%";
				}
				memberSince.value = moment(String(user.value.created)).format('DD/MM/YYYY');
			})
			.catch((e: Error) => {
				console.log(e);
			});
			await DataService.getAchievements(user.value.userid)
			.then((response: ResponseData) => {
				for (var achievement of response.data) {
					if (achievement.name == "the Gui") {
						document.getElementById("achievement-gui")!.style.opacity = "100%";
						document.getElementById("achievement-gui")!.style.background = "#00cc00";
					}
					else if (achievement.name == "Too easy") {
						document.getElementById("achievement-tooEasy")!.style.opacity = "100%";
						document.getElementById("achievement-tooEasy")!.style.background = "#00cc00";
					}
					else if (achievement.name == "First Blood") {
						document.getElementById("achievement-firstGoal")!.style.opacity = "100%";
						document.getElementById("achievement-firstGoal")!.style.background = "#00cc00";
					}
				}
			})
			.catch((e: Error) => {
				console.log(e);
			});
			await DataService.getLeaderboardPosition(user.value.userid)
			.then((response: ResponseData) => {
				console.log(response.data)
				leaderboardRank.value = response.data
				if (leaderboardRank.value === 1) {
					document.getElementById("leaderboard-position")!.style.background = "gold";
				}
				else if (leaderboardRank.value === 2) {
					document.getElementById("leaderboard-position")!.style.background = "silver";
				}
				else if (leaderboardRank.value === 3) {
					document.getElementById("leaderboard-position")!.style.background = "bronce";
				}
			})
			.catch((e: Error) => {
				console.log(e);
			});
		});

		const uploadAvatar = async() => {
            DataService.uploadAvatar(file.value.files[0]);
        }

		return { store, user, leaderboardRank, memberSince, newUsername, uploadAvatar, file, socket };
	},

	methods: {
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data[0];
				if (this.user.paddlecolor === "ffffff") {
					document.getElementById("select-color1")!.style.border = "2px solid white";
					document.getElementById("select-color1")!.style.opacity = "100%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (this.user.paddlecolor === "b04716") {	
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "2px solid #b04716";
					document.getElementById("select-color2")!.style.opacity = "100%";
					document.getElementById("select-color3")!.style.border = "none";
					document.getElementById("select-color3")!.style.opacity = "30%";
				}
				else if (this.user.paddlecolor === "00cc00") {
					document.getElementById("select-color1")!.style.border = "none";
					document.getElementById("select-color1")!.style.opacity = "30%";
					document.getElementById("select-color2")!.style.border = "none";
					document.getElementById("select-color2")!.style.opacity = "30%";
					document.getElementById("select-color3")!.style.border = "2px solid #00cc00";
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
			this.socket.emit('send-userdata-refresh');
		},

		async changeAvatar(id : number) {
			await DataService.changeAvatar(this.user.userid, id)
			.then((response: ResponseData) => {
				this.retrieveCurrentUser();
				this.socket.emit('send-userdata-refresh');
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		async changePaddleColor(color : string) {
			await DataService.changePaddleColor(this.user.userid, color)
			.then((response: ResponseData) => {
				this.retrieveCurrentUser();
				this.socket.emit('send-userdata-refresh');
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
	margin-bottom: 0.5rem;
	margin-left: 0%;
}
.center-user-summary {
	text-align: center;
	/* display: flex; */
	display: grid;
	align-items: center;
	justify-content: center; 
	justify-content: center;

	grid-template-columns: 1fr 1fr 1fr;
	/* grid-template-columns: 25% 25% 25%; */
	/* outline: 3px solid red; */
}

#user-photo {
	width : 7rem;
	height: 7rem;
	object-fit: cover;
	border-radius: 50%;
	background: white;
	margin: 3%;
}

#leaderboard-position-wrapper {
	display: flex;
	align-items: center;
	justify-content: center; 
	justify-content: center;
}

#leaderboard-position {
	width : 5rem;
	height: 5rem;
	object-fit: cover;
	border-radius: 50%;
	background: white;
	margin: 3%;
	color: var(--second-bg-color);
	font-size: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-family: monospace;
	font-weight: 600;
	/* outline: 3px solid red; */

}

/* #wins-vs-losses {
	outline: 3px solid red;
} */

.game-statistic a {
	width: 7rem;
	margin: 0.5rem;
	align-items: center;
	background-color: white;
	border: 2px solid #000;
	box-sizing: border-box;
	color: #000;
	font-family: monospace;
	cursor: pointer;
	display: inline-flex;
	height: 36px;
	justify-content: center;
	padding: 0 17px;
	text-decoration: none;
	font-weight: 500;
	white-space: nowrap;
}

.achievements {
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: left;
}

.achievement-wrapper {
	display: inline-block;
	justify-content: center;
	margin-bottom: 1rem;
}

.achievement-wrapper a {
	width: 7rem;
	margin: 0.5rem;
	align-items: center;
	background-color: var(--first-highlight-color);
	border: 2px solid #000;
	box-sizing: border-box;
	color: #000;
	font-family: monospace;
	cursor: pointer;
	display: inline-flex;
	height: 36px;
	justify-content: center;
	padding: 0 17px;
	text-align: center;
	text-decoration: none;
	transition: all .4s;
	font-weight: 500;
	white-space: nowrap;
	opacity: 20%;
}




.naming-wrapper {
	display: flex;
	align-items: center;
	/* justify-content: center; */
	margin-left: 0;
}

.naming-wrapper input {
	width: 25%;
	font-family: monospace;
	margin: 0.5rem;
}

::placeholder{ opacity: 0.4 }



.select-photo {
	height: 70px;
	width: 70px;
	object-fit: cover;
	cursor: pointer;
	margin: 1rem;
	margin-bottom: 0;
	background: white;
	border-radius: 50%;
}

input[type="file"] {
    display: none;
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
	margin-bottom: 0;
	border: none;
	border-radius: 50%;
	display: inline-block;
	box-sizing: border-box;
}

#select-color1:hover {
	outline: 3px white solid;
}

#select-color2:hover {
	outline: 3px #b04716 solid;
}

#select-color3:hover {
	outline: 3px #00cc00 solid;
}

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

function moment(arg0: string) {
  throw new Error('Function not implemented.')
}
