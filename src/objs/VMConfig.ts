

const VMBuilderVisualState = function<T=any>(
  vmConfigData: VMConfigData,
  nextState?: T | any) {

  if(nextState === undefined) {
    nextState = function(vmConfigData: VMConfigData) {
      return {
        finalize: function() {
          return vmConfigData;
        }
      }
    }
  }

  const autoStartObject = {
    autoStart: function() {
      vmConfigData.autoStart = true;
      return nextState(vmConfigData)
    },
    skip: function() {
      return nextState(vmConfigData)
    }
  }

  const networkObject = {
    useNetwork: function() {

      vmConfigData.useNetwork = true;
      return autoStartObject
    },
    disableNetwork: function() {
      vmConfigData.useNetwork = false;
      return autoStartObject;
    }
  }

  const consoleObject = {

    useConsole: function() {
      vmConfigData.useConsole = true;
      return networkObject;
    },
    disableConsole: function() {
      vmConfigData.useConsole = false;
      return networkObject;
    }
  }

  return {
    useScreen: function() {
      vmConfigData.useScreen = true;
      return consoleObject;
    },
    disableScreen: function() {
      vmConfigData.useScreen = false;
      return consoleObject;
    }
  }
}

const VMBuilderDetails = function<T=any, P=any>(vmConfigData: VMConfigData,
  nextState: T | any, postState?: P | any) {

  
  const cmdLineObject = {
    setCommandLine: function(cmdline: string) {
      vmConfigData.cmdline = cmdline;
      return nextState(vmConfigData, postState);
    },
    skip: function() {
      return nextState(vmConfigData, postState);
    }
  }

  const initialStateObject = {
    initialState: function(stateUrl: string) {
      vmConfigData.initialState = stateUrl;
      return cmdLineObject;
    },
    skip: function() {
      return cmdLineObject;
    }
  }


  const baseFsObject = {
    baseFS: function(baseFs: string) {
      vmConfigData.basefs = baseFs;
      return initialStateObject;
    }
  }

  const baseUrlObject = {
    baseURL: function(baseUrl: string) {
      vmConfigData.baseurl = baseUrl;
      return baseFsObject
    }
  }

  const vgaMemoryObject = {
    
    vgaMemory: function(sizeMB: number) {
      vmConfigData.vgaMemorySize = sizeMB * 1024 * 1024;
      return baseUrlObject
    },
    skip: function() {
      return baseUrlObject
    }  
    
  }

  return {
    memory: function(sizeMB: number) {
      vmConfigData.memorysize = sizeMB * 1024 * 1024;
      return vgaMemoryObject;
    },
    skip: function() {
      return vgaMemoryObject
    }
  }
  
}


const VMConfigBuilderStart = {
  start: function() {
    const vmConfigData = VMConfiguration.DefaultConfig();

    return {
      title: function(title: string) {
        vmConfigData.name = title;
        return {
          description: function(description: string) {
            vmConfigData.description = description;
            return VMBuilderDetails(vmConfigData, VMBuilderVisualState);
          }
        }
      }
    }    
  }
}
const VMConfigBuilderControl = {
  with: function<T=any>(postState: T | any) {
    const vmConfigData = VMConfiguration.DefaultConfig();

    return {
      title: function(title: string) {
        vmConfigData.name = title;
        return {
          description: function(description: string) {
            vmConfigData.description = description;
            return VMBuilderDetails(vmConfigData, VMBuilderVisualState,
                postState);
          }
        }
      }
    }    
  }
}



// VM Config Data
export type VMConfigData = {

  //VM Configuration
  name: string,
  description: string,
  memorysize: number,
  vgaMemorySize: number,
  baseurl: string,
  basefs: string,
  initialState: string | null,
  cmdline: string,
  

  //BIOS
  bios: string,
  vgaBios: string,

  // Visual Configuration
  useScreen: boolean,
  useConsole: boolean,
  useNetwork: boolean,

  //Init Config
  autoStart: boolean,
  
}



export class VMConfiguration {

  configData: VMConfigData = VMConfiguration.DefaultConfig();

  constructor(configData: VMConfigData) {
    this.configData = configData;
  }


  /**
   * Meant to be used with
   */
  static AssembleWith<T>(endFunc: T | any) {
    return VMConfigBuilderControl.with(endFunc);
  }

  /**
   * Creates the assembly object for it to assemble a VM image
   * This will be in use with another object
   */
  static Assembly() {
    return VMConfigBuilderStart.start();
  }

  /**
   * Default Configuration for the VM
   */
  static DefaultConfig(): VMConfigData {
    return {
      name: 'untitled-vm',
      description: 'untitled-vm - no description',
      memorysize: 512 * 1024 * 1024,
      vgaMemorySize: 8 * 1024 * 1024,
      baseurl: '/',
      basefs: '/fs.json',
      initialState: null,
      cmdline: '',


      bios: '/seabios.bin',
      vgaBios: '/vgabios.bin',

      useScreen: false,
      useConsole: true,
      useNetwork: false,

      autoStart: false,
    }
  }

  /**
   * Enables the console
   */
  isConsoleEnabled() {
    return this.configData.useConsole;
  }

  /**
   * Enables the display
   */
  isDisplayEnabled() {
    return this.configData.useScreen
  }

  /**
   * Enables the network
   */
  isNetworkEnabled() {
    return this.configData.useNetwork;
  }

  /**
   * Gets the base URL where the images and flat files are
   */
  getBaseURL() {
    return this.configData.baseurl;
  }

  /**
   * Gets the JSON object that represents the filesystem
   */
  getFilesystem() {
    return this.configData.basefs;
  }

  getVGABios() {
    return this.configData.vgaBios;
  }
  
  
  getBIOS() {
    return this.configData.bios;
  }

  getInitialState() {
    return this.configData.initialState;
  }
  
}
