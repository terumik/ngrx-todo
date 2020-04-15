import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { TASK_UPDATE, TASK_ADD } from '../store/task.actions';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  isEditMode = false;
  taskForm: FormGroup;
  taskSubscription: Subscription;
  authSubscription: Subscription;
  tasks: Task[];
  taskId: string;
  today = new Date();
  authenticatedUser: User;
  isAllowedToEdit = true;

  get subtasksControls() {
    return (this.taskForm.get('subtasks') as FormArray).controls;
  }

  constructor(
    private store: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.taskSubscription = this.store.select('tasks')
      .pipe(map(taskState => taskState.tasks))
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        // change subtask status in the edit form when status toggled in the item
        this.initForm();
      });

    this.authSubscription = this.store.select('auth')
      .pipe(
        map(authState => authState.user)
      )
      .subscribe((user: User) => {
        this.authenticatedUser = user;
      });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.taskId = params.id;
      this.isEditMode = this.taskId != null;
      this.initForm();
    });

  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onCloseEditor() {
    this.router.navigate([''], { relativeTo: this.activatedRoute });
  }

  onSubmit() {
    if (!this.isEditMode) {
      // Add Task
      const newTask = new Task(
        null,
        this.taskForm.get('taskName').value,
        false,
        this.taskForm.get('dueDate').value,
        this.taskForm.get('subtasks').value,
        this.taskForm.get('note').value,
        this.authenticatedUser,
        new Date(),
      );
      this.store.dispatch(TASK_ADD({ task: newTask }));

    } else {
      // Update Task
      const taskId = this.taskId;
      const editingTask = this.tasks.filter(task => task.taskId === this.taskId)[0];

      const updatedTask = new Task(
        taskId,
        this.taskForm.get('taskName').value,
        editingTask.isCompleted,
        this.taskForm.get('dueDate').value,
        this.taskForm.get('subtasks').value,
        this.taskForm.get('note').value,
        editingTask.assigner,
        editingTask.creationDate,
      );
      this.store.dispatch(TASK_UPDATE({ task: updatedTask }));
    }
    this.router.navigate([''], { relativeTo: this.activatedRoute });
  }

  onAddSubtask() {
    (this.taskForm.get('subtasks') as FormArray).push(
      new FormGroup({
        subtaskName: new FormControl(null, Validators.required),
        isCompleted: new FormControl(false)
      })
    );
  }

  onRemoveSubtask(index: number) {
    (this.taskForm.get('subtasks') as FormArray).removeAt(index);
  }

  private initForm() {

    const subtaskFormArray = new FormArray([]);

    this.taskForm = new FormGroup({
      taskName: new FormControl(),
      subtasks: subtaskFormArray,
      dueDate: new FormControl(),
      note: new FormControl()
    });

    if (this.isEditMode) {
      const editingTask = this.tasks.filter(task => task.taskId === this.taskId)[0];
      console.log('editingTask:', editingTask);


      // this condition is needed for solving an undefined error after select->delete task
      if (editingTask !== undefined) {
        this.taskForm.get('taskName').setValue(editingTask.taskName);
        this.taskForm.get('dueDate').setValue(editingTask.due);
        this.taskForm.get('note').setValue(editingTask.note);
        if (editingTask.subtasks) {
          for (const subtask of editingTask.subtasks) {
            subtaskFormArray.push(
              new FormGroup({
                subtaskName: new FormControl(subtask.subtaskName, Validators.required),
                isCompleted: new FormControl(subtask.isCompleted)
              })
            );
          }
        }
      }

      // disable form if assigner and logged in user is not the same
      if (this.authenticatedUser.userId !== editingTask.assigner.userId) {
        console.log('assignerId: ', editingTask.assigner.userId);

        this.taskForm.disable();
        this.isAllowedToEdit = false;
      }
    }

  }

}
