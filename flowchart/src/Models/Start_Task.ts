import { Pipeline } from './Pipeline';

export class Start_Task implements Pipeline {
  id: string;
  title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
