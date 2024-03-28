import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VdiAddRoutingModule } from './vdi-add-routing.module';
import { VdiAddComponent } from './vdi-add.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControlDirective,
  FormGroupDirective,
} from '@angular/forms';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [VdiAddComponent],
  imports: [
    CommonModule,
    VdiAddRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ],
  providers: [FormControlDirective, FormGroupDirective],
})
export class VdiAddModule {}
