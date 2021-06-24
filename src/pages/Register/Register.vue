<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="车辆年检帮助服务"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-form @submit="onSubmit">
                <van-field
                        v-model="username"
                        name="姓名"
                        label="姓名"
                        placeholder="请输入您的姓名"
                />
                <van-field
                        v-model="phone"
                        :rules="[
                          { required: true, message: '请填写您的手机号码！' },
                          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}
                        ]"
                        type="tel"
                        label="联系方式"
                />

                <van-field
                        v-model="sms"
                        center
                        clearable
                        label="短信验证码"
                        placeholder="请输入短信验证码"
                        :rules="[{ required: true, message: '请输入短信验证码' }]"
                >
                    <template #button>
                        <van-button size="small" type="primary">发送验证码</van-button>
                    </template>
                </van-field>

                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">提交服务申请</van-button>
                </div>
            </van-form>


        </main>

        <footer>


        </footer>

    </div>
</template>
<script>

    import { Toast } from 'vant';

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
                phone : '',
                sms : '',
            }

        },

        created(){
            console.log("$e",$e);
        },


        methods : {

            onClickLeft() {
                document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
                WeixinJSBridge.call('closeWindow');
            },

            onSubmit(values) {
                console.log('submit', values);
                $e.request(page_static.model_name, 'call', page_static.save_act, page_static.main_ado_name, null, {
                    _amgn: page_static.model_name,
                    success: function () {

                    }
                });
            },

        }
    };
</script>
<style>

    @import "../../assets/css/youjun_base.css";
    @import "~font-awesome\css\font-awesome.min.css";

</style>
