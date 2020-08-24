<template>
  <div class="container mx-auto my-5">
		<!--<div v-for="item in produits.data" class="bg-white m-2 shadow w-1/5">
			<div>
				<span class="block">{{ item.label }}</span>
				<span class="block">{{ item.packaging }}</span>
				<span class="block">{{ item.per_unit_label }}</span>
			</div>
			<div>
				<img :src="item.produit_images[0].largest" alt="largest image">
			</div>
			<div>
				<img width="30" :src="`https://www.carrefour.fr/images/badges/flag-common-poulepleinair.svg`">
			</div>
			<div>
				<span class="block">{{ item.price.replace(".", ",") }}€</span>
			</div>
		</div>-->
		<ais-stats class="text-center"/>
		<ais-infinite-hits>
			<div slot-scope="{ items, refinePrevious, refineNext, isLastPage }">
				<!--<div class="text-center">
					<button @click="refinePrevious">
						Show previous results
					</button>
				</div>-->
				<div class="flex item-center justify-center flex-wrap">
					<div v-for="item in items" :key="item.objectID" class="bg-white m-2 shadow w-1/5">
						<div>
							<span class="block">{{ item.label }}</span>
							<span class="block">{{ item.packaging }}</span>
							<span class="block">{{ item.per_unit_label }}</span>
						</div>
						<div>
							<img :src="item.produit_images[0].largest" alt="largest image">
						</div>
						<div>
							<span class="block">{{ item.price }}€</span>
						</div>
					</div>
				</div>
				<div class="text-center" v-if="!isLastPage">
					<button @click="refineNext">
						Show more results
					</button>
				</div>
			</div>
		</ais-infinite-hits>
	</div>
</template>

<script>
	//import produits from "@/utils/apollo/query/produits"
	import { AisStats, AisInfiniteHits } from "vue-instantsearch"

	export default {
		components: {
			AisStats,
			AisInfiniteHits
		},
		/*apollo: {
			produits: {
				query: produits
			}
		},*/
		data() {
			return {
				//produits: {}
			}
		}
	}
</script>