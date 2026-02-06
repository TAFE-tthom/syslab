import type { QuestionData } from '../objs/QuestionData';
import { VMConfiguration } from '../objs/VMConfig.ts'

// const question1 =`
// ## Git Activity 1 - Clone, Change and Push

// Within this activity we are going to through a typical activity of cloning a repository, making some changes and pushing it back to the original repository.

// 1. Clone from root@gitworkshop:/srv/workship

// `;


const fsquestion1 = `
## SysLab - Test Activity

As part of getting familiar with the filesystem and the command line, you will need to use the following commands.

* \`mkdir\` - Used to make a directory

* \`cd\` - Used to change your current directory

* \`pwd\` - Print working directory

For this, create a directory called **MyFolder**, make sure you then change your current directory to **MyFolder**.

- Feedback And Marking Panel will be introduced later -

`;

const gitquestion1 = `
## Git Activity - 1

Within this activity we are going to through a typical activity of cloning a repository, making some changes and pushing it back to the original repository.

1. Clone from git@gitworkshop:/srv/workshop-demo

Use \`git clone\` for this task.


2. Afterwards, you will need to resolve the following task.

* You will need to create a new file called \`AddFile.md\` in which you should write a few sentences on what you need to do to add new file to the repository, commit and push it. This file must be called \`WORKSHOP.md\`, you will need to write inside \`New File To Add.\` inside it. Use \`echo "New File To Add" > WORKSHOP.md\` to create the file without a text editor. Make sure this is added to your repository using \`git add\`.

* Afterwards you should modify \`AUTHOR.md\`, where it outlines \`<AUTHOR NAME>\`, you should put your name there and add it to staging.

* It looks like someone left a backup file here under the name \`AUTHOR.bak.md\`, please remove this file from the repository.

3. After making those changes, make sure you create a commit with these changes and push it to the original repository.

To check to see if you have performed the task correctly. Please run \`taskeval\` or press the **Check** button.


Outcome:

* You understand how to clone a directory
* You understand how to add, delete and change a file in the command line
* You understand how to add changes to staging
* You understand how to commit the changes
* You understand how to push the changes over to the original repository

`;


const gitquestion2 = `
## Git Activity - 2

Within this activity we are going to create our own git repository using \`git init\` and attach a remote to it using \`git remote\`. 

1. Create a folder in your user's home directory called \`workshop\`. This needs to be created in your user's home directory (\`/root\`). This folder will be used as your local repository.

2. Make sure you change your current working directory to the newly created \`workshop\` directory. You will need to initialise a git repository by using \`git init\`.

3. Inside the \`workshop\` directory, create a textfile called \`README.md\`, this file should contain  \`This is a new file\`. Afterwards, this file should be added and comitted to the repository.

4. You will need to add the remote repository \`git@gitworkshop:/srv/workshop\`. Use the \`git remote add\` subcommands. The two arguments you will need to provide is the name of the origin you want to give it and the url.

As per convention, use \`origin\` and \`git@gitworkshop:/srv/workshop\`.

5. Afterwards, you should be able to push the changes to the remote repository. Use \`git push -u origin main\`.

To check to see if you have performed the task correctly. Please run \`taskeval\` or press the **Check** button.

Outcome:

* You understand how to initialise a git repository
* You understand and reinforce your understanding of creating, adding and commiting files
* You understand how to attach a remote repository to your local repository
* You understand that you can push the commits to the remote repository specified
* You can use a terminal text editor (vi, nano or ne) to create a text file
`



export const SampleQuestionsData: Array<QuestionData> = [
  {
    name: "Command Line - 1",
    question: fsquestion1,
    vms: [
      VMConfiguration.DefaultConfig()
    ],
    tests: {
      commandTests: [
        {
          name: 'mkdir',
          command: 'ls /root | grep "Projects"',
          expected: 'Projects\n',
          invert: false,
          failmessage: 'You have not created the folder'
        }
      ]
    }
  },
  {
    name: "Git Activity - 1",
    question: gitquestion1,
    vms: [
      VMConfiguration.DefaultConfig()
    ],
    tests: {
      commandTests: [
        {
          name: '',
          command: '',
          expected: '',
          invert: false,
          failmessage: ''
        }
      ]
    }
  },
  {
    name: "Git Activity - 2",
    question: gitquestion2,
    vms: [
      VMConfiguration.DefaultConfig()
    ],
    tests: {
      commandTests: [
        {
          name: '',
          command: '',
          expected: '',
          invert: false,
          failmessage: ''
        }
      ]
    }
  },
];
