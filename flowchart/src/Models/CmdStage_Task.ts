import { Pipeline } from './Pipeline';

export class CmdStage implements Pipeline {
  id: string;
  title: string;
  cmd_text: string;
  root: number;

  constructor(id: string, title: string, cmd_text: string, root: number) {
    this.id = id;
    this.title = title;
    this.cmd_text = cmd_text;
    this.root = root;
  }
}

// export interface CmdStage {
//   id: string;
//   title: string;
//   // description : string;
//   cmd_text : string;
//   // localisation : number;
//   root : number;

// }
