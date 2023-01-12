<template>
	<div class="chat-wrapper">

		<Overview v-if="selected === 'overview'"/>
		<ChatWindow v-if="selected === 'chatwindow'"/>
		
			<div class="chat-menu">
				<a @click="handleClick('chatwindow')">
					<img src="../assets/chat-icon.png" alt="user-photo" width="40" height="40">
				</a>
				<a @click="handleClick('overview')">
					<img src="../assets/people_icon.png" alt="user-photo" width="40" height="40">
				</a>
				<!--popup for a new chat-->
				<a @click="handleClick('newchat')">
				<img src="../assets/new-message_icon.png" alt="user-photo" width="40" height="40">
				</a>
			</div>


		</div>
</template>



<script lang="ts">
import ChatWindow from './ChatWindow.vue'
import Overview from './ChatOverview.vue'
import { defineComponent, ref, onMounted } from 'vue'

type SelectedChat = 'overview' | 'chatwindow' | 'newchat'
// export type {SelectedChat}

export default defineComponent({
	name: 'chat-window',
	components: { ChatWindow, Overview },
	setup(){
		const userid = ref('userid');
		const chatid = ref('chatid');
		const messages = ref([]);
		const message = ref('');

		onMounted(() => {
			// getMessages();
		});

		const selected = ref<SelectedChat>('overview')
		const handleClick = (term: SelectedChat) => {
			selected.value = term;
			console.log("handleClick", selected.value);
		}

		const getMessages = async () => {
			//get the messages from the backend
			fetch('http://localhost:3000/chat/messages/1')
				.then(res => res.json())
				.then(data => messages.value = data)
				.catch(err => console.log(err.message))
			console.log('got messages from backend')
		}

		const submit = async () => {
			console.log("message got send to backend");
			await fetch('http://localhost:3000/chat/message', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					userid: "jtomala", //getIntraName()
					chatid: 1, //getChatId()
					message: message.value
	
				}) //end of stringify
			})//end of fetch
			message.value = '';
		}//end of submit
		return {
			userid,
			chatid,
			messages,
			message,
			selected,
			submit,
			handleClick
		} //end of return
	} //end of setup
}) //end of defineComponent
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
