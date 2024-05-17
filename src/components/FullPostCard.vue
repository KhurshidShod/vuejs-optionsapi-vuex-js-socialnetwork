<template>
    <div class="fullPost">
        <button @click="$emit('closeFullPost')" class="closeFullPost"><font-awesome-icon
                icon="fa-solid fa-xmark" /></button>
        <div class="fullPost__wrapper">
            <div class="fullPost__wrapper_image">
                <swiper :allow-touch-move="false" :auto-play="false" class="swiper" :modules="modules"
                    :pagination="{ clickable: true }">
                    <swiper-slide class="slide" v-for="image in post.images" :key="image">
                        <img width="100%" height="100%" :src="image" alt="">
                    </swiper-slide>
                </swiper>
            </div>
            <div class="fullPost__wrapper_comments">
                <div class="fullPost__wrapper_comments_top">
                    <img :src="user?.image" width="35px" height="35px" alt="">
                    <b>{{ user.username }}</b>
                </div>
                <div class="fullPost__wrapper_comments_user">
                    <img :src="user.image" width="35px" height="35px" alt="">
                    <p><b>{{ user.username }}</b> {{ post.content }}</p>
                </div>
                <div class="fullPost__wrapper_comments_all">
                    <div class="comment" v-for="comment in post.comments" :key="comment.text">
                        <img width="35px" height="35px" :src="getCommentUser(comment.userId).image" alt="">
                        <div>
                            <b>{{ getCommentUser(comment.userId).username }}</b>
                            <p>{{ comment.text }}</p>
                        </div>
                    </div>
                </div>
                <div class="send_comment">
                    <input v-model="comment" type="text" placeholder="Add a comment..." name="" id="">
                    <button @click="postNewComment(post.id)">Post</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { mapActions, mapState } from 'vuex/dist/vuex.cjs.js';
import { toast } from 'vue3-toastify';
export default {
    created(){
        this.$eventBus.$on("newCommentCreated", (data) => {
            this.post.comments.push(data.comment)
        })
    },
    props: ['post'],
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            modules: [Pagination],
            comment: ''
        }
    },
    computed: {
        ...mapState(['users']),
        user() {
            return this.users.find(usr => usr.id === this.post.userId)
        }
    },
    methods: {
        ...mapActions(['createNewComment']),
        getCommentUser(commentId) {
            return this.users.find(usr => usr.id === commentId)
        },
        postNewComment(postId) {
            const newComment = this.comment;
            console.log(postId)
            console.log(this.comment)
            if (this.comment.trim() !== "") {
                this.$store.dispatch('createNewComment', { postId, newComment });
                this.$eventBus.$emit('newCommentCreated', {
                    postId,
                    comment: {
                        text: newComment,
                        userId: this.user.id
                    }
                })
                this.comment = ""
            } else {
                toast('Please enter some text', {
                    type: 'warning',
                    theme: 'dark'
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.fullPost {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    backdrop-filter: brightness(50%);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;

    .closeFullPost {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: transparent;
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;

        @media (max-width: 450px) {
            top: 5px;
            right: 5px;
        }
    }

    &__wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 75%;
        height: 90%;
        background-color: var(--bg-main);
        border-radius: 15px;
        overflow: hidden;

        @media (max-width: 450px) {
            width: 95%;
        }

        @media (max-width: 1000px) {
            flex-direction: column;
        }

        &_image {
            width: 55%;
            height: 100%;
            flex-grow: 1;
            min-height: 350px;

            @media (max-width: 1000px) {
                width: 100%;
            }

            .swiper {
                width: 100%;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }

        &_comments {
            position: relative;
            width: 50%;
            height: 100%;
            flex-grow: 1;
            background-color: red;
            overflow: auto;
            @media (max-width: 1000px) {
                width: 100%;
            }

            &_top {
                width: 100%;
                display: flex;
                justify-content: start;
                align-items: center;
                gap: 10px;
                color: white;
                border-bottom: 1px solid var(--border-main);
                padding: 1rem;

                b {
                    font-weight: 900;
                }

                img {
                    border-radius: 50%;
                }
            }

            &_user {
                width: 100%;
                display: flex;
                justify-content: start;
                align-items: center;
                padding: 1rem;
                gap: 15px;
                color: white;
                font-size: 14px;

                img {
                    border-radius: 50%;
                }
            }

            &_all {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: start;
                align-items: start;
                flex-direction: column;
                padding: 1rem;
                padding-top: 0;
                gap: 10px;
                margin-bottom: 30px;

                .comment {
                    width: 100%;
                    color: white;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    gap: 5px;

                    img {
                        border-radius: 50%;
                        margin-right: 10px;
                    }

                    div {
                        display: flex;
                        justify-content: start;
                        align-items: center;
                        gap: 5px;

                        @media (max-width: 750px) {
                            flex-direction: column;
                            align-items: start;
                            gap: 5px;
                        }


                        b {
                            font-size: 14px;
                        }
                    }

                    p {
                        font-size: 14px;
                    }
                }
            }

            .send_comment {
                position: sticky;
                bottom: 0;
                left: 0;
                width: 100%;
                display: flex;
                bottom: 0;
                left: 0;
                height: 40px;
                border-top: 1px solid var(--border-main);
                background-color: var(--bg-main);

                input {
                    flex-grow: 1;
                    background-color: transparent;
                    border: none;
                    color: white;
                    padding-left: 1rem;
                }

                button {
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    background-color: transparent;
                    color: var(--dark-font);
                    border: none;
                    padding-inline: 10px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 100%;
                    background-color: var(--bg-main);
                }
            }
        }
    }
}
</style>