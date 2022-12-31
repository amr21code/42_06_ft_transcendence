<template>
	<div class="TEMP_WRAPPER">
		<div class="side-window" v-if="selected === 'leaderboard'">
			Leaderboard Window
			<ul>
				<li>this</li>
				<li>is</li>
				<li>leaderboard</li>
			</ul>
		</div>		
		<div class="side-window" v-if="selected === 'chat'">
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
</style>