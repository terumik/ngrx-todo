import { Subtask } from './subtask.model';
import { User } from './user.model';

export class Task {
  constructor(
    public taskId: string,
    public taskName: string,
    public isCompleted: boolean,
    public due: Date,
    public subtasks: Subtask[],
    public note: string,
    public assigner: User,
    public creationDate: Date,
  ) {}

}
