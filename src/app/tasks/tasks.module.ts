import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../shared/angular-material.module';
import { TasksComponent } from './tasks.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskItemComponent } from './task-list/task-item/task-item.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TasksComponent,
    TaskListComponent,
    TaskItemComponent,
    TaskEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    FormsModule
  ]
})
export class TasksModule {}
