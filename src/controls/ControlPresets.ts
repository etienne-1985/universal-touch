// import { faExpand } from "@fortawesome/free-solid-svg-icons"
import { halfScreenWidth, toggleFullScreen } from "../utils/misc"
import { BTN_TYPE } from "./TouchControls"

/**
 * Preconfigured controls
 */
export const ControlPresets = {
    TOGGLE_FS_MODE: {
        type: BTN_TYPE.TOGGLE,
        // icon: faExpand,
        // style: { top: "3%", right: "3%" },
        // size: 1,
        actionBinding: toggleFullScreen // actionCallback
    },
    JOY_L: {
        label: "L",
        onScreenRange: (x, y) => (x < halfScreenWidth)
    },
    JOY_R: {
        label: "R",
        onScreenRange: (x, y) => (x > halfScreenWidth)
    }
}