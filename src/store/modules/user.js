// import { userInfo } from '@/server/user.js';
const state = {
    per: []
}

const mutations = {
    SET_PER: (state, pers) => {
        state.per = pers
    }
}

const actions = {
//   getInfo({ commit}) {
//     userInfo({}).then((res) => {
//         if (res.length > 0) {
//             commit('SET_PER', res);
//         }
//     });
//   }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
