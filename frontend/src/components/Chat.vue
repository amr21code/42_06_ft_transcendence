<!--
	This window should show an overview of all the chats and is responsible
	for the footer so that you can switch between chats and create a new chat
-->

<template>
	<div class="chat-wrapper">

		<!-- <Overview v-if="selected === 'overview'"/> -->
		
		<div v-if="selected === 'overview'">
			<h2>Chat overview</h2>
			 <div class="chat-overview">


			<!-- <strong class="">{{ chats }}</strong>  -->
			<div class="chat-message-view" v-for="chat in chats" :key="chat">
				<a @click="handleClick('chatwindow', chat)" v-if="type === 'groups'">
					<div class="" >
							<strong class="chat-chatid" >{{ chat.chatid }}</strong>
							<a class="chat-chatname">{{ chat.chat_name }}</a><br>
							<a class="chat-typename-green" v-if="chat.typename === 'public'" >{{ chat.typename }}</a>
							<a class="chat-typename-red" v-if="chat.typename === 'protected'" >{{ chat.typename }}</a>
					</div>
				</a>
				<a @click="handleClick('chatwindow', chat)" v-if="type === 'dms'"> <!--need a function for getting the dms-->
					<div class="">
						<div class="" >
							<strong class="chat-chatid" >{{ chat.chatid }}</strong>
							<a class="chat-chatname">{{ chat.chat_name }}</a><br>
							<a class="chat-typename-green" v-if="chat.typename === 'public'" >{{ chat.typename }}</a>
							<a class="chat-typename-red" v-if="chat.typename === 'protected'" >{{ chat.typename }}</a>
					</div>
					</div>
				</a>
			</div>

		</div>
	</div>

	<ChatWindow v-if="selected === 'chatwindow'" :curr_chat="sel_chat" />

			<div class="chat-menu">
				<a @click="handleClick('overview', '0'), changeType('dms')">
					<img src="../assets/chat-icon.png" alt="user-photo" width="40" height="40">
				</a>
				<a @click="handleClick('overview', '0'), changeType('groups')">
					<img src="../assets/people_icon.png" alt="user-photo" width="40" height="40">
				</a>
				<!--popup for a new chat-->
				<a @click="togglePopup()">
					<img src="../assets/new-message_icon.png" alt="user-photo" width="40" height="40">
				</a>
				<a @click="LeaveChattogglePopup()" v-if="selected === 'chatwindow'">
					<img src="../assets/blackcross.png" alt="user-photo" width="35" height="40">
				</a>
				<!-- <a  v-if="selected === 'chatwindow'">
					<img src="../assets/info-icon.png" alt="user-photo" width="40" height="40">
				</a> -->
			</div>

			<NewMessagePopup id="NewMessagePopup" v-if="popupTrigger === true" :togglePopup="() => togglePopup()" />
			<LeaveChatPopup id="LeaveChatPopup" v-if="LeaveChatTrigger === true" :LeaveChattogglePopup="() => LeaveChattogglePopup()" :curr_chat="sel_chat" :selectedWindow="selected"/>


		</div>
</template>



<script lang="ts">
import ChatWindow from './ChatWindow.vue'
import NewMessagePopup from './NewMessagePopup.vue'
import LeaveChatPopup from './LeaveChat.vue'
import { defineComponent, ref, onMounted } from 'vue'

//for getting data from the backend
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import type { IChats } from '../types/Chats'

//socket.io
import SocketioService from '../services/SocketioService.js';

type SelectedChat = 'overview' | 'chatwindow' | 'newchat'

export default defineComponent({
	name: 'chat-module',
	components: { ChatWindow, LeaveChatPopup, NewMessagePopup },

	data () {
		return {
			user: {} as IUser,
			chats: {} as IChats
		}
	},

	methods: {
		retrieveCurrentUser() {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
				// console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		retrieveCurrentChats() {
			// console.log("type:", this.type);
			if (this.type == 'groups')
			{
				DataService.getChats()
				.then((response: ResponseData) => {
				this.chats = response.data;
				// console.log(response.data);
				})
				.catch((e: Error) => {
					console.log(e);
			})
			}
			else if (this.type == 'dms') //not sure if that works like this
			{
				DataService.getDms()
				.then((response: ResponseData) => {
					this.chats = response.data;
					// console.log(response.data);
				})
				.catch((e: Error) => {
					console.log(e);
				})
			}
		},

		retrieveCurrentDms() {
			console.log("Recieve Dms");
			DataService.getDms()
			.then((response: ResponseData) => {
				this.chats = response.data;
				// console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		}
	},

	mounted () {
		this.retrieveCurrentUser();
		this.retrieveCurrentChats();

		//checks for new chats every second; change to getting messages when a change is in the db
		// window.setInterval(() => {
		// }, 1000)
	},

	setup(){
		const message = ref('');

		const popupTrigger = ref(false);
		const togglePopup = () => {
			console.log("togglePopup(NewMessagesPopup) got triggert")
			popupTrigger.value = !popupTrigger.value;
		}

		const LeaveChatTrigger = ref(false);
		const LeaveChattogglePopup = () => {
			console.log("togglePopup(LeaveChat) got triggert")
			LeaveChatTrigger.value = !LeaveChatTrigger.value;
		}

		onMounted(() => {
	
		});
		const type = ref<String>('groups');
		const changeType = (term: String) => {
			type.value = term;
		}

		const selected = ref<SelectedChat>('overview');
		const sel_chat = ref('');
		const handleClick = (term: SelectedChat, selected_chat: string) => {
			sel_chat.value = selected_chat;
			selected.value = term;
			console.log("handleClick", selected.value, sel_chat.value);
		}

		return {message, selected, handleClick, togglePopup, popupTrigger, sel_chat, LeaveChattogglePopup, LeaveChatTrigger, changeType, type }
	} //end of setup
}) //end of defineComponent
</script>


<style scoped>

.chat-chatid {
	float: left;
	color: white;
	background-color: black;
	border: 5%;
}

.chat-chatname {
	color: black;
	padding-left: 20%;
}

.chat-typename-green {
	color: green;
}

.chat-typename-red {
	color: red;
}

.chat-overview {
		height: 340px;
		overflow-y: scroll;
		scrollbar-color: rebeccapurple green;
		scrollbar-width: thin;
		/* display: flex;
		flex-direction: column-reverse; */
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
