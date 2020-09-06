<template>
	<ais-instant-search v-if="show" :search-client="searchClient" index-name="dev_cloudlivery">
		<core-header />
		<nuxt />
	</ais-instant-search>
</template>

<script>
	import CoreHeader from "~/components/core/CoreHeader.vue"
	import { AisInstantSearch } from "vue-instantsearch"

	import algoliasearch from "algoliasearch/lite"

	export default {
		components: {
			CoreHeader,
			AisInstantSearch
		},
		data() {
			return {
				show: false,
				searchClient: algoliasearch(
					"2O4QB4BTXT",
					"31085070cadb9685828446a0cd99d90b"
				)
			}
		},
		mounted() {
			this.show = true
		}
	}
</script>