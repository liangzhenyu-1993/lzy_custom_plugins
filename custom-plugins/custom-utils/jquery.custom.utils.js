/*
    自定义工具
    I am liangzhenyu
    2018-01-25
    注：以下所有工具单独抽离依然可用！
*/

;(function ($, window, document, undefined) {
    /**
     * 动态数字
     * @param num 数字,可以是小数或百分数
     * @param speed 动画速度（可选参数）
     */
    $.fn.animateNum = function (num, speed) {
        var _obj = this;
        if (!_obj && !_obj.html()) return;
        if (_obj.text() === num) return;
        var strNum = num.toString().replace("%", "");
        var strSuf = num.toString().indexOf("%") >= 0 ? "%" : "";
        if (!num || isNaN(strNum) || strNum === 0 || strNum === "NaN") {
            _obj.html(0 + strSuf);
            return;
        }
        var intDeci = strNum.split(".");
        var deciLenght = strNum.indexOf(".") > 0 ? intDeci[1].length : 0;
        var oNum = strNum, iNum = 0;
        if (oNum > 10) {
            if (strNum.indexOf(".") > 0) {
                iNum = parseFloat(intDeci[0].substring(0, intDeci[0].length - 1) + "." + intDeci[1]);
            } else {
                iNum = parseInt(intDeci[0].substring(0, intDeci[0].length - 1));
            }
        }

        var offset = 1;
        var curSpeed = speed || 20;
        if (oNum >= 100) {
            offset = (oNum - iNum) / 20;
        } else {
            curSpeed = parseInt(400 / oNum);
        }
        var toThousands = function (num) {
            return (num || 0).toString().replace(num.indexOf(".") > 0 ? /(\d)(?=(\d{3})+(?:\.))/g : /(\d)(?=(\d{3})+(?:$))/g, '$1,');
        };
        var mTime = setInterval(function () {
            _obj.html(toThousands(iNum.toFixed(deciLenght)) + strSuf);
            iNum += offset;
            if (iNum >= oNum) {
                _obj.html(toThousands(oNum) + strSuf);
                clearInterval(mTime);
            }
        }, curSpeed);
    };

    /**
     * 复制所有常见样式
     * @param copyObj 复制的对象
     * @returns {jQuery} 返回自身对象
     */
    $.fn.copyStyle = function (copyObj) {
        var styleKeys = ['background', 'backgroundAttachment', 'backgroundBlendMode', 'backgroundClip', 'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition', 'backgroundPositionX', 'backgroundPositionY', 'backgroundRepeat', 'backgroundRepeatX', 'backgroundRepeatY', 'backgroundSize', 'border', 'borderBottom', 'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderColor', 'borderImage', 'borderImageOutset', 'borderImageRepeat', 'borderImageSlice', 'borderImageSource', 'borderImageWidth', 'borderLeft', 'borderLeftColor', 'borderLeftStyle', 'borderLeftWidth', 'borderRadius', 'borderRight', 'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderSpacing', 'borderStyle', 'borderTop', 'borderTopColor', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth', 'borderWidth', 'bottom', 'boxShadow', 'boxSizing', 'caretColor', 'clear', 'clip', 'clipPath', 'cursor', 'direction', 'display', 'filter', 'float', 'font', 'fontDisplay', 'fontFamily', 'fontFeatureSettings', 'fontKerning', 'fontSize', 'fontStretch', 'fontStyle', 'fontVariant', 'fontVariantCaps', 'fontVariantEastAsian', 'fontVariantLigatures', 'fontVariantNumeric', 'fontVariationSettings', 'fontWeight', 'height', 'left', 'letterSpacing', 'lineHeight', 'margin', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'maxWidth', 'maxZoom', 'minHeight', 'minWidth', 'minZoom', 'opacity', 'outline', 'outlineColor', 'outlineOffset', 'outlineStyle', 'outlineWidth', 'overflow', 'overflowAnchor', 'overflowWrap', 'overflowX', 'overflowY', 'overscrollBehavior', 'overscrollBehaviorX', 'overscrollBehaviorY', 'padding', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'position', 'right', 'textAlign', 'textAlignLast', 'textAnchor', 'textCombineUpright', 'textDecoration', 'textDecorationColor', 'textDecorationLine', 'textDecorationSkipInk', 'textDecorationStyle', 'textIndent', 'textOrientation', 'textOverflow', 'textRendering', 'textShadow', 'textSizeAdjust', 'textTransform', 'textUnderlinePosition', 'top', 'transform', 'transformBox', 'transformOrigin', 'transformStyle', 'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty', 'transitionTimingFunction', 'verticalAlign', 'visibility', 'whiteSpace', 'width', 'wordBreak', 'wordSpacing', 'wordWrap', 'x', 'y', 'zIndex', 'zoom'];
        for (var i = 0; i < styleKeys.length; i++) this.css(styleKeys[i], copyObj.css(styleKeys[i]));
        return this;
    };

    /**
     * 给ifame 内嵌框添加click事件
     * @param callback 回调函数
     */
    $.fn.iframeOnClick = function (callback) {
        var IframeOnClick = {
            resolution: 200,
            iframes: [],
            interval: null,
            Iframe: function () {
                this.element = arguments[0];
                this.cb = arguments[1];
                this.hasTracked = false;
            },
            track: function (element, cb) {
                this.iframes.push(new this.Iframe(element, cb));
                if (!this.interval) {
                    var _this = this;
                    this.interval = setInterval(function () {
                        _this.checkClick();
                    }, this.resolution);
                }
            },
            checkClick: function () {
                if (document.activeElement) {
                    var activeElement = document.activeElement;
                    for (var i in this.iframes) {
                        if (activeElement === this.iframes[i].element) { // user is in this Iframe
                            if (this.iframes[i].hasTracked == false) {
                                this.iframes[i].cb.apply(window, []);
                                this.iframes[i].hasTracked = true;
                            }
                        } else {
                            this.iframes[i].hasTracked = false;
                        }
                    }
                }
            }
        };
        IframeOnClick.track(this, callback);
    };

    $.extend({
        /**
         * jquery方式实现form提交
         * @param configuration 配置(url:连接,method:方式,target:打开类型,params:参数)
         */
        formTo: function (configuration) {
            var form = $("<form style='display:none;' accept-charset='UTF-8'></form>");
            form.attr({
                "action": configuration.url || "",
                "method": configuration.method || "post",
                "target": configuration.target || "_self"
            });
            var params = configuration.params || {};
            var values = Object.keys(params);
            for (var i = 0; i < values.length; i++) {
                if (params[values[i]] === undefined || params[values[i]] === null) continue;
                var input = $("<input type='hidden'>");
                input.attr({"name": values[i]});
                input.val(params[values[i]]);
                form.append(input);
            }
            form.appendTo("body").submit();
        }
    });


    window.TimeTool = {
        getIntDateBefore: function (num, type, time) {
            var timeArr, date = this._dealTime2Obj(time);
            if (type === "month" || type === 1) {
                var month = date.getMonth() + 1;
                if (month > num) return date.getFullYear() + "" + this._dealLessTen(month - num);
                if (month === num) return date.getFullYear() - 1 + "12";
                if (month < num) {
                    if (num - month > 12) return date.getFullYear() - parseInt(num / 12) + "" + this._dealLessTen(month - num % 12);
                    else return date.getFullYear() - 1 + "" + this._dealLessTen(12 - (num - month));
                }
            }
            if (!type || type === "day" || type === 2) {
                date.setTime(date.getTime() - (num || 0) * 24 * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + this._dealLessTen(timeArr[1]) + this._dealLessTen(timeArr[2]);
            }
            if (type === "hour" || type === 3) {
                date.setTime(date.getTime() - (num || 0) * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + this._dealLessTen(timeArr[1]) + this._dealLessTen(timeArr[2]) + this._dealLessTen(timeArr[3]);
            }
            if (type === "min" || type === 4) {
                date.setTime(date.getTime() - (num || 0) * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + this._dealLessTen(timeArr[1]) + this._dealLessTen(timeArr[2]) + this._dealLessTen(timeArr[3]) + this._dealLessTen(timeArr[4]);
            }
            return null;
        },
        getFormatDateBefore: function (num, type, time, str1, str2) {
            var timeArr, date = this._dealTime2Obj(time);
            if (type === "month" || type === 1) {
                var month = date.getMonth() + 1;
                if (month > num) return date.getFullYear() + (str1 || "-") + this._dealLessTen(month - num);
                if (month === num) return date.getFullYear() - 1 + (str1 || "-") + "12";
                if (month < num) {
                    if (num - month > 12) return date.getFullYear() - parseInt(num / 12) + "" + this._dealLessTen(month - num % 12);
                    else return date.getFullYear() - 1 + (str1 || "-") + this._dealLessTen(12 - (num - month));
                }
            }
            if (!type || type === "day" || type === 2) {
                date.setTime(date.getTime() - (num || 0) * 24 * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + (str1 || "-") + this._dealLessTen(timeArr[1]) + (str1 || "-") + this._dealLessTen(timeArr[2]);
            }
            if (type === "hour" || type === 3) {
                date.setTime(date.getTime() - (num || 0) * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + (str1 || "-") + this._dealLessTen(timeArr[1]) + (str1 || "-") + this._dealLessTen(timeArr[2]) + " " + this._dealLessTen(timeArr[3]) + (str2 || ":") + "00";
            }
            if (type === "min" || type === 4) {
                date.setTime(date.getTime() - (num || 0) * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + (str1 || "-") + this._dealLessTen(timeArr[1]) + (str1 || "-") + this._dealLessTen(timeArr[2]) + " " + this._dealLessTen(timeArr[3]) + (str2 || ":") + this._dealLessTen(timeArr[4]);
            }
            return null;
        },
        getIntDateAfter: function (num, type, time) {
            var timeArr, date = this._dealTime2Obj(time);
            if (type === "month" || type === 1) {
                var month = date.getMonth() + 1;
                if (month > num) return date.getFullYear() + "" + this._dealLessTen(month - num);
                if (month === num) return date.getFullYear() - 1 + "12";
                if (month < num) {
                    if (num - month > 12) return date.getFullYear() - parseInt(num / 12) + "" + this._dealLessTen(month - num % 12);
                    else return date.getFullYear() - 1 + "" + this._dealLessTen(12 - (num - month));
                }
            }
            if (!type || type === "day" || type === 2) {
                date.setTime(date.getTime() + (num || 0) * 24 * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + this._dealLessTen(timeArr[1]) + this._dealLessTen(timeArr[2]);
            }
            if (type === "hour" || type === 3) {
                date.setTime(date.getTime() + (num || 0) * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + this._dealLessTen(timeArr[1]) + this._dealLessTen(timeArr[2]) + this._dealLessTen(timeArr[3]);
            }
            if (type === "min" || type === 4) {
                date.setTime(date.getTime() + (num || 0) * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + this._dealLessTen(timeArr[1]) + this._dealLessTen(timeArr[2]) + this._dealLessTen(timeArr[3]) + this._dealLessTen(timeArr[4]);
            }
            return null;
        },
        getFormatDateAfter: function (num, type, time, str1, str2) {
            var timeArr, date = this._dealTime2Obj(time);
            if (type === "month" || type === 1) {
                var month = date.getMonth() + 1;
                if (month > num) return date.getFullYear() + (str1 || "-") + this._dealLessTen(month - num);
                if (month === num) return date.getFullYear() - 1 + (str1 || "-") + "12";
                if (month < num) {
                    if (num - month > 12) return date.getFullYear() - parseInt(num / 12) + "" + this._dealLessTen(month - num % 12);
                    else return date.getFullYear() - 1 + (str1 || "-") + this._dealLessTen(12 - (num - month));
                }
            }
            if (!type || type === "day" || type === 2) {
                date.setTime(date.getTime() + (num || 0) * 24 * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + (str1 || "-") + this._dealLessTen(timeArr[1]) + (str1 || "-") + this._dealLessTen(timeArr[2]);
            }
            if (type === "hour" || type === 3) {
                date.setTime(date.getTime() + (num || 0) * 60 * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + (str1 || "-") + this._dealLessTen(timeArr[1]) + (str1 || "-") + this._dealLessTen(timeArr[2]) + " " + this._dealLessTen(timeArr[3]) + (str2 || ":") + "00";
            }
            if (type === "min" || type === 4) {
                date.setTime(date.getTime() + (num || 0) * 60 * 1000);
                timeArr = this._getDateArr(date);
                return timeArr[0] + (str1 || "-") + this._dealLessTen(timeArr[1]) + (str1 || "-") + this._dealLessTen(timeArr[2]) + " " + this._dealLessTen(timeArr[3]) + (str2 || ":") + this._dealLessTen(timeArr[4]);
            }
            return null;
        },
        formatTime: function (time, str1, str2) {
            time = time.toString().replace(/[^\d.]/g, "");
            if (time.length === 6) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2);
            if (time.length === 8) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2);
            if (time.length === 10) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2) + " " + time.substr(8, 2) + (str2 || ":") + "00";
            if (time.length === 12) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2) + " " + time.substr(8, 2) + (str2 || ":") + time.substr(10, 2);
            return null;
        },
        timeToInt: function (time, type) {
            time = this._dealTime2Str(time).replace(/[^\d.]/g, "");
            if (type === "month" || type === 1) {
                time = time.substr(0, 6);
            }
            if (type === "day" || type === 2) {
                time = time.substr(0, 8);
            }
            if (type === "hour" || type === 3) {
                time = time.substr(0, 10);
            }
            if (type === "min" || type === 4) {
                time = time.substr(0, 12);
            }
            return parseInt(time);
        },
        calculateTime: function (startTime, endTime, type) {
            var sTime = this._dealTime2Obj(startTime);
            var eTime = this._dealTime2Obj(endTime);
            var millisecond = Math.abs(eTime.getTime() - sTime.getTime());
            if (type === "month" || type === 1) {
                var timeArr = this._getDateArr(new Date(millisecond));
                return (timeArr[0] - 1970) * 12 + parseInt(timeArr[1]) - 1;
            }
            if (!type || type === "day" || type === 2) return parseInt(millisecond / 24 / 60 / 60 / 1000);
            if (type === "hour" || type === 3) return parseInt(millisecond / 60 / 60 / 1000);
            if (type === "min" || type === 4) return parseInt(millisecond / 60 / 1000);
            return null;
        },
        _dealTime2Obj: function (time) {
            if (typeof time === "string") {
                if (isNaN(time)) time = time.replace(/[^\d.]/g, "");
                if (time.length % 2 === 1) {
                    console.error("输入的日期不正确！");
                    return new Date();
                }
                var year = parseInt(time.substr(0, 4));
                var month = parseInt(time.substr(4, 2) || 1) - 1;
                var day = parseInt(time.substr(6, 2) || 1);
                var hour = parseInt(time.substr(8, 2) || 0);
                var min = parseInt(time.substr(10, 2) || 0);
                var sec = parseInt(time.substr(10, 2) || 0);
                return new Date(year, month, day, hour, min, sec);
            }
            if (typeof time === "object") {
                if (time instanceof Date) return time;
            }
            return new Date();
        },
        _dealTime2Str: function (time) {
            if (typeof time === "string") return time;
            var timeArr = this._getDateArr(this._dealTime2Obj(time));
            return timeArr[0] + timeArr[1] + timeArr[2] + timeArr[3] + timeArr[4];
        },
        _getDateArr: function (timeObj) {
            return [timeObj.getFullYear().toString(), (timeObj.getMonth() + 1).toString(), timeObj.getDate().toString(),
                timeObj.getHours().toString(), timeObj.getMinutes().toString()];
        },
        _dealLessTen: function (value) {
            return value < 10 ? ('0' + value) : value;
        }
    };


    window.ColorTool = {

        _EN_COLOR: function () {
            var placeholder = "N,O,P,Q,R,S,T,U,V,W,X,Y,Z,M,L,K,J".split(",");
            var replace = "dark,deep,light,medium,white,red,black,aqua,green,blue,yellow,orange,pink,00,ff,80,ee".split(",");
            var strEnColor = '{"aliceW":"f0f8L","antiqueR":"faebd7","U":"MLL","Umarine":"7Lfd4","azure":"f0LL","beige":"f5f5dc","bisque":"Le4c4","T":"MMM","blanchedalmond":"Lebcd","W":"MML","Wviolet":"8a2be2","brown":"a52a2a","burlywood":"deb887","cadetW":"5f9ea0","chartreuse":"7LfM","chocolate":"d2691e","coral":"L7f50","cornflowerW":"6495ed","cornsilk":"Lf8dc","crimson":"dc143c","cyan":"MLL","NW":"MM8b","Ncyan":"M8b8b","Ngoldenrod":"b886b","Ngray":"a9a9a9","NV":"M64M","Nkhaki":"bdb76b","Nmagenta":"8bM8b","NoliveV":"556b2f","NY":"L8cM","Norchid":"9932cc","NS":"8bMM","Nsalmon":"e9967a","NseaV":"8fbc8f","NslateW":"483d8b","Nslategray":"2f4f4f","Nturquoise":"Mced1","Nviolet":"94Md3","OZ":"L1493","OskyW":"MbLf","dimgray":"696969","dodgerW":"1e90L","feldspar":"d19275","firebrick":"b22222","floralR":"Lfaf0","forestV":"228b22","fuchsia":"LML","gainsboro":"dcdcdc","ghostR":"f8f8L","gold":"Ld7M","goldenrod":"daa520","gray":"KKK","V":"M8M0","VX":"adL2f","honeydew":"f0Lf0","hotZ":"L69b4","indianS":"cd5c5c","indigo":"4bM82","ivory":"LLf0","khaki":"f0e68c","lavender":"e6e6fa","lavenderblush":"Lf0f5","lawnV":"7cfcM","lemonchiLon":"Lfacd","PW":"add8e6","Pcoral":"f0KK","Pcyan":"e0LL","PgoldenrodX":"fafad2","Pgrey":"d3d3d3","PV":"90K90","PZ":"Lb6c1","Psalmon":"La07a","PseaV":"20b2aa","PskyW":"87cefa","PslateW":"8470L","Pslategray":"778899","PstKlW":"b0c4de","PX":"LLe0","lime":"MLM","limeV":"32cd32","linen":"faf0e6","magenta":"LML","maroon":"8MM0","QUmarine":"66cdaa","QW":"MMcd","Qorchid":"ba55d3","Qpurple":"9370d8","QseaV":"3cb371","QslateW":"7b68K","QspringV":"Mfa9a","Qturquoise":"48d1cc","QvioletS":"c71585","midnightW":"191970","mintcream":"f5Lfa","mistyrose":"Le4e1","moccasin":"Le4b5","navajoR":"Ldead","navy":"MMK","oldlace":"fdf5e6","olive":"K8M0","olivedrab":"6b8e23","Y":"La5M","YS":"L45M","orchid":"da70d6","palegoldenrod":"Ke8aa","paleV":"98fb98","paleturquoise":"afKK","palevioletS":"d87093","papayawhip":"Lefd5","peachpuL":"Ldab9","peru":"cd853f","Z":"Lc0cb","plum":"dda0dd","powderW":"b0e0e6","purple":"8M0K","S":"LMM","rosybrown":"bc8f8f","royalW":"4169e1","saddlebrown":"8b4513","salmon":"faK72","sandybrown":"f4a460","seaV":"2e8b57","seashell":"Lf5K","sienna":"a0522d","silver":"c0c0c0","skyW":"87cKb","slateW":"6a5acd","slategray":"70K90","snow":"Lfafa","springV":"ML7f","stKlW":"4682b4","tan":"d2b48c","teal":"MKK","thistle":"d8bfd8","tomato":"L6347","turquoise":"40e0d0","violet":"K82K","violetS":"d02090","wheat":"f5deb3","R":"LLL","Rsmoke":"f5f5f5","X":"LLM","XV":"9acd32"}';
            for (var i = 0; i < placeholder.length; i++) strEnColor = strEnColor.replace(new RegExp(placeholder[i], "g"), replace[i]);
            return strEnColor;
        },
        _Hex2RGB: function (color) {
            if (color.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) sColorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                color = sColorNew;
            }
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) sColorChange.push(parseInt("0x" + color.slice(i, i + 2)));
            return "rgb(" + sColorChange[0] + "," + sColorChange[1] + "," + sColorChange[2] + ")";
        },
        _RGB2Hex: function (color) {
            var arrRgb = color.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
            var r = arrRgb[0].toString(16), g = arrRgb[1].toString(16), b = arrRgb[2].toString(16);
            if (color.indexOf("%") >= 0) {
                r = (arrRgb[0] / 100 * 255).toString(16);
                g = (arrRgb[1] / 100 * 255).toString(16);
                b = (arrRgb[2] / 100 * 255).toString(16);
            }
            return "#" + (r < 10 ? "0" + r : r) + (g < 10 ? "0" + g : g) + (b < 10 ? "0" + b : b);
        },
        /**
         * 颜色转换rgb值。不支持 rgba 颜色
         * @param color 颜色值，可以是十六进制颜色，英文名称颜色，rgb颜色
         * @returns {string}
         */
        toRGB: function (color) {
            color = color.toLowerCase();
            if (color.indexOf("rgba") >= 0) {
                return color;
            } else if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color)) {
                return this._Hex2RGB(color);
            } else if (color.indexOf("rgb") >= 0) {
                if (color.indexOf("%") >= 0) {
                    var arrRgb = color.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
                    return "rgb(" + parseInt(arrRgb[0] / 100 * 255) + "," + parseInt(arrRgb[1] / 100 * 255) + "," + parseInt(arrRgb[2] / 100 * 255) + ")";
                }
                return color;
            } else {
                var hexColor = JSON.parse(this._EN_COLOR())[color];
                if (!hexColor) {
                    console.error("抱歉！无该英文颜色");
                    return color;
                }
                return this._Hex2RGB("#" + hexColor);
            }
        }
        ,
        /**
         * 颜色转换 16进制值。不支持 rgba 颜色
         * @param color 颜色值，可以是十六进制颜色，英文名称颜色，rgb颜色
         * @returns {string}
         */
        toHEX: function (color) {
            color = color.toLowerCase();
            if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color) || color.indexOf("rgba") >= 0) {
                return color;
            } else if (color.indexOf("rgb") >= 0) {
                return this._RGB2Hex(color);
            } else {
                var hexColor = JSON.parse(this._EN_COLOR())[color];
                if (!hexColor) {
                    console.error("抱歉！无该英文颜色");
                    return color;
                }
                return "#" + hexColor;
            }
        }
        ,
        /**
         * 插件-以值取色。不支持 rgba 颜色
         * @param colors 颜色数组(可以是一个颜色值，将会使用白色与其配色；必须)，可以是rgb,十六进制值，或英文名称值
         * @param maxNum 最大值（可选），默认值：1000；
         * @param minNum 最小值（可选），默认值：0；
         * @param density 密度（可选），默认值：30；含义：把颜色范围分成30层，越高，色差越小
         * @returns {ColorRange} 自身
         *          使用方法说明：
         * 1.此插件基于jQuery编写，使用时需要先导入jQuery；
         *     * 通过传入自定义颜色域（颜色数组），以及给定值和最大值最小值设置（最大最小值默认1000和0，不设置将使用默认值），
         *     * 然后返回给定值所对应的颜色。
         *     * 注意：本方法不支持rgba颜色，原因：没有父节点的背景颜色难以转换成rgb颜色
         * 2.获取对象
         *     var colorRange = ColorTool.createRange(colors,maxNum,minNum,density);
         * 3.设置配置
         *     colorRange.getRGB(value,maxNum,minNum);
         *     value:给定值(该值需要在最大最小值范围之内)
         *     maxNum:最大值（范围, 可选），这里不设置便将使用 创建的对象中的 maxNum ，这么作的原因主要是因为兼容 取值范围不固定的情况，下同
         *     minNum:最小值（范围，可选）
         *     return:对应给定值的颜色(rgb值)
         */
        createRange: function (colors, maxNum, minNum, density) {
            var ColorRange = function (colors, maxNum, minNum, density) {
                if (!colors) throw new Error('颜色值未配置');
                var attrColors = [];
                if (Array.isArray(colors)) {
                    if (colors.length === 0) throw new Error('颜色组为空');
                    attrColors = colors;
                } else {
                    attrColors.push(colors);
                }
                this.maxNum = maxNum || 1000;
                this.minNum = minNum || 0;
                this.num = density || 30;
                this.arrColor = [];
                if (this.minNum > this.maxNum) {
                    var temp = this.maxNum;
                    this.maxNum = this.minNum;
                    this.minNum = temp;
                }

                var dealRGB = function (ftRgb, ltRgb, arrColor, num) {
                    var oRgb = {
                        or: (ltRgb.r - ftRgb.r) / num,
                        og: (ltRgb.g - ftRgb.g) / num,
                        ob: (ltRgb.b - ftRgb.b) / num
                    };
                    for (var j = 0; j < num; j++) {
                        var curR = parseInt(ftRgb.r + oRgb.or * j);
                        var curG = parseInt(ftRgb.g + oRgb.og * j);
                        var curB = parseInt(ftRgb.b + oRgb.ob * j);
                        arrColor.push("rgb(" + curR + "," + curG + "," + curB + ")");
                    }
                };
                if (attrColors.length === 1) {
                    dealRGB({r: 255, g: 255, b: 255}, this.toRGB(attrColors[0]), this.arrColor, this.num);
                } else {
                    for (var i = 0; i < attrColors.length - 1; i++) {
                        dealRGB(this.toRGB(attrColors[i]), this.toRGB(attrColors[i + 1]), this.arrColor, this.num);
                    }
                }
            };
            ColorRange.prototype.getRGB = function (value, maxNum, minNum) {
                var val = value || 0, max = maxNum || this.maxNum, min = minNum || this.minNum;
                if (val > max) val = max;
                if (val < min) val = min;
                val = val - min;
                max = max - min;
                var idx = Math.round(val / (max / this.arrColor.length));
                return this.arrColor[idx === this.arrColor.length ? idx - 1 : idx];

            };
            return new ColorRange(colors, maxNum, minNum, density);
        }
    }
    ;

    /**
     * 对 json 自定义排序
     * @param key 需要排序的索引值
     * @param order 正序或逆序("arc","desc")，默认：正序
     * 使用例子：[{key:'一'},{key:'二'},{key:'三'}]，正序转换后：[{key:'二'},{key:'三'},{key:'一'}]
     * 注：该方法主要是对 Array.sort() 方法的进一步扩展
     * @returns {Array.<*>}
     */
    Array.prototype.sortJson = function (key, order) {
        if (this.length === 0) return [];
        var n = "desc" === (order || "").toLowerCase() ? 1 : -1;
        var code = /^[\u4e00-\u9fa5]/.test(this[0][key]) ? "zh" : "en";
        return this.sort(function (a, b) {
            if (isNaN(b[key])) {
                return b[key].localeCompare(a[key], code) * n;
            } else {
                return (b[key] - a[key]) * n;
            }
        });
    };

    /**
     * 对数组自定义排序,打乱排序
     * @returns {Array.<*>}
     */
    Array.prototype.shuffleArray = function () {
        return this.sort(function () {
            return Math.random() - 0.5;
        })
    };

    /**
     * 对json自定义的字段进行相加
     * @param key 需要相加的字段的键名称，如:[{val:12},{val:23},...]，数组每个项是一个json对象；
     *      如果不传参将视为相加自身，如：[12,23,...]，数组每项是数字
     * @returns {number} 返回总和
     */
    Array.prototype.sumArray = function (key) {
        if (this.length === 0) return 0;
        var sum = 0;
        if (key) {
            if (isNaN(this[0][key])) return 0;
            for (var i = 0; i < this.length; i++) sum += this[i][key];
        } else {
            if (isNaN(this[0])) return 0;
            for (var i = 0; i < this.length; i++) sum += this[i];
        }
        return sum;
    };

    /**
     * 格式数字,千位
     * @param val 数
     * @returns {string}
     */
    window.toThd = function (val) {
        var num = val ? val : this;
        if (isNaN(num)) return "NaN";
        num = num.toString();
        return num.replace(num.indexOf(".") > 0 ? /(\d)(?=(\d{3})+(?:\.))/g : /(\d)(?=(\d{3})+(?:$))/g, '$1,');
    };//添加方法在全局变量中
    String.prototype.toThd = toThd;//扩展String类型的方法，主要是因为平常开发者的类型不固定，数字类型会转在字符串类型上
    Number.prototype.toThd = toThd;//所以为了兼容两者，两种类型都添加上

})(jQuery, window, document);



