/**
 * Common base class
 */

export class TouchControls {
    static instances: any = {}
    uid
    onValueChange
    state
    anchor

    /**
     * onValueChange: optional callback notifying value change
     */
    constructor(uid, onValueChange?) {
        console.log(`[TouchControls] create instance #${uid}`)
        this.uid = uid
        this.onValueChange = onValueChange
        TouchControls.instances[uid] = this
    }

    onTouch = (touchState, touchEvtType) => {
        // console.log(eventType)
        // this.value = value
    }

    get value() {
        return this.state
    }

    set value(val) {
        this.state = val
        this.onValueChange?.(this.state)
    }
}

export enum BTN_TYPE {
    NONE,
    TOGGLE
}

export class ButtonControl extends TouchControls {
    type = BTN_TYPE.NONE

    static instanciate(controlUid, btnConfig?) {
        if (!TouchControls.instances[controlUid]) {
            console.log(`[TouchButtonControl - instanciate] create new button control`)
            return new ButtonControl(controlUid, btnConfig)
        } else {
            console.warn(`[TouchButtonControl - instanciate] instance ${controlUid} already exist `)
        }
    }

    onTouch = (value, touchEvtType) => {
        switch (touchEvtType) {
            case 'touchstart':
                if (this.type !== BTN_TYPE.TOGGLE) {
                    this.value = value
                }
                break;
            case 'touchmove':
                break;
            case 'touchend':
                this.value = this.type !== BTN_TYPE.TOGGLE ? value : !this.value
                break;
        }
    }

    constructor(controlUid, config) {
        super(controlUid, config?.actionBinding)
        this.type = config?.type ? config?.type : BTN_TYPE.NONE
    }
}


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
 * @touchstart: a new id is assigned, existing ids are kept
 * @touchmove: 
 * @touchend: an id is removed, all existing ids are reassigned
 * 
 * joystick {
 *  touchState      // set while touch is active, reassigned @touchstart or @touchend
 *  value: {x,y}    // diff between current and original
 *  needReset,      // inform joystick has been released and need reset
 *  autoRest        // automatically reset value to 0 on release
 * }
 *  
 */

// Native JS object
 interface TouchEvent {     
   identifier,     // assigned @touchstart, removed or updated @touchend, same during lifecyle
   pageX,
   pageY
  }

// internal touch state
 interface TouchState {
  id,            // native identifer for touch event (valid until touch end event)
  origin: {x,y},   // original value when touch was first pressed
  current: {x, y} // last value
 }

export class JoystickControl extends TouchControls {
    static active: any = []
    // Temporary mapping between touch ids and instances: only reliable during @touchMove 
    static activeTouchMapping: any = {}
    // storing touch info per instance
    touchState: TouchState = {}
    // computed joystick value = current - origin touch pos
    needReset = false
    autoReset = false
    isInTouchRange = (x, y) => true

    static instanciate(joyType, joyConfig) {
        if (!TouchControls.instances[joyType]) {
            console.log(`[TouchButtonControl - instanciate] create new joystick control`)
            return new JoystickControl(joyType, joyConfig)
        } else {
            console.warn(`[TouchButtonControl - instanciate] instance ${joyType} already exist `)
        }
    }

    /**
     * Depending on touch event phase, joysticks can be identified by:
     * - touchRange with findByTouchRange @touchstart 
     * - touchId with activeTouchMapping[touchId] during @touchmove
     * - lastValue with findByValue @touchend
     */
    static getMatching = (touch) => {
        return JoystickControl.activeTouchMapping[touch.id] || 
        JoystickControl.findByValue(touch) ||
        JoystickControl.findByTouchRange(touch)
    }

    static findByTouchRange = (firstValue) => {
        const joyMatch = Object.values(TouchControls.instances)
            .filter(inst => inst instanceof JoystickControl)
            .find((joy: JoystickControl) => joy.matchByTouchRange(firstValue))
        return joyMatch
    }

    static findByValue = (lastValue) => {
        const joyMatch = Object.values(TouchControls.instances)
            .filter(inst => inst instanceof JoystickControl)
            .find((joy: JoystickControl) => joy.matchByValue(lastValue))
        return joyMatch
    }

    /**
     * add new touch mapping to existing
     */
    static onTouchStart(e) {
        Object.values(e.touches).forEach((touchEvt: TouchEvent) => {
            const touchId = touchEvt.identifier
            if (!JoystickControl.activeTouchMapping[touchId]) {
                // create new touch state, 
                const firstValue = { x: touchEvt.pageX, y: touchEvt.pageY }
                //find matching joystick and assign to active controls 
                const joyMatch: JoystickControl = JoystickControl.findByTouchRange(firstValue)
                if (joyMatch) {
                    joyMatch.enable(firstValue)
                    // add mapping
                    JoystickControl.activeTouchMapping[touchId] = joyMatch
                } else {
                    console.log(`no joystick matched touch id ${touchId}`)
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
            const touchId = touchEvt.identifier
            const currentValue = { x: touchEvt.pageX, y: touchEvt.pageY }
            JoystickControl.activeTouchMapping[touchId].update(currentValue)
        })
    }

    /**
     * activeTouchMapping no longer valid, need to
     * - remove inactive touch
     * - reassign currently active touch ids
     */
    static onTouchEnd(e) {
        Object.entries(JoystickControl.activeTouchMapping)
            .forEach(([touchId, joy]) => { // find inactive joy 
                // not having corresponding event
                const matchEvt = Object.values(e.touches).find((touchEvt: any) => {
                    const lastValue = { x: touchEvt.pageX, y: touchEvt.pageY }
                    // ids are not reliable anymore, perform match based on current value
                    return (joy as JoystickControl).matchByValue(lastValue)
                })
                // inactive joy
                if (!matchEvt) {
                    (joy as JoystickControl).disable()
                    // remove from active index
                    delete JoystickControl.activeTouchMapping[touchId]
                }
            })
    }

    constructor(controlUid, config) {
        super(controlUid)
        this.value = { x: 0, y: 0 }
        this.isInTouchRange = (x, y) => config.onScreenRange(x, y)
    }

    onTouch = (touchState, touchEvtType) => {
        switch (touchEvtType) {
            case 'touchstart':
                break;
            case 'touchmove':
                break;
            case 'touchend':
                break;
        }
    }

    // called @onTouchStart event
    enable = ({ x, y }) => {
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

    // called during @touchMove
    update = ({ x, y }) => {
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

    // called @touchEnd
    disable = () => {
        // TouchJoystick.removeFromActive(this)
        // TouchJoystick.refresh(e)
        this.touchState = {} // reset state
        if (this.autoReset) {
            this.value = { x: 0, y: 0 }
        } else this.needReset = true
    }

    matchByValue(touchValue) {
        return this.touchState.current?.x === touchValue.x && this.touchState.current?.y === touchValue.y
    }

    matchByTouchRange(touchOrigin) {
        return this.isInTouchRange(touchOrigin.x, touchOrigin.y)
    }

}


