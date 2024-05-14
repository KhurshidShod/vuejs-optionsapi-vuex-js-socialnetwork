import { createStore } from "vuex";
import db from "../assets/firebase/init.js";
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { toast } from "vue3-toastify";
import router from "../routes/router.js";

export default createStore({
  state: {
    users: [],
    posts: [],
  },
  modules: {},
  mutations: {
    setUsers(state, usersData) {
      usersData.forEach((user) => state.users.push(user.data()));
    },
    setPosts(state, postsData) {
      postsData.forEach((post) => {
        state.posts.push({ ...post.data(), id: post.id });
      });
      console.log(state.posts)
    },
    likePost(state, postId) {
      state.posts = state.posts.map((post) => {
        if (post.id === postId) {
          post.likes.push(user.id);
        }
        return post;
      });
    },
    dislikePost(state, postId) {
      state.posts = state.posts.map((post) => {
        if (post.id === postId) {
          post.likes.splice(post.likes.indexOf(postId), 1);
        }
        return post;
      });
    },
  },
  actions: {
    async getUsers({ commit }) {
      const querySnapshot = await getDocs(collection(db, "users"));
      commit("setUsers", querySnapshot);
    },
    async getPosts({ commit }) {
      const querySnapshot = await getDocs(collection(db, "posts"));
      commit("setPosts", querySnapshot);
    },
    async createNewUser({ commit }, newUser) {
      console.log(newUser + '--------->asdasdasd')
      localStorage.setItem("user", JSON.stringify(newUser));
      const docRef = await addDoc(collection(db, "users"), newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      router.push("/");
    },
    async likePost({ commit, dispatch }, postId) {
      const updatingRef = doc(db, "posts", postId);
      if (
        this.state.posts
          .find((post) => post.id === postId)
          .likes.includes(user.id)
      ) {
        commit("dislikePost", postId);
        await updateDoc(updatingRef, {
          likes: arrayRemove(user.id),
        }).catch((err) => {
          console.log(err);
          commit("likePost", postId);
          toast("Sorry an error occurred. Try again", {
            theme: "dark",
            type: "error",
          });
        });
      } else {
        commit("likePost", postId);
        await updateDoc(updatingRef, {
          likes: arrayUnion(user.id),
        }).catch((err) => {
          console.log(err);
          commit("dislikePost", postId);
          toast("Sorry an error occurred. Try again", {
            theme: "dark",
            type: "error",
          });
        });
      }
    },
    async createNewPost({ commit }, newPost) {
      console.log(newPost + '--------->asdasdasd')
      const docRef = await addDoc(collection(db, "posts"), newPost);
    },
  },
});
