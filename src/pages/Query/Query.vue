<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="旧件购买"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-cell-group>
                <van-field v-model="brand" label="车辆品牌系列" placeholder="请选择品牌系列" />
                <van-field v-model="series" label="年款" placeholder="请输入年款" />

                <van-field
                        v-model="sms"
                        center
                        clearable
                        label="旧件名称"
                        placeholder="请输入旧件名称"
                >
                    <template #button>
                        <van-button size="small" type="primary">搜索</van-button>
                    </template>
                </van-field>

            </van-cell-group>




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
                brand : '',
                series : '',

            }

        },

        created(){

        },


        methods : {


        }
    };
</script>
<style>

    @import "../../assets/css/youjun_base.css";
    @import "~font-awesome\css\font-awesome.min.css";

</style>
