import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import { Task } from '../models/task.model';
import { TASK_FETCH } from '../tasks/store/task.actions';
import { Sort, Display } from '../models/sort.enum';

@Injectable({ providedIn: 'root' })
export class TaskResolverService implements Resolve<Task[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('services/task.resolver');

    // set pagination setting by url
    const currentPage = route.queryParams.page ? route.queryParams.page : 1;
    const tasksPerPage = route.queryParams.items ? route.queryParams.items : 2;
    console.log('currentPage#:', +currentPage, 'tasksPerPage:', +tasksPerPage);

    return this.store.select('tasks').pipe(
      take(1),
      map(taskState => {
        return taskState.tasks;
      }),
      switchMap(tasks => {
        this.store.dispatch(TASK_FETCH({ sortBy: Sort.CreationDate, display: Display.All, keyword: '' }));

        // this does not work after you login->logout a couple of times
        // return this.actions$.pipe(
        //   ofType('[Task Edit] TASK_LOADED_ALL'),
        //   take(1)
        // );

        if (tasks.length === 0) {
          // initial load
          this.store.dispatch(TASK_FETCH({ sortBy: Sort.CreationDate, display: Display.All, keyword: '' }));

          return this.actions$.pipe(
            ofType('[Task Edit] TASK_LOADED_ALL'),
            take(1)
          );
        } else {
          // if there are tasks loaded previously
          return of(tasks);
        }
      })
    );
  }
}
