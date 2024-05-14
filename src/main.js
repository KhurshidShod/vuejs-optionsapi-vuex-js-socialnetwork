import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faShare,
  faMessage,
  faCirclePlus,
  faUser,
  faBarsStaggered,
  faHeart,
  faComment,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import store from "./store/store";
import router from "./routes/router.js";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

library.add(
  faHeart,
  faComment,
  faShare,
  faHome,
  faMessage,
  faCirclePlus,
  faUser,
  faBarsStaggered,
  faSearch
);

createApp(App)
  .use(Vue3Toastify)
  .use(store)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
