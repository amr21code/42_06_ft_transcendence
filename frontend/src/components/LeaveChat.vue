<template>
    <div class="popup" @keyup.esc="LeaveChattogglePopup" tabindex="0">
        <div class="popup-inner">
            <h2>Leave chat</h2>
            <a>Are you sure that you want to leave the chat?</a><br>
            <button class="" @click="LeaveChattogglePopup">
                <input class="submit-button" type="submit" @click="leaveChat(curr_chat.chatid), setSelectedWindow('overview')">
            </button>

            <button class="close-button" @click="LeaveChattogglePopup">Close</button>
        </div>
    </div>
</template>





<script lang="ts">
import { defineComponent } from 'vue'

//for getting data from the backend
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import type { IChats } from '../types/Chats'


export default defineComponent({
	name: "LeaveChatPopup",
    props: {
		curr_chat: {
			required: true,
			type: String
		},
        selectedWindow: {
			required: true,
			type: String
		},
        ['LeaveChattogglePopup'] : String
	},

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
				console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

        leaveChat(chatid : number) {
            DataService.leaveChat(chatid)
            .then((response: ResponseData) => {
				console.log("leave chat with the id", chatid);
			})
			.catch((e: Error) => {
				console.log(e);
			});
        },

        setSelectedWindow(selectedWindow : String){
            selectedWindow = selectedWindow;
        }
        
	},
    setup () {

    }  

})

</script>




<style scoped>

.close-button {
  background-color: blue;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
}

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

.popup-close {
    color: black;
}
</style>