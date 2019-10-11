import { IVector } from "./types";

/**
 * 计算向量的模（两指触摸 两指距离）
 * @param v 向量
 */
export function calcLen(v: IVector) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * 获取两个向量之间的角度（含方向）
 * @param a 向量一
 * @param b 向量二
 */
export function calcAngle(a: IVector, b: IVector) {
  const l = calcLen(a) * calcLen(b);
  if (l) {
    // 取得两个向量夹角的余弦值
    const cosValue = (a.x * b.x + a.y * b.y) / l;
    // 取得夹角度数
    let angle = Math.acos(Math.min(cosValue, 1));
    // 取得夹角方向（顺时针 逆时针）
    angle = a.x * b.y - b.x * a.y > 0 ? -angle : angle;
    return (angle * 180) / Math.PI;
  }
  return 0;
}

/**
 * 判断触发元素是否存在与事件元素之上（进行委托）
 * @param target 触发元素
 * @param selector 绑定事件的元素选择器
 */
export function isTargetOverHandler(
  target: HTMLElement | null,
  selector?: string
) {
  if (!selector) return true;
  while (target && target.tagName.toLowerCase() !== "body") {
    if (target.matches(selector)) {
      return true;
    }
    // @ts-ignore
    target = target.parentNode;
  }
  return false;
}
