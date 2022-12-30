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
				<div class="logged-photo">
					<img src="./assets/bitcoin-black-white.png" alt="user-photo" width="40" height="40">
				</div>
			</div>
		<!-- <div class="order">
			<button @click="handleClick('title')">order by title</button>
			<button @click="handleClick('salary')">order by salary</button>
			<button @click="handleClick('location')">order by location</button>
		</div> -->
	</header>
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
import type { Job } from './types/Job'
import type { SelectedSideWindow } from './types/SelectedSideWindow'
import JobList from './components/JobList.vue'
import MatchCourt from './components/MatchCourt.vue'
import SideWindow from './components/SideWindow.vue'

export default defineComponent({
	
	name: 'App',
	components: { JobList, MatchCourt, SideWindow },
	setup() {
		const jobs = ref<Job[]>([
			{title: 'farm worker', location: 'lon lon ranch', salary: 30000, id: '1'},
			{title: 'accountant', location: 'bureau', salary: 50000, id: '2'},
			{title: 'engineer', location: 'factory', salary: 35000, id: '3'},
			{title: 'fisherman', location: 'loch ness', salary: 10000, id: '4'}
		])

		const selected = ref<SelectedSideWindow>('chat')
		const handleClick = (term: SelectedSideWindow) => {
			selected.value = term
		}

		return { jobs, handleClick, selected }
	},
	methods: {

	}
});
</script>



<style>
	/* .app {
		position: relative;
	}

	.content-wrap {
  		padding-bottom: 2.5rem; 
	} */

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
