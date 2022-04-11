// const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

const buildPageSync = () => {
    let pages = {};
    let pagesPath = path.join(__dirname,"/src/pages");

    let files = fs.readdirSync(pagesPath);

    for(let file of files){
        let filePath = path.join(pagesPath,file);
        let page = {};
        let stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            let entry = path.posix.join("src/pages", file,file.concat('.js'));
            page.entry = entry;
            page.template = path.posix.join("src/pages", file,file.concat('.html'));
            if(process.env.NODE_ENV === "development"){
                page.filename = file.concat('.html');
            }else{
                page.filename = "./".concat(file,'.html');
            }
            // page.filename = file.concat('.html');
            pages[file] = page;
        }

    }

    return pages;
};

let cdnBaseHttp = 'https://cdn.jsdelivr.net/npm';

let externalConfig = [
    {name : 'vue', scope: 'Vue', js: 'vue.min.js'},
    {name : 'vue-router', scope: 'VueRouter', js: 'vue-router.min.js'},
];

let getModulesVersion = () => {
    let json = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return json.dependencies;
}

let getExternalModules = (config) =>{
    let externals = {};
    let dependencieModules = getModulesVersion();
    config.forEach((item) => {
        if(item.name in dependencieModules){
            let version = dependencieModules[item.name];
            if(item.css){
                item.css = `${cdnBaseHttp}/${item.name}@${version}/${item.css}`;
            }

            if(item.js){
                item.js = `${cdnBaseHttp}/${item.name}@${version}`;
            }

            externals[item.name] = item.scope;
        }else{
            throw new Error('相关依赖未安装，请先执行npm install ' + item.name);
        }
    })

    return externals;
}

let externalModules = getExternalModules(externalConfig);

delete require.cache[module.id];

module.exports = function(){
    return {
        publicPath : '/',
        outputDir : './dist/vue-public',
        assetsDir : "static",
        filenameHashing : true,
        pages : buildPageSync(),
        devServer : {
            port : 8080,
            hot : true,
            open: false, //是否自动打开浏览器
        },
        productionSourceMap : true, //开启后出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。关闭可以减少打包体积
        configureWebpack : {
            plugins : [

                new webpack.ProvidePlugin({
                    $ : "jquery",
                    jquery : "jquery"
                }),

                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

                // 配置compression-webpack-plugin压缩
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            ],

            externals : externalModules

        },

        chainWebpack: config => {
            const entry = Object.keys(buildPageSync());
            for (const iterator of entry) {
                config
                    .plugin(`html-${iterator}`)
                    .tap(args => {
                        console.log("args",args);
                        args[0].cdnConfig = externalConfig;
                        return args
                    })
            }
        }
    }
};





