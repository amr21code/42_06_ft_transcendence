<template>
<Suspense>
	<div class="app">
		<div class="content-wrap">
			<header>
				<div class="title">
					<h1>The Pong Game</h1>
				</div>
				<div class="top-nav">
					<a class="menuOption" id="playSelected" @click="handleClick('play')">play</a>
					<a class="menuOption" id="watchSelected" @click="handleClick('watch')">watch</a>
					<a class="menuOption" id="chatSelected" @click="handleClick('chat')">chat</a>
					<a class="menuOption" id="leaderboardSelected" @click="handleClick('leaderboard')">leaderboard</a>
					<a class="menuOption" id="friendsSelected" @click="handleClick('friends')">friends</a>
					<div class="logged-photo" @click="toggleUserDataPopup()">
						<img :src="store.user.picurl" alt="user-photo" width="40" height="40"> 
					</div>
				</div>
			</header>
			<!-- enforce this properly!-->
			<LoginPopup id="LoginPopup" v-if="loggedIn === false" :toggleLoginPopup="() => toggleLoginPopup()" />
			<UserDataPopup id="UserDataPopup" v-if="userDataPopupTrigger === true" :toggleUserDataPopup="() => toggleUserDataPopup()" />
			<gotChallengedPopup id="gotChallengedPopup" v-if="gotChallengedPopupTrigger === true" :toggleGotChallengedPopup="() => toggleGotChallengedPopup()" :challenger="challenger"/>
			<div class="game-part-screen">
				<div class="placeholder"></div>
				<MatchCourt ref="matchCourtRef2"/>
				<SideWindow />
			</div>
			<footer>
				Made with ❤️ by anruland, djedasch, jtomala and raweber
			</footer>
		</div>
	</div>
</Suspense>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useUserDataStore } from './stores/myUserDataStore'
import type { SelectedSideWindow } from './types/SelectedSideWindow'
import type { ResponseData } from './types/ResponseData'
import MatchCourt from './components/MatchCourt.vue'
import SideWindow from './components/SideWindow.vue'
import LoginPopup from './components/LoginPopup.vue'
import UserDataPopup from './components/UserDataPopup.vue'
import gotChallengedPopup from './components/GotChallengedPopup.vue'
import LoggingService from './services/LoggingService'

import SocketioService from './services/SocketioService.js'
import DataService from './services/DataService'

export default defineComponent({

	name: 'App',
	el: "#app",
	components: { LoginPopup, UserDataPopup, gotChallengedPopup, MatchCourt, SideWindow },
	data () {
		return {
			socket: SocketioService.setupSocketConnection(),
			challenger : '',
		}
	},
	created () {
		this.socket.on('challengeRequest', (userid : string) => {
			this.challenger = userid;
			this.toggleGotChallengedPopup();
		});
	},
	beforeUnmount() {
		SocketioService.disconnect();
	},
	
	setup() {
		const store = useUserDataStore();

		onMounted(async () => {
			DataService.getUser()
			.then((response: ResponseData) => {
				store.user = response.data[0];
			})
			.catch((e: Error) => {
				console.log(e);
			});
		});

		const loggedIn = ref(true); // CHANGE THIS BACK TO FALSE
		const toggleLoginPopup = () => {
			loggedIn.value = !loggedIn.value;
		}

		// for user data popup (user data)
		const userDataPopupTrigger = ref(false);
		const toggleUserDataPopup = () => {
			userDataPopupTrigger.value = !userDataPopupTrigger.value;
		}

		// for user data popup (user data)
		const gotChallengedPopupTrigger = ref(false);
		const toggleGotChallengedPopup = () => {
			gotChallengedPopupTrigger.value = !gotChallengedPopupTrigger.value;
		}

		// for side window selection
		store.selected = 'play';
		const handleClick = (term: SelectedSideWindow) => {
			store.selected = term;
			var menuElements = Array.from(document.getElementsByClassName('menuOption') as HTMLCollectionOf<HTMLElement>);
			menuElements.forEach((element) => {
				element.style.backgroundColor = "#444040";
			});
			// selected menu highlighting below
			if (store.selected === 'play')
				document.getElementById("playSelected")!.style.backgroundColor = "#b04716";
			if (store.selected === 'watch')
				document.getElementById("watchSelected")!.style.backgroundColor = "#b04716";
			if (store.selected === 'chat')
				document.getElementById("chatSelected")!.style.backgroundColor = "#b04716";
			if (store.selected === 'leaderboard')
				document.getElementById("leaderboardSelected")!.style.backgroundColor = "#b04716";
			if (store.selected === 'friends')
				document.getElementById("friendsSelected")!.style.backgroundColor = "#b04716";


			if (store.selected === 'play' || store.selected === 'watch') {
				document.documentElement.style.setProperty("--leftofgame_fr", "0.2fr");
				document.documentElement.style.setProperty("--game_fr", "1fr");
				document.documentElement.style.setProperty("--sidewindow_fr", "0.2fr");
			}
			else {
				document.documentElement.style.setProperty("--leftofgame_fr", "0fr");
				document.documentElement.style.setProperty("--game_fr", "2fr");
				document.documentElement.style.setProperty("--sidewindow_fr", "1fr");
			}
		};
		
		return { store, loggedIn, userDataPopupTrigger, gotChallengedPopupTrigger, toggleLoginPopup, toggleUserDataPopup, toggleGotChallengedPopup, handleClick }
	},

	methods: {
		checkAuthStatus() {
			DataService.getAuthStatus()
			.then((authStatus: any) => {
				if (authStatus.data.msg !== 'authenticated') { // HERE COMES SESSIONID LATER
					this.loggedIn = false;
				}
				else {
					this.loggedIn = true;
				}
				console.log('Your authentication status is: ', authStatus.data.msg);
			})
			.catch((e: Error) => {
				console.log("Error occured in getAuthStatus", e);
			})
		},
	},
	mounted () {
		this.checkAuthStatus();
	}
});
</script>

<!-- if session cookie-> /auth/status -> 'authenticated' -> popup weg-->
<!-- 'not authenticated' ->cookie löschen-->
<!-- if not cookie-> popup -->
<!-- NEXT: Andi gibt mir statt 'authenticated' die SESSIONID und ich sende die weiter -->


<style scoped>

	header {
		text-align: center;
	}

	.top-nav {
		overflow: hidden;
		background-color: var(--second-bg-color);
		margin: 0 0 1em 0;
		padding: 0px;
		left:0px;
		right:0px;
	}

	.top-nav a {
		float: left;
		display: block;
		color: var(--main-font-color);
		text-align: center;
		padding: 14px 18px;
		text-decoration: none;
		font-size: 18px;
		cursor: pointer;
	}

	.top-nav a:hover {
		background-color: var(--first-highlight-color) !important;
		color: black;
		
	}
	.logged-photo {
		float: right;
		padding: 3px;
		border-radius: 50%;
		cursor: pointer;
		width: 40px;
		height: 40px;
		margin: 3px;
	}
	
	.logged-photo img {
		background: white;
		border-radius: 50%;
		object-fit: cover;
	}
	
	.logged-photo img:hover {
		opacity: 50%;
	}

	.game-part-screen {
		display: grid;
		text-align: center;
		/* grid-template-columns: 0.2fr 1fr 0.2fr; */
		grid-template-columns:  var(--leftofgame_fr) var(--game_fr) var(--sidewindow_fr);
		gap: 30px;
		max-height: 70vh;
		margin: 50px;
		margin-top: 50px;
		/* background: red; */
		align-items:center;
	}
	
	.game-part-screen MatchCourt {
		aspect-ratio: 5/3;
		min-width: 66%;
	}



	footer {
		text-align: center;
		/* background-color: var(--second-bg-color); */
		/* padding: 10px; */
		padding-top: 4px;
		padding-bottom: 4px;

		position: fixed;
		bottom: 0;
		width: 100%;
		/* background: blue; */
		/* height: 1rem; */
	}
</style>
