<template>
	<button :disabled="state === 'loading'">
		<slot v-if="state === 'initial'" />
		<icon-loading v-if="state === 'loading'" />
	</button>
</template>

<script>
	import IconLoading from "@/components/icons/IconLoading"

	export default {
		name: "custom-buttom",
		components: {
			IconLoading
		},
		data() {
			return {
				state: "initial"
			}
		},
		methods: {
			setState(state) {
				this.state = state
			}
		}
	}
</script>

<style scoped>
	button {
		transition: background-color .2s ease-in-out, border-color .2s ease-in-out;
	}
	button[disabled] {
		cursor: not-allowed !important;
		background-color: #e2e8f0 !important;
		border: 3px solid #e2e8f0 !important;
	}
</style>