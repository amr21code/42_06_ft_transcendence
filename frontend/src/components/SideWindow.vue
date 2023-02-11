<template>
	<div v-if="store.selected !== 'play' as SelectedSideWindow && store.selected !== 'watch' as SelectedSideWindow" class="side-window-wrapper">
		<ChatWindow v-if="store.selected === 'chat'" />
		<Leaderboard v-if="store.selected === 'leaderboard'"/>
		<Friendlist v-if="store.selected === 'friends'"/>
	</div>
</template>



<script lang="ts">
import { defineComponent } from 'vue'
import ChatWindow from './chat/Chat.vue'
import Leaderboard from '../components/Leaderboard.vue'
import Friendlist from '../components/Friendlist.vue'
import { useUserDataStore } from '../stores/myUserDataStore'
import type { SelectedSideWindow } from '../types/SelectedSideWindow'

export default defineComponent({
	name: 'side-window',
	components: { ChatWindow, Leaderboard, Friendlist },
	
	setup() {
		const store = useUserDataStore();
		return { store };
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