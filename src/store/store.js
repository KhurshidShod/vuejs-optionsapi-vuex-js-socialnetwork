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
  getDoc,
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
  modules: {},
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
      // console.log(data.userId)
      // console.log(this.state.user.id)
      var changingData = null;
      // var changingData2 = null;
      const updatingRef = doc(db, "messages", data.chatId);
      // const updatingRef2 = doc(db, "users", data.userId);
      const docRef = doc(db, "messages", data.chatId);
      // const docRef2 = doc(db, "users", data.userId);
      const docSnap = await getDoc(docRef);
      // const docSnap2 = await getDoc(docRef2);
      console.log(docSnap.data());
      changingData = [...docSnap.data().messageContents, data.newMessage];
      console.log(changingData);
      // console.log(docSnap.data())
      // if (docSnap2.data().messages) {
      //   changingData2 = docSnap2.data().messages.map((msg) => {
      //     if (msg.userId === this.state.user.id) {
      //       msg.messageContents = msg.messageContents.concat(data.newMessage);
      //     }
      //     return msg;
      //   });
      // } else {
      //   changingData = [data.newMessage]
      // }
      await updateDoc(updatingRef, {
        messageContents: changingData,
      });
      // await updateDoc(updatingRef2, {
      //   messages: changingData2,
      // });
    },
  },
});
