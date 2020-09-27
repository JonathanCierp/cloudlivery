<template>
	<div class="custom-form-input">
	<!--	<div v-if="type === 'password'" class="flex items-center justify-end">
			<span @click="togglePasswordVisibility('text')">
				<icon-eye v-if="typeEdited === 'password'" />
			</span>
			<span @click="togglePasswordVisibility('password')">
				<icon-eye-off v-if="typeEdited === 'text'" />
			</span>
		</div>-->
		<!--<div class="custom-form-input flex items-center relative justify-center my-4" :class="`${classes} ${type === 'password' ? 'mt-1' : ''}`">-->
		<div class="custom-form-input flex items-center relative justify-center my-4" :class="`${classes}`">
			<component v-if="iconLeft" class="pointer-events-none absolute inset-y-0 left-0 flex items-center" :is="iconLeftComponent" />
			<input :type="typeEdited" @input="oninput" @blur="onBlur" class="input--error transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-4 px-4 text-gray-700 leading-tight focus:shadow-outline" :placeholder="placeholder" autocomplete="off">
			<span class="custom-form-input-text--error absolute left-0 font-semibold">{{ errorMessage }}</span>
			<span v-if="state === 'valid'" class="pointer-events-none absolute inset-y-0 right-0 flex items-center"><icon-tick /></span>
			<span v-if="state === 'error'" class="pointer-events-none absolute inset-y-0 right-0 flex items-center"><icon-close /></span>
			<span v-if="state === 'loading'" class="pointer-events-none absolute inset-y-0 right-0 flex items-center"><icon-loading /></span>
		</div>
	</div>
</template>

<script>
	import IconClose from "@/components/icons/IconClose"
	import IconTick from "@/components/icons/IconTick"
	import IconLoading from "@/components/icons/IconLoading"
	import IconEye from "@/components/icons/IconEye"
	import IconEyeOff from "@/components/icons/IconEyeOff"

	export default {
		name: "custom-custom-form-input",
		props: {
			value: {
				type: String,
				default: ""
			},
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
			},
			rules: {
				type: [String, Array],
				default: null
			},
			lazy: {
				type: Boolean,
				default: false
			}
		},
		components:{
			IconClose,
			IconTick,
			IconLoading,
			IconEye,
			IconEyeOff
		},
		data() {
			return {
				iconLeftComponent: null,
				state: "initial",
				errorMessage: "",
				typeEdited: this.type
			}
		},
		created() {
			this.iconLeftComponent = this.iconLeft ? () => import(`@/components/icons/${this.$helper.toPascalCase(this.iconLeft)}`) : null
		},
		methods: {
			oninput(e) {
				this.validate(e.target.value)
				this.$emit("input", e.target.value)
			},
			onBlur() {
				if(this.lazy) {
					this.validate()
				}
			},
			validate(value) {
				if(this.rules) {
					const v = value || this.value

					if(typeof this.rules === "string") {
						const rule = this.rules.split("-")
						const result = this.$helper.rules[`${rule[0]}`](v, rule[1])
						this.errorMessage = result.message
						this.state = result.state
					}else {
						for(let rule of this.rules) {
							const rul = rule.split("-")
							const result = this.$helper.rules[`${rul[0]}`](v, rul[1])
							this.errorMessage = result.message
							this.state = result.state

							if(result.state === "error") {
								break;
							}
						}
					}

					return this.state !== "error"
				}

				return true
			},
			togglePasswordVisibility(type) {
				this.typeEdited = type
			}
		},
		computed: {
			classes: {
				get() {
					let classes = ""

					classes += this.iconLeft ? " custom-form-input-icon-left " : ""
					classes += this.state !== "initial" ? " custom-form-input-icon-right " : ""
					classes += this.state === "error" ? " custom-form-input--error " : ""
					classes += this.state === "valid" ? " custom-form-input--valid " : ""

					return classes
				}
			}
		}
	}
</script>

<style scoped>
	.custom-form-input.custom-form-input-icon-left input {
		padding-left: 3.5rem;
	}
	.custom-form-input.custom-form-input-icon-right input {
		padding-right: 3.5rem;
	}
	.custom-form-input.custom-form-input--error input {
		box-shadow: 0 0 0 3px #E74C3C;
	}
	.custom-form-input.custom-form-input--valid input {
		box-shadow: 0 0 0 3px #2ECC71;
	}
	.custom-form-input span.custom-form-input-text--error {
		opacity: 0;
		font-size: .7rem;
		color: #E74C3C;
		transform: translateY(25px);
		transition: transform .1s ease-in, opacity .1s ease-in;
	}
	.custom-form-input.custom-form-input--error span.custom-form-input-text--error {
		opacity: 1;
		transform: translateY(40px);
	}
	.custom-form-input svg#icon-close {
		color: #E74C3C;
	}
	.custom-form-input svg#icon-tick {
		color: #2ECC71;
	}
	.custom-form-input svg {
		color: #718096;
		margin: 14px 16px;
	}
	.custom-form-input svg#icon-eye, .custom-form-input svg#icon-eye-off {
		color: #10a3cc;
		margin: 0;
		width: 22px;
		cursor: pointer;
	}
</style>