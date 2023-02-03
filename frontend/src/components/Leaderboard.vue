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
					{{ user.wins }}
				</td>
			</tr>
			<MatchHistoryPopup id="MatchHistoryPopup" v-if="showUserHistoryTrigger === true" :untoggleUserHistory="() => untoggleUserHistory()" :userid="selectedUser" :userPhoto="selectedUserPhoto"/>
		</table>
	</div>
</template>


<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import DataService from '../services/DataService'
import { useUserDataStore } from '../stores/myUserDataStore'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import MatchHistoryPopup from './MatchHistoryPopup.vue'

export default defineComponent({

	components: { MatchHistoryPopup },
	async setup() {

		const store = useUserDataStore();
		onMounted(async () => {
			await DataService.getAll()
			.then((response: ResponseData) => {
				store.allUsers = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		});

		const usersByWins = computed(() => {
			return [...store.allUsers].sort((a: IUser, b: IUser) => {
				return a.wins > b.wins ? -1: 1;
			})
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

		return { store, usersByWins, toggleUserHistory, untoggleUserHistory, showUserHistoryTrigger, selectedUser, selectedUserPhoto };
	},
})
</script>


<style scoped>	

	.leaderboard-wrapper {
		width: 100%;
		padding: 0;
		padding-bottom: calc(1px + 1.5625vw);
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
	}

	#leaderboard-table th {
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
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

	/* #top-row tr:hover {
		cursor: default;
	} */

	.leaderboard-item img {
		max-height: 30px;
	}

</style>