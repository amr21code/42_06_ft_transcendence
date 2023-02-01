<template>
	<div class="popup" @keyup.esc="untoggleUserHistory()" tabindex="0">
		<div class="popup-inner">
			<slot />
			<h2>{{ userid }}'s match history</h2>
			<div class="user-photo-div">
				<img :src="userPhoto">
				<button class="add-friend-button">Add friend</button>
			</div>

			<table id="history-table">
				<tr id="top-row">
					<th>player1</th>
					<th></th>
					<th></th>
					<th>player2</th>
					<th>type</th>
				</tr>
				<tr class="history-item" v-for="(match) in matchHistory" :key="match.match_id">
					<td>
						{{ match.user1 }}
					</td>
					<td>
						{{ match.user1_score }}
					</td>
					<td>
						{{ match.user2_score }}
					</td>
					<td>
						{{ match.user2 }}
					</td>
					<td>
						{{ match.challenge === 1 ? "challenge" : "random" }}
					</td>
				</tr>
			</table>
			
			<!-- <div class="user-data-wrapper">
				<div>avatar:</div>
				<img id="user-photo" :src="user.picurl" alt="user-photo"	>
			</div>
		
			<div class="user-data-wrapper">
				<div>wins: {{ user.wins }}</div>
			</div>
			<div class="user-data-wrapper">
				<div>losses: {{ user.losses }}</div>
			</div>
			<div class="user-data-wrapper">
				<div>achievements:</div>
			</div> -->
			<button class="popup-close" @click="untoggleUserHistory()"> 
				Close
			</button>
		</div>
	</div>
</template>


<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue'
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { ISingleMatchHistory } from '../types/SingleMatchHistory'

export default defineComponent({

	props: {
		['untoggleUserHistory'] : {
			required: true,
			type: Function,
		},
		userid : {
			required: true,
			type: String,
		},
		userPhoto : {
			required: true,
			type: String,
		}
	},
	setup(props) {
		const matchHistory = ref([] as ISingleMatchHistory[]);
		onMounted(async () => {
			DataService.getMatchHistory(props.userid)
			.then((response: ResponseData) => {
				matchHistory.value = response.data;
				console.log(matchHistory.value);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		});
		return { matchHistory };
	}
	
})
</script>


<style scoped>
.popup {
	text-align: left;
	background-color: rgba(0,0,0,0.8);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 98; /*brings to second front-layer (behind login popup)*/
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-inner {
	background-color: var(--second-bg-color);
	padding: 1rem 2rem;
	/* border-radius: 10%; */
	border-radius: 2px;
	color: white;
}

.popup-inner h2 {
	text-align: center;

	
}

.user-photo-div {
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 2rem;
}

.user-photo-div img {
	width : 7rem;
	height: 7rem;
	object-fit: cover;
	border-radius: 50%;
	
}

.add-friend-button {
	margin: 2rem;
	
}


#history-table {
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
	margin-bottom: 2rem;
}

#history-table tr {
	border: var(--second-bg-color) 3px solid;
}


#history-table th, td {
	padding: calc(-10px + 1.5625vw) calc(-5px + 1.5625vw);
	text-align: center;
	width: 100%; /*makes table central, but destroys equal width of columns (33% would be equal width)*/
	background: white;
	color: var(--second-bg-color);
}

#history-table th {
	position: sticky;
	top: 0;
	background-color: black;
	color: white;
}

</style>

<!-- member since, avatar auswahl, wins, losses, user status, achievements-->

