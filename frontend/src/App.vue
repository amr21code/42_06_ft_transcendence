<template>
  <div class="app">
	<header>
		<div class="title">
			<h1>The Pong Game</h1>
		</div>
		<div class="top-nav">
			<a>Leaderboard</a>
			<a>Chat</a>
			<div class="logged-photo">
				<img src="./assets/bitcoin-black-white.png" alt="user-photo" width="40" height="40">
			</div>
		</div>
		<div class="order">
			<button @click="handleClick('title')">order by title</button>
			<button @click="handleClick('salary')">order by salary</button>
			<button @click="handleClick('location')">order by location</button>
		</div>
	</header>
	
	<JobList :jobs="jobs" :order="order" />
  </div>
</template>



<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import type { Job } from './types/Job'
import type { OrderTerm } from './types/OrderTerm'
import JobList from './components/JobList.vue'

export default defineComponent({
	
	name: 'App',
	components: { JobList },
	setup() {
		const jobs = ref<Job[]>([
			{title: 'farm worker', location: 'lon lon ranch', salary: 30000, id: '1'},
			{title: 'accountant', location: 'bureau', salary: 50000, id: '2'},
			{title: 'engineer', location: 'factory', salary: 35000, id: '3'},
			{title: 'fisherman', location: 'loch ness', salary: 10000, id: '4'}
		])

		const order = ref<OrderTerm>('title')
		const handleClick = (term: OrderTerm) => {
			order.value = term
		}

		return { jobs, handleClick, order}
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
  }

  .top-nav a {
	float: left;
	display: block;
	color: white;
	text-align: center;
	padding: 14px 18px;
	text-decoration: none;
	font-size: 18px;
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
	/* object-position: center; */
	/* object-fit: cover; */
	/* background: white;
    transform: translate(-50%, 0);
	position: absolute;
    left: 50%;
	*/
  }
  .logged-photo img {
	background: white;
	border-radius: 50%;
	
  }

  .logged-photo img:hover {
	opacity: 50%;
}
  
  button {
    margin: 0 10px;
    color: #17bf66;
    /* border: 3px solid white; */
	border: 3px solid;
    background: rgb(68, 64, 64);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
</style>
