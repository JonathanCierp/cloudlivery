<template>
	<button :disabled="state === 'loading'" class="rounded w-full hover:opacity-75" @click="onClick">
		<icon-google-color v-if="state === 'initial'" class="inline-block mr-3" />
		<span v-if="state === 'initial'" class="align-middle font-bold">{{ label }}</span>
		<icon-loading v-if="state === 'loading'" />
	</button>
</template>

<script>
	import IconGoogleColor from "@/components/icons/IconGoogleColor"
	import IconLoading from "@/components/icons/IconLoading"

	export default {
		name: "custom-buttom-google",
		components: {
			IconLoading,
			IconGoogleColor
		},
		props: {
			label: {
				type: String,
				default: "Se connecter avec google"
			}
		},
		data() {
			return {
				state: "initial"
			}
		},
		methods: {
			setState(state) {
				this.state = state
			},
			onClick(e) {
				this.$emit("click", e)
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
		background-image: none !important;
		border: 3px solid #e2e8f0 !important;
	}
</style>