
import type { VMConfigData } from '../objs/VMConfig';

export type QuestionData = {
  name: string,
  question: string,
  vms: Array<VMConfigData>
}
