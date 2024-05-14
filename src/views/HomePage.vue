<template>
    <main>
        <div class="container">
            <Header />
            <section class="wrapper">
                <div class="posts">
                    <PostCard v-for="post in $store.state.posts" :post="post" :key="post.id" />
                </div>
                <div class="comments">
                    <p></p>
                </div>
            </section>
            <Teleport v-if="isCreateModalOpen" to="body">
                <CreatePost></CreatePost>
            </Teleport>
        </div>
    </main>
</template>

<script>
import db from "../assets/firebase/init.js";
import { addDoc, collection } from "firebase/firestore";
import { mapState } from 'vuex';
import Header from '../components/Sidebar.vue';
import PostCard from '../components/PostCard.vue'
import CreatePost from './../components/CreatePost.vue'
export default {
    created(){
        this.$eventBus.$on('createModalOpened', (data) => this.isCreateModalOpen = data)
    },
    data() {
        return {
            isCreateModalOpen: false
        }
    },
    components: {
        Header,
        PostCard,
        CreatePost
    },
    methods: {
        async addNewPost() {
            const docRef = await addDoc(collection(db, "posts"), {
                content: 'Salom bolalar nma gaplar ozi charchashlar yoqmi',
                likes: [],
                comments: [],
                images: 'https://firebasestorage.googleapis.com/v0/b/vue-social-media-601fa.appspot.com/o/Groovy%20Greens.jpeg?alt=media&token=9fefde0c-512e-4a23-b703-de121fe1df98',
                userId: 'tzyZOmmC2dE3IWC0B9zp'
            });
            console.log("Document written with ID: ", docRef);
        }
    },
    computed: {
        ...mapState([
            'posts'
        ]),
    }
}
</script>

<style lang="scss" scoped>
main {
    width: 100%;

    section {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: start;
        flex-direction: row;
        flex-wrap: nowrap;

        @media (max-width: 1180px) {
            justify-content: start;
        }

        .posts {
            width: calc(100% - 700px);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 1rem;
            padding-top: 2rem;
            padding-bottom: 2rem;
            flex-grow: 1;
            overflow: auto;

            @media (max-width: 1180px) {
                width: calc(100% - 425px);
                margin-left: 75px;
            }

            @media (max-width: 550px) {
                margin-left: 50px;
            }
        }

        .comments {
            display: none;
            position: fixed;
            top: 0;
            right: 0;
            width: 350px;
            height: 100%;
            border-left: 1px solid var(--bg-green);
        }
    }
}
</style>