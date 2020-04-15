import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';

import * as fromApp from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LOGOUT } from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input()
  sidenavRef: MatSidenav;

  isLoggedIn = false;
  private userSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.userSub = this.store.select('auth')
      .pipe(
        map(authState => authState.user))
      .subscribe((user) => {
        console.log('User: ', user);
        this.isLoggedIn = !!user;
      });
  }

  onLogout() {
    this.store.dispatch(LOGOUT());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
