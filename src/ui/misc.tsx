
import React, { useCallback, useEffect, useState, useRef } from "react"

export const DebugOverlay = () => {
    const ref = useRef()
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setRefresh(!refresh)
    }, [])

    const w = ref.current?.clientWidth
    const h = ref.current?.clientHeight

    return (
        <div ref={ref} id={"dbgOverlay"}
            style={{ display: 'flex', outline: '5px solid red', outlineOffset: "-5px", opacity: 0.7, backgroundColor: 'black', color: 'white' }}>
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



