require("dotenv").config()

module.exports = {
  mode: "universal",
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: process.env.npm_package_description || "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Muli:wght@400;500;700&display=swap" }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#fff" },
  /*
  ** Global CSS
  */
  css: [
  	"@/assets/css/reset.css"
  ],
	router: {
		middleware: ["auth"]
	},
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
		"~/plugins/helper",
		{ src: "~/plugins/vue-google-oauth2", ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    "@nuxtjs/tailwindcss",
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
		// Doc : https://github.com/nuxt-community/apollo-module
		"@nuxtjs/apollo",
		// Doc : https://www.npmjs.com/package/cookie-universal-nuxt
		"cookie-universal-nuxt"
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
	/*
	** Apollo module configuration
	** See https://github.com/nuxt-community/apollo-module
	*/
	apollo: {
		clientConfigs: {
			default: {
				httpEndpoint: process.env.APOLLO_HTTP_ENDPOINT,
				wsEndpoint: process.env.APOLLO_WS_ENDPOINT
			}
		}
	},
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
		extend (config, ctx) {
    }
  }
}
