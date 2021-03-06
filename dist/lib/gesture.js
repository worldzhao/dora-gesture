"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var defaultConfig = {
    selector: "",
    longTapTime: 750,
    bufferDistance: 30 // 划动缓冲距离
};
var Gesture = /** @class */ (function () {
    function Gesture(config) {
        // 触发长按的定时器
        this.longtapTimeout = null;
        // 触发点按的定时器
        this.tapTimeout = null;
        // 是否执行双击
        this.shouldDoubleTap = false;
        // 上一次双指触摸的向量
        this.preVector = { x: 0, y: 0 };
        // 双指触摸 双指距离
        this.fingerDistance = 0;
        // 上一次触摸的信息
        this.preTouchInfo = { x: 0, y: 0, time: 0 };
        // 本次触摸信息
        this.currentTouchInfo = { x: 0, y: 0, time: 0 };
        // 移动过程中变化的位置参数
        this.preMoveInfo = { x: 0, y: 0 };
        // 存放订阅函数的对象
        this.handles = {};
        // 订阅函数参数
        this.params = {
            direction: undefined,
            diffX: 0,
            diffY: 0,
            deltaX: 0,
            deltaY: 0,
            zoom: 1,
            angle: 0
        };
        // 当前触摸元素
        this.e = null;
        this.config = __assign(__assign({}, defaultConfig), config);
        var _a = this.config, target = _a.target, selector = _a.selector;
        if (!target ||
            (!(target instanceof HTMLElement) && typeof target !== "string")) {
            throw new Error("Target must be HTMLElement or string!");
        }
        this.target =
            target instanceof HTMLElement ? target : document.querySelector(target);
        if (this.target === null)
            throw new Error("Target must be existed!");
        this.selector = selector;
        // 绑定事件
        this.touch = this.touch.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
        this.cancel = this.cancel.bind(this);
        this.target.addEventListener("touchstart", this.touch, false);
        this.target.addEventListener("touchmove", this.move, false);
        this.target.addEventListener("touchend", this.end, false);
        this.target.addEventListener("touchcancel", this.cancel, false);
    }
    Gesture.prototype.reset = function () {
        this.currentTouchInfo = { x: 0, y: 0, time: 0 };
        this.preMoveInfo = { x: 0, y: 0 };
        this.params = {
            direction: undefined,
            diffX: 0,
            diffY: 0,
            deltaX: 0,
            deltaY: 0,
            zoom: 1,
            angle: 0
        };
    };
    Gesture.prototype.touch = function (e) {
        var _this = this;
        this.emit("touch", e);
        this.e = e.target;
        var point = e.touches[0];
        var now = Date.now();
        this.currentTouchInfo = { x: point.pageX, y: point.pageY, time: now };
        this.longtapTimeout && clearTimeout(this.longtapTimeout);
        this.tapTimeout && clearTimeout(this.tapTimeout);
        this.shouldDoubleTap = false;
        // 多个手指触摸
        if (e.touches.length > 1) {
            // 获取第二个手指信息
            var point2 = e.touches[1];
            // 存储向量信息
            this.preVector = {
                x: point2.pageX - this.currentTouchInfo.x,
                y: point2.pageY - this.currentTouchInfo.y
            };
            // 两指距离
            this.fingerDistance = utils_1.calcLen(this.preVector);
            this.emit("multitouch", e);
        }
        else {
            // 单个手指触摸
            // 手指触摸后立即开启长按定时器
            this.longtapTimeout = setTimeout(function () {
                _this.emit("longtap", e);
                // 长按处罚后dbtap的标识置为false 避免非首次长按后又触发双击事件
                _this.shouldDoubleTap = false;
                e.preventDefault();
            }, this.config.longTapTime);
            // 判断是否处于双击状态
            this.shouldDoubleTap = Boolean(this.preTouchInfo.time &&
                Math.abs(this.currentTouchInfo.time - this.preTouchInfo.time) < 300 &&
                Math.abs(this.currentTouchInfo.x - this.preTouchInfo.x) < 30 &&
                Math.abs(this.currentTouchInfo.y - this.preTouchInfo.y) < 30);
            // 更新上一次触摸信息为当前触摸信息，供下一次触摸使用
            this.preTouchInfo = __assign({}, this.currentTouchInfo);
        }
    };
    Gesture.prototype.move = function (e) {
        // 执行原生的touchmove事件回调
        this.emit("move", e);
        var point = e.touches[0];
        // 多个手指触摸的情况
        if (e.touches.length > 1) {
            var point2 = e.touches[1];
            // 滑动过程中的当前向量
            var currentVector = {
                x: point2.pageX - point.pageX,
                y: point2.pageY - point.pageY
            };
            this.emit("multimove", e);
            if (this.preVector.x) {
                if (this.fingerDistance) {
                    this.params.zoom = utils_1.calcLen(currentVector) / this.fingerDistance; // 利用前后向量模比计算放大或缩小的倍数
                    this.emit("pinch", e); // 执行pinch手势
                }
                this.params.angle = utils_1.calcAngle(currentVector, this.preVector); // 计算角度
                this.emit("rotate", e); // 执行旋转手势
            }
            // 更新上一个向量为当前向量
            this.preVector = __assign({}, currentVector);
        }
        else {
            // 与手指刚触摸时的相对坐标
            var diffX = point.pageX - this.currentTouchInfo.x;
            var diffY = point.pageY - this.currentTouchInfo.y;
            this.params.diffX = diffX;
            this.params.diffY = diffY;
            if (this.preMoveInfo.x) {
                // 记录移动过程中与上一次移动的相对坐标
                this.params.deltaX = point.pageX - this.preMoveInfo.x;
                this.params.deltaY = point.pageY - this.preMoveInfo.y;
            }
            // 当手指划过的距离超过了30
            if (Math.abs(diffX) > this.config.bufferDistance ||
                Math.abs(diffY) > this.config.bufferDistance) {
                // 所有单指非滑动事件取消
                this.longtapTimeout && clearTimeout(this.longtapTimeout);
                this.tapTimeout && clearTimeout(this.tapTimeout);
                this.shouldDoubleTap = false;
            }
            this.emit("slide", e); // 执行自定义的move回调
            // 更新移动中的手指参数
            this.preMoveInfo = { x: point.pageX, y: point.pageY };
        }
    };
    Gesture.prototype.end = function (e) {
        var _this = this;
        // 执行原生的touchend事件
        this.emit("end", e);
        // 手指离开了 取消长按事件
        this.longtapTimeout && clearTimeout(this.longtapTimeout);
        var now = Date.now();
        // 最后一次触摸点距离起始点的距离
        var diffX = ~~(this.preMoveInfo.x - this.currentTouchInfo.x);
        var diffY = ~~(this.preMoveInfo.y - this.currentTouchInfo.y);
        // 存在位移（移动距离大于30）
        if ((this.preMoveInfo.x && Math.abs(diffX) > this.config.bufferDistance) ||
            (this.preMoveInfo.y && Math.abs(diffY) > this.config.bufferDistance)) {
            // Y轴移动距离较大
            if (Math.abs(diffX) < Math.abs(diffY)) {
                if (diffY < 0) {
                    // 上划
                    this.params.direction = "up";
                    this.emit("swipeUp", e);
                }
                else {
                    // 下划
                    this.params.direction = "down";
                    this.emit("swipeDown", e);
                }
            }
            else {
                // X轴移动距离较大
                if (diffX < 0) {
                    // 左划
                    this.params.direction = "left";
                    this.emit("swipeLeft", e);
                }
                else {
                    // 右划
                    this.params.direction = "right";
                    this.emit("swipeRight", e);
                }
            }
            this.emit("swipe", e); // 划
        }
        else {
            // 单次点击 300ms内离开 触发点击事件
            if (!this.shouldDoubleTap && now - this.currentTouchInfo.time < 300) {
                this.tapTimeout = setTimeout(function () {
                    _this.emit("tap", e);
                    // 事件处理完的回调
                    _this.emit("finish", e);
                }, 300);
            }
            else if (this.shouldDoubleTap) {
                // 300ms内再次点击且离开，触发双击事件 取消上次单击事件
                this.emit("dbtap", e);
                this.tapTimeout && clearTimeout(this.tapTimeout);
                this.emit("finish", e);
            }
            else {
                this.emit("finish", e);
            }
        }
        this.reset();
        this.preVector = { x: 0, y: 0 }; //重置上一个向量的坐标
    };
    Gesture.prototype.cancel = function (e) {
        this.emit("cancel", e);
    };
    /**
     * 触发事件
     */
    Gesture.prototype.emit = function (type, e) {
        if (typeof this.handles[type] === "undefined") {
            this.handles[type] = [];
        }
        // 只有触发事件的元素在委托元素上才执行
        if (utils_1.isTargetOverHandler(this.e, this.selector)) {
            for (var i = 0, len = this.handles[type].length; i < len; i++) {
                var listener = this.handles[type][i];
                listener(e, this.params);
            }
        }
    };
    /**
     * 订阅事件
     */
    Gesture.prototype.on = function (type, listener) {
        if (typeof listener !== "function")
            throw new Error("Listener must be Function type!");
        if (typeof this.handles[type] === "undefined") {
            this.handles[type] = [];
        }
        this.handles[type].push(listener);
        return this;
    };
    /**
     * 取消订阅
     */
    Gesture.prototype.off = function (type) {
        this.handles[type] = [];
    };
    Gesture.prototype.destroy = function () {
        this.longtapTimeout && clearTimeout(this.longtapTimeout);
        this.tapTimeout && clearTimeout(this.tapTimeout);
        if (this.target) {
            this.target.removeEventListener("touchstart", this.touch);
            this.target.removeEventListener("touchmove", this.move);
            this.target.removeEventListener("touchend", this.end);
            this.target.removeEventListener("touchcancel", this.cancel);
        }
    };
    return Gesture;
}());
exports.default = Gesture;
//# sourceMappingURL=gesture.js.map