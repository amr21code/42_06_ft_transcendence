<!--
	This window should show an overview of all the chats and is responsible
	for the footer so that you can switch between chats and create a new chat
-->

<template>
	<div class="chat-wrapper">

		
		<div v-if="selected === 'overview'">
			<h2>chat overview</h2>
			<a v-if="type === 'joined'">Chats you joined</a>
			<a v-if="type === 'open'">Chats you can join</a>
			 <div class="chat-overview">

			<!------------CHATS WHERE USER IS JOINED----------------------------------->
			<div v-if="type === 'joined'">
				<div class="chat-message-view" v-for="chat in chats" :key="chat.chatid">
						<a @click="handleClick('chatwindow', chat)">
							<div class="" >
								<a class="chat-chatid" >Room {{ chat.chatid }}</a>
								<strong class="chat-chatname">{{ chat.chat_name }}</strong><br>
								<a class="chat-typename-green" v-if="(chat.typename === 'public' || chat.typename === 'direct')" >{{ chat.typename }}</a>
								<a class="chat-typename-red" v-if="chat.typename === 'protected'" >{{ chat.typename }}</a>
								<a class="chat-typename-orange" v-if="chat.typename === 'private'" >{{ chat.typename }}</a>
								<!-- <a class="chat-stausname-red" v-if="chat.statusname === 'ban'" >BANNED</a> -->
							</div>
						</a>
				</div>
			</div>
			<!------------CHATS WHERE USER IS NOT JOINED----------------------------------->
			<div v-if="type === 'open'">
				<div class="chat-message-view" v-for="chat in openchats" :key="chat.chatid">
					<a>
						<div class="">
							<a @click="joinchat(chat.chatid)" v-if="chat.typename === 'public'">
								<div class="" >
									<a class="chat-chatid" >Room {{ chat.chatid }}</a>
									<strong class="chat-chatname">{{ chat.chat_name }}</strong><br>
									<a class="chat-typename-green" v-if="chat.typename === 'public'" >{{ chat.typename }}</a>
								</div>
							</a>
							<PwdPopup id="PwdPopup" v-if="pwdPopup === true" :togglePwdPopup="() => togglePwdPopup()" :curr_chatid="chat.chatid" />
							<a @click="togglePwdPopup()" v-if="chat.typename === 'protected'"> <!--const joinchat = (id : number, password ?: string) =>{-->
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
				<a @click="handleClick('overview', 0), changeType('open')" title="all open chat rooms">
					<img class="chat-menu-icon" src="../../assets/search-chat-icon.png" alt="open-chats-icon">
				</a>
				<a @click="handleClick('overview', 0), changeType('joined')" title="all chat rooms you joined">
					<img class="chat-menu-icon" src="../../assets/all-chats-icon.png" alt="joined-chats-icon">
				</a>
				<a @click="togglePopup()" title="create a new chat">
					<img class="chat-menu-icon" src="../../assets/create-chat-icon.png" alt="new-chat-icon">
				</a>
				<a @click="LeaveChattogglePopup()" v-if="selected === 'chatwindow'" title="leave chat">
					<img class="chat-menu-icon" src="../../assets/leave-chat-icon.png" alt="leave-chat-icon">
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
				setTimeout(function(){ console.log("hi");}, this.mutetime * 100); //1000 //need to set this.muted = false;
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
			// if (selected_chat.statusname === 'ban')
			// 	return ;
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
	max-height: 100%;
	max-width: 100%;
	min-width: 100%;
}
.chat-chatid {
	float: left;
	color: black;
	width: 100%;
}

.chat-chatname {
	/* float: left; */
	color: black;
	/* padding-left: 10%; */
}

.chat-typename-green {
	/* float: left; */
	color: green;
}

.chat-typename-red {
	/* float: left; */
	color: red;
}

.chat-typename-orange {
	/* float: left; */
	color: orangered;
}

.chat-stausname-red {
	color: red;
}

.chat-overview {
	height: 50vh;
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
	/* padding: 10px; */
	width: auto;
	height: auto;
	text-align: center;
	/* height: 30px; */
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

.chat-menu {
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow-y: hidden; 
}

.chat-menu-icon {
	margin: calc(-10px + 1.5625vw) calc(-1px + 1.5625vw);
	margin-top: calc(-5px + 1.5625vw);
	height: calc(15px + 1.5625vw);
	width: calc(15px + 1.5625vw);
	cursor: pointer;
}

.chat-menu-icon:hover {
	transition: all .4s;
	filter: invert(100%);
	-webkit-filter: invert(100%);
}

</style>
