<template>
    <div class="popup" @keyup.esc="(ChatInfotogglePopup)" tabindex="0">
        <div class="popup-inner">
            <h2>Info to chat[{{ chat.chatid }}]</h2>
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
					<!-- <th>onlinestatus</th>  {{ user.user_status }}-->
					<th><div v-if="isAdmin === true">mute</div></th>
					<th><div v-if="isAdmin === true">ban</div></th>
					<th>challenge</th>
					<th><div>make admin</div></th>
					<!-- <th><div>add friend</div></th> -->
				</tr>
			</thead>
			<div v-for="(user, index) in users" :key="index">
				<div  v-if="user.status != 3">
					<tbody>
						<tr class="info-item" >
							<td @click="toggleUserHistory(user)"> <!-- userid -->
								
								<img src="../../assets/offlineicon.png" class="user_status-img" v-if="user.user_status === 0">
								<img src="../../assets/onlineicon.png" class="user_status-img" v-if="user.user_status === 1">
								<!-- {{ user.user_status }} when status === 1 show green dot else grey -->
								{{ user.userid }}
							</td>
							<td @click="toggleUserHistory(user)"> <!-- username -->
								{{ user.username }}
							</td>
							<td @click="toggleUserHistory(user)"> <!-- statusname -->
								{{ user.statusname }}
							</td>
							<MatchHistoryPopup id="MatchHistoryPopup" v-if="showUserHistoryTrigger === true" :untoggleUserHistory="() => toggleUserHistory(0)" :userid="selectedUser"/>
							<!-- <ChatUserdataPopup v-if="ChatUserdataPopupTrigger === true" :ChatUserdatatogglePopup="() => ChatUserdatatogglePopup(chat)" :curr_user="sel_user"/> -->
<!---------------------- mute ---------------------------------->
							<td>
								<div v-if="user.userid != user_me[0].userid && isAdmin === true">
									<img src="../../assets/muteicon.png" @click="(toggleMute(index + 1))" v-if="Mute === 0 && user.status !== 2">
									<!-- <button @click="(toggleMute(index + 1))" v-if="Mute === 0 && user.status !== 2">mute</button> -->
									<div v-if="Mute === index + 1">
										<select v-model="mutetime" required>
											<option value="10">10 minutes</option>
											<option value="20">20 minutes</option>
											<option value="30">30 minutes</option>
											<option value="60">60 minutes</option>
										</select>
										<button @click="muteUser(user.userid, mutetime)" v-if="user.status !== 2">mute</button>
									</div>
									<button v-if="user.status === 2">-MUTED-</button>
								</div>
							</td>
<!---------------------- ban ---------------------------------->
							<td>
								<div v-if="user.userid != user_me[0].userid && isAdmin === true">
									<img src="../../assets/banicon.png" @click="(toggleBan(index + 1))" v-if="Ban == 0 && user.status !== 3">
									<!-- <button @click="(toggleBan(index + 1))" v-if="Ban == 0 && user.status !== 3">ban</button> -->
									<div v-if="Ban === index + 1">
										<select v-model="bantime" required>
											<option value="10">10 minutes</option>
											<option value="20">20 minutes</option>
											<option value="30">30 minutes</option>
											<option value="60">60 minutes</option>
										</select>
										<button @click="banUser(user.userid, bantime)" v-if="user.status !== 3">ban</button>
									</div>
									<button v-if="user.status === 3">-BANNED-</button>
								</div>
							</td>
<!---------------------- challenge ---------------------------------->
							<td>
								<div v-if="user.userid != user_me[0].userid && user.user_status === 1">
									<!-- <button @click="(challengeUser(user.userid), ChatInfotogglePopup)">challenge</button> -->
									<img src="../../assets/challengeicon.png" @click="(challengeUser(user.userid), ChatInfotogglePopup)">
								</div>
							</td>
<!---------------------- make admin ---------------------------------->
							<td>
								<div>
									<img src="../../assets/adminicon.png" @click="makeAdmin(user.userid, chat.chatid)" v-if="user.status != 0">
									<!-- <button v-if="user.status != 0 && user_me[0].userid">make admin</button> -->
								</div>
							</td>
<!---------------------- add friend ---------------------------------->
							<!-- <td>
								<div>
									<img src="../../assets/addfriendicon.png" id="add-friend-button" @click="friendButtonAction(user.userid)" v-if="user.userid != user_me[0].userid">
									<button v-if="user.userid != user_me[0].userid">add friend</button>
									<button id="add-friend-button" @click="friendButtonAction(user.userid)" v-if="user.userid != user_me[0].userid">add friend</button>
								</div>
							</td> -->
						</tr> 
					</tbody>
				</div>
			</div>
		</table>
			<button class="popup-close" @click="(ChatInfotogglePopup)">Close</button>
        </div>
    </div>
</template>





<script lang="ts">

import ChatUserdataPopup from './ChatUserdataPopup.vue'

import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

//for getting data from the backend
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'
import type { IChats } from '../../types/Chats'
import SocketioService from '../../services/SocketioService'
import MatchHistoryPopup from '../popups/MatchHistoryPopup.vue'


export default defineComponent({
	name: "ChatInfoPopup",
	components: { ChatUserdataPopup, MatchHistoryPopup },
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
	async created () {
		await this.retrieveCurrentUser();
		await this.checkIfAdmin();
		await this.retrieveCurrentUsersInChat(this.chat.chatid);
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
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user_me = response.data;
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		async retrieveCurrentUsersInChat(chatid : number) {
			await DataService.getUsersInChat(chatid)
			.then((response: ResponseData) => {
				this.users = response.data;
				this.checkIfAdmin();
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		async muteUser(userid : string, time : number){
			await DataService.muteUser(this.chat.chatid, userid, time);
			await this.retrieveCurrentUsersInChat(this.chat.chatid);
			SocketioService.refreshChats();
			SocketioService.gotMuted(userid, time);
			this.toggleMute(0);
		},

		async banUser(userid : string, time : number){
			await DataService.banUser(this.chat.chatid, userid, time);
			await this.retrieveCurrentUsersInChat(this.chat.chatid);
			SocketioService.refreshChats();
			SocketioService.gotBanned(userid, time);
			this.toggleBan(0);
		},

		async checkIfAdmin() {
			for (var user of this.users) {
				if (this.user_me[0].userid === user.userid)
					if (user.statusname === 'admin')
						this.isAdmin = true;
			}
		},

		async makeAdmin(userid : string, chatid : number) {
			await DataService.changeChatUserdata(userid, chatid, 0)
			.then((response: ResponseData) => {
				SocketioService.refreshChats();
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

		//changes the name of the chat by sending it to the API and then refreshs the chatoverview
		async changeChatDetails (type : string, chatid : number, chatname : string, password : string) {
			await DataService.changeChatDetails(type, chatid, chatname, password)
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

		const Mute = ref(0);
		const toggleMute = (newValue : number) => {
			console.log("toggleMute");
			Mute.value = newValue;
		}

		const Ban = ref(0);
		const toggleBan = (newValue : number) => {
			Ban.value = newValue;
		}

		const challengeUser = (userid: string) => {
			SocketioService.challengeUser(userid);
			props.ChatInfotogglePopup();
		}

		const option = ref(0);
		const toggleOption = (i : number) => {
			option.value = i;
		}

		// const ChatUserdataPopupTrigger = ref(false);
		// const NULL_USER = JSON.stringify( {	userid: '',
		// 									username: '',
		// 									picurl: '',
		// 									profilepic42: '',
		// 									created: 0,
		// 									statusname: '',
		// 									wins: '',
		// 									losses: '',
		// 									status: 0,
		// 									bantime: 0,
		// 									paddlecolor: '',
		// 									user_status : 0,});
		// const sel_user = ref<IUser>(JSON.parse(NULL_USER));
		// const ChatUserdatatogglePopup = async (selected_user : any) => {
		// 	// this.retrieveThisUser(sel_user.value.userid);
		// 	sel_user.value = selected_user;
		// 	ChatUserdataPopupTrigger.value = !ChatUserdataPopupTrigger.value;
		// }

		const showUserHistoryTrigger = ref(false);
		const selectedUser = ref("");
		// const selectedUserPhoto = ref("");
		const toggleUserHistory = (user: any) => {
			if (user === 0)
			{
				showUserHistoryTrigger.value = false;
				return ;
			}
			showUserHistoryTrigger.value = true;
			selectedUser.value = user.userid;
			// selectedUserPhoto.value = user.picurl;

		}

		return { toggleMute, Mute, toggleBan, Ban, challengeUser, toggleOption, option,
				toggleUserHistory, selectedUser, showUserHistoryTrigger }
			
    }  

})

</script>




<style scoped>

.user_status-img {
	width: 15px;
	height: 15px;
}

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
		display: block;
		position: relative;
		scrollbar-gutter: stable both-edges;
		/* table-layout: fixed; */
		/* width: 100%; */
	}
	
	th {
		table-layout: fixed;
		width: 0%;
		position: sticky;
		top: 0;
		background-color: var(--second-bg-color);
		color: white;
	}

	td {
		width: 14%;
	}

	#info-table th, td {
		padding: 20px 40px;
		text-align: center;
	}

	/* .admin td {
		width: 100%;
		position:sticky;
	}
	.member td {
		position:sticky;
	} */

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