import { useState } from "react";
import type { VMConfigData } from "./objs/VMConfig";
import { VMConsoleContainer, type VMContext } from "./VMContainer";
import { VMControlPanel } from "./VMControlPanel";
import { SpectMessages, MonitorWriteObjectFactory } from 'vmspect/proto';

import style from './styles/VMTab.module.css';
import type { QuestionTests } from "./objs/QuestionData";

/**
  * Holds a list of tabs of the vms;
  * Will currently just order them from 1 to N
  */
export type VMTabBarData = {
  vms: Array<VMConfigData>
}

/**
  * VMTabBar
  * Holds a list of action VMs that are in use
  */
export const VMTabBar = (props: VMTabBarData) => {

  const vms = props.vms;
  const vmTitles = vms.map((_, idx) => {
    const vmname = `vm-${idx+1}`;
    return <li>{vmname}</li>
  });

  return (
    <nav>
      <ul>
        {vmTitles}
      </ul>
    </nav>
  )
}

/**
  * Simple window in which the tab data is held
  * It will be used  
  */
export type VMTabData = {
  name: string
  config: VMConfigData
  tests: QuestionTests
  selected: number
} 

export type VMSharedData = {
  resultUpdate: (data: any) => void
}

/**
 * TabContainer
 * 
 */
export const VMTabContainer = (props: VMTabData) => {

  const selected = props.selected;
  const tests = props.tests;
  const name = props.name;
  const [shared, _setSharedState] = useState<VMSharedData>({
    resultUpdate: () => {}
  })
  const [vmctx, setVMContext] = useState({
    emulator: null,
    monitor: null,
    serial: {
      terminal: null
    },
    datamap: {
      statebuf: null,
      serialmap: { enabled: true },
      buffers: {
        combuffer: ''
      },
    }
  } as VMContext)


  const onCloseClick = () => {
    console.log("Nothing happens yet");
  };

  const onCheckTrigger = () => {
    const emulator = vmctx.emulator;
    const monitor = vmctx.monitor;
    const packet = SpectMessages.CheckPacket();

    // TODO: Need to send a particular object over
    if(monitor) {
      monitor.write(packet, MonitorWriteObjectFactory(emulator));
    }
  };

  const onSyncTrigger = () => {
    const emulator = vmctx.emulator;
    const monitor = vmctx.monitor;
    const packet = SpectMessages.TaskPacket(tests);
    
    // TODO: Need to send a particular object over
    if(monitor) {
      monitor.write(packet, MonitorWriteObjectFactory(emulator));
    }
  }

  const onResetTrigger = () => {
    const nctx = {...vmctx};
    nctx.emulator = null;
    nctx.serial.terminal = null;
    setVMContext(nctx);
  }

  // const updateVMContext = (vm: VMContext) => {
  //   setVMContext(vm);
  // }

  return (
    <>
      <VMControlPanel context={vmctx} checkTrigger={onCheckTrigger}
        resetTrigger={onResetTrigger} syncTrigger={onSyncTrigger}
        shared={shared}
        tests={tests}
        selected={selected}/>
      <div className={style.vmTabObject}>
      <div className={style.vmTabTitle}>
        <span className={style.vmTitle}>{name}</span>
        <span className={style.vmClose} onClick={onCloseClick}>✕</span>
      </div>
      </div>
      <VMConsoleContainer context={vmctx} tests={tests} shared={shared}
        selected={selected} />
    </>
  )

}
