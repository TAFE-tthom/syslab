// @ts-ignore
import { V86 } from './v86/libv86.mjs';
import { useEffect } from 'react';
import { SerialConsole, type SerialConsoleContext } from './SerialConsole'; 
import { Terminal } from '@xterm/xterm';
import { DeviceSpectState, MonitorWriteObjectFactory, SpectMessages, SpectProtocolEncoder, type SpectDeviceObject, type SpectMessagePacket } from 'vmspect/proto';
import type { QuestionTests } from './objs/QuestionData';
import type { VMSharedData } from './VMTab';


export type V86Bus = {
  bus: any
}


export class V86PortWrapper implements SpectDeviceObject {

  emulator: V86Bus;
  
  constructor(emulator: any) {
    this.emulator = emulator
  }

  open(fn: (err: any) => void): void {
    fn(false);
  }

  on(evstr: string, fn: (data?: any) => void): void {
    if(evstr === 'data') {
      const serial1buffer: Array<number> = [];
      this.emulator.bus.register("serial1-output-byte", (byte: number) => {
        serial1buffer.push(byte);
        if(byte === 0xA) { //NOTE: new line compare
          //If new line, construct string
          let strbuf = '';
          for(let i = 0; i < serial1buffer.length; i++) {
            strbuf += String.fromCharCode(serial1buffer[i]);
          }
          serial1buffer.length = 0;
          fn(strbuf);
          
        }
      });
      
    }
  }

  write(msg: string, _fn?: (err: any) => void): void {
    this.emulator.bus.send('serial1-input', msg);
  }

  pipe(_parser: any): void {
    //Can be ignored
  }

}



/**
 * VMContext
 * Will hold reference to emulator
 */
export type VMContext = {
  emulator: (typeof V86) | null;
  monitor: DeviceSpectState | null
  serial: SerialConsoleContext
  datamap: V86DataMap
}

/**
 * VMProps
 * Will hold reference to the context in parent props
 */
export type VMProps = {
  context: VMContext
  tests: QuestionTests
  shared: VMSharedData
  selected: number
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
  statebuf: ArrayBuffer | null
  canvas?: HTMLElement,
}

// Hold onto an existing object rather than a new one?
export const V86StateReader = async (url: string, dmap: V86DataMap) => {

  const datamap = dmap;
  
  if(datamap.statebuf === null) {
    const decompStream = new DecompressionStream("gzip");
    const stateBlob = new Uint8Array(await (await fetch(url)).arrayBuffer());

    const writer = decompStream.writable.getWriter();
    writer.write(stateBlob);
    writer.close();

    const reader = decompStream.readable.getReader();

    let done = false;
    const dataDump: Array<number> = [];

    while(!done) {

      const dataResult = await reader.read();

      if(dataResult.value) {
        dataDump.push(...dataResult.value);
      }
      
      done = dataResult.done;            
    }

    const stateData = new Uint8Array(dataDump).buffer;
    datamap.statebuf = stateData;
    return stateData;
  } else {
    return datamap.statebuf;
  }
}


/**
 * V86Load,
 * Will load the emulator and potentially attach
 * And attach the serial output
 */
export const V86Load = async (props: VMContext) => {

  //TODO: Update this so it is configurable
  const baseurl = "alpine-rootfs-flat";
  const basefs = "alpine-fs.json";
  const initialstateUrl = "alpine-state.bin.gzip";

  // Used for the output on display and/or console
  const context = props;
  
  if(context.emulator) {    
    // let sbuf = await V86StateReader(initialstateUrl, context.datamap);
    await props.emulator.stop();
    await props.emulator.restore_state(props.datamap.statebuf);
    // TODO: State issues on single call, second call addresses a bug in libv86
    // NOTE: Investigate this matter later on
    await props.emulator.restore_state(props.datamap.statebuf); //LIKE LOL WHAT? Why does this fix it?
    await props.emulator.run();
    return props.emulator;
  } else {
    
    let stateData = await V86StateReader(initialstateUrl, context.datamap);
  
    // const databuffers = props.datamap;
    const serialData = props.datamap.serialmap;
  


    //TODO: You should try set the VGA and Memory size to something reasonable
    // Emulator for x86  
    const emulator = new V86({
      uart1: true,
      wasm_path: "wasm/v86.wasm",
      memory_size: 512 * 1024 * 1024,
      vga_memory_size: 8 * 1024 * 1024,
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
      initial_state: { buffer: stateData },
      network_relay_url: "<UNUSED>",
      
    });

    if(serialData.enabled) {
      emulator.bus.register("serial0-output-byte", (byte: number) => {

        const vmcontext = context;
        const term = vmcontext.serial.terminal;
        if(term) {
          term.write(Uint8Array.of(byte), () => {
            emulator.bus.uart
          });
        }
      
      });
      
    }
    context.emulator = emulator;
    const term = context.serial.terminal;
    if(term) {
      term.onData((data: string) => {
        for(let i = 0; i < data.length; i++) {
          emulator.bus.send('serial0-input', data.charCodeAt(i));
        }
        return;
      });
    }

  
    return emulator;
  }
}


/**
 * VMConsoleContainer
 * Will accept a VM Context
 */
export const VMConsoleContainer = (props: VMProps) => {

  const selected = props.selected;
  const context = props.context;
  const tests = props.tests;
  const shared = props.shared;
  const updateFn = (_term: Terminal) => { /** NOOP **/ }

  useEffect(() => {
    
    const context = props.context;    
    if(context) {
      const ctx = context;

      V86Load(ctx).then((emulator) => {

        props.context.emulator = emulator;

        setTimeout(() => {

          if(props.context.monitor === null) {
            props.context.monitor
             = DeviceSpectState.Hook(
            new SpectProtocolEncoder(),
            new V86PortWrapper(emulator), {},
            (data: SpectMessagePacket, _machine: DeviceSpectState) => {
              //Call back to update UI and other decisions
              const resultHook = shared.resultUpdate;
              if(data.kind === 'ResultData') {
                resultHook(data);
              } else {
                console.warn("Packet should not have been received here");
              }
          
            });
          }

        // NOTE: Send task information over
          const packet = SpectMessages.TaskPacket(tests);
          if(props.context.monitor) {
            props.context.monitor
              .write(packet, MonitorWriteObjectFactory(emulator));
          }
        }, 1000);
        
      });
    }
  }, [selected])

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


