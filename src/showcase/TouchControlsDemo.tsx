/**
 * Global Purpose Graphical User Interface
 */

import React from "react";
import { FullscreenToggleBtn, TouchControlLayer } from "../gui/TouchControls";

enum TOUCH_BTN_ACTIONS {
    Jump,
    Fire
}

const TouchBtnInterface = ({ touchRef }) => {

    const onButtonTouch = ((action, state) => {
        switch (action) {
            case TOUCH_BTN_ACTIONS.Jump:
                // if (state) console.log("jump")
                touchRef.current.jump = state
                break;
            case TOUCH_BTN_ACTIONS.Fire:
                // if (state) console.log("fire")
                touchRef.current.fire = state
                break;
        }
    })

    return (<>
        <FullscreenToggleBtn />
        {/* <TouchButton icon={faEject} style={{ top: "40%", right: "10%" }} onTouch={(state) => onButtonTouch(TOUCH_BTN_ACTIONS.Jump, state)} />
        <TouchButton icon={faFire} style={{ bottom: "13%", right: "8%" }} onTouch={(state) => onButtonTouch(TOUCH_BTN_ACTIONS.Fire, state)} /> */}
    </>)

}
/**
 * Demonstrate Touch GUI with joysticks and buttons controls
 * Usage examples: game controller, rov remote control, ..
 * @param param0 
 * @returns 
 */
export const TouchControlsDemo = ({ customRouteName }) => {

    const joyControls = []
    const btnControls = []

    return (<>
        {/* <div>
            <h1>RovControl</h1>
            <p>Resize the browser window to see the responsive effect.</p>
        </div>
        <div style={{ display: "inline-grid", gridTemplateColumns: "auto auto auto" }}>
            <div >1</div>
            <div >2</div>
            <div >3</div>
            <div >1</div>
            <div >2</div>
            <div >3</div>
            <div >1</div>
            <div >2</div>
            <div >3</div>
        </div> */}
        <TouchControlLayer showBtn/>
        {/* <TouchJoysticks /> */}
        <FullscreenToggleBtn />
    </>);
}