/*
自定义提示框
I am liangzhenyu
2018-01-05
*/

/*
插件-自定义提示
使用方法说明：
    1.此插件基于jQuery编写，使用时需要先导入jQuery
    2.获取对象
        var myTip = $.CoustomTip(cfg);
        cfg:配置文件如果不设置将使用默认设置
    3.设置配置
        myTip.setCfg(cfg, status);
        cfg:配置文件如果不设置将使用默认设置
        status:配置文件的状态（false:在原配置文件上追加，重复的将覆盖；true:全新覆盖，未配置的将使用默认值），默认值为false
    4.显示提示框
        myTip.showTip(content);
        content:添加空格代替换行，即先写标题然后加空格（代表换行），再加内容
    5.关闭提示框
        myTip.closeTip();
 参数说明：
    cfg:{
        position:定位，相对定位：relative，绝对定位：absolute；相对定位时是相对 parent父节点位置设置，绝对定位是根据屏幕设置位置
        parent:父节点(用作相对对象)的 DOM 对象或 ID ，即是提示框所作用（覆盖）的对象,
        width:提示框的长,
        borderRadius:边框的圆角大小,
        bgColor:提示框的背景颜色,
        fontSize:文字大小,
        color:文字颜色,
        showTime:停留时长,
        hideTime:隐藏动态时长,
        autoHide:是否自动隐藏,
        blurredBg:是否添加模糊背景,
        bgOpacity:模糊背景的透明度(如果没有添加模糊背景,该参数无效),
        showIcon:是否显示 icon ,
        iconUrl: icon 的url(可以具体路径，也可以时base64图片码),
        iconWidth: icon 的宽,
        iconHeigth: icon 的高
    }
 */

;(function ($, window, document, undefined) {
    $.extend({
        CustomTip: function (cfg) {
            /**
             * 获取body下的所有子节点中最大的zIndex值
             */
            var getMaxZIndex = function () {
                var arr = [], $objs = $("body>*");
                for (var i = 0; i < $objs.length; i++) {
                    var z = $($objs[i]).css("zIndex");
                    arr.push(isNaN(z) ? 0 : z);
                }
                var maxZIndex = arr.length ? Math.max.apply(null, arr) : 0;
                return maxZIndex > 999999 ? maxZIndex + 1 : 1000000;
            };
            var CTip = function (cfg) {
                var that = this;
                this.$bgObj = $("<div style='position: fixed;'></div>");
                this.imgDom = "<div style='position: relative;width: 25px;height: 25px;border: none;display: inline-block;background-size: 100% 100%;margin-bottom: -5px;' class='lzyEffect'></div>";
                this.tipDom = "<div style='position: fixed;height:auto;z-index:11111;text-align: center;'></div>";
                this.defCfg = {};
                this.tipObjs = [];
                document.onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    if (e && e.keyCode === 27) that.closeTip();
                };
                this.setCfg(cfg, true);
            };
            CTip.prototype = {
                setCfg: function (tipCfg, status) {
                    tipCfg = tipCfg || {};
                    var isTrue = function (val) {
                        return !(val === null || typeof(val) === "undefined" || val === 0);
                    };

                    if (status) {
                        this.defCfg = {};
                        this.defCfg = {
                            position: tipCfg.position || 'absolute',
                            parent: tipCfg.parent || 'body',
                            width: tipCfg.width || 'auto',
                            borderRadius: tipCfg.borderRadius || '5px',
                            bgColor: tipCfg.bgColor || 'black',
                            fontSize: tipCfg.fontSize || '18px',
                            padding: tipCfg.padding || '10px',
                            color: tipCfg.color || 'white',
                            showTime: tipCfg.showTime || 3000,
                            hideTime: tipCfg.hideTime || 1000,
                            autoHide: isTrue(tipCfg.autoHide) ? tipCfg.autoHide : true,
                            blurredBg: isTrue(tipCfg.blurredBg) ? tipCfg.blurredBg : false,
                            bgOpacity: tipCfg.bgOpacity || '0.3',
                            showIcon: isTrue(tipCfg.showIcon) ? tipCfg.showIcon : false,
                            iconUrl: tipCfg.iconUrl,
                            iconWidth: tipCfg.iconWidth || '25px',
                            iconHeigth: tipCfg.iconHeigth || '25px'
                        };
                    } else {
                        this.defCfg = {
                            position: tipCfg.position || this.defCfg.position,
                            parent: tipCfg.parent || this.defCfg.parent,
                            width: tipCfg.width || this.defCfg.width,
                            borderRadius: tipCfg.borderRadius || this.defCfg.borderRadius,
                            bgColor: tipCfg.bgColor || this.defCfg.bgColor,
                            fontSize: tipCfg.fontSize || this.defCfg.fontSize,
                            padding: tipCfg.padding || this.defCfg.padding,
                            color: tipCfg.color || this.defCfg.color,
                            showTime: tipCfg.showTime || this.defCfg.showTime,
                            hideTime: tipCfg.hideTime || this.defCfg.hideTime,
                            autoHide: isTrue(tipCfg.autoHide) ? tipCfg.autoHide : this.defCfg.autoHide,
                            blurredBg: isTrue(tipCfg.blurredBg) ? tipCfg.blurredBg : this.defCfg.blurredBg,
                            bgOpacity: tipCfg.bgOpacity || this.defCfg.bgOpacity,
                            showIcon: isTrue(tipCfg.showIcon) ? tipCfg.showIcon : this.defCfg.showIcon,
                            iconUrl: tipCfg.iconUrl || this.defCfg.iconUrl,
                            iconWidth: tipCfg.iconWidth || this.defCfg.iconWidth,
                            iconHeigth: tipCfg.iconHeigth || this.defCfg.iconHeigth
                        };
                    }
                    return this;
                },
                showTip: function (content) {
                    var that = this, $body = $("body");
                    var parentRect = document.querySelector(this.defCfg.parent).getBoundingClientRect();

                    if (that.defCfg.blurredBg) {
                        that.$bgObj.css({
                            "top": parentRect.top,
                            "left": parentRect.left,
                            "width": parentRect.width,
                            "height": parentRect.height,
                            "background-color": that.defCfg.bgColor,
                            'opacity': that.defCfg.bgOpacity
                        }).appendTo($body).off("mousewheel DOMMouseScroll")
                            .on("mousewheel DOMMouseScroll", function () {
                                return false;
                            });

                        if (that.defCfg.position === "absolute") {
                            that.$bgObj.css({
                                top: 0,
                                left: 0,
                                width: window.innerWidth,
                                height: window.innerHeight
                            })
                        }
                    }

                    var $tipObj = $(that.tipDom).css({
                        "display": "block",
                        "width": that.defCfg.width,
                        "border-radius": that.defCfg.borderRadius,
                        "background-color": that.defCfg.bgColor,
                        "font-size": that.defCfg.fontSize,
                        "padding": that.defCfg.padding,
                        "color": that.defCfg.color,
                        "right": 'unset',
                        "bottom": 'unset',
                        "z-index": getMaxZIndex()
                    }).html((content || "").replace("\n", "<br>")).appendTo($body);

                    $tipObj.css({
                        "top": (that.defCfg.position === "absolute" ? window.innerHeight / 2 : parentRect.top + parentRect.height / 2) - $tipObj.height() / 2,
                        "left": (that.defCfg.position === "absolute" ? window.innerWidth / 2 : parentRect.left + parentRect.width / 2) - $tipObj.width() / 2
                    });

                    if (that.defCfg.showIcon) {
                        var $imgObj = $(that.imgDom);
                        $imgObj.css({
                            "width": that.defCfg.iconWidth,
                            "heigth": that.defCfg.iconHeigth,
                            "margin-right": !content || content === "" ? "0" : "5px"
                        }).empty().prependTo($tipObj);
                        if (that.defCfg.iconUrl) {
                            $imgObj.css({"background-image": "url(" + that.defCfg.iconUrl + ")"});
                        } else {
                            var imgStr = "EP{display:inline-block;width:5px;height:5px;border-radius:50%;background:%color;position:absolute;-webkit-animation:load 1.04s ease infinite}@-webkit-keyframes load{0%{opacity:1}100%{opacity:.2}}EP:NC(1){left:0;top:50%;MGtop:-2.5px;WD:.13s}EP:NC(2){left:3px;top:3px;WD:.26s}EP:NC(3){left:50%;top:0;MGleft:-2.5px;WD:.39s}EP:NC(4){top:3px;right:3px;WD:.52s}EP:NC(5){right:0;top:50%;MGtop:-2.5px;WD:.65s}EP:NC(6){right:3px;bottom:3px;WD:.78s}EP:NC(7){bottom:0;left:50%;MGleft:-2.5px;WD:.91s}EP:NC(8){bottom:3px;left:3px;WD:1.04s}".replace(/EP/g, ".lzyEffect span").replace(/NC/g, "nth-child").replace(/WD/g, "-webkit-animation-delay").replace(/MG/g, "margin-");
                            $tipObj.append("<style>" + imgStr.replace("%color", that.defCfg.color) + "</style>");
                            for (var i = 0; i < 8; i++) $imgObj.append("<span></span>");
                        }
                    }

                    that.tipObjs.push($tipObj);

                    if (that.defCfg.autoHide) {
                        setTimeout(function () {
                            $tipObj.fadeOut(that.defCfg.hideTime, function () {
                                that.closeTip($tipObj);
                            });
                        }, that.defCfg.showTime);
                    }
                    setTimeout(function () {
                        that.closeTip();
                    }, 60000);
                },
                closeTip: function (tipObj) {
                    var delObj = function (obj, objs) {
                        obj.remove();
                        if (objs) objs.splice(objs.indexOf(obj), 1);
                    };
                    if (tipObj) {
                        delObj(tipObj, this.tipObjs);
                    } else {
                        for (var i = this.tipObjs.length - 1; i >= 0; i--) delObj(this.tipObjs[i], this.tipObjs);
                    }
                    if (this.tipObjs.length === 0) delObj(this.$bgObj);
                }
            };
            return new CTip(cfg);
        }
    });
})(jQuery, window, document);