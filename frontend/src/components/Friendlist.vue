<template>
	<div class="friendlist-wrapper">
		<h2>friendlist</h2>
		<table id="friendlist-table">
			<tr>
				<th>Picture</th>
				<th>Name</th>
				<th>Online Status</th>
				<th>Friend Status</th>
			</tr>
			<tr class="friendlist-item" @click="toggleUserHistory(friend)" v-for="(friend, index) in store.friends" :key="index">
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
					{{ friend.friendstatus }}
				</td>
			</tr>
			<MatchHistoryPopup id="MatchHistoryPopup" v-if="showUserHistoryTrigger === true" :untoggleUserHistory="() => untoggleUserHistory()" :userid="selectedUser" :userPhoto="selectedUserPhoto"/>
		</table>
	</div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import DataService from '../services/DataService'
import { useUserDataStore } from '../stores/myUserDataStore'
import type { ResponseData } from '../types/ResponseData'
import MatchHistoryPopup from './MatchHistoryPopup.vue'

export default defineComponent({
	
	components: { MatchHistoryPopup },
	props: {
		userid : {
			required: true,
			type: String,
		},
	},
	async setup(props) {	
		const store = useUserDataStore();

		onMounted(async () => {
			await DataService.getFriends()
			.then((response: ResponseData) => {
				store.friends = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		});

		// for user info popup (wins/match history)
		const showUserHistoryTrigger = ref(false);
		const selectedUser = ref("");
		const selectedUserPhoto = ref("");
		const toggleUserHistory = (user: any) => {
			showUserHistoryTrigger.value = true;
			selectedUser.value = user.userid;
			selectedUserPhoto.value = user.picurl;
		}
		const untoggleUserHistory = () => {
			showUserHistoryTrigger.value = false;
			selectedUser.value = "";
		}
		return { store, toggleUserHistory, untoggleUserHistory, showUserHistoryTrigger, selectedUser, selectedUserPhoto };
	},
})
</script>


<style scoped>	

	.friendlist-wrapper {
		width: 100%;
		padding: 0;
	}
	
	#friendlist-table {
		padding: calc(3px + 1.5625vw);
		padding-top: 0;
		border-collapse: collapse;
		overflow-y: auto;
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
		padding: calc(-10px + 1.5625vw) calc(-5px + 1.5625vw);
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
		height: calc(20px + 1.5625vw);
		width: calc(20px + 1.5625vw);
		object-fit: cover;
		border-radius: 50%;
	}

</style>