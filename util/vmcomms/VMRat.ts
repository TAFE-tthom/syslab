import { WebSocketServer, WebSocket } from 'ws';
import {
  Protocol,
  MessageProtocol,
  MessageFn
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
 * 
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
  const results = [];
  //TODO: Trigger the evaluateion here
  return results;
}

const ServerHandlers = (() => {
  const msgHandler: Map<string, MessageFn<any>> = new Map();
  const funcSet: Array<[string, MessageFn<any>]> = [
    [Protocol.Connection, (sock: WebSocket) => {

      const idx = ServerData.idx;
      ServerData.idx += 1;
      ServerData.connections.set(idx, sock);

      sock.on(Protocol.Error, (_data) => {
        ServerData.connections.delete(idx);
      });
      
      sock.on(Protocol.Close, (_data) => {
        ServerData.connections.delete(idx);
      });
      
      sock.on(Protocol.Message, (data: any) => {
        const obj = ProcessMessage(data);
        const messageKind = obj.kind;
        const handle = MessageHandlers.get(messageKind);
        
        if(handle) {
          handle(obj);
        }
      });
      
    }],
    [Protocol.Error, (_data: WebSocket) => {
      console.error("Unable to process connection, error occurred");
    }],
    [Protocol.Close, (_data: WebSocket) => {
      console.log("Have closed the server socket");
    }],
   ];
  
  for(const pair of funcSet) {
    msgHandler.set(pair[0], pair[1]);
  }

  return msgHandler;
})();

const MessageHandlers = (() => {

  const msgHandler: Map<string, MessageFn<any>>
    = new Map();
  const funcSet: Array<[string, MessageFn<any>]> = [
    [MessageProtocol.HostNotify, (data) => {
      EnlistIfHost(data, data.ws);
      SendMessage({
          message: MessageProtocol.HostNotify,
          confirm: true
        },
        data.ws);

    }],
    [MessageProtocol.MachineReset , (data) => {
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
    [MessageProtocol.MachineSnapshot , (data) => {
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
    [MessageProtocol.MachineRestore, (data) => {
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
    [MessageProtocol.TaskEvaluate, (data) => {
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
    [MessageProtocol.TaskLoad, (data) => {
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
    [MessageProtocol.TaskProgress, (data) => {
      
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
    [MessageProtocol.TaskReset, (data) => {
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


const WebServerSocketInitialisation = () => {
  const protocolHandlers = ServerHandlers;
  
  const server = new WebSocketServer({ port: 9011 });

  for(const handle of protocolHandlers.entries()) {
    const handleKey = handle[0];
    const handleFn = handle[1];
    server.on(handleKey, handleFn);
  }
  
  return server;
};


const _server = WebServerSocketInitialisation();

