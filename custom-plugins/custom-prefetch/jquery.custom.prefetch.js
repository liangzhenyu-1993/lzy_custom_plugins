/*
    自定义工具
    I am liangzhenyu
    2018-07-15
*/

;(function ($, window, document, undefined) {
    "use strict";
    $.fn.extend({
        prefetch: function (options) {
            return this.each(function () {
                new $.Prefetch(this, options);
            });
        }
    });

    $.Prefetch = function (input, options) {
        //列表对象，输入框对象，标识是否第一次调用当前方法
        var $content, $input = $(input), flag = true;

        if (!$input.parent().hasClass("lzy_prefetch_parent")) {
            //第一次进入
            //修饰input组件
            var $parent = $("<span style='width: auto;height: auto;position: relative;' ></span>")
                .css({
                    float: $input.css("float"),
                    display: $input.css("display")
                })
                .addClass("lzy_prefetch_parent")
                .insertAfter($input)
                .append($input);
            //生成列表集合添加到下拉列表
            $content = $("<div class=\"lzy_prefetch_content\"></div>")
                .append("<div class=\"lzy_prefetch_list\" data-attrs=\"\"><ul class=\"lzy_prefetch_ul\"></ul></div>")
                .css({
                    top: $input.outerHeight() + parseInt($input.css('marginTop')),
                    left: parseInt($input.css('marginLeft')),
                    minWidth: $input.outerWidth()
                })
                .appendTo($parent);
        } else {
            //第二次以后进入
            $content = $input.next();
            flag = false;
        }

        if (options.data && options.data.length) {
            var data = options.data;
            $content.find("ul").empty();
            var lis = "", i = 0;
            if (typeof data[0] === "string") {
                //数据的值是 string 类型，添加列表节点
                for (i = 0; i < data.length; i++) {
                    lis += "<li>" + data[i] + "</li>";
                }
            } else {
                //数据的值是 json 对象类型
                var arrAttr = Object.keys(data[0]);
                $content.find("div").data("attrs", arrAttr.join(","));//配置当前列表的属性值的名称有

                for (i = 0; i < data.length; i++) {
                    var li = "<li", val = "";
                    for (var j = 0; j < arrAttr.length; j++) {
                        if (arrAttr[j] === "value") {
                            val = ">" + data[i][arrAttr[j]] + "</li>";//添加值
                        } else {
                            li += " " + arrAttr[j] + "='" + data[i][arrAttr[j]] + "' ";//添加属性
                        }
                    }
                    lis += li + val;
                }
            }
            $content.find("ul").append(lis);
        }

        var isMouseInCont, timeout, KEY = {
            UP: 38,
            DOWN: 40,
            DEL: 46,
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            COMMA: 188,
            PAGEUP: 33,
            PAGEDOWN: 34,
            BACKSPACE: 8
        };

        var hide = function () {
            $input.removeClass("lzy_input_focus");
            $content.hide();
        };
        /**
         * 移除输入框属性
         * @param $content 列表对象
         * @param $input 输入框对象
         */
        var removeInputAttr = function ($content, $input) {
            var attrs = $content.find("div").data("attrs").split(",");
            if (attrs && attrs.length) {
                for (var i = 0; i < attrs.length; i++) {
                    if (attrs[i] === "value") continue;
                    $input.removeAttr(attrs[i]);
                }
            }
        };

        /**
         * 设置输入框的属性
         * @param $li 选择的列对象
         * @param $content 列表对象
         * @param $input 输入框对象
         */
        var setInputAttr = function ($li, $content, $input) {
            var attrs = $content.find("div").data("attrs").split(",");
            if (attrs && attrs.length) {
                for (var i = 0; i < attrs.length; i++) {
                    if (attrs[i] === "value") continue;
                    $input.attr(attrs[i], $li.attr(attrs[i]));
                }
            }
            $input.trigger("change");
        };

        /**
         * 设置输入框的值
         * @param $li 选择的列对象
         * @param $content 列表对象
         * @param $input 输入框对象
         */
        var setInput = function ($li, $content, $input) {
            if (!$li[0]) return;
            $input.val($li.text());

            setInputAttr($li, $content, $input);
        };

        /**
         * 渲染列表
         * @param $content 列表对象
         * @param $input 输入框对象
         */
        var setList = function ($content, $input) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                removeInputAttr($content, $input);
                var val = $input.val();
                // if (!val || !val.length) {
                //     $content.hide();
                //     return false;
                // }
                $content.show();//列表显示
                var $lis = $content.find("li").removeClass("show selected");
                var cnt = 0;
                for (var i = 0; i < $lis.length; i++) {
                    var text = $lis.eq(i).text();
                    if (text.indexOf(val) >= 0) {
                        $lis.eq(i).addClass("show");
                        cnt++;
                        if (text === val) {
                            setInputAttr($lis.eq(i), $content, $input);
                        }
                    }
                }
                if (!cnt) hide();
            }, 300);
        };

        var setSelected = function (type, $content, $input) {
            $input.removeClass("lzy_input_focus");
            var $lis = $content.find("li.show");
            var index = -1;
            for (var i = 0; i < $lis.length; i++) {
                if ($lis.eq(i).hasClass("selected")) {
                    index = i;
                    break;
                }
            }
            switch (type) {
                case "up":
                    index--;
                    break;
                case "down":
                    index++;
                    break;
                case "pageup":
                    index -= 10;
                    break;
                case "pagedown":
                    index += 10;
                    break;
            }

            $lis.removeClass("selected");
            if (index === -1 || index > $lis.length - 1) {
                $input.focus().addClass("lzy_input_focus");
            } else {
                if (index < -1) index = $lis.length - 1;
                $lis.eq(index).addClass("selected");

                var thisDd = $lis.eq(index);
                if (!thisDd[0]) return;

                var $ulCont = $content.find("ul");
                var posTop = thisDd.position().top
                    , dlHeight = $ulCont.height()
                    , ddHeight = thisDd.height();

                //若选中元素在滚动条不可见底部
                if (posTop > dlHeight) {
                    $ulCont.scrollTop(posTop + $ulCont.scrollTop() - dlHeight + ddHeight + 5);
                }
                //若选择元素在滚动条不可见顶部
                if (posTop < 0) {
                    $ulCont.scrollTop(posTop + $ulCont.scrollTop() - 5);
                }
            }

        };

        if (flag) {
            $content.hover(function () {
                isMouseInCont = true;
            }, function () {
                isMouseInCont = false;
            }).find("div")
                .css({
                    paddingLeft: $input.css("paddingLeft") - 3
                })
                .addClass("lzy_fontsize_" + parseInt($input.css("font-size")))
                .find("ul")
                .on("mouseup", "li", function (e) {
                    e.stopPropagation();
                    setInput($(this), $content, $input);
                    $content.hide();
                });


            $input.on("keyup", function (e) {
                e.stopPropagation();
                switch (e.keyCode) {
                    case KEY.UP:
                        if ($content.is(":visible")) {
                            e.preventDefault();
                            setSelected("up", $content, $input);
                        }
                        break;
                    case KEY.DOWN:
                        if ($content.is(":visible")) {
                            e.preventDefault();
                            setSelected("down", $content, $input);
                        }
                        break;
                    case KEY.PAGEUP:
                        if ($content.is(":visible")) {
                            e.preventDefault();
                            setSelected("pageup", $content, $input)
                        }
                        break;
                    case KEY.PAGEDOWN:
                        if ($content.is(":visible")) {
                            e.preventDefault();
                            setSelected("pagedown", $content, $input);
                        }
                        break;
                    case KEY.ENTER:
                        if ($content.is(":visible")) {
                            e.preventDefault();
                            setInput($content.find(".selected"), $content, $input);
                            $content.hide();
                        }
                        break;
                    case KEY.ESC:
                        hide();
                        break;
                    default:
                        setList($content, $input);
                        break;
                }
            }).on("blur", function () {
                if (!isMouseInCont) {
                    $content.hide();
                }
            }).on("focus click", function (e) {
                e.stopPropagation();
                setList($content, $input);
            });
        }


        $(document).off('click', hide).on('click', hide); //点击其它元素关闭 select
    };

})(jQuery, window, document);