import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import UsersNew from "../views/UsersNew.vue";
import UsersLogin from "../views/UsersLogin.vue";
import UsersLogout from "../views/UsersLogout.vue";
import EquipmentSetsIndex from "../views/EquipmentSetsIndex.vue";
import EquipmentSetsShow from "../views/EquipmentSetsShow.vue";
import EquipmentSetsCreate from "../views/EquipmentSetsCreate.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/users/new",
    name: "signup",
    component: UsersNew,
  },
  {
    path: "/users/login",
    name: "login",
    component: UsersLogin,
  },
  {
    path: "/users/logout",
    name: "logout",
    component: UsersLogout,
  },
  {
    path: "/equipment-sets",
    name: "equipment-sets",
    component: EquipmentSetsIndex,
  },
  {
    path: "/equipment-sets/:id",
    name: "equipment-sets-show",
    component: EquipmentSetsShow,
  },
  {
    path: "/equipment-sets/new",
    name: "equipment-sets/new",
    component: EquipmentSetsCreate,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
