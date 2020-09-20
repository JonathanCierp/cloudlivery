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

		<!--<ui-desktop :breakpoint="900">
			zaezaeeza
		</ui-desktop>
		<ui-mobile :breakpoint="899.5">
			15158
		</ui-mobile>-->

		<ui-tab-items v-model="tab" @change="changeTab">
			<produit-items v-for="item in items" :key="item.indexTab" :item="item" :loading="loading"/>
		</ui-tab-items>
		<ui-progress-circular class="absolute absolute-center" color="#745bdd" indeterminate size="40" v-if="loading"/>
	</div>
</template>

<script>
	import CoreDesktop from "~/components/core/CoreDesktop"
	import ProduitItems from "~/components/ProduitItems"
	import {
		AisInfiniteHits,
		AisRefinementList,
		AisIndex
	} from "vue-instantsearch"

	export default {
		components: {
			CoreDesktop,
			ProduitItems,
			AisInfiniteHits,
			AisRefinementList,
			AisIndex
		},
		data() {
			return {
				loading: true,
				items: [
					{
						indexTab: 0,
						indexName: "COMPARATEUR"
					},
					{
						indexTab: 1,
						indexName: "ALL"
					},
					{
						indexTab: 2,
						indexName: "CARREFOUR"
					},
					{
						indexTab: 3,
						indexName: "AUCHAN"
					}
				]
			}
		},
		mounted() {
			this.loading = false
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
		},
		methods: {
			changeTab() {
				this.loading = true

				setTimeout(() => {
					this.loading = false
				}, 300)
			}
		}
	}
</script>

<style scoped>
	.absolute-center {
		left: 50%;
		top: 50%;
	}
</style>