// -- attempt 1 (firebase will not recognize/store logged in user)
// -- with https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser
// import { User } from 'src/app/models/user.model';
// import * as AuthActions from './auth.actions';
// import { of, pipe } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { Actions, ofType, createEffect } from '@ngrx/effects';
// import { HttpClient } from '@angular/common/http';
// import { switchMap, map, catchError, tap, take } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { TypedAction } from '@ngrx/store/src/models';
// import { async } from 'rxjs/internal/scheduler/async';

// export interface AuthResponseData {
//   kind: string;
//   idToken: string;
//   email: string;
//   username: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
// }

// // const handleAuthentication = (
// //   userId: string,
// //   email: string,
// //   username: string,
// //   expiresIn: number,
// //   token: string
// // ) => {
// //   console.log('handleAuthentication()');

// //   const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
// //   const user = new User(userId, email, username);
// //   // const user = new User(userId, email, username, token, expirationDate);

// //   localStorage.setItem('userData', JSON.stringify(user));
// //   return AuthActions.LOGIN_SUCCESS({
// //     userId: userId,
// //     email: email,
// //     username: username,
// //     // expirationDate: expirationDate,
// //     // token: token,
// //     redirect: true
// //   });
// // };

// // const handleError = (errorRes: any) => {
// //   console.log('handleError()');
// //   let errorMessage = 'An unknown error occurred!';
// //   if (!errorRes.code) {
// //     return of(AuthActions.LOGIN_FAIL({ errorMessage: errorMessage }));
// //   }
// //   switch (errorRes.code) {
// //     case 'EMAIL_EXISTS':
// //       errorMessage = 'This email exists already.';
// //       break;
// //     case 'EMAIL_NOT_FOUND':
// //       errorMessage = 'This email does not exist.';
// //       break;
// //     case 'INVALID_PASSWORD':
// //       errorMessage = 'This password is not correct.';
// //       break;
// //   }
// //   return of(AuthActions.LOGIN_FAIL({ errorMessage: errorMessage }));
// // };

// @Injectable()
// export class AuthEffects {

//   tokenExpirationTimer: any;

//   authSignup$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.REGISTER_START),
//       switchMap(action => {
//         console.log('AuthEffect: Sign Up');

//         return this.ngAuth.auth.createUserWithEmailAndPassword(action.email, action.password)
//           .then((resData) => {
//             console.log('resData: ', resData);
//             this.ngFireStore.collection('users').add(
//               {
//                 userId: resData.user.uid,
//                 username: action.username,
//                 customField: 'dummy content for custom field'
//               });
//           })
//           .then((_) => {
//             return AuthActions.REGISTER_SUCCESS();
//           })
//           .catch((error) => {
//             console.log('Registration Error:', error.code);
//             return AuthActions.REGISTER_FAIL({ errorMessage: error.message });
//           });

//         // note: previous codes (sample for observable handling)
//         // return this.http
//         //   .post<AuthResponseData>(
//         //     'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key='
//         //     + environment.firebaseApiKey,
//         //     {
//         //       email: action.email,
//         //       password: action.password,
//         //       returnSecureToken: true
//         //     }
//         //   )
//         //   .pipe(
//         //     tap(resData => {
//         //       this.authService.setLogoutTimer(+resData.expiresIn * 1000);
//         //     }),
//         //     map(resData => {
//         //       console.log('resData: ', resData);
//         //       this.ngFireStore.collection('users').add(
//         //         {
//         //           userId: resData.localId,
//         //           username: action.username,
//         //           customField: 'dummy content for custom field'
//         //         });
//         //       return handleAuthentication(
//         //         resData.localId,
//         //         resData.email,
//         //         action.username,
//         //         +resData.expiresIn,
//         //         resData.idToken
//         //       );
//         //     }),
//         //     catchError(errorRes => {
//         //       console.log('errorRes: ', errorRes);
//         //       return handleError(errorRes);
//         //     }),
//         //   );
//       })
//     )
//   );

//   // todo: check if token expiry and auto-login/out works
//   authLogin$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.LOGIN_START),
//       switchMap(action => {
//         return this.ngAuth.auth.signInWithEmailAndPassword(action.email, action.password)
//           .then((resData) => {
//             console.log(resData); // raw data from firebase

//             return this.ngFireStore
//               .collection<{ username: string; userId: string; customField: string }>
//               ('users', ref => ref.where('userId', '==', resData.user.uid))
//               .snapshotChanges()
//               .pipe(
//                 take(1),
//                 map(snaps => {
//                   return snaps.map(snap => {
//                     const username = snap.payload.doc.data().username;

//                     // transformed data
//                     return {
//                       userId: resData.user.uid,
//                       username: username,
//                       email: resData.user.email,
//                     };
//                   });
//                 }))
//               .toPromise();
//           })
//           .then((data) => {
//             return AuthActions.LOGIN_SUCCESS({
//               userId: data[0].userId,
//               email: data[0].email,
//               username: data[0].username,
//               // expirationDate: new Date(),
//               // token: data.token,
//               redirect: true
//             });
//           })
//           .catch((error) => {
//             console.log('Login Error:', error.code);
//             return AuthActions.LOGIN_FAIL({ errorMessage: error.message });
//           });

//         // note: example of combining data from multiple data sources
//         // return this.http
//         //   .post<AuthResponseData>(
//         //     'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
//         //     environment.firebaseApiKey,
//         //     {
//         //       email: action.email,
//         //       password: action.password,
//         //       returnSecureToken: true
//         //     }
//         //   )
//         //   .pipe(
//         //     tap(resData => {
//         //       this.authService.setLogoutTimer(+resData.expiresIn * 1000);
//         //     }),
//         //     switchMap(resData => {
//         //       // todo: understand what's going on
//         //       return this.ngFireStore
//         //         .collection<{ username: string; userId: string; customField: string }>
//         //         ('users', ref => ref.where('userId', '==', resData.localId))
//         //         .snapshotChanges()
//         //         .pipe(
//         //           take(1),
//         //           map(snaps => {
//         //             return snaps.map(snap => {
//         //               const username = snap.payload.doc.data().username;
//         //               return {
//         //                 username,
//         //                 ...resData
//         //               };
//         //             });
//         //           }));
//         //     }),
//         //     map((resData) => {
//         //       return handleAuthentication(
//         //         resData[0].localId,
//         //         resData[0].email,
//         //         resData[0].username,
//         //         +resData[0].expiresIn,
//         //         resData[0].idToken
//         //       );
//         //     }),
//         //     catchError(errorRes => {
//         //       console.log(errorRes);
//         //       return handleError(errorRes);
//         //     })
//         //   );
//       })
//     )
//   );


//   // get username and dispatch action(success/fail)
//   autoLogin$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.AUTO_LOGIN),
//       switchMap(() => {
//         console.log('Auto Login');

//         const checkCurrentUser = async () => {
//           return new Promise<firebase.User>((resolve, reject) => {
//             this.ngAuth.auth.onAuthStateChanged((user) => {
//               if (user) {
//                 resolve(user);
//               } else {
//                 resolve(null);
//               }
//             });
//           });
//         };

//         return checkCurrentUser()
//           .then((result) => {
//             console.log(result); // user
//             if (result !== null) {
//               return this.ngFireStore
//                 .collection<{ username: string; userId: string; customField: string }>
//                 ('users', ref => ref.where('userId', '==', result.uid))
//                 .snapshotChanges()
//                 .pipe(
//                   take(1),
//                   map(snaps => {
//                     return snaps.map(snap => {
//                       const username = snap.payload.doc.data().username;

//                       // transformed data
//                       return {
//                         userId: result.uid,
//                         username: username,
//                         email: result.email,
//                       };
//                     });
//                   }))
//                 .toPromise();
//             }
//           })
//           .then((data) => {
//             return AuthActions.LOGIN_SUCCESS({
//               userId: data[0].userId,
//               email: data[0].email,
//               username: data[0].username,
//               redirect: true
//             });
//           })
//           .catch((error) => {
//             console.log('Login Error:', error.code);
//             return AuthActions.LOGIN_FAIL({ errorMessage: error.message });
//           });

//       })
//     ));
//   // todo: clean up the code, fix error on logout, add spinner, auto logout?

//   // autoLogin$ = createEffect(() =>
//   //   this.actions$.pipe(
//   //     ofType(AuthActions.AUTO_LOGIN),
//   //     map(() => {
//   //       const userData: {
//   //         userId: string;
//   //         email: string;
//   //         username: string;
//   //         _token: string;
//   //         _tokenExpirationDate: string;
//   //       } = JSON.parse(localStorage.getItem('userData'));
//   //       if (!userData) {
//   //         return { type: 'DUMMY(no user)' };
//   //       }

//   //       const loadedUser = new User(
//   //         userData.userId,
//   //         userData.email,
//   //         userData.username,
//   //         // userData._token,
//   //         // new Date(userData._tokenExpirationDate)
//   //       );

//   //       if (loadedUser.token) {
//   //         const expirationDuration =
//   //           new Date(userData._tokenExpirationDate).getTime() -
//   //           new Date().getTime();
//   //         this.authService.setLogoutTimer(expirationDuration);
//   //         return AuthActions.LOGIN_SUCCESS({
//   //           userId: loadedUser.userId,
//   //           email: loadedUser.email,
//   //           username: loadedUser.username,
//   //           token: loadedUser.token,
//   //           expirationDate: new Date(userData._tokenExpirationDate),
//   //           redirect: false
//   //         });

//   //       }
//   //       return { type: 'DUMMY(no token)' };
//   //     })
//   //   ));

//   logout$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.LOGOUT),
//       tap(() => {
//         return this.ngAuth.auth.signOut()
//           .then(() => {
//             // todo
//             console.log('signed out');
//             localStorage.removeItem('userData');
//             this.router.navigate(['/auth']);
//           }).catch(() => {
//             // todo
//             console.log('sign out error');
//           });
//       })
//       // tap(() => {
//       //   this.authService.clearLogoutTimer();
//       //   localStorage.removeItem('userData');
//       //   this.router.navigate(['/auth']);
//       // }),
//     ),
//     { dispatch: false }
//   );

//   constructor(
//     private actions$: Actions,
//     private http: HttpClient,
//     private ngFireStore: AngularFirestore,
//     private authService: AuthService,
//     private router: Router,
//     private ngAuth: AngularFireAuth,
//   ) { }

// }


// -- attempt2: trying to solve permission error with subscription/unsubscribe, which won't solve permission error for the first logout
// import * as AuthActions from './auth.actions';
// import { Injectable, OnDestroy } from '@angular/core';
// import { Actions, ofType, createEffect } from '@ngrx/effects';
// import { switchMap, map, tap, take, first } from 'rxjs/operators';
// import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
// import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { Observable, BehaviorSubject, of, Subject, Subscription } from 'rxjs';


// export interface AuthResponseData {
//   kind: string;
//   idToken: string;
//   email: string;
//   username: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
// }


// @Injectable()
// export class AuthEffects {

//   tokenExpirationTimer: any;
//   userData: {
//     userId: string;
//     username: string;
//     email: string;
//   }[];
//   subscription: Subscription;

//   authSignup$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.REGISTER_START),
//       switchMap(action => {
//         console.log('AuthEffect: Sign Up');

//         return this.ngAuth.auth.createUserWithEmailAndPassword(action.email, action.password)
//           .then((resData) => {
//             console.log('resData: ', resData);
//             this.ngFireStore.collection('users').add(
//               {
//                 userId: resData.user.uid,
//                 username: action.username,
//                 customField: 'dummy content for custom field'
//               });
//           })
//           .then((_) => {
//             return AuthActions.REGISTER_SUCCESS();
//           })
//           .catch((error) => {
//             console.log('Registration Error:', error.code);
//             return AuthActions.REGISTER_FAIL({ errorMessage: error.message });
//           });

//       })
//     )
//   );

//   // // todo: check if token expiry and auto-login/out works
//   authLogin$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.LOGIN_START),
//       switchMap(action => {

//         return this.ngAuth.auth.signInWithEmailAndPassword(action.email, action.password)
//           .then((resData) => {

//             console.log(resData); // raw data from firebase

//             // todo?: fix error on logout
//             this._transformUserInfo(resData.user);
//             return resData;
//           })
//           .then((data) => {
//             console.log('DATA', this.userData);

//             return AuthActions.LOGIN_SUCCESS({
//               userId: this.userData[0].userId,
//               email: this.userData[0].email,
//               username: this.userData[0].username,
//               redirect: true
//             });
//           })
//           .catch((error) => {
//             console.log('Login Error:', error.code);
//             return AuthActions.LOGIN_FAIL({ errorMessage: error.message });
//           });
//       })
//     )
//   );

//   // get username and dispatch action(success/fail)
//   autoLogin$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.AUTO_LOGIN),
//       switchMap(() => {
//         console.log('Auto Login');

//         const checkCurrentUser = async () => {
//           return new Promise<firebase.User>((resolve, reject) => {
//             this.ngAuth.auth.onAuthStateChanged((user) => {
//               if (user) {
//                 resolve(user);
//               } else {
//                 resolve(null);
//               }

//             });
//           });
//         };

//         return checkCurrentUser()
//           .then((user) => {
//             console.log(user); // user
//             if (user !== null) {
//               return this._transformUserInfo(user);
//             }
//           })
//           .then((data) => {
//             return AuthActions.LOGIN_SUCCESS({
//               userId: data[0].userId,
//               email: data[0].email,
//               username: data[0].username,
//               redirect: true
//             });
//           })
//           .catch((error) => {
//             console.log('Login Error:', error.code);
//             return AuthActions.LOGIN_FAIL({ errorMessage: error.message });
//           });

//       })
//     ));

//   logout$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthActions.LOGOUT),
//       tap(() => {

//         return this.ngAuth.auth.signOut()
//           .then(() => {
//             console.log('signed out');
//             this.subscription.unsubscribe();
//             localStorage.removeItem('userData');
//             this.router.navigate(['/auth']);
//           }).catch((err) => {
//             console.log('sign out error', err);
//           });
//       })
//     ),
//     { dispatch: false }
//   );

//   _transformUserInfo(user: firebase.User): Subscription {

//     return this.subscription = this.ngFireStore
//       .collection<{ username: string; userId: string; customField: string }>
//       ('users', ref => ref.where('userId', '==', user.uid))
//       .snapshotChanges()
//       .pipe(
//         // take(1),
//         map(snaps => {
//           return snaps.map(snap => {
//             const username = snap.payload.doc.data().username;
//             const userInfo = {
//               userId: user.uid,
//               username: username,
//               email: user.email,
//             };
//             console.log('UserInfo', userInfo);

//             // transformed data
//             return userInfo;
//           });
//         }))
//       .subscribe((data) => {
//         console.log('SubscribedData', data);
//         this.userData = data;
//       });
//     // .toPromise();
//   }

//   constructor(
//     private actions$: Actions,
//     private ngFireStore: AngularFirestore,
//     private router: Router,
//     private ngAuth: AngularFireAuth,
//   ) { }


// }
