import React, { useCallback, useEffect, useState, useRef } from "react"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCircle, faCompress, faExpand } from '@fortawesome/free-solid-svg-icons'
import { ButtonControl, JoystickControl, TouchControls } from "../controls/TouchControls"
import FireIcon from '../assets/icons/fire.svg';
import '../assets/icons/icons.css'
import '../pwa.css'

const joySize = 128
const stickSize = 64

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

const TouchControl = ({ center, offset, children, size, customStyle = {}, sizeRatio = 2, onTouch = (e, v) => null }) => {
    const edge = { ...center }
    const innerSize = size / sizeRatio  // inner/outter size ratio
    // add/substract half width to find bottom left edge
    if (!isNaN(Object.values(center)[0]))
        Object.keys(edge).forEach(k => edge[k] += (k === 'top' || k === 'left') ? -size / 2 : size / 2)
    // offset.left -= 50
    // offset.bottom -= 50
    return (<>
        <div style={{ ...edge, position: 'absolute', ...customStyle }}
            onTouchStart={(e) => onTouch(e, true)}
            onTouchMove={(e) => onTouch(e)}
            onTouchEnd={(e) => onTouch(e, false)}>
            <div style={{
                position: 'relative', width: size + 'px', height: size + 'px',
                border: false ? '' : '2px solid white', borderRadius: size
            }}>
                {/* <svg style={{ ...offset, position: 'absolute', width: 100, height: 100 }}>
                    <circle cx="50" cy="50" r={innerSize} stroke="white" stroke-width="4" fill="white" />
                </svg> */}
                <div style={{
                    ...offset, position: 'absolute',
                    width: innerSize + 'px', height: innerSize + 'px',
                    // border: '1px solid white', borderRadius: innerSize,
                    // backgroundColor: 'white', color: 'black',
                    textAlign: 'center', color: 'white'
                }}>
                    {children}
                </div>
                {/* <span style={{ top: size / 2, left: size / 2, position: 'absolute', color: 'white' }}>{label}</span> */}
                {/* <FontAwesomeIcon icon={faCircle} size={"3x"} 
            style={{ color: "white", position: 'absolute', left: offset.left, bottom: offset.bottom }} /> */}
            </div>
            {/* <span>#{joyConfig.label}</span> */}
        </div>
        {/* <span style={{ ...center, position: 'absolute', color: 'white' }}>{label}</span> */}
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
    const { size } = btnConfig
    const innerSize = size / 2
    return (<>
        <TouchControl
            center={btnConfig.style}
            offset={{ left: size / 4, bottom: size / 4 }}
            size={size} label="B" onTouch={onTouchEvent}
            customStyle={{ opacity: btnControl.value ? '1' : '0.4', color: 'white', fontSize: 'x-large', zIndex: 4000 }} >
            {/* <svg style={{ width: innerSize, height: innerSize }}>
                <circle cx={innerSize / 2} cy={innerSize / 2} r={innerSize / 2 - 1} stroke="red" stroke-width="2" fill="black" />
            </svg> */}
            {btnConfig.icon}
        </TouchControl>
        {/* <div className="touchBtn"
            style={{
                ...btnConfig.style, width: '48px', height: '48px',
                opacity: btnControl.value ? '1' : '0.4', color: 'white', fontSize: 'xx-large'
            }}
            onTouchStart={(e) => onTouchEvent(e, true)}
            onTouchMove={(e) => onTouchEvent(e)}
            onTouchEnd={(e) => onTouchEvent(e, false)}
        >
            <div style={{ position: "relative" }}>JUMP</div>
        </div> */}
    </>
        // <FontAwesomeIcon className="touchBtn" icon={btnConfig.icon}
        //     size={btnConfig.size ? btnConfig.size + 'x' : "2x"}
        //     style={{ ...btnConfig.style, opacity: btnControl.value ? '1' : '0.4', color: 'white' }}
        //     onTouchStart={(e) => onTouchEvent(e, true)}
        //     onTouchMove={(e) => onTouchEvent(e)}
        //     onTouchEnd={(e) => onTouchEvent(e, false)} />
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

    // translating joy between 0-100%
    const coords2percent = (coord) => 100 * (coord + 128) / 256
    const offset = {
        left: coords2percent(joyControl.value.x - stickSize) + "%",
        bottom: coords2percent(joyControl.value.y - stickSize) + "%"
    }
    const { x: centerLeft, y: centerTop } = joyControl.touchState.origin || {}
    const center = {
        left: centerLeft,
        top: centerTop
    }
    const left = center.left - joySize / 2
    const top = center.top - joySize / 2
    // console.log(`joy ${JOY_TYPES[joyType]} left: ${left} top:${top}`)
    const display = show && joyControl.touchState.origin && !isNaN(left) && !isNaN(top)
    return (<>
        <div ref={ref} style={{ zIndex: 1100, ...style }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd} >
            {display && <TouchControl center={center} offset={offset} size={joySize} customStyle={{ opacity: 0.15 }} >
                <div style={{
                    width: joySize/2 + 'px', height: joySize/2 + 'px',
                    border: '1px solid white', borderRadius: joySize,
                    backgroundColor: 'white', color: 'black', textAlign: 'center'
                }}>
                    {joyConfig.label}
                </div>
            </TouchControl>
            }
            {dbg && <span> DBG </span>}
        </div>
    </>)
}