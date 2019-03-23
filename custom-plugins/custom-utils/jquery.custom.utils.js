/*
    自定义工具
    I am liangzhenyu
    2018-01-25
    注：以下所有工具单独抽离依然可用！
*/

;(function ($, window, document, undefined) {
    /**
     * 动态数字，注动态数值和节点上的已有数值相同时无效（因为数值没有发生变化）
     * @param num 数字,可以是小数或百分数
     * @param isThd 是否千分位化（可选），默认 true
     * @param delay 动画延时时长（可选），默认 500
     * @param grain 粒度，在规定时间内数字变化次数（可选），默认 100
     */
    $.fn.animateNum = function (num, isThd, delay, grain) {
        var that = this,
            //获取前缀
            getPref = function (str) {
                var pref = "";
                for (var i = 0; i < str.length; i++) if (!isNaN(str.charAt(i))) return pref; else pref += str.charAt(i);
            },
            //获取后缀
            getSuf = function (str) {
                var suf = "";
                for (var i = str.length - 1; i >= 0; i--) if (!isNaN(str.charAt(i))) return suf; else suf = str.charAt(i) + suf;
            },
            //千分位格式化
            toThd = function (num, isThd) {
                if (!isThd) return num;
                num = (num || 0).toString();
                return num.replace(num.indexOf(".") > 0 ? /(\d)(?=(\d{3})+(?:\.))/g : /(\d)(?=(\d{3})+(?:$))/g, '$1,');
            };
        //配置参数
        this.isThd = !!(isThd === null || isThd === undefined || isThd);
        this.delay = delay || 500;
        this.grain = grain || 100;
        if (!that || that.text() === num.toString()) return;//判断节点是否正常，判断数据是否更新
        var pref = getPref(num.toString());//取出前缀
        var suf = getSuf(num.toString());//取出后缀
        var strNum = num.toString().replace(pref, "").replace(suf, "");//获取数值
        if (isNaN(strNum) || strNum === 0) {
            that.html(num);//把非数字和 0 直接返回
            console.error("非法数值！");
            return;
        }
        var int_dec = strNum.split(".");//分出整数和小数两部分
        var deciLen = int_dec[1] ? int_dec[1].length : 0;//取出小数的长度

        var startNum = 0.0, endNum = parseFloat(strNum);//动态值开始值，动态值结束值
        if (Math.abs(endNum) > 10) startNum = parseFloat(int_dec[0].substring(0, int_dec[0].length - 1) + (int_dec[1] ? ".0" + int_dec[1] : ""));

        var oft = (endNum - startNum) / that.grain, temp = 0;//oft 每次变化的值 ,temp用于作记录，避免程序出错不会结束循环
        var mTime = setInterval(function () {
            that.html(pref + toThd(startNum.toFixed(deciLen), that.isThd) + suf);
            startNum += oft;//递增
            temp++;
            if (Math.abs(startNum) >= Math.abs(endNum) || temp > 5000) {
                //但递增的值达到给定值（或循环次数过多5000时）便停止循环
                that.html(pref + toThd(endNum, that.isThd) + suf);
                clearInterval(mTime);
            }
        }, that.delay / that.grain);
    };

    /**
     * 复制所有常见样式
     * @param jqueryObj 复制的对象
     * @returns {jQuery} 返回自身对象
     */
    $.fn.copyStyle = function (jqueryObj) {
        var styles = "Bg,BgAttachment,BgBlendMode,BgClip,BgColor,BgImage,BgOrigin,BgPosition,BgPositionX,BgPositionY,BgRepeat,BgRepeatX,BgRepeatY,BgSize,Bd,BdB1,BdB1Color,BdB1LeftRadius,BdB1R1Radius,BdB1Style,BdB1Width,BdCollapse,BdColor,BdImage,BdImageOutset,BdImageRepeat,BdImageSlice,BdImageSource,BdImageWidth,BdLeft,BdLeftColor,BdLeftStyle,BdLeftWidth,BdRadius,BdR1,BdR1Color,BdR1Style,BdR1Width,BdSpacing,BdStyle,BdTop,BdTopColor,BdTopLeftRadius,BdTopR1Radius,BdTopStyle,BdTopWidth,BdWidth,B1,boxShadow,boxSizing,caretColor,clear,clip,clipPath,cursor,direction,display,filter,float,font,fontDisplay,fontFamily,fontFeatureSettings,fontKerning,fontSize,fontStretch,fontStyle,Fv,FvCaps,FvEastAsian,FvLigatures,FvNumeric,fontVariationSettings,fontWeight,height,left,letterSpacing,lineHeight,margin,marginB1,marginLeft,marginR1,marginTop,maxWidth,maxZoom,minHeight,minWidth,minZoom,opacity,outline,outlineColor,outlineOffset,outlineStyle,outlineWidth,overflow,overflowAnchor,overflowWrap,overflowX,overflowY,overscrollBehavior,overscrollBehaviorX,overscrollBehaviorY,padding,paddingB1,paddingLeft,paddingR1,paddingTop,position,R1,textAlign,textAlignLast,textAnchor,textCombineUpR1,textDecoration,textDecorationColor,textDecorationLine,textDecorationSkipInk,textDecorationStyle,textIndent,textOrientation,textOverflow,textRendering,textShadow,textSizeAdjust,textTm,textUnderlinePosition,top,Tm,TmBox,TmOrigin,TmStyle,Tn,TnDelay,TnDuration,TnProperty,TnTimingFunction,verticalAlign,visibility,whiteSpace,width,wordBreak,wordSpacing,wordWrap,x,y,zIndex,zoom".replace(/Bg/g, "background").replace(/Bd/g, "border").replace(/Tn/g, "transition").replace(/Tm/g, "transform").replace(/Fv/g, "fontVariant").replace(/R1/g, "Right").replace(/B1/g, "Bottom").split(",");
        for (var i = 0; i < styles.length; i++) this.css(styles[i], jqueryObj.css(styles[i]));
        return this;
    };

    /**
     * 给ifame 内嵌框添加click事件
     * @param callback 回调函数
     */
    $.fn.iframeOnClick = function (callback) {
        var IframeOnClick = {
            resolution: 50,
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
                            if (this.iframes[i].hasTracked === false) {
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
        IframeOnClick.track($(this).get(0), callback);
    };

    $.extend({
        /**
         * jquery方式实现form提交
         * @param cfg 配置:{url:"链接",method:"方式(get或post)",target:"打开类型(_self或_blank)",params:{"参1":"值1"}}
         */
        formTo: function (cfg) {
            var form = $("<form style='display:none;' accept-charset='UTF-8'></form>").attr({
                "action": cfg.url || "",
                "method": cfg.method || "post",
                "target": cfg.target || "_self"
            });
            var params = cfg.params || {};
            var values = Object.keys(params);
            for (var i = 0; i < values.length; i++) {
                if (!params[values[i]]) continue;
                form.append($("<input type='hidden' />").attr({"name": values[i]}).val(params[values[i]]));
            }
            form.appendTo("body").submit().remove();
        }
    });

    /**
     * 对 json 自定义排序
     * 使用例子：[{key:'一'},{key:'二'},{key:'三'}]，正序转换后：[{key:'二'},{key:'三'},{key:'一'}]
     * 注：该方法主要是对 Array.sort() 方法的进一步扩展
     * @param key 需要排序的索引值
     * @param order 正序或逆序("arc","desc")，默认：正序
     * @returns {Array.<*>} 排序后的数组
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
        var i, sum = 0;
        if (key) {
            if (isNaN(this[0][key])) return 0;
            for (i = 0; i < this.length; i++) sum += this[i][key];
        } else {
            if (isNaN(this[0])) return 0;
            for (i = 0; i < this.length; i++) sum += this[i];
        }
        return sum;
    };

    // 时间操作工具
    window.TimeTool = new function () {
        /**
         * 内部方法，处理时间，保证返回 date 对象
         * @param time 时间（兼容字符串，整型和日期Date类型）
         * @returns {Date}
         * @private
         */
        var __dealTime2Obj = function (time) {
            if (typeof time === "number") time = time.toString();
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
            if (time instanceof Date) return time;
            return new Date();
        };
        /**
         * 内部方法，获取时间数组，[年，月，日，时，分]
         * @param date date 对象
         * @returns {[null,null,null,null,null]}
         * @private
         */
        var __getDateArr = function (date) {
            return [date.getFullYear().toString(), (date.getMonth() + 1).toString(), date.getDate().toString(),
                date.getHours().toString(), date.getMinutes().toString()];
        };
        /**
         * 内部方法，处理时间成字符串
         * @param time 时间（兼容字符串，整型和日期Date类型）
         * @returns {*}
         * @private
         */
        var __dealTime2Str = function (time) {
            if (typeof time === "string") return time;
            var timeArr = __getDateArr(__dealTime2Obj(time));
            return timeArr[0] + timeArr[1] + timeArr[2] + timeArr[3] + timeArr[4];
        };
        /**
         * 内部方法，处理小于10的值
         * @param value
         * @returns {string}
         * @private
         */
        var __dealLessTen = function (value) {
            return value < 10 ? ('0' + value) : value;
        };
        /**
         * 获取前(或后) num 天(或月或小时或分钟)的整型类型(格式：20190219)的时间
         * @param num 粒度，正数即日期向后，负数即日期向前
         * @param type 时间类型，有 month(或 1),day(或 2),hour(或 3),min(或 4)；默认：day(或 2)。
         * @param time 时间（兼容字符串，整型和日期Date类型）
         * @returns {*}
         */
        this.getIntTime = function (num, type, time) {
            num = num || 0;
            var strTime, timeArr, date = __dealTime2Obj(time);
            if (type) type = type.toLowerCase();
            if (type === "month" || type === 1) {
                var month = date.getMonth() + 1, newMon;
                if (num < 0) {
                    num = Math.abs(num);
                    newMon = num - month;
                    if (newMon < 0) {
                        strTime = date.getFullYear() + "" + __dealLessTen(month - num);
                    }
                    if (newMon === 0) {
                        strTime = date.getFullYear() - 1 + "12";
                    }
                    if (newMon > 0) {
                        if (newMon % 12 === 0) {
                            strTime = date.getFullYear() - parseInt(newMon / 12) - 1 + "12";
                        } else {
                            strTime = date.getFullYear() - parseInt(newMon / 12) - 1 + "" + __dealLessTen(12 - newMon % 12);
                        }
                    }
                } else {
                    newMon = date.getMonth() + 1 + num;
                    if (newMon <= 12) {
                        strTime = date.getFullYear() + "" + __dealLessTen(newMon);
                    } else {
                        if (newMon % 12 === 0) {
                            strTime = date.getFullYear() + parseInt(newMon / 12) - 1 + "12";
                        } else {
                            strTime = date.getFullYear() + parseInt(newMon / 12) + "" + __dealLessTen(newMon % 12);
                        }
                    }
                }
            }
            if (!type || type === "day" || type === 2) {
                date.setTime(date.getTime() + num * 24 * 60 * 60 * 1000);
                timeArr = __getDateArr(date);
                strTime = timeArr[0] + __dealLessTen(timeArr[1]) + __dealLessTen(timeArr[2]);
            }
            if (type === "hour" || type === 3) {
                date.setTime(date.getTime() + num * 60 * 60 * 1000);
                timeArr = __getDateArr(date);
                strTime = timeArr[0] + __dealLessTen(timeArr[1]) + __dealLessTen(timeArr[2]) + __dealLessTen(timeArr[3]);
            }
            if (type === "min" || type === 4) {
                date.setTime(date.getTime() + num * 60 * 1000);
                timeArr = __getDateArr(date);
                strTime = timeArr[0] + __dealLessTen(timeArr[1]) + __dealLessTen(timeArr[2]) + __dealLessTen(timeArr[3]) + __dealLessTen(timeArr[4]);
            }
            return parseInt(strTime);

        };
        /**
         * 获取前(或后) num 天(或月或小时或分钟)的格式的类型(格式：2019-02-19, 拼接的字符串可以自定义)的时间
         * @param num 粒度，正数即日期向后，负数即日期向前
         * @param type 时间类型，有 month(或 1),day(或 2),hour(或 3),min(或 4)；默认：day(或 2)。
         * @param time 时间（兼容字符串，整型和日期Date类型）
         * @param str1 年月日间的拼接字符，默认：“-”
         * @param str2 小数分钟间的拼接字符，默认：“:”
         * @returns {*}
         */
        this.getFormatTime = function (num, type, time, str1, str2) {
            return this.formatTime(this.getIntTime(num, type, time), str1, str2);
        };
        this.getIntMonth = function (num, time) {
            return this.getIntTime(num, "month", time);
        };
        this.getIntDay = function (num, time) {
            return this.getIntTime(num, "day", time);
        };
        this.getIntHour = function (num, time) {
            return this.getIntTime(num, "hour", time);
        };
        this.getIntMin = function (num, time) {
            return this.getIntTime(num, "min", time);
        };
        this.getFormatMonth = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(num, "month", time), str1, str2);
        };
        this.getFormatDay = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(num, "day", time), str1, str2);
        };
        this.getFormatHour = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(num, "hour", time), str1, str2);
        };
        this.getFormatMin = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(num, "min", time), str1, str2);
        };
        this.getIntTimeBefore = function (num, type, time) {
            return this.getIntTime(-(num || 0), type, time);
        };
        this.getFormatTimeBefore = function (num, type, time, str1, str2) {
            return this.formatTime(this.getIntTime(-(num || 0), type, time), str1, str2);
        };
        this.getIntMonthBefore = function (num, time) {
            return this.getIntTime(-(num || 0), "month", time);
        };
        this.getIntDayBefore = function (num, time) {
            return this.getIntTime(-(num || 0), "day", time);
        };
        this.getIntHourBefore = function (num, time) {
            return this.getIntTime(-(num || 0), "hour", time);
        };
        this.getIntMinBefore = function (num, time) {
            return this.getIntTime(-(num || 0), "min", time);
        };
        this.getFormatMonthBefore = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(-(num || 0), "month", time), str1, str2);
        };
        this.getFormatDayBefore = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(-(num || 0), "day", time), str1, str2);
        };
        this.getFormatHourBefore = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(-(num || 0), "hour", time), str1, str2);
        };
        this.getFormatMinBefore = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime(-(num || 0), "min", time), str1, str2);
        };
        this.getIntTimeAfter = function (num, type, time) {
            return this.getIntTime((num || 0), type, time);
        };
        this.getFormatTimeAfter = function (num, type, time, str1, str2) {
            return this.formatTime(this.getIntTime((num || 0), type, time), str1, str2);
        };
        this.getIntMonthAfter = function (num, time) {
            return this.getIntTime((num || 0), "month", time);
        };
        this.getIntDayAfter = function (num, time) {
            return this.getIntTime((num || 0), "day", time);
        };
        this.getIntHourAfter = function (num, time) {
            return this.getIntTime((num || 0), "hour", time);
        };
        this.getIntMinAfter = function (num, time) {
            return this.getIntTime((num || 0), "min", time);
        };
        this.getFormatMonthAfter = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime((num || 0), "month", time), str1, str2);
        };
        this.getFormatDayAfter = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime((num || 0), "day", time), str1, str2);
        };
        this.getFormatHourAfter = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime((num || 0), "hour", time), str1, str2);
        };
        this.getFormatMinAfter = function (num, time, str1, str2) {
            return this.formatTime(this.getIntTime((num || 0), "min", time), str1, str2);
        };
        /**
         * 格式化时间
         * @param time 时间（兼容字符串，整型和日期Date类型）
         * @param str1 年月日间的拼接字符，默认：“-”
         * @param str2 小数分钟间的拼接字符，默认：“:”
         * @returns {*}
         */
        this.formatTime = function (time, str1, str2) {
            if (!time) {
                console.error("请输入时间！");
                return null;
            }
            time = time.toString().replace(/[^\d.]/g, "");
            if (time.length === 6) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2);
            if (time.length === 8) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2);
            if (time.length === 10) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2) + " " + time.substr(8, 2) + (str2 || ":") + "00";
            if (time.length === 12) return time.substr(0, 4) + (str1 || "-") + time.substr(4, 2) + (str1 || "-") + time.substr(6, 2) + " " + time.substr(8, 2) + (str2 || ":") + time.substr(10, 2);
            return time;
        };
        /**
         * 时间转整型（简单的把非数字移除）
         * @param time 时间（兼容字符串，整型和日期Date类型）
         * @param type 时间类型，有 month(或 1),day(或 2),hour(或 3),min(或 4)；默认：day(或 2)。
         * @returns {*}
         */
        this.timeToInt = function (time, type) {
            if (!time) {
                console.error("请输入时间！");
                return null;
            }
            time = time.toString().replace(/[^\d.]/g, "");
            var end = 12;
            if (type) type = (type || "all").toLowerCase();
            if (type === "month" || type === 1) end = 6;
            if (type === "day" || type === 2) end = 8;
            if (type === "hour" || type === 3) end = 10;
            if (type === "min" || type === 4) end = 12;
            return parseInt(time.substr(0, end));
        };
        /**
         * 计算两个时间之间的时间长度
         * @param startTime 开始时间
         * @param endTime 结束时间，注：开始时间大于结束时间则返回负数
         * @param type 时间类型，有 month(或 1),day(或 2),hour(或 3),min(或 4)；默认：day(或 2)。
         * @returns {*}
         */
        this.calculateTime = function (startTime, endTime, type) {
            var sTime = __dealTime2Obj(startTime);
            var eTime = __dealTime2Obj(endTime);
            var millisecond = eTime.getTime() - sTime.getTime();
            if (type) type = type.toLowerCase();
            if (type === "month" || type === 1) {
                var timeArr = __getDateArr(new Date(Math.abs(millisecond)));
                var oftMonth = (timeArr[0] - 1970) * 12 + parseInt(timeArr[1]) - 1;
                return millisecond >= 0 ? oftMonth : -oftMonth;
            }
            if (!type || type === "day" || type === 2) return parseInt(millisecond / 24 / 60 / 60 / 1000);
            if (type === "hour" || type === 3) return parseInt(millisecond / 60 / 60 / 1000);
            if (type === "min" || type === 4) return parseInt(millisecond / 60 / 1000);
            return null;
        };
        /**
         * 计算两个时间之间的时间长度(绝对值)
         * @param time1 时间1
         * @param time2 时间2，注：时间1和时间2不要求前小后大，只要是两个时间就行，时间1可以比时间2大
         * @param type 时间类型，有 month(或 1),day(或 2),hour(或 3),min(或 4)；默认：day(或 2)。
         * @returns {*}
         */
        this.calculateTimeRange = function (time1, time2, type) {
            return Math.abs(this.calculateTime(time1, time2, type));
        }
    };

    // 颜色操作工具
    window.ColorTool = new function () {
        var __EN_COLOR = function () {
                var placeholder = "N,O,P,Q,R,S,T,U,V,W,X,Y,Z,M,L,K,J".split(",");
                var replace = "dark,deep,light,medium,white,red,black,aqua,green,blue,yellow,orange,pink,00,ff,80,ee".split(",");
                var strEnColor = '{"aliceW":"f0f8L","antiqueR":"faebd7","U":"MLL","Umarine":"7Lfd4","azure":"f0LL","beige":"f5f5dc","bisque":"Le4c4","T":"MMM","blanchedalmond":"Lebcd","W":"MML","Wviolet":"8a2be2","brown":"a52a2a","burlywood":"deb887","cadetW":"5f9ea0","chartreuse":"7LfM","chocolate":"d2691e","coral":"L7f50","cornflowerW":"6495ed","cornsilk":"Lf8dc","crimson":"dc143c","cyan":"MLL","NW":"MM8b","Ncyan":"M8b8b","Ngoldenrod":"b886b","Ngray":"a9a9a9","NV":"M64M","Nkhaki":"bdb76b","Nmagenta":"8bM8b","NoliveV":"556b2f","NY":"L8cM","Norchid":"9932cc","NS":"8bMM","Nsalmon":"e9967a","NseaV":"8fbc8f","NslateW":"483d8b","Nslategray":"2f4f4f","Nturquoise":"Mced1","Nviolet":"94Md3","OZ":"L1493","OskyW":"MbLf","dimgray":"696969","dodgerW":"1e90L","feldspar":"d19275","firebrick":"b22222","floralR":"Lfaf0","forestV":"228b22","fuchsia":"LML","gainsboro":"dcdcdc","ghostR":"f8f8L","gold":"Ld7M","goldenrod":"daa520","gray":"KKK","V":"M8M0","VX":"adL2f","honeydew":"f0Lf0","hotZ":"L69b4","indianS":"cd5c5c","indigo":"4bM82","ivory":"LLf0","khaki":"f0e68c","lavender":"e6e6fa","lavenderblush":"Lf0f5","lawnV":"7cfcM","lemonchiLon":"Lfacd","PW":"add8e6","Pcoral":"f0KK","Pcyan":"e0LL","PgoldenrodX":"fafad2","Pgrey":"d3d3d3","PV":"90K90","PZ":"Lb6c1","Psalmon":"La07a","PseaV":"20b2aa","PskyW":"87cefa","PslateW":"8470L","Pslategray":"778899","PstKlW":"b0c4de","PX":"LLe0","lime":"MLM","limeV":"32cd32","linen":"faf0e6","magenta":"LML","maroon":"8MM0","QUmarine":"66cdaa","QW":"MMcd","Qorchid":"ba55d3","Qpurple":"9370d8","QseaV":"3cb371","QslateW":"7b68K","QspringV":"Mfa9a","Qturquoise":"48d1cc","QvioletS":"c71585","midnightW":"191970","mintcream":"f5Lfa","mistyrose":"Le4e1","moccasin":"Le4b5","navajoR":"Ldead","navy":"MMK","oldlace":"fdf5e6","olive":"K8M0","olivedrab":"6b8e23","Y":"La5M","YS":"L45M","orchid":"da70d6","palegoldenrod":"Ke8aa","paleV":"98fb98","paleturquoise":"afKK","palevioletS":"d87093","papayawhip":"Lefd5","peachpuL":"Ldab9","peru":"cd853f","Z":"Lc0cb","plum":"dda0dd","powderW":"b0e0e6","purple":"8M0K","S":"LMM","rosybrown":"bc8f8f","royalW":"4169e1","saddlebrown":"8b4513","salmon":"faK72","sandybrown":"f4a460","seaV":"2e8b57","seashell":"Lf5K","sienna":"a0522d","silver":"c0c0c0","skyW":"87cKb","slateW":"6a5acd","slategray":"70K90","snow":"Lfafa","springV":"ML7f","stKlW":"4682b4","tan":"d2b48c","teal":"MKK","thistle":"d8bfd8","tomato":"L6347","turquoise":"40e0d0","violet":"K82K","violetS":"d02090","wheat":"f5deb3","R":"LLL","Rsmoke":"f5f5f5","X":"LLM","XV":"9acd32"}';
                for (var i = 0; i < placeholder.length; i++) strEnColor = strEnColor.replace(new RegExp(placeholder[i], "g"), replace[i]);
                return strEnColor;
            },
            __Hex2RGB = function (color) {
                if (color.length === 4) {
                    var sColorNew = "#";
                    for (var i = 1; i < 4; i += 1) sColorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                    color = sColorNew;
                }
                var sColorChange = [];
                for (var i = 1; i < 7; i += 2) sColorChange.push(parseInt("0x" + color.slice(i, i + 2)));
                return "rgb(" + sColorChange[0] + "," + sColorChange[1] + "," + sColorChange[2] + ")";
            },
            __RGB2Hex = function (color) {
                var arrRgb = color.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
                var r = arrRgb[0].toString(16), g = arrRgb[1].toString(16), b = arrRgb[2].toString(16);
                if (color.indexOf("%") >= 0) {
                    r = (arrRgb[0] / 100 * 255).toString(16);
                    g = (arrRgb[1] / 100 * 255).toString(16);
                    b = (arrRgb[2] / 100 * 255).toString(16);
                }
                return "#" + (r < 10 ? "0" + r : r) + (g < 10 ? "0" + g : g) + (b < 10 ? "0" + b : b);
            };
        /**
         * 颜色转换rgb值。不支持 rgba 颜色
         * @param color 颜色值，可以是十六进制颜色，英文名称颜色，rgb颜色
         * @returns {string}
         */
        this.toRGB = function (color) {
            color = color.toLowerCase();
            if (color.indexOf("rgba") >= 0) {
                return color;
            } else if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color)) {
                return __Hex2RGB(color);
            } else if (color.indexOf("rgb") >= 0) {
                if (color.indexOf("%") >= 0) {
                    var arrRgb = color.replace("rgb(", "").replace(")", "").replace(/%/g, "").split(",");
                    return "rgb(" + parseInt(arrRgb[0] / 100 * 255) + "," + parseInt(arrRgb[1] / 100 * 255) + "," + parseInt(arrRgb[2] / 100 * 255) + ")";
                }
                return color;
            } else {
                var hexColor = JSON.parse(__EN_COLOR())[color];
                if (!hexColor) {
                    console.error("抱歉！无该英文颜色");
                    return color;
                }
                return __Hex2RGB("#" + hexColor);
            }
        };
        /**
         * 颜色转换 16进制值。不支持 rgba 颜色
         * @param color 颜色值，可以是十六进制颜色，英文名称颜色，rgb颜色
         * @returns {string}
         */
        this.toHEX = function (color) {
            color = color.toLowerCase();
            if (color && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color) || color.indexOf("rgba") >= 0) {
                return color;
            } else if (color.indexOf("rgb") >= 0) {
                return __RGB2Hex(color);
            } else {
                var hexColor = JSON.parse(__EN_COLOR())[color];
                if (!hexColor) {
                    console.error("抱歉！无该英文颜色");
                    return color;
                }
                return "#" + hexColor;
            }
        };
        /**
         * 插件-以值取色。不支持 rgba 颜色
         * @param colors 颜色数组(可以是一个颜色值，将会使用白色与其配色；必须)，可以是rgb,十六进制值，或英文名称值
         * @param maxNum 最大值（可选），默认值：1000；
         * @param minNum 最小值（可选），默认值：0；
         * @param density 密度（可选），默认值：30；含义：把颜色范围分成30层，越高，色差越小
         * @returns
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
         *     maxNum:最大值（范围, 可选），这里不设置便将使用 创建的对象中的 maxNum ，这么做的原因主要是因为兼容 取值范围不固定的情况，下同
         *     minNum:最小值（范围，可选）
         *     return:对应给定值的颜色(rgb值)
         */
        this.createRange = function (colors, maxNum, minNum, density) {
            var that = this;
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
                this.num = density || 50;
                this.arrColor = [];
                if (this.minNum > this.maxNum) {
                    var temp = this.maxNum;
                    this.maxNum = this.minNum;
                    this.minNum = temp;
                }

                var dealRGB = function (ftRgb, ltRgb, arrColor, num) {
                    var rgb2Json = function (strTgb) {
                        var arrRgb = strTgb.replace("rgb(", "").replace(")", "").split(",");
                        return {r: parseInt(arrRgb[0]), g: parseInt(arrRgb[1]), b: parseInt(arrRgb[2])};
                    };
                    ftRgb = rgb2Json(ftRgb);
                    ltRgb = rgb2Json(ltRgb);
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
                    dealRGB({r: 255, g: 255, b: 255}, that.toRGB(attrColors[0]), this.arrColor, this.num);
                } else {
                    for (var i = 0; i < attrColors.length - 1; i++) {
                        dealRGB(that.toRGB(attrColors[i]), that.toRGB(attrColors[i + 1]), this.arrColor, this.num);
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
        };
    };

    /**
     * 格式数字,千位
     * @param val 数
     * @returns {string}
     */
    window.toThd = function (val) {
        var num = (val || this || "error").toString();
        if (isNaN(num)) return "NaN";
        return num.replace(num.indexOf(".") > 0 ? /(\d)(?=(\d{3})+(?:\.))/g : /(\d)(?=(\d{3})+(?:$))/g, '$1,');
    };//添加方法在全局变量中
    String.prototype.toThd = toThd;//扩展String类型的方法，主要是因为平常开发者的类型不固定，数字类型会转在字符串类型上
    Number.prototype.toThd = toThd;//所以为了兼容两者，两种类型都添加上

})(jQuery, window, document);



