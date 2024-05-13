<template>
    <div class="create_modal">
        <div class="create_modal__wrapper">
            <h3>Create a new post</h3>
            <form action="">
                <div class="content">
                    <label for="">Content</label>
                    <textarea name="" placeholder="Tell us more about your post" id=""></textarea>
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
                <button>Post</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imageFile: null,
            activeDropZone: false,

        }
    },
    methods: {
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
    },
}
</script>

<style lang="scss" scoped>
.create_modal {
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
        background-color: var(--bg-main);
        border-radius: 10px;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        border: 1px solid var(--bg-green);

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

            div {
                min-width: 450px;

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
            }
        }
    }
}
</style>