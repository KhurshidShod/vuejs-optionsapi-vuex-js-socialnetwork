<template>
    <main>
        <div class="container">
            <Header />
            <section class="message__wrapper">
                <div class="messages">
                    <div class="messages__users">
                        <div @click="() => {
                            joinRoom(msg)
                        }" v-for="msg in allMessages" :key="msg.userId">
                            <img :src="returnMessageUser(msg.chatters.find(id => id !== $store.state.user.id)).image"
                                width="35px" height="35px" alt="">
                            <p>{{ returnMessageUser(msg.chatters.find(id => id !== $store.state.user.id)).username }}
                            </p>
                        </div>
                    </div>
                    <div class="messages__contents" v-if="selectedChat.msgContent">
                        <div class="messages__contents_messages" ref="scrollBottomRef">
                            <div :class="{ myMessages: chat.sender === $store.state.user.id }"
                                v-for="chat in selectedChat.msgContent.messageContents" :key="chat">
                                <img :src="returnMessageUser(chat.sender).image" width="35px" height="35px" alt="">
                                <p>
                                    {{ chat.text }}
                                </p>
                            </div>
                        </div>
                        <form action="" @submit.prevent="addMessage">
                            <input v-model="newMessageText" placeholder="Write a message..." type="" name="" value="">
                            <button><font-awesome-icon icon="fa-solid fa-paper-plane" /></button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </main>
    <!-- <div class="wrapper">
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
    </div> -->
</template>

<script setup>
import { io } from 'socket.io-client';
import { computed, onUpdated, reactive, ref } from 'vue';
import Header from '../components/Sidebar.vue';
import { useStore } from 'vuex';

const store = useStore()
const selectedChat = reactive({ msgContent: null })
const socket = io('https://peaceful-commitment-production.up.railway.app/');
const newMessageText = defineModel({ type: String })
const roomName = ref('')
const scrollBottomRef = ref(null)
const messages = computed(() => {
    return store.state?.messages.filter(msg => msg.chatters.includes(store.state.user.id))
})
const allMessages = messages;
onUpdated(() => {
    scrollToBottom();
    store.dispatch('getMessages')
})

const scrollToBottom = () => {
    const scrollHeight = scrollBottomRef.value?.scrollHeight;
    if (scrollBottomRef.value) {
        scrollBottomRef.value.scrollTop = scrollHeight
    }
}
const returnMessageUser = (id) => {
    return store.state.users.find(usr => usr.id === id)
};
const joinRoom = (msg) => {
    selectedChat.msgContent = msg;
    roomName.value = selectedChat.msgContent.chatters.join('-')
    socket.emit('join-room', msg.chatters.join("-"))
    socket.on("message:received", data => {
        console.log(data)
        selectedChat.msgContent.messageContents = selectedChat.msgContent.messageContents.concat(data)
    })
}
const addMessage = () => {
    const newMessage = {
        sender: store.state.user.id,
        text: newMessageText.value
    }
    selectedChat.msgContent.messageContents = selectedChat.msgContent.messageContents.concat(newMessage)
    socket.emit('message', { message: newMessage, room: roomName.value })
    newMessageText.value = ''
    store.dispatch('sendMessage', { newMessage, chatId: selectedChat.msgContent.id })
}
// import { text } from '@fortawesome/fontawesome-svg-core';
// import { io } from 'socket.io-client';
// export default {
//     data() {
//         return {
//             isJoined: false,
//             messages: [
//                 {
//                     id: 1,
//                     user: 'xrwd____',
//                     text: 'Salom'
//                 }
//             ],
//             text: '',
//             currentUser: ''
//         }
//     },
//     methods: {
//         join() {
//             this.isJoined = true
//             this.socketInstance = io('https://peaceful-commitment-production.up.railway.app/')
//             console.log(this.currentUser)
//             this.socketInstance.emit('join-room', this.currentUser)
//             this.socketInstance.on("message:received", data => {
//                 this.messages = this.messages.concat(data)
//             })
//         },
//         sendMessage() {
//             this.addMessage();
//             this.text = ''
//         },
//         addMessage() {
//             const message = {
//                 id: new Date().getTime(),
//                 text: this.text,
//                 user: this.$store.state.user.username
//             };
//             this.messages = this.messages.concat(message)
//             this.socketInstance.emit('message', {message: message, room: this.currentUser})
//         }
//     },
// }
</script>

<style lang="scss" scoped>
main {
    width: 100%;

    section.message__wrapper {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: start;
        flex-direction: row;
        flex-wrap: nowrap;

        .messages {
            width: calc(100% - 350px);
            margin-left: 350px;
            height: 100vh;
            display: flex;
            justify-content: start;
            align-items: start;

            @media (max-width: 1180px) {
                width: calc(100% - 425px);
                margin-left: 75px;
            }

            @media (max-width: 550px) {
                margin-left: 50px;
            }

            flex-grow: 1;
            overflow: auto;

            &__users {
                width: 250px;
                height: 100%;
                display: flex;
                justify-content: start;
                align-items: start;
                flex-direction: column;
                border-right: 1px solid var(--bg-green);
                padding-top: 2rem;
                padding-bottom: 2rem;

                div {
                    width: 100%;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    height: 50px;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    gap: 10px;

                    img {
                        border-radius: 50%;
                    }
                }
            }

            &__contents {
                position: relative;
                width: 100%;
                height: 100%;
                padding-top: 2rem;
                display: flex;
                justify-content: start;
                align-items: start;
                flex-direction: column;

                form {
                    width: 100%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 35px;
                    display: flex;
                    border-top: 1px solid var(--bg-green);
                    background-color: var(--bg-main);

                    input {
                        flex-grow: 1;
                        background-color: transparent;
                        border: none;
                        padding-left: 0.5rem;
                        color: white;
                    }

                    button {
                        font-size: 24px;
                        background-color: transparent;
                        border: none;
                        color: var(--bg-green);
                    }
                }

                &_messages {
                    width: 100%;
                    display: flex;
                    justify-content: start;
                    align-items: start;
                    flex-direction: column;
                    padding: 10px;
                    max-height: calc(100vh - 50px);
                    overflow: auto;
                    padding-bottom: 2rem;

                    div {
                        width: 100%;
                        display: flex;
                        justify-content: start;
                        align-items: center;
                        flex-direction: row;
                        gap: .5rem;

                        &.myMessages {
                            flex-direction: row-reverse;
                            justify-content: end;

                            p {
                                background-color: white;
                                color: black;
                            }
                        }

                        img {
                            border-radius: 50%;
                        }

                        p {
                            padding: .5rem;
                            background-color: rgb(0, 89, 255);
                            border-radius: 5px;
                            margin-top: 2rem;
                            color: white;
                        }
                    }
                }
            }

        }
    }
}
</style>