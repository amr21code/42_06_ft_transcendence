<template>
	<div class="TEMP_WRAPPER">
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
			<!-- <ol>
				<li>
					<div class="leaderboard-image">
						<img src="../assets/bitcoin-black-white.png" alt="user-photo" width="20" height="20"/>
					</div>
					anruland
					<small>5 wins</small>
				</li>
				<li>
					djedasch
				</li>
				<li>
					jtomala
				</li>
				<li>
					raweber
				</li>
			</ol> -->
		</div>		
		<div class="side-window" id="chat-window" v-if="selected === 'chat'">
			Chat Window
			<p>hello world, this is our chat</p>
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

	#leaderboard-table tr:not(:first-child):hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	#top-row:hover {
		background-color: none;
	}
	

	

</style>