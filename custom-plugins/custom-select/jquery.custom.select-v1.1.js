/*
    自定义工具
    I am liangzhenyu
    2018-05-25
*/

/*
插件-自定义下拉选择框（美化），自认为该插件非常强大 (^_^)
兼容：IE9+
强大之处在于：不改变开发者原有对dom节点操作习惯，像其他很多插件，使用繁琐，各种配置各种要习惯他们思路；
在这里使用该插件只需添加一个 $.initSelect(selector) 创建后就行，然后对 原始select 原有操作依然有效，
使用方法说明：
    1.此插件基于jQuery编写，使用时需要先导入jQuery；
       * 主要是美化自带的select
    2.获取对象
        var mySelect = $.initSelect(selector, copyStyle, callback); //三个参数的排序不限制，可随意排序
            selector:css选择器
            copyStyle：是否复制 原始select 的样式，boolean类型（可选参数），默认为false
            callback:回调函数（可选参数）；回调函数中的 this 对象为 ‘mySelect’ 对象
    3.方法说明
        onChange(callback):当选择项改变时响应
            callback:回调函数；回调函数中的 this 对象为 ‘mySelect’ 对象
            params:回调函数中的参数,所选中的子项的属性和值
        addOption(option):添加子项（原始方式）
            option:原select下的option标签，例子："<option name='测试' value='test'>测试</option>"
        addRow(text, attrs):添加子项（封装方式）
            text:选项的名称
            attrs:所有属性，例子：{name:'测试',value:'test'}
        getSelected(attr):获取所选中的子项的属性值
            attr:属性名称,默认值：'value',不设置将使用默认值
            return:对应属性的值
        getSelectedText():获取所选中的子项的标签内容
            return:子项内容
        getSelectedParams():获取所选中子项的封装好的属性键值对
            return:所选中的子项的属性和值，例子：{name:"xxx",abc:"xxx",def:"xxx"}
        setSelected(attrName,attrVal):设置当前选中状态
            attrName:属性名称
            attrVal:属性的值

 使用参考例子：
    HTML部分：
     <select id="city">
        <option name="全省" value="10025">全省</option>
         ...
        <option name="云浮" value="860766">云浮</option>
    </select>

    注：这里的 原始select 需要设置自己的风格样式,因为美化后的样式需要获取这个 原始select 的样式，比如：长，宽或颜色什么的

    JS部分：
     var mySelect = $.initSelect.init("#city");
     mySelect.onChange(function(){
        this.getSelected();
     });
     mySelect.addOption('<option name="测试" value="860766">测试</option>');
     mySelect.addRow("测试",{name:"测试",value:"860766"}); //和addOption效果相同，都是新增了一行
     mySelect.setSelected("value","860766"); //把一个属性是value同时值为860766的节点设置为选中状态，以下方法使用该选中值
     mySelect.getSelected(); //返回值：860766
     mySelect.getSelected("name"); //返回值："测试"，可以看到，参数不填就默认为 "value"
     mySelect.getSelectedText(); //返回值："测试"
     mySelect.getSelectedParams();//选中项的所有属性和值：{name:"测试",value:"860766"}

     注：美化下拉框和原始下拉框是相互关联的，可以不使用作者写的方法（最少要创建对象），
     相关操作可以使用原始方式，如下：
     $("#city").on("change",function(){
        $("#city").find("option:selected").val();
     });
     上下两个方法的效果一样

 */
;(function ($, window, document, undefined) {
    $.extend({
        initSelect: function (selector, copyStyle, callback) {
            var toRGB = function (color) {
                eval(function (p, a, c, k, e, d) {
                    e = function (c) {
                        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
                    };
                    if (!''.replace(/^/, String)) {
                        while (c--) d[e(c)] = k[c] || e(c);
                        k = [function (e) {
                            return d[e]
                        }];
                        e = function () {
                            return '\\w+'
                        };
                        c = 1;
                    }
                    while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                    return p;
                }('28 29={2a:{r:4,g:p,b:1},27:{r:3,g:B,b:W},23:{r:0,g:1,b:1},24:{r:i,g:1,b:26},2b:{r:4,g:1,b:1},2g:{r:6,g:6,b:d},2h:{r:1,g:y,b:Y},2i:{r:0,g:0,b:0},2f:{r:1,g:B,b:7},2c:{r:0,g:0,b:1},2d:{r:2e,g:43,b:1Q},1R:{r:s,g:42,b:42},1S:{r:n,g:N,b:D},1P:{r:1M,g:1N,b:l},1O:{r:i,g:1,b:0},1T:{r:u,g:a,b:30},1Y:{r:1,g:i,b:1Z},22:{r:P,g:1X,b:1U},1V:{r:1,g:p,b:d},1W:{r:d,g:20,b:15},2C:{r:0,g:1,b:1},2D:{r:0,g:0,b:5},2E:{r:0,g:5,b:5},2B:{r:N,g:2y,b:11},2z:{r:z,g:z,b:z},2A:{r:0,g:P,b:0},2F:{r:2K,g:2L,b:q},2M:{r:5,g:0,b:5},2J:{r:13,g:q,b:47},2G:{r:1,g:F,b:0},2H:{r:S,g:o,b:14},2I:{r:5,g:0,b:0},2n:{r:2o,g:2p,b:I},2m:{r:m,g:J,b:m},2j:{r:10,g:2k,b:5},2l:{r:47,g:Q,b:Q},2q:{r:0,g:C,b:A},2v:{r:2w,g:0,b:h},2x:{r:1,g:20,b:w},2u:{r:0,g:12,b:1},2r:{r:a,g:a,b:a},2s:{r:30,g:e,b:1},2t:{r:A,g:1L,b:1i},1h:{r:V,g:34,b:34},1g:{r:1,g:3,b:4},1n:{r:34,g:5,b:34},1o:{r:1,g:0,b:1},1m:{r:d,g:d,b:d},16:{r:p,g:p,b:1},1b:{r:1,g:W,b:0},1E:{r:v,g:s,b:32},1F:{r:2,g:2,b:2},1C:{r:0,g:2,b:0},1G:{r:x,g:1,b:47},1H:{r:4,g:1,b:4},1t:{r:1,g:a,b:G},1u:{r:7,g:M,b:M},1r:{r:1y,g:0,b:E},1v:{r:1,g:1,b:4},1w:{r:4,g:9,b:F},1z:{r:9,g:9,b:3},1D:{r:1,g:4,b:6},1p:{r:1c,g:1a,b:0},1d:{r:1,g:3,b:7},1e:{r:x,g:f,b:9},1k:{r:4,g:2,b:2},1l:{r:j,g:1,b:1},1J:{r:3,g:3,b:u},1K:{r:h,g:h,b:h},1I:{r:e,g:8,b:e},1A:{r:1,g:1s,b:1x},1q:{r:1,g:l,b:I},1B:{r:32,g:V,b:t},18:{r:D,g:C,b:3},17:{r:1f,g:c,b:1},1j:{r:4o,g:4t,b:S},3Q:{r:X,g:Y,b:n},3P:{r:1,g:1,b:j},3S:{r:0,g:1,b:0},3K:{r:o,g:7,b:o},3X:{r:3,g:4,b:9},40:{r:1,g:0,b:1},3Y:{r:2,g:0,b:0},3Z:{r:3V,g:7,b:t},3W:{r:0,g:0,b:7},49:{r:4a,g:13,b:h},4b:{r:w,g:c,b:f},41:{r:15,g:K,b:44},48:{r:3U,g:3L,b:8},3M:{r:0,g:3,b:U},3N:{r:10,g:A,b:14},3I:{r:3J,g:21,b:R},3R:{r:25,g:25,b:c},3T:{r:6,g:1,b:3},3O:{r:1,g:y,b:H},4c:{r:1,g:y,b:4s},4u:{r:1,g:n,b:x},4p:{r:0,g:0,b:2},4q:{r:4r,g:6,b:9},4x:{r:2,g:2,b:0},4w:{r:q,g:4v,b:35},4g:{r:1,g:s,b:0},4h:{r:1,g:L,b:0},4f:{r:v,g:c,b:4d},4e:{r:8,g:4i,b:t},4m:{r:T,g:4n,b:T},4l:{r:4j,g:8,b:8},4k:{r:f,g:c,b:w},37:{r:1,g:38,b:39},31:{r:1,g:v,b:33},36:{r:7,g:R,b:3a},3e:{r:1,g:k,b:3f},3g:{r:Z,g:l,b:Z},3b:{r:X,g:j,b:9},3c:{r:2,g:0,b:2},3d:{r:1,g:0,b:0},2Q:{r:J,g:m,b:m},2R:{r:2S,g:a,b:H},2N:{r:5,g:L,b:19},2O:{r:3,g:2,b:2P},2T:{r:2X,g:2Y,b:2Z},2U:{r:46,g:5,b:2V},2W:{r:1,g:6,b:8},3h:{r:l,g:3y,b:45},3z:{r:k,g:k,b:k},3A:{r:D,g:C,b:B},3v:{r:3w,g:3x,b:7},3B:{r:c,g:2,b:e},3F:{r:1,g:3,b:3},3G:{r:0,g:1,b:i},3H:{r:3C,g:E,b:G},3D:{r:u,g:G,b:F},3E:{r:0,g:2,b:2},3l:{r:f,g:12,b:f},3m:{r:1,g:3n,b:3i},3j:{r:3k,g:j,b:O},3o:{r:8,g:E,b:8},3s:{r:O,g:32,b:e},3t:{r:6,g:n,b:K},3u:{r:1,g:1,b:1},3p:{r:6,g:6,b:6},3q:{r:1,g:1,b:0},3r:{r:U,g:7,b:o}};', 62, 282, '|255|128|250|240|139|245|205|238|230|105||112|220|144|216||211|127|224|192|160|143|222|50|248|107||165|170|210|218|147|173|228|169|209|235|206|135|130|140|180|225|122|188|179|69|92|184|208|100|79|133|153|152|154|178|215|176|196|221|72||191|85|204|60|ghostwhite|lightslateblue|lightskyblue||252|gold|124|lemonchiffon|lightblue|132|floralwhite|firebrick|117|lightslategray|lightcoral|lightcyan|gainsboro|forestgreen|fuchsia|lawngreen|lightsalmon|indigo|182|hotpink|indianred|ivory|khaki|193|75|lavender|lightpink|lightseagreen|green|lavenderblush|goldenrod|gray|greenyellow|honeydew|lightgreen|lightgoldenrodyellow|lightgrey|146|95|158|chartreuse|cadetblue|226|brown|burlywood|chocolate|237|cornsilk|crimson|149|coral|80|||cornflowerblue|aqua|aquamarine||212|antiquewhite|var|EN_COLOR|aliceblue|azure|blue|blueviolet|138|blanchedalmond|beige|bisque|black|darkslateblue|61|darkslategray|darkseagreen|darksalmon|233|150|darkturquoise|dimgray|dodgerblue|feldspar|deepskyblue|darkviolet|148|deeppink|134|darkgray|darkgreen|darkgoldenrod|cyan|darkblue|darkcyan|darkkhaki|darkorange|darkorchid|darkred|darkolivegreen|189|183|darkmagenta|saddlebrown|salmon|114|rosybrown|royalblue|65|sandybrown|seagreen|87|seashell|244|164|96||peachpuff||185|||peru|papayawhip|239|213|63|powderblue|purple|red|pink|203|plum|sienna|71|turquoise|64|thistle|tomato|99|violet|whitesmoke|yellow|yellowgreen|violetred|wheat|white|slateblue|106|90|82|silver|skyblue|slategray|70|tan|teal|snow|springgreen|steelblue|mediumvioletred|199|limegreen|104|mediumspringgreen|mediumturquoise|mistyrose|lightyellow|lightsteelblue|midnightblue|lime|mintcream|123|102|mediumblue|linen|maroon|mediumaquamarine|magenta|mediumseagreen|||113||||mediumslateblue|mediumorchid|186|mediumpurple|moccasin|214|palegoldenrod|orchid|orange|orangered|232|175|palevioletred|paleturquoise|palegreen|251|119|navy|oldlace|253|181|136|navajowhite|142|olivedrab|olive'.split('|'), 0, {}));
                var sColor = color.toLowerCase();
                if (sColor && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(sColor)) {
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i = 1; i < 4; i += 1) sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        sColor = sColorNew;
                    }
                    var sColorChange = [];
                    for (var i = 1; i < 7; i += 2) sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                    return "rgb(" + sColorChange[0] + "," + sColorChange[1] + "," + sColorChange[2] + ")";
                } else if (sColor.indexOf("rgb") >= 0) {
                    if (sColor.indexOf("%") >= 0) {
                        var arrRgb = sColor.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
                        return "rgb(" + parseInt(arrRgb[0] / 100 * 255) + "," + parseInt(arrRgb[1] / 100 * 255) + "," + parseInt(arrRgb[2] / 100 * 255) + ")";
                    } else {
                        return sColor;
                    }
                } else {
                    var rgbObj = EN_COLOR[sColor];
                    if (!rgbObj) return null;
                    return "rgb(" + rgbObj.r + "," + rgbObj.g + "," + rgbObj.b + ")";
                }
            };
            var dimColor = function (color, opacity) {
                var opa = opacity || 0.5;
                if (color.indexOf("rgba") >= 0)
                    return color.substr(0, color.lastIndexOf(",")) + "," + parseFloat(color.substr(color.lastIndexOf(",") + 1, color.lastIndexOf(")") - 1)) * opa + ")";
                var arrRgb = toRGB(color).replace("rgb(", "").replace(")", "").split(",");
                return "rgba(" + arrRgb[0] + "," + arrRgb[1] + "," + arrRgb[2] + "," + opa + ")";
            };
            var darkColor = function (color, oft) {
                oft = oft || 0.5;
                var arrRgb = toRGB(color).replace("rgb(", "").replace(")", "").split(",");
                var r = parseInt(arrRgb[0] * oft);
                var g = parseInt(arrRgb[1] * oft);
                var b = parseInt(arrRgb[2] * oft);
                return "rgb(" + r + "," + g + "," + b + ")";
            };
            var isIE = function () {
                var userAgent = navigator.userAgent;
                var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
                var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
                var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
                return isIE || isIE11 || isEdge || false;
            };
            var getObjByType = function () {
                for (var i = 1; i < arguments.length; i++) if (typeof arguments[i] === arguments[0]) return arguments[i];
                return null;
            };
            var lzySelect = function (selector, copyStyle, callback) {
                this._size = 0;
                this._idx = 0;
                this._list = null;
                this.distance = 2;
                this._callback = function () {
                };
                //-------判断参数，保证用户输入任何顺序都能允许-------------------------------------
                var realsSelector = getObjByType("string", selector, copyStyle, callback);
                var isCopyStyle = getObjByType("boolean", selector, copyStyle, callback);
                var realCallback = getObjByType("function", selector, copyStyle, callback);
                //----初始化对象，-----------------------------------
                var that = this;
                this._select = $(realsSelector);
                this._parent = $("<div class='lzy_select_parent'><div class='lzy_s_p_content'></div><div class='lzy_s_p_arraw'><svg><line x1='2.5' y1='12.5' x2='10' y2='7.5' style='stroke: rgb(0, 0, 0);'></line><line x1='10' y1='7.5' x2='17.5' y2='12.5' style='stroke: rgb(0, 0, 0);'></line></svg></div></div>")
                    .insertBefore(this._select.hide());
                var pStyles = ['position', 'top', 'right', 'left', 'bottom', 'float', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom'];//位置方位的样式必须复制
                for (var i = 0; i < pStyles.length; i++) this._parent.css(pStyles[i], this._select.css(pStyles[i]));
                this._list = $("<div class='lzy_select_list'></div>").appendTo("body");

                if (isCopyStyle) {
                    //节点本身的样式根据是否添加来确定复制
                    var copyPStyle = ['width', 'height', 'color', 'backgroundColor', 'border-radius', 'border-left-color', 'border-right-color', 'border-top-color', 'border-bottom-color', 'border-style', 'border-width', 'box-shadow'];
                    for (var i = 0; i < copyPStyle.length; i++) this._parent.css(copyPStyle[i], this._select.css(copyPStyle[i]));
                    this._parent.css({
                        'width': this._select.outerWidth() - this._select.css("border-width").replace("px", "") * 2,
                        'height': this._select.outerHeight() - this._select.css("border-width").replace("px", "") * 2
                    });
                    var copyCStyle = ['paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom'];
                    for (var i = 0; i < copyCStyle.length; i++) this._parent.find(".lzy_s_p_content").css(copyCStyle[i], this._select.css(copyCStyle[i]));
                    this._parent.find(".lzy_s_p_content").css({ //宽高要单独赋值是因为 css("width") 使用的是外宽，而实际要内宽
                        'width': this._select.width() - 23,
                        'height': this._select.height(),
                        'lineHeight': (isIE() ? this._select.height() + 4 : this._select.height()) + "px",
                        'color': this._select.css("color")
                    });

                    this._parent.find(".lzy_s_p_arraw").css({
                        "margin-top": this._parent.height() / 2 - this._parent.find(".lzy_s_p_arraw").height() / 2
                    }).find("line").css("stroke", this._select.css("border-left-color"));

                    for (var i = 3; i < copyPStyle.length; i++) this._list.css(copyPStyle[i], this._select.css(copyPStyle[i]));
                    this._list.css('width', this._select.outerWidth() - this._select.css("border-width").replace("px", "") * 2);

                }

                var listSonWidth;
                try {
                    this._list.niceScroll({cursorcolor: this._select.css("border-left-color")});
                    listSonWidth = that._select.width() - that._select.css("border-width").replace("px", "") * 4 + "px";
                } catch (e) {
                    console.error("还没有导入 jquery-nicescroll.js！\n" + e);
                    listSonWidth = that._select.width() - that._select.css("border-width").replace("px", "") * 2 + "px";
                    if (isIE() || navigator.userAgent.indexOf("Firefox") > -1) listSonWidth = (that._select.width() - that._select.css("border-width").replace("px", "") * 2 - 15) + "px"; //火狐,ie 的滚动条的宽为15px
                }


                var setList = function () {
                    that._list.empty();
                    var options = that._select.find("option");
                    for (var i = 0; i < options.length; i++) {
                        var attrs = options[i].attributes;
                        var $son = $("<div></div>").attr("title", options[i].text).append(options[i].text);
                        if (isCopyStyle) {
                            $son.css({
                                'color': that._select.css("color"),
                                'padding-left': that._select.css("padding-left"),
                                'padding-right': that._select.css("padding-right"),
                                'padding-top': that._select.css("padding-top"),
                                'padding-bottom': that._select.css("padding-bottom"),
                                'line-height': that._select.height() + "px",
                                'height': that._select.height() + "px",
                                'width': listSonWidth
                            }).hover(function () {
                                $(this).css("background-color", dimColor(that._select.css("border-left-color"), .12));
                            }, function () {
                                $(this).css("background-color", "transparent");
                            });
                        }
                        for (var j = 0; j < attrs.length; j++) {
                            if (attrs[j].name !== "class") $son.attr(attrs[j].name, attrs[j].value);
                        }
                        that._list.append($son);
                        if (i === 0) that._parent.attr("title", $son.attr("selected", true).text()).find(".lzy_s_p_content").html($son.attr("selected", true).text());
                    }
                    that._size = options.length;
                };
                setList();

                //----设置事件，-----------------------------------
                that._parent.on("click", function (event) {
                    (event || window.event).stopPropagation();
                    if (that._list.css("display") === "none") {
                        that._parent.find(".lzy_s_p_arraw").removeClass("lzy_s_p_arraw_close").addClass("lzy_s_p_arraw_open");
                        var rect = that._parent.get(0).getBoundingClientRect();
                        var cTop, aTop;
                        if (that._list.height() > document.documentElement.clientHeight - rect.bottom) {//底部无足够空间
                            cTop = rect.top - that._list.outerHeight() - that.distance - 35;
                            aTop = rect.top - that._list.outerHeight() - that.distance;
                        } else {
                            cTop = rect.bottom + that.distance + 35;
                            aTop = rect.bottom + that.distance;
                        }
                        that._list.css({
                            "top": cTop,
                            "left": rect.left,
                            "opacity": 0.3
                        }).show().animate({
                            "top": aTop,
                            "opacity": 1
                        }, "fast", "swing");
                    } else {
                        that._list.hide();
                        that._parent.find(".lzy_s_p_arraw").removeClass("lzy_s_p_arraw_open").addClass("lzy_s_p_arraw_close");
                    }
                });

                var wheelTime;
                $(document).click(function () {
                    that._list.hide();
                    that._parent.find(".lzy_s_p_arraw").removeClass("lzy_s_p_arraw_open").addClass("lzy_s_p_arraw_close");
                }).on("mousewheel DOMMouseScroll", function () {
                    clearTimeout(wheelTime);
                    wheelTime = setTimeout(function () {
                        var rect = that._parent.get(0).getBoundingClientRect();
                        var top = that._list.height() > document.documentElement.clientHeight - rect.bottom ?
                            rect.top - that._list.outerHeight() - that.distance : rect.bottom + that.distance;
                        that._list.animate({"top": top}, "fast", "swing");
                    }, 200);
                });

                that._list.on("click", "div", function (event) {
                    (event || window.event).stopPropagation();
                    that._parent.attr("title", $(this).text()).find(".lzy_s_p_content").html($(this).text());
                    that._list.hide();
                    that._parent.find(".lzy_s_p_arraw").removeClass("lzy_s_p_arraw_open").addClass("lzy_s_p_arraw_close");
                    that._idx = $(this).index();
                    $(this).attr("selected", true).siblings().removeAttr("selected");
                    that._select.find("option[value='" + $(this).attr("value") + "']")
                        .attr("selected", true).siblings().attr("selected", false);
                    that._select.trigger("change");//保证原来的节点事件正常
                    that._callback.call(that);
                    if (realCallback) realCallback.call(that);
                });

                setInterval(function () {
                    var size = that._select.find("option").length;
                    if (that._size !== size) setList();
                    var idx = that._select.find("option:selected").index();
                    if (that._idx !== idx) {
                        var option = that._select.find("option:selected");
                        that._list.find("div").eq(idx).attr("selected", true)
                            .siblings().removeAttr("selected");
                        that._parent.attr("title", option.text()).find(".lzy_s_p_content").html(option.text());
                        that._idx = idx;
                    }
                }, 300);
            };
            lzySelect.prototype = {
                onChange: function (callback) {
                    if (callback) this._callback = callback;
                },
                addOption: function (option) {
                    this._select.append(option);
                },
                addRow: function (text, attrs) {
                    if (!text || !attrs) throw new Error("传入的参数有误！");
                    var keys = Object.keys(attrs);
                    var $option = $("<option>" + text + "</option>");
                    for (var i = 0; i < keys.length; i++) {
                        $option.attr(keys[i], attrs[keys[i]]);
                    }
                    this._select.append($option);
                },
                getSelected: function (attr) {
                    return this._select.find("option:selected").attr(attr || "value");
                },
                getSelectedText: function () {
                    return this._select.find("option:selected").text();
                },
                getSelectedParams: function () {
                    var params = {};
                    var $option = this._select.find("option:selected");
                    var attrs = $option.get(0).attributes;
                    for (var i = 0; i < attrs.length; i++) params[attrs[i].name] = attrs[i].value;
                    params.text = $option.text();
                    params.html = $option.text();
                    return params
                },
                setSelected: function (attrName, attrVal) {
                    var that = this;
                    setTimeout(function () {
                        var option = that._select.find("option[" + attrName + "='" + attrVal + "']");
                        option.attr("selected", true).siblings().attr("selected", false);
                        that._list.find("div[" + attrName + "='" + attrVal + "']")
                            .attr("selected", true).siblings().removeAttr("selected");
                        that._parent.attr("title", option.text()).find(".lzy_s_p_content").html(option.text());
                    }, 300);
                }
            };
            return new lzySelect(selector, copyStyle, callback);
        }
    });
})(jQuery, window, document);
