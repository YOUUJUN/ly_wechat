<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="旧件查询"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-form @submit="onSubmit" ref="form">
                <van-field
                        v-model="phone"
                        name = 'phone'
                        placeholder="请输入手机号码"
                        :rules="[
                          { required: true, message: '请填写您的手机号码！' },
                          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}
                        ]"
                        type="tel"
                        label="联系方式"
                />

                <van-field
                        v-model="sms"
                        name = 'sms'
                        center
                        clearable
                        label="短信验证码"
                        placeholder="请输入短信验证码"
                        :rules="[{ required: true, message: '请输入短信验证码' }]"
                >
                    <template #button>
                        <van-button size="small" type="primary" @click="sendCode()">发送验证码</van-button>
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
        model_name: 'wx_old_part_regist',
        act_send : 'QueryVerifyCode',
        act_post: 'Send',
    };

    export default {
        components : {},

        data() {

            return {
                phone : '',
                sms : '',
            }

        },

        beforeCreate(){
            this.$e = new this.$Engine();
            this.$e._amgn = page_static.model_name;
        },


        created(){
            let is_ok = localStorage.getItem("is_ok");
            let phone = localStorage.getItem("phone");
            console.log('is_ok---->from beforeCreate',is_ok);
            console.log('phone---->from beforeCreate',phone);
            if(is_ok == 1){
                console.log(`----let's go-----`);
                let result = this.getQuery();
                if(result){
                    window.open(`/old_part/${result}`,'_self');
                }

            }
        },


        methods : {

            onClickLeft() {
                document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
                WeixinJSBridge.call('closeWindow');
            },

            onSubmit(values) {
                console.log('submit', this.$e);
                this.$e.call(page_static.model_name, page_static.act_post, null, null, {
                    params : {
                        verifycode : this.sms
                    }
                }).then(res => {
                    console.log('res===>',res);
                    console.log('res.data.envs.is_ok===>',res.envs.is_ok);
                    localStorage.setItem("is_ok",res.envs.is_ok);
                    localStorage.setItem("phone",this.phone);
                    let result = this.getQuery();
                    if(result){
                        window.open(`/old_part/${result}`,'_self');
                    }
                }).catch(err => {
                    console.log('err===>00',err);
                    Toast('验证码验证失败!');
                });
            },

            sendCode(){
                let vm = this;
                this.$refs['form'].validate('phone').then(res => {
                    this.$e.call(page_static.model_name, page_static.act_send, null, null, {
                        params : {
                            tel : this.phone
                        }
                    }).then(res => {
                        Toast('验证码发送成功!');
                    }).catch(err => {
                        Toast('验证码发送失败!');
                    });
                }).catch((err => {
                    Toast(err.message);
                }));
            },

             getQuery() {
                 let search = location.search;
                 let arr = search.split('=');
                 let target = arr[1];
                 if(target){
                     return target;
                 }
                 return false;
            }


        }
    };
</script>
<style>

</style>
