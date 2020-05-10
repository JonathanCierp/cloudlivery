<template>
  <div>
		<core-header />
    <nuxt />
  </div>
</template>

<script>
	import CoreHeader from "~/components/core/CoreHeader.vue"

	export default {
		components: {
			CoreHeader
		}
	}
</script>