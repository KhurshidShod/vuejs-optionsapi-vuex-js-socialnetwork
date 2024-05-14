<template>
    <div class="container">
        <div class="register__wrapper">
            <h1>Register</h1>
            <form action="" @submit.prevent="handleRegisterFunction">
                <div>
                    <label for="fullName">Full Name</label>
                    <input v-model="newUser.fullName" type="text" name="fullName" id="fullName">
                </div>
                <div>
                    <label for="phoneNumber">Phone number</label>
                    <input v-model="newUser.phoneNumber" type="text" name="phoneNumber" id="phoneNumber">
                </div>
                <div>
                    <label for="email">Email</label>
                    <input v-model="newUser.email" type="email" name="email" id="email">
                </div>
                <div>
                    <label for="username">Username</label>
                    <input v-model="newUser.username" type="text" name="username" id="username">
                </div>
                <div class="pass">
                    <label for="password">Password</label>
                    <input v-model="newUser.password" autocomplete="off" :type="!passVisible ? 'password' : 'text'"
                        name="password" id="password">
                    <span @click="passVisible = !passVisible">{{ !passVisible ? '🙈' : '🙉' }}</span>
                </div>
                <div class="pass">
                    <label for="confPass">Confirm password</label>
                    <input v-model="confirmPassword" :type="!confPassVisible ? 'password' : 'text'" name="" id="confPass">
                    <span @click="confPassVisible = !confPassVisible">{{ !confPassVisible ? '🙈' : '🙉' }}</span>
                </div>
                <div class="file__upload"
                    :class="[(activeDropZone ? 'activeDropZone' : imageFile ? 'activeDropZone' : null)]"
                    @dragenter.prevent="toggleActiveDropzone" @dragleave.prevent="toggleActiveDropzone"
                    @dragover.prevent @drop.prevent="dropFile">
                    <p v-if="!activeDropZone && imageFile === null">
                        Drag & Drop image here or <span @click="onClickSelect">Choose</span>
                    </p>
                    <p v-else-if="imageFile">{{ imageFile.name }}</p>
                    <p v-else class="activeText">Drop image here</p>
                    <input @change="selectFile" ref="fileInput" type="file" name="file" id="">
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already joined? <span @click="$emit('checkUserStatus', true)">Enter now</span></p>
        </div>
    </div>
</template>

<script>
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'vue3-toastify';
import { mapActions } from 'vuex';
import { mapState } from 'vuex/dist/vuex.cjs.js';
export default {
    data() {
        return {
            newUser: {
                id: Date.now().toString(),
                fullName: '',
                email: '',
                username: '',
                phoneNumber: '',
                password: '',
                image: ''
            },
            confirmPassword: '',
            activeDropZone: false,
            passVisible: false,
            confPassVisible: false,
            imageFile: null
        }
    },
    computed: {
        ...mapState(['users'])
    },
    methods: {
        ...mapActions([
            'createNewUser'
        ]),
        async handleRegisterFunction() {
            console.log(this.posts)
            const existEmail = this.users.find(post => post.email === this.newUser.email);
            const existUsername = this.users.find(post => post.username === this.newUser.username);
            const existPassword = this.users.find(post => post.password === this.newUser.password);
            const existPhoneNumber = this.users.find(post => post.phoneNumber === this.newUser.phoneNumber);
            console.log(existEmail, existPassword, existUsername)
            if (
                this.newUser.fullName.trim() === ''
                || this.newUser.username.trim() === ''
                || this.newUser.phoneNumber.trim() === ''
                || this.newUser.password.trim() === ''
                || this.newUser.email.trim() === ''
                || this.imageFile === null
            ) {
                toast("Please, fill all the fields!", {
                    autoClose: 1000,
                    theme: "dark",
                    type: "warning",
                });
                return;
            } else if (this.newUser.password !== this.confirmPassword) {
                toast("Password and confirmation don't match", {
                    autoClose: 1000,
                    theme: "dark",
                    type: "warning",
                });
                return;
            } else if (existEmail !== undefined) {
                toast("This email is already in use", {
                    autoClose: 1000,
                    theme: "dark",
                    type: "warning",
                });
                return;
            } else if (existPassword !== undefined) {
                toast("This password is not available", {
                    autoClose: 1000,
                    theme: "dark",
                    type: "warning",
                });
                return;
            } else if (existUsername !== undefined) {
                toast("This username is not available", {
                    autoClose: 1000,
                    theme: "dark",
                    type: "warning",
                });
                return;
            } else if (existPhoneNumber !== undefined) {
                toast("This phone number is already in use", {
                    autoClose: 1000,
                    theme: "dark",
                    type: "warning",
                });
                return;
            } else {
                const storage = getStorage();
                const storageRef = ref(storage, this.imageFile.name);
                await uploadBytes(storageRef, this.imageFile).then(snapshot => console.log(snapshot))
                await getDownloadURL(ref(storage, this.imageFile.name)).then(res => this.newUser.image = res)
                console.log(this.newUser.image)
                this.createNewUser(this.newUser)
                toast("You have been registered successfully", {
                    autoClose: 1000,
                    theme: "dark",
                    type: "success",
                });

            }

        },
        onFileSelect(event) {
            const files = event.target.files;
            if (files.lenght === 0) return;

        },
        toggleActiveDropzone() {
            this.activeDropZone = !this.activeDropZone
        },
        dropFile(event) {
            if (event.dataTransfer.files[0].type.split('/')[0] !== 'image') {
                toast("Only jpg, jpeg, png types are allowed", {
                    type: 'error',
                    theme: 'dark'
                })
                this.toggleActiveDropzone()
                return;
            } else {
                this.imageFile = event.dataTransfer.files[0];
            }
        },
        onClickSelect() {
            this.$refs.fileInput.click()
        },
        selectFile(event) {
            this.imageFile = event.target.files[0]
        }
    }
}
</script>

<style lang="scss" scoped>
.register__wrapper {
    width: 750px;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: var(--shadow-inset);
    color: white;
    margin: 0 auto;
    margin-top: calc(100vh / 2 - 300px);

    @media (max-width: 800px) {
        width: 100%;
    }

    @media (max-width: 487px) {
        margin-top: 0px;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    h1 {
        margin-bottom: 1rem;
        font-size: 54px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 5px;
        color: var(--bg-green);

        @media (max-width: 500px) {
            font-size: 46px;
        }

        @media (max-width: 400px) {
            font-size: 38px;
        }

        @media (max-width: 350px) {
            font-size: 32px;
        }
    }

    form {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 1rem;
        flex-wrap: wrap;

        div {
            position: relative;
            min-width: 200px;
            width: calc(100% / 2 - 1rem);
            display: flex;
            justify-content: start;
            align-items: start;
            flex-direction: column;
            flex-grow: 1;

            &.file__upload {
                width: 100%;
                height: 150px;
                border-radius: 15px;
                border: 1px dashed var(--border-main);
                display: flex;
                justify-content: center;
                align-items: center;

                &.activeDropZone {
                    border-color: var(--bg-green);
                }

                p {
                    width: auto;
                    height: auto;
                    border: none;
                    position: relative;

                    &.activeText {
                        color: var(--bg-green);
                    }

                    span {
                        position: relative;
                        border: none;
                        width: auto;
                        height: auto;
                        display: inline;
                        cursor: pointer;
                    }
                }

                input {
                    display: none;
                }
            }

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