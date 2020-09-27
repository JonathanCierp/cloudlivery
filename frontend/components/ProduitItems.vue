<template>
	<ui-tab-item>
		<ais-index v-if="$store.state.tab === item.indexTab" :index-name="item.indexName">
			<transition name="produit-item-fade">
				<ais-infinite-hits v-if="!loading">
					<div slot-scope="{ items, refinePrevious, refineNext, isLastPage }">
						<div class="produit-items flex flex-wrap justify-center sm:justify-start">
							<produit-item v-for="item in items" :key="item.objectID" :item="item" @editCart="editCart" />
						</div>

						<ui-button v-if="!isLastPage" class="mx-auto my-6" type="info" @click="nextPage(refineNext)" rounded-full size="lg" :loading="loadingNext">
							Voir plus de produits ...
						</ui-button>
					</div>
				</ais-infinite-hits>
			</transition>
		</ais-index>
	</ui-tab-item>
</template>

<script>
	import ProduitItem from "~/components/ProduitItem"
	import { AisIndex, AisInfiniteHits,
		AisSearchBox } from "vue-instantsearch"
	import IconSearch from "~/components/icons/IconSearch"

	export default {
		name: "ProduitItems",
		components: {
			ProduitItem,
			AisIndex,
			AisInfiniteHits,
			AisSearchBox,
			IconSearch
		},
		props: {
			item: {
				type: Object,
				default: {}
			},
			loading: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				loadingNext: false
			}
		},
		methods: {
			nextPage(refineNext) {
				this.loadingNext = true

				setTimeout(() => {
					refineNext()

					setTimeout(() => {
						this.loadingNext = false
					}, 300)
				}, 500)
			},
			editCart(item, count) {
				this.$emit("editCart", item, count)
			}
		}
	}
</script>

<style scoped>
	.produit-item-fade-enter-active {
		transition: opacity .5s;
	}

	.produit-item-fade-enter, .produit-item-fade-leave-to {
		opacity: 0;
	}
</style>