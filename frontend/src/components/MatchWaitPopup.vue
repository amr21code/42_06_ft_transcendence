<template>
	<div class="popup" tabindex="0">
		<div class="popup-inner">
			<slot/>
			<h2>waiting for second player...</h2>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import LoginService from '../services/LoginService'
import DataService from '../services/DataService'
import type { ResponseData } from '../types/ResponseData'
import type { IUser } from '../types/User'

export default defineComponent({
	name: "match-wait-popup",

	// props: ['toggleMatchWaitPopup']
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
	padding: 10px 26px;
	/* border-radius: 10%; */
	border-radius: 2px;
	width: 50%;
	height: 50%;
}

.popup-inner h2 {
	text-align: center;
}

.user-data-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
}

button {
	/* background-color: #48c774; */
	border-radius: 10%;
	margin: 0 auto;
	display: block;
}
</style>
