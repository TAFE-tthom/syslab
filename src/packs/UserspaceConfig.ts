



export const UserConfigBuilder = function<T=any>(configData: UserspaceConfigData,
  nextStage: T|any) {


  const configChoice = function() {
    const cdata = configData;
    
    return {
      addFile,
      addUser,
      next: function() {
        nextStage(cdata);
      }
    }
    
  }


  const addFile = function(path: string) {
    const file = {
      path,
      contents: ''
    }
    return {
      contents: function(contents: string) {
        file.contents = contents;
        configData.files.push(file);
        return configChoice;
      }
      
    }
  }

  const addUser = function(username: string) {
    const user = {
      username,
      password: '',
    }
    return {
      password: function(pw: string) {
        user.password = pw;
        configData.users.push(user);
        return configChoice;
      }
    }    
  }

  return configChoice;

}


export type UserData = {
  username: string,
  password: string,
}


export type FileInformation = {
  path: string,
  contents: string
}

export type UserspaceConfigData = {
  users: Array<UserData>,
  files: Array<FileInformation>
}


export class UserspaceConfig {

  userspaceData: UserspaceConfigData

  constructor(spaceData: UserspaceConfigData) {
    this.userspaceData = spaceData;
  }

  static AssembleWith<T=any>(nextStage: T | any) {
    const userspaceData = {
      users: [],
      files: []
    };    
    return UserConfigBuilder(userspaceData, nextStage);
  }

  
  
}
