<template>
    <div class="popup" @keyup.esc="(LeaveChattogglePopup)" tabindex="0">
        <div class="popup-inner">
            <h2>Leave chat</h2>
            <a>Are you sure that you want to leave the chat?</a><br>
            <button class="submit-button" @click="leaveChat(curr_chat.chatid), setSelectedWindow('overview'), LeaveChattogglePopup()">leave</button>
            <button class="close-button" @click="(LeaveChattogglePopup)">Close</button>
        </div>
    </div>
</template>



<script lang="ts">
import { defineComponent, ref } from 'vue'

//for getting data from the backend
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'
import SocketioService from '../../services/SocketioService'

export default defineComponent({
	name: "LeaveChatPopup",
    props: {
		curr_chat: {
			required: true,
			type: Object
		},
        selectedWindow: {
			required: true,
			type: String
		},
        ['LeaveChattogglePopup'] : {
			required: true,
			type: Function
		}
	},

    data () {
		return {
			user: [] as IUser[],
			socket: SocketioService.socket,
		}
	},
	methods: {
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
				// console.log(response.data);
			})
			.catch((e: Error) => {
				// console.log(e);
			});
		},

        leaveChat(chatid : number) {
			SocketioService.chatLeave(chatid);
			SocketioService.refreshChats();
        },

        setSelectedWindow(selectedWindow : String){
            selectedWindow = selectedWindow;
        }
        
	},
})

</script>



<style scoped>

.close-button {
	color: black;
}

.submit-button {
	color: black;
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
	padding: 1rem 2rem;
	/* border-radius: 10%; */
	border-radius: 2px;
}

.popup-inner h2 {
	text-align: center;
	color: white;
}

.popup-inner a {
	text-align: center;
	color: white;
}

.popup-close {
    color: black;
}

</style>
