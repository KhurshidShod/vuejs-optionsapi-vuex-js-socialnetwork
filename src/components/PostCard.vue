<template>
    <div class="post">
        <div class="post__header">

        </div>
        <div class="post__image">
            <swiper :allow-touch-move="false" :auto-play="false" class="swiper" :modules="modules"
                :pagination="{ clickable: true }">
                <swiper-slide class="slide" v-for="image in post.images" :key="image">
                    <img width="100%" height="100%" :src="image" alt="">
                </swiper-slide>
            </swiper>
        </div>
        <div class="post__stats">
            <div class="post__stats_actions">
                <font-awesome-icon :class="{ likedPost: isLiked }" @click="likePost" icon="fa-solid fa-heart" />
                <font-awesome-icon @click="$emit('openFullCard', true)" icon="fa-solid fa-comment" />
                <font-awesome-icon icon="fa-solid fa-share" />
            </div>
            <div>
                <p>{{ post.likes.length }} likes</p>
            </div>
        </div>
        <div class="post__content">

            <div>
                <p><b>@{{ $store.state.users.find(usr => usr.id === post.userId).username }}</b> {{
                    (post.content.split(" ").length > 24 && noClampTextId !== post.id) ?
                        post.content.split("").slice(0, 27).join("") + ' ...' : post.content }} </p>
                <button @click="noClampTextId = post.id"
                    v-if="post.content.split(' ').length > 24 && noClampTextId === null">more</button>
                <button @click="noClampTextId = null" v-if="noClampTextId !== null">less</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import SwiperClass, { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { toast } from 'vue3-toastify';

export default {
    props: ['post'],
    components: {
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            noClampTextId: null,
            modules: [Pagination]
        }
    },
    computed: {
        ...mapState(['user']),
        isLiked() {
            return (localStorage.getItem('user') && this.post.likes.includes(this.user.id)) ? true : false;
        }
    },
    methods: {
        likePost() {
            if (this.user === null) {
                toast("You have to login first", {
                    type: 'warning',
                    theme: 'dark'
                })
            } else {
                this.$store.dispatch('likePost', this.post.id)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.post {
    width: 85%;
    min-width: 350px;
    max-width: 450px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-outset);
    color: white;

    @media (max-width: 500px) {
        min-width: 0;
        width: 100%;
    }

    &__image {
        width: 100%;
        max-height: 500px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        @media (max-width: 500px) {
            max-height: 300px;
        }

        .swiper {
            width: 100%;
            height: 300px !important;
        }

        image {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            object-position: center !important;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center;
        }
    }

    &__stats {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: .5rem;
        padding: 0.5rem;
        margin-top: 0.5rem;

        &_actions {
            svg {
                font-size: 22px;
                margin-right: 7px;
                color: white;
                cursor: pointer;

                &.likedPost {
                    color: red;
                }
            }
        }
    }

    &__content {
        padding: 0 0.5rem 0.5rem 0.5rem;

        div {
            display: flex;
            align-items: end;

            p {
                font-size: 14px;

                b {
                    font-size: 14px;
                    margin-right: .5rem;
                }
            }

            button {
                height: 17px;
                cursor: pointer;
                color: var(--dark-font);
                background-color: transparent;
                font-size: 14px;
                border: none;
                margin-left: 5px;
            }
        }
    }
}
</style>