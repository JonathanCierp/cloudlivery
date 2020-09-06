<template>
	<!--<div class="produit-item w-4/5 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5">-->
	<div class="produit-item xl:w-1/6">
		<ui-card :id="item.ean" class="produit-item__card m-3 p-5">
			<div v-if="$store.state.tab !== 0" class="produit-item__card__badge mb-3">
				<ui-tag :type="itemTagColor">{{ item.provider.label }}</ui-tag>
			</div>
			<div class="produit-item__card__label mb-2">
				<p class="font-bold text-sm leading-tight test">{{ item.label }}<br></p>
			</div>
			<div class="produit-item__card__metadata mb-8 text-xs text-gray-600">
				<p class="mb-1" v-html="itemPackaging" />
				<p v-html="itemPerUnitLabel" />
			</div>
			<div class="produit-item__card__image mb-8">
				<img :src="item.produit_images[0].largest" class="mx-auto w-32 h-32">
			</div>
			<div class="produit-item__card__price mb-5">
				<p class="font-bold text-xl">{{ item.price }}€</p>
			</div>
			<div class="produit-item__card__action text-center">
				<ui-button style="background: linear-gradient(to right, #10A3CC, #B32EE8);" type="success" rounded-full w-full>Ajouter au panier</ui-button>
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
			}
		},
		computed: {
			itemTagColor: {
				get() {
					let color

					switch (this.item.provider.label) {
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
					return this.item.per_unit_label || "&nbsp;"
				}
			},
			itemPackaging: {
				get() {
					return this.item.packaging || "&nbsp;"
				}
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
</style>