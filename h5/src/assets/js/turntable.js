import 'jquery-1.10.2.js'
(function ($) {
    $.fn.WheelSurf = function (options) {
        var _default = {
            outerCircle: {color: '#df1e15'},
            innerCircle: {color: '#f4ad26'},
            dots: ['#fbf0a9', '#fbb936'],
            disk: ['#ffb933', '#ffe8b5', '#ffb933', '#ffd57c', '#ffb933', '#ffe8b5', '#ffd57c'],
            title: {color: '#5c1e08', font: '19px Arial'}
        }
        $.extend(_default, options)
        var _this = this[0], width = _this.width, height = _this.height, ctx = _this.getContext("2d"), imgs = [],
            awardTitle = [], awardPic = []
        for (var item in _default.list) {
            awardTitle.push(_default.list[item].name)
            imgs.push(_default.list[item].image)
        }
        var num = imgs.length
        var x = width / 2
        var y = height / 2
        ctx.translate(x, y)
        return {
            init: function (angelTo) {
                angelTo = angelTo || 0;
                ctx.clearRect(-this.width, -this.height, this.width, this.height);
                var angel = (2 * Math.PI / 360) * (360 / num);
                var startAngel = 2 * Math.PI / 360 * (-90)
                var endAngel = 2 * Math.PI / 360 * (-90) + angel
                ctx.save()
                ctx.rotate(angelTo * Math.PI / 180);
                ctx.beginPath();
                ctx.lineWidth = 25;
                ctx.strokeStyle = _default.outerCircle.color;
                ctx.arc(0, 0, 243, 0, 2 * Math.PI)
                ctx.stroke();
                ctx.beginPath();
                ctx.lineWidth = 23;
                ctx.strokeStyle = _default.innerCircle.color;
                ctx.arc(0, 0, 218, 0, 2 * Math.PI)
                ctx.stroke();
                var dotColor = _default.dots
                for (var i = 0; i < 12; i++) {
                    ctx.beginPath();
                    var radius = 230;
                    var xr = radius * Math.cos(startAngel)
                    var yr = radius * Math.sin(startAngel)
                    ctx.fillStyle = dotColor[i % dotColor.length]
                    ctx.arc(xr, yr, 11, 0, 2 * Math.PI)
                    ctx.fill()
                    startAngel += (2 * Math.PI / 360) * (360 / 12);
                }
                var colors = _default.disk
                for (var i = 0; i < num; i++) {
                    ctx.beginPath();
                    ctx.lineWidth = 208;
                    ctx.strokeStyle = colors[i % colors.length]
                    ctx.arc(0, 0, 104, startAngel, endAngel)
                    ctx.stroke();
                    startAngel = endAngel
                    endAngel += angel
                }

                function loadImg() {
                    var dtd = $.Deferred()
                    var countImg = 0
                    if (awardPic.length) {
                        return dtd.resolve(awardPic);
                    }
                    for (var i = 0; i < num; i++) {
                        var img = new Image()
                        awardPic.push(img)
                        img.src = imgs[i]
                        img.onload = function () {
                            countImg++
                            if (countImg == num) {
                                dtd.resolve(awardPic);
                            }
                        }
                    }
                    return dtd.promise()
                }

                $.when(loadImg()).done(function (awardPic) {
                    startAngel = angel / 2
                    for (var i = 0; i < num; i++) {
                        ctx.save();
                        ctx.rotate(startAngel)
                        ctx.drawImage(awardPic[i], -48, -48 - 130);
                        ctx.font = _default.title.font;
                        ctx.fillStyle = _default.title.color
                        ctx.textAlign = "center";
                        ctx.fillText(awardTitle[i], 0, -170);
                        startAngel += angel
                        ctx.restore();
                    }
                })
                ctx.restore();
            }, lottery: function (angel, callback) {
                angel = angel || 0
                angel = 360 - angel
                angel += 720
                var baseStep = 30
                var baseSpeed = 0.3
                var count = 1;
                var _this = this
                var timer = setInterval(function () {
                    _this.init(count)
                    if (count == angel) {
                        clearInterval(timer)
                        if (typeof callback == "function") {
                            callback()
                        }
                    }
                    count = count + baseStep * (((angel - count) / angel) > baseSpeed ? baseSpeed : ((angel - count) / angel))
                    if (angel - count < 0.5) {
                        count = angel
                    }
                }, 25)
            }
        }
    }
}(jQuery))