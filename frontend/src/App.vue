<template>
<Suspense>
	<div class="app">
		<div class="content-wrap">
			<header>
				<div class="title">
					<h1>The Pong Game</h1>
				</div>
				<div class="top-nav">
					<a class="menuOption" id="game" @click="handleClick('game')">game</a>
					<!-- <a class="menuOption" id="watchSelected" @click="handleClick('watch')">watch</a> -->
					<a class="menuOption" id="chat" @click="handleClick('chat')">chat</a>
					<a class="menuOption" id="leaderboard" @click="handleClick('leaderboard')">leaderboard</a>
					<a class="menuOption" id="friends" @click="handleClick('friends')">friends</a>
					<div class="logged-photo" @click="toggleUserDataPopup()">
						<img :src="store.user.picurl" alt="user-photo" width="40" height="40"> 
					</div>
				</div>
			</header>
			<!-- enforce this properly!-->
			<LoginPopup id="LoginPopup" v-if="loggedIn === 'not authenticated'" :toggleLoginPopup="() => toggleLoginPopup()" />
			<!-- <TwoFaPopup id="TwoFaPopup" v-if="store.user.twofa === 1" :untoggleTwoFaPopup="() => untoggleTwoFaPopup()" /> -->
			<TwoFaPopup id="TwoFaPopup" v-if="loggedIn === '2fa'" :untoggleTwoFaPopup="() => untoggleTwoFaPopup()" :twoFaSuccess="() => twoFaSuccess()"/>
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
import LoginPopup from './components/popups/LoginPopup.vue'
import UserDataPopup from './components/popups/UserDataPopup.vue'
import gotChallengedPopup from './components/popups/GotChallengedPopup.vue'
import TwoFaPopup from './components/popups/TwoFaPopup.vue'
import LoggingService from './services/LoggingService'

import SocketioService from './services/SocketioService.js'
import DataService from './services/DataService'

export default defineComponent({

	name: 'App',
	el: "#app",
	components: { LoginPopup, TwoFaPopup, UserDataPopup, gotChallengedPopup, MatchCourt, SideWindow },
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
		this.socket.on('userdata-refresh', () => {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.store.user = response.data[0];
			})
			.catch((e: Error) => {
				console.log(e);
			});
			DataService.getFriends()
			.then((response: ResponseData) => {
				this.store.friends = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
			DataService.getAll()
			.then((response: ResponseData) => {
				this.store.allUsers = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		})
	},
	beforeUnmount() {
		SocketioService.disconnect();
	},
	
	setup() {
		const store = useUserDataStore();

		const loggedIn = ref('not authenticated');
		const toggleLoginPopup = () => {
			loggedIn.value = 'authenticated';
		}

		// const twoFaActivated = ref(false);
		const untoggleTwoFaPopup = () => {
			document.getElementById("TwoFaPopup")!.style.display = "none";
		}

		const toggleTwoFaPopup = () => {
			document.getElementById("TwoFaPopup")!.style.display = "block";
		}

		const twoFaSuccess = () => {
			loggedIn.value = 'authenticated';
		}

		onMounted(async () => {
			await DataService.getAuthStatus()
			.then((authStatus: any) => {
				loggedIn.value = authStatus.data.msg;
				console.log('Your authentication status is: ', authStatus.data.msg);
			})
			.catch((e: Error) => {
				console.log("Error occured in getAuthStatus", e);
			})

			// only run API calls if successfully logged in
			if (loggedIn.value === 'authenticated')
			{
				await store.getUser();
				await store.getFriends();
				await store.getAllUsers();
				
				if (store.selected === 'game')
					document.getElementById("game")!.style.backgroundColor = "#b04716";
				if (store.selected === 'chat')
					document.getElementById("chat")!.style.backgroundColor = "#b04716";
				if (store.selected === 'leaderboard')
					document.getElementById("leaderboard")!.style.backgroundColor = "#b04716";
				if (store.selected === 'friends')
					document.getElementById("friends")!.style.backgroundColor = "#b04716";
			}

			// overwrite default behavior of back/forward button in browser
			let menuOptions = Array.from(document.getElementsByClassName("menuOption"));
			const selectMenuOption = (id: SelectedSideWindow) => {
				store.selected = id;
				menuOptions.forEach(option => {
					(option as HTMLElement).style.backgroundColor = "#444040";
				});
				if (store.selected === 'game')
					document.getElementById("game")!.style.backgroundColor = "#b04716";
				if (store.selected === 'chat')
					document.getElementById("chat")!.style.backgroundColor = "#b04716";
				if (store.selected === 'leaderboard')
					document.getElementById("leaderboard")!.style.backgroundColor = "#b04716";
				if (store.selected === 'friends')
					document.getElementById("friends")!.style.backgroundColor = "#b04716";
			}

			menuOptions.forEach(option => {
				let id = option.id as SelectedSideWindow;
				option.addEventListener('click', e => {
					history.pushState({id}, '', './' + id);
					selectMenuOption(id);
				});
			});

			window.addEventListener('popstate', e => {
				if (e.state !== null)
					selectMenuOption(e.state.id);
				else
					selectMenuOption('game');
			})

			// make /game default path
			history.pushState("game", '', './game');
			document.getElementById("game")!.style.backgroundColor = "#b04716";
		});

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
		const handleClick = (term: SelectedSideWindow) => {
			store.selected = term;
			var menuElements = Array.from(document.getElementsByClassName('menuOption') as HTMLCollectionOf<HTMLElement>);
			menuElements.forEach((element) => {
				element.style.backgroundColor = "#444040";
			});
			// selected menu highlighting below
			if (store.selected === 'game')
				document.getElementById("game")!.style.backgroundColor = "#b04716";
			if (store.selected === 'chat')
				document.getElementById("chat")!.style.backgroundColor = "#b04716";
			if (store.selected === 'leaderboard')
				document.getElementById("leaderboard")!.style.backgroundColor = "#b04716";
			if (store.selected === 'friends')
				document.getElementById("friends")!.style.backgroundColor = "#b04716";


			// if (store.selected === 'play' || store.selected === 'watch') {
			if (store.selected === 'game') {
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

		
		return { store, untoggleTwoFaPopup, toggleTwoFaPopup, twoFaSuccess, loggedIn, userDataPopupTrigger, gotChallengedPopupTrigger, toggleLoginPopup, toggleUserDataPopup, toggleGotChallengedPopup, handleClick }
	},
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
