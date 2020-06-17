<template>
	<div class="signin shadow flex items-center justify-center h-full">
		<div class="signin__card bg-white py-10 px-10 shadow h-full sm:py-8 sm:h-auto sm:min-h-auto">
			<nuxt-link class="inline-block mb-8" to="/">
				<img class="inline px-1 w-10" src="@/assets/img/icons/logo.svg" alt="Logo du site">
				<span class="text-logo font-bold align-middle">Cloudlivery</span>
			</nuxt-link>
			<div class="signin__card__header flex items-center justify-center mb-6">
				<span class="text-logo font-bold align-middle">Se connecter</span>
			</div>
			<custom-form ref="form" @submit.prevent="onLogin" class="signin__card__body flex flex-col items-center justify-center mt-5">
				<custom-form-input v-model="form.email" icon-left="icon-arobase" placeholder="Email" :rules="['required', 'email']" lazy autocomplete="off" />
				<custom-form-input v-model="form.password" icon-left="icon-lock" type="password" placeholder="Mot de passe" :rules="['required']" lazy autocomplete="off" />
				<div class="signin__card__body__forget flex items-center relative justify-end my-1">
					<nuxt-link class="text-sm underline hover:opacity-75" to="/auth/password/reset">
						Mot de passe oublié ?
					</nuxt-link>
				</div>
				<div class="signin__card__body__remember flex items-center relative justify-start my-4 text-sm">
					<custom-form-checkbox v-model="rememberMe" label="Se souvenir de moi" />
				</div>
				<div class="signin__card__actions flex w-full justify-center my-3">
					<custom-button ref="loginButton" type="submit" class="signin__card__actions__signin rounded-full w-full hover:opacity-75 flex items-center justify-center">
						<span class="font-bold">Me connecter</span>
					</custom-button>
				</div>
				<div class="signin__card__actions w-full my-3">
					<span class="text-sm">Vous n'avez pas de compte ?</span>
					<nuxt-link class="signin__card__actions__signup rounded-full w-full text-sm hover:opacity-75" to="/auth/signup">
						<span class="align-middle font-bold underline">M'inscrire</span>
					</nuxt-link>
				</div>
				<div class="signin__card__body__or my-3 text-center">
					<span></span>
					<span class="text-black-lighter">
						Ou
					</span>
					<span></span>
				</div>
				<div class="signin__card__socials flex w-full justify-center my-3">
					<button @click="onGoogleLogin" type="button" class="signin__card__socials__google rounded w-full hover:opacity-75">
						<icon-google-color class="inline-block mr-3" />
						<span class="align-middle font-bold">Se connecter avec google</span>
					</button>
				</div>
			</custom-form>
		</div>
	</div>
</template>

<script>
	import IconArobase from "@/components/icons/IconArobase"
	import IconLock from "@/components/icons/IconLock"
	import IconGoogleColor from "@/components/icons/IconGoogleColor"
	import CustomForm from "@/components/custom/form/CustomForm"
	import CustomFormCheckbox from "@/components/custom/form/CustomFormCheckbox"
	import CustomFormInput from "@/components/custom/form/CustomFormInput"
	import CustomButton from "@/components/custom/button/CustomButton"

	import GqlLogin from "@/utils/apollo/mutation/login"

	export default {
		layout: "blank",
		name: "auth-signin",
		middleware: ["isAuthenticated"],
		components: {
			IconArobase,
			IconLock,
			IconGoogleColor,
			CustomForm,
			CustomFormCheckbox,
			CustomFormInput,
			CustomButton
		},
		data() {
			return {
				form: {
					email: "a@a.fr",
					password: "a@a.fr"
				},
				rememberMe: false
			}
		},
		methods: {
			async onLogin() {
				if(this.$refs.form.validate()) {
					this.$refs.loginButton.setState("loading")

					try {
						const res = await this.$apollo.mutate({
							mutation: GqlLogin,
							variables: this.form
						})
						await this.$apolloHelpers.onLogin(res.data.login.token)
						this.$store.commit("SET_AUTH", res.data.login.user)
						this.$refs.loginButton.setState("initial")
						this.$router.push("/")
					}catch (e) {
						console.log(e.graphQLErrors[0].message)
						this.$refs.loginButton.setState("initial")
					}

					/*setTimeout(() => {
						this.$refs.loginButton.setState("initial")
					}, this.$helper.getRndInteger(1000, 5000))*/
				}
			},
			onGoogleLogin() {
				console.log(2)
				/*this.$gAuth
					.signIn()
					.then(GoogleUser => {
						//on success do something
						console.log("GoogleUser", GoogleUser);
						console.log("getId", GoogleUser.getId());
						console.log("getBasicProfile", GoogleUser.getBasicProfile());
						console.log("getAuthResponse", GoogleUser.getAuthResponse());
						console.log(
							"getAuthResponse",
							this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse()
						);
						this.isSignIn = this.$gAuth.isAuthorized;
					})
					.catch(error => {
						//on fail do something
						console.error(error);
					});*/
			}
		}
	}
</script>

<style scoped>
	.signin .signin__card {
		width: 100%;
		height: 100%;
	}
	.signin .signin__card .signin__card__header span{
		font-size: 2rem;
	}
	.signin .signin__card .signin__card__body div {
		width: 100%;
		max-width: 450px;
	}
	.signin .signin__card .signin__card__body .signin__card__body__input svg {
		color: #718096;
		margin: 14px 16px;
	}
	.signin .signin__card .signin__card__body .signin__card__body__or span:first-child, .signin .signin__card .signin__card__body .signin__card__body__or span:last-child {
		display: inline-block;
		height: 2px;
		background-color: black;
		width: calc((100% - 36px) / 2);
		vertical-align: middle;
	}
	.signin .signin__card .signin__card__body .signin__card__body__no-account span:first-child, .signin .signin__card .signin__card__body .signin__card__body__no-account span:last-child {
		display: inline-block;
		height: 2px;
		background-color: black;
		width: 20px;
		vertical-align: middle;
	}
	.signin .signin__card .signin__card__body button.signin__card__actions__signin {
		height: 50px;
		color: white;
		background-color: #10a3cc;
		border: 3px solid #10a3cc;
	}
	.signin .signin__card .signin__card__socials button.signin__card__action__signin span {
		font-size: 1.1rem;
	}
	.signin .signin__card .signin__card__socials button.signin__card__socials__google {
		height: 50px;
		border: solid 3px transparent;
		border-radius: 80px;
		background-image: linear-gradient(white, white), linear-gradient(90deg, rgba(255,61,0,1) 0%, rgba(255,193,7,1) 33%, rgba(76,175,80,1) 66%, rgba(25,118,210,1) 100%);
		background-origin: border-box;
		background-clip: content-box, border-box;
	}
	.signin .signin__card .signin__card__socials button.signin__card__socials__google span {
		font-size: 1.1rem;
	}

	@media only screen and (min-width: 640px) {
		.signin .signin__card .signin__card__header span{
			font-size: 2rem;
		}
		.signin .signin__card {
			width: 100%;
			height: auto;
			max-width: 450px;
		}
		.signin .signin__card .signin__card__header img{
			width: auto;
		}
		.signin .signin__card .signin__card__body div {
			width: 100%;
			max-width: 350px;
		}
		.signin .signin__card .signin__card__body .signin__card__body__no-account span:first-child, .signin .signin__card .signin__card__body .signin__card__body__no-account span:last-child {
			display: inline-block;
			height: 2px;
			background-color: black;
			width: 20px;
			vertical-align: middle;
		}
	}
</style>