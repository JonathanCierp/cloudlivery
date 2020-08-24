<template>
	<div>
		<ais-instant-search index-name="dev_cloudlivery">
			<ais-search-box>
				<div slot-scope="{ currentRefinement, isSearchStalled, refine }"
						 class="flex-1 mx-10 relative header__container__middle hidden md:inline-block">
					<icon-search class="pointer-events-none absolute inset-y-0 left-0 flex items-center"/>
					<input type="search" v-model="currentRefinement" @input="refine($event.currentTarget.value)"
								 class="transition-colors duration-400 ease-in-out bg-gray-200 shadow appearance-none rounded w-full py-2 px-4 pl-16 text-gray-700 leading-tight focus:shadow-outline"
								 placeholder="Oeuf, poisson etc...">
				</div>
			</ais-search-box>
		</ais-instant-search>
		<ais-instant-search index-name="dev_cloudlivery">
			<ais-stats/>
			<ais-refinement-list attribute="marque.label"/>
			<ais-infinite-hits>
				<ul slot-scope="{ items, refinePrevious, refineNext, isLastPage }">
					<li>
						<button @click="refinePrevious">
							Show previous results
						</button>
					</li>
					<li v-for="item in items" :key="item.objectID">
						{{ item.label }}
					</li>
					<li v-if="!isLastPage">
						<button @click="refineNext">
							Show more results
						</button>
					</li>
				</ul>
				<!--<template slot="item" slot-scope="{ item }">
					<div class="bg-white m-2 shadow w-1/5">
						<div>
							<span class="block">
								<ais-highlight attribute="label" :hit="item"/>
							</span>
							<span class="block">{{ item.packaging }}</span>
							<span class="block">{{ item.per_unit_label }}</span>
						</div>
						<div>
							<img :src="item.produit_images[0].largest" alt="largest image">
						</div>
						<div>
							<span class="block">{{ item.price.replace(".", ",") }}€</span>
						</div>
					</div>
				</template>-->
			</ais-infinite-hits>
		</ais-instant-search>
	</div>
</template>

<script>
	import {
		AisInstantSearch,
		AisRefinementList,
		AisHits,
		AisInfiniteHits,
		AisHighlight,
		AisSearchBox,
		AisStats,
		AisPagination,
		createServerRootMixin,
	} from "vue-instantsearch"

	import algoliasearch from "algoliasearch/lite"

	const searchClient = algoliasearch(
		"2O4QB4BTXT",
		"31085070cadb9685828446a0cd99d90b"
	)

	export default {
		mixins: [
			createServerRootMixin({
				searchClient,
				indexName: "dev_cloudlivery"
			})
		],
		serverPrefetch() {
			return this.instantsearch.findResultsState(this).then(algoliaState => {
				this.$ssrContext.nuxt.algoliaState = algoliaState
			})
		},
		beforeMount() {
			const results =
				this.$nuxt.context.nuxtState.algoliaState || window.__NUXT__.algoliaState
			this.instantsearch.hydrate(results)
		},
		//mixins: [rootMixin],
		components: {
			AisInstantSearch,
			AisRefinementList,
			AisHits,
			AisInfiniteHits,
			AisHighlight,
			AisSearchBox,
			AisStats,
			AisPagination
		},
		head() {
			return {
				link: [
					{
						rel: "stylesheet",
						href: "https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css"
					}
				]
			}
		}
	}
</script>