<template>
	<div class="signin shadow flex items-center justify-center h-screen">
		<div class="signin__card bg-white py-8">
			<div class="signin__card__header flex items-center justify-center mb-6">
				<nuxt-link class="inline-block" to="/">
					<img class="inline px-1" src="@/assets/img/icons/logo.svg" alt="Logo du site">
					<span class="text-logo font-bold align-middle">Cloudlivery</span>
				</nuxt-link>
			</div>
			<form class="signin__card__body flex flex-col items-center justify-center mt-5">
				<!--<form-input icon-left="icon-arobase" placeholder="Email" :rules="['required', 'email']" />-->
				<form-input icon-left="icon-arobase" placeholder="Email" :rules="['required', 'email']" lazy />
				<form-input icon-left="icon-lock" type="password" placeholder="Mot de passe" :rules="['required']" lazy />
				<!--<div class="signin__card__body__input flex items-center relative justify-center my-4">
					<icon-arobase class="pointer-events-none absolute inset-y-0 left-0 flex items-center" />
					<input class="input&#45;&#45;error transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-4 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline" placeholder="Email">
					<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center"><icon-close /></span>
				</div>
				<div class="signin__card__body__input flex items-center relative justify-center my-4">
					<icon-lock class="pointer-events-none absolute inset-y-0 left-0 flex items-center" />
					<input type="password" class="input&#45;&#45;success transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-4 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline" placeholder="Mot de passe">
					<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center"><icon-tick /></span>
				</div>
				<div class="signin__card__body__input flex items-center relative justify-center my-4">
					<icon-lock class="pointer-events-none absolute inset-y-0 left-0 flex items-center" />
					<input type="password" class="input&#45;&#45;success transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-4 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline" placeholder="Mot de passe">
					<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center"><icon-loading /></span>
				</div>-->
				<div class="signin__card__body__forget flex items-center relative justify-end my-1">
					<nuxt-link class="text-sm underline hover:opacity-75" to="/">
						Mot de passe oublié ?
					</nuxt-link>
				</div>
				<div class="signin__card__body__remember flex items-center relative justify-start my-4 text-sm">
					<label class="text-sm hover:opacity-75">
						<input class="mr-2 leading-tight" type="checkbox">
						<span class="align-middle">
							Se souvenir de moi
						</span>
					</label>
				</div>
				<div class="signin__card__actions flex w-full justify-center my-3">
					<button class="signin__card__actions__signin rounded-full w-full hover:opacity-75">
						<span class="align-middle font-bold">Me connecter</span>
					</button>
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
					<button class="signin__card__socials__google rounded w-full hover:opacity-75">
						<icon-google-color class="inline-block mr-3" />
						<span class="align-middle font-bold">Se connecter avec google</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import IconArobase from "@/components/icons/IconArobase"
	import IconLock from "@/components/icons/IconLock"
	import IconGoogleColor from "@/components/icons/IconGoogleColor"
	import IconLoading from "@/components/icons/IconLoading"
	import FormInput from "@/components/form/FormInput"

	export default {
		layout: "blank",
		name: "signin",
		components: {
			IconLoading,
			IconArobase,
			IconLock,
			IconGoogleColor,
			FormInput
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.text-logo {
		padding-top: 10px;
		font-size: 1.5rem;
	}
	.signin .signin__card {
		width: 100%;
		height: 100%;
	}
	.signin .signin__card .signin__card__body div {
		width: 100%;
		max-width: 450px;
	}
	@media only screen and (min-width: 640px) {
		.signin .signin__card {
			width: 100%;
			height: auto;
			max-width: 450px;
		}
		.signin .signin__card .signin__card__body div {
			width: 100%;
			max-width: 350px;
		}
	}
	.signin .signin__card .signin__card__body .signin__card__body__input svg {
		color: #718096;
		margin: 14px 16px;
	}
	.signin .signin__card .signin__card__body .signin__card__body__or span:first-child, .signin .signin__card .signin__card__body .signin__card__body__or span:last-child {
		display: inline-block;
		height: 2px;
		background-color: black;
		width: 140px;
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
</style>