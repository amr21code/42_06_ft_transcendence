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
            <a class="info-text">Enter the chatid that you want to join, create a new chat either private, with (public) or without
                (protected) a password or enter a userid in order to create a direct chat.</a>
            <div class="button-box">
                <button class="select-button" @click="(changeShowInput('group'))">Groupchat</button>
                <button class="select-button" @click="(changeShowInput('dm'))">Directchat</button>
                <button class="select-button" @click="(changeShowInput('join'))">Join</button>
            </div>
            <!-- <iframe name="hiddenFrame" width="0" height="0" border="0" style="display: none;"></iframe> -->
            <div class="checkbox-label" v-if="showinput === 'group'">
                <input class="checkbox-input" type="checkbox" id="privatechat" value="private"><label class="" for="privatechat">Privatechat</label><br>
            </div>

            <!-- <form action="" id="myForm" name="myForm" > -->
            <input class="" type="text" placeholder="Name of the chat" v-model="chatname" v-if="showinput === 'group'"><a v-if="showinput === 'group'">(optional)</a>
            <input class="" type="text" placeholder="userid of the user" v-model="chatname" v-if="showinput === 'dm'" required>
            <input class="" type="text" placeholder="ID of the chat" v-model="chatname" v-if="showinput === 'join'" required>
            
            <input class="" type="password" placeholder="password" v-model="password" v-if="showinput === 'group' || showinput === 'join'"><a v-if="showinput === 'group' || showinput === 'join'">(optional)</a>
                
            <div class="button-box">
                <button class="submit-button" name="submit" v-if="showinput" @click="createNewChat(chatname, password, showinput)">submit</button>
                <button class="popup-close" @click="togglePopup">Close</button>
                <br><a v-if="invalid === true">Error: Could not perfom action</a>
            </div>

            <!-- </form> -->
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
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data;
				// console.log(response.data);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		},

        async createNewChat(chatname_id : string, password : string, type : string) {
            if (chatname_id === '' && type == 'join')
                return ;
            if (chatname_id === '' && type == 'dm')
                return ;
            if (chatname_id === '' && type == 'group')
                chatname_id = 'public chat by ' + this.user[0].userid;
            var inputElements = document.getElementsByClassName('checkbox-input');
            for(var i=0; inputElements[i]; ++i){
                if((inputElements[i] as HTMLInputElement).checked) {
                    type = 'private';
                    break;
                }
            }
            await DataService.createChat(chatname_id, password, type)
            .then((response: ResponseData) => {
                SocketioService.refreshChats();
                this.togglePopup();
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

.button-box {
    padding: 20px 0px;
	align-content: center;
}

.checkbox-label {
    color: white;

}
.popup {
	/* text-align: left; */
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
}
.popup-inner {
	background-color: var(--second-bg-color);
	padding: 1rem 2rem;
	border-radius: 2px;
	max-width: 60vw;
}

.popup-inner h2 {
	text-align: center;
    color: white;
}

.popup-inner a {
	text-align: center;
    color: white;
}

.popup-textfield {
    float: right;
}

.popup-close {
    color: black;
}

.select-button {
	margin: 5px;
}
</style>