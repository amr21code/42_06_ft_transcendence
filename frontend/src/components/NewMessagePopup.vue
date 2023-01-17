<template>
    <div class="popup" @keyup.esc="togglePopup" tabindex="0">
        <div class="popup-inner">
            <h2>Create a new chat</h2>
            <!-- <label>
                Privat<input class="radio" type="checkbox">
            </label>
            <label>
                Group<input class="radio" type="checkbox">
            </label> -->
            <br>
            <input class="popup-textfield" type="text" placeholder="Name of the chat">
            <br>
            <input class="popup-textfield" type="text" placeholder="password">
            <br>
            <button class="submit-button" name="submit">
                <input class="submit-button" type="submit" @click="createNewChat">
            </button>

            <button class="popup-close" @click="togglePopup">Close</button>
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
	name: "NewMessagePopup",
    props: ['togglePopup'],

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

        //needs to take the chatname and chatid in order to pass it to the backend
        createNewChat() {
            DataService.createChat()
            .then((response: ResponseData) => {
				console.log("chat got created with id ", response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
        }
        
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