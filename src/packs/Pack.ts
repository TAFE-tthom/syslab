import { TaskConfig, TaskConfigData } from './TaskConfig';
import { UserspaceConfig, UserspaceConfigData } from './UserspaceConfig';
import { VMConfigData, VMConfiguration } from './VMConfig'; 


export type TaskConstructorArgs = {
  taskConfig: TaskConfig;
  userspaceConfig: UserspaceConfig;
  vmConfig: VMConfiguration;
}

export type TaskConstructorDataArgs = {
  taskConfig: TaskConfigData;
  userspaceConfig: UserspaceConfigData;
  vmConfig: VMConfigData;
}

export class TaskPack {

  taskConfig: TaskConfig;
  userspaceConfig: UserspaceConfig;
  vmConfig: VMConfiguration;

  constructor({ taskConfig, userspaceConfig, vmConfig }: TaskConstructorArgs) {
    this.taskConfig = taskConfig;
    this.userspaceConfig = userspaceConfig;
    this.vmConfig = vmConfig;
  }

  static Build() {


    const constArgs: TaskConstructorDataArgs = {
      
      taskConfig: {} as any,
      userspaceConfig: {} as any,
      vmConfig: {} as any,
    }

    const construct = function(vmconfig: VMConfigData) {
      constArgs.vmConfig = vmconfig;

      
      
      const finalInst = new TaskPack(
        {
          taskConfig: new TaskConfig(constArgs.taskConfig),
          userspaceConfig: new UserspaceConfig(constArgs.userspaceConfig),
          vmConfig: new VMConfiguration(constArgs.vmConfig)
        }
      );
      return finalInst;
    }
    
    const userspaceConfigBuild = function(taskConfigData: TaskConfigData) {
      constArgs.taskConfig = taskConfigData;

      return UserspaceConfig.AssembleWith(vmconfigBuild);
    }

    const vmconfigBuild = function(userspaceConfig: UserspaceConfigData) {
      constArgs.userspaceConfig = userspaceConfig;
      
      return VMConfiguration.AssembleWith(construct);
    }

    const taskConfigBuild = function() {
      // Start it
      return TaskConfig.Assembly(userspaceConfigBuild);
    }



    return taskConfigBuild();
  }


  getTaskConfig() {
    return this.taskConfig;
  }


  getUserspaceConfig() {
    return this.userspaceConfig;
  }


  getVMConfig() {
    return this.vmConfig;
  }
  
}
