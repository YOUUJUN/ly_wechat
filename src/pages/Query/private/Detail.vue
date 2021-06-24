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

            <van-form @submit="onSubmit" v-if="dataList.length > 0">
                <h2 class="title">物料信息</h2>
                <van-field name="radio" label="物料名称">
                    <template #input>
                        <span>{{dataList[0].m_name}}</span>
                    </template>
                </van-field>
                <van-field name="radio" label="品牌">
                    <template #input>
                        <span>{{dataList[0].car_brand_name}}</span>
                    </template>
                </van-field>
                <van-field name="radio" label="系列">
                    <template #input>
                        <span>{{dataList[0].car_serial_name}}</span>
                    </template>
                </van-field>
                <van-field name="radio" label="年款">
                    <template #input>
                        <span>{{dataList[0].nk}}</span>
                    </template>
                </van-field>
            </van-form>


            <h2 class="title">物料图片</h2>

            <van-grid :border="false" :column-num="3" v-if="imgList.length > 0">
<!--                <van-grid-item @click="showImg()">-->
<!--                    <van-image src="https://img01.yzcdn.cn/vant/apple-1.jpg" />-->
<!--                </van-grid-item>-->
<!--                <van-grid-item>-->
<!--                    <van-image src="https://img01.yzcdn.cn/vant/apple-3.jpg" />-->
<!--                </van-grid-item>-->
<!--                <van-grid-item>-->
<!--                    <van-image src="https://img01.yzcdn.cn/vant/apple-1.jpg" />-->
<!--                </van-grid-item>-->
<!--                <van-grid-item>-->
<!--                    <van-image src="https://img01.yzcdn.cn/vant/apple-2.jpg" />-->
<!--                </van-grid-item>-->
<!--                <van-grid-item>-->
<!--                    <van-image src="https://img01.yzcdn.cn/vant/apple-3.jpg" />-->
<!--                </van-grid-item>-->

                <van-grid-item v-for="item of imgList"  @click="showImg(buildSrc(item.__rowid))">
                    <van-image :src="buildSrc(item.__rowid)" />
                </van-grid-item>

            </van-grid>


            <h2 class="title" style="text-align: center">如有意向购买，请联系：111555111</h2>




        </main>

        <footer>


        </footer>

    </div>





</template>

<script>
    import { ImagePreview } from 'vant';
    import Engine from "../../../utils/engine_module";


    const detail_module = {
        moduleName: 'wx_old_part_buy_bill',
        action_edit: 'Edit',
        list_ado_name: 'data_m',
        img_ado_name: 'img',
    };

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

                dataList : [],
                imgList : []
            }
        },

        beforeCreate(){
            console.log('query=====>',this.$route.query);
            // let e = this.$route.params.$e;
            let amgn = this.$route.query.amgn;
            let checkid = this.$route.query.checkid;
            this.__rowid = this.$route.query.rowid;
            this.$e=new Engine();
            this.$e._amgn=amgn;
            this.$e._checkid=checkid;
            console.log("this.$e ===>",this.$e);
        },

        created () {
            let vm = this;

            let adapter = this.$e.getActiveModule(detail_module.moduleName, true).createAdapter(this, true);
            adapter.mappingData(detail_module.list_ado_name, "dataList");
            adapter.mappingData(detail_module.img_ado_name, "imgList");

            this.$e.call(detail_module.moduleName, detail_module.action_edit, null, null, {

            }).then(res => {
                console.log('res',res);
                console.log('dataList========>',vm.dataList);
                console.log('imgList========>',vm.imgList);
            }).catch(err => {
                console.log('err',err);
            });

        },

        methods : {
            onClickLeft() {
                this.$router.go(-1);

            },


            showImg(src){
                ImagePreview([src]);
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
            },


            buildSrc (rowid){
                let url = `http://60.173.9.77:15280/cloud?_amn=wx_old_part_buy_bill&_mn=wx_old_part_buy_bill&_name=image.Read&_rand=0.9726284176919381&rowid=${rowid}&_hasdata=0&_type=async&_amgn=wx_old_part_buy&_checkid=${this.$route.query.checkid}`;
                console.log('url',url);
                return url
                // return this.buildURL({
                //     rowid: rowid
                // })
            },

            buildURL (op) {
                let options = {
                    _amn: "wx_old_part_buy_bill",
                    _mn: "wx_old_part_buy_bill",
                    _name: "image.Read"
                };
                let randk = 'r'+op.rowid + '';
                this.$e.fn.extend(op, options, true);
                return this.$e.getURL("async", options, false, true);
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
