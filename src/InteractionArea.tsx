import type { VMConfigData } from "./objs/VMConfig"
import { VMTabContainer } from './VMTab';

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

  const vmsRender = props.vms.map((e, idx) => {
    return (<VMTabContainer key={`vmt-${idx}`} name={`vm-${idx}`}/>)
  })

  return (<div className={"interaction_area"} >
    {vmsRender}
    </div>)

  // return <VMTabontainer name={"vm-1"}/>
}
