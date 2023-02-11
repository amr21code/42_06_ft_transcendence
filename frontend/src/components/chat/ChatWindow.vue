<template>

	<div class="wrapper">

<!--------------HEAD----------------------------------------------------------------------------->

		<h2>Chat</h2>
		<div class="chat-top-bar">
			<div class="channel-info-wrapper">

				<h3 class="chat-chatid" >{{ curr_chat.chatid }}</h3>
				<h3 class="chat-chatname">{{ curr_chat.chat_name }}</h3>
				<!-- <input v-if="showinput === true" placeholder="enter new name" v-model="newName"> -->
				
				<a class="info-icon-wrapper" @click="(ChatInfotogglePopup)">
					<img id="info-icon" src="../../assets/info-icon-new.png" alt="user-photo" width="20" height="20">
				</a>
			</div>
			
			<!-- <div class="name-approve-button-wrapper">
				<button class="ok-button" @click="showChangeNameField(), changeChatDetails(curr_chat.typename, curr_chat.chatid, newName, curr_chat.password)" v-if="showinput === true">ok</button>
				<button class="cancel-button" @click="showChangeNameField()" v-if="showinput === true">cancel</button>
			</div> -->
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
						{{ message.message }}
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
			<input id="input-message" type="text" autofocus="true" placeholder="press enter to send" v-model="message" @keyup.enter="sendMessage(curr_chat.chatid, message), submit()">
			<!-- <img class="send-message-icon" @click="sendMessage(curr_chat.chatid, message), submit()" src="../../assets/send_icon.png" alt="send-icon"> -->
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

import { defineComponent, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import type { IFriend } from '../../types/Friend'


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
				// console.log(e);
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
				// console.log(e);
			});
		},

		async retrieveFriendlist() {
			await DataService.getFriends()
			.then((response: ResponseData) => {
				this.friends = response.data;
			})
			.catch((e: Error) => {
				// console.log(e);
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
			SocketioService.sendMessage(this.user[0].username, this.user[0].userid, chatid, message);
			// this.$nextTick(() => {
        	// 		this.scrollToBottom();
     		// 	});
		},

		//changes the name of the chat by sending it to the API and then refreshs the chatoverview
		async changeChatDetails (type : string, chatid : number, chatname : string, password : string) {
			await DataService.changeChatDetails(type, chatid, chatname, password)
			.then((response: ResponseData) => {
				this.curr_chat.chat_name = chatname;
				SocketioService.refreshChats();
			})
			.catch((e: Error) => {
				// console.log(e);
			});
		},
		
		scrollToBottom() {
			this.$nextTick(() => {
				// console.log("sio_length: ", this.messages.length);
				// console.log("db_length: ", this.db_messages.length);
				// if (this.db_messages.length + this.message.length > 10)
				const chat = this.$refs.chatEnd as any;
				if (chat !== null && chat.scrollHeight !== undefined && this.$refs.chatEnd)
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
		onMounted(() => {
			document.getElementById('input-message')!.focus;
		});
		return { message, submit, showChangeNameField, showinput, newName, ChatInfoTrigger, ChatInfotogglePopup }
	}

})

</script>



<style scoped>

/* ######## GLOBAL ####################################### */

	.wrapper {
		width: 90%;
		margin-left: 5%;
		margin-right: 5%;
		height: 100%;
		/* border: 10px solid var(--second-bg-color); */
	}

	.wrapper h2 {
		margin: 0.5rem;
	}

/* ######## TOP BAR ####################################### */
	.chat-top-bar {
		background-color: var(--second-bg-color);
		background-color: var(--costum-grey);
		color: white;
		/* border: 2px solid var(--costum-grey); */
		margin-bottom: 0.5rem;
		height:100%;
	}

	.chat-top-bar h3 {
		padding: 0;
		margin: 0;
	}

	.channel-info-wrapper {
		text-align: center;
		display: grid;
		align-items: center;
		justify-content: center; 
		grid-template-columns: 1fr 1fr 1fr;
		height: 100%;
	}

	.chat-chatid {
		color: white;
	}

	.chat-chatname {
		color: white;
	}

	.name-approve-button-wrapper {
		margin: 0.25rem;
	}
	
	.ok-button {
		margin-right: 0.5rem; /*so that the buttons don't touch*/
		width: 25%;
	}
	
	.cancel-button {
		width: 25%;
	}

	.info-icon-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
	
	#info-icon {
		filter: invert(100%);
		-webkit-filter: invert(100%);
		height: calc(2px + 1.5625vw);
		width: calc(2px + 1.5625vw);
		padding: calc(-20px + 1.5625vw);
		cursor: pointer;
		transition: .4s;
	}

	#info-icon:hover {
		filter: invert(0%);
		-webkit-filter: invert(0%);
	}
	
	
/* ######## MESSAGES VIEW ####################################### */

	.chat-message-view {
		background: white;
		background: var(--second-bg-color);
		height: 300px;
		overflow-y: scroll;
		border: 2px solid  var(--costum-grey);
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.chat-message-view::-webkit-scrollbar {
		display: none; /* Hide scrollbar for Chrome, Safari and Opera */
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}
	
	.messages-wrapper {
		/* max-width: 340px;
		min-width: 340px; */
		max-width: 100%;
	}

	.message-text {
		padding-left: 1%;
		word-break: break-all;
	}

	.message-username {
		color: white;
		padding-left: 1%;
	}


	.message-recv {
		text-align: left;
		color: white;
		max-width: 60%;
		background-color: var(--costum-grey);
		border-radius: 4px;
		margin: 6px;
		margin-right: 40%;
		padding: 1%;
	}
	
	.message-sent {
		text-align: right;
		color: white;
		max-width: 60%;
		background-color: rgb(97, 97, 237);
		border-radius: 4px;
		margin: 6px;
		margin-left: 40%;
		padding: 2%;
	}
	
	.chat-write-and-send-wrapper {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-y: hidden; 
		background-color: var(--second-bg-color); 
		/* padding-top: 0.5rem; */
		padding-bottom: 0.5rem;
	}
	
	#input-message {
		width: 75%;
	}

	input[type="text"] {
		background-color : var(--second-bg-color); 
		border: 2px solid  var(--costum-grey);
		border-radius: 2px;
		color: white;
		margin-bottom: 1rem;
	}

	input[type="text"]:focus {
		outline: 2px solid  var(--costum-grey);
	}

	.send-message-icon {
		filter: invert(100%);
		-webkit-filter: invert(100%);
		cursor: pointer;
		height: calc(5px + 1.5625vw);
		width: calc(5px + 1.5625vw);
		margin: 1%;
		transition: .4s;
	}

	.send-message-icon:hover {
		filter: invert(0%);
		-webkit-filter: invert(0%);
	}

</style>
