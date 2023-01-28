<template>
	<div class="friendlist-wrapper">
		<h2>friendlist</h2>
		<table id="friendlist-table">
			<thead id="top-row">
				<tr>
					<th>picture</th>
					<th>name</th>
					<th>status</th>
					<th>invite</th>
				</tr>
			</thead>
			<tbody>
				<tr class="friendlist-item" v-for="(friend, index) in friends" :key="index">
					<td>
						<img :src="friend.picurl">
					</td>
					<td>
						{{ friend.username }}
					</td>
					<td>
						{{ friend.statusname }}
					</td>
					<td>
						<button class="invite-button">challenge</button>
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
	name: 'friendlist-window',
	data () {
		return {
			user: {} as IUser,
			friends: [] as IUser[]
		}
	},
	methods: {
		retrieveCurrentUser() {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
		retrieveFriends() {
			DataService.getFriends()
			.then((response: ResponseData) => {
				this.friends = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		}
	},

	mounted () {
		this.retrieveFriends();
	}
})
</script>


<style scoped>	
	
	#friendlist-table {
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

	#friendlist-table th, td {
		padding: 20px 40px;
		text-align: center;
	}

	/* hover effect on all but the first line */
	#friendlist-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	.friendlist-item img {
		max-height: 30px;
	}

	/* #friendlist-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	} */



</style>