<template>
  <div>
		<core-desktop>
			<div>Desktop</div>
			<div>Desktop</div>
			<div>Desktop</div>
			<div>Desktop</div>
		</core-desktop>
		<div>Test</div>
		<div>Test</div>
		<div>Test</div>
		<ui-mobile>
			<div>Mobile</div>
			<div>Mobile</div>
			<div>Mobile</div>
			<div>Mobile</div>
		</ui-mobile>
		<div>Test</div>
		<div>Test</div>
		<div>Test</div>
	</div>
</template>

<script>
	import CoreDesktop from "~/components/core/CoreDesktop"

	export default {
		components: {
			CoreDesktop
		}
	}
</script>