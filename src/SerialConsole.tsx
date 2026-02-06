
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef } from "react"

import style from './styles/SysLabConsole.module.css';
import "@xterm/xterm/css/xterm.css";

/**
 * SerialConsoleContext
 * Terminal reference and will be updated when necessary 
 */
export type SerialConsoleContext = {
  terminal: Terminal | null
}

/**
 * SerialConsoleProps
 * Should have a ref to the context and update capabilities
 */
export type SerialConsoleProps = {
  context: SerialConsoleContext
  updateContext: (term: Terminal) => void
}


/**
 * SerialConsole that will be on the bottom segment of the task
 * Will be useful for when you want to keep the task in version but
 * focus on the task at hand.
 */
export const SerialConsole = (props: SerialConsoleProps) => {

  // const [fitAddon, _setFitAddon] = useState(new FitAddon());
  const termRef = useRef(new Terminal());
  const consoleRef = useRef<HTMLDivElement>(null);
  const context = props.context;


  useEffect(() => {

    const conref = consoleRef.current;

    if(conref) {

      if(!context.terminal) {
        const terminal = termRef.current;
        const fitAddon = new FitAddon();
        context.terminal = terminal;
        
        terminal.loadAddon(fitAddon);
        terminal.open(conref)
        
        fitAddon.fit();
      } else {
        termRef.current.reset();
        termRef.current.refresh(0, 40);
      }
    } else {
    }
  }, [props]);
  

  return (
    <div ref={consoleRef} id={"terminal"} className={style.syslabConsole}>
    </div>
  );
}
