<template>
    <div class="create_modal">
        <div class="create_modal__wrapper">
            <button class="closeModal" @click="$eventBus.$emit('createModalOpened', false)">
                <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
            <h3>Create a new post</h3>
            <form action="" @submit.prevent="handleSubmitCreate">
                <div class="content">
                    <label for="content">Content</label>
                    <textarea v-model="newPost.content" name="" placeholder="Tell us more about your post"
                        id="content"></textarea>
                </div>
                <div class="file__upload"
                    :class="[(activeDropZone ? 'activeDropZone' : imageFile ? 'activeDropZone' : null)]"
                    @dragenter.prevent="toggleActiveDropzone" @dragleave.prevent="toggleActiveDropzone"
                    @dragover.prevent @drop.prevent="dropFile">
                    <p v-if="!activeDropZone && imageFile.length === 0">
                        Drag & Drop image here or <span @click="onClickSelect">Choose</span>
                    </p>
                    <p style="color: var(--bg-green); cursor: pointer;" v-else-if="imageFile" @click="onClickSelect">Re-select</p>
                    <p v-else class="activeText">Drop image here</p>
                    <input multiple @change="onFileSelect" ref="fileInput" type="file" name="file" id="">
                </div>
                <div class="uploaded__files">
                    <div class="uploaded__files_file" v-for="image in imageFile" :key="image.name">
                        <span><font-awesome-icon icon="fa-solid fa-xmark" /></span>
                        <img style="margin-right: 5px;" :src="imageToUrl(image)" width="50px" height="50px" alt="">
                    </div>
                </div>
                <button v-if="!createPostLoading" type="submit">Post</button>
                <button v-else disabled>
                    <p>Posting...<loading-circle /></p>
                </button>
                <!-- <button type="submit">{{createPostLoading ? 'Posting...' : 'Post'}}</button> -->
            </form>
        </div>
    </div>
</template>

<script>
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { mapActions, mapState } from 'vuex/dist/vuex.cjs.js';
import { toast } from 'vue3-toastify';
import LoadingCircle from './LoadingCircle.vue';

export default {
    components: { LoadingCircle },
    data() {
        return {
            imageFile: [],
            activeDropZone: false,
            newPost: {
                content: '',
                images: []
            }
        }
    },
    computed: {
        ...mapState(['user', 'createPostLoading'])
    },
    methods: {
        ...mapActions(['createNewPost']),
        imageToUrl(image){
            return URL.createObjectURL(image)
        },
        onFileSelect(event) {
            const files = event.target.files;
            if (files.length === 0) return;
            for (let i = 0; i < files.length; i++) {
                if (files[i].type.split('/')[0] !== 'image') {
                    toast("Only jpg, jpeg, png and mp4 types are allowed", {
                        type: 'warning',
                        theme: 'dark'
                    })
                    this.toggleActiveDropzone()
                    return;
                } else {
                    continue
                }
            }
            for (let i = 0; i < files.length; i++) {
                this.imageFile.push(files[i]);
            }

        },
        toggleActiveDropzone() {
            this.activeDropZone = !this.activeDropZone
        },
        dropFile(event) {
            const files = event.dataTransfer.files;
            if (files.length === 0) return;
            for (let i = 0; i < files.length; i++) {
                if (files[i].type.split('/')[0] !== 'image') {
                    toast("Only jpg, jpeg, png and mp4 types are allowed", {
                        type: 'warning',
                        theme: 'dark'
                    })
                    this.toggleActiveDropzone()
                    return;
                } else {
                    continue
                }
            }
            for (let i = 0; i < files.length; i++) {
                this.imageFile.push(files[i]);
            }
        },
        onClickSelect() {
            this.$refs.fileInput.click()
        },
        selectFile(event) {
            this.imageFile = event.target.files[0]
        },
        async handleSubmitCreate() {
            const newPostId = Date.now().toString();
            const storage = getStorage();
            this.$store.commit('changeLoadingState', true)
            for (let i = 0; i < this.imageFile.length; i++) {
                const storageRef = ref(storage, this.imageFile[i].name);
                await uploadBytes(storageRef, this.imageFile[i]).then(snapshot => console.log(snapshot))
            }
            for (let i = 0; i < this.imageFile.length; i++) {
                await getDownloadURL(ref(storage, this.imageFile[i].name)).then(res => {
                    if (this.imageFile[i].type.split('/')[0] !== 'video') {
                        this.newPost.images.push(res)
                    } else {
                        this.newPost.images.push(res + '***video')
                    }
                })
            }
            this.createNewPost({
                ...this.newPost,
                likes: [],
                comments: [],
                userId: this.user.id,
                id: newPostId
            })
            this.$store.commit('changeLoadingState', false)
            toast("You have posted successfully", {
                theme: 'dark',
                type: 'success'
            })
            this.$eventBus.$emit('newPostCreated', {
                ...this.newPost,
                likes: [],
                comments: [],
                userId: this.user.id,
                id: newPostId
            })
            this.$eventBus.$emit('createModalOpened', false);
        }
    },
}
</script>

<style lang="scss" scoped>
.create_modal {
    position: relative;
    width: 100%;
    height: 100vh;
    backdrop-filter: blur(5px);
    position: fixed;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;

    &__wrapper {
        width: 55%;
        position: relative;
        background-color: var(--bg-main);
        border-radius: 10px;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        border: 1px solid var(--bg-green);

        @media (max-width: 900px) {
            width: 75%;
        }

        @media (max-width: 550px) {
            width: 90%;
        }

        .closeModal {
            position: absolute;
            top: 5px;
            right: 10px;
            font-size: 28px;
            background-color: transparent;
            border: none;
            color: white;
            cursor: pointer;
            transition: all .2s linear;

            &:hover {
                transform: rotate(45deg);
            }
        }

        h3 {
            width: 100%;
            padding-top: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-main);
            font-size: 16px;
            color: var(--dark-font);
            text-align: center;
            font-weight: 600;
        }

        form {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
            width: 100%;

            div {
                width: 100%;

                &.content {
                    display: flex;
                    justify-content: start;
                    align-items: start;
                    flex-direction: column;
                    gap: 5px;

                    label {
                        color: white;
                        font-size: 18px;
                        font-weight: 700;
                    }

                    textarea {
                        width: 100%;
                        height: 75px;
                        border-radius: 8px;
                        resize: vertical;
                        background-color: transparent;
                        border: 1px solid var(--border-main);
                        color: var(--bg-green);
                        padding: 0.5rem;
                        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>✍️</text></svg>") 16 0, auto;


                        &:focus {
                            border-color: var(--bg-green);
                            font-size: 16px;
                        }
                    }
                }
                &.uploaded__files{
                    width: 100%;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 10px;
                    &_file{
                        position: relative;
                        width: 50px;
                        height: 50px;
                        span{
                            color: red;
                            position: absolute;
                            top: -3px;
                            right: 0px;
                            font-weight: 100;
                            cursor: pointer;
                        }
                    }
                }
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
                        color: white;

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
                            color: var(--bg-green);
                        }
                    }

                    input {
                        display: none;
                    }
                }
            }

            button {
                position: relative;
                width: 100%;
                height: 50px;
                border-radius: 8px;
                background-color: var(--bg-green);
                color: white;
                font-size: 18px;
                font-weight: 700;
                letter-spacing: 2px;
                border: none;
                cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🚀</text></svg>") 16 0, auto;

                &:disabled {
                    background-color: #00a69573;
                    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🚫</text></svg>") 16 0, auto;
                }
            }
        }
    }
}
</style>