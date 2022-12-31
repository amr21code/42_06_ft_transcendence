<template>
		<div class="popup" @keyup.esc="togglePopup" tabindex="0">
			<div class="popup-inner">
				<slot />
				<button class="popup-close" @click="togglePopup"> 
					Close
				</button>
			</div>
		</div>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
	props: ['togglePopup'],
	components: {}
})
</script>


<style scoped>
.popup {
	text-align: center;
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
	padding: 32px;
	border-radius: 10%;
}

button {
	border-radius: 10%;
}
</style>