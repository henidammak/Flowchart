import { Pipeline } from './Pipeline';

export class End_Task implements Pipeline {
  id: string;
  title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
