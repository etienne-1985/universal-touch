import React, { useEffect } from "react";
import { TouchControlsReactOverlay } from "../ui/TouchControls";
//  import { faCircleUp, faFire } from '@fortawesome/free-solid-svg-icons'
import { ButtonControl, JoystickControl } from "../controls/TouchControls";
import { ControlPresets, SizePresets } from "../controls/ControlPresets";
import { DebugOverlay } from "../ui/misc";
import FireIcon from '../assets/icons/fire.svg';
// import { ReactComponent as FireIcon } from '../assets/icons/fire.svg';
import ArrowUpIcon from '../assets/icons/arrow-up-short.svg';
import '../assets/icons/arrow-up-short.svg';

/**
 * Touch UI example to demo joysticks and buttons controls
 * (inspired from much popular FN mobile game) ,
 * and show how to setup UI configuration + touch bindings
 */
export const GameControlsDemo = ({ customRouteName }) => {
    // defines touch controls as enum so they get unique id
    enum TouchControlsTypes {
        BTN_FS_MODE,
        JOY_LEFT,
        JOY_RIGHT,
        BTN_JUMP,
        BTN_FIRE
    }

    const fsIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16" color="white">
<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z" />
</svg>`

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
            icon: <div dangerouslySetInnerHTML={{ __html: fsIcon(SizePresets.M / 2) }} />
        }
        ConfigMapping[TouchControlsTypes.BTN_JUMP] = {
            icon: <img src={ArrowUpIcon} width={SizePresets.L / 2} alt="React Logo" />,
            style: { bottom: "32%", right: "14%", color: "white" },
            size: SizePresets.L
        }
        ConfigMapping[TouchControlsTypes.BTN_FIRE] = {
            icon: <object data="arrow-up-short.svg" title="Interactive SVG"/>,
            style: { bottom: "12%", right: "8%" },
            size: SizePresets.XL
        }
        return ConfigMapping
    }

    <img src={FireIcon} alt="Fire Logo" />

    useEffect(() => {
        // instanciate joy controls
        JoystickControl.instanciate(TouchControlsTypes.JOY_LEFT, controlsCfg[TouchControlsTypes.JOY_LEFT])
        JoystickControl.instanciate(TouchControlsTypes.JOY_RIGHT, controlsCfg[TouchControlsTypes.JOY_RIGHT])
        // instanciate btn controls
        ButtonControl.instanciate(TouchControlsTypes.BTN_FS_MODE, controlsCfg[TouchControlsTypes.BTN_FS_MODE])
        ButtonControl.instanciate(TouchControlsTypes.BTN_JUMP)
        // ButtonControl.instanciate(TouchControlsTypes.BTN_FIRE)
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