<template>

	<div class="wrapper">

<!--------------HEAD----------------------------------------------------------------------------->
		
		<!--show current chatid and chatname-->
		<!--have a info button on the right to show all the users in the chat-->
		<h2>Chat</h2>
		<div class="chat-top-bar">
			<!-- {{ curr_chat }} -->
			<!-- <img src="../assets/ralf_profile.png" alt="user-photo" width="40" height="40"> -->
			<strong class="chat-chatid" >{{ curr_chat.chatid }}</strong>
			<a @click="showChangeNameField()" class="chat-chatname" v-if="showinput === false">{{ curr_chat.chat_name }}</a>
			<input v-if="showinput === true" placeholder="enter new name" v-model="newName">
			<button class="ok-button" @click="showChangeNameField(), changeChatName(curr_chat.typename, curr_chat.chatid, newName, curr_chat.password)" v-if="showinput === true">ok</button>
			<button class="cancel-button" @click="showChangeNameField()" v-if="showinput === true">cancel</button>
			<!-- <a class="chat-typename">{{ curr_chat.typename }}</a> -->
			<a class="info-icon">
				<img src="../assets/info-icon.png" alt="user-photo" width="20" height="20">
			</a>
		</div>

<!--------------BODY------------------------------------------------------------------------------------>

		<div class="chat-message-view">
			
			<div class="messages-wrapper" v-for="chat in chats" :key="chat">
				<!-- message sent -->
				<div class="message-sent" v-if="user[0].username == chat.username">
					<div class="message-username">
						<strong >{{ chat.username }}</strong>
					</div>
					<div class="message-text">
						<a >{{ chat.message }}</a>
					</div>
				</div>
				<!--message recv-->
				<div class="message-recv" v-else>
					<div class="message-username">
						<strong >{{ chat.username }}</strong>
					</div>
					<div class="message-text">
						<a >{{ chat.message }}</a>
					</div>
				</div>
			</div>

		</div>

<!--------------FOOTER------------------------------------------------------------------------------------>
			
			<div class="chat-write-and-send">
				<!-- <form @submit.prevent="sendMessage( user[0].userid, curr_chat.chatid, 'Grüße aus dem frontend')"> -->
				<form @submit.prevent="sendMessage( user[0].userid, curr_chat.chatid, message), submit()" >
					<input placeholder="Write message here" v-model="message">
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
			message: '' as String
		}
	},

	props: {
		curr_chat: {
			required: true,
			type: Object
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
		},

		sendMessage (userid : string, chatid : number, message : string) {
			DataService.sendMessage(userid, chatid, message)
			.then((response: ResponseData) => {
				message = '';
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		changeChatName (type : number, chatid : number, chatname : String, password : String) {
			console.log(type, chatid, chatname, password);
			DataService.changeChatName(type, chatid, chatname, password)
			.then((response: ResponseData) => {
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		}

	},

	mounted () {
		this.retrieveCurrentUser();

		//checks for new messages every second; change to getting messages when a change is in the db
		window.setInterval(() => {
			this.retrieveCurrentMessages(this.curr_chat.chatid)
		}, 1000)
	},

	setup() {

		const message = ref('');
		const newName = ref('')

		const submit = () => {
			message.value = '';
		}

		const showinput = ref(false);
		const showChangeNameField = () => {
			showinput.value = !showinput.value;
		}

		return { message, submit, showChangeNameField, showinput, newName }
	}

})

</script>


<style scoped>

	.info-icon{
		padding-left: 15%;
	}
	.ok-button {
		width: 20px;
		height: 20px;
	}

	.cancel-button {
		width: 45px;
		height: 20px;
		color: black;
	}

	.chat-chatid {
		float: left;
		color: white;
		padding-left: 5%;
	}

	.chat-chatname {
		color: white;
		padding-left: 20%;
		float: middle;
	}

	.chat-typename {
		color: lightgreen;
		padding-right: 5%;
		float: right;
	}

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
		padding-top: 2%;
		padding-bottom: 2%;
	}
	
	.chat-message-view {
		border: black solid 3px;
		height: 300px;
		overflow-y: scroll;
		scrollbar-color: rebeccapurple green;
		scrollbar-width: thin;
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
