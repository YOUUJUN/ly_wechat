<template>
    <div id="app">

        <!--        <router-view></router-view>-->

        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive"></router-view>


    </div>
</template>
<script>

    import { Toast } from 'vant';

    const index = () => import("./private/Index.vue");

    export default {
        name : "Entire",

        components : {index},

        data() {

            return {}

        },

        computed : {


        },


        methods : {

        }


    };
</script>

<style>

    body {
        background-color: #f7f8fa;
    }

</style>

<style scoped>

    .panel {
        padding: 7px;
        background-color: #f7f8fa;

    }

    .panel-body{
        border-radius: 8px;
        overflow: hidden;
    }

</style>
