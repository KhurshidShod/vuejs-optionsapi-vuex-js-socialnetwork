<template>
    <main>
        <div class="container">
            <Header />
            <section>
                <div class="profile">
                    <div class="profile__top">
                        <div class="profile__top_image">
                            <img :src="user.image" alt="">
                        </div>
                        <div class="profile__top_datas_name">
                            <h2><b>{{ user.username }}</b></h2>
                            <button>Edit profile</button>
                        </div>
                        <div class="profile__top_datas_info">
                            <p>
                                <b>{{ posts.filter(post => post.userId === user.id).length }}</b>
                                posts
                            </p>
                            <p>
                                <b>145</b>
                                followers
                            </p>
                            <p>
                                <b>205</b>
                                followings
                            </p>
                        </div>
                        <div class="profile__top_datas_bio">
                            <i>{{ user.fullName }}</i>
                            <p>{{ user.phoneNumber }}</p>
                            <p>Lorem ipsum dolor sit amet.</p>
                            <button @click="handleLogout">Log out</button>

                        </div>
                    </div>
                    <div class="profile__posts" v-if="posts.filter(post => post.userId === user.id).length > 0">
                        <div :style="{
                            'background-image': 'url(' + post.images[0] + ')'
                        }" v-for="post in posts.filter(post => post.userId === user.id)" :key="post.id"
                            class="profile__posts_post">
                            <div class="profile__posts_post_hover">
                                <span>
                                    <font-awesome-icon icon="fa-solid fa-heart" />
                                    {{ post.likes.length }}
                                </span>
                                <span>
                                    <font-awesome-icon icon="fa-solid fa-comment" />
                                    {{ post.comments.length }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="profile__posts">
                        <h1 style="color: white">No posts yet</h1>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<script>
import { mapState } from 'vuex';
import Header from '../components/Sidebar.vue'
export default {
    components: {
        Header
    },
    computed: {
        ...mapState(['posts', 'user'])
    },
    data() {
        return {
        }
    },
    methods: {
        handleLogout() {
            localStorage.removeItem("user");
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss" scoped>
main {
    width: 100%;

    section {
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: end;
        flex-direction: row;
        flex-wrap: nowrap;

        .profile {
            width: calc(100% - 350px);
            display: flex;
            justify-content: start;
            align-items: start;
            flex-direction: column;
            gap: .5rem;
            padding-top: 2rem;
            padding-bottom: 2rem;

            @media (max-width: 1180px) {
                width: calc(100% - 75px);
            }

            @media (max-width: 550px) {
                width: calc(100% - 50px);
            }

            &__top {
                width: 100%;
                display: grid;
                grid-template-areas:
                    'image name name name name name name'
                    'image infos infos infos infos infos infos'
                    'image bio bio bio bio bio bio';
                gap: 10px;
                color: white;
                padding-left: 3rem;

                @media (max-width: 650px) {
                    display: flex;
                    justify-content: start;
                    align-items: start;
                    flex-direction: column;
                    padding-left: 1rem;
                }

                &_image {
                    grid-area: image;
                    width: 175px;
                    height: 175px;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    @media (max-width: 650px) {
                        width: 100%;
                        height: 200px;
                        overflow: visible;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;

                        @media (max-width: 650px) {
                            width: 200px;
                            height: 200px;
                            border-radius: 50%;
                        }
                    }
                }

                &_datas_name {
                    grid-area: name;
                    display: flex;
                    gap: 1rem;
                    width: 100%;

                    @media (max-width: 650px) {
                        justify-content: space-between;
                    }

                    button {
                        height: 30px;
                        background-color: var(--border-main);
                        border-radius: 5px;
                        border: none;
                        padding-inline: 5px;
                        cursor: pointer;
                        color: white;
                    }
                }

                &_datas_info {
                    grid-area: infos;
                    display: flex;
                    gap: 0.75rem;
                    width: 100%;

                    p {
                        @media (max-width: 650px) {
                            text-align: center;
                        }
                    }
                }

                &_datas_bio {
                    grid-area: bio;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    width: 100%;

                    button {
                        width: 100%;
                        max-width: 300px;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        font-size: 18px;
                        font-weight: 600;
                        color: white;
                        background-color: rgba(255, 0, 0, 0.74);
                        cursor: pointer;

                        @media (max-width: 650px) {
                            max-width: none;
                        }

                        &:hover {
                            background-color: rgba(255, 0, 0, .65);
                        }
                    }
                }
            }

            &__posts {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 1rem;
                margin-top: 5rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border-main);

                &_post {
                    position: relative;
                    width: 300px;
                    height: 300px;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    cursor: pointer;

                    &:hover {
                        .profile__posts_post_hover {
                            display: flex !important;
                        }
                    }

                    &_hover {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        backdrop-filter: brightness(50%);
                        display: none;
                        justify-content: center;
                        align-items: center;
                        gap: 2rem;

                        span {
                            color: white;
                            font-size: 20px;
                            font-weight: 500;
                        }
                    }
                }
            }
        }
    }
}
</style>