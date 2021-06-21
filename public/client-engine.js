+function ($e) {
    function ActiveModule(name) {
        $e.initActiveCell(this, {
            name: name,
            _amn: name,
            _mn: name
        });
        this.ados = {};
        this.views = {};
        this.viewProps = {};
    }

    ActiveModule.prototype = {
        viewProps: null,
        getADO: function (name) {
            name = name.toLowerCase();
            return name ? this.ados[name] : null;
        },

        getView: function (name) {
            return this.views[name];
        },

        cacheViewProperties: function (name, props) {
            this.viewProps[name.toLowerCase()] = props;
        },

        getViewProperties: function (name) {
            return this.viewProps[name.toLowerCase()];
        },

        removeViewProperties: function (name) {
            return delete this.viewProps[name.toLowerCase()];
        },

        release: function (toserver) {
            for (var j in this.ados) {
                this.ados[j].release();
            }
            for (var j in this.views) {
                this.views[j].release(true);
            }
            if (toserver && !$e.isPublic) {
                $e.request(this.getName(), 'release');
            }
            $e.removeActiveModule(this.name);
        }
    };

    /**
     * 缓存的变量 dbs:按名称(lower)缓存的db views:按名称缓存的views,不区分具体内容和差别 客户端向服务器端请求资源类型包括3类
     * 1、请求资源如view,db等,可采用getView(name),getADO(name)来获取
     * 2、在ADOAgent为同步方式下的删除,增加行数据时的验证和返回数据,由ADOAgent自动调用,synccheck/syncdel
     * 3、执行服务器端指令,可采用同步方式doAction("save","d1,d2"),或异步方式doAsyncAction(action,
     * dbnames, _onLoad)来执行 4、在请求刷新数据时,应采用同步方式doAction("getrefresh","d1,d2");
     * 5、请求分页数据doAction("getfirst[/getpre/getnext/getlast/getpage_n]","view1-1");-1为当前页
     */
    $e.fn.extend({
        ams: {},
        env: {}, // 当前用户的登陆环境变量,如登陆用户名,登陆机构名称等等
        envListen: {}, //{name:[{func:func,source:source}]}
        isPublic: false,
        _inited: false,
        _amgn: '',
        _evts: $e.events.createEventCell(),
        _baseURI: "",

        ModuleCell: {
            getModuleName: function () {
                return this._mn;
            },
            getActiveModuleName: function () {
                return this._amn;
            },
            getName: function () {
                return this.name;
            },
            getView: function (name, amn) {
                return $e.getView(name, amn || this.getActiveModuleName());
            },
            getADO: function (name, amn) {
                name = name || this['adoName'];
                return name ? ($e.getADO(name, amn || this.getActiveModuleName())) : null;
            },

            requestADO: function (name, options) {
                this.request("getado", name, null, null, options);
            },

            call: function (name, ados, jsonparm, options) {
                this.request("call", name, ados, jsonparm, options);
            },

            selfCall: function (name, ados, jsonparm, options) {
                this.request("async", name, ados, jsonparm, options);
            },
            /**
             *
             * @param name
             * @param type getado/getview/getany/call/selfcall/getfile/release
             * @param options
             */
            request: function (type, name, ados, jsondata, options) {
                options = options || {};
                var am = this.getActiveModuleName();
                var cell = null;
                if (type == 'getado') {
                    cell = $e.getADO(name, am);
                }
                if (cell) {
                    if (options.success) {
                        $e.callback(options.success);
                    }
                } else {
                    options.params = options.params || {};
                    options.params._mn = options.params._mn || this.getModuleName();
                    $e.request(this.getActiveModuleName(), type, name, ados, jsondata, options);
                }
            }
        },

        initActiveCell: function (cell, props, extendcell) {
            cell.name = cell.name || props.name;
            cell._mn = props._mn;
            cell._amn = cell._amn || props._amn;
            $e.fn.extend(extendcell || $e.ModuleCell, cell);
        },

        forActiveCell: function (props, cell) {
            cell.name = cell.name || props.name;
            cell._mn = props._mn;
            cell._amn = props._amn;
            return cell;
        },
        /**
         * 获取活动资源对象
         */
        getActiveModule: function (name, autoadd) {
            name = name ? name : this._amgn;
            var am = this.ams[name];
            if ((!am) && !!autoadd) {
                am = new ActiveModule(name);
                this.ams[name] = am;
            }
            return am;
        },
        /**
         * 释放一个或多个业务模型实例
         *
         * @param mname
         */
        releaseActiveModule: function (name, toserver) {
            if (name) {
                var am = this.removeActiveModule[name];
                if (am && (am.name != $e._amgn)) {
                    am.release(!!toserver);
                }
            }
        },

        /**
         * 从缓存中移除一个ActiveModule
         * @param name
         * @returns
         */
        removeActiveModule: function (name) {
            var am = this.ams[name];
            delete this.ams[name];
            return am;
        },

        /**
         *
         * @param amn 活动模块名
         * @param type 请求类型 getado/getview/getany/call/selfcall/getfile/release
         * @param name 请求的资源名或指令名
         * @param adosname 用","分割的数据对象名
         * @param jsondata 发送的json格式数据
         * @param options 如果是请求资源，可以同时申请执行action，在options中，设置{_act:actionName}
         */
        request: function (amn, type, name, adosname, jsondata, options) {
            // 获取需要同步的数据对象action, param, data
            amn = amn || this._amgn;
            var data = this.buildData(amn, adosname, jsondata);
            // 执行服务器端调用,主动分析返回的数据,做相关的处理,顺序是先处理同步数据,再显示同步消息
            // 如1.数据保存后,返回的同步信息
            // 2.在刷新数据对象时,更新本地缓存的数据
            // 3.其他方式下,执行服务器端调用后,同步返回的信息
            var settings = {
                _baseURI: this._baseURI + "cloud?",
                _amgn: this._amgn || options['_amgn'],
                _amn: amn,
                _name: name,
                _type: type,
                _hasdata: (data ? "1" : "0"),
                _checkid: $e.getEnv('_checkid') || ''
            };

            options = options || {};
            if (options.async == undefined) {
                options.async = true;
            }
            if (options.params) {
                $e.fn.extend(options.params, settings, true);
            }
            this.ajax(settings, data, options); //, null, null, options
        },

        /**
         * 这个函数只有一个参数，其他参数应放置在obj的args数组中
         * @param obj
         */
        callback: function (obj) {
            if (obj) {
                var arg = [].slice.apply(arguments, [1]) || [];
                obj = (obj instanceof Array) ? obj : [obj];
                for (var i = 0; i < obj.length; i++) {
                    arg = arg.concat(obj[i].args || []);
                    if ((typeof obj[i]) == 'function') {
                        obj[i].apply($e, arg);
                    } else {
                        obj[i].method.apply(obj[i].context || $e, arg);
                    }
                }
            }
        },

        serialURL: function (url, norand) {
            if ($e.fn.isPlainObject(url)) {
                url = $e.fn.extend(url, {});
                if (!norand) {
                    url._rand = this.randNum();
                }
                var url1 = url._baseURI || (this._baseURI + "cloud?");
                delete url['_baseURI'];
                var type, value;
                var link = url1.indexOf('?') >= 0;
                for (var key in url) {
                    type = (typeof key);
                    if (typeof type == 'string' || type instanceof String) {
                        value = url[key] + '';
                        type = (typeof value);
                        if (type != 'function' && type != 'object' && type != 'array' || value instanceof String) {
                            if (!link) {
                                url1 += "?";
                                link = true;
                            }
                            url1 = url1 + '&' + encodeURIComponent(key) + '=' + encodeURIComponent((value || '') + '');
                        }
                    }
                }
                url = url1.replace('?&', '?');
            }
            return url;
        },

        getURL: function (type, options, hasdata, noid) {
            options = options || {};
            $e.fn.extend({
                _hasdata: $e.fn.getBoolean(hasdata) ? "1" : "0",
                _type: type,
                _amgn: this._amgn,
                _baseURI: this._baseURI + "cloud?",
                _checkid: this.getEnv("_checkid") || ''
            }, options);
            return this.serialURL(options, noid);
        },

        buildData: function (awn, ados, jsondata) {
            var data = {};
            if (ados) {
                data.ados = this.getEditADOData(awn, ados);
            }
            if (jsondata) {
                data.data = jsondata; //(rowsparm instanceof Array)?rowsparm:[rowsparm];
            }
            return $e.fn.isEmptyObject(data) ? null : JSON.stringify(data);
        },

        defa_error: {
            method: function (e1) {
                $e.toast(e1 + '');
                console.log(e1);
            }
        },
        /**
         * 只有不存在指定视图时，才会增加
         * @param view
         * @returns {Boolean}
         */
        addView: function (view) {
            var an = view.getActiveModuleName();
            var am = this.getActiveModule(an, true);
            var name = view.getName();
            if (!am.views[name]) {
                am.views[name] = view;
                var props = am.getViewProperties(name);
                if (props) {
                    am.removeViewProperties(name);
                    if (typeof view['changeProperty'] == 'function') {
                        view.changeProperty(props);
                    }
                }
                return true;
            }
            return false;
        },

        getView: function (name, amn) {
            var am = this.getActiveModule(amn);
            return am ? am.views[name] : null;
        },

        removeView: function (name, amn, view0) {
            var view = this.getView(name, amn);
            if (view && (!view0 || view0 == view)) {
                amn = view.getActiveModuleName();
                var am = this.getActiveModule(amn);
                delete am.views[view.getName()];
                return view;
            }
            return null;
        },

        addADO: function (ado) {
            var an = ado.getActiveModuleName();
            var am = this.getActiveModule(an, true);
            var name = ado.getName().toLowerCase();
            if (!am.ados[name]) {
                am.ados[name] = ado;
            }
        },

        /**
         * db 在容器中的命名与view、jscode不同 ok! ,not test 根据名称获取db
         *
         * @param {}
         *            name
         * @return {}
         */
        requestADO: function (name, amn, options) {
            var ado = this.getADO(name, amn);
            if (!ado) {
                this.request(amn, "getado", name, null, null, options);
            } else if (options && options.success) {
                this.callback(options.success);
            }
        },

        getADO: function (name, amn) {
            var am = this.getActiveModule(amn);
            return am ? am.getADO(name.toLowerCase()) : null;
        },

        removeADO: function (name, amn) {
            var am = this.getActiveModule(amn);
            if (am) {
                name = name.toLowerCase();
                var ado = am.ados[name];
                delete am.ados[name];
                return ado;
            }
            return null;
        },

        getEnvs: function () {
            return this.env;
        },

        /**
         * 获取用户登陆环境变量
         *
         * @param name
         *            变量名称
         * @returns
         */
        getEnv: function (name) {
            return this.env[name];
        },

        removeEnv: function (name) {
            var v = this.env[name];
            delete this.env[name];
            return v;
        },

        setEnv: function (name, value, stope) {
            var oldvalue = this.env[name] || null;
            this.env[name] = value;
            if (!stope) {
                this.doEnvListen(name, value, oldvalue);
            }
        },

        setEnvs: function (map, stope) {
            if (map && !$e.fn.isEmptyObject(map)) {
                var old = $e.fn.extend(this.env, {});
                $e.fn.extend(map, this.env, true);
                if (!stope) {
                    for (var i in map) {
                        this.doEnvListen(i, map[i], old[i] || null, true);
                    }
                }
            }
        },

        doEnvListen: function (name, value, oldvalue) {
            var ls = [].concat(this.envListen[name] || []);
            var arg = [name, value, oldvalue],
                listen, args1;
            for (var i = 0; i < ls.length; i++) {
                listen = ls[i];
                args1 = listen.args ? arg.concat(listen.args) : arg;
                if ((typeof listen) == 'function') {
                    listen(args1);
                } else {
                    listen.method.apply(listen.context || $e, args1);
                }
            }
        },

        /**
         * ls {source:source,func:func}
         */
        addEnvChangedListen: function (name, listen) {
            var ls = this.envListen[name];
            if (!ls) {
                this.envListen[name] = $e.events.createEventCell();
            }
            return ls.add(listen); //handle
        },
        removeEnvChangedListen: function (name, handle) {
            var ls = this.envListen[name];
            if (ls) {
                ls.remove(handle);
            }
        },

        /**
         * web版{}
         */
        open: function (url, pos, ns, repl) {
            if ($e.fn.isPlainObject(url)) {
                if (!url['_baseURI']) {
                    url['_baseURI'] = 'Work.jsp';
                }
                url = this.serialURL(url);
            }
            if (url.indexOf("_rand") < 0) {
                //添加随机数
                url = url + (url.indexOf("?") > 0 ? "&" : "?") + "_rand=" + this.randNum();
            }
            if (arguments.length >= 4) {
                return window.open(url, pos, ns, repl);
            } else if (arguments.length == 3) {
                return window.open(url, pos, ns);
            } else if (arguments.length == 2) {
                return window.open(url, pos);
            } else {
                return window.open(url);
            }
        },

        initModule: function (name, chkid) {
            this.setEnv("_checkid", chkid);
            this._amgn = name;
            $e.getActiveModule(name, true);
        },

        initEnd: function () {
            if (this.isPublic && !this.keepLife) {
                this.request(this._amgn, 'inited');
            }
        },

        getActiveGroupName: function () {
            return this._amgn;
        },

        /**
         * 对从服务器获取的资源,进行解析并处理数据
         *
         * @param {}
         *            s
         */
        loadData: function (s) {
            console.log('---------load---------');
            if (s) {
                if ((typeof (s) === "string") || (s instanceof String)) {
                    if (!s.startsWith("{") || !s.endsWith("}")) {
                        return;
                    }
                }
                var name, amn, ado;
                var cells = JSON.parse(s);
				// if (s.length>10000){
				// 	//console.log('------loadData---1----' + s.substring(0,1000));
				// }

                // 卸载工作的业务模型
                var dump = cells["dump"];
                if (dump) {
                    this.releaseMember(dump);
                }

                // env
                var envs = cells['envs'];

                if (envs && !$e.fn.isEmptyObject(envs)) {
					// var s1=envs['app_img'];
					// if(s1){
					// 	//console.log('------loadData----2---' + s1);
					// 	envs['app_img']='';
					//
					// }

                    if (!$e.fn.isEmptyObject(envs)) {
                        this.setEnvs(envs, true);
                        this.transParent({
                            type: 'env',
                            isParent: false,
                            data: envs,
                            _amgn: this._amgn
                        });
                    }
                }

                var ados = cells['ados'];
                var prop, mkados = [];
                if (ados && ados.length > 0) {
                    //数据对象定义
                    for (var i = 0; i < ados.length; i++) {
                        // 创建db
                        prop = ados[i];
                        if (prop) {
                            name = prop.name;
                            amn = prop._amn;
                            if (!this.getADO(name, amn)) {
                                // 没有建立ycdb
                                ado = new $e.ADOAgent(name);
                                ado.init(prop);
                                this.addADO(ado);
                                mkados.push(ado);
                            }
                        }
                    }
                }

                var ds = '';
                // data,初始是reload
                var data = cells['data'];
                if (data && data.length > 0) {
                    // 一个或多个ADOAgent的数据
                    ds = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]) {
                            name = data[i].name;
                            amn = data[i]._amn;
                            ado = this.getADO(name, amn);
                            if (ado) {
                                ado.loadData(data[i]);
                                ds.push(ado);
                            } else {
                                this.transParent({
                                    type: 'ado',
                                    isParent: false,
                                    data: data[i],
                                    name: name,
                                    _amn: amn,
                                    _amgn: this._amgn
                                });
                            }
                        }
                    }
                }

                // 下拉列表或其他代码表值@version:2.0 2012.11.3
                var vs, ld = cells["view_or"];
                if (ld) {
                    for (amn in ld) {
                        vs = ld[amn];
                        for (var vn in vs) {
                            view = $e.getView(vn, amn);
                            if (view) {
                                if (view.changeProperty) {
                                    view.changeProperty(vs[vn]['_child_or'] ? vs[vn]['_child_or'] : vs[vn]);
                                }
                            } else {
                                this.getActiveModule(amn, true).cacheViewProperties(vn, vs[vn]['_child_or'] ? vs[vn]['_child_or'] : vs[vn]);
                            }
                        }
                    }
                }

                this.endLoadData(ds, envs);


                //console.log('----------load-------' + JSON.stringify(cells));

                // 错误信息
                var msg = cells["error"];
                if (msg) {
                    this.showMessage('系统错误', msg);
                    throw msg;
                } else {
                    // message
                    msg = cells["msg"];
                    //console.log('-----------------' + msg);
                    if (msg) {
                        this.showMessage('系统提示', msg);
                    }
                }
            }
        },

        endLoadData: function (ds, envs) {
            if (ds) {
                for (var i = 0; i < ds.length; i++) {
                    ds[i].doDelayListen();
                }
            }
            // 环境变量变动,再次覆盖，激活事件
            if (envs && !$e.fn.isEmptyObject(envs)) {
                this.setEnvs(envs);
            }
        },

        releaseMember: function (dump) {
            var r1, m1;
            for (var i in dump) {
                r1 = dump[i]; //name,am,child
                if (i == 'ado') {
                    for (var j = 0; j < r1.length; j++) {
                        m1 = this.getADO(r1[j][0], r1[j][1]);
                        if (m1) {
                            m1.release();
                        }
                    }
                } else if (i == 'view') {
                    for (var j = 0; j < r1.length; j++) {
                        m1 = this.getView(r1[j][0], r1[j][1]);
                        if (m1) {
                            m1.release(false, r1[j][2] == '1');
                        }
                    }
                } else if (i == 'module') {
                    for (var j = 0; j < r1.length; j++) {
                        this.releaseActiveModule(r1[j][0]);
                    }
                }
            }
        },

        /**
         * k,not test 获取多个ADOAgent的变动数据,自动采用别名方式
         *
         * @param {}
         *            dbs
         * @return {}
         */
        getEditADOData: function (wn, ados) {
            var data = [];
            if (ados) {
                var ado, names, amn, name, p;
                names = (ados instanceof Array) ? ados : ados.split(",");
                for (var i = 0; i < names.length; i++) {
                    p = names[i].indexOf("/");
                    if (p >= 0) {
                        amn = names[i].substring(0, p);
                        name = names[i].substring(p + 1);
                    } else {
                        amn = wn;
                        name = names[i];
                    }
                    ado = $e.getADO(name, amn);
                    if (ado) {
                        // 此处只有存在该数据对象时,才获取同步数据
                        var adata = ado.getUpdateData();
                        if (adata) {
                            data.push(adata);
                        }
                    }
                }
            }
            return data;
        },

        // 产生随机数,ok
        randNum: function () {
            var today = new Date();
            return Math.abs(Math.sin(today.getTime()));
        },

        release: function () {
            if (this._evts) {
                if (!this.isPublic) {
                    // var url = this.getURL('release');
                    this.request(this._amgn, 'release');
                }
                // 清除所有缓存的变量
                if (this.ams) {
                    for (var i in this.ams) {
                        this.ams[i].release();
                    }
                    this.ams = null;
                }
                this.env = null;
                this.envListen = null;
                this._evts.release();
                this._evts = null;
            }
        }
    }, $e);
}($e);

/**
 * success,参数可以是函数/数组/对象
 */
+(function ($, $e) {
    var _ios = navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/) || navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/);
    $e.os = {
        ios: _ios,
        android: !_ios,
        version: 1.0,
        ipad: false
    };
    $e.ids = {};
    $e._FIELD_ENABLE = !_ios;

    /**
     *
     * @param parentid
     * @param amgn
     * @param amn 必需的
     * @param options 可以有_act参数，执行方法名(不能请求其他资源，如getADO)
     */
    $e.init = function (amgn, amn, checkid, options) {
        //console.log(amgn + ', ' + amn + ', ' + checkid + ', ' + JSON.stringify(options))
        if (!amgn) {
            amgn = amn;
        }
        $e.getActiveModule(amn, true);
        if (!this._inited || (amgn != this._amgn) || !this.getEnv("_checkid") || (checkid && (checkid != this.getEnv("_checkid")))) {
            if (checkid) {
                $e.setEnv('_checkid', checkid);
            }
            options = options ? $e.fn.extend(options, {}) : {};
            options.params = options.params || {};

            options.params._amn = amn ? amn : amgn;
            if (this.getEnv("_checkid")) {
                options._checkid = this.getEnv("_checkid");
            }
            this._amgn = amgn;
            if (!options.success) {
                options.success = $e.initEnd;
                options.context = $e;
            } else {
                options.success = [$e.initEnd, options.success];
            }

            //options._act
            this.request(amn, "reg_am", options._act ? options._act : '', null, null, options);
        } else {
            if (options && !!options._act) {
                $e.request(amn, 'call', options._act, null, null, options);
            }
        }
        return true;
    },

        // $e.getParent = function () {
        //     var v1 = null;
        //     if ($e.ids.parentID) {
        //         v1 = plus.webview.getWebviewById($e.ids.parentID);
        //     }
        //     return v1 ? v1 : plus.webview.currentWebview().opener();
        // };

    $e.transParent = function (options) {
        // console.log('=============_amgn=====1===' + options['_amgn']);
        // console.log('=============_amgn=====2===' + this._amgn);

        if (!this._amgn || (this._amgn !== options['_amgn'])) {
            return false;
        }

//         for (var key in options) {
//             console.log('=============key========' + key + '==============value===============' + options[key]);
//         }
//
//         console.log('=============NAME========' + options.name);
//         console.log('=============_amn========' + options._amn);
//         console.log('=============parent========' + options.isParent);

        if (!!options.isParent) {
            if (options.type == 'env') {
                this.setEnvs(options.data);
            } else if (options.type == 'ado') {
                var ado = $e.getADO(options.name, options._amn);
                //console.log('=============NAME========' + ado.getName() + "==============MODULE=======" + ado.getActiveModuleName());
                if (ado) {
                    ado.loadData(options.data);
                    ado.doDelayListen();
                    return true;
                }
            }
        } else {
            options.isParent = true;
            options._amgn = this._amgn;
        }
        if (this._amgn == options['_amgn']) { //&& (this._amgn!=options.amn)
            var webview = this.getParent();
            if (webview) {
                $.fire(webview, 'transport', options);
            }
        }
        return true;
    };

    if (!$e._inited) {
        window.addEventListener('transport', function (event) {
            $e.transParent(event.detail);
        });

        window.addEventListener('pageInit', function (event) {
            if ((typeof pageInit) == 'function') {
                pageInit(event);
            }
        });
        /**
         * 相应调用者，使被调用page的初始化标志设置为true
         */
        // window.addEventListener('transInit', function (event) {
        //     var data = event.detail;
        //     var view = plus.webview.getWebviewById(data.id);
        //     view._inited = true;
        // });

        /**
         * 通知调用者,本页面加载完成
         */
        // window.addEventListener('pagebeforeshow', function (e) {
        //     var pid = window.localStorage.getItem('__openid__');
        //     var cid = plus.webview.currentWebview().id;
        //     if (pid && pid.endsWith('/' + cid)) {
        //         $e.ids.parentID = pid.substring(0, pid.length - cid.length - 1);
        //     }
        //     $e.ids.id = cid; //当前view的id
        //     var webview = $e.getParent();
        //     if (webview) {
        //         $.fire(webview, 'transInit', {
        //             id: $e.ids.id
        //         });
        //     }
        // });
        //
        // window.addEventListener('load', function (e) {
        //     mui.plusReady(function () {
        //         plus.webview.currentWebview()._inited = true;
        //     });
        // });
    }
    ;

    $e.showMessage = function (title, msg, fun) {
        $.alert(msg, title, fun);
    };

    $e.toast = function (msg) {
        $.toast(msg);
    };
    /**
     * 一般情况下,options应包含_amn名
     */
    $e.openWindow = function (id, url, options) {
        if (typeof id == 'object') {
            options = id;
            id = options.id;
            url = url || options.url;
        }
        var webview_style = {
            popGesture: "close"
        };
        var setting = {
            id: id,
            url: url,
            styles: webview_style,
            show: {
                aniShow: 'pop-in'
            },
            waiting: {
                autoShow: false
            },
            extras: null
        };

        $e.fn.extend(options, setting, true);
        var module = {
            amn: this._amn,
            _checkid: this.getEnv('_checkid')
        };
        if (!!setting.module) {
            $e.fn.extend(setting.module, module, true);
        }
        setting['module'] = module;

        if (!!$e.ids.id) {
            //保存当前page的ID,供被打开page获取本page的handle，
            window.localStorage.setItem('__openid__', $e.ids.id + '/' + id);
        }
        var params = setting['params'];
        if (!params) {
            params = {};
            setting['params'] = params;
        }
        params._amgn = params._amgn || $e._amgn;
        params._checkid = params._checkid || $e.getEnv('_checkid');

        var win = $.openWindow(setting);
        if (!$e.os.ios) {
            $.fire(win, 'pageInit', setting);

        } else {
            setTimeout(function () {
                if (!!win._inited) {
                    $.fire(win, 'pageInit', setting);
                } else {
                    setTimeout(arguments.callee, 20);
                }
            }, 20);
        }
        return win;
    };

    // $e._baseURI = 'http://erp.bfcgj.com/';
    $e._baseURI = 'http://60.173.9.77:15280/';
    //$e._baseURI = 'http://60.173.9.72/';


    var beforeSend = function (xhr, options) {
        var title = (options && !!options.title) ? options.title : '正在加载...';
        //plus.nativeUI.showWaiting(title);
        return true;
    };

    var complete = function (type) {
        //plus.nativeUI.closeWaiting();
    };

    var nodo = function () {
    };

    var settings = {
        crossDomain: false,
        dataType: 'json', // 服务器返回xml,json格式数据
        headers: {
            charset: "UTF-8",
            contentType: "application/json"
        },
        type: 'POST', // HTTP请求类型
        timeout: 120000, // 超时时间设置为2分钟；
        beforeSend: beforeSend,
        complete: complete,
        async: true
    };

    /**
     *
     * @param {Object} url
     * @param {Object} data
     * @param {Object} options {context:null,success:method,error:method,setting:{}}
     */
    $e.ajax = function (url, data, options) {
        options = options ? $e.fn.extend(options, {}) : {};
        var setting = options['setting'] || {};
        $e.fn.extend(settings, setting);

        url = $e.serialURL(url, false);
        var context = options.context || $e;

        var successobj = options.success || nodo;
        var errorobj = options.error || nodo;

        var error = function (type, text, event) {
            if (errorobj) {
                errorobj.call(context, type, text);
            } else {
                parseError(type, text);
            }
            complete("error");
        };
        var success = function (pdata) {
            complete("success");
            console.log('ajax success response----------->:' + pdata);

            if (pdata && (typeof pdata == 'string') && (setting.dataType == 'json')) {
                try {
                    $e.loadData(pdata);
                } catch (e) {
                    errorobj.call(context, e);
                    return;
                }
            }

            if (successobj) {
                if (successobj instanceof Array) {
                    for (var i = 0; i < successobj.length; i++) {
                        successobj[i].call(context, pdata, setting);
                    }
                } else {
                    successobj.call(context, pdata, setting);
                }
            }
        };

        var abortTime = 0;
        var xhr = new window.XMLHttpRequest();
        var httptype = setting.type || 'POST';

        console.log("ajax -------------> url:" + url);
        xhr.open(httptype, url, setting.async);
        xhr.setRequestHeader("Charset", setting.headers.charset || 'UTF-8');
        xhr.setRequestHeader("Content-Type", setting.headers.contentType);

        if (setting.data) {
            xhr.setRequestHeader("Content-length", data.length);
        }

        var reponse = function (xhr1) {
            if (xhr1.readyState === 4) {
                xhr1.onreadystatechange = nodo;
                if (abortTime > 0)
                    clearTimeout(abortTime);
                if ((xhr1.status >= 200 && xhr1.status < 300) || xhr1.status === 304 || (xhr1.status === 0 && xhr1.responseText)) {
                    success(xhr1.responseText);
                } else {
                    var type = (xhr1.status || xhr1.status === 0) ? 'error' : 'abort';
                    var text = (type == 'error') ? xhr1.responseText : (xhr1.statusText || null);
                    error(type, text);
                }
            }
        };
        if (setting.async) {
            xhr.onreadystatechange = function () {
                reponse(xhr);
            };
        }
        if (setting.beforeSend(xhr, setting) === false) {
            xhr.abort();
            return false;
        }

        if (setting.timeout > 0) {
            abortTime = setTimeout(function () {
                xhr.onreadystatechange = nodo;
                xhr.abort();
                error('timeout');
            }, settings.timeout);
        }

        console.log('ajax send data ------------------>:' + data);

        xhr.send(data ? data : null);
        if (!setting.async) {
            reponse(xhr);
        }
        return true;
    };

    function parseError(type, text) {
        if (type == 'timeout') {
            $.toast('连接服务器超时,请检查网络是否畅通！');
        } else if (type == 'abort') {
            $.toast('请求中止 !!！');
        } else if (type == 'parse-error') {
            $.toast('解析返回结果失败！');
        } else if (type == 'error') {
            console.log("error:" + text);
            $.toast('连接服务器失败！');
        } else {
            $.toast('未知异常!');
        }
    }
})(mui, $e);
