import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatSnackBarModule,
  MatSelectModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
} from '@angular/material';

@NgModule({
  exports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSnackBarModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ]
})

export class AngularMaterialModule {
}
