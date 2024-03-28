import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerViewRoutingModule } from './server-view-routing.module';
import { ServerViewComponent } from './server-view.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [ServerViewComponent],
  imports: [
    CommonModule,
    ServerViewRoutingModule,
    CommonModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
  ]
})
export class ServerViewModule { }
