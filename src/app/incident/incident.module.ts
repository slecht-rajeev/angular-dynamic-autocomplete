import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentRoutingModule } from './incident-routing.module';
import {MatTabsModule} from '@angular/material/tabs';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IncidentComponent } from './incident.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
// import { MatButtonModule } from '@angular/material/fo';
import { CustomFormFieldControlComponent } from '../_shared/custom-form-field-control/custom-form-field-control.component';
import { SearchFieldComponent } from '../_shared/search-field/search-field.component';


@NgModule({
  declarations: [
    IncidentComponent,
    CustomFormFieldControlComponent,
    SearchFieldComponent
  ],
  imports: [
    CommonModule,
    IncidentRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule
  ]
})
export class IncidentModule { }
