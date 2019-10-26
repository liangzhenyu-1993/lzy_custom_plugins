/*
    自定义工具
    I am liangzhenyu
    2018-05-25
*/

/*
插件 - 仿sublime和notepad++

兼容：IE9+

使用方法说明：
    1.此插件基于jQuery编写，使用时需要先导入jQuery；
    2.$(selector).initTextarea();//编辑框的样式是根据textarea的样式获取，所以textarea的样式根据自己所需而配置
 */
;(function ($, window, document, undefined) {
    "use strict";
    var ImitateEditor = function (ele) {
        var rW = 35;
        this.$textarea = $(ele).attr({"wrap": "off"});
        this.$container = $("<div></div>").css({
            "position": this.$textarea.css("position") === ("absolute" || "fixed") ? this.$textarea.css("position") : "relative",
            "display": this.$textarea.css("display") === "inline" ? "inline-block" : this.$textarea.css("display"),
            "width": this.$textarea.outerWidth(true),
            "height": this.$textarea.outerHeight(true),
            "margin-top": this.$textarea.css("margin-top"),
            "margin-right": this.$textarea.css("margin-right"),
            "margin-bottom": this.$textarea.css("margin-bottom"),
            "margin-left": this.$textarea.css("margin-left"),
        }).attr("name", "textarea");
        this.$textarea.css({
            "position": "absolute",
            "top": "0",
            "left": "0",
            "white-space": "pre",
            "resize": "none",
            "line-height": this.$textarea.css("font-size"),
            "outline": "none",
            "width": this.$textarea.width() - rW - 3,
            "padding-left": rW + 3,
            "margin": "0",
            "z-index": 1,
            "overflow": "auto"
        });
        this.$rowsNav = $("<div></div>").css({
            "position": "absolute",
            "top": tools.isFire() || tools.isIE() ? this.$textarea.css("border-top-width") : "0",
            "left": tools.isFire() || tools.isIE() ? this.$textarea.css("border-left-width") : "0",
            "padding-left": 0,
            "padding-right": 0,
            "padding-top": tools.parseVal(this.$textarea.css("padding-top")),
            "padding-bottom": tools.parseVal(this.$textarea.css("padding-bottom")),
            "background-color": tools.navColor(this.$textarea.css("background-color")),
            "border": this.$textarea.css("border"),
            "border-right": "none",
            "float": "left",
            "width": rW,
            "height": this.$textarea.height() + 'px',
            "z-index": 2
        });
        this.$rows = $("<div></div>").css({
            "color": tools.hoverColor(this.$textarea.css("color"), .8),
            "width": rW,
            "height": this.$textarea.height(),
            "font-size": this.$textarea.css("font-size"),
            "line-height": this.$textarea.css("line-height"),
            "overflow": "hidden",
            "margin": 0,
            "text-align": "center",
            "font-family": "仿宋",
            "display": "inline-block"
        });
    };

    ImitateEditor.prototype = {
        initEvent: function () {
            var _this = this;
            _this.$textarea.wrap(_this.$container).on('keydown', function () {
                _this.inputText();
            }).on('scroll', function () {
                _this.syncScroll();
            }).on('click', function () {
                _this.syncIndex();
            }).on('keyup', function () {
                _this.inputText();
                _this.syncIndex();
            });
            _this.$rowsNav.append(_this.$rows).insertBefore(_this.$textarea).on("mousewheel DOMMouseScroll", function (e) {
                var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                    (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));// firefox
                var oft = delta > 0 ? -10 : 10, idx = 0;
                var dynamic = setInterval(function () {
                    _this.$textarea.get(0).scrollTop += oft;
                    if (idx++ >= 10) {
                        clearInterval(dynamic);
                        _this.syncScroll();
                    }
                }, 10);
            });
            _this.inputText();
        },
        inputText: function () {
            var _this = this;
            setTimeout(function () {
                var value = _this.$textarea.val();
                value.match(/\n/g) ? _this.updateLine(value.match(/\n/g).length + 1) : _this.updateLine(1);
                _this.syncScroll();
            }, 0);
        },
        updateLine: function (count) {
            var rowLen = this.$rows.children().length, i = rowLen;
            if (count > rowLen) for (; i < count; i++) this.$rows.append("<div style='cursor:default;text-align: right;padding-right: 5px;'>" + (i + 1) + "</div>");
            if (count < rowLen) for (; i > count; i--) this.$rows.children().eq(i - 1).remove();
        },
        syncScroll: function () {
            this.$rows.children().eq(0).css("margin-top", -(this.$textarea.scrollTop()) + "px");
            var curH = this.$textarea.innerHeight(),
                paddingBottom = parseInt(this.$textarea.css("padding-bottom").toString().replace("px", ""));
            if (this.$textarea.get(0).scrollWidth > this.$textarea.innerWidth()) {
                curH = this.$textarea.innerHeight() - 17;
                this.$rows.css("height", curH - paddingBottom);
                this.$rowsNav.css({
                    "height": curH - paddingBottom,
                    "padding-bottom": 0,
                    "border-bottom": "none",
                });
            } else {
                this.$rows.css("height", curH - paddingBottom * 2);
                this.$rowsNav.css({
                    "height": curH - paddingBottom * 2,
                    "padding-bottom": paddingBottom,
                    "border-bottom": this.$textarea.css("border-bottom"),
                });
            }
        },
        syncIndex: function () {
            var start = this.$textarea.get(0).selectionStart;
            // if (tools.isIE() <= 8) {
            //     var selection = document.selection;
            //     range = selection.createRange();
            //     var stored_range = range.duplicate();
            //     stored_range.moveToElementText(this.$textarea.get(0));
            //     stored_range.setEndPoint('EndToEnd', range);
            //     console.log(stored_range)
            //     start = stored_range.text.length - range.text.length;
            //     var cur = stored_range.text.split("\n").length;
            //     if (cur >= 2) start -= (cur - 1);
            // }
            var line = this.$textarea.val().substring(0, start).split("\n").length;
            this.$rows.children().eq(line - 1).css("background-color", tools.hoverColor(this.$rowsNav.css("background-color"), 0.9))
                .siblings().css("background-color", "transparent");
        }
    };

    var tools = {
        toRgb: function (color) {
            color = color.toLowerCase();
            var _EN_COLOR = function () {
                var placeholder = "N,O,P,Q,R,S,T,U,V,W,X,Y,Z,M,L,K,J".split(",");
                var replace = "dark,deep,light,medium,white,red,black,aqua,green,blue,yellow,orange,pink,00,ff,80,ee".split(",");
                var strEnColor = '{"aliceW":"f0f8L","antiqueR":"faebd7","U":"MLL","Umarine":"7Lfd4","azure":"f0LL","beige":"f5f5dc","bisque":"Le4c4","T":"MMM","blanchedalmond":"Lebcd","W":"MML","Wviolet":"8a2be2","brown":"a52a2a","burlywood":"deb887","cadetW":"5f9ea0","chartreuse":"7LfM","chocolate":"d2691e","coral":"L7f50","cornflowerW":"6495ed","cornsilk":"Lf8dc","crimson":"dc143c","cyan":"MLL","NW":"MM8b","Ncyan":"M8b8b","Ngoldenrod":"b886b","Ngray":"a9a9a9","NV":"M64M","Nkhaki":"bdb76b","Nmagenta":"8bM8b","NoliveV":"556b2f","NY":"L8cM","Norchid":"9932cc","NS":"8bMM","Nsalmon":"e9967a","NseaV":"8fbc8f","NslateW":"483d8b","Nslategray":"2f4f4f","Nturquoise":"Mced1","Nviolet":"94Md3","OZ":"L1493","OskyW":"MbLf","dimgray":"696969","dodgerW":"1e90L","feldspar":"d19275","firebrick":"b22222","floralR":"Lfaf0","forestV":"228b22","fuchsia":"LML","gainsboro":"dcdcdc","ghostR":"f8f8L","gold":"Ld7M","goldenrod":"daa520","gray":"KKK","V":"M8M0","VX":"adL2f","honeydew":"f0Lf0","hotZ":"L69b4","indianS":"cd5c5c","indigo":"4bM82","ivory":"LLf0","khaki":"f0e68c","lavender":"e6e6fa","lavenderblush":"Lf0f5","lawnV":"7cfcM","lemonchiLon":"Lfacd","PW":"add8e6","Pcoral":"f0KK","Pcyan":"e0LL","PgoldenrodX":"fafad2","Pgrey":"d3d3d3","PV":"90K90","PZ":"Lb6c1","Psalmon":"La07a","PseaV":"20b2aa","PskyW":"87cefa","PslateW":"8470L","Pslategray":"778899","PstKlW":"b0c4de","PX":"LLe0","lime":"MLM","limeV":"32cd32","linen":"faf0e6","magenta":"LML","maroon":"8MM0","QUmarine":"66cdaa","QW":"MMcd","Qorchid":"ba55d3","Qpurple":"9370d8","QseaV":"3cb371","QslateW":"7b68K","QspringV":"Mfa9a","Qturquoise":"48d1cc","QvioletS":"c71585","midnightW":"191970","mintcream":"f5Lfa","mistyrose":"Le4e1","moccasin":"Le4b5","navajoR":"Ldead","navy":"MMK","oldlace":"fdf5e6","olive":"K8M0","olivedrab":"6b8e23","Y":"La5M","YS":"L45M","orchid":"da70d6","palegoldenrod":"Ke8aa","paleV":"98fb98","paleturquoise":"afKK","palevioletS":"d87093","papayawhip":"Lefd5","peachpuL":"Ldab9","peru":"cd853f","Z":"Lc0cb","plum":"dda0dd","powderW":"b0e0e6","purple":"8M0K","S":"LMM","rosybrown":"bc8f8f","royalW":"4169e1","saddlebrown":"8b4513","salmon":"faK72","sandybrown":"f4a460","seaV":"2e8b57","seashell":"Lf5K","sienna":"a0522d","silver":"c0c0c0","skyW":"87cKb","slateW":"6a5acd","slategray":"70K90","snow":"Lfafa","springV":"ML7f","stKlW":"4682b4","tan":"d2b48c","teal":"MKK","thistle":"d8bfd8","tomato":"L6347","turquoise":"40e0d0","violet":"K82K","violetS":"d02090","wheat":"f5deb3","R":"LLL","Rsmoke":"f5f5f5","X":"LLM","XV":"9acd32"}';
                for (var i = 0; i < placeholder.length; i++) strEnColor = strEnColor.replace(new RegExp(placeholder[i], "g"), replace[i]);
                return strEnColor;
            };
            var _Hex2RGB = function (color) {
                var i = 0, arrColor = [];
                if (color.length === 4) {
                    var nColor = "#";
                    for (i = 1; i < 4; i += 1) nColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                    color = nColor;
                }
                for (i = 1; i < 7; i += 2) arrColor.push(parseInt("0x" + color.slice(i, i + 2)));
                return "rgb(" + arrColor[0] + "," + arrColor[1] + "," + arrColor[2] + ")";
            };
            if (color.indexOf("rgba") >= 0) {
                return color;
            } else if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color)) {
                return _Hex2RGB(color);
            } else if (color.indexOf("rgb") >= 0) {
                if (color.indexOf("%") >= 0) {
                    var arrRgb = color.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
                    return "rgb(" + parseInt(arrRgb[0] / 100 * 255) + "," + parseInt(arrRgb[1] / 100 * 255) + "," + parseInt(arrRgb[2] / 100 * 255) + ")";
                }
                return color;
            } else {
                var hexColor = JSON.parse(_EN_COLOR())[color];
                if (!hexColor) {
                    console.error("抱歉！无该英文颜色");
                    return color;
                }
                return _Hex2RGB(hexColor);
            }
        },
        hoverColor: function (color, oft) {
            oft = oft || 0.5;
            var rgb = this.toRgb(color);
            var r = rgb.r, g = rgb.g, b = rgb.b;
            if (r <= 50 && g <= 50 && b <= 50) return "rgb(" + parseInt((50 + r) * oft) + "," + parseInt((50 + g) * oft) + "," + parseInt((50 + b) * oft) + ")";
            return "rgb(" + parseInt(r * oft) + "," + parseInt(g * oft) + "," + parseInt(b * oft) + ")";//暗颜色
        },
        navColor: function (color) {
            var rgb = this.toRgb(color);
            if (rgb.r > 234 && rgb.g > 234 && rgb.b > 234) return "rgb(234,234,234)";
            if (rgb.r < 50 && rgb.g < 50 && rgb.b < 50) return "rgb(50,50,50)";
            return color;
        },
        parseVal: function (val) {
            if (!val) return 0;
            return parseInt(val.toString().replace("px", ""));
        },
        isIE: function () {
            var userAgent = navigator.userAgent;
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if (isEdge) return "edge";
            if (isIE11) return 11;
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseInt(RegExp["$1"]);
                if (fIEVersion === 7) return 7;
                else if (fIEVersion === 8) return 8;
                else if (fIEVersion === 9) return 9;
                else if (fIEVersion === 10) return 10;
                else return 0;
            }
            return false;
        },
        isFire: function () {
            return navigator.userAgent.indexOf("Firefox") > -1;
        }
    };

    $.fn.extend({
        initTextarea: function (options) {
            this.each(function () {
                var $this = $(this), imitateEditor = $this.data('lzyTextarea');
                if (!imitateEditor) {
                    imitateEditor = new ImitateEditor($this);
                    $this.data('lzyTextarea', imitateEditor);
                }
                imitateEditor.initEvent();
            });
        }
    });

})(jQuery, window, document);
