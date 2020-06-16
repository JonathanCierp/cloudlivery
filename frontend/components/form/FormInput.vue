<template>
	<div class="form-input flex items-center relative justify-center my-4" :class="computedClass">
		<component v-if="iconLeft" class="pointer-events-none absolute inset-y-0 left-0 flex items-center" :is="iconLeftComponent" />
		<input :type="type" class="input--error transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-4 px-4 text-gray-700 leading-tight focus:shadow-outline" :placeholder="placeholder">

	</div>
</template>

<script>
	export default {
		props: {
			iconLeft: {
				type: String,
				default: null
			},
			type: {
				type: String,
				default: "text"
			},
			placeholder: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				iconLeftComponent: null
			}
		},
		created() {
			this.iconLeftComponent = this.iconLeft ? () => import(`@/components/icons/${this.$helper.toPascalCase(this.iconLeft)}`) : null
		},
		computed: {
			computedClass: {
				get() {
					let classes = ""

					classes += this.iconLeft ? "form-input-icon-left" : ""

					return classes
				}
			}
		}
	}
</script>

<style scoped>
	.form-input input.form-input-icon-left {
		padding-left: 3.5rem;
	}
	.form-input input.form-input-icon-right {
		padding-right: 3.5rem;
	}
	.form-input svg {
		color: #718096;
		margin: 14px 16px;
	}
</style>