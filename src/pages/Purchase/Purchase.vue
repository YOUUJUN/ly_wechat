<template>

    <div>

        <header>

            <van-nav-bar
                    title="车辆电子收购单生成"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-form class="panel" @submit="sendPurchaseRequest">
                <van-cell-group class="panel-inner" inset>


                    <template v-for="item in info">

                        <van-field
                        name="车牌号码"
                        v-model="item.car_no"
                        label="车牌号码："
                        placeholder="车牌号码"
                        :rules="[{ required: true, message: '请填写车牌号码' }]"
                    >
                    <template #button>
                        <van-button size="small" type="primary" @click="setRandomCarNo">生成</van-button>
                    </template>
                    </van-field>

                    <van-field
                        name="车主名称"
                        v-model="item.car_owner_name"
                        label="车主名称："
                        type="text"
                        placeholder="车主名称"
                        :rules="[{ required: true, message: '请填写车主名称' }]"
                    ></van-field>

                    <van-field
                        name="联系电话"
                        v-model="item.car_owner_phone"
                        label="联系电话"
                        type="text"
                        placeholder="联系电话"
                        :rules="[{ required: true, message: '请填写车主联系电话' }]"
                    ></van-field>

                    </template>
                    


                </van-cell-group>

                <div style="margin:16px;">
                
                    <van-button round block type="primary" native-type="submit">生成收购单</van-button>

                </div>


            </van-form>


            <van-empty
            v-if='!ifPurchased'
            class="custom-image"
            image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
            description="点击生成收购单生成图片"
            />

            <van-image
            v-if='ifPurchased'
            class="purchaseImg"
            width="100%"
            height="auto"
            fit="contain"
            :src="this.buildSrc()"
            @click="downLoadImg()"
            />


            

        </main>

        <footer></footer>

    </div>

</template>

<script>

    import { Toast } from 'vant';
    import { ImagePreview } from 'vant';

    const main_module = {
        groupName: 'wx_car_purchase_desk',
        moduleName: 'wx_car_purchase_desk',
        ado : 'data_m',
        action_Save : 'Save',
        action_Add : 'Add',
        action_read: 'DownLoad'
    };

    export default {

        data(){
            return {
                info : [{
                    car_no : '',
                    car_owner_name : '',
                    car_owner_phone : '',
                }],

            
                ifPurchased : false
            }
        },

        beforeCreate(){
            this.$e = new this.$Engine();
        },

        created(){
            let vm = this;
            let adapter = this.$e.getActiveModule(main_module.moduleName, true).createAdapter(this, true);
            adapter.mappingData(main_module.ado, "info");

            this.$e.init(main_module.groupName, main_module.moduleName, null, {
                _act: '',
            }).then(function (res) {

                vm.$e.call(main_module.moduleName, main_module.action_Add, null, null, {
                    params: {
                        tel : '15656229989'
                    }
                }).then(res => {
                    console.log("this.info ===>",vm.info);
                }).catch(err => {
                    console.log('err',err);
                })

            }).catch(err =>{
                console.log("err ============>",err);
                console.log("this.info ===>",vm.info);
            });

        },

        mounted(){
            console.log('info', this.info);
        },

        methods : {
            sendPurchaseRequest(){
                let vm = this;
                this.$e.call(main_module.moduleName, main_module.action_Save, "data_m", null, {
                    params: {

                    }
                }).then(res => {
                    console.log('res',res);
                    Toast("生成成功！");
                    vm.ifPurchased = true;

                }).catch(err => {
                    console.log('err',err);
                    Toast("生成失败！");
                })
                
            },

            setRandomCarNo(){
                let random = this.generateMixed(5);
                this.info[0].car_no = random;
            },

            buildSrc (){
                let url = `http://cloud.bfcgj.com:15280/cloud?_amn=${main_module.groupName}&_mn=${main_module.moduleName}&_name=${main_module.action_read}&_rand=0.9726284176919381&_hasdata=0&_type=async&_amgn=${main_module.groupName}&_checkid=${this.$e._checkid}`;
                return url;
            },

            downLoadImg (){
                let arr = [];
                arr.push(this.buildSrc());
                ImagePreview(arr);
                console.log('src', this.buildSrc());
            },


            generateMixed(n) {
                var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                var res = "";
                for (var i = 0; i < n; i++) {
                    var id = Math.floor(Math.random() * 36);
                    res += chars[id];
                }
                return res;
            },


            onClickLeft() {
                document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
                WeixinJSBridge.call('closeWindow');
            },


        
        }

        
    };
</script>

<style>
    body{
        background-color: #f7f8fa;
    }

</style>

<style scoped>

    .panel{
        padding:10px;
    }

    .panel-inner{
        border-radius: 8px;
        overflow : hidden;
    }

    /deep/ .custom-image .van-empty__image {
        width: 90px;
        height: 90px;
    }


    .purchaseImg{
        box-sizing: border-box;
        padding: 0 20px;
    }


</style>

