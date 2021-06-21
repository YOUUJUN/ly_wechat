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

            <van-cell-group class="panel">
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


            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                >
                    <van-cell v-for="item in list" :key="item" :title="item" />
                </van-list>
            </van-pull-refresh>


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


                list: [1,2,3,4,5,6,7,8],
                loading: false,
                finished: false,
                refreshing: false,
            }

        },

        created(){

        },


        methods : {

            onLoad() {
                setTimeout(() => {
                    if (this.refreshing) {
                        this.list = [1,2,3,4,5,6,7,8];
                        this.refreshing = false;
                    }

                    for (let i = 0; i < 10; i++) {
                        this.list.push(this.list.length + 1);
                    }
                    console.log('list',this.list);
                    this.loading = false;

                    if (this.list.length >= 40) {
                        this.finished = true;
                    }
                }, 1000);
            },
            onRefresh() {
                // 清空列表数据
                this.finished = false;

                // 重新加载数据
                // 将 loading 设置为 true，表示处于加载状态
                this.loading = true;
                this.onLoad();
            },


        }
    };
</script>
<style>

    .panel{
        padding:6px;
        background-color: #ddd !important;
    }

</style>
