<template>
	<ui-mobile class="core-navigation flex-1 font-bold text-sm" :breakpoint="900">
		<ui-tabs v-model="tab" slider-position="top">
			<ui-tab full-width center>Comparateur</ui-tab>
			<ui-tab full-width center>Tous les produits</ui-tab>
			<ui-tab full-width center>Carrefour</ui-tab>
			<ui-tab full-width center>Auchan</ui-tab>
		</ui-tabs>
	</ui-mobile>
</template>

<script>
	export default {
		name: "CoreNavigation",
		computed: {
			tab: {
				get() {
					return this.$store.state.tab
				},
				set(v) {
					this.$store.commit("CHANGE_TAB", v)
				}
			}
		}
	}
</script>

<style scoped>
	.core-navigation {
		height: 60px;
		position: fixed;
		bottom: 0;
		background: white;
		width: 100%;
		font-size: .8rem;
	}
</style>