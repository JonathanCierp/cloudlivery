<template>
	<ais-instant-search :search-client="searchClient" index-name="dev_cloudlivery">
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
				searchClient: algoliasearch(
					"2O4QB4BTXT",
					"31085070cadb9685828446a0cd99d90b"
				)
			}
		}
	}
</script>