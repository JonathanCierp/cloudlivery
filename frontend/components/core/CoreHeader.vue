<template>
	<header class="header bg-white py-3 shadow">
		<div class="header__container container mx-auto flex items-center justify-between">
			<div class="header__container__left flex items-center justify-center">
				<nuxt-link class="inline-block" to="/">
					<img class="inline px-1" src="@/assets/img/icons/logo.svg" alt="Logo du site">
					<span class="text-logo font-bold align-middle">Cloudlivery</span>
				</nuxt-link>
			</div>
			<div class="flex-1 mx-10 relative header__container__middle">
				<icon-search class="pointer-events-none absolute inset-y-0 left-0 flex items-center" />
				<input class="transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-2 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline" placeholder="Oeuf, poisson etc...">
			</div>
			<div class="flex items-center justify-center header__container__right">
				<nuxt-link v-if="$store.state.auth.isLogged" class="inline-block px-4 hover:opacity-75" to="/">
					<img class="rounded-full w-10 inline mr-2" src="@/assets/img/user-default.jpg" alt="Image d'utilisateur défaut">
					<span class="align-middle">{{ username }}</span>
				</nuxt-link>
				<nuxt-link v-else class="inline-block px-4 hover:opacity-75" to="/auth/signin">
					<icon-user class="inline" />
					<span class="align-middle">Mon compte</span>
				</nuxt-link>
				<nuxt-link @click.native="onLogout" class="inline-block px-4 hover:opacity-75" to="#">
					<icon-cart class="inline" />
				</nuxt-link>
			</div>
		</div>
	</header>
</template>

<script>
	import IconCart from "@/components/icons/IconCart"
	import IconUser from "@/components/icons/IconUser"
	import IconSearch from "@/components/icons/IconSearch"

	export default {
		name: "CoreHeader",
		components: {
			IconCart,
			IconUser,
			IconSearch
		},
		computed: {
			username: {
				get() {
					const firstname = this.$store.state.auth.user.firstname
					const lastname = this.$store.state.auth.user.lastname

					return `${firstname} ${lastname}`
				}
			}
		},
		methods: {
			async onLogout () {
				await this.$apolloHelpers.onLogout()
			}
		}
	}
</script>

<style scoped>
	.text-logo {
		font-size: 1.35rem;
	}
	.header__container__middle svg {
		color: #718096;
		margin: 7px 16px;
	}
	.header__container__middle input {
		padding-left: 3.5rem;
	}
</style>