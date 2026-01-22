import { InteractionArea } from './InteractionArea';
import { SysLabQuestion } from './SysLabQuestion';
import type { VMConfigData } from './packs/VMConfig';

/**
  * SysLabContextData
  * Question data and VM configuration
  */
export type SysLabContextData = {
  question: string
  vms: Array<VMConfigData>
}


/**
  * Will hold both the question and terminal(s)
  * that can be used for the question.
  * 
  */
export const SysLabContext = (props: SysLabContextData) => {
    
  const vms = props.vms;
  const question = props.question;

  return (
    <div className={"syslabcontext"}>
      <SysLabQuestion question={question} />
      <InteractionArea vms={vms}/>
    </div>
  )
}
