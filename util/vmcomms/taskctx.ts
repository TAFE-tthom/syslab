
import process from 'node:process';
import net, { Socket } from 'node:net';
import {
  MessageProtocol,
  PORT,
  TCPProtocol
} from './Protocol';

const HOST = 'localhost';


const MessagePackage = (message: string) => {
  return JSON.stringify({
    kind: message
  })
}

const ProgramProcess = () => {
  let client: Socket | null = null;
  let dataRecv = false;
  if(process.argv.length < 3) {
    console.log("Missing request argument");
  } else {
    const arg = process.argv[2];

    client = new net.Socket();
    const clientRef = client;
    
    client.connect(PORT, HOST, () => {
      clientRef.write(MessagePackage(arg))

    })

    client.on(TCPProtocol.Data, (data) => {

      if(data.kind === MessageProtocol.TaskEvaluate) {
        const results = data.results;
        for(const r of results) {
          const { name, outcome } = r;
          console.log(`${name} - [${outcome ? "PASS" : "FAILED"}]`);
        }
        
      } else {
        // Process the others later
      }
      dataRecv = true;
      clientRef.destroy();
    });

    
    client.on(TCPProtocol.Close, (data) => {
      if(!dataRecv) {
        console.log("Connection terminated, no data recevied");
      }
    });
    
  }

  return client
}


ProgramProcess();



