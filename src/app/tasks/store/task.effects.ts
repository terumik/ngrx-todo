import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as TaskActions from './task.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { Sort, Display } from 'src/app/models/sort.enum';


@Injectable()
export class TaskEffects {

  @Effect()
  fetchTasks$ = this.actions$.pipe(
    ofType(TaskActions.TASK_FETCH),
    switchMap((action) => {
      console.log('TaskEffect: task fetch');

      // get tasks from firebase and return new Action
      const query = this._generateQuery(action);
      return this.ngFireStore.collection<Task>('tasks', query)
        .snapshotChanges()
        .pipe(
          map((snaps) => {
            let tasks = snaps.map((snap) => {
              const document = snap.payload.doc.data();
              const documentId = snap.payload.doc.id;
              const creationDate = this._timestampToDatetime(document.creationDate);
              const dueDate = this._timestampToDatetime(document.due);

              return {
                ...document, // note: order matters
                taskId: documentId,
                creationDate,
                due: dueDate,
              } as Task;

            });

            // filter by keyword (not implemented with server side search)
            if (action.keyword) {
              tasks = this._filterByKeyword(tasks, action.keyword);
            }

            return TaskActions.TASK_LOADED_ALL({ tasks });
          }));
    }),
  );

  @Effect()
  addTask$ = this.actions$.pipe(
    ofType(TaskActions.TASK_ADD),
    switchMap((action) => {
      console.log('TaskEffect: add task');
      return of(this.ngFireStore.collection('tasks')
        .add({
          ...action.task,
          assigner: { userId: action.task.assigner.userId, username: action.task.assigner.username }
        }));
    }),
    switchMap(() => {
      return this.fetchTasks$;
    }),
    catchError((err) => {
      console.log('TaskEffect: add task fail: ', err);
      return of(TaskActions.TASK_MODIFICATION_FAIL());
    })
  );

  @Effect()
  updateTask$ = this.actions$.pipe(
    ofType(TaskActions.TASK_UPDATE),
    switchMap((action) => {
      console.log('TaskEffect: update task');
      return of(this.ngFireStore.collection('tasks').doc(action.task.taskId).update({ ...action.task }));
    }),
    switchMap(() => {
      return this.fetchTasks$;
    }),
    catchError((err) => {
      console.log('TaskEffect: update task fail: ', err);
      return of(TaskActions.TASK_MODIFICATION_FAIL()); // todo
    })
  );

  @Effect()
  deleteTask$ = this.actions$.pipe(
    ofType(TaskActions.TASK_DELETE),
    switchMap((action) => {
      console.log('TaskEffect: delete');
      return of(this.ngFireStore.collection('tasks').doc(action.task.taskId).delete());
    }),
    switchMap(() => {
      return this.fetchTasks$;
    }),
    catchError((err) => {
      console.log('TaskEffect: delete task fail: ', err);
      return of(TaskActions.TASK_MODIFICATION_FAIL()); // todo
    })
  );

  // convert Timestamp stored in firestore to DateTime
  private _timestampToDatetime(timestamp) {
    let date: Date = null;
    const storedDate: any = timestamp;
    if (storedDate !== null) {
      date = new Date(storedDate.seconds * 1000);
    }
    return date;
  }

  private _generateQuery(action) {
    let sort: string;
    switch (action.sortBy) {
      case Sort.Due:
        sort = 'due';
        break;
      case Sort.Title:
        sort = 'taskName';
        break;
      default:
        sort = 'creationDate';
        break;
    }

    let query;
    switch (action.display) {
      case Display.Completed:
        query = (ref: any) => ref
          .orderBy(sort, 'desc')
          .where('isCompleted', '==', true);
        break;
      case Display.Incomplete:
        query = (ref: any) => ref
          .orderBy(sort)
          .where('isCompleted', '==', false);
        break;
      default:
        query = (ref: any) => ref
          .orderBy(sort);
        break;
    }
    return query;
  }

  private _filterByKeyword(tasks: Task[], keyword: string): Task[] {
    const titleMatch = tasks.filter(task => task.taskName.toLowerCase().includes(keyword));
    const assignerMatch = tasks.filter(task => task.assigner.username.toLowerCase().includes(keyword));
    const noteMatch = tasks.filter(task => task.note === null ? false : task.note.toLowerCase().includes(keyword));
    const subtaskMatch = tasks.filter(task => task.subtasks === []
      ? false
      : task.subtasks.some(subtask => subtask.subtaskName.toLowerCase().includes(keyword)));

    const results = [...titleMatch, ...subtaskMatch, ...assignerMatch, ...noteMatch];
    const unique = [...new Set(results)]; // remove duplicated result from an array
    return unique;
  }

  constructor(
    private actions$: Actions,
    private ngFireStore: AngularFirestore
  ) { }
}
