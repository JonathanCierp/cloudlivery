<template>
	<client-only>
		<ui-desktop>
			<slot />
		</ui-desktop>
	</client-only>
</template>

<script>
	export default {
		name: "CoreDesktop"
	}
</script>

<style scoped>

</style>