<template>
	<div class="TEMP_WRAPPER">
		<!-- LEADERBOARD WINDOW STARTS HERE -->
		<div class="side-window" id="leaderboard" v-if="selected === 'leaderboard'">
			<h2>Leaderboard</h2>
			<table id="leaderboard-table">
				<!-- PUT FOR LOOP HERE AND MAKE LIST SCROLLABLE -->
				<tr id="top-row">
					<th>position</th>
					<th>picture</th>
					<th>name</th>
					<th>wins</th>
				</tr>
				<tr>
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
			</table>
		</div>


		<!-- CHAT WINDOW STARTS HERE -->
		<div class="side-window" id="chat-window" v-if="selected === 'chat'">
			<h2>Chat</h2>
			<div class="chat-top-bar">
				<img src="../assets/ralf_profile.png" alt="user-photo" width="40" height="40">
				Ralf Weber
			</div>
			<div class="chat-message-view">
				<p class="message-recv">Hey Jorit!</p>
				<p class="message-sent">Hey Ralf, what's up?</p>
				<p class="message-recv">I am still doing transcendence and you?</p>
				<p class="message-sent">Haha, same here...</p>
			</div>
			<div class="chat-write-and-send">
				<input placeholder="Write message here">
				<img src="../assets/send_icon.png" alt="user-photo" width="20" height="20">
			</div>
			<div class="chat-menu">
				<img src="../assets/chat-icon.png" alt="user-photo" width="40" height="40">
				<img src="../assets/people_icon.png" alt="user-photo" width="40" height="40">
				<img src="../assets/new-message_icon.png" alt="user-photo" width="40" height="40">
			</div>
		</div>	
	</div>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import type { SelectedSideWindow } from '../types/SelectedSideWindow'

export default defineComponent({
	props: {
		selected: {
			required: true,
			type: String
		}
	},
	components: {}
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

	#leaderboard-table th, td {
		padding: 10px;
		text-align: center;
	}

	/* hover effect on all but the first line */
	#leaderboard-table tr:not(:first-child):hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	#leaderboard-table img {
		border-radius: 10%;
	}

	.chat-top-bar {
		background-color: var(--second-bg-color);
		color: white;
	}
	
	.chat-message-view {
		border: black solid 3px;
		min-height: 300px; 
		/* find good way for min-height */
	}

	.message-recv {
		background-color: rgb(155, 155, 160);
		color: black;
		border-radius: 15px;
		padding: 3px;
		margin-right: 35px;
	}
	
	.message-sent {
		text-align: right;
		background-color: rgb(106, 106, 109);
		color: black;
		border-radius: 15px;
		padding: 3px;
		margin-left: 35px;
	}
	
	.chat-write-and-send {
		border: black solid 3px;
		padding: 3px;
	}

	.chat-write-and-send img {
		margin: 2px;
		float: right;
		padding: 3px;
		cursor: pointer;
	}
	
	.chat-menu {
		background-color: var(--second-bg-color);
		color: white;
		text-align: center;
	}

	.chat-menu img {
		margin: 5px 20px;
		cursor: pointer;
	}

	.chat-menu img:hover {
		background-color: rgb(0,0,0,0.3)
	}
	

	

</style>