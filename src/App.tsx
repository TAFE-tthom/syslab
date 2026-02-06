import { SysLabTopBar } from './SysLabTopBar';
import { SampleQuestionsData } from './packs/SampleQuestions';
import style from "./styles/SysLabContext.module.css";
import "./App.css";
import { SysLabContainer } from './SysLabContainer';

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
