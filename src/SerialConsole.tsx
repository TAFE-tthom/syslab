
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef, useState } from "react"

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

  const [fitAddon, _setFitAddon] = useState(new FitAddon());
  const consoleRef = useRef(null);
  const context = props.context;


  useEffect(() => {

    const conref = consoleRef.current;

    if(conref) {
      const term = new Terminal();
      term.loadAddon(fitAddon);

      context.terminal = term;
      
      term.open(conref);
      fitAddon.fit();
      term.writeln("Press Enter To Prompt VM")
    }
  }, [props]);
  

  return (
    <div ref={consoleRef} id={"terminal"} className={style.syslabConsole}>
    </div>
  );
}
