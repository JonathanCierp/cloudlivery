export const state = () => ({
	auth: {},
	tab: 0,
	cartItems: [],
	countCartItems: 0,
	displayCartDialog: false
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
	},
	CHANGE_TAB(state, v) {
		state.tab = v
	},
	EDIT_CART(state, item) {
		const existItem = state.cartItems.find(cartItem => cartItem.id === item.id)
		if(existItem) {
			const existItemIndex = state.cartItems.indexOf(existItem)
			state.cartItems[existItemIndex] = {...item}
		}else {
			state.cartItems = [...state.cartItems, item]
		}

		state.countCartItems = 0
		state.cartItems.filter(cartItem => state.countCartItems += cartItem.count)

		localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
		localStorage.setItem("countCartItems", state.countCartItems)
	},
	SYNCHRONIZE_CART(state) {
		state.cartItems = JSON.parse(localStorage.getItem("cartItems"))
		state.countCartItems = localStorage.getItem("countCartItems")
	},
	DISPLAY_CART_DIALOG(state, v) {
		state.displayCartDialog = v
	}
}