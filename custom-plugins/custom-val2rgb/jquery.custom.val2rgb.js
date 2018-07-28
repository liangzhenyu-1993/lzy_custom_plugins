/*
    自定义工具
    I am liangzhenyu
    2018-01-25
*/

/*
插件-以值取色
使用方法说明：
    1.此插件基于jQuery编写，使用时需要先导入jQuery；
       * 通过传入自定义颜色域（颜色数组），以及给定值和最大值最小值设置（最大最小值默认1000和0，不设置将使用默认值），
       * 然后返回给定值所对应的颜色。
       * 注意：本方法不支持rgba颜色，原因：没有父节点的背景颜色难以转换成rgb颜色
    2.获取对象
        var val2RGB = $.Val2RGB(colors,maxNum,minNum);
        colors:颜色数组(可以是一个颜色值，将会使用白色与其配色；必须)，可以是rgb,十六进制值，或英文名称值
        maxNum:最大值（可选）
        minNum:最小值（可选）
    3.设置配置
        val2RGB.getRGB(value,maxNum,minNum);
        value:给定值(该值建议在最大最小值范围之内)
        maxNum:最大值（范围, 可选）
        minNum:最小值（范围，可选）
        return:对应给定值的颜色(rgb值)
 */
;(function ($, window, document, undefined) {
    $.extend({
        Val2RGB: function (colors, maxNum, minNum) {
            var initRgb = function (colors, maxNum, minNum) {
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
                this.num = 30;
                this.arrColor = [];
                if (this.minNum > this.maxNum) {
                    var temp = this.maxNum;
                    this.maxNum = this.minNum;
                    this.minNum = temp;
                }
                var getRGBObj = function (color) {
                    var sColor = color.toLowerCase();
                    if (sColor && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(sColor)) {
                        if (sColor.length === 4) {
                            var sColorNew = "#";
                            for (var i = 1; i < 4; i += 1)
                                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                            sColor = sColorNew;
                        }
                        var sColorChange = [];
                        for (var i = 1; i < 7; i += 2) {
                            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                        }
                        return {r: sColorChange[0], g: sColorChange[1], b: sColorChange[2]};
                    } else if (sColor.indexOf("rgb") >= 0) {
                        var subRgb = sColor.replace("rgb(", "").replace(")", "");
                        var arrRgb = subRgb.split(",");
                        r = parseInt(arrRgb[0]);
                        g = parseInt(arrRgb[1]);
                        b = parseInt(arrRgb[2]);
                        return {r: r, g: g, b: b}
                    } else {
                        return EN_COLOR[sColor];
                    }
                };
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
                    dealRGB({r: 255, g: 255, b: 255}, getRGBObj(attrColors[0]), this.arrColor, this.num);
                } else {
                    for (var i = 0; i < attrColors.length - 1; i++) {
                        dealRGB(getRGBObj(attrColors[i]), getRGBObj(attrColors[i + 1]), this.arrColor, this.num);
                    }
                }
            };
            initRgb.prototype.getRGB = function (value, maxNum, minNum) {
                var val = value || 0, max = maxNum || this.maxNum, min = minNum || this.minNum;
                if (val > max) val = max;
                if (val < min) val = min;
                val = val - min;
                max = max - min;
                var idx = Math.round(val / (max / this.arrColor.length));
                return this.arrColor[idx === this.arrColor.length ? idx - 1 : idx];

            };
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
            }('28 29={2a:{r:4,g:p,b:1},27:{r:3,g:B,b:W},23:{r:0,g:1,b:1},24:{r:i,g:1,b:26},2b:{r:4,g:1,b:1},2g:{r:6,g:6,b:d},2h:{r:1,g:y,b:Y},2i:{r:0,g:0,b:0},2f:{r:1,g:B,b:7},2c:{r:0,g:0,b:1},2d:{r:2e,g:43,b:1Q},1R:{r:s,g:42,b:42},1S:{r:n,g:N,b:D},1P:{r:1M,g:1N,b:l},1O:{r:i,g:1,b:0},1T:{r:u,g:a,b:30},1Y:{r:1,g:i,b:1Z},22:{r:P,g:1X,b:1U},1V:{r:1,g:p,b:d},1W:{r:d,g:20,b:15},2C:{r:0,g:1,b:1},2D:{r:0,g:0,b:5},2E:{r:0,g:5,b:5},2B:{r:N,g:2y,b:11},2z:{r:z,g:z,b:z},2A:{r:0,g:P,b:0},2F:{r:2K,g:2L,b:q},2M:{r:5,g:0,b:5},2J:{r:13,g:q,b:47},2G:{r:1,g:F,b:0},2H:{r:S,g:o,b:14},2I:{r:5,g:0,b:0},2n:{r:2o,g:2p,b:I},2m:{r:m,g:J,b:m},2j:{r:10,g:2k,b:5},2l:{r:47,g:Q,b:Q},2q:{r:0,g:C,b:A},2v:{r:2w,g:0,b:h},2x:{r:1,g:20,b:w},2u:{r:0,g:12,b:1},2r:{r:a,g:a,b:a},2s:{r:30,g:e,b:1},2t:{r:A,g:1L,b:1i},1h:{r:V,g:34,b:34},1g:{r:1,g:3,b:4},1n:{r:34,g:5,b:34},1o:{r:1,g:0,b:1},1m:{r:d,g:d,b:d},16:{r:p,g:p,b:1},1b:{r:1,g:W,b:0},1E:{r:v,g:s,b:32},1F:{r:2,g:2,b:2},1C:{r:0,g:2,b:0},1G:{r:x,g:1,b:47},1H:{r:4,g:1,b:4},1t:{r:1,g:a,b:G},1u:{r:7,g:M,b:M},1r:{r:1y,g:0,b:E},1v:{r:1,g:1,b:4},1w:{r:4,g:9,b:F},1z:{r:9,g:9,b:3},1D:{r:1,g:4,b:6},1p:{r:1c,g:1a,b:0},1d:{r:1,g:3,b:7},1e:{r:x,g:f,b:9},1k:{r:4,g:2,b:2},1l:{r:j,g:1,b:1},1J:{r:3,g:3,b:u},1K:{r:h,g:h,b:h},1I:{r:e,g:8,b:e},1A:{r:1,g:1s,b:1x},1q:{r:1,g:l,b:I},1B:{r:32,g:V,b:t},18:{r:D,g:C,b:3},17:{r:1f,g:c,b:1},1j:{r:4o,g:4t,b:S},3Q:{r:X,g:Y,b:n},3P:{r:1,g:1,b:j},3S:{r:0,g:1,b:0},3K:{r:o,g:7,b:o},3X:{r:3,g:4,b:9},40:{r:1,g:0,b:1},3Y:{r:2,g:0,b:0},3Z:{r:3V,g:7,b:t},3W:{r:0,g:0,b:7},49:{r:4a,g:13,b:h},4b:{r:w,g:c,b:f},41:{r:15,g:K,b:44},48:{r:3U,g:3L,b:8},3M:{r:0,g:3,b:U},3N:{r:10,g:A,b:14},3I:{r:3J,g:21,b:R},3R:{r:25,g:25,b:c},3T:{r:6,g:1,b:3},3O:{r:1,g:y,b:H},4c:{r:1,g:y,b:4s},4u:{r:1,g:n,b:x},4p:{r:0,g:0,b:2},4q:{r:4r,g:6,b:9},4x:{r:2,g:2,b:0},4w:{r:q,g:4v,b:35},4g:{r:1,g:s,b:0},4h:{r:1,g:L,b:0},4f:{r:v,g:c,b:4d},4e:{r:8,g:4i,b:t},4m:{r:T,g:4n,b:T},4l:{r:4j,g:8,b:8},4k:{r:f,g:c,b:w},37:{r:1,g:38,b:39},31:{r:1,g:v,b:33},36:{r:7,g:R,b:3a},3e:{r:1,g:k,b:3f},3g:{r:Z,g:l,b:Z},3b:{r:X,g:j,b:9},3c:{r:2,g:0,b:2},3d:{r:1,g:0,b:0},2Q:{r:J,g:m,b:m},2R:{r:2S,g:a,b:H},2N:{r:5,g:L,b:19},2O:{r:3,g:2,b:2P},2T:{r:2X,g:2Y,b:2Z},2U:{r:46,g:5,b:2V},2W:{r:1,g:6,b:8},3h:{r:l,g:3y,b:45},3z:{r:k,g:k,b:k},3A:{r:D,g:C,b:B},3v:{r:3w,g:3x,b:7},3B:{r:c,g:2,b:e},3F:{r:1,g:3,b:3},3G:{r:0,g:1,b:i},3H:{r:3C,g:E,b:G},3D:{r:u,g:G,b:F},3E:{r:0,g:2,b:2},3l:{r:f,g:12,b:f},3m:{r:1,g:3n,b:3i},3j:{r:3k,g:j,b:O},3o:{r:8,g:E,b:8},3s:{r:O,g:32,b:e},3t:{r:6,g:n,b:K},3u:{r:1,g:1,b:1},3p:{r:6,g:6,b:6},3q:{r:1,g:1,b:0},3r:{r:U,g:7,b:o}};', 62, 282, '|255|128|250|240|139|245|205|238|230|105||112|220|144|216||211|127|224|192|160|143|222|50|248|107||165|170|210|218|147|173|228|169|209|235|206|135|130|140|180|225|122|188|179|69|92|184|208|100|79|133|153|152|154|178|215|176|196|221|72||191|85|204|60|ghostwhite|lightslateblue|lightskyblue||252|gold|124|lemonchiffon|lightblue|132|floralwhite|firebrick|117|lightslategray|lightcoral|lightcyan|gainsboro|forestgreen|fuchsia|lawngreen|lightsalmon|indigo|182|hotpink|indianred|ivory|khaki|193|75|lavender|lightpink|lightseagreen|green|lavenderblush|goldenrod|gray|greenyellow|honeydew|lightgreen|lightgoldenrodyellow|lightgrey|146|95|158|chartreuse|cadetblue|226|brown|burlywood|chocolate|237|cornsilk|crimson|149|coral|80|||cornflowerblue|aqua|aquamarine||212|antiquewhite|var|EN_COLOR|aliceblue|azure|blue|blueviolet|138|blanchedalmond|beige|bisque|black|darkslateblue|61|darkslategray|darkseagreen|darksalmon|233|150|darkturquoise|dimgray|dodgerblue|feldspar|deepskyblue|darkviolet|148|deeppink|134|darkgray|darkgreen|darkgoldenrod|cyan|darkblue|darkcyan|darkkhaki|darkorange|darkorchid|darkred|darkolivegreen|189|183|darkmagenta|saddlebrown|salmon|114|rosybrown|royalblue|65|sandybrown|seagreen|87|seashell|244|164|96||peachpuff||185|||peru|papayawhip|239|213|63|powderblue|purple|red|pink|203|plum|sienna|71|turquoise|64|thistle|tomato|99|violet|whitesmoke|yellow|yellowgreen|violetred|wheat|white|slateblue|106|90|82|silver|skyblue|slategray|70|tan|teal|snow|springgreen|steelblue|mediumvioletred|199|limegreen|104|mediumspringgreen|mediumturquoise|mistyrose|lightyellow|lightsteelblue|midnightblue|lime|mintcream|123|102|mediumblue|linen|maroon|mediumaquamarine|magenta|mediumseagreen|||113||||mediumslateblue|mediumorchid|186|mediumpurple|moccasin|214|palegoldenrod|orchid|orange|orangered|232|175|palevioletred|paleturquoise|palegreen|251|119|navy|oldlace|253|181|136|navajowhite|142|olivedrab|olive'.split('|'), 0, {}))
            return new initRgb(colors, maxNum, minNum);
        }
    });
})(jQuery, window, document);


