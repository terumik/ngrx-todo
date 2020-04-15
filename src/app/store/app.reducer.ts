import { ActionReducerMap } from '@ngrx/store';

import * as fromTasks from '../tasks/store/task.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
  tasks: fromTasks.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  tasks: fromTasks.taskReducer,
  auth: fromAuth.authReducer,
};
