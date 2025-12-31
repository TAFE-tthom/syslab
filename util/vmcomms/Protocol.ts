
export const PORT = 9011;

export type TaskBufferEvaluationFilter = (bufferData: string) => string

export type TaskBufferEvaluationFn =
  (bufferData: string, expected: string) => boolean;


export type TaskEvaluateResults = {
   results: Array<{
     name: string,
     diff: string
     outcome: boolean
   }>
}

export type TaskBufferEvaluation = {
  expected: string,
  filters: Array<TaskBufferEvaluationFilter>
  evaluationFn: TaskBufferEvaluationFn
}

export type TaskCommandEvaluation = {
  command: string,
  expected: string,
}

export type TaskData = {
  name: string,
  key: string,
  question: string,
  evaluations: {
    evalTests: Array<TaskCommandEvaluation>,
    bufferTests: Array<TaskBufferEvaluation>
  }
}

export type MessageFn<T> = (data: T) => void;

export type EmulatorMessageFn<T> = (data: T,
    emulator: any, connection: any) => void

export const Protocol = {
  Connection: 'connection',
  Error: 'error',
  Pong: 'pong',
  Ping: 'ping',
  Open: 'open',
  Close: 'close',
  Message: 'message',
};

export const TCPProtocol = {
  Data: 'data',
  End: 'end',
  Error: 'error',
  Connection: 'connection',
  Close: 'close'
}


export const MessageProtocol = {
  HostNotify: "host_notify",
  MachineReset: "machine_reset",
  MachineSnapshot: "machine_snapshot",
  MachineRestore: "machine_response",
  TaskEvaluate: "task_evaluate",
  TaskProgress: "task_progress",
  TaskLoad: "task_load",
  TaskReset: "task_reset"
};


export const EmulatorNetworkProtocol = {
  Connect: 'connect',
  Data: 'data',
  Close: 'close',
  Shutdown: 'shutdown'
}

