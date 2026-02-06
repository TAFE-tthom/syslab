import { useEffect, useState } from 'react';
import type { VMContext } from './VMContainer';
import type { VMSharedData } from './VMTab';
import type { QuestionTests } from './objs/QuestionData';
import style from './styles/VMControlPanel.module.css';
import type { SpectMessagePacket } from 'vmspect/proto';

export type VMControlPanelData = {
  context: VMContext
  shared: VMSharedData
  tests: QuestionTests
  syncTrigger: () => void,
  checkTrigger: () => void,
  resetTrigger: () => void,
  selected: number
}

export type VMControlPanelOutcome = {
  name: string
  index: number
  activated: boolean
  passed: boolean
}

type ControlPanelTestText = { color: string, text: string } 

export const VMControlPanel = (props: VMControlPanelData) => {

  
  const tests = props.tests;
  const mappedTests = tests.commandTests.map((e, i) => {
      return {
        index: i,
        name: e.name,
        passed: false,
        activated: false
      };
    });

  const selected = props.selected;
  const [testResults, setTestResults] = useState(mappedTests);

  const [showTestsState, setShowTestsState] = useState(false);
  const [ testStateText, setTestStateText ] = useState<ControlPanelTestText>({ text: "", color: "" })

  useEffect(() => {
    setTestStateText({color: "#ffffff", text: ""})
    setTestResults(mappedTests)
  }, [selected])
  
  const checkTrigger = () => {
    setTestStateText({ color: "#fff600", text: "Running Tests"})
    props.checkTrigger();
  };

  const syncTrigger = props.syncTrigger;
  const scrollY = window.pageYOffset;
  const termSet = props.context.serial.terminal;
  const termLocation = termSet ? props.context.serial.terminal?.element?.getBoundingClientRect()! :
    { x: 0, y: 0, width: 0, height: 0 };

  props.shared.resultUpdate = (packet: SpectMessagePacket) => {

    let hasPassed = true;
    const data = packet.data;
    const compiled: Array<VMControlPanelOutcome> = [];
    
    for(let i = 0; i < data.length; i++) {
      compiled.push({
        name: data[i].name,
        passed: data[i].passed,
        index: i,
        activated: true,
        
      })
      hasPassed = hasPassed && data[i].passed;
    }

    if(hasPassed) {    
      setTestStateText({ color: "#76ff7a", text:
        "Task Complete"});
    }else{
      setTestStateText({ color: "#dc143c", text:
        "Task Incomplete - Review"});
    }
    setTestResults(compiled);
  };

  const viewTestsTrigger = () => {
    setShowTestsState(!showTestsState);
  }


  const stateOfTests = testResults.map((e, i) => {

    const outcomeStyle = !e.activated ? style.testNoEvent :
      e.passed ?
      style.testOutcomePass : style.testOutcomeFail;

    const resultBitStyle = !e.activated ? style.vmOutcomeNoEvent :
      e.passed ? style.vmOutcomePassed : style.vmOutcomeFailed;

    return (
      <div className={style.vmTestRow}>
        <div key={`tres-${i}`} className={outcomeStyle}>
          <span className={style.vmOutcomeName}>{e.name}</span >
          <span className={resultBitStyle}>{
            !e.activated ? "" :
              e.passed ? "Passed" : "Failed"}
          </span>
        </div>
      </div>
    )
  })

  const testsView = !showTestsState ? <></> :
    <div className={style.vmTests} style={{
      left: termLocation.x,
      top: termLocation.y + scrollY - 25,
      width: termLocation.width/3,
      height: termLocation.height/1.5,
    }}>
      <div className={style.testsHeader}>
        Test Outcomes
      </div>
      <div>
      {stateOfTests}
      </div>
    </div>;
  
  return (<>
    <span className={style.vmcontrolpanel}>
      <button className={style.vmpanelButton} onClick={checkTrigger}>
        Check
      </button>
      <button className={style.vmpanelButton} onClick={syncTrigger}>
        Sync
      </button>
      <span  className={style.vmpanelTextState} style={{color: testStateText.color}}>{testStateText.text}</span>
      <button className={style.vmpanelButtonPadded} onClick={viewTestsTrigger} style={{
          minWidth: 118 }}>
        { showTestsState ? "Hide Tests" : "Show Tests"}
      </button>
      {testsView}
    </span>
  </>
  )
}
