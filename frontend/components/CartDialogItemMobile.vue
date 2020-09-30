<template>
	<div class="cart-dialog__item">
		<div class="flex flex-wrap">
			<div class="cart-dialog__item__image">
				<img :src="produit.productImages[0].largest">
			</div>
			<div class="ml-4 cart-dialog__item__middle">
				<p class="font-bold">{{ produit.label }}</p>
				<p class="mt-1 text-sm">Prix auchan &nbsp;&nbsp;&nbsp;: <span class="font-bold">{{ produit.price_auchan }}</span></p>
				<p class="text-sm">Prix carrefour : <span class="font-bold">{{ produit.price_carrefour }}</span></p>
			</div>
		</div>
		<div class="flex items-center cart-dialog__item__numeric justify-end mb-2">
			<ui-form-numeric v-model="produit.count" type="info" max-width="60" min="0" max="100" @input="editCart" />
		</div>
		<div class="cart-dialog__item__auchan flex flex-col">
			<p class="text-sm text-right font-bold">Total Auchan : {{ calcPrice(produit.price_auchan) }}</p>
		</div>
		<div class="cart-dialog__item__carrefour flex flex-col">
			<p class="text-sm text-right font-bold">Total Carrefour : {{ calcPrice(produit.price_carrefour) }}</p>
		</div>
		<div class="cart-dialog__separator my-4" />
	</div>
</template>

<script>
	export default {
		name: "CartDialogItemMobile",
		props: {
			item: Object
		},
		data() {
			return {
				produit: {...this.item}
			}
		},
		methods: {
			editCart(count) {
				this.produit.count = count

				this.$store.commit("EDIT_CART", this.produit)
				this.$emit("recalcTotal")
			},
			calcPrice(price) {
				let prix = price.split("€")[0].replace(",", ".")

				return (prix * this.produit.count).toFixed(2) + " €"
			}
		}
	}
</script>

<style scoped>
	
</style>