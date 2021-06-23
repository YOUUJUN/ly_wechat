<template>

    <div id="app">

        <header>

            <van-nav-bar
                    title="物料详情"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-form @submit="onSubmit">


                <van-field name="uploader" label="文件上传" :disabled="true">
                    <template #input>
                        <van-uploader v-model="fileList" />
                    </template>
                </van-field>


            </van-form>


        </main>

        <footer>


        </footer>

    </div>





</template>

<script>
    export default {
        name: "Detail",

        data (){
            return {
                fileList: [
                    { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
                    // Uploader 根据文件后缀来判断是否为图片文件
                    // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
                    { url: 'https://cloud-image', isImage: true },
                ],
            }
        },

        methods : {
            onClickLeft() {
                Toast('返回');
            }
        }
    }
</script>

<style scoped>

</style>
