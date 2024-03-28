import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { AngularSvgIconModule } from 'angular-svg-icon';

//components
import { PrimaryLayoutComponent } from './primary-layout/primary-layout.component';
import { PrimaryNavigationComponent } from './primary-navigation/primary-navigation.component';
import { PrimaryHeaderComponent } from './primary-header/primary-header.component';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
import { PrimaryHeaderService } from './primary-header/primary-header.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';



@NgModule({
  declarations: [
    PrimaryLayoutComponent,
    PrimaryNavigationComponent,
    PrimaryHeaderComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    AngularSvgIconModule.forRoot(),
    MenuToggleModule,
    FilterToggleModule,
    BsDropdownModule.forRoot()
  ],
  providers: [PrimaryHeaderService]
})
export class LayoutModule { }
