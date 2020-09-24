<template>
	<!--<header class="header bg-white py-3 shadow">
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
	</header>-->
	<header class="header bg-white px-8 shadow flex items-center w-full">
		<div class="header__container flex items-center justify-between w-full h-full">
			<div class="header__container__brand">
				<nuxt-link class="inline-block" to="/">
					<img class="inline px-1" src="@/assets/img/icons/logo.svg" alt="Logo du site">
					<span class="text-logo font-bold align-middle">Cloudlivery</span>
				</nuxt-link>
			</div>
			<ui-desktop class="header__container__menu flex-1 px-16 font-bold text-sm" :breakpoint="900">
					<ui-tabs v-model="tab">
						<ui-tab>Comparateur</ui-tab>
						<!--<ui-tab>Tous les produits</ui-tab>
						<ui-tab>Carrefour</ui-tab>
						<ui-tab>Auchan</ui-tab>-->
					</ui-tabs>
				</ui-desktop>
			<ul class="header__container__actions flex items-center font-bold text-sm">
				<li class="mx-5 cursor-pointer hover:opacity-75" @click="$store.commit('DISPLAY_CART_DIALOG', true)">
					<ui-badge type="info" :content="$store.state.countCartItems">
						<icon-cart/>
					</ui-badge>
				</li>
				<li v-if="$store.state.auth.isLogged">
					<ul>
						<li>Bonjour, {{ username }}</li>
					</ul>
				</li>
				<li v-else>
					<ul class="flex items-center">
						<li class="mx-2 hover:opacity-75">
							<nuxt-link to="/">
								<icon-user class="inline"/>
								<span class="align-middle pt-1">Compte</span>
							</nuxt-link>
						</li>
					</ul>
				</li>
			</ul>
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
		data() {
			return {

			}
		},
		computed: {
			username: {
				get() {
					const firstname = this.$store.state.auth.user.firstname
					const lastname = this.$store.state.auth.user.lastname

					return `${firstname} ${lastname}`
				}
			},
			tab: {
				get() {
					return this.$store.state.tab
				},
				set(v) {
					this.$store.commit("CHANGE_TAB", v)
				}
			}
		},
		methods: {
			async onSignout() {
				try {
					await this.$apollo.mutate({
						mutation: GqlSignout
					})
					this.$store.commit("SET_AUTH", {})
					await this.$apolloHelpers.onLogout()
					this.$router.push("/")
				} catch (e) {
					console.log(e)
				}

				/*await this.$apolloHelpers.onSignout()*/
			}
		}
	}
</script>

<!--
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
</style>-->

<style scoped>
	header.header {
		height: 60px;
	}

	header.header .header__container .header__container__brand img {
		width: 40px;
	}

	header.header .header__container .header__container__actions svg#icon-cart, header.header .header__container .header__container__actions svg#icon-user {
		width: 23px;
	}

	header.header .header__container .header__container__menu, header.header .header__container .header__container__menu .header__container__items, header.header .header__container .header__container__menu .header__container__items .header__container__item {
		height: 100%;
		font-size: .9rem;
	}

	header.header .header__container .header__container__menu .header__container__items .header__container__item span {
		width: 100%;
		height: 3px;
		background: linear-gradient(to right, #10A3CC, #B32EE8);
		position: absolute;
		bottom: 0;
		opacity: 0;
	}

	header.header .header__container .header__container__menu .header__container__items .header__container__item.header__container__item--active span {
		opacity: 1;
	}
</style>
