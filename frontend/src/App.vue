<template>
  <div class="app">
	<div class="content-wrap">

		<header>
			<div class="title">
				<h1>The Pong Game</h1>
			</div>
			<div class="top-nav">
				<a>Play</a>
				<a>Watch</a>
				<a @click="handleClick('chat')">Chat</a>
				<a @click="handleClick('leaderboard')">Leaderboard</a>
				<div class="logged-photo" @click="togglePopup()">
					<img src="./assets/bitcoin-black-white.png" alt="user-photo" width="40" height="40">
				</div>
			</div>
		<!-- <div class="order">
			<button @click="handleClick('title')">order by title</button>
			<button @click="handleClick('salary')">order by salary</button>
			<button @click="handleClick('location')">order by location</button>
		</div> -->
	</header>
	<UserDataPopup id="UserDataPopup" v-if="popupTrigger === true" :togglePopup="() => togglePopup()" />
	<div class="grid-container">
		<MatchCourt />
		<SideWindow :selected="selected"/>
	</div>
	<footer>
		Made with ❤️ by anruland, djedasch, jtomala and raweber
	</footer>
</div>
</div>
</template>


<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import type { SelectedSideWindow } from './types/SelectedSideWindow'
import JobList from './components/JobList.vue'
import MatchCourt from './components/MatchCourt.vue'
import SideWindow from './components/SideWindow.vue'
import UserDataPopup from './components/UserDataPopup.vue'

export default defineComponent({
	
	name: 'App',
	components: { UserDataPopup, MatchCourt, SideWindow },
	setup() {

		const popupTrigger = ref(false);
		const togglePopup = () => {
			popupTrigger.value = !popupTrigger.value;
		}

		const selected = ref<SelectedSideWindow>('chat')
		const handleClick = (term: SelectedSideWindow) => {
			selected.value = term
		}

		return { popupTrigger, togglePopup, handleClick, selected }
	},
	methods: {}
});
</script>



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

	.grid-container {
		display: grid;
		grid-template-columns: 2fr 1fr;
		margin: 20px;
		gap: 20px;
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
