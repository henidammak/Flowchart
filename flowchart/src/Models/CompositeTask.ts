// import { Pipeline } from "./Pipeline";

// export class CompositeTask implements Pipeline {
//     id: string;
//     private tasks: Pipeline[];

//     constructor(id: string, tasks: Pipeline[] = []) {
//         this.id = id;
//         this.tasks = tasks;
//     }

// }


import { Sleep_Task } from "./Sleep_Task";
import { Start_Task } from "./Start_Task";
import { End_Task } from "./End_Task";
import { Pipeline } from "./Pipeline";
import { CmdStage } from "./CmdStage_Task";

export class Composite_Task implements Pipeline {
  id: string;
  title: string;
  cmdStages: CmdStage[];
  sleepTasks: Sleep_Task[];
  startTasks: Start_Task[];
  endTasks: End_Task[];
  compositeTasks: Composite_Task[];
  links: { from: string, to: string }[];

  constructor(
    id: string,
    title: string,
    cmdStages: CmdStage[],
    sleepTasks: Sleep_Task[],
    startTasks: Start_Task[],
    endTasks: End_Task[],
    compositeTasks: Composite_Task[],
    links: { from: string, to: string }[]
  ) {
    this.id = id;
    this.title = title;
    this.cmdStages = cmdStages;
    this.sleepTasks = sleepTasks;
    this.startTasks = startTasks;
    this.endTasks = endTasks;
    this.compositeTasks = compositeTasks;
    this.links = links;
  }
}