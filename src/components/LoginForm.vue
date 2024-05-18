<template>
    <div class="container">
        <div class="login__wrapper">
            <h1>Login</h1>
            <form action="" @submit.prevent="handleLoginFunction">
                <div>
                    <label for="username">Username</label>
                    <input v-model="loginUserData.username" type="text" name="" id="username">
                </div>
                <div>
                    <label for="password">Password</label>
                    <input v-model="loginUserData.password" :type="!passVisible ? 'password' : 'text'" name="" id="password">
                    <span @click="passVisible = !passVisible">{{ !passVisible ? '🙈' : '🙉' }}</span>
                </div>
                <button>Login</button>
            </form>
            <p>Don't have an account? <span @click="$emit('checkUserStatus', false)">Register now</span></p>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapActions, mapMutations, mapState } from 'vuex/dist/vuex.cjs.js';
export default {
    data() {
        return {
            passVisible: false,
            loginUserData: {
                username: '',
                password: ''
            },
        }
    },
    computed: {
        ...mapState([
            'users',
        ])
    },
    methods: {
        ...mapMutations(['loginUser']),
        handleLoginFunction() {
            const loggingUser = this.users.find(user => user.username === this.loginUserData.username)
            if (loggingUser) {
                if (loggingUser.password === this.loginUserData.password) {
                    localStorage.setItem("user", JSON.stringify(loggingUser))
                    this.$router.push('/')
                    toast('Logged in successfully', {
                        autoClose: 1000,
                        theme: "dark",
                        type: "success",
                    })
                    this.loginUser(loggingUser)
                } else {
                    toast('Password is incorrect', {
                        autoClose: 1000,
                        theme: "dark",
                        type: "error",
                    })
                    this.loggingUser.username = ""
                    this.loggingUser.password = ""
                }
            } else {
                toast('No such user found', {
                    autoClose: 1000,
                    theme: "dark",
                    type: "error",
                })
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.login__wrapper {
    width: 550px;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: var(--shadow-inset);
    color: white;
    margin: 0 auto;
    margin-top: calc(100vh / 2 - 200px);

    @media (max-width: 600px) {
        width: 100%;
    }

    h1 {
        margin-bottom: 1rem;
        font-size: 54px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 5px;
        color: var(--bg-green);
    }

    form {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 2rem;

        div {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: start;
            align-items: start;
            flex-direction: column;

            span {
                position: absolute;
                width: 40px;
                height: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
                right: 0;
                bottom: 0;
                cursor: pointer;
                background-color: var(--bg-main);
                border-top: 1px solid var(--border-main);
                border-bottom: 1px solid var(--border-main);
                border-right: 1px solid var(--border-main);
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            input {
                width: 100%;
                height: 45px;
                border-radius: 8px;
                border: 1px solid var(--border-main);
                background-color: transparent;
                color: var(--bg-green);
                margin-top: 0.5rem;
                padding-left: .75rem;
                font-size: 18px;

                &:focus {
                    border-color: var(--bg-green);
                }

                &:focus+span {
                    border-color: var(--bg-green);
                }
            }
        }

        button {
            width: 100%;
            height: 45px;
            border-radius: 8px;
            border: 1px solid var(--border-main);
            background-color: transparent;
            font-size: 20px;
            color: var(--dark-font);
            cursor: pointer;
            font-weight: 700;
            letter-spacing: 2px;

            &:hover {
                background-color: var(--bg-green);
                color: white;
                border-color: var(--bg-green);
                transition: .1s linear;
            }
        }
    }

    p {
        margin-top: 0.5rem;

        span {
            color: var(--bg-green);
            text-decoration: none;
            cursor: pointer;
        }
    }
}
</style>