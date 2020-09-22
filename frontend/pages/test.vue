<template>
	<div>
		<ui-button @click="test = !test">
			zazaza
		</ui-button>
		<ui-dialog v-model="test" max-width="290">
			<ui-card>
				<ui-card-title>Ajout d'un produit</ui-card-title>
				<ui-card-text>
					azaeeezaeazzae
				</ui-card-text>
				<ui-card-action>
					<ui-spacer />
					<p>dzadza</p>
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

<style scoped>

</style>