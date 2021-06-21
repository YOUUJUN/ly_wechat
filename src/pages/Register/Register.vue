<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="注册"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-form @submit="onSubmit">
                <van-field
                        v-model="username"
                        name="昵称"
                        label="昵称"
                        placeholder="用户名"
                        :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                        v-model="phone"
                        required
                        label="手机号"
                        placeholder="请输入手机号"
                        error-message="手机号格式错误"
                />

                <van-field
                        v-model="sms"
                        center
                        clearable
                        label="短信验证码"
                        placeholder="请输入短信验证码"
                >
                    <template #button>
                        <van-button size="small" type="primary">发送验证码</van-button>
                    </template>
                </van-field>

                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">提交</van-button>
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
        model_name: 'wx_old_part_regist',
        main_ado_name: 'wx_user',
        save_act: 'Save',
        add_act: 'Add',
    };

    export default {
        components : {},

        data() {

            return {
                username: '',
                password: '',
                sms : '',
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
