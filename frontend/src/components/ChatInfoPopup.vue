<template>
    <div class="popup" @keyup.esc="(ChatInfotogglePopup)" tabindex="0">
        <div class="popup-inner">
            <h2>Info to chat[{{ chat.chatid }}]</h2>
			<!-- {{ chat }} <br> -->
			<!-- {{ users }} <br>  -->
			<!-- <a>Change channel password:</a> -->
			<div class="button-container" v-if="isAdmin === true">
				<button @click="toggleOption(1)" class="option-button" v-if="option === 0">Change name</button>
				<div v-if="option === 1">
					<input type="text" placeholder="Enter new chatname"  v-model="newChatname">
					<button @click="changeChatDetails(chat.typename, chat.chatid, newChatname, chat.password), toggleOption(0)">submit</button>
				</div>

				<button @click="toggleOption(2)" class="option-button" v-if="option === 0 && chat.typename === 'protected'">Remove password</button>
				<div v-if="option === 2">
					<a>You are about to remove the password.</a><br>
					<a>This makes the Chat public. Are you sure?</a><br>
					<button class="option-button" @click="changeChatDetails('public', chat.chatid, chat.chat_name, ''), toggleOption(0)">Yes</button>
					<button class="option-button" @click="toggleOption(0)">No</button>
				</div>


				<button @click="toggleOption(3)" class="option-button" v-if="option === 0">Change password</button>
				<div v-if="option === 3">
					<input type="text" placeholder="Enter new chatpassword"  v-model="newChatpassword">
					<button @click="changeChatDetails(chat.typename, chat.chatid, chat.chat_name, newChatpassword), toggleOption(0)">submit</button>
				</div>


			</div>
			<table id="info-table">
			<thead id="top-row">
				<tr>
					<th>userid</th>
					<th>username</th>
					<th>statusname</th>
					<th v-if="isAdmin === true">mute</th>
					<th v-if="isAdmin === true">ban</th>
					<th>invite</th>
				</tr>
			</thead>
			<tbody>
				
				
				<tr class="info-item" v-for="(user, index) in users" :key="index">
					<td @click="ChatUserdatatogglePopup()"> <!-- userid -->
						{{ user.userid }}
					</td>
					<td @click="ChatUserdatatogglePopup()"> <!-- username -->
						{{ user.username }}
					</td>
					<td @click="ChatUserdatatogglePopup()"> <!-- statusname -->
						{{ user.statusname }}
					</td>
					<td v-if="user.userid != user_me[0].userid && isAdmin === true"> <!-- mute -->
						<button @click="(toggleMute)" v-if="Mute === false && user.status !== 2">mute</button>
						<div v-if="Mute === true">
							<select v-model="mutetime" required>
								<option value="10">10 minutes</option>
								<option value="20">20 minutes</option>
								<option value="30">30 minutes</option>
								<option value="60">60 minutes</option>
							</select>
							<button @click="muteUser(user.userid, mutetime)" v-if="user.status !== 2">mute</button>
						</div>
						<button @click="(toggleMute)" v-if="user.status === 2">-MUTED-</button>
					</td>
					<td v-if="user.userid != user_me[0].userid && isAdmin === true"> <!-- ban -->
						<button @click="(toggleBan)" v-if="Ban == false && user.status !== 3">ban</button>
						<div v-if="Ban === true">
							<select v-model="bantime" required>
								<option value="10">10 minutes</option>
								<option value="20">20 minutes</option>
								<option value="30">30 minutes</option>
								<option value="60">60 minutes</option>
							</select>
							<button @click="banUser(user.userid, bantime)" v-if="user.status !== 3">ban</button>
						</div>
						<button v-if="user.status === 3">-BANNED-</button>
					</td>
					<td v-if="user.userid != user_me[0].userid"> <!-- invite -->
						<button @click="(challengeUser(user.userid), ChatInfotogglePopup)">challenge</button>
					</td>
				</tr>
			</tbody>
		</table>
			<button class="popup-close" @click="(ChatInfotogglePopup)">Close</button>
        </div>
		<ChatUserdataPopup v-if="ChatUserdataPopupTrigger === true" :ChatUserdatatogglePopup="() => ChatUserdatatogglePopup()"/>
    </div>
</template>





<script lang="ts">

import ChatUserdataPopup from './ChatUserdataPopup.vue'

import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

//for getting data from the backend
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import type { IChats } from '../types/Chats'
import SocketioService from '../services/SocketioService'


export default defineComponent({
	name: "ChatInfoPopup",
	components: { ChatUserdataPopup },
    props: {
			['ChatInfotogglePopup']  : {
			required: true,
			type: Function
			},
			chat: {
				required: true,
				type: Object as PropType<IChats>,
				default: () => ({} as IChats)
			}
	},
	created () {
		this.retrieveCurrentUser();
		this.retrieveCurrentUsersInChat(this.chat.chatid);
		this.socket.on('refresh-chat', () => {
			this.retrieveCurrentUsersInChat(this.chat.chatid);
		});
	},
    data () {
		return {
			user_me: [] as IUser[],
			users: [] as IUser[],
            socket: SocketioService.socket,
			mutetime: 10,
			bantime : 10,
			isAdmin: false as boolean,
			newChatname: '' as string,
			newChatpassword: '' as string,
		}
	},
	methods: {

		// loads the current user who is logged in
		retrieveCurrentUser() {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.user_me = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		retrieveCurrentUsersInChat(chatid : number) {
			DataService.getUsersInChat(chatid)
			.then((response: ResponseData) => {
				this.users = response.data;
				this.checkIfAdmin();
				// console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
				// this.retrieveCurrentUsersInChat(chatid);
			});
		},

		muteUser(userid : string, time : number){
			DataService.muteUser(this.chat.chatid, userid, time);
			this.retrieveCurrentUsersInChat(this.chat.chatid);
			SocketioService.refreshChats();
			this.toggleMute();
		},

		banUser(userid : string, time : number){
			DataService.banUser(this.chat.chatid, userid, time);
			this.retrieveCurrentUsersInChat(this.chat.chatid);
			SocketioService.refreshChats();
			this.toggleBan();
		},

		checkIfAdmin() {
			for (var user of this.users) {
				if (this.user_me[0].userid === user.userid)
					if (user.statusname === 'admin')
						this.isAdmin = true;
			}
		},

		//changes the name of the chat by sending it to the API and then refreshs the chatoverview
		changeChatDetails (type : string, chatid : number, chatname : string, password : string) {
			DataService.changeChatDetails(type, chatid, chatname, password)
			.then((response: ResponseData) => {
				SocketioService.refreshChats();
			})
			.catch((e: Error) => {
				console.log(e);
			});
			this.chat.chat_name = chatname;
		},
        
	},
    setup (props) {

		const Mute = ref(false);
		const toggleMute = () => {
			console.log("toggleMute");
			Mute.value = !Mute.value;
		}

		const Ban = ref(false);
		const toggleBan = () => {
			Ban.value = !Ban.value;
		}

		const challengeUser = (userid: string) => {
			SocketioService.challengeUser(userid);
			props.ChatInfotogglePopup();
		}

		const option = ref(0);
		const toggleOption = (i : number) => {
			option.value = i;
		}

		const ChatUserdataPopupTrigger = ref(false);	
		const ChatUserdatatogglePopup = () => {
			ChatUserdataPopupTrigger.value = !ChatUserdataPopupTrigger.value;
		}

		return { toggleMute, Mute, toggleBan, Ban, challengeUser, toggleOption, option, ChatUserdatatogglePopup, ChatUserdataPopupTrigger }
			
    }  

})

</script>




<style scoped>

.button-container{
	text-align: center;
}

.option-button {
	margin: 1%;
}

#info-table {
		border-collapse: collapse;
		overflow: auto;
		max-height: 500px;
		/* table-layout: fixed; */
		display: block;
		position: relative;
		scrollbar-gutter: stable both-edges;
	}
	
	th {
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
	}

	#info-table th, td {
		padding: 20px 40px;
		text-align: center;
	}

	/* hover effect on all but the first line */
	#info-table tr:hover {
		background-color: var(--first-highlight-color);
		color: white;
		cursor: pointer;
	}

	.info-item img {
		max-height: 30px;
	}

.popup {
	text-align: left;
	background-color: rgba(0,0,0,0.8);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 98; /*brings to highest front-layer*/
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
}
.popup-inner {
	background-color: var(--second-bg-color);
	padding: 1rem 2rem;
	/* border-radius: 10%; */
	border-radius: 2px;
}

.popup-inner h2 {
	text-align: center;
}

.popup-inner a {
	text-align: center;
	color: white;
}

.popup-close {
    color: black;
	float: right;
	border-right: 5%;
}
</style>