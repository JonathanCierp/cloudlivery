<template>
	<div class="px-8 py-8">
		<!--<ais-search-box>
			<div slot-scope="{ currentRefinement, isSearchStalled, refine }"
					 class="flex-1 mx-10 relative header__container__middle hidden md:inline-block">
				<icon-search class="pointer-events-none absolute inset-y-0 left-0 flex items-center"/>
				<input type="search" v-model="currentRefinement" @input="refine($event.currentTarget.value)"
							 class="transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-2 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline"
							 placeholder="Oeuf, poisson etc...">
			</div>
		</ais-search-box>
		<ais-stats/>-->
		<ais-infinite-hits>
			<div class="produit-items flex flex-wrap justify-center sm:justify-start" slot-scope="{ items, refinePrevious, refineNext, isLastPage }">
				<produit-item v-for="item in items" :key="item.objectID" :item="item" />
			</div>
		</ais-infinite-hits>
		<!--<ui-tab-items v-model="tab">
			<ui-tab-item>
				1
			</ui-tab-item>
			<ui-tab-item>
				2
			</ui-tab-item>
			<ui-tab-item>
				3
			</ui-tab-item>
		</ui-tab-items>-->
	</div>
</template>

<script>
	import CoreDesktop from "~/components/core/CoreDesktop"
	import ProduitItem from "~/components/ProduitItem"
	import { /*AisHighlight, AisSearchBox, AisStats,*/ AisInfiniteHits } from "vue-instantsearch"

	export default {
		components: {
			CoreDesktop,
			ProduitItem,
			/*AisSearchBox,
			AisStats,*/
			AisInfiniteHits
		},
		data() {
			return {}
		},
		computed: {
			tab: {
				get() {
					return this.$store.state.tab
				},
				set(v) {
					this.$store.commit("CHANGE_TAB", v)
				}
			},
			itemTagColor: {
				get() {
					return this.$store.state.tab
				}
			}
		}
	}
</script>