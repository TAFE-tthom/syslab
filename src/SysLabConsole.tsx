import { useState } from "react"
import { VMConsoleContainer, type VMContext } from "./VMContainer"

export type SysLabConsoleData = {
  index: number
  
}

export const SysLabConsole = (props: SysLabConsoleData) => {
  
  const [vmctx, _setVMContext] = useState({
    emulator: null,
    serial: {
      terminal: null
    },
    datamap: {
      serialmap: { enabled: true },
      buffers: {
        combuffer: ''
      },
    }
  } as VMContext)

  return (
    <>
      <VMConsoleContainer context={vmctx} />
    </>
  )
}
