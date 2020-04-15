import * as AuthActions from './auth.actions';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, map, tap, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  username: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable()
export class AuthEffects {

  tokenExpirationTimer: any;

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.REGISTER_START),
      switchMap(action => {
        console.log('AuthEffect: Sign Up');

        return this.ngAuth.auth.createUserWithEmailAndPassword(action.email, action.password)
          .then((resData) => {
            console.log('resData: ', resData);
            this.ngFireStore.collection('users').add(
              {
                userId: resData.user.uid,
                username: action.username,
                customField: 'dummy content for custom field'
              });
          })
          .then((_) => {
            return AuthActions.REGISTER_SUCCESS();
          })
          .catch((error) => {
            console.log('Registration Error:', error.code);
            return AuthActions.REGISTER_FAIL({ errorMessage: error.message });
          });

      })
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap(action => {

        return this.ngAuth.auth.signInWithEmailAndPassword(action.email, action.password)
          .then((resData) => {

            console.log(resData); // raw data from firebase

            // todo?: fix error on logout (tried with subscription->unsubscribe. see: trash.auth > attempt2)
            return this._transformUserInfo(resData.user);

          })
          .then((data) => {
            return AuthActions.LOGIN_SUCCESS({
              userId: data[0].userId,
              email: data[0].email,
              username: data[0].username,
              redirect: true
            });
          })
          .catch((error) => {
            console.log('Login Error:', error.code);
            return AuthActions.LOGIN_FAIL({ errorMessage: error.message });
          });
      })
    )
  );

  // get username and dispatch action(success/fail)
  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      switchMap(() => {
        console.log('Auto Login');

        const checkCurrentUser = async () => {
          return new Promise<firebase.User>((resolve, reject) => {
            this.ngAuth.auth.onAuthStateChanged((user) => {
              if (user) {
                resolve(user);
              } else {
                resolve(null);
              }
            });
          });
        };

        return checkCurrentUser()
          .then((user) => {
            console.log(user); // user
            if (user !== null) {
              return this._transformUserInfo(user);
            }
          })
          .then((data) => {
            return AuthActions.LOGIN_SUCCESS({
              userId: data[0].userId,
              email: data[0].email,
              username: data[0].username,
              redirect: true
            });
          })
          .catch((error) => {
            console.log('Login Error:', error.code);
            return AuthActions.LOGIN_FAIL({ errorMessage: error.message });
          });

      })
    ));

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        return this.ngAuth.auth.signOut()
          .then(() => {
            console.log('signed out');
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
          }).catch((err) => {
            console.log('sign out error', err);
          });
      })
    ),
    { dispatch: false }
  );

  _transformUserInfo(user: firebase.User) {

    return this.ngFireStore
      .collection<{ username: string; userId: string; customField: string }>
      ('users', ref => ref.where('userId', '==', user.uid))
      .snapshotChanges()
      .pipe(
        take(1),
        map(snaps => {
          return snaps.map(snap => {
            const username = snap.payload.doc.data().username;
            const userInfo = {
              userId: user.uid,
              username: username,
              email: user.email,
            };
            console.log('UserInfo', userInfo);

            // transformed data
            return userInfo;
          });
        }))
      .toPromise();
  }

  constructor(
    private actions$: Actions,
    private ngFireStore: AngularFirestore,
    private router: Router,
    private ngAuth: AngularFireAuth,
  ) { }


}
