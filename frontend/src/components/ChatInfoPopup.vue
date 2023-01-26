<template>
    <div class="popup" @keyup.esc="(ChatInfotogglePopup)" tabindex="0">
        <div class="popup-inner">
            <h2>Info</h2>
			<!-- {{ chat }} <br> -->
			<!-- {{ users }} <br>  -->
			<table id="info-table">
			<thead id="top-row">
				<tr>
					<th>userid</th>
					<th>username</th>
					<th>statusname</th>
					<th>mute</th>
					<th>ban</th>
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
					<td> <!-- mute -->
						<button @click="(toggleMute)" v-if="Mute === false">mute</button> 
						<button @click="(toggleMute)" v-if="user.status === 2 || Mute === true">unmute</button> 
					</td>
					<td> <!-- ban -->
						<button @click="(toggleBan)" v-if="Ban == false">ban</button> 
						<button @click="(toggleBan)" v-if="user.status === 3 || Ban == true">unban</button>
					</td>
					<td> <!-- invite -->
						<button @click="(toggleChallenge)" v-if="Challenge === false">challenge</button>
						<button @click="(toggleChallenge)" v-if="Challenge === true">unchallenge</button>
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
			users: [] as IUser[],
            socket: SocketioService.socket,
		}
	},
	methods: {

		retrieveCurrentUsersInChat(chatid : number) {
			DataService.getUsersInChat(chatid)
			.then((response: ResponseData) => {
				this.users = response.data;
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
        
	},

	mounted () {
		this.retrieveCurrentUsersInChat(this.chat.chatid);
	},

    setup () {

		const Mute = ref(false);
		const toggleMute = () => {
			Mute.value = !Mute.value;
		}

		const Ban = ref(false);
		const toggleBan = () => {
			Ban.value = !Ban.value;
		}

		const Challenge = ref(false);
		const toggleChallenge = () => {
			Challenge.value = !Challenge.value;
		}

		return { toggleMute, Mute, toggleBan, Ban, toggleChallenge, Challenge}
			
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
	z-index: 99; /*brings to highest front-layer*/
	display: flex;
	align-items: center;
	justify-content: center;
}
.popup-inner {
	background-color: var(--second-bg-color);
	padding: 10px 26px;
	border-radius: 10%;
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