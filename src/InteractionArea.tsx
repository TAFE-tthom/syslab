import type { QuestionTests } from "./objs/QuestionData";
import type { VMConfigData } from "./objs/VMConfig"
import { VMTabContainer } from './VMTab';

/**
  * InteractionAreaData
  * Data that is given to it via the LabContext
  */
export type InteractionAreaData = {
  vms: Array<VMConfigData>
  tests: QuestionTests
  selected: number
}




/**
  *
  * InteractionArea
  * Where the VM containers will be held within
  * as part of solving the 
  *
  */
export const InteractionArea = (props: InteractionAreaData) => {

  const selected = props.selected;
  // const vms = props.vms;

  const vmsRender = props.vms.map((e, idx) => {
    return (<VMTabContainer key={`vmt-${idx}`}
      name={`vm-${idx}`} config={e} tests={props.tests}
      selected={selected}
    />);
  })

  return (<div className={"interaction_area"} >
    {vmsRender}
    </div>)
}
