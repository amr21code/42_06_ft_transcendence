<template>
	<div v-if="selected !== 'play' && selected !== 'watch'" class="side-window-wrapper">
		<ChatWindow v-if="selected === 'chat'" />
		<Leaderboard v-if="selected === 'leaderboard'"/>
		<Friendlist v-if="selected === 'friends'"/>
	</div>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import ChatWindow from '../components/Chat.vue'
import Leaderboard from '../components/Leaderboard.vue'
import Friendlist from '../components/Friendlist.vue'

export default defineComponent({
	name: 'side-window',
	components: { ChatWindow, Leaderboard, Friendlist },
	props: {
		selected: {
			required: true,
			type: String
		}
	}
})
</script>


<style scoped>
	.side-window-wrapper {
		background: white;
		/* background-color: var(--second-bg-color); */
		color: var(--second-bg-color);
		border-radius: 2px;

		/* make sidewindow fit horizontally (force scrollbar if needed) */
		overflow-x: hidden;
		/* width: 100%; */

		/* make element inline flex-container */
  		/* this will make its children flex-items */
		display: inline-flex;
		/* align-items items in column */
		flex-direction: column;
		/* center items horizontally */
		align-items: center;
		/* center items vertically */
		justify-content: center;
	}
</style>