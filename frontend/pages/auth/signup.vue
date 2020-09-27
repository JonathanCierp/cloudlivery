<template>
	<div class="signup flex items-center justify-center sm:h-full">
		<div class="signup__card bg-white pt-5 pb-10 px-8 shadow h-full sm:py-8 sm:h-auto sm:min-h-auto">
			<nuxt-link class="inline-block mb-5" to="/">
				<img class="inline px-1 w-10" src="@/assets/img/icons/logo.svg" alt="Logo du site">
				<span class="font-bold align-middle">Cloudlivery</span>
			</nuxt-link>
			<div class="signup__card__header flex items-center justify-center mb-6">
				<span class="font-bold align-middle">S'inscrire</span>
			</div>
			<custom-form ref="form" @submit.prevent="onSignup" class="signup__card__body flex flex-col items-center justify-center mt-5">
				<custom-form-group-row class="signup__card__body__row my-5">
					<custom-form-radio v-model="form.civilite" :rules="['required']" name="civilite" label="Madame" value="Mme" class="mr-3" />
					<custom-form-radio v-model="form.civilite" :rules="['required']" name="civilite" label="Monsieur" value="Mr" class="ml-3" />
				</custom-form-group-row>
				<custom-form-group-row class="signup__card__body__row flex-col sm:flex-row">
					<custom-form-input v-model="form.lastname" icon-left="icon-user" placeholder="Nom" :rules="['required']" lazy class="sm:mr-2" />
					<custom-form-input v-model="form.firstname" icon-left="icon-user" placeholder="Prénom" :rules="['required']" lazy class="sm:ml-2" />
				</custom-form-group-row>
				<custom-form-group-row class="signup__card__body__row flex-col sm:flex-row">
					<custom-form-input v-model="form.email" icon-left="icon-arobase" placeholder="Email" :rules="['required', 'email']" lazy class="sm:mr-2" />
					<custom-form-input v-model="form.password" type="password" icon-left="icon-lock" placeholder="Mot de passe" :rules="['required']" lazy class="sm:ml-2" />
				</custom-form-group-row>
				<custom-form-group class="signup__card__body__row flex items-center justify-start mt-8 mb-4 ml-2 w-full">
					<custom-form-checkbox v-model="policy" :rules="['required']" lazy>
						<template v-slot:label>
							<span>
								J'ai lu et j'accepte les <nuxt-link to="/policy">conditions générales</nuxt-link> du site cloudlivery.fr.
							</span>
						</template>
					</custom-form-checkbox>
				</custom-form-group>
				<div class="signup__card__actions flex w-full justify-center my-8 sm:mt-8">
					<custom-button ref="signupButton" type="submit" class="signup__card__actions__signup rounded-full w-full hover:opacity-75 flex items-center justify-center">
						<span class="font-bold">Créer mon compte</span>
					</custom-button>
				</div>
			</custom-form>
			<p class="text-center signup__connect my-5">
				Vous avez déjà un compte ? <nuxt-link to="/auth/signin" class="hover:opacity-75">Connectez-vous</nuxt-link>
			</p>
		</div>
	</div>
</template>

<script>
	import CustomForm from "@/components/custom/form/CustomForm"
	import CustomFormInput from "@/components/custom/form/CustomFormInput"
	import CustomFormGroup from "@/components/custom/form/CustomFormGroup"
	import CustomFormGroupRow from "@/components/custom/form/CustomFormGroupRow"
	import CustomFormCheckbox from "@/components/custom/form/CustomFormCheckbox"
	import CustomFormRadio from "@/components/custom/form/CustomFormRadio"
	import CustomButton from "@/components/custom/button/CustomButton"

	import GqlSignup from "@/utils/apollo/mutation/signup"

	export default {
		layout: "blank",
		name: "auth-signup",
		middleware: ["isAuthenticated"],
		components: {
			CustomForm,
			CustomFormGroup,
			CustomFormGroupRow,
			CustomFormInput,
			CustomFormCheckbox,
			CustomFormRadio,
			CustomButton
		},
		data() {
			return {
				form: {
					civilite: "Mme",
					lastname: null,
					firstname: null,
					email: null,
					password: null
				},
				policy: false
			}
		},
		methods: {
			async onSignup() {
				if(this.$refs.form.validate() && this.policy) {
					this.$refs.signupButton.setState("loading")
					try {
						await this.$apollo.mutate({
							mutation: GqlSignup,
							variables: {
								input: this.form
							}
						})
						this.$notify({
							title: "Compte crée avec succès",
							type: "success"
						})
						this.$refs.signupButton.setState("initial")
						this.$router.push("/")
					}catch (e) {
						this.$refs.signupButton.setState("initial")
					}
				}
			}
		}
	}
</script>

<style scoped>
	.signup .signup__card {
		width: 100%;
		height: 100%;
	}
	.signup .signup__card .signup__card__header span{
		font-size: 2rem;
	}
	.signup .signup__card .signup__card__body div:not(.signup__card__body__row, .custom-form-checkbox, .custom-form-radio) {
		width: 100%;
	}

	.signup .signup__card .signup__card__body .signup__card__body__row .custom-form-radio {
		width: 100px;
	}

	.signup .signup__card .signup__card__body .signup__card__body__row .custom-form-checkbox span{
		line-height: 1.2rem;
	}

	.signup .signup__card .signup__card__body .signup__card__body__row .custom-form-checkbox a{
		color: #10a3cc;
		font-weight: bold;
		text-decoration: underline;
	}

	.signup .signup__card .signup__card__body .signup__card__body__row .custom-form-checkbox a:hover{
		opacity: 0.70;
	}

	.signup .signup__card .signup__card__body button.signup__card__actions__signup {
		height: 50px;
		color: white;
		background-color: #10a3cc;
		border: 3px solid #10a3cc;
	}

	.signup .signup__connect a{
		color: #10a3cc;
		font-weight: bold;
		text-decoration: underline;
	}

	.signup .signup__card .signup__card__socials button.signup__card__action__signup span {
		font-size: 1.1rem;
	}

	@media only screen and (min-width: 640px) {
		.signup .signup__card {
			width: 100%;
			height: auto;
			max-width: 630px;
		}
		.signup .signup__card .signup__card__header span{
			font-size: 2rem;
		}
		.signup .signup__card .signup__card__header img{
			width: auto;
		}
		.signup .signup__card .signup__card__body div:not(.signup__card__body__row, .custom-form-checkbox, .custom-form-radio) {
			width: 100%;
			max-width: 350px;
		}
	}
</style>