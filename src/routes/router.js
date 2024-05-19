import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "./../views/HomePage.vue";
import JoinPage from "./../views/JoinPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import InboxPage from './../views/InboxPage.vue'
import UserPage from "../views/UserPage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "Home", component: HomePage },
    { path: "/joinus", name: "Join", component: JoinPage },
    { path: "/profile", name: "Profile", component: ProfilePage },
    { path: "/inbox", name: "Inbox", component: InboxPage },
    { path: "/:username", name: "User", component: UserPage },
  ],
});
router.beforeEach(async (to, from) => {
  if (!localStorage.getItem("user") && to.name !== "Join" && to.name !== "Home" ) {
    return { name: "Join" };
  }
});
export default router;
