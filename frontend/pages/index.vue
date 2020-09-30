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
				<ui-card-title class="text-center flex items-center justify-center">
					<div class="w-full">
						Mon panier
					</div>
					<ui-spacer />
					<div class="cursor-pointer" @click="displayCartDialog = false">
						<icon-close />
					</div>
				</ui-card-title>
				<ui-card-text>
					<div class="cart-dialog__separator my-4" />
					<cart-dialog-item v-if="desktop" v-for="item in $store.state.cartItems" :key="item.id" :item="item" @recalcTotal="recalcTotal" />
					<cart-dialog-item-mobile v-else v-for="item in $store.state.cartItems" :key="item.id" :item="item" @recalcTotal="recalcTotal" />
					<div v-if="$store.state.cartItems.length">
						<div class="flex">
							<div class="flex" style="width: 100%">
								<p class="text-lg font-bold" style="width: 50%">Total Auchan &nbsp;&nbsp; :</p>
								<p class="text-right text-lg font-bold" style="width: 50%">{{ totalAuchanData.toFixed(2) + " €" }}</p>
							</div>
						</div>
						<div class="flex">
							<div class="flex" style="width: 100%">
								<p class="text-lg font-bold" style="width: 50%">Total Carrefour :</p>
								<p class="text-right text-lg font-bold" style="width: 50%">{{ totalCarrefourData.toFixed(2) + " €" }}</p>
							</div>
						</div>
						<div v-if="moinsChere" class="flex items-center my-4">
							<ui-tag v-if="moinsChere === 'Carrefour'" class="w-full flex justify-center" type="info" size="lg">{{ moinsChere }}</ui-tag>
							<ui-tag v-if="moinsChere === 'Auchan'" class="w-full flex justify-center" type="error" size="lg">{{ moinsChere }}</ui-tag>
						</div>
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
	import IconClose from "~/components/icons/IconClose"
	import CartDialogItem from "~/components/CartDialogItem"
	import CartDialogItemMobile from "~/components/CartDialogItemMobile"
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
			ResizeObserver,
			CartDialogItem,
			CartDialogItemMobile,
			IconClose
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
				maxWidthDialogCart: 0,
				totalAuchanData: 0,
				totalCarrefourData: 0,
				moinsChere: null,
				desktop: null
			}
		},
		mounted() {
			this.loading = false
			this.guessMaxWidthDialogCart(window.innerWidth)
			this.recalcTotal()
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
					this.recalcTotal()
					this.$store.commit("DISPLAY_CART_DIALOG", v)
				}
			}
		},
		methods: {
			guessMaxWidthDialogCart(width) {
				if(width >= 700) {
					this.desktop = true
				}else {
					this.desktop = false
				}
				if(width >= 1400) {
					this.maxWidthDialogCart = "60%"
				}else if(width >= 1100) {
					this.maxWidthDialogCart = "70%"
				}else if(width >= 800) {
					this.maxWidthDialogCart = "80%"
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
			},
			recalcTotal() {
				this.totalAuchan()
				this.totalCarrefour()
				if(this.totalAuchanData > this.totalCarrefourData) {
					this.moinsChere = "Carrefour"
				}else {
					this.moinsChere = "Auchan"
				}
			},
			totalAuchan() {
				this.totalAuchanData = 0
				this.$store.state.cartItems.filter(item => this.totalAuchanData += (item.price_auchan.split("€")[0].replace(",", ".") * item.count))

				return this.totalAuchanData
			},
			totalCarrefour() {
				this.totalCarrefourData = 0
				this.$store.state.cartItems.filter(item => this.totalCarrefourData += (item.price_carrefour.split("€")[0].replace(",", ".") * item.count))

				return this.totalCarrefourData
			}
		}
	}
</script>

<style>
	.absolute-center {
		left: 50%;
		top: 50%;
	}

	.cart-dialog .cart-dialog__separator {
		width: 100%;
		background-color: #ddd;
		height: 2px;
	}

	.cart-dialog .cart-dialog__vertical__separator {
		width: 2px;
		background-color: #ddd;
	}

	@media only screen and (min-width: 700px) {
		.cart-dialog .cart-dialog__item__image {
			width: 13%;
		}

		.cart-dialog .cart-dialog__item__middle {
			width: 37%;
		}

		.cart-dialog .cart-dialog__item__auchan {
			width: 17%;
		}

		.cart-dialog .cart-dialog__item__carrefour {
			width: 17%;
		}
	}

	.cart-dialog .cart-dialog__item__image {
		width: 20%;
	}

	.cart-dialog .cart-dialog__item__middle {
		width: 70%;
	}

	.cart-dialog .cart-dialog__item__middle p:first-child {
		font-size: 1.1rem;
	}
</style>