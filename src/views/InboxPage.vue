<template>
    <div class="wrapper">
        <form v-if="!isJoined" action="" @submit.prevent="join">
            <input type="text" name="" id="" v-model="currentUser">
            <button>Join</button>
        </form>
        <div v-if="isJoined">
            <div v-for="message in messages" :key="message.id">
                <b>
                    {{ message.user }}:
                </b>
                {{ message.text }}
            </div>
        </div>
        <div v-if="isJoined">
            <textarea name="" id="" v-model="text">

                </textarea>
                <button @click="sendMessage">send</button>
        </div>
    </div>
</template>

<script>
import { text } from '@fortawesome/fontawesome-svg-core';
import { io } from 'socket.io-client';
export default {
    data() {
        return {
            isJoined: false,
            messages: [
                {
                    id: 1,
                    user: 'xrwd____',
                    text: 'Salom'
                }
            ],
            text: '',
            currentUser: ''
        }
    },
    methods: {
        join() {
            this.isJoined = true
            this.socketInstance = io('http://localhost:3000')
            console.log(this.currentUser)
            this.socketInstance.emit('join-room', this.currentUser)
            this.socketInstance.on("message:received", data => {
                this.messages = this.messages.concat(data)
            })
        },
        sendMessage() {
            this.addMessage();
            this.text = ''
        },
        addMessage() {
            const message = {
                id: new Date().getTime(),
                text: this.text,
                user: this.$store.state.user.username
            };
            this.messages = this.messages.concat(message)
            this.socketInstance.emit('message', {message: message, room: this.currentUser})
        }
    },
}
</script>

<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

    div {
        width: 100%;
        color: white;

        textarea {
            width: 100%;
        }
    }
}
</style>