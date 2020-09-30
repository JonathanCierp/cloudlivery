<template>
	<div class="produit-item w-4/5 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5">
		<ui-card :id="produit.ean" class="produit-item__card m-3 p-5">
			<div v-if="$store.state.tab !== 0" class="produit-item__card__badge mb-3">
				<ui-tag :type="itemTagColor">{{ produit.provider.label }}</ui-tag>
			</div>
			<div class="produit-item__card__label mb-2">
				<p class="font-bold text-sm leading-tight test">{{ produit.label }}<br></p>
			</div>
			<div class="produit-item__card__metadata mb-8 text-xs text-gray-600">
				<p class="mb-1" v-html="itemPackaging" />
				<p v-html="itemPerUnitLabel" />
			</div>
			<div class="produit-item__card__image mb-8">
				<img :src="produit.productImages[0].largest" class="mx-auto w-32 h-32">
			</div>
			<div class="produit-item__card__price mb-5">
				<p class="font-bold text-xl">{{ produit.price }} *</p>
				<p class="text-xs text-right">* Prix moyen</p>
			</div>
			<div class="produit-item__card__action" :class="`${isAddToCard || isCartExist ? 'text-right' : 'text-center'}`">
				<ui-form-numeric v-if="isAddToCard || isCartExist" v-model="productToCartNumber" type="info" max-width="60" min="0" max="100" @input="editCart" />
				<ui-button v-else style="background: linear-gradient(to right, #10A3CC, #B32EE8);" type="success" rounded-full w-full @click="onAddCart">Ajouter au panier</ui-button>
			</div>
		</ui-card>
	</div>
</template>

<script>
	export default {
		name: "ProduitItem",
		props: {
			item: {
				type: Object,
				default: {}
			},
			change: {
				type: Boolean
			}
		},
		watch: {
			change: function (v) {
				this.change = v
				const cartItem = this.$store.state.cartItems?.find(cartItem => cartItem.id === this.produit.id)
				this.productToCartNumber = cartItem ? cartItem.count : 0
				this.isAddToCard = cartItem && cartItem.count >= 0
			}
		},
		data() {
			return {
				isAddToCard: false,
				productToCartNumber: 0,
				produit: {...this.item}
			}
		},
		beforeMount() {
			const cartItem = this.$store.state.cartItems?.find(cartItem => cartItem.id === this.produit.id)
			this.productToCartNumber = cartItem ? cartItem.count : 0
			this.isAddToCard = cartItem && cartItem.count >= 0
		},
		computed: {
			itemTagColor: {
				get() {
					let color

					switch (this.produit.provider.label) {
						case "AUCHAN":
							color = "error"
							break
						case "CARREFOUR":
							color = "info"
							break
						default:
							color = "default"
							break
					}

					return color
				}
			},
			itemPerUnitLabel: {
				get() {
					return this.produit.perUnitLabel || "&nbsp;"
				}
			},
			itemPackaging: {
				get() {
					return this.produit.packaging || "&nbsp;"
				}
			},
			isCartExist() {
				return this.$store.state.cartItems?.find(cartItem => cartItem.id === this.produit.id)
			}
		},
		methods: {
			onAddCart() {
				this.isAddToCard = true
				this.productToCartNumber = 1
				this.$emit("editCart", this.item, 1)
			},
			editCart(count) {
				if(count === 0) {
					this.isAddToCard = false
				}
				this.$emit("editCart", this.item, count)
			}
		}
	}
</script>

<style scoped>
	.produit-item .produit-item__card .produit-item__card__label {
		height: 35px;
	}
	.test {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media only screen and (max-width: 500px) {
		.produit-item {
			width: 100%;
		}
	}
</style>