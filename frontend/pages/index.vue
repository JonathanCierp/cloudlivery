<template>
  <div class="container mx-auto my-5 flex item-center justify-center flex-wrap">
		<div v-for="item in scraping.carrefour" class="bg-white m-2 shadow w-1/5">
			<div>
				<span class="block">{{ item.attributes.title }}</span>
				<span class="block">{{ item.attributes.packaging }}</span>
				<span class="block">{{ item.attributes.price.perUnitLabel }}</span>
			</div>
			<div>
				<img :src="`https://www.carrefour.fr${item.attributes.images[0].largest.replace('size', '')}`">
			</div>
			<div>
				<img width="30" :src="`https://www.carrefour.fr/images/badges/flag-common-poulepleinair.svg`">
			</div>
			<div>
				<span class="block">{{ item.attributes.price.price.replace(".", ",") }}€</span>
			</div>
		</div>
	</div>
</template>

<script>
	import GqlScrappingCarrefour from "@/utils/apollo/query/scrappingCarrefour"

	export default {
		apollo: {
			scraping: {
				query: GqlScrappingCarrefour
			}
		},
		data() {
			return {
				scraping: {}
			}
		}
	}
</script>