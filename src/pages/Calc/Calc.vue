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
                            v-model="username"
                            name="三钢上月包块均价(元/公斤)"
                            label="三钢上月包块均价(元/公斤)"
                            label-width="120"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
                    />

                    <van-field
                            v-model="username"
                            name="车辆整备质量(公斤)"
                            label="车辆整备质量(公斤)"
                            label-width="120"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
                    />

                    <van-field
                            v-model="username"
                            name="扣杂率(20%)"
                            label="扣杂率(20%)"
                            label-width="120"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
                    />

                    <van-field
                            v-model="username"
                            name="服务费率(15%)"
                            label="服务费率(15%)"
                            label-width="120"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
                    />

                    <van-field
                            v-model="username"
                            name="距离最近门店的距离(公里)"
                            label="距离最近门店的距离(公里)"
                            label-width="120"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
                    />

                    <van-field
                            v-model="username"
                            name="三元催化是否完整"
                            label="三元催化是否完整"
                            label-width="120"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
                    />


                    <van-field
                            v-model="username"
                            name="电瓶是否完整"
                            label="电瓶是否完整"
                            label-width="120"
                            placeholder="用户名"
                            :rules="[{ required: true, message: '请填写用户名' }]"
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

                </div>

                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">查看估价</van-button>
                </div>

            </van-form>


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


</style>



