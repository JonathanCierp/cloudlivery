export const state = () => ({
	auth: {},
	tab: 0,
	cartItems: [],
	countCartItems: 0,
	displayCartDialog: false
})

export const mutations = {
	SET_AUTH(state, user) {
		if (user.id) {
			state.auth.user = user
			state.auth.isLogged = true
		} else {
			state.auth.user = {},
				state.auth.isLogged = false
		}
	},
	CHANGE_TAB(state, v) {
		state.tab = v
	},
	EDIT_CART(state, item) {
		const existItem = state.cartItems.find(cartItem => cartItem.id === item.id)
		if (existItem) {
			const existItemIndex = state.cartItems.indexOf(existItem)
			if(item.count) {
				state.cartItems[existItemIndex] = {...item}
			}else {
				state.cartItems.splice(existItemIndex, 1)
			}
		} else {
			if(item.count) {
				state.cartItems = [...state.cartItems, item]
			}
		}

		state.countCartItems = 0
		state.cartItems.filter(cartItem => state.countCartItems += cartItem.count)

		localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
		localStorage.setItem("countCartItems", state.countCartItems)
	},
	SYNCHRONIZE_CART(state) {
		state.cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []
		state.countCartItems = localStorage.getItem("countCartItems") >= 0 ? localStorage.getItem("countCartItems") : 0
	},
	DISPLAY_CART_DIALOG(state, v) {
		state.displayCartDialog = v
	}
}