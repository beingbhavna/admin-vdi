import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { GlobalRestService } from './services/rest/global-rest.service';
import { AppsettingsConfService } from './services/conf/appsettings-conf/appsettings-conf.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxI2k2LoadingSpinnerModule, NgxI2k2LoadingSpinnerService } from 'ngx-i2k2-loading-spinner-lib';
import { NgxI2k2MessageLibModule } from 'ngx-i2k2-message-lib';
// Authguard is used in app-routing.module for route security
import { AuthGuard } from './shared/gaurds/authgaurd/auth.gaurd';
// Primary entry layout & component
import { LayoutModule } from './modules/layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule ,
    HttpClientModule,
    NgxI2k2LoadingSpinnerModule,
    AppRoutingModule,
    NgxI2k2MessageLibModule,
    LayoutModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthGuard,
    GlobalRestService,
    AppsettingsConfService,
    NgxI2k2LoadingSpinnerService
  ],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
