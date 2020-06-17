<template>
	<div class="custom-form-checkbox" :class="classes">
		<label class="text-sm hover:opacity-75">
			<input @input="oninput" class="mr-2 leading-tight" type="checkbox">
			<span class="align-middle select-none" :class="`${!label ? 'no-label' : ''}`">
				{{ label }}
			</span>
		</label>
		<span class="custom-form-checkbox-text--error absolute left-0 font-semibold">{{ errorMessage }}</span>
	</div>
</template>

<script>
	export default {
		name: "custom-form-checkbox",
		props: {
			value: {
				type: Boolean,
				default: false
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
			}
		},
		data() {
			return {
				state: "initial",
				errorMessage: ""
			}
		},
		methods: {
			oninput(e) {
				if(this.lazy) {
					this.validate(e.target.checked)
				}
				this.$emit("input", e.target.checked)
			},
			validate(value) {
				if(this.rules) {
					const v = value === undefined ? this.value : value

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
			}
		},
		computed: {
			classes: {
				get() {
					let classes = ""

					classes += this.iconLeft ? " custom-form-checkbox-icon-left " : ""
					classes += this.state !== "initial" ? " custom-form-checkbox-icon-right " : ""
					classes += this.state === "error" ? " custom-form-checkbox--error " : ""
					classes += this.state === "valid" ? " custom-form-checkbox--valid " : ""

					return classes
				}
			}
		}
	}
</script>

<style scoped>
	.custom-form-checkbox label input[type='checkbox'] {
		display: none;
	}
	.custom-form-checkbox label input[type="checkbox"]:checked + span::before {
		background: #10a3cc;
		border: none;
	}
	.custom-form-checkbox label input[type="checkbox"]:checked + span::after {
		transform: translate(0.25em, 0.3365384615em) rotate(-45deg);
		width: 15px;
		height: 8px;
		border: 3px solid #fff;
		border-top-style: none;
		border-right-style: none;
	}
	.custom-form-checkbox label span:not(.no-label) {
		cursor: pointer;
		padding-left: 30px;
	}
	.custom-form-checkbox label span::before {
		width: 22px;
		height: 22px;
		background: #fff;
		border: 2px solid rgba(0, 0, 0, 0.54);
		border-radius: 0.125em;
		cursor: pointer;
		transition: background .3s;
	}
	.custom-form-checkbox label span::before, .custom-form-checkbox label span::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		margin-top: -2px;
	}
	.custom-form-checkbox.custom-form-checkbox--error label span::before {
		border: 2px solid #E74C3C;
	}
	.custom-form-checkbox span.custom-form-checkbox-text--error {
		opacity: 0;
		font-size: .7rem;
		color: #E74C3C;
		transform: translateY(0px);
		transition: transform .1s ease-in, opacity .1s ease-in;
	}
	.custom-form-checkbox.custom-form-checkbox--error span.custom-form-checkbox-text--error {
		opacity: 1;
		transform: translateY(22px);
	}
</style>