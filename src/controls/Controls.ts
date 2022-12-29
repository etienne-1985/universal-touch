// predefined controls 
export enum TouchControlType {
    JOY_LEFT,
    JOY_RIGHT,
    BTN_JUMP,
    BTN_FIRE,
    BTN_FULLSCREEN,
}


export class TouchControls {
    static instances: any = {}
    type
    value

    constructor(type) {
        console.log(`[TouchControls] instanciate ${type}`)
        this.type = type
        TouchControls.instances[type] = this
    }
}