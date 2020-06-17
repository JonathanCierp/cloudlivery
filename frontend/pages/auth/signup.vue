<template>
	<div class="signup shadow flex items-center justify-center h-full">
		<div class="signup__card bg-white py-10 px-10 shadow h-full sm:py-8 sm:h-auto sm:min-h-auto">

		</div>
	</div>
</template>

<script>
	export default {
		layout: "blank",
		name: "auth-signup",
		middleware: ["isAuthenticated"]
	}
</script>

<style scoped>
	.signup .signup__card {
		width: 100%;
		height: 100%;
	}

	@media only screen and (min-width: 640px) {
		.signup .signup__card {
			width: 100%;
			height: auto;
			max-width: 600px;
		}
	}
</style>