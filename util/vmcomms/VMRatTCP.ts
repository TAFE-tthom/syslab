import net, { Socket } from 'node:net';
import {
  TCPProtocol,
  MessageProtocol,
  MessageFn,
  PORT,
  TaskEvaluateResults
} from './Protocol';


const ServerData = {
  taskData: {
    name: '',
    key: '',
    question: '',
    evaluations: {
      bufferTests: [],
      evalTests: []
    }
  },
  idx: 1,
  connections: new Map(),
  hostKey: 0,
};

/**
 * When processing it, it should have the following data
 * Creating a TCP Server
 */
const ProcessMessage = (data: string) => {
  const obj = JSON.parse(data);
  return obj;
}


const SendMessage = (obj: any, ws: WebSocket) => {
  const serObj = JSON.stringify(obj);
  ws.send(serObj);
};


const EnlistIfHost = (obj: any, _ws: WebSocket) => {
  const idx = obj.idx;
  ServerData.hostKey = idx;
}


const TaskEvaluate = () => {
  const taskRes: TaskEvaluateResults = { results: [] };
  //TODO: Trigger the evaluateion here
  return taskRes;
}

const SocketHandleSetup: () => [string, (sock: Socket) => void] = (() => {

  const handle: [string, (sock: Socket) => void] =
    [TCPProtocol.Connection, (sock: Socket) => {
      const idx = ServerData.idx;
      ServerData.idx += 1;
      ServerData.connections.set(idx, sock);

      
      sock.on(TCPProtocol.Data, (data: any) => {
        const obj = ProcessMessage(data);
        const messageKind = obj.kind;
        const handle = MessageHandlers.get(messageKind);
        
        if(handle) {
          handle(obj);
        }
      });
      
      sock.on(TCPProtocol.Error, (_data) => {
        ServerData.connections.delete(idx);
      });
      
      sock.on(TCPProtocol.End, (_data) => {
        ServerData.connections.delete(idx);
      });
  }];
  
  return handle;
});

const MessageHandlers = (() => {

  const msgHandler: Map<string, MessageFn<any>>
    = new Map();
  const funcSet: Array<[string, MessageFn<any>]> = [
    [MessageProtocol.HostNotify, (data: any) => {
      EnlistIfHost(data, data.ws);
      SendMessage({
          message: MessageProtocol.HostNotify,
          confirm: true
        },
        data.ws);

    }],
    [MessageProtocol.MachineReset , (data: any) => {
      // When requested by a peer, it will send it to
      // the host
      
      const hostIdx = data.hostKey;
      const hostWebSocket = data.connections.get(hostIdx);
      const webSocket = data.ws;
      SendMessage({
          message: MessageProtocol.MachineReset,
          confirm: true
        },
        webSocket);
      if(hostWebSocket) {
        SendMessage({
            message: MessageProtocol.MachineReset,            
          },
          hostWebSocket);
        
      }
      
    }],
    [MessageProtocol.MachineSnapshot , (data: any) => {
      // Tells the host to make a snapshot
      const webSocket = data.ws;
      const hostIdx = data.hostKey;
      const hostWebSocket = data.connections.get(hostIdx);
      SendMessage({
          message: MessageProtocol.MachineSnapshot,
          confirm: true
        },
        webSocket);
      if(hostWebSocket) {
        SendMessage({
            message: MessageProtocol.MachineSnapshot,
          },
          hostWebSocket);
        
      }
      
    }],
    [MessageProtocol.MachineRestore, (data: any) => {
      // Tells the host to restore to a particular point
      const restoreIdx = data.restoreIdx;
      const webSocket = data.ws;
      const hostIdx = data.hostKey;
      const hostWebSocket = data.connections.get(hostIdx);
      SendMessage({
          message: MessageProtocol.MachineRestore,
          confirm: true
        },
        webSocket);
      
      if(hostWebSocket) {
        SendMessage({
            message: MessageProtocol.MachineRestore,
            restorePoint: restoreIdx
          },
          hostWebSocket);
        
      }
      
    }],
    [MessageProtocol.TaskEvaluate, (data: any) => {
      //
      // Triggers evaluation
      // Does local work
      //
      const results = TaskEvaluate();
      const hostIdx = data.hostKey;
      const hostWebSocket = data.connections.get(hostIdx);
      const webSocket = data.ws;
      SendMessage({
          message: MessageProtocol.TaskEvaluate,
          results,
          confirm: true
        },
        webSocket);
      
      if(hostWebSocket) {
        SendMessage({
            message: MessageProtocol.TaskProgress,
            results
          },
          hostWebSocket);
      }
    }],
    [MessageProtocol.TaskLoad, (data: any) => {
      //
      // Will have been received from the host
      // 
      const webSocket = data.ws;
      const taskData = data.taskData;
      ServerData.taskData = taskData;
      
      SendMessage({
          message: MessageProtocol.TaskLoad,
          confirm: true
        },
        webSocket);
    }],
    [MessageProtocol.TaskProgress, (data: any) => {
      
      const webSocket = data.ws;
      const hostIdx = data.hostKey;
      const hostWebSocket = data.connections.get(hostIdx);
      SendMessage({
          message: MessageProtocol.TaskProgress,
          confirm: true
        },
        webSocket);

      if(hostWebSocket) {
        SendMessage({
            message: MessageProtocol.TaskProgress,
            confirm: true
          },
          hostWebSocket);
        
      }
    }],
    [MessageProtocol.TaskReset, (data: any) => {
      const webSocket = data.ws;
      const hostIdx = data.hostKey;
      const hostWebSocket = data.connections.get(hostIdx);
      
      SendMessage({
          message: MessageProtocol.TaskReset,
          confirm: true
        },
        webSocket);

      if(hostWebSocket) {
        SendMessage({
            message: MessageProtocol.TaskReset,
            confirm: true
          },
          hostWebSocket);
        
      }
    }],
   ];
  
  for(const pair of funcSet) {
    msgHandler.set(pair[0], pair[1]);
  }
  
  return msgHandler;
})(); 


const TCPServerSocketInitialisation = () => {

  const server = net.createServer((socket) => {
    const [_kind, handler] = SocketHandleSetup();
    handler(socket);

  });
  return server;
};


const server = TCPServerSocketInitialisation();
console.log("Starting up the server");
server.listen(PORT, () => {
  console.log("VMRat - TCP Server has started and waiting for messages");
});



