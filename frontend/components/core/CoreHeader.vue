<template>
	<header class="header bg-white px-8 shadow flex items-center w-full">
		<div class="header__container flex items-center justify-between w-full h-full">
			<div class="header__container__brand">
				<nuxt-link class="inline-block" to="/">
					<img class="inline px-1" src="@/assets/img/icons/logo.svg" alt="Logo du site">
					<span class="text-logo font-bold align-middle">Cloudlivery</span>
				</nuxt-link>
			</div>
			<ul class="header__container__actions flex items-center font-bold text-sm">
				<li class="mx-5 cursor-pointer hover:opacity-75" @click="$store.commit('DISPLAY_CART_DIALOG', true)">
					<ui-badge type="info" :content="$store.state.countCartItems ? $store.state.countCartItems : 0">
						<icon-cart/>
					</ui-badge>
				</li>
				<li v-if="$store.state.auth.isLogged">
					<ul>
						<li>Bonjour, {{ username }}</li>
					</ul>
				</li>
				<li v-if="$store.state.auth.isLogged" class="mx-5 cursor-pointer" @click="onSignout">
					<ul>
						<icon-logout/>
					</ul>
				</li>
				<li v-else>
					<ul class="flex items-center">
						<li class="mx-2 hover:opacity-75">
							<nuxt-link to="/auth/signin">
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
		AisSearchBox,
		AisIndex
	} from "vue-instantsearch"

	import IconCart from "@/components/icons/IconCart"
	import IconUser from "@/components/icons/IconUser"
	import IconSearch from "@/components/icons/IconSearch"
	import IconLogout from "@/components/icons/IconLogout"

	import GqlSignout from "@/utils/apollo/mutation/signout"

	export default {
		name: "CoreHeader",
		components: {
			AisInstantSearchSsr,
			AisSearchBox,
			IconCart,
			IconUser,
			IconSearch,
			IconLogout,
			AisIndex
		},
		data() {
			return {}
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
					const res = await this.$apollo.mutate({
						mutation: GqlSignout
					})
					this.$store.commit("SET_AUTH", {})
					await this.$apolloHelpers.onLogout()
					this.$notify({
						title: res.data.signout.message,
						type: "success"
					})
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
