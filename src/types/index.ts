/**
 * 向量类型
 */
export interface IVector {
  x: number;
  y: number;
}

/**
 * 触摸信息
 */
export interface ITouch {
  x: number;
  y: number;
  time: number;
}

/**
 * 移动信息
 */
export interface IMove {
  x: number;
  y: number;
}

/**
 * 事件类型
 */
export type EventType =
  | "touch" // 原生的touchstart事件
  | "multitouch" // 多个手指触摸事件
  | "longtap" // 长按事件
  | "move" // 原生的touchmove事件
  | "multimove" // 多个手指滑动事件
  | "pinch" // 缩放手势
  | "rotate" // 旋转手势
  | "slide" // 滑动事件
  | "end" // 原生的touchend事件
  | "swipe" // 划动手势，滑动后手指离开触发
  | "swipeUp" // 划动手势 - 上划
  | "swipeDown" // 划动手势 - 下划
  | "swipeLeft" // 划动手势 - 左划
  | "swipeRight" // 划动手势 - 右划
  | "tap" //  单击事件
  | "dbtap" // 双击事件
  | "cancel" // 原生的touchcancel事件
  | "finish"; // 执行完以上事件后执行的事件

/**
 * 手势划动方向
 */
export type Direction = "up" | "down" | "left" | "right";

/**
 * 回调事件参数
 */
export interface IParams {
  diffX: number; // 单指 距离start的x轴距离
  diffY: number; // 单指 距离start的y轴距离
  deltaX: number; // 单指 距离上一次move的x轴距离
  deltaY: number; // 单指 距离上一次move的y轴距离
  zoom: number; // 双指 pinch操作前后双指距离的比例
  angle: number; // 双指 rotate操作的角度
  direction?: Direction; // swipe方向
}

/**
 * 订阅函数定义
 */
export type Listener = (e: Event, params: IParams) => any;

/**
 * 存放订阅器的对象
 */
export type Handles = { [key in EventType]?: Listener[] };

/**
 * 用户自定义配置
 */
export interface IUserConfig {
  target: HTMLElement | string;
  selector?: string;
  longTapTime?: number;
  bufferDistance?: number;
}

/**
 * 默认配置
 */
export type IDefaultConfig = Required<Omit<IUserConfig, "target">>;

export type IConfig = Required<IUserConfig>;
