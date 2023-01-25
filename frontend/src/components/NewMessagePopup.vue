<template>
    <div class="popup" @keyup.esc="togglePopup" tabindex="0">
        <div class="popup-inner">
            <h2>Create or join a chat</h2>
            <!-- <label>
                Privat<input class="radio" type="checkbox">
            </label>
            <label>
                Group<input class="radio" type="checkbox">
            </label> -->
            <a class="info-text">Enter the chatid that you want to join, create a new chat with (public) or without
                (protected) a password or enter a userid in order to create a direct chat.</a><br><br>
            <button @click="(changeShowInput('group'))">Groupchat</button>
            <button @click="(changeShowInput('dm'))">Privatechat</button>
            <button @click="(changeShowInput('join'))">Join</button>
            <br>
            <!-- <iframe name="hiddenFrame" width="0" height="0" border="0" style="display: none;"></iframe> -->

            <!-- <form action="" id="myForm" name="myForm" > -->
              
                <input class="popup-textfield" type="text" placeholder="Name of the chat" v-model="chatname" v-if="showinput === 'group'"><a v-if="showinput === 'group'">(optional)</a>
                <input class="popup-textfield" type="text" placeholder="userid of the user" v-model="chatname" v-if="showinput === 'dm'" required>
                <input class="popup-textfield" type="text" placeholder="ID of the chat" v-model="chatname" v-if="showinput === 'join'" required>
                <br>
                <input class="popup-textfield" type="password" placeholder="password" v-model="password" v-if="showinput === 'group' || showinput === 'join'"><a v-if="showinput === 'group' || showinput === 'join'">(optional)</a>
                <br>
                <button class="submit-button" name="submit" v-if="showinput">
                    <input class="submit-button" type="submit" @click="createNewChat(chatname, password, showinput)">
                </button>
                <button class="popup-close" @click="togglePopup">Close</button>
                <a v-if="invalid === true">Error: Could not perfom action</a>

            <!-- </form> -->
        </div>
    </div>
</template>





<script lang="ts">
import { defineComponent, ref } from 'vue'

//for getting data from the backend
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'
import SocketioService from '../services/SocketioService'


export default defineComponent({
	name: "NewMessagePopup",
    props: ['togglePopup'],

    data () {
		return {
			user: [] as IUser[],
            socket: SocketioService.socket,
            chatname: '',
            password: '',
            invalid: false,
		}
	},
	methods: {
		retrieveCurrentUser() {
			DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
				// console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

        createNewChat(chatname_id : string, password : string, type : string) {
            // console.log(this.user[0].userid);
            if (chatname_id === '' && type == 'join')
                return ;
            if (chatname_id === '' && type == 'dm')
                return ;
            if (chatname_id === '' && type == 'group')
                chatname_id = 'public chat by ' + this.user[0].userid;
            DataService.createChat(chatname_id, password, type)
            .then((response: ResponseData) => {
                SocketioService.refreshChats();
            })
            .catch((e: Error) => {
                this.invalid = true;
                console.log(e);
            });
        }
        
	},

    mounted () {
        this.retrieveCurrentUser();
    },

    setup () {

        const showinput = ref();
		const changeShowInput = (type : String) => {
			showinput.value = type;
		}

		return { showinput, changeShowInput }
    }  

})

</script>




<style scoped>

.info-text {
    border-bottom: 1% solid black;
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
	/* text-align: left; */
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
    max-width: 300px;
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