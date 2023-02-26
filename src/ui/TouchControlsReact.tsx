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
 * - render controls
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
                        key={'touchJoy_' + joyControl.type}
                        style={{ height: "100%", width: "50%" }}
                        joyControl={joyControl}
                        joyConfig={touchConfig[joyControl.type]} />
                )
            }
            {Object.values(TouchControls.instances)
                .filter(control => control instanceof ButtonControl)
                .map((btnControl: any) =>
                    <TouchButton
                        key={'touchBtn_' + btnControl.type}
                        btnControl={btnControl}
                        btnConfig={touchConfig[btnControl.type]} />
                )
            }
        </div>
    </>)
}

const TouchButton = ({ btnControl, btnConfig }) => {
    // const [btnPressed, setBtnPressed] = useState(false)
    const [refresh, setRefresh] = useState(false)
    // console.log(btnControl)
    // console.log(btnConfig) 

    // useEffect(() => {
    //     // forward button state to 
    //     onChange()
    // }, [btnPressed])

    const onTouchEvent = (evt, val?) => {
        evt.stopPropagation()
        if (val !== undefined) {
            // forward value to button control instance
            btnControl.value = val
            // refresh UI to reflect changes
            setRefresh(!refresh)
        }
    }

    return (
        <FontAwesomeIcon className="touchBtn" icon={btnConfig.icon}
            size={btnConfig.size ? btnConfig.size + 'x' : "2x"}
            style={{ ...btnConfig.style, opacity: btnControl.value ? '1' : '0.4' }}
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
    let { x: left, y: top } = joyControl.touchState.origin || {}
    left -= joySize / 2
    top -= joySize / 2
    // console.log(`joy ${JOY_TYPES[joyType]} left: ${left} top:${top}`)
    const display = show && joyControl.touchState.origin && !isNaN(left) && !isNaN(top)
    return (<>
        <div ref={ref} style={{ zIndex: 1100, ...style }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd} >
            {display && <div style={{ left, top, position: 'absolute' }}>
                <div style={{ position: 'relative', width: '128px', height: '128px', border: '1px solid black' }}>
                    <FontAwesomeIcon icon={faCircle} size={"3x"} style={{ position: 'absolute', left: offset.left, bottom: offset.bottom }} />
                </div>
                <span>#{joyConfig.label}</span>
            </div>}
            {dbg && <span> DBG </span>}
        </div>
    </>)
}

export const DebugOverlay = () => {
    const ref = useRef()
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setRefresh(!refresh)
    }, [])

    const w = ref.current?.clientWidth
    const h = ref.current?.clientHeight

    return (
        <div ref={ref} id={"dbgOverlay"} style={{ display: 'flex', outline: '5px solid red', outlineOffset: "-5px", opacity: 0.3 }}>
            <span style={{ left: "0%", top: "0%", position: 'absolute', margin: '10px' }}>{0}</span>
            <span style={{ right: "0%", top: "0%", position: 'absolute', margin: '10px' }}>{w}</span>
            <span style={{ left: "0%", bottom: "0%", position: 'absolute', margin: '10px' }}>{h}</span>
            <span style={{ right: "0%", bottom: "0%", position: 'absolute', margin: '10px' }}>{w}x{h}</span>
        </div>)
}



// enum BTN_ACTIONS {
//     Jump,
//     Fire
// }

// export const TouchInterface = ({touchRef}) => {
//     const onButtonTouch = ((action, state) => {
//         switch (action) {
//             case BTN_ACTIONS.Jump:
//                 // if (state) console.log("jump")
//                 touchRef.current.jump = state
//                 break;
//             case BTN_ACTIONS.Fire:
//                 // if (state) console.log("fire")
//                 touchRef.current.fire = state
//                 break;
//         }
//     })

//     return (<>
//         <TouchButton icon={faEject} style={{ top: "40%", right: "10%" }} onTouch={(state) => onButtonTouch(BTN_ACTIONS.Jump, state)} />
//         <TouchButton icon={faFire} style={{ bottom: "13%", right: "8%" }} onTouch={(state) => onButtonTouch(BTN_ACTIONS.Fire, state)} />
//     </>)

// }



export const ToggleBtn = ({ icon, disableIcon, style, toggleBtnAction, ...props }) => {
    const [btnState, setBtnState] = useState(false)

    const toggle = useCallback(() => {
        const newState = !btnState;
        toggleBtnAction(newState);
        setBtnState(newState);
    }, [btnState])

    return (
        <FontAwesomeIcon className="touchBtn" icon={btnState ? icon : disableIcon} size={"1x"}
            style={{ ...style, ...{ opacity: btnState ? '1' : '0.6' } }}
            onClick={toggle} />
    )
}

export const Slider = ({ touchRef }) => {
    const [value, setValue] = useState(0)

    const handleSlider = (evt) => {
        const sliderValue = evt.target.value;
        touchRef.current.slider = sliderValue
        setValue(sliderValue)
    }

    return (
        <>
            {/* <div ref={sliderRef} className='slider2'>
                <div ref={thumbRef} onMouseDown={handleMouseDown} className='slider2Thumb'></div>
            </div> */}
            <div className="slidecontainer">
                <input onInput={handleSlider} type="range" min="-255" max="255" value={value} className="slider" id="myRange" />
            </div>
        </>
    );
};

export const FullscreenToggleBtn = () => {
    // const [fullScreenMode, setFullScreenMode] = useState(false);

    return (
        <ToggleBtn icon={faCompress} disableIcon={faExpand} style={{ bottom: "5%", right: "4%", position: "absolute", zIndex: 2000 }} toggleBtnAction={toggleFullScreen} />
    )
}