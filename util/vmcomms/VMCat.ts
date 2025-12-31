import {
  EmulatorNetworkProtocol,
  MessageProtocol,
  EmulatorMessageFn,
  PORT
} from './Protocol';


export type EmulatorType = any;

export type EmulatorNetworkReceiveHandler = {
  handlers: Map<string, EmulatorMessageFn<any>>
}

export type EmulatorNetworkSenderHandler = {
  handlers: Map<string, EmulatorMessageFn<any>>
}

export type EmulatorNetworkData = {
  connection: any
  connectionSet(): boolean,
  receiveHandler: EmulatorNetworkReceiveHandler,
  senderHandler: EmulatorNetworkSenderHandler
}


export const EmulatorDefaultSendHandlers = {
  handlers: new Map<string, EmulatorMessageFn<any>>(
    [
      //Set the handlers here
      [MessageProtocol.MachineReset,
        (data, emulator, connection) => {
          // Resets the machine
        }
      ],
      [MessageProtocol.MachineSnapshot,
        (data, emulator, connection) => {
          // Takes a snapshot of the machine
        }
      ],
      [MessageProtocol.MachineRestore,
        (data, emulator, connection) => {
          // Should restore the machine to a snapshot point
          
        }
      ],
      [MessageProtocol.TaskEvaluate,
        (data, emulator, connection) => {
          // Get the results from task evaluate

        }
      ],
      [MessageProtocol.TaskProgress,
        (data, emulator, connection) => {
          // Task Progress

        }
      ],
      [MessageProtocol.TaskLoad,
        (data, emulator, connection) => {
          // Confirmation
          
        }
      ],
      [MessageProtocol.TaskReset,
        (data, emulator, connection) => {
          // Should do a machine reset or machine restore
          
        }
      ],
    ]
  )
}

export const EmulatorDefaultRecvHandlers = {
  handlers: new Map<string, EmulatorMessageFn<any>>(
    [
      //Set the handlers here
      [MessageProtocol.MachineReset,
        (data, emulator, connection) => {
          // Resets the machine
        }
      ],
      [MessageProtocol.MachineSnapshot,
        (data, emulator, connection) => {
          // Takes a snapshot of the machine
        }
      ],
      [MessageProtocol.MachineRestore,
        (data, emulator, connection) => {
          // Should restore the machine to a snapshot point
          
        }
      ],
      [MessageProtocol.TaskEvaluate,
        (data, emulator, connection) => {
          // Get the results from task evaluate

        }
      ],
      [MessageProtocol.TaskProgress,
        (data, emulator, connection) => {
          // Task Progress

        }
      ],
      [MessageProtocol.TaskLoad,
        (data, emulator, connection) => {
          // Confirmation
          
        }
      ],
      [MessageProtocol.TaskReset,
        (data, emulator, connection) => {
          // Should do a machine reset or machine restore
          
        }
      ],
    ]
  )
}


export const EmulatorNetworkContext: EmulatorNetworkData = {
  connection: null,
  connectionSet: () => {
    return EmulatorNetworkContext.connection !== null;
  },
  receiveHandler: EmulatorDefaultRecvHandlers,
  senderHandler: EmulatorDefaultSendHandlers
}


export const EmulatorSend = (data: string) => {
  if(EmulatorNetworkContext.connectionSet()) {
    EmulatorNetworkContext.connection.write(data);
  } else {
    console.warn("Not connection has been established");
  }
}



export const EmulatorConnect = async (emulator: EmulatorType) => {


  const networkAdapter = emulator.network_adapter;

  const openReq = await networkAdapter.tcp_probe(PORT);
  if(openReq) {
  
  
    EmulatorNetworkContext.connection =
      networkAdapter.connect(PORT);

    const connection = EmulatorNetworkContext.connection;
     
    connection.on(EmulatorNetworkProtocol.Connect, () => {
      //Do something?      
    })
    connection.on(EmulatorNetworkProtocol.Data, (data: any) => {
      
    })
    connection.on(EmulatorNetworkProtocol.Close, () => {
      
    })
    connection.on(EmulatorNetworkProtocol.Shutdown, () => {
      
    })
  }
}
