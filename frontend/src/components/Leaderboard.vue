<template>
	<div class="leaderboard-wrapper">
		<h2>leaderboard</h2>
		<table id="leaderboard-table">
			<tr>
				<th>#</th>
				<th>picture</th>
				<th>name</th>
				<th>wins</th>
			</tr>
			<tr class="leaderboard-item">
				<td>hello</td>
				<td>hello</td>
				<td>hello</td>
				<td>hello</td>
			</tr>
			<tr class="leaderboard-item" v-for="(user, index) in users" :key="index">
				<td>
					{{ index + 1 }}
				</td>
				<td>
					<img :src="user.picurl">
				</td>
				<td>
					{{ user.username }}
				</td>
				<td>
					{{ user.wins }}
				</td>
			</tr>
		</table>
	</div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'

export default defineComponent({
	name: 'leaderboard-window',
	data () {
		return {
			users: [] as IUser[]
		}
	},
	methods: {
		retrieveUsers() {
			DataService.getAll()
			.then((response: ResponseData) => {
				this.users = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		}
	},

	mounted () {
		this.retrieveUsers();
	}
})
</script>


<style scoped>	

	.leaderboard-wrapper {
		width: 100%;
		padding: 0;
		padding-bottom: calc(1px + 1.5625vw);
	}

	#leaderboard-table {
		padding: calc(1px + 1.5625vw);
		padding-top: 0;
		border-collapse: collapse;
		overflow-y: scroll;
		max-height: 500px;
		table-layout: fixed;
		display: block;
		position: relative;
		scrollbar-gutter: stable both-edges;
		width: 100%;
	}

	#leaderboard-table tr {
		border: var(--second-bg-color) 3px solid;
	}

	#leaderboard-table th {
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
	}

	#leaderboard-table th, td {
		padding: calc(0.3px + 1.5625vw) calc(0.8px + 1.5625vw);
		text-align: center;
		width: 100%; /*makes table central, but destroys equal width of columns (33% would be equal width)*/
	}

	/* hover effect on all but the first line */
	#leaderboard-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	#top-row tr:hover {
		cursor: default;
	}

	.leaderboard-item img {
		max-height: 30px;
	}

</style>