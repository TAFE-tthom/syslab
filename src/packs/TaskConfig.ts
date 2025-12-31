


export type TaskCommandEvaluation = {
  command: string,
  expected: string,
}


export type TaskWatcherEvaluation = {
  file: string,
  expected: string,
  extra: Array<any>
}


export type TaskShellHookEvaluation = {
  command: string,
  expected: string,
  hookCheck: string
}


export type TaskBufferEvaluationFilter = (bufferData: string) => string

export type TaskBufferEvaluationFn = (bufferData: string, expected: string) => boolean;

export type TaskBufferEvaluation = {
  expected: string,
  filters: Array<TaskBufferEvaluationFilter>
  evaluationFn: TaskBufferEvaluationFn
}


export type TaskEvaluations = {

  // When the user triggers `evalTests`, all three are evaluated
  evalTests: Array<TaskCommandEvaluation>,
  bufferTests: Array<TaskBufferEvaluation>,

  // TODO: Later on, when I can integrate fsnotify and others
  watcherTests: Array<TaskWatcherEvaluation>,
  shellTests: Array<TaskShellHookEvaluation>,

}


export type TaskConfigData = {
  name: string,
  key: string,
  question: string,
  evaluations: TaskEvaluations
}

const TaskConfigBuilderEvals = <T>(configData: TaskConfigData, nextStage: T | any) => {

  // Objects to build

  let bufferTest = {
    expected: '',
    filters: [] as Array<TaskBufferEvaluationFilter>,
    evaluationFn: (() => {}) as any
  }

  const addFilter = (filter: TaskBufferEvaluationFilter) => {

    bufferTest.filters.push(filter);

    return {
      addFilter,
      setEvaluation: function(evalfn: TaskBufferEvaluationFn) {
        bufferTest.evaluationFn = evalfn;
        return commandEvalObject;
      }
      
    }
  }

  // Decision Makers
  const commandEvalObject = {
    // Add Command Test
    addCommandTest: function() {
      const commandTest = {
        command: '',
        expected: '',
      };
      configData.evaluations.evalTests.push(commandTest);
  
      return {
        setCommand: function(cmd: string) {
          commandTest.command = cmd;
          
          return {
            setExpected: function(expected: string) {
              commandTest.expected = expected;
              return commandEvalObject;  
            }
            
          }
        }
      }
    },
    // Add Buffer Test
    addBufferTest: function() {
      //Reset it
      bufferTest = {
        expected: '',
        filters: [] as Array<TaskBufferEvaluationFilter>,
        evaluationFn: (() => {}) as any
      }

      configData.evaluations.bufferTests.push(bufferTest);

      return {
        addFilter: addFilter,
        setExpected: function(expected: string) {
          bufferTest.expected = expected;
          return commandEvalObject
        }
        
      }
    },
    next: function() {
      return {
        userspace: function() {
          return nextStage(configData);
        }
      }
      
    }
  };

  // const bufferEvalObject = {
    
  // }

  // const watcherEvalObject = {
    
  // }

  // const shellEvalObject = {
    
  // }

  return commandEvalObject;
}


const TaskConfigBuilder = {
  start: function<T=any>(configData: TaskConfigData, nextStage: T | any) {
    return {
      title: function(title: string) {
        configData.name = title;
        return {
          key: function(key: string) {
            configData.key = key;
            return {
              question: function(details: string) {
                configData.question = details;
                return TaskConfigBuilderEvals(configData, nextStage);
              },
              fromFile: function(_path: string) {
                //TODO: Not implemented yet
                return TaskConfigBuilderEvals(configData, nextStage);
              }
            }
          }
        }
      }
    }
  }
}


export class TaskConfig {

  configData: TaskConfigData;

  constructor(configData: TaskConfigData) {
    this.configData = configData;
  }

  static Assembly<T=any>(withStage?: (taskConfigData: TaskConfigData) => T | any) {
    
    const configData = {
      name: '',
      key: '',
      question: '',
      evaluations: {
        evalTests: [],
        bufferTests: [],
        watcherTests: [],
        shellTests: []
      }
    };


    return TaskConfigBuilder.start(configData, withStage);
  }

  getName() {
    return this.configData.name;
  }


  getKey() {
    return this.configData.key;
  }

  getQuestion() {
    return this.configData.question;
  }

  getEvaluations() {
    return this.configData.evaluations;
  }
}
