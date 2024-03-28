import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerAddRoutingModule } from './server-add-routing.module';
import { ServerAddComponent } from './server-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { AngularSvgIconModule } from 'angular-svg-icon';


@NgModule({
  declarations: [
    ServerAddComponent
  ],
  imports: [
    CommonModule,
    ServerAddRoutingModule,
    CommonModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
  ]
})
export class ServerAddModule { }
