import { Pipeline } from './Pipeline';


export class Sleep_Task implements Pipeline {
  id: string;
  title: string;
  Time_sleep: number;

  constructor(id: string, title: string, Time_sleep: number) {
    this.id = id;
    this.title = title;
    this.Time_sleep = Time_sleep;
  }

}

// export interface Sleep_Task {
//   id: string;
//   title: string;
//   // description : string;
//   Time_sleep : number;
//   // localisation : number;

// }
