import { TouchControls, TouchControlType } from "./Controls"

const halfWidth = window.innerWidth / 2

const normDiff = (v) => {
    const dx = Math.round(v.x)
    const dy = Math.round(v.y)
    return ({
        x: Math.sign(dx) * Math.min(Math.abs(dx), 128),
        y: Math.sign(dy) * Math.min(Math.abs(dy), 128)
    })
}

/**
 * Objects:
 * 
 * touchEvent { // Native JS object
 *  identifier,
 *  pageX,
 *  pageY
 * }
 * 
 * touch {
 *  id:             // native identifer for touch event
 *  orig: {x,y}     // original value when touch was first pressed
 *  diff: {x, y}    // diff between current and original
 * }
 * 
 * joystick{
 *  x,          // current values
 *  y,
 *  needReset,  // inform joystick has been released and need reset
 *  autoRest    // automatically reset value to 0 on release
 * }
 *  
 */

export class TouchJoystick extends TouchControls {
    static instances: any = {}
    static touchState: any = {}
    value = { x: 0, y: 0 }
    needReset = false
    autoReset = false

    static get left() {
        return TouchControls.instances[TouchControlType.JOY_LEFT] || new TouchJoystick(TouchControlType.JOY_LEFT)
    }

    static get right() {
        return TouchControls.instances[TouchControlType.JOY_RIGHT] || new TouchJoystick(TouchControlType.JOY_RIGHT)
    }

    static getFromTouch = (touch) => {
        const touchX = touch.orig ? touch.orig.x : touch.pageX
        return touchX < halfWidth ? TouchJoystick.left : TouchJoystick.right
    }

    // synch joysticks with touches
    static sync(touchState = TouchJoystick.touchState) {
        Object.values(touchState).forEach((touch: any) => {
            if (touch.active) {
                const dxy = { x: touch.pos.x - touch.orig.x, y: touch.pos.y - touch.orig.y }
                const touchVal = normDiff(dxy)
                let joystick: TouchJoystick = TouchJoystick.getFromTouch(touch)
                joystick.x = touchVal.x
                joystick.y = -touchVal.y
                console.log(`[JOY-${joystick.type}] x: ${joystick.x}, y: ${joystick.y}`)
                // joystick.x = touchVal.x//touch.active || !joystick.autoReset ? touchVal.x : 0
                // joystick.y = touchVal.y //touch.active || !joystick.autoReset ? touchVal.y : 0
            }
        })
    }

    static onTouchStart(e) {
        Object.values(e.touches).forEach((touchEvt: any) => {
            const touchId = touchEvt.identifier
            // find a previous touch
            let touch = TouchJoystick.touchState[touchId]
            // if doesn't exist or is inactive
            if (!touch || !touch.active) {
                // create or reinit touch
                const orig = { x: touchEvt.pageX, y: touchEvt.pageY }
                const pos = { x: touchEvt.pageX, y: touchEvt.pageY }
                touch = { orig, pos, active: true }
            }
            TouchJoystick.touchState[touchId] = touch
        })
    }

    static onTouchMove(e) {
        // update touches instant values
        Object.values(e.touches).forEach((touchEvt: any) => {
            const touch = TouchJoystick.touchState[touchEvt.identifier]
            touch.pos.x = touchEvt.pageX
            touch.pos.y = touchEvt.pageY
        })
        TouchJoystick.sync()
    }

    static onTouchEnd(e) {
        Object.values(TouchJoystick.touchState).forEach((touch: any) => {
            // find correponding touch event: ids are not reliable anymore, search with current value
            const matchEvt = Object.values(e.touches).find((touchEvt: any) => {
                console.log(touchEvt)
                const matching = touchEvt.pageX === touch.pos.x
                    && touchEvt.pageY === touch.pos.y;
                return matching
            })

            // const touchEvt = e.touches[touchId] // the corresponding touch event
            // const touch = touches[touchId] // touch
            const joystick = TouchJoystick.getFromTouch(touch) // the corresponding joystick

            if (!matchEvt) {
                // disable corresponding touch state
                touch.active = false
                // 
                if (joystick.autoReset) {
                    joystick.x = 0
                    joystick.y = 0
                } else joystick.needReset = true
            } else {
                // reassing correct id
                // touch.id = matchEvt.identifier
            }
            // console.log(matchEvt)
        })
    }

    onTouchStart(e) {
        Object.values(e.touches).forEach((touchEvt: any) => {
            const touchId = touchEvt.identifier
            // find a previous touch
            let touch = TouchJoystick.touchState[touchId]
            // if doesn't exist or is inactive
            if (!touch || !touch.active) {
                // create or reinit touch
                const orig = { x: touchEvt.pageX, y: touchEvt.pageY }
                const pos = { x: touchEvt.pageX, y: touchEvt.pageY }
                touch = { orig, pos, active: true }
            }
            TouchJoystick.touchState[touchId] = touch
        })
    }

    onTouchMove(e) {
        // update touches instant values
        Object.values(e.touches).forEach((touchEvt: any) => {
            const touch = TouchJoystick.touchState[touchEvt.identifier]
            touch.pos.x = touchEvt.pageX
            touch.pos.y = touchEvt.pageY
        })
        TouchJoystick.sync()
    }

    onTouchEnd(e) {
        Object.values(TouchJoystick.touchState).forEach((touch: any) => {
            // find correponding touch event: ids are not reliable anymore, search with current value
            const matchEvt = Object.values(e.touches).find((touchEvt: any) => {
                console.log(touchEvt)
                const matching = touchEvt.pageX === touch.pos.x
                    && touchEvt.pageY === touch.pos.y;
                return matching
            })

            // const touchEvt = e.touches[touchId] // the corresponding touch event
            // const touch = touches[touchId] // touch
            const joystick = TouchJoystick.getFromTouch(touch) // the corresponding joystick

            if (!matchEvt) {
                // disable corresponding touch state
                touch.active = false
                // 
                if (joystick.autoReset) {
                    joystick.x = 0
                    joystick.y = 0
                } else joystick.needReset = true
            } else {
                // reassing correct id
                // touch.id = matchEvt.identifier
            }
            // console.log(matchEvt)
        })
    }

    get x() {
        return this.value.x
    }

    set x(val) {
        this.value.x = val
    }

    get y() {
        return this.value.y
    }

    set y(val) {
        this.value.y = val
    }
}