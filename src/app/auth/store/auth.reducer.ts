import { createReducer, on, Action } from '@ngrx/store';
import { REGISTER_START, LOGIN_START, LOGOUT, LOGIN_FAIL, LOGIN_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL } from './auth.actions';
import { User } from 'src/app/models/user.model';

export interface State {
  user: User;
  authSuccess: boolean;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authSuccess: null,
  authError: null,
  loading: false
};

export const authReducer = createReducer(
  initialState,
  on(REGISTER_START, (state, action) => ({
    ...state,
    authSuccess: null,
    authError: null,
    loading: true
  })),
  on(REGISTER_SUCCESS, (state, action) => ({
    ...state,
    authSuccess: true,
    authError: null,
    loading: false
  })),
  on(REGISTER_FAIL, (state, action) => ({
    ...state,
    authSuccess: false,
    authError: action.errorMessage,
    loading: false
  })),
  on(LOGIN_START, (state, action) => ({
    ...state,
    authSuccess: null,
    authError: null,
    loading: true
  })),
  on(LOGIN_SUCCESS, (state, action) => ({
    ...state,
    authSuccess: true,
    authError: null,
    loading: false,
    user: new User(action.userId, action.email, action.username)
    // user: new User(action.userId, action.email, action.username, action.token, action.expirationDate)
  })),
  on(LOGIN_FAIL, (state, action) => ({
    ...state,
    authSuccess: false,
    authError: action.errorMessage,
    loading: false,
    user: null
  })),
  on(LOGOUT, (state, action) => ({
    ...state,
    user: null
  }))

);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}

