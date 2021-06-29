<template>

    <div>

        <header>

            <van-nav-bar
                    title="整车配件详情"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-swipe :autoplay="4000" class="swipe">
                <van-swipe-item v-for="(image, index) in images" :key="index">
                    <img class="swipe-item" v-lazy="image" />
                </van-swipe-item>
            </van-swipe>

            <van-form @submit="onSubmit" v-if="true">
                <van-field name="radio" label="物料名称">
                    <template #input>
                        <span>发动机总成</span>
                    </template>
                </van-field>
                <van-field name="radio" label="品牌">
                    <template #input>
                        <span>别克</span>
                    </template>
                </van-field>
                <van-field name="radio" label="系列">
                    <template #input>
                        <span>君威</span>
                    </template>
                </van-field>
                <van-field name="radio" label="年款">
                    <template #input>
                        <span>2002</span>
                    </template>
                </van-field>
            </van-form>

            <h2 class="title">已卖件信息</h2>




        </main>

        <footer>

        </footer>

    </div>

</template>

<script>

    const detail_module = {
        moduleName: 'wx_car_show_bill',
        action_edit: 'Edit',
        list_ado_name: 'data_m',
        img_ado_name: 'data_d',
    };

    export default {
        name: "Detail",

        data() {
            return {
                images: [
                    'https://img01.yzcdn.cn/vant/apple-1.jpg',
                    'https://img01.yzcdn.cn/vant/apple-2.jpg',
                    'https://img01.yzcdn.cn/vant/apple-3.jpg',
                ],

                dataList : [],
                imgList : []
            };
        },

        methods : {
            onClickLeft() {
                this.$router.go(-1);
            },
        }
    }
</script>

<style scoped>

    .swipe-item{
        width:100%;
        height: 215px;
    }

    .title{
        margin: 0;
        padding: 20px 16px 16px;
        color: rgba(69, 90, 100, 0.6);
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
    }

</style>
