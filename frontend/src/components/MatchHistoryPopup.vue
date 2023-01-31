<template>
	<div class="popup" @keyup.esc="untoggleUserHistory()" tabindex="0">
		<div class="popup-inner">
			<slot />
			<h2>{{ userid }}'s match history</h2>
			
			
			<!-- <div class="user-data-wrapper">
				<div>avatar:</div>
				<img id="user-photo" :src="user.picurl" alt="user-photo"	>
			</div>
		
			<div class="user-data-wrapper">
				<div>wins: {{ user.wins }}</div>
			</div>
			<div class="user-data-wrapper">
				<div>losses: {{ user.losses }}</div>
			</div>
			<div class="user-data-wrapper">
				<div>achievements:</div>
			</div> -->
			<button class="popup-close" @click="untoggleUserHistory()"> 
				Close
			</button>
		</div>
	</div>
</template>


<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue'
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'

export default defineComponent({
	name: "user-data-popup",
	
	// data () {
	// 	return {
	// 		user: {} as IUser,
	// 	}
	// },

	props: {
		['untoggleUserHistory'] : {
			required: true,
			type: Function,
		},
		userid : {
			required: true,
			type: String,
		}
	},
	setup(props) {
		const matchHistory = ref("");
		onMounted(async () => {
			DataService.getMatchHistory(props.userid)
			.then((response: ResponseData) => {
				matchHistory.value = response.data;
				console.log(matchHistory.value);
			})
			.catch((e: Error) => {
				console.log(e);
			});
		});
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
	z-index: 98; /*brings to second front-layer (behind login popup)*/
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-inner {
	background-color: var(--second-bg-color);
	padding: 10px 26px;
	/* border-radius: 10%; */
	border-radius: 2px;
	color: white;
}

.popup-inner h2 {
	text-align: center;
}

.user-data-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
}

#user-photo {
	cursor: pointer;
	width: 15%;
	height: 15%;
	margin: 3%;
	background: white;
	border-radius: 50%;
}

#select-photo {
	height: 70px;
	width: 70px;
	cursor: pointer;
	margin: 1rem;
	background: white;
	border-radius: 50%;
}


#select-photo:hover {
	opacity: 50%;
}


</style>

<!-- member since, avatar auswahl, wins, losses, user status, achievements-->

