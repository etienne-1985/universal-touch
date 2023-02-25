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
 * TouchEvent Lifecycle 
 * 
 * @touchstart: new id is assigned, previous ids are kept
 * @touchmove: 
 * @touchend: an id is removed, all previous ids are reassigned
 * 
 * touchEvent {     // Native JS object
 *  identifier,     // assigned @touchstart, removed or updated @touchend, same during lifecyle
 *  pageX,
 *  pageY
 * }
 * 
 * touchState {
 *  id:             // native identifer for touch event (valid until touch end event)
 *  origin: {x,y}   // original value when touch was first pressed
 *  current: {x, y} // last value
 * }
 * 
 * joystick {
 *  touchState      // set while touch is active, reassigned @touchstart or @touchend
 *  value: {x,y}    // diff between current and original
 *  needReset,      // inform joystick has been released and need reset
 *  autoRest        // automatically reset value to 0 on release
 * }
 * 
 * 
 *  
 */

export class TouchJoystick extends TouchControls {
    static active: any = []
    /** Temporary mapping between touch ids and joy instances: only reliable during @touchMove **/
    static activeTouchMapping: any = {}
    // storing touch info per instance
    touchState: any = {}
    // computed joystick value
    value = { x: 0, y: 0 }
    needReset = false
    autoReset = false
    isInTouchRange = (x, y) => true

    static get left() {
        return TouchControls.instances[TouchControlType.JOY_LEFT] || new TouchJoystick(TouchControlType.JOY_LEFT, (x, y) => (x < halfWidth))
    }

    static get right() {
        return TouchControls.instances[TouchControlType.JOY_RIGHT] || new TouchJoystick(TouchControlType.JOY_RIGHT, (x, y) => (x > halfWidth))
    }

    /**
     * Joystick can be identified by:
     * - touchRange with getMatching @touchstart 
     * - touchId with activeTouchMapping[touchId] during @touchmove
     * - lastValue @touchend
     */
    static getMatching = (touch) => {
        // exact match with origin or match by touchrange
        const joyMatch = Object.values(TouchControls.instances)
            .filter(inst => inst instanceof TouchJoystick)
            .find((joy: TouchJoystick) => joy.matchByTouchRange(touch.origin))
        return joyMatch
    }

    static findByTouchRange = (firstValue) => {
        const joyMatch = Object.values(TouchControls.instances)
            .filter(inst => inst instanceof TouchJoystick)
            .find((joy: TouchJoystick) => joy.matchByTouchRange(firstValue))
        return joyMatch
    }

    static findByValue = (lastValue) => {
        const joyMatch = Object.values(TouchControls.instances)
            .filter(inst => inst instanceof TouchJoystick)
            .find((joy: TouchJoystick) => joy.matchByValue(lastValue))
        return joyMatch
    }

    /**
     * add new touch mapping to existing
     */
    static onTouchStart(e) {
        Object.values(e.touches).forEach((touchEvt: any) => {
            const touchId = touchEvt.identifier
            // if doesn't exist or is inactive
            // if (!touch || !touch.active) {
            //     // create or reinit touch

            // }
            if (!TouchJoystick.activeTouchMapping[touchId]) {
                // create new touch state, 
                const origin = { x: touchEvt.pageX, y: touchEvt.pageY }
                // const current = { x: touchEvt.pageX, y: touchEvt.pageY }
                // const touchState = { origin, current, active: true }
                //find matching joystick and 
                const joyMatch: TouchJoystick = TouchJoystick.findByTouchRange(origin)
                if (joyMatch) {
                    joyMatch.onTouchStart(origin)
                    // add mapping
                    TouchJoystick.activeTouchMapping[touchId] = joyMatch
                    console.log(`assign touch id ${touchId} to touchState`)
                }
            }
        })
    }

    /**
     * During @touchmove can safely use activeTouchMapping
     */
    static onTouchMove(e) {
        // update touches instant values
        Object.values(e.touches).forEach((touchEvt: any) => {
            const current = { x: touchEvt.pageX, y: touchEvt.pageY }
            TouchJoystick.activeTouchMapping[touchEvt.identifier].onTouchMove(current)
        })
    }

    /**
     * activeTouchMapping no longer valid, need to
     * - remove inactive touch
     * - reassign currently active touch ids
     */
    static onTouchEnd(e) {
        Object.entries(TouchJoystick.activeTouchMapping)
            .forEach(([touchId, joy]) => { // find inactive joy 
                // not having corresponding event
                const matchEvt = Object.values(e.touches).find((touchEvt: any) => {
                    const lastValue = { x: touchEvt.pageX, y: touchEvt.pageY }
                    // ids are not reliable anymore, perform match based on current value
                    return (joy as TouchJoystick).matchByValue(lastValue)
                })
                // inactive joy
                if (!matchEvt) {
                    (joy as TouchJoystick).onTouchEnd()
                    // unregister from active joysticks
                    delete TouchJoystick.activeTouchMapping[touchId]
                }
            })
    }

    static addToActive(active) {
        // add instance to active 
        TouchJoystick.active.push(active)
    }

    static removeFromActive(inactive) {
        TouchJoystick.active = TouchJoystick.active.filter(inst => inst.type !== inactive.type)
        // and inform all active instances about id change
        TouchJoystick.active
            //     .forEach(inst => inst.refresh())
            // .filter(inst => (inst as TouchJoystick).state.touchId !== undefined)
            .forEach((inst, index) => inst.state.touchId = index)
    }

    static refresh(e) {
        TouchJoystick.active
            .forEach(inst => inst.refresh(e))
    }

    constructor(type, isinTouchRange) {
        super(type)
        this.type = type
        this.isInTouchRange = (x, y) => isinTouchRange(x, y)
        TouchControls.instances[type] = this
    }

    onTouchStart = ({ x, y }) => {
        // Object.values(e.touches).forEach((touchEvt: any) => {
        // const touchId = touchEvt.identifier
        // find a previous touch
        // let touch = TouchJoystick.touchState[touchId]
        // if doesn't exist or is inactive
        // and assign latest value to corresponding joystick
        // const touchId = TouchJoystick.active.length;
        // const touchEvt = e.touches[touchId]
        const origin = { x, y }
        const current = { x, y }
        this.touchState = {
            // touchId,
            origin,
            current
        }
        // TouchJoystick.addToActive(this)
        // })
    }

    onTouchMove = ({ x, y }) => {
        const { current, origin } = this.touchState
        // update touch instant values
        current.x = x
        current.y = y
        // compute diff from touch origin
        const dxy = { x: current.x - origin.x, y: origin.y - current.y }
        const value = normDiff(dxy)
        // assign joy value
        this.value = value
        // console.log(`[JOY-${this.type}] x: ${this.x}, y: ${this.y}`)
    }

    onTouchEnd = () => {
        // TouchJoystick.removeFromActive(this)
        // TouchJoystick.refresh(e)
        this.touchState = {} // reset state
        if (this.autoReset) {
            this.x = 0
            this.y = 0
        } else this.needReset = true
    }

    matchByValue(touchValue) {
        return this.touchState.current?.x === touchValue.x && this.touchState.current?.y === touchValue.y
    }

    matchByTouchRange(touchOrigin) {
        return this.isInTouchRange(touchOrigin.x, touchOrigin.y)
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