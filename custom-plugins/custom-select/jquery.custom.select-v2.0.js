/*
    自定义工具
    I am liangzhenyu
    2018-05-25
*/

/*
插件-自定义下拉选择框（美化）
兼容：IE9+
关键的：不改变开发者原有对dom节点操作习惯，在这里使用该插件只需添加一个 $.initSelect(selector) 创建后就行，然后对 原始select 原有操作依然有效；
使用方法说明：
    1.此插件基于jQuery编写，使用时需要先导入jQuery；
       * 主要是美化自带的select
    2.获取对象
        var mySelect = $.initSelect(selector, copyStyle, callback); //三个参数的排序不限制，可随意排序
            selector:css选择器，比如：.class,#id,dom
            copyStyle：是否复制 原始select 的样式，boolean类型（可选参数），默认为false
            callback:回调函数（可选参数）；回调函数中的 this 对象为 ‘mySelect’ 对象
    3.方法说明
        change(callback):当选择项改变时响应
            callback:回调函数；回调函数中的 this 对象为 ‘mySelect’ 对象
            params:回调函数中的参数,所选中的子项的属性和值
        addOption(option):添加子项（原始方式）
            option:原select下的option标签，例子："<option name='测试' value='test'>测试</option>"
        addRow(text, params):添加子项（封装方式）
            text:选项的内容，
            params:所有属性，例子：{name:'测试',value:'test'}
        getSelected(attrName):获取所选中的子项的属性值
            attrName:可选；属性名称,默认值：'value'
            return:对应属性的值
        getSelectedText():获取所选中的子项的标签内容
            return:子项内容
        getSelectedParams():获取所选中子项的封装好的属性键值对
            return:所选中的子项的属性和值，例子：{name:"xxx",abc:"xxx",def:"xxx"}
        setSelected(attrName,attrVal):设置当前选中状态
            attrName:属性名称
            attrVal:属性的值
        setSelected(attrVal):设置当前选中状态
            attrVal:属性(名称：value)的值


     注：美化下拉框和原始下拉框是相互关联的，可以不使用作者写的方法（最少要创建对象），

 */
;(function ($, window, document, undefined) {
    $.extend({
        initSelect: function (selector, cfg) {
            var isIE = function () {
                var userAgent = navigator.userAgent;
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
                var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
                var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
                return isIE || isIE11 || isEdge || false;
            };
            var isFire = function () {
                return navigator.userAgent.indexOf("Firefox") > -1;
            };
            var lzySelect = function (selector, cfg) {
                this._$oSelect = $(selector).hide();
                this._$parent = $("<div class=\"lzy_select_parent\">" +
                    "        <span class=\"lzy_select_span\"></span>" +
                    "        <span class='lzy_select_arraw'><b></b></span>" +
                    "    </div>");
                this._$list = $("<div class=\"lzy_select_list\">" +
                    "        <span class=\"lzy_select_search\">" +
                    "           <input placeholder=\"搜索选择\"/>" +
                    "        </span>" +
                    "        <div class=\"lzy_select_ul\">" +
                    "            <ul></ul>" +
                    "        </div>" +
                    "    </div>");
                this._$select = $("<div class=\"lzy_select\"></div>")
                    .append(this._$parent)
                    .append(this._$list)
                    .insertAfter(this._$oSelect);

                this._sOption = isFire() ? "option[selected=selected]" : "option:selected";
                this._sKey = null;
                this._sVal = null;
                this._callback = null;
                var that = this;


                var setAnimate = function (type) {
                    that._$parent.find(".lzy_select_arraw")
                        .removeClass("lzy_select_arraw_" + (type === "close" ? "open" : "close"))
                        .addClass("lzy_select_arraw_" + type);
                    if (type === "close") that._$list.hide(); else that._$list.show();
                };
                //----设置事件，-----------------------------------
                this._$parent.on("click", function (event) {
                    (event || window.event).stopPropagation();
                    if (that._$list.css("display") === "none") {
                        setAnimate("open");
                        that._$list.show();
                    } else {
                        setAnimate("close");
                        that._$list.hide();
                    }
                });

                this._$list.on("click", "input", function (event) {
                    (event || window.event).stopPropagation();


                }).on("click", "ul>li", function (event) {
                    (event || window.event).stopPropagation();
                    setAnimate("close");

                });

                $(document).on("click", function (event) {
                    setAnimate("close");
                });

                this._$oSelect.on("change", function () {
                    


                });

                this.render();
            };
            lzySelect.prototype = {
                render: function () {
                    var oOptions = this._$oSelect.find("option");
                    var $ulCont = this._$list.find(".lzy_select_ul ul").empty();
                    for (var i = 0; i < oOptions.length; i++) {
                        var attrs = oOptions[i].attributes;
                        var $son = $("<li></li>").append(oOptions[i].text);
                        for (var j = 0; j < attrs.length; j++) {
                            if (attrs[j].name !== "class") $son.attr(attrs[j].name, attrs[j].value);
                        }
                        $ulCont.append($son);
                    }
                    this.setSelected(this._sKey, this._sVal);
                },
                setSelected: function (attrName, attrVal) {
                    var that = this;
                    var setUlCont = function (index) {
                        var $li = that._$list.find(".lzy_select_ul li").eq(index).addClass("hover");
                        that._$parent.find(".lzy_select_span").attr("title", $li.text()).html($li.text());
                        that._$oSelect.find("option").eq(index).prop("selected", true).siblings().prop("selected", false);
                    };
                    if (!attrName && !attrVal) {
                        setUlCont(0);
                    } else {
                        if (!attrVal) {
                            attrVal = attrName;
                            attrName = "value";
                        }
                        var $option = this._$oSelect.find("option[" + attrName + "='" + attrVal + "']");
                        if ($option.length > 0) {
                            if ($option.length > 1) $option = $option.eq(0);
                            $option.prop("selected", true).siblings().prop("selected", false);
                            setUlCont($option.index());
                        }
                    }
                },
                change: function (callback) {
                    if (callback) this._callback = callback;
                },
                addOption: function (option) {
                    this._$select.append(option);
                },
                addRow: function (text, params) {
                    if (!text || !params) throw new Error("传入的参数有误！");
                    var keys = Object.keys(params);
                    var $option = $("<option>" + text + "</option>");
                    for (var i = 0; i < keys.length; i++) {
                        $option.attr(keys[i], params[keys[i]]);
                    }
                    this._$select.append($option);
                },
                getSelected: function (attrName) {
                    return this._$select.find(this._sOption).prop(attrName || "value");
                },
                getSelectedText: function () {
                    return this._$select.find(this._sOption).text();
                },
                getSelectedParams: function () {
                    var params = {};
                    var $option = this._$select.find(this._sOption);
                    var attrs = $option.get(0).attributes;
                    for (var i = 0; i < attrs.length; i++) params[attrs[i].name] = attrs[i].value;
                    params.text = $option.text();
                    params.html = $option.text();
                    return params
                }
            };
            return new lzySelect(selector, cfg);
        }
    });
})(jQuery, window, document);
