import { InteractionArea } from './InteractionArea';
import { SysLabQuestion } from './SysLabQuestion';
import type { VMConfigData } from './objs/VMConfig';
import type { QuestionTests } from './objs/QuestionData';

import style from './styles/SysLabContext.module.css';

/**
  * SysLabContextData
  * Question data and VM configuration
  */
export type SysLabContextData = {
  question: string
  vms: Array<VMConfigData>
  tests: QuestionTests
  selected: number
}


/**
  * Will hold both the question and terminal(s)
  * that can be used for the question.
  * 
  */
export const SysLabContext = (props: SysLabContextData) => {
    
  const vms = props.vms;
  const question = props.question;
  const tests = props.tests;
  const selected = props.selected;

  return (
    <div className={style.syslabcontext}>
      <SysLabQuestion question={question} />
      <InteractionArea vms={vms} tests={tests} selected={selected} />
    </div>
  )
}
