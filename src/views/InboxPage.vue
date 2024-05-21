<template>
    <main>
        <Header />
        <section class="message__wrapper">
            <div class="messages">
                <div class="messages__users" :class="{ usersTabClosed: selectedChat.msgContent }">
                    <div class="messages__users_new">
                        <input v-model="newChatUser" type="text" placeholder="Enter username of receiver" name="" id="">
                        <button @click="createNewMessage">Send new message</button>
                    </div>
                    <div class="messages__users_user" @click="() => {
                        joinRoom(msg)
                    }" v-for="msg in messages" :key="msg.userId">
                        <img :src="returnMessageUser(msg.chatters.find(id => id !== $store.state.user.id)).image"
                            width="35px" height="35px" alt="">
                        <p>{{ returnMessageUser(msg.chatters.find(id => id !== $store.state.user.id)).username }}
                        </p>
                    </div>
                </div>
                <div class="messages__contents" v-if="selectedChat.msgContent">
                    <div class="messages__contents_user">
                        <div>
                            <img :src="returnMessageUser(selectedChat.msgContent.chatters.find(id => id !== $store.state.user.id)).image"
                                width="35px" height="35px" alt="">
                            <p>{{ returnMessageUser(selectedChat.msgContent.chatters.find(id => id !==
                                $store.state.user.id)).username }}
                            </p>
                        </div>
                        <button @click="selectedChat.msgContent = null" class="closeChat"><font-awesome-icon
                                icon="fa-solid fa-xmark" /></button>

                    </div>
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
    </main>
</template>

<script setup>
import { io } from 'socket.io-client';
import { computed, onUpdated, reactive, ref } from 'vue';
import Header from '../components/Sidebar.vue';
import { useStore } from 'vuex';
import sentSound from '../assets/audio/COMCell_Message sent (ID 1313)_BSB.wav'
import receivedSound from '../assets/audio/Voicy_Telegram SFX 2.mp3'
import { toast } from 'vue3-toastify';

const store = useStore()
const selectedChat = reactive({ msgContent: null })
const socket = io('https://peaceful-commitment-production.up.railway.app/');
const newMessageText = defineModel('newMessageText', { type: String })
const newChatUser = defineModel('newChatUser', { type: String })
const roomName = ref('')
const scrollBottomRef = ref(null)
const messages = computed(() => {
    return store.state?.messages.filter(msg => msg.chatters.includes(store.state.user.id))
})

onUpdated(() => {
    scrollToBottom();
})

const createNewMessage = () => {
    const user = store.state.users.find(usr => usr.username === newChatUser.value)
    if (!user) {
        toast("No such user found", {
            type: 'error',
            theme: 'dark'
        })
    } else if (user.username === store.state.user.username) {
        toast("You cannot send message to yourself", {
            type: 'warning',
            theme: 'dark'
        })
    } else {
        const newMessage = messages.value.find(msg => msg.chatters.includes(user.id));
        if (newMessage) {
            joinRoom(newMessage)
        } else {
            store.commit('addMessage', {
                chatters: [store.state.user.id, user.id],
                messageContents: []
            })
            joinRoom({
                chatters: [store.state.user.id, user.id],
                messageContents: [],
                id: Date.now().toString()
            })
        }
    }
}
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
        selectedChat.msgContent.messageContents = selectedChat.msgContent.messageContents.concat(data);
        const audio = new Audio(receivedSound);
        audio.play()
    })

}
const addMessage = () => {
    const newMessage = {
        sender: store.state.user.id,
        text: newMessageText.value
    }
    console.log(selectedChat.msgContent)
    selectedChat.msgContent.messageContents = selectedChat.msgContent.messageContents.concat(newMessage)
    socket.emit('message', { message: newMessage, room: roomName.value })
    newMessageText.value = ''
    store.dispatch('sendMessage', { newMessage, chat: selectedChat.msgContent });
    const audio = new Audio(sentSound);
    audio.volume = 0.1;
    audio.play()
}
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
                min-width: 200px;
                height: 100%;
                display: flex;
                justify-content: start;
                align-items: start;
                flex-direction: column;
                border-right: 1px solid var(--bg-green);
                padding-top: 2rem;
                padding-bottom: 2rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;

                @media (max-width: 600px) {
                    flex-grow: 1;
                    border: none;

                    &.usersTabClosed {
                        display: none;
                    }
                }

                &_new {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    height: auto;
                    gap: 0.5rem;
                    padding-bottom: .5rem;
                    border-bottom: 1px solid var(--bg-green);

                    input {
                        width: 100%;
                        height: 35px;
                        border-radius: 7px;
                        border: 1px solid var(--bg-green);
                        padding-left: 5px;
                        background-color: transparent;
                        color: var(--bg-green);

                        &::placeholder {
                            font-size: 12px;
                        }
                    }

                    button {
                        width: 100%;
                        height: 35px;
                        border-radius: 7px;
                        background-color: var(--bg-green);
                        color: white;
                        font-size: 16px;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                    }
                }

                &_user {
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
                display: flex;
                justify-content: start;
                align-items: start;
                flex-direction: column;
                padding-inline: .5rem;

                &_user {
                    width: 100%;
                    height: 50px;
                    background-color: var(--bg-main);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--border-main);

                    div {
                        display: flex;
                        justify-content: start;
                        align-items: center;
                        gap: 0.5rem;

                        img {
                            border-radius: 50%;
                        }

                        p {
                            color: white;
                            font-weight: 700;
                        }
                    }

                    button {
                        font-size: 24px;
                        color: white;
                        background-color: transparent;
                        border: none;
                        cursor: pointer;
                    }
                }

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
                    padding-bottom: 3rem;

                    div {
                        width: 100%;
                        display: flex;
                        justify-content: start;
                        align-items: center;
                        flex-direction: row;
                        gap: .3rem;

                        &.myMessages {
                            flex-direction: row-reverse;
                            justify-content: end;

                            p {
                                background-color: white;
                                color: black;
                                border-top-right-radius: 0;
                                border-top-left-radius: 15px;
                            }
                        }

                        img {
                            border-radius: 50%;
                        }

                        p {
                            position: relative;
                            padding: .5rem;
                            background-color: rgb(0, 89, 255);
                            border-radius: 15px;
                            margin-top: 2rem;
                            color: white;
                            border-top-left-radius: 0;

                        }
                    }
                }
            }

        }
    }
}
</style>