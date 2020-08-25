<template>
	<header class="header bg-white py-3 shadow">
		<div class="header__container container mx-auto flex items-center justify-between">
			<div class="header__container__left flex items-center justify-center">
				<nuxt-link class="inline-block" to="/">
					<img class="inline px-1" src="@/assets/img/icons/logo.svg" alt="Logo du site">
					<span class="text-logo font-bold align-middle">Cloudlivery</span>
				</nuxt-link>
			</div>
			<ais-search-box class="flex-1 mx-10 relative header__container__middle hidden md:inline-block">
				<template slot-scope="{ currentRefinement, isSearchStalled, refine }">
					<icon-search class="pointer-events-none absolute inset-y-0 left-0 flex items-center"/>
					<input type="search" v-model="currentRefinement" @input="refine($event.currentTarget.value)"
								 class="transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-11/12 py-2 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline"
								 placeholder="Oeuf, poisson etc...">
				</template>
			</ais-search-box>
			<div class="flex items-center justify-center header__container__right">
				<nuxt-link v-if="$store.state.auth.isLogged" class="inline-block px-4 hover:opacity-75" to="/">
					<img class="rounded-full w-10 inline mr-2" src="@/assets/img/user-default.jpg" alt="Image d'utilisateur défaut">
					<span class="align-middle">{{ username }}</span>
				</nuxt-link>
				<nuxt-link v-else class="inline-block px-4 hover:opacity-75" to="/auth/signin">
					<icon-user class="inline" />
					<span class="align-middle hidden lg:inline text-md">Mon compte</span>
				</nuxt-link>
				<nuxt-link @click.native="onSignout" class="inline-block px-4 hover:opacity-75" to="#">
					<icon-cart class="inline" />
				</nuxt-link>
			</div>
		</div>
		<div class="header__container container mx-auto flex items-center justify-between block md:hidden my-5">
			<div class="flex-1 mx-10 relative header__container__middle">
				<icon-search class="pointer-events-none absolute inset-y-0 left-0 flex items-center" />
				<input class="transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-2 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline" placeholder="Oeuf, poisson etc...">
			</div>
		</div>
	</header>
</template>

<script>
	import {
		AisInstantSearchSsr,
		AisSearchBox
	} from "vue-instantsearch"

	import IconCart from "@/components/icons/IconCart"
	import IconUser from "@/components/icons/IconUser"
	import IconSearch from "@/components/icons/IconSearch"

	import GqlSignout from "@/utils/apollo/mutation/signout"

	export default {
		name: "CoreHeader",
		components: {
			AisInstantSearchSsr,
			AisSearchBox,
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
			async onSignout () {
				try{
					await this.$apollo.mutate({
						mutation: GqlSignout
					})
					this.$store.commit("SET_AUTH", {})
					await this.$apolloHelpers.onLogout()
					this.$router.push("/")
				}catch (e) {
					console.log(e)
				}

				/*await this.$apolloHelpers.onSignout()*/
			}
		}
	}
</script>

<style scoped>
	.header__container__left img{
		width: 45px;
	}
	.text-logo {
		font-size: 1.2rem;
	}
	.header__container__middle svg {
		color: #718096;
		margin: 7px 16px;
	}
	.header__container__middle input {
		padding-left: 3.5rem;
	}
	.header__container__right svg{
		width: 25px;
	}

	@media only screen and (min-width: 768px) {
		.text-logo {
			font-size: 1.35rem;
		}
		.header__container__left img{
			width: auto;
		}
		.header__container__right svg{
			width: 30px;
		}
	}

	svg {
		width: 25px;
		height: 20px;
	}
</style>