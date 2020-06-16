import Vue from 'vue'

Vue.prototype.$helper = {
	toCamelCase(text) {
		return text.replace(/-\w/g, this.clearAndUpper);
	},
	toPascalCase(text) {
		return text.replace(/(^\w|-\w)/g, this.clearAndUpper);
	},
	clearAndUpper(text) {
		return text.replace(/-/, "").toUpperCase();
	}
}
