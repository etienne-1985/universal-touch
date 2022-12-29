import { TouchControls } from "./Controls"

export enum ButtonType {
    PUSH,
    TOGGLE
}

export class TouchButton extends TouchControls {
    static state: any = []
    static touchState: any = {}

    get state() {
        return this.value
    }

    set state(val) {

    }
}

