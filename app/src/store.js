import vue from 'vue';
import Vuex from 'vuex';

vue.use(Vuex);
const state = {
	qrcode_img: ''
}
const mutations = {
	SETIMG(state, n) {
		state.qrcode_img = n;
	}

}
const getters = {
	getImg(state) {
		return state.qrcode_img;
	}
}
const actions = {
	setImg({commit}, data) {
		commit('SETIMG', data)
	},
}
const store = new Vuex.Store({
	actions,
	state,
	getters,
	mutations
})
export default store;
