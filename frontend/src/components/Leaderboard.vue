<template>
	<div class="leaderboard-wrapper">
		<h2>Leaderboard</h2>
		<table id="leaderboard-table">
			<!-- PUT FOR LOOP HERE AND MAKE LIST SCROLLABLE -->
			<div id="top-row">

				<tr>
					<th>#</th>
					<th>picture</th>
					<th>name</th>
					<th>wins</th>
				</tr>
			</div>
			<div class="content-rows">
				<tr
					class="leaderboard-item"
					v-for="(user, index) in users"
					:key="index"
					>
					<td>
						{{ user.id }}
					</td>
					<td>
						{{ user.title }}
					</td>
					<td>
						{{ user.completed }}
					</td>
					<td>
						{{ user.userId }}
					</td>
				</tr>
				<!-- <tr>
						<td>1</td>
						<td>
							<img src="../assets/andi_profile.png" alt="user-photo" width="40" height="40">
						</td>
						<td>anruland</td>
						<td>5</td>
					</tr>
					<tr>
						<td>2</td>
						<td>
							<img src="../assets/desiree_profile.png" alt="user-photo" width="40" height="40">
						</td>
						<td>djedasch</td>
						<td>3</td>
					</tr>
					<tr>
						<td>3</td>
						<td>
							<img src="../assets/jorit_profile.png" alt="user-photo" width="40" height="40">
						</td>
						<td>jtomala</td>
						<td>2</td>
					</tr>
					<tr>
						<td>4</td>
						<td>
							<img src="../assets/ralf_profile.png" alt="user-photo" width="40" height="40">
						</td>
						<td>raweber</td>
						<td>1</td>
					</tr>
					<tr>
						<td>4</td>
						<td>
							<img src="../assets/ralf_profile.png" alt="user-photo" width="40" height="40">
						</td>
						<td>raweber</td>
						<td>1</td>
					</tr> -->
			</div>
		</table>
	</div>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { User } from '../types/User'

export default defineComponent({
	name: 'leaderboard-window',
	data () {
		return {
			users: [] as User[]
		}
	},

	methods: {
		retrieveUsers() {
			DataService.getAll()
			.then((response: ResponseData) => {
				this.users = response.data;
				console.log(response.data);
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
	.side-window {
		background-color: white;
		color: red;
		border-radius: 4px;
		padding: 30px;
	}

	#leaderboard-table {
		border-collapse: collapse;
	}

	th {
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
	}
	
	table {
		overflow: auto;
		max-height: 500px;
		table-layout: fixed;
		display: block;
		scrollbar-gutter: stable both-edges;
	}
	

	#leaderboard-table th, td {
		padding: 20px 40px;
		text-align: center;
	}

	/*hover effect on all but the first line*/
	/* #leaderboard-table tr:not(:first-child):hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	} */

	#leaderboard-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	#leaderboard-table img {
		border-radius: 10%;
	}
</style>