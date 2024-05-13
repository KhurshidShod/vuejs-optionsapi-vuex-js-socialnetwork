import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "./../views/HomePage.vue";
import JoinPage from "./../views/JoinPage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "Home", component: HomePage },
    { path: "/joinus", name: "Join", component: JoinPage },
  ],
});
router.beforeEach(async (to, from) => {
  if (!localStorage.getItem("user") && to.name !== "Join") {
    return { name: "Join" };
  }
});
export default router;
