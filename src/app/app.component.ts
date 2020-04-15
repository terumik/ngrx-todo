import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromApp.AppState>,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.store.dispatch(AuthActions.AUTO_LOGIN());
    this.store.select('auth').subscribe(
      (authState) => {
        if (!authState.loading && authState.user) {
          this.router.navigate(['/tasks']);
          this.snackBar.open('Welcome!', 'OK', {duration: 2000});
        }
      }
    );
  }
}
