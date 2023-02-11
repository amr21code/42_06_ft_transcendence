<template>
	<div class="leaderboard-wrapper">
		<h2>leaderboard</h2>
		<table id="leaderboard-table">
			<tr id="top-row">
				<th>#</th>
				<th>picture</th>
				<th>name</th>
				<th>wins</th>
			</tr>
			<tr class="leaderboard-item" @click="toggleUserHistory(user)" v-for="(user, index) in usersByWins" :key="user.userid">
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
					{{ user.wins }} wins
				</td>
			</tr>
			<MatchHistoryPopup id="MatchHistoryPopup" v-if="showUserHistoryTrigger === true" :untoggleUserHistory="() => untoggleUserHistory()" :userid="selectedUser" :userPhoto="selectedUserPhoto"/>
		</table>
	</div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useUserDataStore } from '../stores/myUserDataStore'
import MatchHistoryPopup from './popups/MatchHistoryPopup.vue'

export default defineComponent({

	components: { MatchHistoryPopup },
	setup() {

		const store = useUserDataStore();
		const usersByWins = store.allUsers;
			
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

		onMounted(async () => {
			await store.getUser();
			await store.getAllUsers();
		});

		return { store, usersByWins, toggleUserHistory, untoggleUserHistory, showUserHistoryTrigger, selectedUser, selectedUserPhoto };
	},
})
</script>



<style scoped>	

	.leaderboard-wrapper {
		width: 100%;
		padding: 0;
		padding-bottom: calc(1px + 1.5625vw);
		background: var(--second-bg-color);
		color: white;
	}

	#leaderboard-table {
		padding: calc(3px + 1.5625vw);
		padding-top: 0;
		border-collapse: collapse;
		overflow-y: auto;
		max-height: 500px;
		table-layout: fixed;
		display: block;
		position: relative;
		scrollbar-gutter: stable both-edges;
		width: 100%;
	}

	#leaderboard-table tr {
		border: var(--second-bg-color) 3px solid;
		transition: .4s;
		background: white;
		border-bottom: 2px solid var(--second-bg-color);
		color: var(--second-bg-color);
	}

	#leaderboard-table th {
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
	}

	#top-row {
		border: 2px solid white !important;
	}

	#leaderboard-table th, td {
		padding: calc(-10px + 1.5625vw) calc(-5px + 1.5625vw);
		text-align: center;
		width: 100%; /*makes table central, but destroys equal width of columns (33% would be equal width)*/
		
	}

	/* hover effect on all but the first line */
	#leaderboard-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	.leaderboard-item img {
		height: calc(20px + 1.5625vw);
		width: calc(20px + 1.5625vw);
		object-fit: cover;
		border-radius: 50%;
	}

</style>
