import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './shared/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './store/app.reducer';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AccountComponent } from './account/account.component';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { AuthEffects } from './auth/store/auth.effects';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TaskEffects } from './tasks/store/task.effects';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TasksModule,
    AuthModule,
    StoreModule.forRoot(appReducer),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forRoot([AuthEffects, TaskEffects]),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
