import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { REGISTER_START, LOGIN_START } from './store/auth.actions';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  hasError: string = null;
  private storeSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.hasError = authState.authError;
    });
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onToggleAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    console.log('AuthComponent', form.value);
    const em = form.value.email;
    const un = form.value.username;
    const pw = form.value.password;

    if (this.isLoginMode) {
      console.log('AuthComponent Login');
      this.store.dispatch(LOGIN_START({
        email: em,
        password: pw
      }));
    } else {
      console.log('AuthComponent Register');
      this.store.dispatch(REGISTER_START({
        email: em,
        username: un,
        password: pw
      }));
    }

    this._showSnackBar();
    form.resetForm();

  }

  // display snack bar and change ui based on auth state
  private _showSnackBar() {
    this.storeSub = this.store.select('auth').subscribe(
      authState => {
        if (!this.isLoginMode && !authState.loading && authState.authSuccess) {
          // Registration Success
          this.snackBar.open('Registration Success! Please login.', 'OK', { duration: 2000 });
          this.isLoginMode = true;
        } else if (this.isLoginMode && !authState.loading && authState.user) {
          // Login Success
          this.router.navigate(['/tasks']);
          this.snackBar.open('Welcome!', 'OK', { duration: 2000 });
        } else if (authState.authError) {
          // Registration or Login Failed
          this.snackBar.open(authState.authError, 'OK', { duration: 2000 });
        }
      }
    );
  }

}
