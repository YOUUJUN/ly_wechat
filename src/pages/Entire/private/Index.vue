<template>

    <div>

        <header>

            <van-nav-bar
                    title="整车配件查询"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-cell-group class="panel">
                <div class="panel-body">

<!--                    <van-field-->
<!--                            label="车辆品牌系列"-->
<!--                            placeholder="请选择品牌系列"-->
<!--                            :value="brandSeries"-->
<!--                            @click="openChoiceBrand()"-->
<!--                    >-->
<!--                        <template #button>-->
<!--                            <van-button size="small" type="primary" @click="search">搜索</van-button>-->
<!--                        </template>-->
<!--                    </van-field>-->

                    <van-field
                            v-model="brandSeriesText"
                            :value="brandSeriesText"
                            center
                            clearable
                            label="车辆品牌系列"
                            placeholder="请选择品牌系列"
                    >
                        <template #button>
                            <van-button size="small" type="primary" style="margin-right:4px;" @click="openChoiceBrand()">选择</van-button>
                            <van-button size="small" type="primary" @click="search">搜索</van-button>
                        </template>
                    </van-field>

                </div>
            </van-cell-group>


            <van-tabs animated :ellipsis="false">
                <van-tab title="轿车">

                    <div class="list">

                        <van-card
                                class="list-item"
                                title="品牌型号：大众桑塔纳"
                                desc="全车配件"
                                thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
                        >
                            <template #desc>
                                <div style="color: #646566;font-size: 12px;margin:5px 0;">车型：轿车</div>
                                <div style="color: #646566;font-size: 12px;">全车配件</div>
                            </template>
                            <template #num>
                                <span style="color: #969799;font-size: 12px;">入库时间：2021-6-28</span>
                            </template>

                        </van-card>

                    </div>

                </van-tab>

                <van-tab title="摩托车">

                    <div class="list">

                        <van-card
                                class="list-item"

                                num="2"
                                price="2.00"
                                desc="描述信息"
                                title="商品标题"
                                thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
                        />

                    </div>

                </van-tab>

                <van-tab title="中小型客货车">

                    <div class="list">

                        <van-card
                                class="list-item"

                                num="2"
                                price="2.00"
                                desc="描述信息"
                                title="商品标题"
                                thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
                        />

                    </div>

                </van-tab>

                <van-tab title="大型客货车">

                    <div class="list">

                        <van-card
                                class="list-item"

                                num="2"
                                price="2.00"
                                desc="描述信息"
                                title="商品标题"
                                thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
                        />

                    </div>

                </van-tab>
            </van-tabs>




            <van-popup v-model="showBrand" position="right" :style="{ height: '100%', width : '70%' }">

                <van-index-bar :sticky="false"  :style="{ height: '100%', overflow : 'auto'}">

                    <template v-for="(item, index) in Object.entries(getIndexList)" >
                        <van-index-anchor :index="item[0]" :key="index">{{ item[0] }}</van-index-anchor>
                        <template v-for="i in item[1]">
                            <van-cell :title="i.name" @click="openChoiceSerial(i.name)"/>
                        </template>
                    </template>


                </van-index-bar>


            </van-popup>

        </main>

        <footer>

        </footer>

    </div>

</template>

<script>

    const main_module = {
        groupName: 'wx_car_show_desk',
        moduleName: 'wx_car_show_desk',
    }

    const brand_module = {
        moduleName: 'phone_brands_list',
        action_get: 'GetSerial',
        comp_ado_name: 'car_brands',
    };

    export default {
        name: "Index",
        data(){
            return {
                brand : '',
                series : '',
                brandSeriesText : '',

                brandsList :[],

                showBrand : false
            }
        },

        beforeCreate(){
            this.$e = new this.$Engine();
        },

        created(){
            let adapter = this.$e.getActiveModule(brand_module.moduleName, true).createAdapter(this, true);
            adapter.mappingData(brand_module.comp_ado_name, "brandsList");
            this.getBrandsData();
        },

        computed : {
            getIndexList(){
                let obj = {};
                let list = this.brandsList;
                for(let item of list){
                    if(item.pre_char){
                        if(!obj[item.pre_char]){
                            obj[item.pre_char] = [];
                        }else{
                            let cell = {};
                            cell.name = item.car_brand_name;
                            cell.rowid = item.__rowid;
                            obj[item.pre_char].push(cell);
                        }
                    }
                }
                return obj;
            },

            brandSeries (){
                let brandSeries = this.brand.concat(" ",this.series);
                this.brandSeriesText = brandSeries;
                return brandSeries
            }

        },

        methods :{
            onClickLeft(){
                document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
                WeixinJSBridge.call('closeWindow');
            },

            openChoiceBrand(){
                this.showBrand = true;
            },

            getBrandsData(){
                let vm = this;
                this.$e.init(main_module.groupName, main_module.moduleName, null, {
                    _act: '',
                }).then(function (res) {

                }).catch(err =>{
                    console.log("err ============>",err);
                    console.log("this.brandsList ===>",vm.brandsList);
                });

            },

        }
    }
</script>

<style scoped>

    .list{
        padding:8px;
    }

    .list-item{
        background-color: #fff;
    }

</style>
