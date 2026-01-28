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

// const cheatsheet = `
// ## Terminal Playground

// This is a terminal playground for anyone to learn command line and linux.


// `;

// const question2 =`
// ## Git Activity 2 - Init, Remote, Change and Push

// `;

// const question3 =`
// ## Question 3

// `;


export const SampleQuestionsData: Array<QuestionData> = [
  {
    name: "Test Activity - 1",
    question: fsquestion1,
    vms: [
      VMConfiguration.DefaultConfig()
    ]
  },
  // {
  //   name: "Git Activity - 2",
  //   question: question2,
  //   vms: [
      
  //   ]
  // },
  // {
  //   name: "Git Activity - 3",
  //   question: question3,
  //   vms: [
      
  //   ]
  // }
];
