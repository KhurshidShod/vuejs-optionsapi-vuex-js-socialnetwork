<template>
    <div class="post">
        <div class="post__header">
            
        </div>
        <div class="post__image">
            <img :src="post.images" alt="">
        </div>
        <div class="post__stats">
            <div class="post__stats_actions">
                <font-awesome-icon :class="{ likedPost: isLiked }" @click="$store.dispatch('likePost', post.id)"
                    icon="fa-solid fa-heart" />
                <font-awesome-icon icon="fa-solid fa-comment" />
                <font-awesome-icon icon="fa-solid fa-share" />
            </div>
            <div>
                <p>{{ post.likes.length }} likes</p>
            </div>
        </div>
        <div class="post__content">
            <b>@{{ $store.state.users.find(usr => usr.id === post.userId).username }}</b>
            <div>
                <p>{{ (post.content.split(" ").length > 24 && noClampTextId !== post.id) ?
                    post.content.split("").slice(0, 27).join(" ") + '...' : post.content }} </p>
                <button @click="noClampTextId = post.id"
                    v-if="post.content.split(' ').length > 24 && noClampTextId === null">more</button>
                <button @click="noClampTextId = null" v-if="noClampTextId !== null">less</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';

export default {
    props: ['post'],
    data() {
        return {
            noClampTextId: null,
        }
    },
    computed: {
        isLiked() {
            return (localStorage.getItem('user') && this.post.likes.includes(JSON.parse(localStorage.getItem('user')).id)) ? true : false;
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

        image {
            width: 100%;
            object-fit: cover;
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
        padding: 0.5rem;

        b {
            font-size: 14px;
        }

        div {
            display: flex;
            align-items: end;

            p {
                font-size: 14px;
                margin-top: 0.5rem;
            }

            button {
                height: 17px;
                cursor: pointer;
                color: var(--dark-font);
                background-color: transparent;
                font-size: 14px;
                border: none;
            }
        }
    }
}
</style>