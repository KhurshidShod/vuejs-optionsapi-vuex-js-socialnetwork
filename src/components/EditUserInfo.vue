<template>
    <div class="edit_user">
        <button class="close_form" @click="$emit('closeEditForm')">
            <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
        <form action="">
            <div>
                <label for="fullName">Full name</label>
                <input v-model="editedUser.fullName" type="text" name="fullName" id="fullName">
            </div>
            <div>
                <label for="phoneNumber">Phone number</label>
                <input v-model="editedUser.phoneNumber" type="text" name="phoneNumber" id="phoneNumber">
            </div>
            <div>
                <label for="email">Email</label>
                <input v-model="editedUser.email" type="email" name="email" id="email">
            </div>
            <div>
                <label for="username">Username</label>
                <input v-model="editedUser.username" type="text" name="username" id="username">
            </div>
            <div class="pass">
                <label for="confPass" class="red_text">Old password</label>
                <input v-model="oldPassword" :type="!confPassVisible ? 'password' : 'text'" name="" id="confPass">
                <span @click="confPassVisible = !confPassVisible">{{ !confPassVisible ? '🙈' : '🙉' }}</span>
            </div>
            <div class="pass">
                <label for="password" class="red_text">New password</label>
                <input v-model="editedUser.password" autocomplete="off" :type="!passVisible ? 'password' : 'text'"
                    name="password" id="password">
                <span @click="passVisible = !passVisible">{{ !passVisible ? '🙈' : '🙉' }}</span>
            </div>
            <button @click.prevent="submitEditForm">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
const emit = defineEmits(['closeEditForm'])

const store = useStore()

const { user } = defineProps(['user']);
const passVisible = ref(false)
const confPassVisible = ref(false)
const oldPassword = ref('')

const editedUser = reactive({
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    password: '',
    phoneNumber: user.phoneNumber
})
const submitEditForm = () => {
    if (editedUser.password !== '' && oldPassword.value !== user.password) {
        alert('Old password does not match')
    } else {
        store.dispatch('editUserData', editedUser.password === '' ? {
            fullName: editedUser.fullName,
            username: editedUser.username,
            phoneNumber: editedUser.phoneNumber,
            email: editedUser.email
        } : editedUser)
        emit('closeEditForm')
    }
}
</script>

<style lang="scss" scoped>
.edit_user {
    width: 100%;
    backdrop-filter: blur(5px);
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    button.close_form {
        position: fixed;
        top: 15px;
        right: 15px;
        color: white;
        font-size: 32px;
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
    }

    form {
        max-width: 750px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        background-color: var(--bg-main);
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 5px 6px #000, 0 24px 80px #007a6e8d;
        color: white;

        button {
            width: 100%;
            height: 45px;
            border-radius: 8px;
            cursor: pointer;
            background-color: var(--bg-green);
            color: white;
            font-weight: 700;
            font-size: 18px;
            border: none;
            outline: none;
        }

        div {
            position: relative;
            display: flex;
            justify-content: start;
            align-items: start;
            flex-direction: column;
            flex-grow: 1;
            gap: .5rem;

            span {
                position: absolute;
                width: 40px;
                height: 40px;
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
                min-width: 250px;
                height: 40px;
                background-color: transparent;
                border: 1px solid var(--border-main);
                color: white;
                border-radius: 7px;
                padding-left: 0.5rem;

                &:focus {
                    border-color: var(--bg-green);
                }

                &:focus+span {
                    border-color: var(--bg-green);
                }
            }
        }
    }

}
</style>