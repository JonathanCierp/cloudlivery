<template>
	<form @submit="onSubmit">
		<slot />
	</form>
</template>

<script>
	export default {
		name: "custom-form",
		methods: {
			onSubmit(e) {
				this.$emit("submit", e)
			},
			validate() {
				let bool = true
				const inputs = this.$children.filter(comp => comp.$options.name.indexOf("custom-form") !== -1)

				for(let input of inputs) {
					if(!input.validate()) {
						bool = input.validate()
					}
				}

				return bool
			}
		}
	}
</script>

<style scoped>

</style>