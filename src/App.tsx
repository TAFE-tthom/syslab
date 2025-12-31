import { VMCanvasContainer, VMConsoleContainer, type VMContext } from './VMContainer';
import { useState } from 'react';
import "./App.css";



/**
 * App
 * Loads the canvas container that will be loaded
 * Will be switched to a console container
 */
export const App = () => {

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


export default App;
