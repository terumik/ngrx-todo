import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskResolverService } from '../services/task.resolver';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    resolve: [TaskResolverService],
    children: [
      { path: 'new', component: TaskEditComponent },
      {
        path: ':id/edit',
        component: TaskEditComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
