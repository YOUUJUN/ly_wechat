/**
 * Created by yong on 2016/1/5 0005.
 */

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/gm, '');
    };
}
if (!String.prototype.trimLeft) {
    String.prototype.trimLeft = function () {
        return this.replace(/^\s+/g, '');
    };
}

if (!String.prototype.trimRight) {
    String.prototype.trimRight = function () {
        return this.replace(/\s+$/g, '');
    };
}

if (!String.prototype.fillText) {
    String.prototype.fillText = function (n) {
        var s1 = this;
        for (var i = 1; i < n; i++) {
            s1 += this;
        }
        return s1;
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        if (str.length > this.length) {
            return false;
        } else {
            for (var i = 0; i < str.length; i++) {
                if (this.charAt(i) != str.charAt(i)) {
                    return false;
                }
            }
            return true;
        }
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str) {
        if (str.length > this.length) {
            return false;
        } else {
            var start = this.length - str.length;
            for (var i = 0; i < str.length; i++) {
                if (this.charAt(start) != str.charAt(i)) {
                    return false;
                }
            }
            return true;
        }
    };
}

if (!Array.prototype.exchange) {
    Array.prototype.exchange = function (x, y) {
        var a = this[x];
        this[x] = this[y];
        this[y] = a;
    };
}
//fill() 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素
if (!Array.prototype.fill) {
    Array.prototype.fill = function (c) {
        for (var i = 0; i < this.length; i++) {
            this[i] = c;
        }
    };
}
if (!Array.prototype.search) {
    /**
     * 对元素使用制定的method或属性值进行查找
     * @param method 应用的方法体或属性名
     * @param value 属性值
     * @returns {number}
     */
    Array.prototype.search = function (method, value) {
        for (var i = 0; i < this.length; i++) {
            if ($e.fn.test(this[i], method, value)) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elem, fromindex) {
        var f = fromindex ? fromindex : 0;
        for (var i = f; i < this.length; i++) {
            if (this[i] == elem) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (elem, lastindex) {
        lastindex = lastindex || 0;
        lastindex = (lastindex < 0 || lastindex >= this.length) ? this.length - 1 : lastindex;
        for (var i = lastindex; i >= 0; i--) {
            if (this[i] == elem) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.rangeCheck) {
    Array.prototype.rangeCheck = function (i) {
        if ((this.length > 0) && (i >= 0 && i < this.length)) {
            return true;
        }
        return false;
    };
}

/**
 * 返回移到指定行的index
 */
if (!Array.prototype.move) {
    Array.prototype.move = function (from, to) {
        if (this.rangeCheck(from) && (to < 0 || this.rangeCheck(to))) {
            if (from != to) {
                var v1 = this[from];
                this.splice(from, 1);
                if (to < 0) {
                    this.push(v1);
                    return this.length - 1;
                } else {
                    this.splice(to, 0, v1);
                    return to;
                }
            }
        }
        return -1;
    };
}
(function () {
    var slice = Array.prototype.slice;
    try {
        slice.call(document.documentElement);
    } catch (e) {
        Array.prototype.slice = function (start, end) {
            start = start || 0;
            end = (typeof end !== 'undefined') ? end : this.length;
            if (Object.prototype.toString.call(this) === '[object Array]') {
                return slice.call(this, start, end);
            }
            start = Math.max(0, start);
            end = Math.min(end, this.length);
            var size = end - start;
            if (size > 0) {
                var arr = new Array(size);
                if (this.charAt) {
                    for (i = 0; i < size; arr[i] = this.charAt(start + i++)) ;
                } else {
                    for (i = 0; i < size; arr[i] = this[start + i++]) ;
                }
                return arr;
            }
            return [];
        };
    }
}());


var $e = $e || {};
+function ($e) {
    $e.os = {
        ie: (!!window.ActiveXObject || "ActiveXObject" in window),
        android: false,
        ios: true
    };

    /**
     * 对注册事件集中管理的对象
     * @constructor
     */
    function EventCell() {
        this._evts = {};
    }

    EventCell.prototype = {
        /**
         * 添加注册的事件对象
         */
        add: function (eventobj) {
            if (!eventobj['handle']) {
                eventobj.handle = $e.events.nextHandle();
            }
            this._evts[eventobj.handle] = eventobj;
            return eventobj.handle;
        },
        done: function () {
            var arg1, cell;
            var arg = [].slice.apply(arguments);
            for (var i in this._evts) {
                cell = this._evts[i];
                arg1 = arg.concat(cell.args || []);
                if (cell.method.apply(cell.context, arg1) === false) {
                    break;
                }
            }
        },

        /**
         * 卸载所有的注册事件
         */
        release: function () {
            if (this._evts) {
                for (var i in this._evts) {
                    this.remove(i);
                }
            }
            this._evts = null;
        },
        /**
         * 根据handle,移除某个注册事件
         */
        remove: function (handle) {
            var listen = this._evts[handle];
            if (listen) {
                if (listen.source) {
                    $e.events.removeEvent(listen.source, listen.eventType, handle);
                }
                delete this._evts[handle];
            }
        }
    };

    $e.events = {
        _handle: 0,
        nextHandle: function () {
            var h = ++this._handle;
            return "e" + h;
        },
        /**
         *
         * @param obj 事件所在的对象 如某个 element
         * @param eventtype 事件类型 如click
         * @param context 方法/函数运行所在的对象
         * @param func 运行的方法/函数
         * @returns
         */
        regEvent: function (obj, eventtype, context, method) {
            if (method && eventtype) {
                if (!obj._evts) {
                    obj._evts = {};
                }
                eventtype = this.realName(eventtype);
                if (!obj._evts[eventtype]) {
                    obj._evts[eventtype] = {};
                    obj[eventtype] = new Function('e_', "return ($e.events.doEvent(this,'" + eventtype + "',(e_ || window.event))) !==false;");
                }
                var handle = this.nextHandle();
                var eventobj = {
                    source: obj,
                    context: context,
                    handle: handle,
                    eventType: eventtype,
                    method: method,
                    args: [].slice.apply(arguments, [4]) || []
                };
                obj._evts[eventtype][handle] = eventobj;
                return eventobj;
            }
        },

        call: function (obj) {
            var arg = [].slice.apply(arguments, [1]) || [];
            if ((typeof obj) == 'function') {
                obj.apply($e, arg);
            } else {
                arg = arg.concat(obj.args || []);
                obj.method.apply(obj.context || $e, arg);
            }
        },
        /**
         * 执行事件
         *
         * @param obj
         * @param etype
         * @param p...此处虚拟了4个参数
         */
        doEvent: function (obj, eventtype, event) {
            if (obj._evts) {
                eventtype = this.realName(eventtype);
                var fs = obj._evts[eventtype];
                if (fs) {
                    var result = true;
                    var arg = arguments.length > 2 ? [].slice.apply(arguments, [2]) : [];
                    for (var i in fs) {
                        result = (fs[i].method.apply(fs[i].context || $e, arg.concat(fs[i].args || [])) !== false);
                        if (!result && event) {
                            this.cancelEvent(event, true);
                        }
                    }
                    return result;
                }
            }
            return true;
        },

        /**
         * 删除某对象上注册的一个事件或某类型事件
         *
         * @param obj
         * @param etype
         *            类型
         * @param hdln
         *            方法
         * @returns
         */
        removeEvent: function (obj, eventtype, handle) {
            eventtype = this.realName(eventtype);
            if (obj && obj._evts && obj._evts[eventtype]) {
                if (handle) {
                    delete obj._evts[eventtype][handle];
                } else {
                    delete obj._evts[eventtype];
                }
            }
        },
        realName: function (eventtype) {
            return eventtype.startsWith('on') ? eventtype : ("on" + eventtype);
        },

        /**
         * 删除某对象上注册的所有事件
         *
         * @param obj
         * @returns
         */
        removeEvents: function (obj) {
            if (obj._evts) {
                // var i;
                for (var i in obj._evts) {
                    delete obj._evts[i];
                }
            }
        },

        /**
         * 停止事件的冒泡
         *
         * @param e
         * @param c
         */
        cancelEvent: function (e, c) {
            if (e) {
                e.returnValue = false;
                if (e.preventDefault)
                    e.preventDefault();
                if (c) {
                    e.cancelBubble = true;
                    if (e.stopPropagation)
                        e.stopPropagation();
                }
            }
        },

        /**
         *
         * @param {Object}
         *            object
         * @param {Function}
         *            fun
         * @param {Array}
         *            args
         * @return
         */
        bindAsEventListener: function (context, method, args) {
            if (arguments.length > 2) {
                if (!(args instanceof Array)) {
                    args = [].slice.apply(arguments, [2]);
                }
            } else {
                args = [];
            }
            return function () {
                var args1 = (arguments.length == 0) ? [] : [].slice.apply(arguments);
                args1 = args1.concat(args);
                return method.apply(context || $e, args1);
            };
        },
        createEventCell: function () {
            return new EventCell();
        }
    };

    $e.fn = {
        _maxID: 1000,
        _maxIndex: 1000,
        _FIELD_ENABLE: true,
        _menu: [],
        nextID: function () {
            return ++this._maxID;
        },
        nextIndex: function () {//modal
            return ++this._maxIndex;//+(modal?this._basicIndex:0);
        },
        getInt: function (s, defa) {
            s = parseInt(s);
            s = isNaN(s) ? (arguments.length > 1 ? defa : 0) : s;
            return s;
        },
        getFloat: function (s, defa) {
            s = parseFloat(s);
            s = isNaN(s) ? (arguments.length > 1 ? defa : 0.0) : s;
            return s;
        },

        getBoolean: function (s1, defa) {
            if (s1 == null || s1 == undefined) {
                s1 = (defa == null || defa == undefined) ? false : defa;
            }
            return ((s1 == 1) || (s1 == '1') || (s1 == 'true') || (s1 === true)) ? true : false;
        },

        /**
         * 统计text包含的c1个数
         * @param text
         * @param c1
         */
        countChar: function (text, c1) {
            var c = 0;
            if (text) {
                for (var i = 0; i < text.length; i++) {
                    if (text.charAt(i) == c1) {
                        c++;
                    }
                }
            }
            return c;
        },
        /**
         * 获取实际匹配类型的值,有待扩展
         *
         * @param type
         *            类型
         * @param prec
         *            精度
         * @param value
         *            值
         * @returns
         */
        parseValue: function (value, type, prec) {
            if (value + '') {
                prec = prec || 0;
                switch (type) {
                    case 'boolean':
                        value = this.getBoolean(value, false);
                        break;
                    case 'string':
                        value = (prec > 0 && value.length > prec) ? value.substring(0, prec) : value;
                        break;
                    case 'decimal':
                    case 'number':
                        if (typeof value == 'string') {
                            value = value = value.replace(/,/g, "");
                        }
                        if (isNaN(value)) {
                            value = null;
                        } else if ((typeof value) != 'number') {
                            value = parseFloat(value);
                        }
                        if (arguments.length > 2 && value) {
                            value = value.toFixed(prec) - 0;
                        }
                        break;
                    case 'date':
                    case 'datetime':
                    case 'time':
                        if (!(value instanceof Date)) {
                            if (typeof value == 'number' || !isNaN(value)) {
                                value = new Date(parseFloat(value));
                            } else {
                                value = new Date(value);
                            }
                        }
                        if (value && (type == "date")) {
                            value.setHours(0, 0, 0, 0);
                        }
                        break;
                    case 'int':
                    case 'integer':
                    case 'long':
                        if (isNaN(value)) {
                            value = null;
                        } else {
                            value = parseFloat(value).toFixed(0) - 0;
                        }
                        break;
                    default:
                        break;
                }
            }
            return value;
        },

        parseVars: function (array) {
            var vars = {};
            if (array && array.length > 0) {
                var v1;
                for (var i = 0; i < array.length; i++) {
                    v1 = array[i];
                    vars[v1.name] = this.parseValue(v1.value, v1.type);
                }
            }
            return vars;
        },

        /**
         * 使用函数或属性比较,是否匹配
         * @param elem
         * @param obj
         * @returns {*}
         */
        test: function (elem, method, value) {
            if (typeof method == 'function') {
                return method(elem, value);
            } else if (method) {
                var key;
                if (this.isPlainObject(method)) {
                    value = method['value'];
                    key = method['key'];
                } else {
                    key = method;
                }
                var r = false;
                if (elem.nodeType == 1 && key) {
                    if (key.startsWith(".")) {
                        r = $e.fn.hasClass(elem, key.substring(1));
                    } else if (value !== undefined) {
                        r = (elem.getAttribute(key) == value) || (elem[key] == value);
                    } else {
                        r = (!!elem.getAttribute(key)) || (elem[key] != undefined);
                    }
                } else if (key) {
                    r = (value == undefined) ? (elem[key] !== undefined) : (elem[key] == value);
                }
                return r;
            }
            return false;
        },

        plainobj: {
            string: {}.hasOwnProperty.toString.call(Object)
        },

        isPlainObject: function (obj) {
            if (!obj || {}.toString.call(obj) !== "[object Object]") {
                return false;
            }
            if (!Object.getPrototypeOf) {
                return true;
            }
            var proto = Object.getPrototypeOf(obj);
            if (this.plainobj.hasOwnProperty.call(proto, "constructor")) {
                return this.plainobj.hasOwnProperty.toString.call(proto.constructor) === this.plainobj.string;
            }
            return false;
        },

        clearObject: function (obj) {
            for (var i in obj) {
                delete obj[i];
            }
        },

        // js获取url传递参数，js获取url？号后面的参数window.location
        getQueryParameter: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r ? decodeURIComponent(r[2]) : '';//unescape(r[2]) : '';
        },

        getE: function (id) {
            return document.getElementById(id);
        },

        isEmptyObject: function (e) {
            for (var t in e)
                return false;
            return true;
        },
        /**
         * createElement(tagName)函数，同时赋予其class
         *
         * @param {String}
         *            tagName
         * @param {String}
         *            className 可以忽略
         * @return {Element}
         */
        create: function (tag, cls, attrs) {
            var c1 = document.createElement(tag.toUpperCase());
            if (cls) {
                c1.className = cls;
            }
            if (attrs) {
                for (var a in attrs) {
                    c1.setAttribute(a, attrs[a]);
                }
            }
            return c1;
        },

        extend: function (source, target, overwrite) {
            if (source && target) {
                overwrite = !!overwrite;
                for (var f in source) {
                    //目标对象没有该属性，或overwrite为true
                    if ((target[f] == undefined || overwrite)) {
                        target[f] = source[f];
                    }
                }
            }
            return target;
        },

        /**
         * 查询满足条件的第一个父节点
         */
        closest: function (node, method, includecurrent) {

            var end, r, result = null;

            if (node) {
                //
                node = node.target || node.srcElement || node;

                if (includecurrent) { //包含当前元素

                    r = this.test(node, method);
                    //r执行查找结果，及查找元素的属性，

                    if (r === 1 || r === true) {
                        return node;

                    } else if (r === -1) {
                        return null;

                    } else if (method['end']) {
                        end = method['end'];

                        //是截至的节点，或tagName为该值、或节点就有end的变量属性
                        if ((end == node) || (end == node.tagName) || (node[end] !== undefined)) {
                            return null;
                        }
                    }
                }

                //得到父节点
                node = node.parentNode;

                while (node) {

                    r = this.test(node, method);

                    if (r === true || r === 1) {
                        result = node;
                        break;
                    } else if (r == -1) {
                        //停止搜索
                        result = null;
                        break;
                    } else if (method['end']) {
                        end = method['end'];
                        //是截至的节点，或tagName为该值、或节点就有end的变量属性
                        if ((end == node) || (end == node.tagName) || (node[end] !== undefined)) {
                            result = null;
                            break;
                        }
                    }
                    //继续循环父节点
                    node = node.parentNode;
                }
            }
            return result;
        },

        isParent: function (child, parent) {
            while (child && child != parent) {
                child = child.parentNode;
            }
            return child == parent;
        },

        queryOwner: function (node, notview) {

            var shell = this.closest(node, '$owner', true);

            var r = shell ? shell['$owner'] : null;

            //过滤掉view类型
            if (r && notview && (r['_owner_type'] == "view")) {
                return null;
            }
            return r;
        },

        queryOwnerView: function (node) {
            node = node.target || node.srcElement || node;
            while (node && node != window) {
                if (node['$owner']) {
                    return node['$owner'];
                }
                node = node.parentNode;
            }
            return null;
        },
        setChild: function (parent, child) {
            if (!!parent) {
                while (parent.lastChild) {
                    parent.removeChild(parent.lastChild);
                }
                if (child) {
                    parent.appendChild(child);
                }
            }
        },

        isElementShow: function (shell) {
            var show = $e.fn.getStyle(shell, 'display');
            return show != 'none';
        },

        setLabelText: function (label, text) {
            if (label) {
                text = text + '';
                if ('textContent' in label) {
                    label.textContent = text;
                } else {
                    label.innerText = text;
                }
            }
        },

        getLabelText: function (label) {
            return label ? (label.innerText || label.textContent) : "";
        },

        enableField: function (field, able) {
            if (field) {
                if (able) {
                    field.removeAttribute("disabled");
                } else {
                    field.setAttribute("disabled", "true");
                }
            }
        },
        enableFields: function (fields, able) {
            if (fields) {
                for (var i = 0; i < fields.length; i++) {
                    this.enableField(fields[i], able);
                }
            }
        },
        editableField: function (field, able) {
            if (able) {
                field.removeAttribute("readonly");
            } else {
                field.setAttribute("readonly", "true");
            }
        },


        /**
         * 解决IE和FF获取对象当前属性的hack，实现统一，
         *
         * @param oElement
         * @return
         */
        getStyle: function (e1, key1) {
            if (e1 && e1.nodeType == 1) {
                if (e1.currentStyle) {
                    return key1 ? e1.currentStyle[key1] : e1.currentStyle;
                } else {
                    var st = getComputedStyle(e1, false);
                    return key1 ? st.getPropertyValue(key1) : st;
                }
            }
            return {};
        },

        setStyle: function (e1, exp) {
            if (e1 && exp) {
                if (!e1.style) {
                    e1.setAttribute('style', exp);
                } else if ($e.os.ie) {
                    e1.style.cssText = e1.style.cssText ? (e1.style.cssText + ";" + exp) : exp;
                } else if (exp) {
                    var p, s = exp.split(";");
                    for (var i = 0; i < s.length; i++) {
                        if (s[i].length > 0) {
                            p = s[i].indexOf(":");
                            if (p > 0) {
                                e1.style.setProperty(s[i].substring(0, p).trim(), s[i].substring(p + 1).trim());
                            }
                        }
                    }
                }
            }
        },

        // opacity 设置透明度
        setOpacity: function (elem, value) {
            elem.filters ? elem.style.filter = 'alpha(opacity=' + value + ')'
                : elem.style.opacity = value / 100;
        },

        /**
         * 判断样式是否存在
         *
         * @param elem
         * @param cls
         * @returns {*}
         */
        hasClass: function (elem, cls) {
            return new RegExp('(^| )' + cls + '( |$)', 'gi').test(elem.className);
        }
        ,

        /**
         * 为指定的dom元素添加样式
         *
         * @param elem
         * @param cls
         */
        addClass: function (elem, cls) {
            if (elem.classList) {
                elem.classList.add(cls);
            } else {
                if (!new RegExp('(^| )' + cls + '( |$)', 'gi').test(elem.className)) {
                    elem.className += ' ' + cls;
                }
            }
        }
        ,

        /**
         * 删除指定dom元素的样式
         *
         * @param elem
         * @param cls
         */
        removeClass: function (elem, cls) {
            if (elem.classList) {
                elem.classList.remove(cls);
            } else {
                if (!elem.className) {
                    elem.className = '';
                }
                elem.className = elem.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }
        ,

        /**
         * 如果存在(不存在)，就删除(添加)一个样式
         *
         * @param elem
         * @param cls
         */
        toggleClass: function (elem, cls) {
            if (elem.classList) {
                elem.classList.toggle(cls);
            } else {
                var classes = elem.className.split(' ');
                var existingIndex = -1;
                for (var i = classes.length; i--;) {
                    if (classes[i] === cls) {
                        existingIndex = i;
                    }
                }
                if (existingIndex >= 0) {
                    classes.splice(existingIndex, 1);
                } else {
                    classes.push(cls);
                }
                elem.className = classes.join(' ');
            }
        },

        //改变dom节点样式另一种方式是利用js动态创建一个style标签，再填入css属性,再添加到页面
        loadCSS: function (csstext) {
            if (csstext) {
                var head = document.getElementsByTagName('head')[0];
                var node = document.createElement('style');
                node.setAttribute('type', 'text/css');
                if ('styleSheet' in node) {
                    node.styleSheet.cssText = csstext;
                } else {
                    node.innerHTML = csstext;
                }
                head.appendChild(node);
            }
        }

    };
    $e.fn.extend({
        type_D: "date",
        type_DT: "datetime",
        type_T: "time",
        reg_fmt: {},
        /**
         * 将日期或日期类型的变量格式化成指定类型的字符串
         *
         * @param date
         * @param f
         * @returns
         */
        formatDate: function (date, ftext) {
            //TODO
            date = $e.fn.parseValue(date, 'datetime');
            if (date && date instanceof Date) {
                ftext = ftext ? ftext : "yyyy-MM-dd HH:mm:ss";
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "H+": date.getHours(),
                    "h+": date.getHours() > 12 ? date
                        .getHours() - 12 : date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math
                        .floor((date.getMonth() + 3) / 3),
                    "f+": date.getMilliseconds()
                };
                if (/(y+)/.test(ftext)) {
                    ftext = ftext.replace(RegExp.$1, (date
                        .getFullYear() + "")
                        .substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(ftext)) {
                        ftext = ftext
                            .replace(
                                RegExp.$1,
                                RegExp.$1.length == 1 ? o[k]
                                    : ((k.charAt(0) == 'ftext' ? "000"
                                    : "00") + o[k])
                                        .substr(("" + o[k]).length));
                    }
                }
                return ftext;
            }
            return "";
        },

        /**
         * 分割符必须为/或-
         *
         * @param s
         * @returns
         */
        isDateText: function (s) {
            if (s && (s + '').trim() && !!isNaN(s)) {
                var date = new Date(s);
                return !isNaN(date.getDay());
            }
            return false;
        },
        /**
         * 格式化数字
         *
         * @param num
         * @param pattern
         * @returns
         */
        formatNumber: function (num, ftext) {
            if (typeof (num) == "string") {
                num = num.replace(/,/g, "");
            }
            num = parseFloat(num);
            if (isNaN(num) || num == null) {
                return '';
            }
            var str = '';
            if (num || num === 0) {
                if (!ftext) {
                    return num + '';
                }
                var fmt = ftext = ftext.trim();
                if (fmt.endsWith("%")) {
                    num = num * 100;
                    fmt = fmt.substr(0, fmt.length - 1);
                }
                var split = false;
                fmt = fmt.split('.');
                if (fmt.length > 1) {
                    // 有小数,四舌五入
                    num = num.toFixed(fmt[1].length);
                } else {
                    num = num.toFixed(0);
                }
                var p = fmt[0].lastIndexOf(",");
                if (p >= 0) {
                    fmt[0] = fmt[0].substring(p + 1);
                    split = (fmt[0].length > 0);
                }
                var str_num = num.split('.');
                if (split) {
                    str = str_num[0].replace(this.getRegExp(fmt[0].length), "$1,");
                } else {
                    //无分节号
                    str = str_num[0];
                }
                if (str_num.length > 1 && fmt.length > 1) {
                    //有小数
                    var i = str_num[1].length - 1;
                    while (i >= 0) {
                        if (str_num[1].charAt(i) != '0' || fmt[1].charAt(i) != '#') {
                            break;
                        }
                        i--;
                    }
                    if (i >= 0) {
                        str = str + "." + str_num[1].substring(0, i + 1);
                    }
                }
                str = (str == '-') ? '' : str;
                if ((str.length > 0) && ftext && ftext.endsWith("%")) {
                    str = str + "%";
                }
            }
            return str;
        },
        getRegExp: function (type) {
            type = type + '';
            var reg = this.reg_fmt[type];
            if (!reg) {
                this.reg_fmt[type] = reg = new RegExp('(\\d{1,' + type + '})(?=(\\d{' + type + '})+(?:$))', "g");
            }
            return reg;
        },
        /**
         *
         * @param value
         * @param type
         *            string,number,date,datetime,time
         * @param prec
         * @returns
         */
        getDataText: function (value, type, prec) {
            if (value) {
                if (type == "string") {
                    // 强制转型
                    if (value instanceof Date) {
                        value = this.formatDate(value, "yyyy-MM-dd");
                    } else {
                        value = value + '';
                    }
                    if (prec && prec > 0 && value.length > prec) {
                        value = value.substr(0, prec);
                    }
                } else if (type == "number" || type == "int" || type == 'long') {
                    value = this.formatNumber(value, "0." + "#".fillText(prec));
                } else if (type == "date") {
                    value = this.formatDate(value, "yyyy-MM-dd");
                } else if (type == "datetime") {
                    value = this.formatDate(value, "yyyy-MM-dd hh:mm:ss");
                } else if (type == "time") {
                    value = this.formatDate(value, "hh:mm:ss");
                }
            }
            return value;
        },

        /**
         * 格式化字符,数字,日期时间类型的文本
         *
         * @param value
         * @param type
         * @param ftext
         * @param prec
         * @returns
         */
        formatData: function (value, ftext, type, prec, focused) {
            if (value) {
                if (!type && this.isDateText(value + '')) {
                    type = 'date';
                }
                type = type ? type : typeof (value);
                if (type == "text" || type == 'string') {
                    value += "";
                    if (ftext == "U" || ftext == 'upper') {
                        value = value.toUpperCase();
                    } else if (ftext == "L" || ftext == 'lower') {
                        value = value.toLowerCase();
                    }
                } else if (type == "percent"
                    || type == 'number' || type == 'int'
                    || type == 'long') {
                    value = this.formatNumber(value, ftext);
                    // 格式化
                    if (focused) {
                        // 替换","为空
                        value = value.replace(/,/g, "");
                    }
                } else if (type == "date" || type == "datetime" || type == "time") {
                    value = this.formatDate(value, ftext);
                }
            }
            return value == null ? '' : value;
        },
        getDataAlign: function (type) {
            var a = 'left';
            if (type == 'number' || type == "percent") {
                a = 'right';
            } else if (type == 'int' || type == 'long'
                || type == 'date' || type == "datetime") {
                a = 'center';
            }
            return a;
        }
    }, $e.fn);

}($e);
