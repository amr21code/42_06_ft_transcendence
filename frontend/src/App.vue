<template>
  <div class="app">
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
	
	<!-- <JobList :jobs="jobs" :order="order" /> -->

	<div class="grid-container">
		<MatchCourt />
		<SideWindow :selected="selected"/>
		<!-- <div class="side-window" v-if="selected === 'leaderboard'">
			Leaderboard Window
			<ul>
				<li>this</li>
				<li>is</li>
				<li>leaderboard</li>
			</ul>
		</div>		
		<div class="side-window" v-if="selected === 'chat'">
			Chat Window
			<p>hello world, this is our chat</p>
		</div>		 -->
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
	header {
		text-align: center;
	}

	header .order {
		margin-top: 20px;
	}

	.top-nav {
		overflow: hidden;
		background-color: rgb(68, 64, 64);
		width: 100% !important;
		margin: 0 0 1em 0;
		padding: 0px;
		left:0px;
		right:0px;
	}

	.top-nav a {
		float: left;
		display: block;
		color: white;
		text-align: center;
		padding: 14px 18px;
		text-decoration: none;
		font-size: 18px;
		cursor: pointer;
	}

	.top-nav a:hover {
		background-color: rgb(172, 64, 24);
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

/* Later in components */

	.grid-container {
		display: grid;
		/* grid-template-columns: none; */
		grid-template-columns: 2fr 1fr;
		margin: 20px;
		gap: 20px;
		height: 400px;
		
	}
	
	.side-window {
		background-color: white;
		color: red;
		border-radius: 4px;
		padding: 30px;
	}
/* END in components */
  
	button {
		margin: 0 10px;
		color: #17bf66;
		/* border: 3px solid white; */
		border: 3px solid;
		background: #444040;
		padding: 8px 16px;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
	}
</style>
