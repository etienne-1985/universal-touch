/**
 * Global Purpose Graphical User Interface
 */

import React, { useEffect } from "react";
import { DebugOverlay, TouchControlsReactOverlay } from "../ui/TouchControlsReact";
import { faCircleUp, faFire } from '@fortawesome/free-solid-svg-icons'
import {  ButtonControl, JoystickControl } from "../controls/TouchControls";
import { ControlPresets } from "../controls/ControlPresets";


/**
 * Touch UI example to demo joysticks and buttons controls
 * (inspired from Fortnite mobile version) ,
 * and show how to setup UI configuration + touch bindings
 */
export const FortniteTouchControlsDemo = ({ customRouteName }) => {

    enum TouchControlsTypes {
        BTN_FS_MODE,
        JOY_LEFT,
        JOY_RIGHT,
        BTN_JUMP,
        BTN_FIRE
    }

    // Defines and map controls to config
    const initControlsConfig = () => {
        // Controls configuration
        const ConfigMapping = {}
        // Controls enum def 
        ConfigMapping[TouchControlsTypes.JOY_LEFT] = ControlPresets.JOY_L
        ConfigMapping[TouchControlsTypes.JOY_RIGHT] = ControlPresets.JOY_R
        ConfigMapping[TouchControlsTypes.BTN_FS_MODE] = {
            ...ControlPresets.TOGGLE_FS_MODE,
            style: { top: "3%", right: "3%" },
            size: 1
        }
        ConfigMapping[TouchControlsTypes.BTN_JUMP] = {
            icon: faCircleUp,
            style: { bottom: "32%", right: "14%" }
        }
        ConfigMapping[TouchControlsTypes.BTN_FIRE] = {
            icon: faFire,
            style: { bottom: "12%", right: "8%" }
        }
        return ConfigMapping
    }


    useEffect(() => {
        // instanciate joy
        JoystickControl.instanciate(TouchControlsTypes.JOY_LEFT, controlsCfg[TouchControlsTypes.JOY_LEFT])
        JoystickControl.instanciate(TouchControlsTypes.JOY_RIGHT, controlsCfg[TouchControlsTypes.JOY_RIGHT])
        // instanciate btn controls
        ButtonControl.instanciate(TouchControlsTypes.BTN_FS_MODE, controlsCfg[TouchControlsTypes.BTN_FS_MODE])
        ButtonControl.instanciate(TouchControlsTypes.BTN_JUMP)
        ButtonControl.instanciate(TouchControlsTypes.BTN_FIRE)
        // const btnJump: TouchButtonControl = TouchButtonControl.instances[TouchControlsTypes.BTN_JUMP]
        // btnJump.onValueChange = (val) => console.log("val")
        // const btnFire: TouchButtonControl = TouchButtonControl.instances[TouchControlsTypes.BTN_FIRE]
        // btnFire.onValueChange = (val) => console.log("val")
        // define touch controls config mapping

    }, [])

    const controlsCfg: any = initControlsConfig()
    controlsCfg.show = true

    return (<>
        <DebugOverlay />
        <TouchControlsReactOverlay touchConfig={controlsCfg} showBtn={true} />
    </>);
}