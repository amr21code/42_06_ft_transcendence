<template>
	<div class="popup" @keyup.esc="(togglePwdPopup)" tabindex="0">
		<div class="popup-inner">
			<slot />
			<div class="password-text-wrapper">
				<div>
					<h2>join protected chat[{{ curr_chatid }}]</h2>
					<a>enter a password</a><br>
					<input type=password placeholder="password" v-model="password"><br>
					<a v-if="error === true">Error: wrong password</a><br><br>
					<button @click="joinchat(curr_chatid, password)" type="submit">submit</button>
					<button @click="(togglePwdPopup)">close</button>
				</div>
			</div>
		</div>
	</div> 
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import DataService from '../../services/DataService'
import type { ResponseData } from '../../types/ResponseData'
import type { IUser } from '../../types/User'
import SocketioService from '../../services/SocketioService'

export default defineComponent({
	name: "pwdPopup",
	
	data () {
		return {
			user: {} as IUser,
			socket: SocketioService.socket,
			password: '' as string,
		}
	},

	props: {
		['togglePwdPopup'] : {
			required: true,
			type: Function
		},
		curr_chatid : {
			required: true,
			type: Number
		},
	},
	methods: {
		async retrieveCurrentUser() {
			await DataService.getUser()
			.then((response: ResponseData) => {
				this.user = response.data[0];
			})
			.catch((e: Error) => {
				// console.log(e);
			});
		},
	},

	mounted () {
		this.retrieveCurrentUser();

	},

	setup (props) {
		const error = ref(false);
		const joinchat = async (id : number, password ?: string) =>{
			if (password === undefined)
				password = '';
			await DataService.createChat(String(id), password, 'join')
            .then((response: ResponseData) => {
                SocketioService.refreshChats();
				props.togglePwdPopup();
				error.value = false;
				
            })
            .catch((e: Error) => {
				error.value = true;
                // console.log(e);
            });
		}

		return { joinchat, error }
	}
})
</script>


<style scoped>
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

.password-text-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
}


</style>
