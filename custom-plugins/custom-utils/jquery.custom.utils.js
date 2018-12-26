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
            var timeArr, date = this._dealTimeObj(time);
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
            var timeArr, date = this._dealTimeObj(time);
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
            var timeArr, date = this._dealTimeObj(time);
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
            var timeArr, date = this._dealTimeObj(time);
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
            time = time.replace(/[^\d.]/g, "");
            if (time.length === 6) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2);
            if (time.length === 8) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2);
            if (time.length === 10) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2) + " " + time.substr(8, 2) + (str2 || ":") + "00";
            if (time.length === 12) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2) + " " + time.substr(8, 2) + (str2 || ":") + time.substr(10, 2);
            return null;
        },
        timeToInt: function (time) {
            return parseInt(time.replace(/[^\d.]/g, ""))
        },
        calculateTime: function (startTime, endTime, type) {
            var sTime = this._dealTimeObj(startTime);
            var eTime = this._dealTimeObj(endTime);
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
        _dealTimeObj: function (time) {
            if (typeof time === "string") {
                if (time.length % 2 === 1) {
                    console.error("输入的日期不正确！");
                    return new Date();
                }
                if (isNaN(time)) time = time.replace(/[^\d.]/g, "");
                var year = time.substr(0, 4);
                var month = time.substr(4, 2) - 1 || 1;
                var day = time.substr(6, 2) || 1;
                var hour = time.substr(8, 2) || 0;
                var min = time.substr(10, 2) || 0;
                var sec = time.substr(10, 2) || 0;
                return new Date(year, month, day, hour, min, sec);
            }
            if (typeof time === "object") return time;
            return new Date();
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
        EN_COLOR: {
            aliceblue: {r: 240, g: 248, b: 255},
            antiquewhite: {r: 250, g: 235, b: 215},
            aqua: {r: 0, g: 255, b: 255},
            aquamarine: {r: 127, g: 255, b: 212},
            azure: {r: 240, g: 255, b: 255},
            beige: {r: 245, g: 245, b: 220},
            bisque: {r: 255, g: 228, b: 196},
            black: {r: 0, g: 0, b: 0},
            blanchedalmond: {r: 255, g: 235, b: 205},
            blue: {r: 0, g: 0, b: 255},
            blueviolet: {r: 138, g: 43, b: 226},
            brown: {r: 165, g: 42, b: 42},
            burlywood: {r: 222, g: 184, b: 135},
            cadetblue: {r: 95, g: 158, b: 160},
            chartreuse: {r: 127, g: 255, b: 0},
            chocolate: {r: 210, g: 105, b: 30},
            coral: {r: 255, g: 127, b: 80},
            cornflowerblue: {r: 100, g: 149, b: 237},
            cornsilk: {r: 255, g: 248, b: 220},
            crimson: {r: 220, g: 20, b: 60},
            cyan: {r: 0, g: 255, b: 255},
            darkblue: {r: 0, g: 0, b: 139},
            darkcyan: {r: 0, g: 139, b: 139},
            darkgoldenrod: {r: 184, g: 134, b: 11},
            darkgray: {r: 169, g: 169, b: 169},
            darkgreen: {r: 0, g: 100, b: 0},
            darkkhaki: {r: 189, g: 183, b: 107},
            darkmagenta: {r: 139, g: 0, b: 139},
            darkolivegreen: {r: 85, g: 107, b: 47},
            darkorange: {r: 255, g: 140, b: 0},
            darkorchid: {r: 153, g: 50, b: 204},
            darkred: {r: 139, g: 0, b: 0},
            darksalmon: {r: 233, g: 150, b: 122},
            darkseagreen: {r: 143, g: 188, b: 143},
            darkslateblue: {r: 72, g: 61, b: 139},
            darkslategray: {r: 47, g: 79, b: 79},
            darkturquoise: {r: 0, g: 206, b: 209},
            darkviolet: {r: 148, g: 0, b: 211},
            deeppink: {r: 255, g: 20, b: 147},
            deepskyblue: {r: 0, g: 191, b: 255},
            dimgray: {r: 105, g: 105, b: 105},
            dodgerblue: {r: 30, g: 144, b: 255},
            feldspar: {r: 209, g: 146, b: 117},
            firebrick: {r: 178, g: 34, b: 34},
            floralwhite: {r: 255, g: 250, b: 240},
            forestgreen: {r: 34, g: 139, b: 34},
            fuchsia: {r: 255, g: 0, b: 255},
            gainsboro: {r: 220, g: 220, b: 220},
            ghostwhite: {r: 248, g: 248, b: 255},
            gold: {r: 255, g: 215, b: 0},
            goldenrod: {r: 218, g: 165, b: 32},
            gray: {r: 128, g: 128, b: 128},
            green: {r: 0, g: 128, b: 0},
            greenyellow: {r: 173, g: 255, b: 47},
            honeydew: {r: 240, g: 255, b: 240},
            hotpink: {r: 255, g: 105, b: 180},
            indianred: {r: 205, g: 92, b: 92},
            indigo: {r: 75, g: 0, b: 130},
            ivory: {r: 255, g: 255, b: 240},
            khaki: {r: 240, g: 230, b: 140},
            lavender: {r: 230, g: 230, b: 250},
            lavenderblush: {r: 255, g: 240, b: 245},
            lawngreen: {r: 124, g: 252, b: 0},
            lemonchiffon: {r: 255, g: 250, b: 205},
            lightblue: {r: 173, g: 216, b: 230},
            lightcoral: {r: 240, g: 128, b: 128},
            lightcyan: {r: 224, g: 255, b: 255},
            lightgoldenrodyellow: {r: 250, g: 250, b: 210},
            lightgrey: {r: 211, g: 211, b: 211},
            lightgreen: {r: 144, g: 238, b: 144},
            lightpink: {r: 255, g: 182, b: 193},
            lightsalmon: {r: 255, g: 160, b: 122},
            lightseagreen: {r: 32, g: 178, b: 170},
            lightskyblue: {r: 135, g: 206, b: 250},
            lightslateblue: {r: 132, g: 112, b: 255},
            lightslategray: {r: 119, g: 136, b: 153},
            lightsteelblue: {r: 176, g: 196, b: 222},
            lightyellow: {r: 255, g: 255, b: 224},
            lime: {r: 0, g: 255, b: 0},
            limegreen: {r: 50, g: 205, b: 50},
            linen: {r: 250, g: 240, b: 230},
            magenta: {r: 255, g: 0, b: 255},
            maroon: {r: 128, g: 0, b: 0},
            mediumaquamarine: {r: 102, g: 205, b: 170},
            mediumblue: {r: 0, g: 0, b: 205},
            mediumorchid: {r: 186, g: 85, b: 211},
            mediumpurple: {r: 147, g: 112, b: 216},
            mediumseagreen: {r: 60, g: 179, b: 113},
            mediumslateblue: {r: 123, g: 104, b: 238},
            mediumspringgreen: {r: 0, g: 250, b: 154},
            mediumturquoise: {r: 72, g: 209, b: 204},
            mediumvioletred: {r: 199, g: 21, b: 133},
            midnightblue: {r: 25, g: 25, b: 112},
            mintcream: {r: 245, g: 255, b: 250},
            mistyrose: {r: 255, g: 228, b: 225},
            moccasin: {r: 255, g: 228, b: 181},
            navajowhite: {r: 255, g: 222, b: 173},
            navy: {r: 0, g: 0, b: 128},
            oldlace: {r: 253, g: 245, b: 230},
            olive: {r: 128, g: 128, b: 0},
            olivedrab: {r: 107, g: 142, b: 35},
            orange: {r: 255, g: 165, b: 0},
            orangered: {r: 255, g: 69, b: 0},
            orchid: {r: 218, g: 112, b: 214},
            palegoldenrod: {r: 238, g: 232, b: 170},
            palegreen: {r: 152, g: 251, b: 152},
            paleturquoise: {r: 175, g: 238, b: 238},
            palevioletred: {r: 216, g: 112, b: 147},
            papayawhip: {r: 255, g: 239, b: 213},
            peachpuff: {r: 255, g: 218, b: 185},
            peru: {r: 205, g: 133, b: 63},
            pink: {r: 255, g: 192, b: 203},
            plum: {r: 221, g: 160, b: 221},
            powderblue: {r: 176, g: 224, b: 230},
            purple: {r: 128, g: 0, b: 128},
            red: {r: 255, g: 0, b: 0},
            rosybrown: {r: 188, g: 143, b: 143},
            royalblue: {r: 65, g: 105, b: 225},
            saddlebrown: {r: 139, g: 69, b: 19},
            salmon: {r: 250, g: 128, b: 114},
            sandybrown: {r: 244, g: 164, b: 96},
            seagreen: {r: 46, g: 139, b: 87},
            seashell: {r: 255, g: 245, b: 238},
            sienna: {r: 160, g: 82, b: 45},
            silver: {r: 192, g: 192, b: 192},
            skyblue: {r: 135, g: 206, b: 235},
            slateblue: {r: 106, g: 90, b: 205},
            slategray: {r: 112, g: 128, b: 144},
            snow: {r: 255, g: 250, b: 250},
            springgreen: {r: 0, g: 255, b: 127},
            steelblue: {r: 70, g: 130, b: 180},
            tan: {r: 210, g: 180, b: 140},
            teal: {r: 0, g: 128, b: 128},
            thistle: {r: 216, g: 191, b: 216},
            tomato: {r: 255, g: 99, b: 71},
            turquoise: {r: 64, g: 224, b: 208},
            violet: {r: 238, g: 130, b: 238},
            violetred: {r: 208, g: 32, b: 144},
            wheat: {r: 245, g: 222, b: 179},
            white: {r: 255, g: 255, b: 255},
            whitesmoke: {r: 245, g: 245, b: 245},
            yellow: {r: 255, g: 255, b: 0},
            yellowgreen: {r: 154, g: 205, b: 50}
        },
        /**
         * 颜色转换rgb值。不支持 rgba 颜色
         * @param color 颜色值，可以是十六进制颜色，英文名称颜色，rgb颜色
         * @returns {string}
         */
        toRGB: function (color) {
            var sColor = color.toLowerCase();
            if (sColor.indexOf("rgba") >= 0) {
                return sColor;
            } else if (sColor && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(sColor)) {
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
                }
                return sColor;
            } else {
                var rgbObj = this.EN_COLOR[sColor];
                if (!rgbObj) {
                    console.error("抱歉！无该英文颜色");
                    return null;
                }
                return "rgb(" + rgbObj.r + "," + rgbObj.g + "," + rgbObj.b + ")";
            }
        },
        /**
         * 颜色转换 16进制值。不支持 rgba 颜色
         * @param color 颜色值，可以是十六进制颜色，英文名称颜色，rgb颜色
         * @returns {string}
         */
        toHEX: function (color) {
            var sColor = color.toLowerCase(), r, g, b;
            if (sColor && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(sColor) || sColor.indexOf("rgba") >= 0) {
                return sColor;
            } else if (sColor.indexOf("rgb") >= 0) {
                var arrRgb = sColor.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
                r = parseInt(arrRgb[0]).toString(16);
                g = parseInt(arrRgb[1]).toString(16);
                b = parseInt(arrRgb[2]).toString(16);
                if (sColor.indexOf("%") >= 0) {
                    r = parseInt(arrRgb[0] / 100 * 255).toString(16);
                    g = parseInt(arrRgb[1] / 100 * 255).toString(16);
                    b = parseInt(arrRgb[2] / 100 * 255).toString(16);
                }
            } else {
                var rgbObj = this.EN_COLOR[sColor];
                if (!rgbObj) {
                    console.error("抱歉！无该英文颜色");
                    return null;
                }
                r = rgbObj.r.toString(16), g = rgbObj.g.toString(16), b = rgbObj.b.toString(16);
            }
            return "#" + (isNaN(r) ? r : (r < 10 ? "0" + r : r)) + (isNaN(g) ? g : (g < 10 ? "0" + g : g)) + (isNaN(b) ? b : (b < 10 ? "0" + b : b));
        },
        /*
        插件-以值取色
        使用方法说明：
            1.此插件基于jQuery编写，使用时需要先导入jQuery；
               * 通过传入自定义颜色域（颜色数组），以及给定值和最大值最小值设置（最大最小值默认1000和0，不设置将使用默认值），
               * 然后返回给定值所对应的颜色。
               * 注意：本方法不支持rgba颜色，原因：没有父节点的背景颜色难以转换成rgb颜色
            2.获取对象
                var colorRange = ColorTool.createRange(colors,maxNum,minNum,density);
                colors:颜色数组(可以是一个颜色值，将会使用白色与其配色；必须)，可以是rgb,十六进制值，或英文名称值
                maxNum:最大值（可选），默认值：1000；
                minNum:最小值（可选），默认值：0；
                density：密度（可选），默认值：30；含义：把颜色范围分成30层，越高，色差越小
            3.设置配置
                colorRange.getRGB(value,maxNum,minNum);
                value:给定值(该值建议在最大最小值范围之内)
                maxNum:最大值（范围, 可选），这里不设置便将使用 创建的对象中的 maxNum ，这么作的原因主要是因为兼容 取值范围不固定的情况，下同
                minNum:最小值（范围，可选）
                return:对应给定值的颜色(rgb值)
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
    };

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



