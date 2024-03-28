import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VdiViewRoutingModule } from './vdi-view-routing.module';
import { VdiViewComponent } from './vdi-view.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [VdiViewComponent],
  imports: [
    CommonModule,
    VdiViewRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
  ]
})
export class VdiViewModule { }
