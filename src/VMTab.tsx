import { useState } from "react";
import type { VMConfigData } from "./objs/VMConfig";
import { VMConsoleContainer, type VMContext } from "./VMContainer";

import style from './styles/VMTab.module.css';

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
  // config: VMConfigData
} 

export const VMTabContainer = (props: VMTabData) => {

  const name = props.name;
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

  const onCloseClick = () => {
    console.log("Nothing happens yet");
  }

  return (
    <>
      <div className={style.vmTabObject}>
      <div className={style.vmTabTitle}>
        <span className={style.vmTitle}>{name}</span>
        <span className={style.vmClose} onClick={onCloseClick}>✕</span>
      </div>
      </div>
      <VMConsoleContainer context={vmctx} />
    </>
  )

}
