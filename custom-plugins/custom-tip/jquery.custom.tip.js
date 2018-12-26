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
        CoustomTip: function (cfg) {
            var base64Img = "data:image/gif;base64,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";
            var CTip = function (cfg) {
                var that = this;
                this.$bgDom = $("<div style='position: fixed;z-index:11110;'></div>");
                this.imgDom = "<div style='width: 25px;height: 25px;border: none;display: inline-block;background-size: 100% 100%;margin-bottom: -5px;'></div>";
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
                            position: tipCfg.position || 'relative',
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
                            iconUrl: tipCfg.iconUrl || base64Img,
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
                    var cont = content || "";
                    var tipObj = $(this.tipDom).css({
                        "display": "block",
                        "width": this.defCfg.width,
                        "border-radius": this.defCfg.borderRadius,
                        "background-color": this.defCfg.bgColor,
                        "font-size": this.defCfg.fontSize,
                        "padding": this.defCfg.padding,
                        "color": this.defCfg.color,
                        "right": 'unset',
                        "bottom": 'unset'
                    });
                    this.$bgDom.css({
                        "background-color": this.defCfg.bgColor,
                        'opacity': this.defCfg.bgOpacity
                    });

                    var $body = $("body");
                    var parentRect = document.querySelector(this.defCfg.parent).getBoundingClientRect();


                    $body.append(tipObj.css({
                        top: parentRect.top + parentRect.height / 2,
                        left: parentRect.left + parentRect.width / 2
                    }).html(cont.replace("\n", "<br>")));

                    if (this.defCfg.position === "absolute") {
                        tipObj.css({
                            top: window.innerHeight / 2,
                            left: window.innerWidth / 2
                        });
                    }

                    tipObj.css({
                        "margin-top": -(tipObj.outerHeight() / 2) + "px",
                        "margin-left": -(tipObj.outerWidth() / 2) + "px"
                    });

                    if (this.defCfg.showIcon) {
                        $(this.imgDom).css({
                            "width": this.defCfg.iconWidth,
                            "heigth": this.defCfg.iconHeigth,
                            "background-image": "url(" + this.defCfg.iconUrl + ")",
                            "margin-right": cont === null || cont === "" || typeof(cont) === "undefined" ? "0px" : "5px"
                        }).prependTo(tipObj);
                    }
                    this.tipObjs.push(tipObj);

                    if (this.defCfg.blurredBg) {
                        $body.append(this.$bgDom.css({
                            top: parentRect.top,
                            left: parentRect.left,
                            width: parentRect.width,
                            height: parentRect.height
                        }));

                        if (this.defCfg.position === "absolute") {
                            this.$bgDom.css({
                                top: 0,
                                left: 0,
                                width: window.innerWidth,
                                height: window.innerHeight
                            })
                        }

                        this.$bgDom.off("mousewheel DOMMouseScroll")
                            .on("mousewheel DOMMouseScroll", function () {
                                return false;
                            });
                    }

                    var that = this;
                    if (this.defCfg.autoHide) {
                        setTimeout(function () {
                            tipObj.fadeOut(that.defCfg.hideTime, function () {
                                that.closeTip(tipObj);
                            });
                        }, that.defCfg.showTime);
                    }
                    setTimeout(function () {
                        that.closeTip();
                    }, 60000);
                },
                closeTip: function (tipObj, bgObj) {
                    var delObj = function (obj, objs) {
                        obj.remove();
                        if (objs) objs.splice(objs.indexOf(obj), 1);
                    };
                    if (tipObj) {
                        delObj(tipObj, this.tipObjs);
                    } else {
                        for (var i = this.tipObjs.length - 1; i >= 0; i--) delObj(this.tipObjs[i], this.tipObjs);
                    }
                    if (this.tipObjs.length === 0) delObj(this.$bgDom);
                }
            };
            return new CTip(cfg);
        }
    });
})(jQuery, window, document);