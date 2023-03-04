import React, { useCallback, useEffect, useState, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toggleFullScreen } from "../utils/misc"
import { faCircle, faCompress, faExpand } from '@fortawesome/free-solid-svg-icons'
import { ButtonControl, JoystickControl, TouchControls } from "../controls/TouchControls"
import '../pwa.css'
import "./slider.css"

const joySize = 128
const stickSize = 40

/**
 * Touch overlay for
 * - binding touch events to controls
 * - controls display
 * @param param0 
 * @returns 
 */
export const TouchControlsReactOverlay = ({ touchConfig }) => {
    const [refresh, setRefresh] = useState(false);


    const onTouchStart = (e: any) => {
        JoystickControl.onTouchStart(e)
        touchConfig.show && setRefresh(!refresh)
    }

    const onTouchMove = (e: any) => {
        JoystickControl.onTouchMove(e)
        touchConfig.show && setRefresh(!refresh)
    }

    const onTouchEnd = (e: any) => {
        JoystickControl.onTouchEnd(e)
        touchConfig.show && setRefresh(!refresh)
    }

    return (<>
        {/* {Object.values(touches).map((touch: any) => {
        const color = touch.orig.x < halfWidth ? "red" : "green"
        const side = touch.orig.x < halfWidth ? "LEFT" : "RIGHT"
        const { x, y } = touch.orig
        const { x: dx, y: dy } = normDiff(touch.diff)
        return (<div style={{ position: "fixed", top: `${y}px`, left: `${x}px`, color }}>{side} dx: {dx} dy: {dy}</div>)
      })} */}
        <div id={"touchOverlay"} style={{ display: 'flex' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchMove}>
            {/* <div id={"touchOverlay"} style={{ display: 'flex' }}> */}
            {/* <TouchJoystick style={{ height: "100%", width: "50%", zIndex: 1100 }} joystick={JoystickControl.left} />
            <TouchJoystick style={{ height: "100%", width: "50%", zIndex: 1100 }} joystick={JoystickControl.right} /> */}
            {Object.values(TouchControls.instances)
                .filter(control => control instanceof JoystickControl)
                .map((joyControl: any) =>
                    <TouchJoystick
                        key={'touchJoy_' + joyControl.uid}
                        style={{ height: "100%", width: "50%" }}
                        joyControl={joyControl}
                        joyConfig={touchConfig[joyControl.uid]} />
                )
            }
            {Object.values(TouchControls.instances)
                .filter(control => control instanceof ButtonControl)
                .map((btnControl: any) =>
                    <TouchButton
                        key={'touchBtn_' + btnControl.uid}
                        btnControl={btnControl}
                        btnConfig={touchConfig[btnControl.uid]} />
                )
            }
        </div>
    </>)
}

const TouchButton = ({ btnControl, btnConfig }) => {
    // const [btnPressed, setBtnPressed] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const onTouchEvent = (evt, val?) => {
        // TODO support disabling joy while touching button
        // evt.stopPropagation()
        if (val !== undefined) {
            // forward value to button control instance
            // btnControl.value = val
            btnControl.onTouch(val, evt.type)
            // refresh UI to reflect changes
            setRefresh(!refresh)
        }
    }

    return (
        <FontAwesomeIcon className="touchBtn" icon={btnConfig.icon}
            size={btnConfig.size ? btnConfig.size + 'x' : "2x"}
            style={{ ...btnConfig.style, opacity: btnControl.value ? '1' : '0.4', color: 'white' }}
            onTouchStart={(e) => onTouchEvent(e, true)}
            onTouchMove={(e) => onTouchEvent(e)}
            onTouchEnd={(e) => onTouchEvent(e, false)} />
    )

}

const TouchJoystick = ({ joyControl, joyConfig, style, show = true, dbg = false }) => {
    const ref = useRef()
    const [refresh, setRefresh] = useState(false);

    const joyType = joyControl.type

    const onTouchStart = (e: any) => {
        // joystick.onTouchStart(e)
        show && setRefresh(!refresh)
    }

    const onTouchMove = (e: any) => {
        // joystick.onTouchMove(e)
        show && setRefresh(!refresh)
    }

    const onTouchEnd = (e: any) => {
        // joystick.onTouchEnd(e)
        show && setRefresh(!refresh)
    }

    const coords2percent = (coord) => 100 * (coord + 128) / 256
    const offset = {
        left: coords2percent(joyControl.value.x - stickSize) + "%",
        bottom: coords2percent(joyControl.value.y - stickSize) + "%"
    }
    const { x: centerLeft, y: centerTop } = joyControl.touchState.origin || {}
    const left = centerLeft - joySize / 2
    const top = centerTop - joySize / 2
    // console.log(`joy ${JOY_TYPES[joyType]} left: ${left} top:${top}`)
    const display = show && joyControl.touchState.origin && !isNaN(left) && !isNaN(top)
    return (<>
        <div ref={ref} style={{ zIndex: 1100, ...style }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd} >
            {display &&
                <>
                    <div style={{ position: 'absolute', left, top, opacity: '0.25' }}>
                        <div style={{ position: 'relative', width: '128px', height: '128px', border: false ? '' : '1px solid white' }}>
                            <FontAwesomeIcon icon={faCircle} size={"3x"} style={{ color: "white", position: 'absolute', left: offset.left, bottom: offset.bottom }} />
                        </div>
                        {/* <span>#{joyConfig.label}</span> */}
                    </div>
                    <span style={{ position: 'absolute', left: centerLeft, top: centerTop, color: 'white' }}>{joyConfig.label}</span>
                </>}
            {dbg && <span> DBG </span>}
        </div>
    </>)
}