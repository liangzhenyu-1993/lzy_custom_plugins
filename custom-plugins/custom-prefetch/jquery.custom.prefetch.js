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
        var $content, $input = $(input), flag = true;

        if (!$input.parent().hasClass("lzy_prefetch_parent")) {
            var $parent = $("<span style='width: auto;height: auto;position: relative;' ></span>")
                .css({
                    float: $input.css("float"),
                    display: $input.css("display")
                })
                .addClass("lzy_prefetch_parent")
                .insertAfter($input)
                .append($input);
            $content = $("<div class=\"lzy_prefetch_content\"></div>")
                .append("<div class=\"lzy_prefetch_list\" data-attrs=\"\"><ul class=\"lzy_prefetch_ul\"></ul></div>")
                .css({
                    top: $input.outerHeight() + parseInt($input.css('marginTop')),
                    left: parseInt($input.css('marginLeft')),
                    minWidth: $input.outerWidth()
                })
                .appendTo($parent);
        } else {
            $content = $input.next();
            flag = false;
        }

        var data = options.data;
        if (data.length) {
            $content.find("ul").empty();
            if (typeof data[0] == "string") {
                $.each(data, function (index, item) {
                    $content.find("ul").append("<li>" + item + "</li>");
                });
            } else {
                var arrAttr = Object.keys(data[0]);
                var attrs = arrAttr.join(",").replace("value", "").replace(/,,/g, ",");
                $content.find("div").data("attrs", attrs);

                $.each(data, function (index, item) {
                    var $li = $("<li></li>");
                    for (var i = 0; i < arrAttr.length; i++) {
                        if (arrAttr[i] == "value") {
                            $li.html(item[arrAttr[i]]);
                        } else {
                            $li.attr(arrAttr[i], item[arrAttr[i]]);
                        }
                    }
                    $content.find("ul").append($li);
                });
            }
        }

        var inContent, timeout, KEY = {
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

        var setList = function ($content, $input) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                var val = $input.val();
                if (!val || !val.length) {
                    $content.hide();
                    return false;
                }
                $content.show();
                var $lis = $content.find("li").removeClass("show selected");
                var cnt = 0;
                for (var i = 0; i < $lis.length; i++) {
                    if ($lis.eq(i).text().indexOf(val) >= 0) {
                        $lis.eq(i).addClass("show");
                        cnt++;
                    }
                }
                if (!cnt) $content.hide();
            }, 300);
        };

        var setInput = function ($li, $content, $input) {
            if (!$li[0]) return;
            var text = $li.text();
            $input.val(text);

            var attrs = $content.find("div").data("attrs").split(",");
            if (attrs && attrs.length) {
                for (var i = 0; i < attrs.length; i++) {
                    $input.attr(attrs[i], $li.attr(attrs[i]));
                }
            }
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
            $content.hover(function (e) {
                inContent = true;
            }, function (e) {
                inContent = false;
            }).find("div")
                .css({
                    paddingLeft: $input.css("paddingLeft") - 3
                })
                .addClass("lzy_fontsize_" + parseInt($input.css("font-size")))
                .find("ul")
                .on("mouseup", "li", function () {
                    setInput($(this), $content, $input);
                    $content.hide();
                });


            $input.on("keydown", function (event) {
                switch (event.keyCode) {
                    case KEY.UP:
                        if ($content.is(":visible")) {
                            event.preventDefault();
                            setSelected("up", $content, $input);
                        }
                        break;
                    case KEY.DOWN:
                        if ($content.is(":visible")) {
                            event.preventDefault();
                            setSelected("down", $content, $input);
                        }
                        break;
                    case KEY.PAGEUP:
                        if ($content.is(":visible")) {
                            event.preventDefault();
                            setSelected("pageup", $content, $input)
                        }
                        break;
                    case KEY.PAGEDOWN:
                        if ($content.is(":visible")) {
                            event.preventDefault();
                            setSelected("pagedown", $content, $input);
                        }
                        break;
                    case KEY.ENTER:
                        if ($content.is(":visible")) {
                            event.preventDefault();
                            setInput($content.find(".selected"), $content, $input);
                            $content.hide();
                        }
                        break;
                    case KEY.ESC:
                        $content.hide();
                        break;
                    default:
                        setList($content, $input);
                        break;
                }
            }).on("blur", function () {
                if (!inContent) {
                    $content.hide();
                }
            }).on("focus", function () {
                setList($content, $input);
            });
        }

    };

})(jQuery, window, document);