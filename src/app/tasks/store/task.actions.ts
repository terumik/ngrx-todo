import { createAction, props } from '@ngrx/store';
import { Task } from 'src/app/models/task.model';

export const TASK_ADD = createAction(
  '[Task Edit] TASK_ADD',
  props<{ task: Task }>()
);

export const TASK_UPDATE = createAction(
  '[Task Edit] TASK_UPDATE',
  props<{ task: Task }>()
);

export const TASK_DELETE = createAction(
  '[Task Edit] TASK_DELETE',
  props<{ task: Task }>()
);

export const TASK_FETCH = createAction(
  '[Task Edit] TASK_FETCH_ALL',
  props<{ sortBy: string, display: string, keyword: string }>()
);

// export const TASK_FETCH_WITH_CONDITIONS = createAction(
//   '[Task Edit] TASK_FETCH_ALL'
// );

// export const TASK_SORT = createAction(
//   '[Task Edit] TASK_FETCH_ALL'
// );

export const TASK_LOADED_ALL = createAction(
  '[Task Edit] TASK_LOADED_ALL',
  props<{ tasks: Task[] }>()
);

export const TASK_MODIFICATION_FAIL = createAction(
  '[Task Edit] TASK_MODIFICATION_FAIL'
);
