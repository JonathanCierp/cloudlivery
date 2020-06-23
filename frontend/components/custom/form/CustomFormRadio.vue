<template>
	<div class="custom-form-radio relative" :class="classes">
		<label class="text-sm hover:opacity-75">
			<input class="mr-2 leading-tight inline-block" type="radio" :name="name" :value="value" @change="onChange" :checked="state">
			<span class="align-middle select-none" :class="`${!label ? 'no-label' : ''}`">
				{{ label }}
			</span>
		</label>
		<span class="custom-form-radio-text--error absolute left-0 font-semibold">{{ errorMessage }}</span>
	</div>
</template>

<script>
	export default {
		name: "custom-form-radio",
		model: {
			prop: 'modelValue',
			event: 'input'
		},
		props: {
			label: {
				type: String
			},
			value: {
				type: String
			},
			rules: {
				type: [String, Array],
				default: null
			},
			lazy: {
				type: Boolean,
				default: false
			},
			label: {
				type: String,
				default: null
			},
			name: {
				type: String,
				default: null
			},
			modelValue: {
				default: undefined,
			},
			checked: {
				type: Boolean,
				default: false,
			},
			model: {}
		},
		watch: {
			checked(v) {
				if (v !== this.state) {
					this.toggle()
				}
			}
		},
		data() {
			return {
				valueRadio: this.value,
				stateData: "initial",
				errorMessage: ""
			}
		},
		methods: {
			onChange() {
				this.toggle()
			},
			toggle() {
				if(this.lazy) {
					this.validate(this.modelValue)
				}

				this.$emit('input', this.state ? '' : this.value)
			},
			validate(value) {
				if(this.rules) {
					const v = value === undefined ? this.modelValue : value

					if(typeof this.rules === "string") {
						const rule = this.rules.split("-")
						const result = this.$helper.rules[`${rule[0]}`](v, rule[1])
						this.errorMessage = result.message
						this.stateData = result.state
					}else {
						for(let rule of this.rules) {
							const rul = rule.split("-")
							const result = this.$helper.rules[`${rul[0]}`](v, rul[1])
							this.errorMessage = result.message
							this.stateData = result.state

							if(result.stateData === "error") {
								break;
							}
						}
					}

					return this.stateData !== "error"
				}

				return true
			},
		},
		computed: {
			classes: {
				get() {
					let classes = ""

					classes += this.iconLeft ? " custom-form-radio-icon-left " : ""
					classes += this.stateData !== "initial" ? " custom-form-radio-icon-right " : ""
					classes += this.stateData === "error" ? " custom-form-radio--error " : ""
					classes += this.stateData === "valid" ? " custom-form-radio--valid " : ""

					return classes
				}
			},
			state: {
				get() {
					if (this.modelValue === undefined) {
						return this.checked;
					}

					return this.modelValue === this.value;
				}
			}
		},
		mounted() {
			if (this.checked && !this.state) {
				this.toggle();
			}
		}
	}
</script>

<style scoped>
	.custom-form-radio label input[type='radio'] {
		display: none;
	}
	.custom-form-radio label input[type="radio"]:checked + span::before {
		background: #fff;
		border: 6px solid #10a3cc;
	}
	.custom-form-radio label span:not(.no-label) {
		cursor: pointer;
		padding-left: 30px;
	}
	.custom-form-radio label span::before {
		width: 22px;
		height: 22px;
		background: #fff;
		border: 2px solid rgba(0, 0, 0, 0.54);
		border-radius: 50%;
		cursor: pointer;
		transition: background .3s;
	}
	.custom-form-radio label span::before, .custom-form-radio label span::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		margin-top: -2px;
	}
	.custom-form-radio.custom-form-radio--error label span::before {
		border: 2px solid #E74C3C;
	}
	.custom-form-radio span.custom-form-radio-text--error {
		opacity: 0;
		font-size: .7rem;
		color: #E74C3C;
		transform: translateY(0px);
		transition: transform .1s ease-in, opacity .1s ease-in;
	}
	.custom-form-radio.custom-form-radio--error span.custom-form-radio-text--error {
		opacity: 1;
		transform: translateY(22px);
	}
</style>