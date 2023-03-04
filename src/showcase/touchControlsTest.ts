import { ControlPresets } from "../controls/ControlPresets"
import { ButtonControl, JoystickControl } from "../controls/TouchControls"

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
        // icon: faCircleUp,
        style: { bottom: "32%", right: "14%" }
    }
    ConfigMapping[TouchControlsTypes.BTN_FIRE] = {
        // icon: faFire,
        style: { bottom: "12%", right: "8%" },
    }
    return ConfigMapping
}

export class TouchControlsTest {

    init(){
        console.log("[TouchControlsTest] Init ")
        const controlsCfg = initControlsConfig()
        // instanciate joy controls
        JoystickControl.instanciate(TouchControlsTypes.JOY_LEFT, controlsCfg[TouchControlsTypes.JOY_LEFT])
        JoystickControl.instanciate(TouchControlsTypes.JOY_RIGHT, controlsCfg[TouchControlsTypes.JOY_RIGHT])
        // instanciate btn controls
        ButtonControl.instanciate(TouchControlsTypes.BTN_FS_MODE, controlsCfg[TouchControlsTypes.BTN_FS_MODE])
        ButtonControl.instanciate(TouchControlsTypes.BTN_JUMP)
        ButtonControl.instanciate(TouchControlsTypes.BTN_FIRE)
        // touch events bindings
    }

}