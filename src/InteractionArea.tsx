import type { VMConfigData } from "./packs/VMConfig"
import { VMTabBar, VMTabContainer } from './VMTab';

/**
  * InteractionAreaData
  * Data that is given to it via the LabContext
  */
export type InteractionAreaData = {
  vms: Array<VMConfigData>
  
}




/**
  *
  * InteractionArea
  * Where the VM containers will be held within
  * as part of solving the 
  *
  */
export const InteractionArea = (props: InteractionAreaData) => {

  // const vms = props.vms;

  // return (<div className={"interaction_area"} >
  //     <VMTabBar vms={vms}/>
  //   </div>)

  return <VMTabContainer name={"vm-1"}/>
}
