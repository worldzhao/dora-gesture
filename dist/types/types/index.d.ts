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
export declare type EventType = "touch" | "multitouch" | "longtap" | "move" | "multimove" | "pinch" | "rotate" | "slide" | "end" | "swipe" | "swipeUp" | "swipeDown" | "swipeLeft" | "swipeRight" | "tap" | "dbtap" | "cancel" | "finish";
/**
 * 手势划动方向
 */
export declare type Direction = "up" | "down" | "left" | "right";
/**
 * 回调事件参数
 */
export interface IParams {
    diffX: number;
    diffY: number;
    deltaX: number;
    deltaY: number;
    zoom: number;
    angle: number;
    direction?: Direction;
}
/**
 * 订阅函数定义
 */
export declare type Listener = (e: Event, params: IParams) => any;
/**
 * 存放订阅器的对象
 */
export declare type Handles = {
    [key in EventType]?: Listener[];
};
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
export declare type IDefaultConfig = Required<Omit<IUserConfig, "target">>;
export declare type IConfig = Required<IUserConfig>;
