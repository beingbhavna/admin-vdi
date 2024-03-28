import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerListRoutingModule } from './server-list-routing.module';
import { ServerListComponent } from './server-list.component';
import { NgxI2k2BubbleLibModule } from 'ngx-i2k2-bubble-lib';
import { NgxI2k2TableLibModule } from 'ngx-i2k2-table-lib';
import { NgxI2k2TableOuterPaginationLibModule } from 'ngx-i2k2-table-outer-pagination-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServerFilterComponent } from './server-filter/server-filter.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { BsDropdownModule } from 'ngx-bootstrap';
@NgModule({
  declarations: [ServerListComponent, ServerFilterComponent],
  imports: [
    CommonModule,
    ServerListRoutingModule,
    ReactiveFormsModule,
    NgxI2k2BubbleLibModule,
    NgxI2k2TableLibModule,
    NgxI2k2TableOuterPaginationLibModule,
    AngularSvgIconModule,
    FilterToggleModule,
    MenuToggleModule,FormsModule,
    BsDropdownModule.forRoot()
  ],
})
export class ServerListModule {}
