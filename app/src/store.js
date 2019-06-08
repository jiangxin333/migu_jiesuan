import vue from 'vue';
import Vuex from 'vuex';

vue.use(Vuex);
const state = {
	qrcode_img: '',
	timeline_qrcode_img:'',
	qrcode_link:'',
	timeline_qrcode_link:'',
	data:'',
	data2: ''
}
const mutations = {
	SETIMG(state, n) {
		state.qrcode_img = n;
	},
	SETIMG_TIMELINE(state, n) {
		state.timeline_qrcode_img = n;
	},
	SETLINK(state, n) {
		state.qrcode_link = n;
	},
	SETLINK_TIMELINE(state, n) {
		state.timeline_qrcode_link = n;
	},
	SETDATA(state, n) {
		state.data = n;
	},
	SETDATA2(state, n) {
		state.data2 = n;
	}

}
const getters = {
	getImg(state) {
		return state.qrcode_img;
	},
	getImg_timeline(state) {
		return state.timeline_qrcode_img;
	},
	getLink(state) {
		return state.qrcode_link;
	},
	getLink_timeline(state) {
		return state.timeline_qrcode_link;
	},
	getData(state) {
		return state.data;
	},
}
const actions = {
	setImg({commit}, data) {
		commit('SETIMG', data)
	},
	setImg_timeline({commit}, data) {
		commit('SETIMG_TIMELINE', data)
	},
	setLink({commit}, data) {
		commit('SETLINK', data)
	},
	setLink_timeline({commit}, data) {
		commit('SETLINK_TIMELINE', data)
	},
	setData({commit}, data) {
		commit('SETDATA', data)
	},
}
const store = new Vuex.Store({
	actions,
	state,
	getters,
	mutations
})
export default store;
