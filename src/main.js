import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import $eventBus from "./Events.js";
import {
  faHome,
  faShare,
  faMessage,
  faCirclePlus,
  faUser,
  faBarsStaggered,
  faHeart,
  faComment,
  faSearch,
  faRightToBracket,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import store from "./store/store.js";
import router from "./routes/router.js";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);

library.add(
  faHeart,
  faComment,
  faShare,
  faHome,
  faMessage,
  faCirclePlus,
  faRightToBracket,
  faUser,
  faBarsStaggered,
  faSearch,
  faXmark
);
app.config.globalProperties.$eventBus = $eventBus;
app
  .use(Vue3Toastify)
  .use(store)
  .use(router)
  .provide("$eventBus", $eventBus)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
