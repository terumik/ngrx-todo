import { createAction, props } from '@ngrx/store';

export const REGISTER_START = createAction(
  '[Auth] Register Start',
  props<{ email: string, username: string, password: string }>()
);
export const REGISTER_SUCCESS = createAction(
  '[Auth] Register Success',
);
export const REGISTER_FAIL = createAction(
  '[Auth] Register Fail',
  props<{ errorMessage: string }>()
);

export const LOGIN_START = createAction(
  '[Auth] Login Start',
  props<{ email: string, password: string }>()
);
export const LOGIN_SUCCESS = createAction(
  '[Auth] Login Success',
  props<{ userId: string; email: string; username: string; redirect: boolean }>()
  // props<{ userId: string; email: string; username: string; token: string; expirationDate: Date; redirect: boolean }>()
);
export const LOGIN_FAIL = createAction(
  '[Auth] Login Fail',
  props<{errorMessage: string}>()
);
export const LOGOUT = createAction(
  '[Auth] Logout',
);

export const AUTO_LOGIN = createAction(
  '[Auth] Auto Login',
);

