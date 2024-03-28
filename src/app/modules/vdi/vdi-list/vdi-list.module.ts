import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VdiListRoutingModule } from './vdi-list-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { NgxI2k2BubbleLibModule } from 'ngx-i2k2-bubble-lib';
import { NgxI2k2TableLibModule } from 'ngx-i2k2-table-lib';
import { NgxI2k2TableOuterPaginationLibModule } from 'ngx-i2k2-table-outer-pagination-lib';
import { VdiListComponent } from './vdi-list.component';
import { VdiFilterComponent } from './vdi-filter/vdi-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { BsDropdownModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [
    VdiListComponent,
    VdiFilterComponent
  ],
  imports: [
    CommonModule,
    VdiListRoutingModule,ReactiveFormsModule,
    NgxI2k2BubbleLibModule,
    NgxI2k2TableLibModule,
    NgxI2k2TableOuterPaginationLibModule,
    AngularSvgIconModule,
     FilterToggleModule,
    MenuToggleModule,
    BsDropdownModule.forRoot()
  ]
})
export class VdiListModule { }
