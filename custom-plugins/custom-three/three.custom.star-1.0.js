/*
炫酷星空背景
I am liangzhenyu
2018-05-06
*/

/*
使用方法说明：
    1.此插件基于three编写，使用时需要先导入three.js
    2.创建启用
        var starBg = CustomStarBg.init(cfg);
    3.隐藏
        starBg.close();
    4.显示
        starBg.open();

 参数说明：
    cfg:{
        parentSelector:父选择器 例如：".selector"或"#selector"或"dom",
        starNum:星星数量,
        starSize:星星大小(实际上是半径),
        starColor:星星颜色,不支持rgba颜色
        speeds:星星移动速度，每10毫秒移动n像素,
            可以是数组(多个速度值时将以最小值为主，少部分星星使用大值，无须按大小排序),
        isShine:是否发光，默认为:false,
        bgColor:背景颜色，不设置将为透明
    }
 */
window.CustomStarBg = {
    defSpeed: 5,
    starNum: 0,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    meshs: [],
    speeds: [],
    animeInterval: null,
    animeStaute: true,
    init: function (cfg) {
        var getRgb = function (color) {
            var sC = (color || '196,233,255').toLowerCase();
            if (sC && /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(sC)) {
                if (sC.length === 4) {
                    var sCNew = "#";
                    for (var i = 1; i < 4; i += 1) sCNew += sC.slice(i, i + 1).concat(sC.slice(i, i + 1));
                    sC = sCNew;
                }
                var sCChange = [];
                for (var i = 1; i < 7; i += 2) sCChange.push(parseInt("0x" + sC.slice(i, i + 2)));
                return sCChange[0] + "," + sCChange[1] + "," + sCChange[2];
            }
            if (sC.indexOf("rgb") >= 0) {
                var arrRgb = sC.replace("rgb(", "").replace(")", "").split(",");
                return arrRgb[0] + "," + arrRgb[1] + "," + arrRgb[2];
            }
            return '196,233,255';

        };
        /**
         * 生成发光星星
         * @returns {Element}
         */
        var generateSprite = function (color) {
            var canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(' + color + ',1)');
            gradient.addColorStop(0.2, 'rgba(' + color + ',1)');
            gradient.addColorStop(0.4, 'rgba(' + color + ',.5)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            return canvas;
        };

        var rangeMultiple1 = 1.6, //星星撒点范围是窗口的n倍
            rangeMultiple2 = 20, //中心留空的范围占总范围的1/n
            rangeMultiple3 = 40; //星星移动多个速度时,大速度的星星按总星星数的1/n分成，剩余的使用最小速度
        this.starNum = cfg.starNum || 1200;
        this.container = document.querySelector(cfg.parentSelector || "body");
        var w = this.container.clientWidth,
            h = this.container.clientHeight,
            rw = w * rangeMultiple1,
            rh = h * rangeMultiple1,
            arrSpeed = cfg.speeds || this.defSpeed;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, w / h, 1, 3000);
        this.camera.position.set(0, 0, 1000);

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        if (cfg.bgColor) this.renderer.setClearColor(new THREE.Color(cfg.bgColor));
        this.renderer.setSize(w - 5, h - 5);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.zIndex = -1;
        this.container.appendChild(this.renderer.domElement);

        var material = undefined;
        if (cfg.isShine) {
            material = new THREE.SpriteMaterial({
                map: new THREE.CanvasTexture(generateSprite(getRgb(cfg.starColor))),
                blending: THREE.AdditiveBlending
            });
        } else {
            material = new THREE.MeshBasicMaterial({color: cfg.starColor || "#c4e9ff"});
        }
        var geometry = new THREE.CircleGeometry(cfg.starSize || 1.5, 50);

        var setObjPos = function (obj) {
            var setRandPos = function (obj, w, h, oft) {
                var wmin = -w / oft, wmax = w / oft;
                var hmin = -h / oft, hmax = h / oft;
                while (true) {
                    var wrand = Math.random() * w - w / 2;
                    var hrand = Math.random() * h - h / 2;
                    if (!(wrand > wmin && wrand < wmax && hrand > hmin && hrand < hmax)) {
                        obj.position.x = wrand;
                        obj.position.y = hrand;
                        break;
                    }
                }
            };
            setRandPos(obj, rw, rh, rangeMultiple2);
        };
        var getSpeed = function (idx, num, speed, oft) {
            if (Array.isArray(speed)) {
                var sortSpeeds = speed.sort(function (x, y) {
                    return y - x;
                });
                for (var i = 0; i < sortSpeeds.length; i++) {
                    if (idx >= num / oft * i && idx < num / oft * (i + 1)) {
                        return sortSpeeds[i];
                    }
                }
                return sortSpeeds[sortSpeeds.length - 1];
            } else {
                return isNaN(speed) ? defSpeed : speed;
            }

        };

        for (var i = 0; i < this.starNum; i++) {
            var mesh = undefined;
            if (cfg.isShine) {
                mesh = new THREE.Sprite(material);
                mesh.scale.x = mesh.scale.y = cfg.starSize * 2 || 8;
            } else {
                mesh = new THREE.Mesh(geometry, material);
            }

            setObjPos(mesh);
            mesh.position.z = Math.random() * 3000 - 2000;
            this.scene.add(mesh);
            this.meshs.push(mesh);

            this.speeds.push(getSpeed(i, this.starNum, arrSpeed, rangeMultiple3));
        }

        var _this = this;

        var animateRender = function () {
            if (_this.animeStaute) {
                for (var i = 0; i < _this.meshs.length; i++) {
                    var mesh = _this.meshs[i];
                    mesh.position.z += _this.speeds[i];
                    if (mesh.position.z > 1000) {
                        setObjPos(mesh);
                        mesh.position.z = -Math.random() * 1500;
                    }

                }
                _this.renderer.render(_this.scene, _this.camera);
            }
            requestAnimationFrame(animateRender);
        };
        animateRender();

        return this;
    },
    close: function () {
        this.animeStaute = false;
        this.renderer.domElement.style.display = 'none';
    },
    open: function () {
        this.animeStaute = true;
        this.renderer.domElement.style.display = 'block';
    }

};



