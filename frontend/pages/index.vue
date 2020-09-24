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
		<ui-tab-items v-model="tab" @change="changeTab">
			<produit-items v-for="item in items" :key="item.indexTab" :item="item" :loading="loading" @editCart="editCart" />
		</ui-tab-items>
		<ui-progress-circular class="absolute absolute-center" color="#745bdd" indeterminate size="40" v-if="loading"/>
		<!-- https://designmodo.com/shopping-cart-ui/ -->
		<ui-dialog class="cart-dialog" v-model="displayCartDialog" transition="slide-left" max-width="50%" no-margin max-height="100%" height="100%" placement="left">
			<ui-card>
				<ui-card-title>Mon panier</ui-card-title>
				<ui-card-text>
					azaeeezaeazzae
				</ui-card-text>
				<ui-card-action>
					<ui-spacer />
					<p @click="displayCartDialog = false">close</p>
				</ui-card-action>
			</ui-card>
		</ui-dialog>
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
					/*{
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
					}*/
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
			},
			displayCartDialog: {
				get() {
					return this.$store.state.displayCartDialog
				},
				set(v) {
					this.$store.commit("DISPLAY_CART_DIALOG", v)
				}
			}
		},
		methods: {
			changeTab() {
				this.loading = true

				setTimeout(() => {
					this.loading = false
				}, 300)
			},
			editCart(item, count) {
				item.count = count
				
				this.$store.commit("EDIT_CART", item)
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