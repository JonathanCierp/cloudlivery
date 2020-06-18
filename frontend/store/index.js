export const state = () => ({
	auth: {}
})

export const mutations = {
	SET_AUTH(state, user) {
		if(user.id) {
			state.auth.user = user
			state.auth.isLogged = true
		}else {
			state.auth.user = {},
				state.auth.isLogged = false
		}
	}
}