<template>

    <div>

        <header>

            <van-nav-bar
                    title="整车配件详情"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-swipe :autoplay="4000" class="swipe">
                <van-swipe-item v-for="(image, index) in images" :key="index">
                    <img class="swipe-item" v-lazy="image"  @click="showImg()"/>
                </van-swipe-item>
            </van-swipe>

            <van-form @submit="onSubmit" v-if="dataList.length > 0">
                <van-field name="radio" label="品牌系列">
                    <template #input>
                        <span>{{dataList[0].brands}}</span>
                    </template>
                </van-field>
                <van-field name="radio" label="配件类型">
                    <template #input>
                        <span>整车配件</span>
                    </template>
                </van-field>
                <van-field name="radio" label="年款">
                    <template #input>
                        <span>{{dataList[0].nk}}</span>
                    </template>
                </van-field>
                <van-field name="radio" label="入库时间">
                    <template #input>
                        <span>{{new Date(dataList[0].bill_date).toLocaleDateString()}}</span>
                    </template>
                </van-field>
            </van-form>

            <h2 class="title">已卖件信息</h2>


            <template v-if="saleList.length > 0">

                <van-cell v-for="item of saleList" :title="item.m_name">
                    <template #default>
                        <van-tag type="success">已卖出{{item.qty}}{{item.qty_unit}}</van-tag>
                    </template>
                </van-cell>

            </template>

            <van-empty
                    v-else
                    class="custom-image"
                    image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
                    description="无已卖件信息"
            />

            <h2 class="title">缺件信息</h2>

            <template v-if="lostList.length > 0">

                <van-cell v-for="item of lostList" :title="item.m_name">
                    <template #default>
                        <van-tag type="danger">缺{{item.qty}}{{item.qty_unit}}</van-tag>
                    </template>
                </van-cell>

            </template>

            <van-empty
                    v-else
                    class="custom-image"
                    image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
                    description="无缺件信息"
            />


        </main>

        <footer>

        </footer>

    </div>

</template>

<script>
    import { ImagePreview } from 'vant';

    const detail_module = {
        moduleName: 'wx_car_show_bill',
        action_edit: 'Edit',
        action_read : 'image.Read',
        list_ado_name: 'data_m',
        img_ado_name: 'data_d',
        lost_ado_name : 'data_loss',
        sale_ado_name : 'data_sale'
    };

    export default {
        name: "Detail",

        data() {
            return {
                images: [
                    'https://img01.yzcdn.cn/vant/empty-image-search.png',
                ],

                dataList : [],
                imgList : [],
                lostList : [],
                saleList : [],
            };
        },

        beforeCreate(){
            let amgn = this.$route.query.amgn;
            let checkid = this.$route.query.checkid;

            this.__rowid = this.$route.query.rowid;
            this.$e=new this.$Engine();
            this.$e._amgn=amgn;
            this.$e._checkid=checkid;
        },

        created () {
            let vm = this;

            let adapter = this.$e.getActiveModule(detail_module.moduleName, true).createAdapter(this, true);
            adapter.mappingData(detail_module.list_ado_name, "dataList");
            adapter.mappingData(detail_module.img_ado_name, "imgList");
            adapter.mappingData(detail_module.lost_ado_name, "lostList");
            adapter.mappingData(detail_module.sale_ado_name, "saleList");

            this.$e.call(detail_module.moduleName, detail_module.action_edit, null, null, {

            }).then(res => {
                console.log('res',res);
                console.log('dataList========>',vm.dataList);
                console.log('imgList========>',vm.imgList);
                console.log('dataList========>',vm.lostList);
                console.log('imgList========>',vm.saleList);


                if(vm.imgList.length > 0){
                    vm.images = [];
                    for(let item of vm.imgList){
                        this.images.push(vm.buildSrc(item, item.__rowid));
                    }
                }
            }).catch(err => {
                console.log('err',err);
            });

        },


        methods : {
            onClickLeft() {
                this.$router.go(-1);
            },

            buildSrc (item, rowid){
                let url = "https://img01.yzcdn.cn/vant/empty-image-search.png";
                if(item.img_path){
                    url = `/cloud?_amn=wx_car_show_bill&_mn=wx_car_show_bill&_name=image.Read&_rand=0.9726284176919381&rowid=${rowid}&_hasdata=0&_type=async&_amgn=wx_car_show_desk&_checkid=${this.$route.query.checkid}`;
                }
                console.log('url',url);
                return url;
            },

            showImg(){
                let vm = this;
                ImagePreview(vm.images);
            },
        }
    }
</script>

<style>

    .custom-image .van-empty__image {
        width: 60px;
        height: 60px;
    }
</style>

<style scoped>

    .swipe-item{
        width:100%;
        height: 215px;
    }

    .title{
        margin: 0;
        padding: 20px 16px 16px;
        color: rgba(69, 90, 100, 0.6);
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
    }

    .custom-image{
        padding:8px 0;
        background-color: #fff;
    }

</style>
