<template>
    <header :class="{ navOpen: isNavbarOpened }">
        <nav class="nav">
            <div class="nav__wrapper">
                <font-awesome-icon @click="isNavbarOpened = !isNavbarOpened" icon="fa-solid fa-bars-staggered " />
            </div>
            <div class="nav__logo">
                <h1>Connectopia</h1>
            </div>
            <div class="nav__menu">
                <ul>
                    <li>
                        <router-link to="/">
                            <font-awesome-icon icon="fa-solid fa-house " /> Home
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/inbox">
                            <font-awesome-icon icon="fa-solid fa-message " /> Messages
                        </router-link>
                    </li>
                    <li>
                        <p><font-awesome-icon icon="fa-solid fa-circle-plus " /> Create</p>
                    </li>
                    <li v-if="isUser">
                        <router-link to="/profile">
                            <img style="
                                width: 25px;
                                height: 25px;
                                border-radius: 50%;
                            " :src="user.image" alt=""> Profile
                        </router-link>
                    </li>
                    <li class="join_us" v-else>
                        <router-link to="/joinus" class="join_us_btn">
                            Join us
                            <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="nav__search">
                <label for="">
                    <span>
                        <font-awesome-icon icon="fa-solid fa-search" />
                    </span>
                    <input v-model="searchText" type="text" placeholder="Let's find some friends 👀" name="" id="">
                </label>
                <ul v-if="searchResultUsers" class="search_results">
                    <li v-for="user in searchResultUsers" :key="user.id">
                        {{ user.fullName }}
                    </li>
                    <li class="no__user" v-if="searchResultUsers.length === 0">Sorry, your friend not found 😔</li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            isUser: localStorage.getItem("user") || false,
            searchText: '',
            isNavbarOpened: false,
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
        }
    },
    computed: {
        ...mapState([
            'users'
        ]),
        searchResultUsers() {
            if (this.searchText.trim() !== '') {
                return this.users.filter(user => user.fullName.toLowerCase().includes(this.searchText.toLowerCase()))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 350px;
    height: 100%;
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    background-color: var(--bg-main);
    border-right: 1px solid var(--bg-green);
    z-index: 9;

    @media (max-width: 550px) {
        padding: 0.5rem;
    }

    @media (max-width: 1180px) {
        width: 75px;

        &.navOpen {
            width: 350px;

            .nav {
                &__wrapper {
                    justify-content: start;
                }

                &__menu {
                    ul {
                        li {
                            &::before {
                                display: flex;
                            }

                            a,
                            p {
                                visibility: visible;
                            }
                        }
                    }
                }

                &__search {
                    display: flex;
                }
            }
        }
    }

    @media (max-width: 550px) {
        width: 50px;
    }

    .nav {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: start;
        flex-direction: column;

        &__wrapper {
            display: none;

            @media (max-width: 1180px) {
                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;

                @media (max-width: 550px) {
                    margin-top: 1.2rem;
                }

                svg {
                    font-size: 32px;
                    color: white;
                    cursor: pointer;
                }
            }
        }

        &__logo {
            display: flex;
            justify-content: start;
            align-items: center;
            gap: 2rem;
            flex-grow: .35;
            flex-direction: column;

            @media (max-width: 1180px) {
                display: none;
            }

            h1 {
                font-family: 'Billabong';
                font-size: 48px;
                color: white;
                cursor: pointer;

                &:hover {
                    color: var(--bg-green);
                    transition: .1s linear !important;
                }
            }
        }

        &__menu {
            width: 100%;
            display: flex;
            justify-content: start;
            align-items: start;
            margin-top: 3rem;

            ul {
                width: 100%;

                li {
                    position: relative;
                    width: 100%;
                    height: 50px;
                    margin-top: 5px;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    cursor: pointer;

                    &::before {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 0%;
                        height: 2px;
                        border-radius: 50px;
                        background-color: var(--bg-green);
                        transition: .3s linear;

                        @media (max-width: 1180px) {
                            display: none;
                        }
                    }

                    &:hover::before {
                        width: 100%;
                    }

                    &.join_us {
                        margin-top: 1rem;

                        &::before {
                            display: none;
                        }

                        a.join_us_btn {
                            width: 100%;
                            height: 50px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-color: transparent;
                            border: none;
                            border-radius: 5px;
                            color: var(--bg-green);
                            font-size: 22px;
                            cursor: pointer;
                            box-shadow: var(--shadow-outset);
                            font-weight: 900;
                            letter-spacing: 2px;

                            &:hover {
                                color: var(--bg-green);
                                box-shadow: var(--shadow-inset);
                            }
                        }
                    }

                    a,
                    p {
                        font-size: 22px;
                        font-weight: 600;
                        color: white;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        @media (max-width: 1180px) {
                            visibility: hidden;
                        }

                        img {
                            margin-right: 1rem;

                            @media (max-width: 550px) {
                                margin-left: 0;
                            }

                            @media (max-width: 1180px) {
                                visibility: visible !important;
                            }
                        }

                        svg {
                            margin-right: 1rem;
                            font-size: 26px;

                            @media (max-width: 550px) {
                                margin-left: 0;
                            }

                            @media (max-width: 1180px) {
                                visibility: visible !important;
                            }
                        }
                    }
                }
            }
        }

        &__search {
            width: 100%;
            position: relative;
            margin-top: 2rem;

            @media (max-width: 1180px) {
                display: none;
            }

            .search_results {
                position: absolute;
                top: 50px;
                width: 100%;
                max-height: 350px;
                overflow: auto;
                border-bottom: 1px solid var(--bg-green);

                li {
                    border-radius: 8px;
                    height: 45px;
                    box-shadow: var(--shadow-inset);
                    margin-block: 10px;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    padding-left: 0.5rem;
                    color: white;
                    cursor: pointer;

                    &.no__user {
                        box-shadow: none;
                    }
                }
            }

            label {
                position: relative;
                width: 100%;
                height: 45px;

                span {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 20px;
                    color: white;
                    cursor: pointer;
                }

                input {
                    width: 100%;
                    border: none;
                    background-color: transparent;
                    box-shadow: var(--shadow-outset);
                    border-radius: 8px;
                    padding-left: 1rem;
                    height: 45px;
                    color: var(--bg-green);
                    font-size: 18px;

                    &:focus {
                        box-shadow: var(--shadow-inset);
                    }
                }
            }
        }
    }
}
</style>