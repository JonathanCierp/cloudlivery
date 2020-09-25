<template>
	<ui-tab-item>
		<ais-index v-if="$store.state.tab === item.indexTab" :index-name="item.indexName">
			<div>
				<ais-search-box>
					<div slot-scope="{ currentRefinement, isSearchStalled, refine }"
							 class="flex-1 mx-10 relative header__container__middle hidden md:inline-block">
						<icon-search class="pointer-events-none absolute inset-y-0 left-0 flex items-center"/>
						<input type="search" v-model="currentRefinement" @input="refine($event.currentTarget.value)"
									 class="transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-2 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline"
									 placeholder="Oeuf, poisson etc...">
					</div>
				</ais-search-box>
			</div>
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

	export default {
		name: "ProduitItems",
		components: {
			ProduitItem,
			AisIndex,
			AisInfiniteHits,
			AisSearchBox
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