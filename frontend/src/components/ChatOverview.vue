<template>
   <h2>Chat overview</h2>
   <div class="chat-overview">
		<div class="chat-message-view">
			<img src="../assets/jorit_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Jorit</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>
		<div class="chat-message-view">
			<img src="../assets/ralf_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Ralf</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>
		<div class="chat-message-view">
			<img src="../assets/andi_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Andi</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>
		<div class="chat-message-view">
			<img src="../assets/desiree_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Desiree</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>
		<div class="chat-message-view">
			<img src="../assets/jorit_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Jorit</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>
		<div class="chat-message-view">
			<img src="../assets/ralf_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Ralf</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>
		<div class="chat-message-view">
			<img src="../assets/andi_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Andi</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>
		<div class="chat-message-view">
			<img src="../assets/desiree_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
			<p class="chat-person-text">Desiree</p>
			<p class="chat-person-message">This is a sample message</p>
		</div>

	</div>

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'


export default defineComponent({
	name: 'chatOverview',
	// components: {},
	// props: {
	// 	selected: {
	// 		required: true,
	// 		type: String
	// 	}
	// }
})
</script>

<style scoped>

	.chat-overview {
		height: 340px;
		overflow-y: scroll;
		scrollbar-color: rebeccapurple green;
		scrollbar-width: thin;
	}

	.user-photo {
		float: left;
		padding-top: 15px;
	}
	
	.chat-message-view {
		background-color: rgb(0,0,0,0.4);
		border: black solid 1px;
		color: black;
		padding: 10px;
	}
	.chat-message-view:hover {
		background-color: rgb(0,0,0,0.3)
	}

	.chat-person-text {
		color:rgb(224, 19, 19);
		padding-left: 50px;
	}

	.chat-person-message {
		color: black solid;
		padding-left: 50px;
	}

</style>
