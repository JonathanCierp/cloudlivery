<template>
	<div class="reset shadow flex items-center justify-center h-full">
		<div class="reset__card bg-white py-10 px-10 shadow h-full sm:py-8 sm:h-auto sm:min-h-auto">
			<nuxt-link class="inline-block mb-8" to="/">
				<img class="inline px-1 w-10" src="@/assets/img/icons/logo.svg" alt="Logo du site">
				<span class="font-bold align-middle">Cloudlivery</span>
			</nuxt-link>
			<div class="reset__card__header flex items-center justify-center mb-6">
				<span class="font-bold align-middle">{{ title }}</span>
			</div>
			<custom-form v-if="!send" ref="form" @submit.prevent="onReset" class="reset__card__body flex flex-col items-center justify-center mt-5">
				<custom-form-input class="mt-3 mb-10" v-model="form.email" icon-left="icon-arobase" placeholder="Email" :rules="['required', 'email']" lazy autocomplete="off" />
				<div class="reset__card__actions flex w-full justify-center my-3">
					<custom-button ref="resetButton" type="submit" class="reset__card__actions__reset rounded-full w-full hover:opacity-75 flex items-center justify-center">
						<span class="font-bold">Valider</span>
					</custom-button>
				</div>
			</custom-form>
			<div class="reset__card__body mt-10" v-else>
				<p class="reset__card__body__text">
					Si votre email est connue, afin de réinitialiser votre mot de passe, un e-mail va vous être envoyé. Cela peut prendre quelques minutes.
				</p>
				<p class="reset__card__body__text font-bold mt-8 mb-3">
					<nuxt-link to="/auth/signin">
						<icon-caret-right class="inline-block" /> <span>Se connecter</span>
					</nuxt-link>
				</p>
				<p class="reset__card__body__text font-bold">
					<nuxt-link to="/auth/signin">
						<icon-caret-right class="inline-block" /> <span>Autre action ?</span>
					</nuxt-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import IconCaretRight from "@/components/icons/IconCaretRight"
	import CustomForm from "@/components/custom/form/CustomForm"
	import CustomFormInput from "@/components/custom/form/CustomFormInput"
	import CustomButton from "@/components/custom/button/CustomButton"

	import GqlResetPassword from "@/utils/apollo/mutation/resetPassword"

	export default {
		layout: "blank",
		name: "auth-password-reset-index",
		middleware: ["isAuthenticated"],
		components: {
			IconCaretRight,
			CustomForm,
			CustomFormInput,
			CustomButton
		},
		data() {
			return {
				form: {
					email: null
				},
				send: false
			}
		},
		methods: {
			async onReset() {
				if(this.$refs.form.validate()) {
					this.$refs.resetButton.setState("loading")
					try {
						const res = await this.$apollo.mutate({
							mutation: GqlResetPassword,
							variables: {
								email: this.form.email
							}
						})

						this.$refs.resetButton.setState("initial")
						this.send = true
					}catch (e) {
						console.log(e.graphQLErrors[0].message)
						this.$refs.resetButton.setState("initial")
					}
				}
			}
		},
		computed: {
			title: {
				get() {
					return this.send ? "Envoyé !" : "Mot de passe oublié ?"
				}
			}
		}
	}
</script>

<style scoped>
	.reset .reset__card {
		width: 100%;
		height: 100%;
	}
	.reset .reset__card .reset__card__header span{
		font-size: 2rem;
	}
	.reset .reset__card .reset__card__body div {
		width: 100%;
		max-width: 450px;
	}
	.reset .reset__card .reset__card__body .reset__card__body__text a {
		color: #10a3cc;
	}
	.reset .reset__card .reset__card__body .reset__card__body__text a #icon-caret-right{
		color: #E74C3C;
		margin-right: 10px;
		width: 18px;
	}
	.reset .reset__card .reset__card__body button.reset__card__actions__reset {
		height: 50px;
		color: white;
		background-color: #10a3cc;
		border: 3px solid #10a3cc;
	}
	.reset .reset__card .reset__card__socials button.reset__card__action__reset span {
		font-size: 1.1rem;
	}

	@media only screen and (min-width: 640px) {
		.reset .reset__card {
			width: 100%;
			height: auto;
			max-width: 450px;
		}
		.reset .reset__card .reset__card__header span{
			font-size: 2rem;
		}
		.reset .reset__card .reset__card__header img{
			width: auto;
		}
		.reset .reset__card .reset__card__body div {
			width: 100%;
			max-width: 350px;
		}
	}
</style>