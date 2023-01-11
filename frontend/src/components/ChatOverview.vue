<template>
    <h2>This is a test</h2>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'


export default defineComponent({
	name: 'chatOverview',
	components: {},
	props: {
		selected: {
			required: true,
			type: String
		}
	}
})
</script>