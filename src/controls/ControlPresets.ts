// import { faExpand } from "@fortawesome/free-solid-svg-icons"
import { halfScreenWidth, toggleFullScreen } from "../utils/misc"
import { BTN_TYPE } from "./TouchControls"
export const SizePresets = {
    S: 32,
    M: 48,
    L: 64,
    XL: 80,
    XXL: 96
}

/**
 * Preconfigured controls
 */
export const ControlPresets = {
    TOGGLE_FS_MODE: {
        type: BTN_TYPE.TOGGLE,
        // icon: fsIcon(SizePresets.M / 2),
        // style: { top: "3%", right: "3%" },
        size: SizePresets.M,
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