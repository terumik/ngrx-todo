import { createReducer, on, Action } from '@ngrx/store';
import { TASK_MODIFICATION_FAIL, TASK_LOADED_ALL } from './task.actions';
import { Task } from 'src/app/models/task.model';

export interface State {
  tasks: Task[];
}

export const initialState: State = {
  tasks: []
};

export const taskReducer = createReducer(
  initialState,
  // on(ADD_TASK, (state, action) => ({
  //   ...state,
  //   tasks: state.tasks.concat({ ...action.task })
  // })),
  // on(TASK_UPDATE, (state, action) => ({
  //   ...state,
  //   tasks: state.tasks.map(
  //     (task) => task.taskId === action.task.taskId ? { ...action.task } : task
  //   )
  // })),
  // on(TASK_DELETE, (state, action) => ({
  //   ...state,
  //   tasks: state.tasks.filter((task) => task.taskId !== action.task.taskId)
  // })),
  // on(TASK_ADD_SUCCESS, (state, action) => ({
  //   ...state,
  // })),
  on(TASK_MODIFICATION_FAIL, (state, action) => ({
    ...state,
  })),
  on(TASK_LOADED_ALL, (state, action) => ({
    ...state,
    tasks: action.tasks
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return taskReducer(state, action);
}
