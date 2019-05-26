import vue from 'vue';
import Vuex from 'vuex';

vue.use(Vuex);
const state = {
	qrcode_img: '',
	timeline_qrcode_img:''
}
const mutations = {
	SETIMG(state, n) {
		state.qrcode_img = n;
	},
	SETIMG_TIMELINE(state, n) {
		state.timeline_qrcode_img = n;
	}

}
const getters = {
	getImg(state) {
		return state.qrcode_img;
	},
	getImg_timeline(state) {
		return state.timeline_qrcode_img;
	},
}
const actions = {
	setImg({commit}, data) {
		commit('SETIMG', data)
	},
	setImg_timeline({commit}, data) {
		commit('SETIMG_TIMELINE', data)
	},
}
const store = new Vuex.Store({
	actions,
	state,
	getters,
	mutations
})
export default store;
