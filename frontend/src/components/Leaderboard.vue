<template>
	<div class="leaderboard-wrapper">
		<h2>Leaderboard</h2>
		<table id="leaderboard-table">
			<thead id="top-row">
				<tr>
					<th>#</th>
					<th>picture</th>
					<th>name</th>
					<th>wins</th>
				</tr>
			</thead>
			<tbody>
				<tr class="leaderboard-item" v-for="(user, index) in users" :key="index">
					<td>
						{{ user.userid }}
					</td>
					<td>
						<img :src="user.picurl">
					</td>
					<td>
						{{ user.username }}
					</td>
					<td>
						{{ user.statusname }}
					</td>
				</tr>
			</tbody>
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
				console.log(response.data);
				console.log(response.headers);
				console.log(response.data.token);
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
	
	#leaderboard-table {
		border-collapse: collapse;
		overflow: auto;
		max-height: 500px;
		/* table-layout: fixed; */
		display: block;
		position: relative;
		scrollbar-gutter: stable both-edges;
	}
	
	th {
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
	}
	
	

	#leaderboard-table th, td {
		padding: 20px 40px;
		text-align: center;
	}

	/* hover effect on all but the first line */
	#leaderboard-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	/* #leaderboard-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	} */

</style>