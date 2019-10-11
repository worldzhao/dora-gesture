import { EventType, Listener, IUserConfig } from "./types";
declare class Gesture {
    private target;
    private config;
    private selector?;
    private longtapTimeout;
    private tapTimeout;
    private shouldDoubleTap;
    private preVector;
    private fingerDistance;
    private preTouchInfo;
    private currentTouchInfo;
    private preMoveInfo;
    private handles;
    private params;
    private e;
    constructor(config: IUserConfig);
    private reset;
    private touch;
    private move;
    private end;
    private cancel;
    /**
     * 触发事件
     */
    private emit;
    /**
     * 订阅事件
     */
    on(type: EventType, listener: Listener): this;
    /**
     * 取消订阅
     */
    off(type: EventType): void;
    destroy(): void;
}
export default Gesture;
