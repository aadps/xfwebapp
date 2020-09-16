import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { API } from "../config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pref: {
      order: {},
      userPref: {},
      devicePref: {}
    }
  },
  mutations: {
    setPref(state, p) {
      if (p !== "") state.pref = p;
    },
    setOrder(state, p) {
      var order = [];
      for (var i in p.order) order.push(p.order[i].id);
      state.pref.order[p.type] = order;
    },
    setUserPref(state, p) {
      state.pref.userPref = p;
    },
    setDevicePref(state, p) {
      state.pref.devicePref[p.id] = p.pref;
    }
  },
  actions: {
    getPreferences({ commit }) {
      axios
        .get(API + "/User.getPreferences")
        .then(response => commit("setPref", response.data.data))
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    setOrder({ commit, dispatch }, p) {
      commit("setOrder", p);
      dispatch("setPreferences");
    },
    setUserPref({ commit, dispatch }, p) {
      commit("setUserPref", p);
      dispatch("setPreferences");
    },
    setDevicePref({ commit, dispatch }, p) {
      commit("setDevicePref", p);
      dispatch("setPreferences");
    },
    setPreferences() {
      axios
        .post(API + "/User.setPreferences", {
          pref: JSON.stringify(this.state.pref)
        })
        .then(response => console.log(response))
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    }
  },
  modules: {}
});
