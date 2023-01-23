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
            <a>Enter the name of the chat and optional the password</a><br>
            <button @click="(changeShowInput(false))">Groupchat</button>
            <button @click="(changeShowInput(true))">Privatechat</button>
            <br>
            <input class="popup-textfield" type="text" placeholder="Name of the chat" v-model="chatname" v-if="showinput === false">
            <input class="popup-textfield" type="text" placeholder="Name of the user" v-model="chatname" v-if="showinput === true">
            <br>
            <input class="popup-textfield" type="password" placeholder="password" v-model="password" v-if="showinput === false">
            <br>
            <button class="submit-button" name="submit">
                <input class="submit-button" type="submit" @click="createNewChat(chatname, password, showinput)">
            </button>

            <button class="popup-close" @click="togglePopup">Close</button>
        </div>
    </div>
</template>





<script lang="ts">
import { defineComponent, ref } from 'vue'

//for getting data from the backend
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import type { IChats } from '../types/Chats'
import SocketioService from '../services/SocketioService'


export default defineComponent({
	name: "NewMessagePopup",
    props: ['togglePopup'],

    data () {
		return {
			user: {} as IUser,
			chats: {} as IChats,
            socket: SocketioService.socket,
            chatname: '',
            password: '',
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

        createNewChat(chatname : string, password : string, type : Boolean) {
            DataService.createChat(chatname, password, type)
            .then((response: ResponseData) => {
                SocketioService.refreshChats();
            })
            .catch((e: Error) => {
                console.log(e);
            });
        }
        
	},
    setup () {

        const showinput = ref();
		const changeShowInput = (type : Boolean) => {
			showinput.value = type;
		}

		return { showinput, changeShowInput }
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