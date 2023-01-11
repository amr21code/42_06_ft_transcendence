<template>

		
		<!-------MODULE WINDOW---------------------------->
		
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
			<!-- <div class="message-recv" v-for="message in messages" :key="message">
				 <div class="">
            		<strong class="">{{ message.userid }}</strong>
         		</div>
          		<div class="">{{ message.message }}</div>
			</div> -->
			<div class="chat-write-and-send">
				<!-- <form @submit.prevent="submit"> -->
					<input placeholder="Write message here">
					<img src="../assets/send_icon.png" alt="user-photo" width="20" height="20">
				<!-- </form> -->
			</div>

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'


export default defineComponent({
	name: 'ChatWindow',
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
