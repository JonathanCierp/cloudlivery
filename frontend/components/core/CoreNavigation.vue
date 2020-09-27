<template>
	<ui-mobile class="core-navigation flex items-center justify-center flex-1 font-bold text-sm" :breakpoint="900">
		<ais-index class="w-full flex items-center justify-center" index-name="COMPARATEUR">
			<ais-search-box class="flex-1 mx-3 w-full relative core-navigation__middle md:inline-block">
				<template slot-scope="{ currentRefinement, isSearchStalled, refine }">
					<icon-search class="pointer-events-none absolute inset-y-0 left-0 flex items-center"/>
					<input type="search" v-model="currentRefinement" @input="refine($event.currentTarget.value)"
								 class="transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-2 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline"
								 placeholder="Boissons, viandes etc...">
				</template>
			</ais-search-box>
		</ais-index>
	</ui-mobile>
</template>

<script>
	import {
		AisInstantSearchSsr,
		AisSearchBox,
		AisIndex,
	} from "vue-instantsearch"
	import IconSearch from "@/components/icons/IconSearch"

	export default {
		name: "CoreNavigation",
		components: {
			AisInstantSearchSsr,
			AisSearchBox,
			IconSearch,
			AisIndex
		},
		/*computed: {
			tab: {
				get() {
					return this.$store.state.tab
				},
				set(v) {
					this.$store.commit("CHANGE_TAB", v)
				}
			}
		}*/
	}
</script>

<style scoped>
	.core-navigation {
		height: 60px;
		position: fixed;
		bottom: 0;
		background: white;
		width: 100%;
		font-size: .8rem;
	}

	.core-navigation .core-navigation__middle > svg {
		color: #718096;
		margin: 5px 20px;
	}
</style>