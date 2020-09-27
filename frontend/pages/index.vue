<template>
	<div class="">
		<ui-tab-items v-model="tab" @change="changeTab">
			<produit-items v-for="item in items" :key="item.indexTab" :item="item" :loading="loading" @editCart="editCart"/>
		</ui-tab-items>
		<ui-progress-circular class="absolute absolute-center" color="#745bdd" indeterminate size="40" v-if="loading"/>
		<!-- https://designmodo.com/shopping-cart-ui/ -->
		<ui-dialog class="cart-dialog" v-model="displayCartDialog" transition="slide-left" max-width="40%" no-margin
							 max-height="100%" height="100%" placement="left">
			<ui-card>
				<ui-card-title class="text-center">Mon panier</ui-card-title>
				<ui-card-text>
					azaeeezaeazzae
				</ui-card-text>
				<ui-card-action>
					<ui-spacer/>
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
		AisIndex,
		AisSearchBox,
		AisStats
	} from "vue-instantsearch"

	export default {
		components: {
			CoreDesktop,
			ProduitItems,
			AisInfiniteHits,
			AisRefinementList,
			AisIndex,
			AisSearchBox,
			AisStats
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