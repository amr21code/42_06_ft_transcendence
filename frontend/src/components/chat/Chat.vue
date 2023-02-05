<!--
	This window should show an overview of all the chats and is responsible
	for the footer so that you can switch between chats and create a new chat
-->

<template>
	<div class="chat-wrapper">

		
		<div v-if="selected === 'overview'">
			<h2>chat overview</h2>
			<a v-if="type === 'joined'">This are the chats that you already joined</a>
			<a v-if="type === 'open'">This are the chats that you can join</a>
			 <div class="chat-overview">

			<!------------CHATS WHERE USER IS JOINED----------------------------------->
			<div v-if="type === 'joined'">
				<div class="chat-message-view" v-for="chat in chats" :key="chat.chatid">
					<div v-if="chat.statusname !== 'ban'">
						<a @click="handleClick('chatwindow', chat)">
							<div class="" >
									<strong class="chat-chatid" >{{ chat.chatid }}</strong>
									<a class="chat-chatname">{{ chat.chat_name }}</a><br>
									<a class="chat-typename-green" v-if="chat.typename === 'public' || chat.typename === 'direct'" >{{ chat.typename }}</a>
									<a class="chat-typename-red" v-if="chat.typename === 'protected'" >{{ chat.typename }}</a>
									<a class="chat-typename-orange" v-if="chat.typename === 'private'" >{{ chat.typename }}</a>
							</div>
						</a>
					</div>
				</div>
			</div>
			<!------------CHATS WHERE USER IS NOT JOINED----------------------------------->
			<div v-if="type === 'open'">
				<div class="chat-message-view" v-for="chat in openchats" :key="chat.chatid">
					<a>
						<div class="">
							<a @click="joinchat(chat.chatid)" v-if="chat.typename === 'public'">
								<div class="" >
									<strong class="chat-chatid" >{{ chat.chatid }}</strong>
									<a class="chat-chatname">{{ chat.chat_name }}</a><br>
									<a class="chat-typename-green" v-if="chat.typename === 'public'" >{{ chat.typename }}</a>
								</div>
							</a>
							<a @click="togglePwdPopup()" v-if="chat.typename === 'protected'"> <!--const joinchat = (id : number, password ?: string) =>{-->
								<PwdPopup id="PwdPopup" v-if="pwdPopup === true" :togglePwdPopup="() => togglePwdPopup()" :curr_chatid="chat.chatid" />
								<div class="" >
									<strong class="chat-chatid" >{{ chat.chatid }}</strong>
									<a class="chat-chatname">{{ chat.chat_name }}</a><br>
									<a class="chat-typename-red" v-if="chat.typename === 'protected'" >{{ chat.typename }}</a>
								</div>
							</a>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
	
	<gotBannedPopup id="gotBannedPopup" v-if="gotBannedtrigger === true" :togglegotBanned="() => togglegotBanned()" :bantime="bantime" />
	<gotMutedPopup id="gotMutedPopup" v-if="gotMutedtrigger === true" :togglegotMuted="() => togglegotMuted()" :mutetime="mutetime" />
	<ChatWindow v-if="selected === 'chatwindow'" :curr_chat="sel_chat" />

			<div class="chat-menu">
				<a @click="handleClick('overview', 0), changeType('open')">
					<img src="../../assets/chat-icon.png" alt="user-photo" width="40" height="40">
				</a>
				<a @click="handleClick('overview', 0), changeType('joined')">
					<img src="../../assets/people_icon.png" alt="user-photo" width="40" height="40">
				</a>
				<a @click="togglePopup()">
					<img src="../../assets/new-message_icon.png" alt="user-photo" width="40" height="40">
				</a>
				<a @click="LeaveChattogglePopup()" v-if="selected === 'chatwindow'">
					<img src="../../assets/blackcross.png" alt="user-photo" width="35" height="40">
				</a>
			</div>
			<div style="clear: left"></div>

			<NewMessagePopup id="NewMessagePopup" v-if="popupTrigger === true" :togglePopup="() => togglePopup()" />
			<LeaveChatPopup id="LeaveChatPopup" v-if="LeaveChatTrigger === true" :LeaveChattogglePopup="() => LeaveChattogglePopup()" :curr_chat="sel_chat" :selectedWindow="selected"/>


		</div>
</template>



<script lang="ts">
//includes
import ChatWindow from './ChatWindow.vue'
import NewMessagePopup from './NewMessagePopup.vue'
import LeaveChatPopup from './LeaveChat.vue'
import PwdPopup from './pwdPopup.vue'
import gotBannedPopup from './gotBanned.vue'
import gotMutedPopup from './gotMuted.vue'
import { defineComponent, ref } from 'vue'

//for getting data from the backend
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'
import type { IChats } from '../../types/Chats'

//socket.io
import SocketioService from '../../services/SocketioService.js';

type SelectedChat = 'overview' | 'chatwindow' | 'newchat'

export default defineComponent({
	name: 'chat-module',
	components: { ChatWindow, LeaveChatPopup, NewMessagePopup, PwdPopup, gotBannedPopup, gotMutedPopup },

	data () {
		return {
			user: [] as IUser[],
			chats: [] as IChats[],
			openchats: [] as IChats[],
			socket: SocketioService.socket,
			bantime : 0 as number,
			mutetime: 0 as number,
			muted: false as boolean
		}
	},

	created () {
		this.socket.on('refresh-chat', () => {
			this.retrieveCurrentChats();
			this.retrieveOpenChats();
		});
		
		this.socket.on('chat-leave', () => {
			this.handleClick('overview', 0);
		});

		this.socket.on('got-banned', (data : any) => {
			if (this.user[0].userid === data.userid)
			{
				this.handleClick('overview', 0);
				this.bantime = data.time;
				this.togglegotBanned();
			}
		})

		this.socket.on('got-muted', (data : any) => {
			if (this.user[0].userid === data.userid)
			{
				this.mutetime = data.time;
				this.muted = true;
				this.togglegotMuted();
			}
		})
	},


	methods: {
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		async retrieveCurrentChats() {
			await DataService.getJoinedChats()
			.then((response: ResponseData) => {
				this.chats = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			})
		},

		async retrieveOpenChats() {
			await DataService.getOpenChats()
			.then((response: ResponseData) => {
				this.openchats = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			})
		},

	},

	mounted () {
		this.retrieveCurrentUser();
		this.retrieveCurrentChats();
		this.retrieveOpenChats();
	},

	setup(){
		const message = ref('');

		const popupTrigger = ref(false);
		const togglePopup = () => {
			popupTrigger.value = !popupTrigger.value;
		}

		const LeaveChatTrigger = ref(false);
		const LeaveChattogglePopup = () => {
			LeaveChatTrigger.value = !LeaveChatTrigger.value;
			return LeaveChatTrigger.value;
		}

		const type = ref<String>('joined');
		const changeType = (term: String) => {
			type.value = term;
		}

		const selected = ref<SelectedChat>('overview');
        const NULL_CHAT = JSON.stringify( {chatid: 0,    chat_name: "no chat", typename: "no chat", status: 0 });
        const sel_chat = ref<IChats>(JSON.parse(NULL_CHAT));
        const handleClick = (term: SelectedChat, selected_chat: any) => {
            sel_chat.value = selected_chat;
            if (selected_chat === 0) {
                const NULL_CHAT = JSON.stringify( {chatid: 0,    chat_name: "no chat", typename: "no chat", status: 0 });
                sel_chat.value = JSON.parse(NULL_CHAT);
            }
            selected.value = term;
        }

		const pwdPopup = ref(false);
		const togglePwdPopup = () => {
			pwdPopup.value = !pwdPopup.value;
		}

		const gotBannedtrigger = ref(false);
		const togglegotBanned = () => {
			gotBannedtrigger.value = !gotBannedtrigger.value;
		}

		const gotMutedtrigger = ref(false);
		const togglegotMuted = () => {
			gotMutedtrigger.value = !gotMutedtrigger.value;
		}

		const joinchat = async (id : number, password ?: string) => {
			if (password === undefined)
				password = '';
			await DataService.createChat(String(id), password, 'join')
            .then((response: ResponseData) => {
                SocketioService.refreshChats();
            })
            .catch((e: Error) => {
                console.log(e);
            });
		}

		return {message, selected, handleClick, togglePopup, popupTrigger, sel_chat, LeaveChattogglePopup, LeaveChatTrigger,
				changeType, type, joinchat, togglePwdPopup, pwdPopup, togglegotBanned, gotBannedtrigger, togglegotMuted, gotMutedtrigger }
	}
})
</script>


<style scoped>

.chat-wrapper {
	max-height: 600px;
}
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

.chat-typename-orange {
	color: orangered;
}

.chat-overview {
		height: 340px;
		overflow-y: scroll;
		scrollbar-color: rebeccapurple green;
		scrollbar-width: thin;
		/* display: flex;
		flex-direction: column-reverse; */
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

.chat-menu {
	background-color: var(--second-bg-color);
	color: white;
	text-align: center;
	max-height: 50px;
	width: 100%;
	overflow: auto;
}
.chat-menu img {
	margin: 5px 20px;
	cursor: pointer;
	float: left;
}
.chat-menu img:hover {
	background-color: rgb(0,0,0,0.3)
}
</style>
