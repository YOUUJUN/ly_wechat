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
                <h2 class="title">物料信息</h2>
                <van-field name="radio" label="物料名称">
                    <template #input>
                        <span>ABS泵</span>
                    </template>
                </van-field>
                <van-field name="radio" label="品牌">
                    <template #input>
                        <span>大众</span>
                    </template>
                </van-field>
                <van-field name="radio" label="系列">
                    <template #input>
                        <span>帕萨特</span>
                    </template>
                </van-field>
                <van-field name="radio" label="年款">
                    <template #input>
                        <span>2003</span>
                    </template>
                </van-field>
            </van-form>


            <h2 class="title">物料图片</h2>

            <van-grid :border="false" :column-num="3">
                <van-grid-item @click="showImg()">
                    <van-image src="https://img01.yzcdn.cn/vant/apple-1.jpg" />
                </van-grid-item>
                <van-grid-item>
                    <van-image src="https://img01.yzcdn.cn/vant/apple-2.jpg" />
                </van-grid-item>
                <van-grid-item>
                    <van-image src="https://img01.yzcdn.cn/vant/apple-3.jpg" />
                </van-grid-item>
                <van-grid-item>
                    <van-image src="https://img01.yzcdn.cn/vant/apple-1.jpg" />
                </van-grid-item>
                <van-grid-item>
                    <van-image src="https://img01.yzcdn.cn/vant/apple-2.jpg" />
                </van-grid-item>
                <van-grid-item>
                    <van-image src="https://img01.yzcdn.cn/vant/apple-3.jpg" />
                </van-grid-item>
            </van-grid>



        </main>

        <footer>


        </footer>

    </div>





</template>

<script>
    import { ImagePreview } from 'vant';



    export default {
        name: "Detail",

        data (){
            return {
                groupName: 'phone_brands_list',
                moduleName: 'phone_brands_list',
                brandsList: [],
                action_refresh: 'Refresh',
                comp_ado_name: 'car_brands',

                fileList: [
                    { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
                    // Uploader 根据文件后缀来判断是否为图片文件
                    // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
                    { url: 'https://cloud-image', isImage: true },
                ],
            }
        },

        beforeCreate(){
            this.$e = new this.$Engine();

        },

        created () {
            let adapter = this.$e.getActiveModule(this.moduleName, true).createAdapter(this, true);
            adapter.mappingData(this.comp_ado_name, "brandsList");

            this.getBrandsData();
        },

        methods : {
            onClickLeft() {
                Toast('返回');
            },


            showImg(){
                ImagePreview(['https://img01.yzcdn.cn/vant/apple-1.jpg']);
            },


            getBrandsData(){
                this.$e.init(this.groupName, this.moduleName, null, {
                    _act: '',
                }).then(function (res) {
                    console.log("res ======>",res);
                    console.log("this.brandsList ===>",this.brandsList);
                }).catch(err =>{
                    console.log("err ============>",err);
                    console.log("this.brandsList ===>",this.brandsList);
                });
            }
        }
    }
</script>

<style>
    body{
        background-color: #f7f8fa;
    }
</style>

<style scoped>



    .title{
        margin: 0;
        padding: 20px 16px 16px;
        color: rgba(69, 90, 100, 0.6);
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
    }


</style>
