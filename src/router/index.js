import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Preference from "../views/Preference.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "misc",
    component: Dashboard
  },
  {
    path: "/smd",
    name: "smd",
    component: Dashboard
  },
  {
    path: "/cl",
    name: "cl",
    component: Dashboard
  },
  {
    path: "/pir",
    name: "pir",
    component: Dashboard
  },
  {
    path: "/sos",
    name: "sos",
    component: Dashboard
  },
  {
    path: "/wsdcg",
    name: "wsdcg",
    component: Dashboard
  },
  {
    path: "/sj",
    name: "sj",
    component: Dashboard
  },
  {
    path: "/pref",
    name: "pref",
    component: Preference
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
