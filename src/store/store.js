import { createStore } from "vuex";
import db from "../assets/firebase/init.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDoc
} from "firebase/firestore";
import { toast } from "vue3-toastify";
import router from "../routes/router.js";

export default createStore({
  state: {
    users: [],
    posts: [],
    messages: [],
    user: null,
    createPostLoading: false,
  },
  mutations: {
    setUsers(state, usersData) {
      const loggedInUser = localStorage.getItem("user");
      usersData.forEach((user) => {
        state.users.push(user.data());
      });
      if (loggedInUser) {
        usersData.forEach((user) => {
          if (user.data().id === JSON.parse(loggedInUser).id) {
            state.user = user.data();
          }
        });
      }
    },
    changeLoadingState(state, loading) {
      state.createPostLoading = loading;
    },
    setPosts(state, postsData) {
      postsData.forEach((post) => {
        state.posts.push({ ...post.data() });
      });
    },
    setMessages(state, messagesData) {
      state.messages = [];
      messagesData.forEach((msg) => {
        state.messages.push({ ...msg.data() });
      });
    },
    likePost(state, postId) {
      state.posts = state.posts.map((post) => {
        if (post.id === postId) {
          post.likes.push(state.user.id);
        }
        return post;
      });
    },
    createNewPost(state, newPost) {
      state.posts = [...state.posts, newPost];
    },
    dislikePost(state, postId) {
      state.posts = state.posts.map((post) => {
        if (post.id === postId) {
          post.likes.splice(post.likes.indexOf(postId), 1);
        }
        return post;
      });
    },
    createNewUser(state, newUser) {
      state.user = newUser;
      state.users = [...state.users, newUser];
    },
    loginUser(state, user) {
      state.user = user;
    },
    addMessage(state, newMsg) {
      state.messages.push(newMsg);
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
    async getMessages({ commit }) {
      const querySnapshot = await getDocs(collection(db, "messages"));
      commit("setMessages", querySnapshot);
    },
    async createNewUser({ commit }, newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      const docRef = await addDoc(collection(db, "users"), newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      router.push("/");
      commit("createNewUser", newUser);
    },
    async likePost({ commit }, postId) {
      const updatingRef = doc(db, "posts", postId);
      if (
        this.state.posts
          .find((post) => post.id === postId)
          .likes.includes(this.state.user.id)
      ) {
        commit("dislikePost", postId);
        await updateDoc(updatingRef, {
          likes: arrayRemove(this.state.user.id),
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
          likes: arrayUnion(this.state.user.id),
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
      const docRef = await setDoc(doc(db, "posts", newPost.id), newPost);
      commit("createNewPost", newPost);
    },
    async createNewComment({ commit }, postData) {
      const updatingRef = doc(db, "posts", postData.postId);
      await updateDoc(updatingRef, {
        comments: arrayUnion({
          text: postData.newComment,
          userId: this.state.user.id,
        }),
      });
    },
    async sendMessage({ commit }, data) {
      console.log(data);
      if (!this.state.messages.find((msg) => msg.id === data.chat.id)) {
        const newChat = {
          ...data.chat,
          messageContents: [data.newMessage],
        };
        this.state.messages.push(newChat)
        const docRef = await setDoc(doc(db, "messages", data.chat.id), newChat);
      } else {
        var changingData = null;
        const updatingRef = doc(db, "messages", data.chat.id);
        const docRef = doc(db, "messages", data.chat.id);
        const docSnap = await getDoc(docRef);
        changingData = [...docSnap.data().messageContents, data.newMessage];
        console.log(changingData);
        await updateDoc(updatingRef, {
          messageContents: changingData,
        });
      }
    },
  },
  getters: {
    getUserChats(state) {
      return state.messages.filter((msg) =>
        msg.chatters.includes(state.user.id)
      );
    },
  },
});
