<template>
	<div class="">
		<ui-tab-items v-model="tab" @change="changeTab">
			<produit-items v-for="item in items" :key="item.indexTab" :item="item" :loading="loading" @editCart="editCart"/>
		</ui-tab-items>
		<ui-progress-circular class="absolute absolute-center" color="#745bdd" indeterminate size="40" v-if="loading"/>
		<!-- https://designmodo.com/shopping-cart-ui/ -->
		<ui-dialog class="cart-dialog" v-model="displayCartDialog" transition="slide-left" :max-width="maxWidthDialogCart" no-margin
							 max-height="100%" height="100%" placement="left">
			<ui-card style="overflow-y: scroll">
				<ui-card-title class="text-center">Mon panier</ui-card-title>
				<ui-card-text>
					<div class="cart-dialog__separator my-4" />
					<div class="cart-dialog__item" v-for="item in $store.state.cartItems">
						<div class="flex">
							<div class="cart-dialog__item__image">
								<img :src="item.productImages[0].largest">
							</div>
							<div class="ml-4 cart-dialog__item__middle">
								<p class="font-bold">{{ item.label }}</p>
								<p class="my-1">Prix auchan &nbsp;&nbsp;&nbsp;: <span class="font-bold">{{ item.price_auchan }}</span></p>
								<p>Prix carrefour : <span class="font-bold">{{ item.price_carrefour }}</span></p>
							</div>
							<div></div>
							<div></div>
							<div></div>
						</div>
						<div class="cart-dialog__separator my-4" />
					</div>
				</ui-card-text>
				<ui-card-action>
					<ui-button w-full type="default" @click="displayCartDialog = false">Fermer</ui-button>
				</ui-card-action>
			</ui-card>
		</ui-dialog>
		<resize-observer @notify="handleResize" />
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
	import { ResizeObserver } from "vue-resize"
	import "vue-resize/dist/vue-resize.css"

	export default {
		components: {
			CoreDesktop,
			ProduitItems,
			AisInfiniteHits,
			AisRefinementList,
			AisIndex,
			AisSearchBox,
			AisStats,
			ResizeObserver
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
				],
				maxWidthDialogCart: 0
			}
		},
		mounted() {
			this.loading = false
			this.guessMaxWidthDialogCart(window.innerWidth)
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
			guessMaxWidthDialogCart(width) {
				if(width >= 1400) {
					this.maxWidthDialogCart = "45%"
				}else if(width >= 1100) {
					this.maxWidthDialogCart = "55%"
				}else if(width >= 800) {
					this.maxWidthDialogCart = "65%"
				}else {
					this.maxWidthDialogCart = "100%"
				}
			},
			handleResize({width, height}) {
				this.guessMaxWidthDialogCart(width)
			},
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

	.cart-dialog .cart-dialog__separator {
		width: 100%;
		background-color: #ddd;
		height: 2px;
	}

	.cart-dialog .cart-dialog__item__image {
		width: 100px;
	}

	.cart-dialog .cart-dialog__item__middle p:first-child {
		font-size: 1.1rem;
	}
</style>