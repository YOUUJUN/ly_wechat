<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="旧车回收价格查询"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <h2 class="title">我的报废车值多少钱?</h2>

            <van-form @submit="onSubmit" class="panel">

                <div class="panel-body">

                    <van-field
                            v-model="price"
                            name="三钢上月包块均价(元/公斤)"
                            label="三钢上月包块均价(元/公斤)"
                            label-width="120"
                    />

                    <van-field
                            v-model="weight"
                            name="车辆整备质量(公斤)"
                            label="车辆整备质量(公斤)"
                            label-width="120"
                            placeholder="输入车辆整备质量"
                            :rules="[{ required: true, message: '请输入车辆整备质量' }]"
                    />

                    <van-field
                            v-model="impurity"
                            name="扣杂率(20%)"
                            label="扣杂率(20%)"
                            label-width="120"
                    />

                    <van-field
                            v-model="serviceFee"
                            name="服务费率(15%)"
                            label="服务费率(15%)"
                            label-width="120"
                    />

                    <van-field
                            v-model="distance"
                            name="距离最近门店的距离(公里)"
                            label="距离最近门店的距离(公里)"
                            label-width="120"
                            type="number"
                            placeholder="请输入距离，自送输0"
                            :rules="[{ required: true, message: '请输入距离，自送输0' }]"
                    />

                    <van-field
                            readonly
                            clickable
                            name="picker"
                            :value="ifTWC"
                            label="三元催化是否完整"
                            label-width="120"
                            placeholder="选择是否完整"
                            @click="showTWCPicker = true"
                            :rules="[{ required: true, message: '请选择是否完整' }]"
                    />
                    <van-popup v-model="showTWCPicker" position="bottom">
                        <van-picker
                                show-toolbar
                                :columns="batteryColumns"
                                @confirm="onTWCConfirm"
                                @cancel="showTWCPicker = false"
                        />
                    </van-popup>


                    <van-field
                            readonly
                            clickable
                            name="picker"
                            :value="ifBattery"
                            label="电瓶是否完整"
                            label-width="120"
                            placeholder="选择是否完整"
                            @click="showBatterPicker = true"
                            :rules="[{ required: true, message: '请选择是否完整' }]"
                    />
                    <van-popup v-model="showBatterPicker" position="bottom">
                        <van-picker
                                show-toolbar
                                :columns="batteryColumns2"
                                @confirm="onBatteryConfirm"
                                @cancel="showBatterPicker = false"
                        />
                    </van-popup>

                </div>

                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">查看估价</van-button>
                </div>

            </van-form>


            <van-popup v-model="showResult" :round="true">
                <div class="result-panel">
                    <div>您的老旧车价值：</div>
                    <div style="text-align: center;color:red;margin-top:8px;">{{result}}元</div>
                </div>
            </van-popup>


            <div class="alert">

                <p>1.三钢上月包块均价指的是：三个月三明三钢废铁包块的均价,取平均值</p>
                <p>2.车辆整备质量：请查阅车辆行驶证副页上的“整备质量”</p>
                <p>3.扣杂率：即车辆废铁之外的重量</p>
                <p>4.服务费率：即收购点收购车辆、办理手续等服务的费率</p>
                <p>5.距离最近门店的距离：车辆停放处距离所选择的门店的记录，参考高德、百度、腾讯等地图。若选择自己开车到最近门店，则距离填0。</p>
                <p>6.三元催化是否完整：若没有拆过，则选择“完整”，否则选择“缺失”</p>
                <p>7.电瓶是否完整：若没有拆过，则选择“完整”，否则选择“缺失”</p>

            </div>


        </main>

        <footer>


        </footer>

    </div>
</template>
<script>

    import { Toast } from 'vant';

    // const page_static = {
    //     model_name: 'wx_old_part_regist',
    //     main_ado_name: 'wx_user',
    //     save_act: 'Save',
    //     add_act: 'Add',
    // };

    const page_static = {
        model_name: 'clock_in_empl',
        main_ado_name: 'SARS_EMPL',
        save_act: 'Regist',
        add_act: 'Add',
    };

    export default {
        components : {},

        data() {

            return {
                username: '',
                password: '',
                sms : '',
                ifBattery : '',
                ifTWC : '',
                distance : '',
                serviceFee : '15%',
                impurity : '20%',
                weight : '',
                price : 300,


                batteryColumns: ['完整', '缺失'],
                batteryColumns2 : ['完整', '缺失'],
                showBatterPicker : false,
                showTWCPicker : false,
                showResult : false,

                result : '',
            }

        },

        created(){
            console.log("$e",$e);
        },


        methods : {

            onClickLeft() {
                Toast('返回');
            },

            onSubmit(values) {
                this.doCalc();
                // $e.request(page_static.model_name, 'call', page_static.save_act, page_static.main_ado_name, null, {
                //     _amgn: page_static.model_name,
                //     success: function () {
                //
                //     }
                // });
            },



            onBatteryConfirm(value, index) {
                this.ifBattery = value;
                this.showBatterPicker = false;
            },

            onTWCConfirm(value, index) {
                this.ifTWC = value;
                this.showTWCPicker = false;
            },

            doCalc(){
                // 整备质量*三钢上月包块均价*(1-扣杂率)*（1-服务费率）-运费-完整率扣款
                let carriage = 20;
                let Debit = 10;

                let result = this.weight * this.price * (1 - 0.15) * (1 - 0.2) - carriage - Debit;
                this.result = result;
                // Toast(result);
                this.showResult = true;
            }

        }
    };
</script>
<style>

    body{
        background-color: #f7f8fa;
    }

</style>

<style scoped>

    .title{
        text-align: center;
        font-size: 19px;
    }

    .panel {
        padding: 7px;

    }

    .panel-body{
        border-radius: 8px;
        overflow: hidden;
    }

    .alert{
        font-size: 15px;
        color: rgba(0,0,0,0.6);
        margin: 0 15px 15px 15px;
        background: #fff;
        padding: 5px 20px;
        border-radius: 7px;
    }

    .result-panel{
        padding:20px;

    }

</style>



