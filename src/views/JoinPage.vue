<template>
    <div>
        <LoginForm v-if="notRegisteredYet" @check-user-status="handleCheckUserStatus"></LoginForm>
        <RegisterForm v-else @check-user-status="handleCheckUserStatus"></RegisterForm>
    </div>
</template>

<script>
import LoginForm from './../components/LoginForm.vue'
import RegisterForm from './../components/RegisterForm.vue'
export default {
    data() {
        return {
            notRegisteredYet: false,
        }
    },
    components: { LoginForm, RegisterForm },
    methods: {
        handleCheckUserStatus(stat) {
            this.notRegisteredYet = stat;
            console.log(stat)
        }
    }
}
</script>

<style lang="scss" scoped></style>