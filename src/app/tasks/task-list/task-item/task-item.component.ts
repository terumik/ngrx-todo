import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { TASK_UPDATE, TASK_DELETE } from '../../store/task.actions';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input()
  task: Task;
  isExpanded: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    // todo?: manage expansion status by store?
    if (!this.task.isCompleted || this.task.subtasks.find(st => st.isCompleted === false)) {
      this.isExpanded = true;
    }
  }

  onTaskSelected() {
    this.router.navigate([this.task.taskId, 'edit'], { relativeTo: this.activatedRoute });
  }

  onToggleTaskCompletionStatus() {
    this.task.isCompleted = !this.task.isCompleted;
    this.store.dispatch(TASK_UPDATE({ task: this.task }));
  }

  onToggleSubtaskCompletionStatus(index: number) {
    this.task.subtasks[index].isCompleted = !this.task.subtasks[index].isCompleted;
    this.store.dispatch(TASK_UPDATE({ task: this.task }));
  }

  onDelete() {
    this.store.dispatch(TASK_DELETE({ task: this.task }));
    this.router.navigate([''], { relativeTo: this.activatedRoute });
  }

}
