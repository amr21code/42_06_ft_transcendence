<template>
	<div class="friendlist-wrapper">
		<h2>friendlist</h2>
		<table id="friendlist-table">
			<tr>
				<th>picture</th>
				<th>name</th>
				<th>status</th>
			</tr>
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

	.friendlist-wrapper {
		width: 100%;
		padding: 0;
	}
	
	#friendlist-table {
		padding: calc(1px + 1.5625vw);
		padding-top: 0;
		border-collapse: collapse;
		overflow-y: scroll;
		max-height: 500px;
		table-layout: fixed;
		display: block;
		scrollbar-gutter: stable both-edges;
		width: 100%;
	}

	#friendlist-table tr {
		border: var(--second-bg-color) 3px solid;
	}

	#friendlist-table th {
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
	}

	#friendlist-table th, td {
		padding: calc(0.3px + 1.5625vw) calc(0.8px + 1.5625vw);
		text-align: center;
		width: 100%; /*makes table central, but destroys equal width of columns (33% would be equal width)*/
	}

	/* hover effect on all but the first line */
	#friendlist-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	#top-row tr:hover {
		cursor: default;
	}

	.friendlist-item img {
		max-height: 30px;
	}

</style>