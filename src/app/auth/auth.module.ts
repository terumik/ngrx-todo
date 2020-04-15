import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../shared/angular-material.module';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    RouterModule.forChild([{ path: '', component: AuthComponent }]),
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    FormsModule
  ]
})
export class AuthModule {}
