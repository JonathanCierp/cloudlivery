import Vue from 'vue'

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

Vue.prototype.$helper = {
	toCamelCase(text) {
		return text.replace(/-\w/g, this.clearAndUpper)
	},
	toPascalCase(text) {
		return text.replace(/(^\w|-\w)/g, this.clearAndUpper)
	},
	getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min
	},
	clearAndUpper(text) {
		return text.replace(/-/, "").toUpperCase()
	},
	rules: {
		required(v) {
			if(!!v) {
				return {
					state: "valid",
					message: ""
				}
			}

			return {
				state: "error",
				message: "Champs obligatoire."
			}
		},
		email(v) {
			if(!!v) {
				if(emailRegex.test(v)) {
					return {
						state: "valid",
						message: ""
					}
				}else {
					return {
						state: "error",
						message: "L'email n'est pas valide."
					}
				}
			}

			return {
				state: "initial",
				message: ""
			}
		},
		is(v, max) {
			if(!max) {
				throw new Error("<is> rule need to have a max")
			}
			if(max < 1) {
				throw new Error("<is> rule need to be >= 1")
			}
			if(!!v) {
				if(v.length === parseInt(max)) {
					return {
						state: "valid",
						message: ""
					}
				}

				return {
					state: "error",
					message: `Le nombre de caractère doit être exactement de ${max} caractère${max > 1 ? "s" : ""}.`
				}
			}

			return {
				state: "initial",
				message: ""
			}
		},
		min(v, min) {
			if(!min) {
				throw new Error("<min> rule need to have a min")
			}
			if(min < 1) {
				throw new Error("<min> rule need to be >= 1")
			}
			if(!!v) {
				if(v.length >= parseInt(min)) {
					return {
						state: "valid",
						message: ""
					}
				}

				return {
					state: "error",
					message: `Le nombre de caractère doit être au minimum de ${min} caractère${min > 1 ? "s" : ""}.`
				}
			}

			return {
				state: "initial",
				message: ""
			}
		},
		max(v, max) {
			if(!max) {
				throw new Error("<max> rule need to have a max")
			}
			if(max < 1) {
				throw new Error("<max> rule need to be >= 1")
			}
			if(!!v) {
				if(v.length <= parseInt(max)) {
					return {
						state: "valid",
						message: ""
					}
				}

				return {
					state: "error",
					message: `Le nombre de caractère doit être au maximum de ${max} caractère${max > 1 ? "s" : ""}.`
				}
			}

			return {
				state: "initial",
				message: ""
			}
		}
	}
}
