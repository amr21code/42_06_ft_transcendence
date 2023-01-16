<template>

	<div class="wrapper">

<!--------------HEAD----------------------------------------------------------------------------->
		
		<!--show current chatid and chatname-->
		<!--have a info button on the right to show all the users in the chat-->
		<h2>Chat</h2>
		<div class="chat-top-bar">
			<img src="../assets/ralf_profile.png" alt="user-photo" width="40" height="40">
			Ralf Weber
		</div>

<!--------------BODY------------------------------------------------------------------------------------>

		<div class="chat-message-view">

			<!-- <p class="message-recv">Hey Jorit!</p>
			<p class="message-sent">Hey Ralf, what's up?</p>
				<p class="message-recv">I am still doing transcendence and you?</p>
				<p class="message-sent">Haha, same here...</p> -->


			<!--if username == currentusername then class="message-sent"-->
			<div class="message-recv" v-for="chat in chats" :key="chat">
				<div class="">
            		<strong class="message-username">{{ chat.username }}</strong>
         		</div>
				 <div class="">
            		<strong class="message-text">{{ chat.message }}</strong>
         		</div>
			</div>

		</div>

<!--------------FOOTER------------------------------------------------------------------------------------>

			<div class="chat-write-and-send">
				<form @submit.prevent="submit">
					<input placeholder="Write message here">
					<img src="../assets/send_icon.png" alt="user-photo" width="20" height="20">
				</form>
			</div>

	</div>

</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue'

//for getting data from the backend
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import type { IChats } from '../types/Chats'



export default defineComponent({
	name: 'ChatWindow',
	data () {
		return {
			user: {} as IUser,
			chats: {} as IChats,
		}
	},

	props: {
		chatid: {
			required: true,
			type: String
		},
	},

	methods: {
		retrieveCurrentUser() {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		retrieveCurrentMessages(chatid : string) {
			DataService.getMessages(chatid)
			.then((response: ResponseData) => {
				this.chats = response.data;
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		}

	},

	mounted () {
		console.log(this.chatid);
		if (this.chatid === undefined)
			return console.log("Error: chatid is not defined!");
		this.retrieveCurrentMessages(this.chatid); //needs to get the chatid that got clicked
	},

	setup(){
		const messages = ref([]);
		const message = ref('');

		onMounted(() => {
			
		});

		const submit = async () => {
			console.log("message got send to backend");
			await fetch('http://localhost:3000/chat/message', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					userid: "jtomala", //getIntraName()
					chatid: 24, //getChatId()
					message: message.value
	
				}) //end of stringify
			})//end of fetch
			message.value = '';
		}//end of submit

		return { message, messages, submit}
	}
})

</script>


<style scoped>

	.message-text {
		padding-left: 1%;
		font-weight: normal;
	}
	.message-username {
		color: black;
		padding-left: 1%;
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
