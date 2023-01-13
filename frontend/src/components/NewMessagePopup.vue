<template>
    <div class="popup" @keyup.esc="togglePopup" tabindex="0">
        <div class="popup-inner">
            <h2>Create a new chat</h2>
            <label>
                Privat<input class="radio" type="checkbox">
            </label>
            <label>
                Group<input class="radio" type="checkbox">
            </label>
            <br>
            <input class="popup-textfield" type="text" placeholder="Name of the chat">
            <br>
            <br>
            <button class="popup-close" @click="togglePopup">Close</button>
        </div>
    </div>
</template>





<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	name: "NewMessagePopup",
    props: ['togglePopup']

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