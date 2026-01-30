import { useState } from 'react';
import type { QuestionData } from './objs/QuestionData';

import style from './styles/SysLabContainer.module.css';
import { SysLabContext } from './SysLabContext';

export type SysLabPanelData = {
  exercises: Array<QuestionData>,
  selected: number
  updateSelected: (n: number) => void
}


export const SysLabPanel = (props: SysLabPanelData) => {

  const selected = props.selected;
  const exercises = props.exercises;
  const updateTrigger = props.updateSelected;

  const qrender = exercises.map((e, idx) => {
    const styleSelected = selected === idx ?
      style.taskSelectNavItemChosen :
      style.taskSelectNavItem;

    const name = e.name;
    
    return (
      
      <li className={styleSelected} onClick={
        () => { updateTrigger(idx) }}>
        {name}
      </li>
    )
  })

  return (
    <ul className={style.taskSelectNavList}>
      {qrender}
    </ul>
  )
  
}


export type SysLabContainerData = {
  exercises: Array<QuestionData>
}

/**
 * Will contain exercise context and 
 */
export const SysLabContainer = (props: SysLabContainerData) => {

  const [selected, setSelected] = useState(0);
  const exercises = props.exercises;
  const questionData = exercises[selected];


  return (
    <div className={style.syslabContainer}>
      <SysLabPanel exercises={exercises} selected={selected}
        updateSelected={setSelected} />
      <SysLabContext question={questionData.question}
          vms={questionData.vms} />
    </div>
  )
  
}
