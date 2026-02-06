import type { VMConfigData } from '../objs/VMConfig';

/**
 * CommandTest
 * Name is just used to provide a brief description of it
 * Given a command that will execute, we will then check against the expected
 * If the result of the command's output matches the expected string
 *   It then depends if the invert field is set to true or false.
 *     if false, it simply needs to match the expected
 *     if true, it will fail the test if the command output matches the expected
 * If a failure occurs, the `failmessage` is printed
 */
export type CommandTest = {
  name: string
  command: string
  expected: string
  invert: boolean
  failmessage: string
}


/**
 * Will be a list of command tests that can be triggered
 */
export type QuestionTests = {
  commandTests: Array<CommandTest>
}


/**
 * Question data
 */
export type QuestionData = {
  name: string,
  question: string,
  vms: Array<VMConfigData>
  tests: QuestionTests
}

