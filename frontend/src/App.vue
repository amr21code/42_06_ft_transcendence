<template>
	<div class="app">
		<div class="content-wrap">
			<header>
				<div class="title">
					<h1>The Pong Game</h1>
				</div>
				<div class="top-nav">
					<a @click="handleClick('play')">Play</a>
					<a @click="handleClick('watch')">Watch</a>
					<a @click="handleClick('chat')">Chat</a>
					<a @click="handleClick('leaderboard')">Leaderboard</a>
					<a @click="handleClick('friendlist')">Friends</a>
					<div class="logged-photo" @click="toggleUserDataPopup()">
						<img src="./assets/bitcoin-black-white.png" alt="user-photo" width="40" height="40">
					</div>
				</div>
			</header>
			<LoginPopup id="LoginPopup" v-if="loggedIn === false" :toggleLoginPopup="() => toggleLoginPopup()" />
				<!-- make Game stop while loggedIn === false -->
			<UserDataPopup id="UserDataPopup" v-if="userDataPopupTrigger === true" :toggleUserDataPopup="() => toggleUserDataPopup()" />
			<!-- <div v-if="selected !== 'play' && selected !== 'watch'" class="game-part-screen"> -->
			<div class="game-part-screen">
				<div class="placeholder"></div>
				<MatchCourt ref="matchCourtRef2"/>
				<SideWindow :selected="selected"/>
			</div>
			<!-- BEGIN ONLY TEMPORARY, should be implemented above -->
			<!-- <div class="game-full-screen" v-if="selected === 'play' || selected === 'watch'"> -->
				<!-- <MatchCourt ref="matchCourtRef1"/> -->
			<!-- </div> -->
			<!-- ONLY TEMPORARY, should be implemented above END -->
			<footer>
				Made with ❤️ by anruland, djedasch, jtomala and raweber
			</footer>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import type { SelectedSideWindow } from './types/SelectedSideWindow'
import MatchCourt from './components/MatchCourt.vue'
import SideWindow from './components/SideWindow.vue'
import LoginPopup from './components/LoginPopup.vue'
import UserDataPopup from './components/UserDataPopup.vue'
import LoggingService from './services/LoggingService'

import SocketioService from './services/SocketioService.js'
import DataService from './services/DataService'

export default defineComponent({

	name: 'App',
	el: "#app",
	components: { LoginPopup, UserDataPopup, MatchCourt, SideWindow },
	created () {
		console.log('connecting to socket.io');
		var io = SocketioService.setupSocketConnection();
		// io.on('chat-message', (data : any) => {
		// 	console.log('App.vue: ', data);
		// });
	},
	beforeUnmount() {
		SocketioService.disconnect();
	},
	
	setup() {
		const loggedIn = ref(true); // CHANGE THIS BACK TO FALSE
		const toggleLoginPopup = () => {
			loggedIn.value = !loggedIn.value;
		}
		// for user data popup (user data)
		const userDataPopupTrigger = ref(false);
		const toggleUserDataPopup = () => {
			userDataPopupTrigger.value = !userDataPopupTrigger.value;
		}
		// for side window selection
		const selected = ref<SelectedSideWindow>('play');
		const handleClick = (term: SelectedSideWindow) => {
			selected.value = term;
			if (selected.value === 'play' || selected.value === 'watch') {
				document.documentElement.style.setProperty("--leftofgame_fr", "0.2fr");
				document.documentElement.style.setProperty("--game_fr", "1fr");
				document.documentElement.style.setProperty("--sidewindow_fr", "0.2fr");
			}
			else {
				document.documentElement.style.setProperty("--leftofgame_fr", "0fr");
				document.documentElement.style.setProperty("--game_fr", "2fr");
				document.documentElement.style.setProperty("--sidewindow_fr", "1fr");
			}
			// console.log("game fr value: ", document.documentElement.style.getPropertyValue("--game_fr"));
			// console.log("sidewindow fr value: ", document.documentElement.style.getPropertyValue("--sidewindow_fr"));
		};
		return { loggedIn, userDataPopupTrigger, toggleLoginPopup, toggleUserDataPopup, handleClick, selected }
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

	#app { /*TEMP*/
		height: 100%;
		max-height: 100%;
	}

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
		background-color: var(--first-highlight-color);
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
	}
	
	.logged-photo img:hover {
		opacity: 50%;
	}

	.game-part-screen {
		display: grid;
		/* grid-template-columns: 0.2fr 1fr 0.2fr; */
		grid-template-columns:  var(--leftofgame_fr) var(--game_fr) var(--sidewindow_fr);
		margin: 20px;
		gap: 20px;
		max-height: 70vh;
	}
	
	.game-part-screen MatchCourt {
		aspect-ratio: 5/3;
		min-width: 66%;
	}

	/*.game-full-screen {
		max-height: 70vh; find something more elegant
		margin: 40px auto;
		gap: 20px;
		outline: 10px solid purple;
	} */

	footer {
		text-align: center;
		/* background-color: var(--second-bg-color); */
		/* padding: 10px; */
		padding-top: 4px;
		padding-bottom: 4px;

		position: fixed;
		bottom: 0;
		width: 100%;
		/* height: 2.5rem; */
	}
</style>
