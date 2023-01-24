<template>
    <div class="popup" @keyup.esc="(ChatInfotogglePopup)" tabindex="0">
        <div class="popup-inner">
            <h2>Info</h2>
            <a>Hier könnte ihre Werbung stehen</a>
			{{ curr_chat }}
			<button class="close-button" @click="(ChatInfotogglePopup)">Close</button>
        </div>
    </div>
</template>





<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

//for getting data from the backend
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import type { IChats } from '../types/Chats'
import SocketioService from '../services/SocketioService'


export default defineComponent({
	name: "ChatInfoPopup",
    props: ['ChatInfotogglePopup'],
			curr_chat: {
				required: true,
				type: Object as PropType<IChats>
			},

    data () {
		return {
			user: {} as IUser,
            socket: SocketioService.socket,
		}
	},
	methods: {

		retrieveCurrentUsersInChat(chatid : number) {
			DataService.getUsersInChat(chatid)
			.then((response: ResponseData) => {
				this.user = response.data;
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},
        
	},

	mounted () {
		this.retrieveCurrentUsersInChat(this.curr_chat.chatid);
	},

    setup () {

    }  

})

</script>




<style scoped>

.submit-button {
  background-color: blue;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
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

.popup-textfield {
    border-top: 20%;
}

.popup-close {
    color: black;
}
</style>