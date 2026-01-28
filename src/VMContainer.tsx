// @ts-ignore
import { V86 } from './v86/libv86.mjs';
import { useEffect } from 'react';
import { SerialConsole, type SerialConsoleContext } from './SerialConsole'; 
import { Terminal } from '@xterm/xterm';


/**
 * VMContext
 * Will hold reference to emulator
 */
export type VMContext = {
  emulator: (typeof V86) | null;
  serial: SerialConsoleContext
  datamap: V86DataMap
}

/**
 * VMProps
 * Will hold reference to the context in parent props
 */
export type VMProps = {
  context: VMContext
}

/**
 * SerialMap
 * Information on setting up serial communication
 */
export type V86SerialMap = {
  enabled: boolean
}

/**
 * Data buffers for the console
 * possible for others
 */
export type V86DataBuffers = {
  combuffer: string
}


/**
 * V86DataMap
 * Sets the serial map and canvas
 */
export type V86DataMap = {
  serialmap: V86SerialMap,
  buffers: V86DataBuffers,
  canvas?: HTMLElement,
}


/**
 * V86Load,
 * Will load the emulator and potentially attach
 * And attach the serial output
 */
export const V86Load = (props: VMContext) => {

  // Used for the output on display and/or console
  const context = props;
  // const databuffers = props.datamap;
  const screen_container = props.datamap.canvas;
  const serialData = props.datamap.serialmap;
  

  //TODO: Update this so it is configurable
  const baseurl = "alpine-rootfs-flat";
  const basefs = "alpine-fs.json";
  const initialstateUrl = "alpine-state.bin";

  //TODO: You should try set the VGA and Memory size to something reasonable
  // Emulator for x86  
  const emulator = new V86({
    uart1: true,
    wasm_path: "wasm/v86.wasm",
    memory_size: 512 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    screen_container,
    bios: { url: "seabios.bin" },
    vga_bios: { url: "vgabios.bin" },
    filesystem: {
        baseurl,
        basefs,
    },
    autostart: true,
    bzimage_initrd_from_filesystem: true,
    cmdline: "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci tsc=reliable console=ttyS0,115200",

    //TODO: Use the initial state, should be usable with v86 tools
    initial_state: { url: initialstateUrl },
    net_device: {
        relay_url: "wisp://localhost:8000",
        type: "virtio"
    },
      
  });
  emulator.bus.register("serial1-output-byte", (byte: number) => {
      console.log(Uint8Array.of(byte));
      
    });
  if(serialData.enabled) {
    console.log("Enabled");
    emulator.bus.register("serial0-output-byte", (byte: number) => {

      const vmcontext = context;
      const term = vmcontext.serial.terminal;
      if(term) {
        term.write(Uint8Array.of(byte));
      }
      
    });
      
  }
  context.emulator = emulator;
  const term = context.serial.terminal;
  if(term) {
    term.onData((data: any) => {
      for(let i = 0; i < data.length; i++) {
        emulator.bus.send('serial0-input', data.charCodeAt(i));
      }
    });
  }

  
  return emulator;
}


/**
 * VMConsoleContainer
 * Will accept a VM Context
 */
export const VMConsoleContainer = (props: VMProps) => {

  const context = props.context;
  const updateFn = (_term: Terminal) => { /** NOOP **/ }

  useEffect(() => {
    
    const context = props.context;    
    if(context) {
      const ctx = context;
      const emulator = V86Load(ctx);
      props.context.emulator = emulator;
    }
  }, [props])

  return (
    <>
      <SerialConsole context={context.serial}
        updateContext={updateFn} />
    </>
  )
}

/**
 * Creates a Virtual Machine Container
 * Will accept the VM Context 
 */
// export const VMCanvasContainer = (props: VMProps) => {

//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = props.context;
    
    
//     if(canvas) {
//       const ctx = context;
//       ctx.datamap.canvas = canvas;
//       const emulator = V86Load(ctx);
      
//       props.context.emulator = emulator;
      
//     }
//   }, [props]);
  
//   return (
//   <>
//     <div ref={canvasRef} id="screen_container">
//       <div style={{whiteSpace: 'pre', font: "14px monospace", lineHeight: "14px"}}>
//       </div>
//       <canvas style={{display: "none"}}></canvas>
//     </div>
//   </>)
// }


