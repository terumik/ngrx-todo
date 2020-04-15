import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../models/task.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { TASK_FETCH } from './store/task.actions';
import { Sort, Display } from '../models/sort.enum';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  allTasks: Task[] = []; // all tasks currently stored in DB
  tasksToDisplay: Task[] = []; // tasks to be displayed

  displayOptions: string[] = [Display.All, Display.Completed, Display.Incomplete];
  selectedDisplayOption: string;
  orderOptions: string[] = [Sort.Due, Sort.CreationDate, Sort.Title];
  selectedOrderOption: string;
  keyword: string;

  totalTasks = 0;
  pageSizeOptions = [1, 2, 5];
  tasksPerPage: number;
  currentPage: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this._setPagination();

    this.subscription = this.store.select('tasks')
      .subscribe((taskState: any) => {
        this.allTasks = taskState.tasks;
        this.totalTasks = this.allTasks.length;
        this.tasksToDisplay = this.allTasks.filter((_, index) =>
          (index < this.currentPage * this.tasksPerPage && index >= (this.currentPage - 1) * this.tasksPerPage)
        );
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.tasksPerPage = pageData.pageSize;

    this.router.navigate(
      ['tasks'],
      { queryParams: { page: this.currentPage, items: this.tasksPerPage } }
    );

    this.tasksToDisplay = this.allTasks.filter((_, index) =>
      (index < this.currentPage * this.tasksPerPage && index >= (this.currentPage - 1) * this.tasksPerPage)
    );

  }

  onAddNew() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  onDisplayOptionSelected() {
    this.selectedDisplayOption = this.selectedDisplayOption ? this.selectedDisplayOption : Display.All;
    this.store.dispatch(TASK_FETCH({ sortBy: this.selectedDisplayOption, display: this.selectedDisplayOption, keyword: this.keyword }));

  }

  onOrderOptionSelected() {
    this.selectedOrderOption = this.selectedOrderOption ? this.selectedOrderOption : Sort.CreationDate;
    this.store.dispatch(TASK_FETCH({ sortBy: this.selectedOrderOption, display: this.selectedDisplayOption, keyword: this.keyword }));
  }

  onSearch() {
    this.store.dispatch(TASK_FETCH({ sortBy: this.selectedOrderOption, display: this.selectedDisplayOption, keyword: this.keyword }));

    // adjust pagination
    this.currentPage = 1;
    this.router.navigate(
      ['tasks'],
      { queryParams: { page: this.currentPage, items: this.tasksPerPage } }
    );
  }

  _setPagination() {
    const isEditMode = this.router.routerState.snapshot.url.split('/', 4)[3] === 'edit';

    // if pagination setting is not available, use default setting
    this.currentPage = 1;
    this.tasksPerPage = 2;

    if (!isEditMode) {
      // display specified number of items in the current page

      // get pagination setting from url params if available
      const pageParam = this.router.routerState.snapshot.url.split('/tasks?page=', 2)[1] ?
        +this.router.routerState.snapshot.url.split('/tasks?page=', 2)[1].charAt(0) :
        NaN;
      const itemsParam = +this.router.routerState.snapshot.url.split('&items=', 2)[1];

      if (!isNaN(pageParam) && !isNaN(itemsParam)) {
        this.currentPage = pageParam;
        this.tasksPerPage = itemsParam;
      }

      // display settings in the address bar
      this.router.navigate(
        ['tasks'],
        { queryParams: { page: this.currentPage, items: this.tasksPerPage } }
      );
    }
  }

}
