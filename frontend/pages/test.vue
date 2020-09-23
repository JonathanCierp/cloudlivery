<template>
	<div>
		<ui-button @click="test = !test">
			zazaza
		</ui-button>
		<ui-dialog class="cart-dialog" v-model="test" transition="slide-left" max-width="50%" no-margin max-height="100%" height="100%" placement="left">
			<ui-card>
				<ui-card-title>Ajout d'un produit</ui-card-title>
				<ui-card-text>
					azaeeezaeazzae
				</ui-card-text>
				<ui-card-action>
					<ui-spacer />
					<p @click="test = false">close</p>
				</ui-card-action>
			</ui-card>
		</ui-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				test: false
			}
		}
	}
</script>