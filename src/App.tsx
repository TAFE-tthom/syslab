import { SysLabTopBar } from './SysLabTopBar';
import { SampleQuestionsData } from './packs/SampleQuestions';
import style from "./styles/SysLabContext.module.css";
import "./App.css";
import { SysLabContainer } from './SysLabContainer';


/**
 * App
 * Loads the canvas container that will be loaded
 * Will be switched to a console container
 */
// export const App = () => {

//   const [vmctx, _setVMContext] = useState({
//     emulator: null,
//     serial: {
//       terminal: null
//     },
//     datamap: {
//       serialmap: { enabled: true },
//       buffers: {
//         combuffer: ''
//       },
//     }
//   } as VMContext)

//   return (
//     <>
//       <VMConsoleContainer context={vmctx} />
//     </>
//   )
// }

export const App = () => {

  const exercises = SampleQuestionsData;
  // const [currentQuestion, _setCurrentQuestion] = useState(0);

  // const questionData = exercises[currentQuestion];
  // const vmData = questionData.vms;
  
  return (
    <div className={style.syslabStack}>
      <SysLabTopBar />
      <SysLabContainer exercises={exercises} />
    </div>
  )
}

export default App;
