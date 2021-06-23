<template>

    <header>

        <van-nav-bar
                title="选择品牌"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />

    </header>

    <main>




    </main>

    <footer>


    </footer>

</template>

<script>
    export default {
        name: "ChoiceBrand",

        methods : {
            onClickLeft() {
                Toast('返回');
            },
        }
    }
</script>

<style scoped>

</style>
