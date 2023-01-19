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
			<div v-if="selected !== 'play' && selected !== 'watch'" class="game-part-screen">
				<MatchCourt ref="matchCourtRef2"/>
				<SideWindow :selected="selected"/>
			</div>
			<!-- BEGIN ONLY TEMPORARY, should be implemented above -->
			<div class="game-full-screen" v-if="selected === 'play' || selected === 'watch'">
				<MatchCourt ref="matchCourtRef1"/>
			</div>
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

export default defineComponent({
	
	name: 'App',
	el: "#app",
	components: { LoginPopup, UserDataPopup, MatchCourt, SideWindow },
	created () {
		console.log('connecting to socket.io');
		SocketioService.setupSocketConnection();
	},
	beforeUnmount() {
		SocketioService.disconnect();
	},
	
	setup() {

		

		// console.log(import.meta.env.VITE_TEST);
		// console.log(process.env.BASE_URL);

		// fetch('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6627b6e06635604efe0143bdaabec14c22c6f69d741ae654619148e7d2dea5be&redirect_uri=http%3A%2F%2F192.168.56.2%3A3000%2Fauth%2Freturn&response_type=code')
		// .then(response => response.json())
		// .then(function(response) {
		// 	console.log("test", response);
		// });
		// LoggingService.getLog()
		// .then((response: Response)=> {
		// 		console.log(response);
		// 		// console.log(response); 
		// 	})
		// 	.catch((e: Error) => console.log("Error occured"));
		// for login popup (42 login)
		const loggedIn = ref(false); // make 'false' for not showing login screen
		const toggleLoginPopup = () => {
			loggedIn.value = !loggedIn.value; // make this read the session
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
		};

		return { loggedIn, userDataPopupTrigger, toggleLoginPopup, toggleUserDataPopup, handleClick, selected }
	},
	// mounted() {
	// 	// pause game, if "SPACE" is clicked
	// 	this.$el.querySelector('game-part-screen').addEventListener('keydown', (e: any) => {
	// 		var key = e.code;
	// 		if (["Space"].indexOf(e.code) > -1 || ["KeyP"].indexOf(e.code) > -1 )// p key
	// 		{
	// 			this.$refs.matchCourtRef1.game.togglePause(); // HOW?
	// 			console.log("called toggle");
	// 		}
	// 	});
	// }
});
</script>

<!-- if session cookie-> /auth/status -> 'authenticated' -> popup weg-->
<!-- 'not authenticated' ->cookie löschen-->
<!-- if not cookie-> popup -->


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
		grid-template-columns: 2fr 1fr;
		margin: 20px;
		gap: 20px;
	}

	.game-part-screen MatchCourt {
		min-width: 66%;
	}

	.game-full-screen {
		max-height: 70vh; /*find something more elegant*/
		aspect-ratio: 5/3;
		margin: 40px auto;
		gap: 20px;
		/* outline: 10px solid purple; */
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
		/* height: 2.5rem; */
	}
</style>
