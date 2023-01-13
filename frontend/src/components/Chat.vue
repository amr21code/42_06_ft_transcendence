<template>
	<div class="chat-wrapper">

		<!-- <Overview v-if="selected === 'overview'"/> -->
		<ChatWindow v-if="selected === 'chatwindow'"/>
		<div v-if="selected === 'overview'">
			<h2>Chat overview</h2>
			<div class="chat-overview">
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/jorit_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Jorit</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/ralf_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Ralf</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/andi_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Andi</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/desiree_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Desiree</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/jorit_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Jorit</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/ralf_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Ralf</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/andi_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Andi</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
			<a @click="handleClick('chatwindow')">
				<div class="chat-message-view">
					<img src="../assets/desiree_profile.png" class="user-photo" alt="user-photo" width="40" height="40">
					<p class="chat-person-text">Desiree</p>
					<p class="chat-person-message">This is a sample message</p>
				</div>
			</a>
		</div>
	</div>
		
			<div class="chat-menu">
				<!-- <a @click="handleClick('chatwindow')"> -->
					<img src="../assets/chat-icon.png" alt="user-photo" width="40" height="40">
				<!-- </a> -->
				<a @click="handleClick('overview')">
					<img src="../assets/people_icon.png" alt="user-photo" width="40" height="40">
				</a>
				<!--popup for a new chat-->
				<a @click="togglePopup()">
					<img src="../assets/new-message_icon.png" alt="user-photo" width="40" height="40">
				</a>
			</div>

			<NewMessagePopup id="NewMessagePopup" v-if="popupTrigger === true" :togglePopup="() => togglePopup()" />


		</div>
</template>



<script lang="ts">
import ChatWindow from './ChatWindow.vue'
import Overview from './ChatOverview.vue'
import NewMessagePopup from './NewMessagePopup.vue'
import { defineComponent, ref, onMounted } from 'vue'

type SelectedChat = 'overview' | 'chatwindow' | 'newchat'

export default defineComponent({
	name: 'chat-module',
	components: { ChatWindow, Overview, NewMessagePopup },
	setup(){
		const userid = ref('userid');
		const chatid = ref('chatid');
		const messages = ref([]);
		const message = ref('');

		const popupTrigger = ref(false);
		const togglePopup = () => {
			console.log("togglePopup(NewMessagesPopup) got triggert")
			popupTrigger.value = !popupTrigger.value;
		}

		onMounted(() => {
			
		});

		const selected = ref<SelectedChat>('overview')
		const handleClick = (term: SelectedChat) => {
			selected.value = term;
			console.log("handleClick", selected.value);
		}

		return { userid, chatid, messages, message, selected, handleClick, togglePopup, popupTrigger }
	} //end of setup
}) //end of defineComponent
</script>


<style scoped>

.chat-overview {
		height: 340px;
		overflow-y: scroll;
		scrollbar-color: rebeccapurple green;
		scrollbar-width: thin;
	}

	.user-photo {
		float: left;
		padding-top: 15px;
	}
	
	.chat-message-view {
		background-color: rgb(0,0,0,0.4);
		border: black solid 1px;
		color: black;
		padding: 10px;
	}
	.chat-message-view:hover {
		background-color: rgb(0,0,0,0.3)
	}

	.chat-person-text {
		color:rgb(224, 19, 19);
		padding-left: 50px;
	}

	.chat-person-message {
		color: black solid;
		padding-left: 50px;
	}
	
	.chat-menu {
		background-color: var(--second-bg-color);
		color: white;
		text-align: center;
	}
	.chat-menu img {
		margin: 5px 20px;
		cursor: pointer;
	}
	.chat-menu img:hover {
		background-color: rgb(0,0,0,0.3)
	}
</style>
