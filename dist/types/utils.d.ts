import { IVector } from "./types";
/**
 * 计算向量的模（两指触摸 两指距离）
 * @param v 向量
 */
export declare function calcLen(v: IVector): number;
/**
 * 获取两个向量之间的角度（含方向）
 * @param a 向量一
 * @param b 向量二
 */
export declare function calcAngle(a: IVector, b: IVector): number;
/**
 * 判断触发元素是否存在与事件元素之上（进行委托）
 * @param target 触发元素
 * @param selector 绑定事件的元素选择器
 */
export declare function isTargetOverHandler(target: HTMLElement | null, selector?: string): boolean;
