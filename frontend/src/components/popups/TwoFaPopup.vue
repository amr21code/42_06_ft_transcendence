<template>
	<div class="popup" tabindex="0">
		<div class="popup-inner">
			<slot/>
			<h2>Using Google 2FA</h2>
			<input type="text" @keyup.enter="submitTwoFaSecret()" v-model="enteredSecret" placeholder="Enter your verification code">
			<button id="submit-button" @click="submitTwoFaSecret()">Submit</button>
		</div>
	</div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import DataService from '../../services/DataService';
import { useUserDataStore } from '../../stores/myUserDataStore';

export default defineComponent({

	props: ['untoggleTwoFaPopup'],

	setup(props) {
		const enteredSecret = ref('');

		const submitTwoFaSecret = async () => {
			if (await DataService.submitTwoFaAlreadyRegistered(enteredSecret.value)) {
				props.untoggleTwoFaPopup();
			}
			else
				alert('Verification code was wrong, please try again');
		}

		return { enteredSecret, submitTwoFaSecret }
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
	/* width: 50%;
	height: 50%; */

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.popup-inner h2 {
	text-align: center;
}

.user-data-wrapper {
	margin-bottom: 10px;
	margin-left: 0%;
}

#submit-button {
	margin-top: 0.5rem;
}

button {
	margin: 0 auto;
	display: block;
}
</style>
