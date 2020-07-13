<template>
  <div class="container mx-auto my-5 flex item-center justify-center flex-wrap">
		<div v-for="item in produits.data" class="bg-white m-2 shadow w-1/5">
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
		</div>
	</div>
</template>

<script>
	import produits from "@/utils/apollo/query/produits"

	export default {
		apollo: {
			produits: {
				query: produits
			}
		},
		data() {
			return {
				produits: {}
			}
		}
	}
</script>