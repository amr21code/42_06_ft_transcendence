<template>
	<div class="popup" @keyup.esc="untoggleTwoFaPopup" tabindex="0">
		<div class="popup-inner">
			<slot/>
			<h2>Using Google 2FA</h2>
			<div id="two-fa-wrapper">
				<div id="qr-code">
					<img :src="TwoFaQrCode" alt="qrCode" />
				</div>
				<div id="verification-input">
					<input type="text" @keyup.enter="submitTwoFaSecret()" v-model="enteredSecret" placeholder="Enter your verification code">
					<button id="submit-button" @click="submitTwoFaSecret()">Submit</button>
				</div>
			</div>
			<button id="quit-button" class="untoggleTwoFaPopupButton" @click="untoggleTwoFaPopup">Quit</button>
		</div>
	</div>
</template>



<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import DataService from '../../services/DataService';
import { useUserDataStore } from '../../stores/myUserDataStore';

export default defineComponent({

	props: ['untoggleTwoFaPopup', 'updateTwoFaButton'],

	setup(props) {
		const store = useUserDataStore();
		const TwoFaQrCode = ref('');
		const enteredSecret = ref('');
		
		onMounted(async () => {
			TwoFaQrCode.value = await DataService.getTwoFaQrCode();
		});

		const submitTwoFaSecret = async () => {
			if (await DataService.submitTwoFaSecret(enteredSecret.value)) {
				props.updateTwoFaButton();
				props.untoggleTwoFaPopup();
			}
			else
				alert('Verification code was wrong, please try again');
		}

		return { TwoFaQrCode, enteredSecret, submitTwoFaSecret }
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

.popup-inner button {
	margin: 0 auto;
	display: block;
}

#qr-code {
	text-align: center;
}

#verification-input {
	text-align: center;
}

#submit-button {
	margin-top: 0.5rem;
}

#quit-button {
	margin-top: 2rem;
}

</style>
