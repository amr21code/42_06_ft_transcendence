<template>
    <div class="popup" @keyup.esc="(ChatInfotogglePopup)" tabindex="0">
        <div class="popup-inner">
            <h2>Info to chat[{{ chat.chatid }}]</h2>
			<!-- {{ chat }} <br> -->
			<!-- {{ users }} <br>  -->
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
					<td> <!-- userid -->
						{{ user.userid }}
					</td>
					<td> <!-- username -->
						{{ user.username }}
					</td>
					<td> <!-- statusname -->
						{{ user.statusname }}
					</td>
					<td v-if="user.userid != user_me[0].userid && isAdmin === true"> <!-- mute -->
						<button @click="(toggleMute)" v-if="Mute === false">mute</button>
						<div v-if="Mute === true">
							<select v-model="mutetime" required>
								<option value="1">10 minutes</option>
								<option value="2">20 minutes</option>
								<option value="3">30 minutes</option>
								<option value="6">60 minutes</option>
							</select>
							<button @click="muteUser(user.userid, mutetime)">mute</button>
						</div>
						<button @click="(toggleMute)" v-if="user.status === 2">unmute</button>
					</td>
					<td v-if="user.userid != user_me[0].userid && isAdmin === true"> <!-- ban -->
						<button @click="(toggleBan)" v-if="Ban == false">ban</button>
						<div v-if="Ban === true">
							<select v-model="bantime" required>
								<option value="1">10 minutes</option>
								<option value="2">20 minutes</option>
								<option value="3">30 minutes</option>
								<option value="6">60 minutes</option>
							</select>
							<button @click="banUser(user.userid, bantime)">ban</button>
						</div>
						<button @click="(toggleBan)" v-if="user.status === 3">unban</button>
					</td>
					<td v-if="user.userid != user_me[0].userid"> <!-- invite -->
						<button @click="(challengeUser(user.userid), ChatInfotogglePopup)">challenge</button>
					</td>
				</tr>
			</tbody>
		</table>
			<button class="popup-close" @click="(ChatInfotogglePopup)">Close</button>
        </div>
    </div>
</template>





<script lang="ts">
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

    data () {
		return {
			user_me: [] as IUser[],
			users: [] as IUser[],
            socket: SocketioService.socket,
			mutetime: 10,
			bantime : 10,
			isAdmin: false as boolean,
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
			});
		},

		muteUser(userid : string, time : number){
			DataService.muteUser(this.chat.chatid, userid, time);
			this.toggleMute();
		},

		banUser(userid : string, time : number){
			DataService.banUser(this.chat.chatid, userid, time);
			this.toggleBan();
		},

		checkIfAdmin() {
			for (var user of this.users) {
				if (this.user_me[0].userid === user.userid)
					if (user.statusname === 'admin')
						this.isAdmin = true;
			}
		}
        
	},

	mounted () {
		this.retrieveCurrentUser();
		this.retrieveCurrentUsersInChat(this.chat.chatid);
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

		return { toggleMute, Mute, toggleBan, Ban, challengeUser}
			
    }  

})

</script>




<style scoped>

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
	padding: 10px 26px;
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