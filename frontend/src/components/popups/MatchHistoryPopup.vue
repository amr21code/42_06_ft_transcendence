<template>
	<div class="popup" @keyup.esc="untoggleUserHistory()" tabindex="0">
		<div class="popup-inner">
			<slot />
			<h2>{{ userid }}'s match history</h2>

<!-- ############## FRIEND BUTTONS ############################ -->

			<div class="button-wrapper">
				<button id="add-friend-button" @click="friendButtonAction(userid)">add friend</button>
				<button id="block-user-button" @click="blockButtonAction(userid)">block user</button>
			</div>

<!-- ############## OVERVIEW DATA ############################ -->

			<div class="user-data-wrapper">
				<div class="center-user-summary">
					<div id="leaderboard-position-wrapper">
						<div id="leaderboard-position" title="leaderboard rank">#{{ leaderboardRank }}</div>
					</div>
					<div>
						<img id="user-photo" :src="userPhoto" alt="user-photo">
					</div>
					<div id="wins-vs-losses">
						<div class="game-statistic">
							<a title="matches won"> won: {{ userWins }} </a>
						</div>
						<div class="game-statistic">
							<a title="matches lost"> lost: {{ userLosses }} </a>
						</div>
					</div>
				</div>
			</div>
			

<!-- ############## ACHIEVEMENTS ############################ -->
			
			<div class="user-data-wrapper">
				<div class="achievements">
					<div class="achievement-wrapper" title="Successfully changed name to one french staff member's name">
						<a id="achievement-gui">the gui</a>
					</div>
					<div class="achievement-wrapper" title="Won a game 11:0">
						<a id="achievement-tooEasy">too easy</a>
					</div>
					<div class="achievement-wrapper" title="Scored first goal in a match">
						<a id="achievement-firstGoal">first blood</a>	
					</div>
				</div>
			</div>

<!-- ############## HISTORY TABLE ############################ -->

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
						{{ match.challenge === 1 ? "challenge" : "ladder" }}
					</td>
				</tr>
			</table>
			<button class="popup-close" @click="untoggleUserHistory()"> 
				Close
			</button>
		</div>
	</div>
</template>



<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue'
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { ISingleMatchHistory } from '../../types/SingleMatchHistory'
import { useUserDataStore } from '../../stores/myUserDataStore'
import SocketioService from '../../services/SocketioService'
import type { IUser } from '../../types/User'

export default defineComponent({

	props: {
		untoggleUserHistory : {
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
		},
		userWins : {
			required: true,
			type: Number,
		},
		userLosses : {
			required: true,
			type: Number,
		},
	},
	setup(props) {
		const matchHistory = ref([] as ISingleMatchHistory[]);
		const store = useUserDataStore();
		const leaderboardRank = ref({} as number);
		const user = ref({} as IUser);
		const socket = SocketioService.socket;

		const friendButtonAction = async (userid: string) => {
			if (document.getElementById("add-friend-button")!.innerHTML === "add friend") {
				try {
					await DataService.requestFriend(userid);
					socket.emit('send-userdata-refresh');
				} catch {
					document.getElementById("add-friend-button")!.style.background = "#b04716";
					document.getElementById("add-friend-button")!.innerHTML = "error";
				}
				document.getElementById("add-friend-button")!.style.background = "#b04716";
				document.getElementById("add-friend-button")!.innerHTML = "pending";
				document.getElementById("block-user-button")!.style.display = "none";
			}
			else if (document.getElementById("add-friend-button")!.innerHTML === "confirm") {
				try {
					await DataService.confirmFriend(userid);
					socket.emit('send-userdata-refresh');
				} catch {
					document.getElementById("add-friend-button")!.style.background = "#b04716";
					document.getElementById("add-friend-button")!.innerHTML = "error";
				}
				document.getElementById("add-friend-button")!.style.background = "#00cc00";
				document.getElementById("add-friend-button")!.innerHTML = "friends";
				document.getElementById("block-user-button")!.style.display = "none";
			}
			else if (document.getElementById("add-friend-button")!.innerHTML === "pending") {
				try {
					await DataService.removeFriend(userid);
					socket.emit('send-userdata-refresh');
				} catch {
					document.getElementById("add-friend-button")!.style.background = "#b04716";
					document.getElementById("add-friend-button")!.innerHTML = "error";
				}
				document.getElementById("add-friend-button")!.style.background = "#a8b8fd";
				document.getElementById("add-friend-button")!.innerHTML = "add friend";
				document.getElementById("block-user-button")!.style.display = "inline-block";
			}
			else if (document.getElementById("add-friend-button")!.innerHTML === "friends") {
				try {
					await DataService.removeFriend(userid);
					socket.emit('send-userdata-refresh');
				} catch {
					document.getElementById("add-friend-button")!.style.background = "#b04716";
					document.getElementById("add-friend-button")!.innerHTML = "error";
				}
				document.getElementById("add-friend-button")!.style.background = "#a8b8fd";
				document.getElementById("add-friend-button")!.innerHTML = "add friend";
				document.getElementById("block-user-button")!.style.display = "block";
			}
		}

		const blockButtonAction = async (userid: string) => {
			if (document.getElementById("block-user-button")!.innerHTML === "block user") {
				try {
					await DataService.blockUser(userid);
					socket.emit('send-userdata-refresh');
				} catch {
					document.getElementById("block-user-button")!.style.background = "#b04716";
					document.getElementById("block-user-button")!.innerHTML = "error";
				}
				document.getElementById("block-user-button")!.innerHTML = "blocked";
				document.getElementById("block-user-button")!.style.background = "#131313";
				document.getElementById("block-user-button")!.style.color = "#ffffff";
				document.getElementById("add-friend-button")!.style.display = "none";
			}
			else if (document.getElementById("block-user-button")!.innerHTML === "blocked") {
				try {
					await DataService.unblockUser(userid);
					socket.emit('send-userdata-refresh');
				} catch {
					document.getElementById("block-user-button")!.style.background = "#b04716";
					document.getElementById("block-user-button")!.innerHTML = "error";
				}
				document.getElementById("block-user-button")!.innerHTML = "block user";
				document.getElementById("block-user-button")!.style.background = "#ffffff";
				document.getElementById("block-user-button")!.style.color = "#131313";
				document.getElementById("add-friend-button")!.style.display = "block";
			}
		}
		
		onMounted(async () => {

			await DataService.getMatchHistory(props.userid)
			.then((response: ResponseData) => {
				matchHistory.value = response.data;
			})
			.catch((e: Error) => {
				// console.log(e);
			});

			document.getElementById("achievement-gui")!.style.opacity = "20%";
			document.getElementById("achievement-gui")!.style.background = '#B04716';
			document.getElementById("achievement-tooEasy")!.style.opacity = "20%";
			document.getElementById("achievement-tooEasy")!.style.background = '#B04716';
			document.getElementById("achievement-firstGoal")!.style.opacity = "20%";
			document.getElementById("achievement-firstGoal")!.style.background = '#B04716';

			await DataService.getAchievements(props.userid)
			.then((response: ResponseData) => {
				// console.log("resp", response);
				for (var achievement of response.data) {
					if (achievement.name == "the Gui") {
						document.getElementById("achievement-gui")!.style.opacity = "100%";
						document.getElementById("achievement-gui")!.style.background = "#00cc00";
					}
					if (achievement.name == "Too easy") {
						document.getElementById("achievement-tooEasy")!.style.opacity = "100%";
						document.getElementById("achievement-tooEasy")!.style.background = "#00cc00";
					}
					if (achievement.name == "First Blood") {
						document.getElementById("achievement-firstGoal")!.style.opacity = "100%";
						document.getElementById("achievement-firstGoal")!.style.background = "#00cc00";
					}
				}
			})
			.catch((e: Error) => {
				// console.log(e);
			});

			// dont show button, if it's yourself
			if (props.userid === store.user.userid) {
				document.getElementById("add-friend-button")!.style.display = "none";
				document.getElementById("block-user-button")!.style.display = "none";
			}
			
			for (var friend of store.friends) {
				if (friend.userid === props.userid) {
					if (friend.friendstatus === "friends") {
						document.getElementById("add-friend-button")!.style.background = "#00cc00";
						document.getElementById("add-friend-button")!.innerHTML = "friends";
						document.getElementById("block-user-button")!.style.display = "none";
					}
					else if (friend.friendstatus == "requested") {
						if (friend.addresseeid === store.user.userid) {
							document.getElementById("add-friend-button")!.style.background = "#b04716";
							document.getElementById("add-friend-button")!.innerHTML = "confirm";
						}
						else {
							document.getElementById("add-friend-button")!.style.background = "#b04716";
							document.getElementById("add-friend-button")!.innerHTML = "pending";
						}
						document.getElementById("block-user-button")!.style.display = "none";
					}
					else if (friend.friendstatus == "blocked") {
						if (friend.requesterid === store.user.userid) {
							document.getElementById("add-friend-button")!.style.display = "none";
							document.getElementById("block-user-button")!.innerHTML = "blocked";
							document.getElementById("block-user-button")!.style.background = "#131313";
							document.getElementById("block-user-button")!.style.color = "#ffffff";
						}
						else {
							document.getElementById("add-friend-button")!.style.display = "none";
							document.getElementById("block-user-button")!.innerHTML = "you're blocked";
							document.getElementById("block-user-button")!.style.background = "#131313";
							document.getElementById("block-user-button")!.style.color = "#ffffff";
							(document.getElementById("block-user-button") as HTMLButtonElement).disabled = true;
						}
					}
				}
			}
			await DataService.getLeaderboardPosition(props.userid)
			.then((response: ResponseData) => {
				leaderboardRank.value = response.data
				if (leaderboardRank.value === 1) {
					document.getElementById("leaderboard-position")!.style.background = "gold";
				}
				else if (leaderboardRank.value === 2) {
					document.getElementById("leaderboard-position")!.style.background = "silver";
				}
				else if (leaderboardRank.value === 3) {
					document.getElementById("leaderboard-position")!.style.background = "bronce";
				}
			})
			.catch((e: Error) => {
				// console.log(e);
			});
		});
		return { leaderboardRank, matchHistory, friendButtonAction, blockButtonAction };
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


.user-data-wrapper {
	margin-bottom: 0.5rem;
	margin-left: 0%;
}
.center-user-summary {
	text-align: center;
	display: grid;
	align-items: center;
	justify-content: center; 
	justify-content: center;
	grid-template-columns: 1fr 1fr 1fr;
}

#user-photo {
	width : 7rem;
	height: 7rem;
	object-fit: cover;
	border-radius: 50%;
	background: white;
	margin: 3%;
}

#leaderboard-position-wrapper {
	display: flex;
	align-items: center;
	justify-content: center; 
	justify-content: center;
}

#leaderboard-position {
	width : 5rem;
	height: 5rem;
	object-fit: cover;
	border-radius: 50%;
	background: white;
	margin: 3%;
	color: var(--second-bg-color);
	font-size: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-family: monospace;
	font-weight: 600;
	/* outline: 3px solid red; */
}

.game-statistic a {
	width: 7rem;
	margin: 0.5rem;
	align-items: center;
	background-color: white;
	border: 2px solid #000;
	box-sizing: border-box;
	color: #000;
	font-family: monospace;
	cursor: pointer;
	display: inline-flex;
	height: 36px;
	justify-content: center;
	padding: 0 17px;
	text-decoration: none;
	font-weight: 500;
	white-space: nowrap;
}

.achievements {
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: left;
}

.achievement-wrapper {
	display: inline-block;
	justify-content: center;
	margin-bottom: 1rem;
}

.achievement-wrapper a {
	width: 7rem;
	margin: 0.5rem;
	align-items: center;
	background-color: var(--first-highlight-color);
	border: 2px solid #000;
	box-sizing: border-box;
	color: #000;
	font-family: monospace;
	cursor: pointer;
	display: inline-flex;
	height: 36px;
	justify-content: center;
	padding: 0 17px;
	text-align: center;
	text-decoration: none;
	transition: all .4s;
	font-weight: 500;
	white-space: nowrap;
	opacity: 20%;
}

.button-wrapper {
	text-align: center;
	margin-bottom: 1.5rem;
}

.button-wrapper button {
	margin: 0.5rem;	
}

#add-friend-button {
	margin: 0.5rem;
	width: 7rem;
	/* color: white; */
	/* background: rgb(121, 145, 254); */
	background: var(--third-highlight-color);
	transition: .4s;
}

#add-friend-button:hover {
	border-color: white;
	color: white;
}

#block-user-button {
	color: black;
	background: white;
	transition: .4s;
}

#block-user-button:hover {
	border-color: white;
	/* color: white; */
}

.achievement-wrapper {
	text-align: left;
}

.achievement-wrapper a {
	width: 7rem;
	margin: 0.5rem;
	align-items: center;
	background-color: var(--first-highlight-color);
	border: 2px solid #000;
	box-sizing: border-box;
	color: #000;
	font-family: monospace;
	cursor: pointer;
	display: inline-flex;
	height: 36px;
	justify-content: center;
	padding: 0 17px;
	text-align: center;
	text-decoration: none;
	transition: all .4s;
	font-weight: 500;
	white-space: nowrap;
	opacity: 20%;
}

#history-table {
	padding: calc(3px + 1.5625vw);
	padding-top: 0;
	border-collapse: collapse;
	overflow-y: auto;
	max-height: 250px;
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
	background-color: var(--main-bg-color);;
	color: white;
}

</style>
