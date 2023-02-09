<template>

	<div class="wrapper">

<!--------------HEAD----------------------------------------------------------------------------->

		<h2>Chat</h2>
		<div class="chat-top-bar">
			<strong class="chat-chatid" >{{ curr_chat.chatid }}</strong>
			<a class="chat-chatname">{{ curr_chat.chat_name }}</a>
			<!-- <input v-if="showinput === true" placeholder="enter new name" v-model="newName"> -->
			<button class="ok-button" @click="showChangeNameField(), changeChatDetails(curr_chat.typename, curr_chat.chatid, newName, curr_chat.password)" v-if="showinput === true">ok</button>
			<button class="cancel-button" @click="showChangeNameField()" v-if="showinput === true">cancel</button>
			<a class="info-icon" @click="(ChatInfotogglePopup)">
				<img src="../../assets/info-icon.png" alt="user-photo" width="20" height="20">
			</a>
		</div>

		<ChatInfoPopup id="ChatInfoPopup" v-if="ChatInfoTrigger === true" :ChatInfotogglePopup="() => ChatInfotogglePopup()" :chat="curr_chat" />

<!--------------BODY------------------------------------------------------------------------------------>

		<div ref="chatContainer" class="chat-message-view">


	<!-----------OLD MESSAGES FROM DB----------------------------------------------------->
			<div class="messages-wrapper" v-for="message in db_messages" :key="message.message">
				<!-- message sent -->
				<div class="message-sent" v-if="user[0].userid === message.userid">
					<div class="message-username">
						<strong >{{ message.username }}</strong>
					</div>
					<div class="message-text">
						<a >{{ message.message }}</a>
					</div>
				</div>
				<!--message recv-->
				<div class="message-recv" v-else>
					<div class="message-username">
						<strong >{{ message.username }}</strong>
					</div>
					<div class="message-text">
						<a >{{ message.message }}</a>
					</div>
				</div>
			</div>

	<!-----------NEW MESSAGES FROM SOCKET----------------------------------------------------->

			<div class="messages-wrapper" v-for="message in messages" :key="message.message">
				<!-- message sent -->
				<div class="message-sent" v-if="user[0].userid == message.userid && curr_chat.chatid == message.chatid">
					<div class="message-username">
						<strong >{{ message.username }}</strong>
					</div>
					<div class="message-text">
						<a >{{ message.message }}</a>
					</div>
				</div>
				<!--message recv-->
				<div class="message-recv" v-else-if="user[0].userid != message.userid && curr_chat.chatid == message.chatid">
					<div class="message-username">
						<strong >{{ message.username }}</strong>
					</div>
					<div class="message-text">
						<a >{{ message.message }}</a>
					</div>
				</div>
			</div>

			<div ref="chatEnd"></div>
		</div>

<!--------------FOOTER------------------------------------------------------------------------------------>
			
		<form class="chat-write-and-send-wrapper" @submit.prevent="sendMessage(curr_chat.chatid, message), submit()" >
			<input class="input-message" placeholder="Write message here" v-model="message">
			<img class="send-message-icon" @click="sendMessage(curr_chat.chatid, message), submit()" src="../../assets/send_icon.png" alt="send-icon">
		</form>

	</div>

</template>

<script lang="ts">

import ChatInfoPopup from './ChatInfoPopup.vue'

//for getting data from the backend
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'
import type { IMessages } from '../../types/IMessages'
import type { IChats } from '../../types/Chats'
import SocketioService from '../../services/SocketioService'

import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import type { IFriend } from '@/types/Friend'


export default defineComponent({
	name: 'ChatWindow',
	components: { ChatInfoPopup },

	data () {
		return {
			user: [] as IUser[],
			friends: [] as IFriend[],
			db_messages: [] as IMessages[],
			message: '' as String,
			messages: [] as IMessages[],
			socket: SocketioService.socket,
		}
	},

	async created () {
		await this.retrieveCurrentUser();
		await this.retrieveFriendlist();
		await this.retrieveCurrentMessages(this.curr_chat.chatid);
		this.socket.on('chat-message', (data: IMessages) => {

			//check here if the incomming message is from someone who I have blocked
			for (var friend of this.friends)
			{
				if (friend.userid === data.userid)
					if (friend.friendstatus == "blocked")
						return ;
			}

			this.messages.push(data);
			this.$nextTick(() => {
        		this.scrollToBottom();
     		});
		});
	},

	props: {
		curr_chat: {
			required: true,
			type: Object as PropType<IChats>,
			default: () => ({} as IChats)
		},
	},

	methods: {

		// loads the current user who is logged in
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		// loads all the old messages from the db via API
		async retrieveCurrentMessages(chatid : number) {
			await DataService.getMessages(chatid)
			.then((response: ResponseData) => {
				this.db_messages = response.data;
				this.$nextTick(() => {
        			this.scrollToBottom();
     			});
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		async retrieveFriendlist() {
			await DataService.getFriends()
			.then((response: ResponseData) => {
				this.friends = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		// passes the variables to socketio which sends them to the backend in order to send a message
		sendMessage (chatid : number, message : string) {
			const data = {
				username: this.user[0].username,
				userid: this.user[0].userid,
				chatid: chatid,
				message: message,
				time : new Date(),
				statuscode: "0"
			}
			// this.messages.push(data);
			this.scrollToBottom();
			SocketioService.sendMessage(this.user[0].username, this.user[0].userid, chatid, message);
		},

		//changes the name of the chat by sending it to the API and then refreshs the chatoverview
		async changeChatDetails (type : string, chatid : number, chatname : string, password : string) {
			await DataService.changeChatDetails(type, chatid, chatname, password)
			.then((response: ResponseData) => {
				this.curr_chat.chat_name = chatname;
				SocketioService.refreshChats();
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
		
		scrollToBottom() {
			this.$nextTick(() => {
				const chat = this.$refs.chatEnd as any;
				if (chat !== undefined && chat.scrollHeight !== undefined)
				{
					chat.scrollTop = chat.scrollHeight;
					chat.scrollIntoView({ behavior: 'smooth' });
				}
      		});
		},
	},

	setup() {

		const message = ref('');
		const newName = ref('')

		//resets the input
		const submit = () => {
			message.value = '';
		}

		//changes the boolean value in order to show the input for changing the chatname
		const showinput = ref(false);
		const showChangeNameField = () => {
			showinput.value = !showinput.value;
		}

		//changes the boolean value in order to show the infopopup of a chat
		const ChatInfoTrigger = ref(false);
		const ChatInfotogglePopup = () => {
			ChatInfoTrigger.value = !ChatInfoTrigger.value;
			return ChatInfoTrigger.value;
		}


		return { message, submit, showChangeNameField, showinput, newName, ChatInfoTrigger, ChatInfotogglePopup }
	}

})

</script>


<style scoped>


	.input-message {
		width: 80%;
		float: left;
		clear: both;
	}
	.wrapper {
		max-width: 100%;
		min-height: 100%;
	}

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
		/* padding-left: 20%; */
		float: middle;
	}

	.chat-typename {
		color: lightgreen;
		padding-right: 5%;
		float: right;
	}

	.messages-wrapper {
		max-width: 340px;
		min-width: 340px;
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
		scrollbar-color: black solid;
		scrollbar-width: thin;
	}
	.message-recv {
		background-color: rgb(155, 155, 160);
		color: black;
		border-radius: 15px;
		padding: 3px;
		margin-right: 35px;
		text-align: left;
	}
	
	.message-sent {
		text-align: right;
		background-color: rgb(106, 106, 109);
		color: black;
		border-radius: 15px;
		padding: 3px;
		margin-left: 35px;
	}
	
	.chat-write-and-send-wrapper {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-y: hidden; 
		background-color: var(--second-bg-color); 
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		
	}
	
	.input-message {
		width: 75%;
		margin: 1%;
	}

	.send-message-icon {
		cursor: pointer;
		height: calc(5px + 1.5625vw);
		width: calc(5px + 1.5625vw);
		margin: 1%;
	}

	.send-message-icon:hover {
		transition: all .4s;
		filter: invert(100%);
		-webkit-filter: invert(100%);
	}

</style>
