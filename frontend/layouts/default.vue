<template>
  <div>
		<core-header />
    <nuxt />
  </div>
</template>

<script>
	import CoreHeader from '~/components/CoreHeader.vue'

	export default {
		components: {
			CoreHeader
		}
	}
</script>