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
			<custom-form ref="form" @submit.prevent="onSignin" class="signin__card__body flex flex-col items-center justify-center mt-5">
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
					<custom-button-google ref="googleButton" @click="onGoogleLogin" class="signin__card__socials__google flex items-center justify-center" type="button" />
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
	import CustomButtonGoogle from "@/components/custom/button/CustomButtonGoogle"

	import GqlSignin from "@/utils/apollo/mutation/signin"

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
			CustomButton,
			CustomButtonGoogle
		},
		data() {
			return {
				form: {
					email: "a@a.fr",
					password: "a@a.fr",
				},
				rememberMe: false,
				isSignIn: null
			}
		},
		methods: {
			async onSignin() {
				if(this.$refs.form.validate()) {
					this.$refs.loginButton.setState("loading")
					this.$refs.googleButton.setState("loading")
					// Get info
					// https://oauth2.googleapis.com/tokeninfo?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImIxNmRlMWIyYWIwYzE2YWMwYWNmNjYyZWYwMWY3NTY3ZTU0NDI1MmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTAyMDEzOTU0MDA2NC1wYjE0NXZkZGE4ZGJ0azQ4N2I2dmxjbHFldTVxOGNqdi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwMjAxMzk1NDAwNjQtcGIxNDV2ZGRhOGRidGs0ODdiNnZsY2xxZXU1cThjanYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE3NjkxODM1ODYxNjQyMDk2NjMiLCJlbWFpbCI6ImNpZXJwLmpvbmF0aGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoicTJKWk1Hb2Q1V1o4RVJoTnhKWV9XdyIsIm5hbWUiOiJKb25hdGhhbiBDaWVycCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLWF2ZDlfazRFeWd3L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y21kY1VwN3BsdnNVZ0pOMTNJc3llenNYMHB6MWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkpvbmF0aGFuIiwiZmFtaWx5X25hbWUiOiJDaWVycCIsImxvY2FsZSI6ImZyIiwiaWF0IjoxNTkyNTQ5NTI1LCJleHAiOjE1OTI1NTMxMjUsImp0aSI6IjUyODc5YTQ5ZmUzYTM3MjVhNzg1OTY0YWUzOTdmYWEyNGZmYmI1MWEifQ.qDHJSg-1zRKTLVrRQQVQnBeu8OwYASQIFyekGSdPR7OV7MibgmjUjkJL-Qu4KUXcD0_spExoKq54WrDaxKzYSOZ5oZUUhM51Qbep8WY8FtdOoShZ1fKPFDVqqy6otbSmk1ZzjIy7KJGE8xgGXhJ7uviLy0Bn6UnRap36v0BUkwuJ24i6yPrM7W1-aZbNSv-3SvZ9He_7G-KP0eqNx4b3YDFKtpJEquZDpnP2xrqAlIad35nvjjQE9AHz6Fx8NxnISDrZNNLQRkJkssBt9Cp3f79vTcqoJVevOVMSJPkes3ULMvOHb8uocgyh03RCZ4ZXrsme9Vd9yKzhvGmm1C26DQ
					// Api doc
					// https://developers.google.com/identity/sign-in/web/backend-auth
					try {
						const res = await this.$apollo.mutate({
							mutation: GqlSignin,
							variables: this.form
						})
						await this.$apolloHelpers.onLogin(res.data.signin.token)
						this.$store.commit("SET_AUTH", res.data.signin.user)
						this.$refs.loginButton.setState("initial")
						this.$refs.googleButton.setState("initial")
						this.$router.push("/")
					}catch (e) {
						console.log(e.graphQLErrors[0].message)
						this.$refs.loginButton.setState("initial")
						this.$refs.googleButton.setState("initial")
					}
				}
			},
			async onGoogleLogin() {
				this.$refs.googleButton.setState("loading")
				this.$refs.loginButton.setState("loading")
				this.$gAuth
					.signIn()
					.then(GoogleUser => {
						//on success do something
						console.log("GoogleUser", GoogleUser);
						console.log("getId", GoogleUser.getId());
						console.log("getBasicProfile", GoogleUser.getBasicProfile());
						console.log("getAuthResponse", GoogleUser.getAuthResponse());
						//console.log("getAuthResponse", this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse());
						if(this.$gAuth.isAuthorized) {
							/*const res = await this.$apollo.mutate({
								mutation: GqlLogin,
								variables: this.form
							})*/
						}
						this.isSignIn = this.$gAuth.isAuthorized;
						this.$refs.googleButton.setState("initial")
						this.$refs.loginButton.setState("initial")
					})
					.catch(error => {
						//on fail do something
						console.error("Connexion google interrompu");
						this.$refs.googleButton.setState("initial")
						this.$refs.loginButton.setState("initial")
					});
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