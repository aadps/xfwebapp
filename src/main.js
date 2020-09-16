import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { API, GREEN, RED, BLUE, GRAY, BLACK, YELLOW } from "./config";

Vue.prototype.$api = API;
Vue.prototype.$green = GREEN;
Vue.prototype.$red = RED;
Vue.prototype.$blue = BLUE;
Vue.prototype.$gray = GRAY;
Vue.prototype.$black = BLACK;
Vue.prototype.$yellow = YELLOW;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
