import remarkGfm from 'remark-gfm'; 
import ReactMarkdown from 'react-markdown';

import style from "./styles/SysLabQuestion.module.css";

export type SysLabQuestionData = {
  question: string
}

// export type QuestionStateData = {
// }


// export type QuestionStateAggrData = {
//    states: Array<QuestionStateData>
// }

/**
  * Will hold the question state
  * It will keep track of it if there is
  * an update on the 
  *
  */
// export const QuestionState = (props: QuestionStateAggrData) => {
// }

/**
  * SysLabQuestion
  * Will be represented 
  */
export const SysLabQuestion = (props: SysLabQuestionData) => {

  const question = props.question;

  const questionHTML = (<ReactMarkdown
    remarkPlugins={[remarkGfm]}
    >{question}
  </ReactMarkdown>);
  return (
    <div className={style.syslabQuestionView}>
      {questionHTML}
    </div>
  )
}
