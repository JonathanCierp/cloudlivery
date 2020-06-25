<template>
	<div class="custom-form-group">
		<slot />
	</div>
</template>

<script>
	export default {
		name: "custom-form-group"
	}
</script>

<style scoped>
	.custom-form-group {
		width: 100%;
	}
</style>