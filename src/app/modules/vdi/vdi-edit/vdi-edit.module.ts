import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VdiEditRoutingModule } from './vdi-edit-routing.module';
import { VdiEditComponent } from './vdi-edit.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import {
  FormControlDirective,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [VdiEditComponent],
  imports: [
    CommonModule,
    VdiEditRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [FormControlDirective, FormGroupDirective],
  schemas: [NO_ERRORS_SCHEMA],
})
export class VdiEditModule {}
