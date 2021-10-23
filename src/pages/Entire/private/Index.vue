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
                            :value="brandSeries"
                            center
                            clearable
                            label="车辆品牌系列"
                            placeholder="请选择品牌系列"
                    >
                        <template #button>
                            <van-button size="small" type="primary" style="margin-right:4px;" @click="openChoiceBrand()">选择</van-button>
                            <van-button size="small" type="primary" @click="search()">搜索</van-button>
                        </template>
                    </van-field>

                </div>
            </van-cell-group>


            <van-tabs animated :ellipsis="false" v-model="activeName" @click="tabClick">

                <van-tab v-for="tab of tabList" :title="tab" :name="tab">

                    <div class="list">

                        <van-list
                                v-model="loading"
                                :finished="finished"
                                finished-text="没有更多了"
                                :immediate-check = "false"
                                @load="onLoad"
                        >

                            <template v-for="item of carList">
                                <van-card
                                        class="list-item"
                                        :title="'品牌系列：'+item.brands"
                                        :thumb="buildSrc(item, item.__rowid)"
                                        @click="goDetail(item, item.__rowid)"
                                >
                                    <template #desc>
                                        <div style="color: #646566;font-size: 12px;margin-top:4px;">车型：{{tab}}<span style="margin-left: 8px;">全车配件</span></div>
                                        <div style="color: #646566;font-size: 12px;margin-top:4px;">年款：{{item.nk}}</div>
                                    </template>
                                    <template #num>
                                        <span style="color: #969799;font-size: 12px;">入库时间：{{item.bill_date}}</span>
                                    </template>

                                </van-card>

                            </template>

                        </van-list>


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

            <van-action-sheet v-model="showBottom" :actions="viewData.serial" @select="onSelect" />

        </main>

        <footer>

        </footer>

    </div>

</template>

<script>
    import { Toast } from 'vant';

    const main_module = {
        groupName: 'wx_car_show_desk',
        moduleName: 'wx_car_show_desk',
        ado : 'data_list',
        action_edit : 'bill.Edit',
        action_refresh: 'filter.Refresh'
    };

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
                activeName : '轿车',
                tabList : ['轿车', '摩托车', '中小型客货车', '大型客货车'],

                brandsList :[],

                viewData: {
                    serial : []
                },

                carList : [],

                showBrand : false,
                showBottom : false,

                loading: false,
                finished: false,
            }
        },

        beforeCreate(){
            this.$e = new this.$Engine();
        },

        created(){
            let adapter = this.$e.getActiveModule(brand_module.moduleName, true).createAdapter(this, true);
            adapter.mappingData(brand_module.comp_ado_name, "brandsList");

            adapter = this.$e.getActiveModule(main_module.moduleName, true).createAdapter(this, true);
            adapter.mappingData(main_module.ado, "carList");
            this.getBrandsData();

            this.search();
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
                let brandSeries = this.brand.concat(this.series);
                this.brandSeriesText = brandSeries;
                return brandSeries
            }

        },

        methods :{
            onLoad : function(){
                console.log('onLoad===>');
                let vm = this;

                let ado = this.$e.getADO(main_module.ado,main_module.moduleName);
                if(ado){
                    ado.nextPage().then(res => {
                        vm.loading = false;
                        vm.finished = false;
                        if(!ado.hasNextPage()){
                            vm.finished = true;
                        }
                    });
                }
            },

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

            openChoiceSerial(name){
                this.brand = name;
                this.series = "";
                this.$e.call(brand_module.moduleName, brand_module.action_get, null, null, {
                    params: {
                        car_brands: name,
                    }
                }).then(res => {
                    let s=this.$e.getEnv('var_serial');
                    let arr = s.split(';');
                    arr = arr.map((current, index, arr) => {
                        let obj = {};
                        obj.name = current;
                        return obj;
                    });
                    this.viewData.serial = arr;
                    console.log('length',arr);
                    if(s){
                        this.showBottom = true;
                    }else{
                        Toast('该车型无系列');
                    }
                }).finally(() => {
                    this.showBrand = false;
                });
            },

            onSelect(item){
                this.series = item.name;
                this.showBottom = false;
            },

            buildSrc (item, rowid){
                let url = "https://img01.yzcdn.cn/vant/empty-image-search.png";
                if(item.img_path){
                    url = `/cloud?_amn=wx_car_show_desk&_mn=wx_car_show_desk&_name=image.Read&_rand=0.9726284176919381&rowid=${rowid}&_hasdata=0&_type=async&_amgn=wx_car_show_desk&_checkid=${this.$e._checkid}`;
                }
                return url;
            },

            search(){
                let vm = this;

                let brands = this.brandSeriesText;
                let car_kind_name = this.activeName;
                let payLoad = {
                    brands,
                    car_kind_name
                };

                for(let item in payLoad){
                    if(payLoad[item] === ''){
                        delete payLoad[item];
                    }
                }

                this.$e.call(main_module.moduleName, main_module.action_refresh, null, payLoad, {
                    params: {

                    }
                }).then(res => {
                    console.log('res',res);
                    console.log('---------->list',vm.carList);
                    if(vm.carList.length == 0){
                        Toast('仓库没有找到该品牌系列的车型.');
                    }

                    console.log('vm.carList.length', vm.carList.length, vm.finished);
                    if(vm.carList.length < 10){
                        vm.finished = true;
                    }else{
                        vm.finished = false;
                    }
                }).catch(err => {
                    console.log('err',err);
                })

            },

            tabClick(name, title){
                this.search();
            },

            goDetail(item, rowid){
                let vm = this;
                this.$e.call(main_module.moduleName, main_module.action_edit, null, null, {
                    params: {
                        rowid : rowid
                    }
                }).then(res => {
                    console.log('res',res);
                    vm.$router.push({
                        name: 'detail',
                        query: {
                            amgn : this.$e._amgn,
                            checkid : vm.$e._checkid,
                            carid : item.carid,
                            rowid : rowid
                        }
                    });
                }).catch(err => {
                    console.log('err',err);
                });
            }
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
