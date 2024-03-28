import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppsettingsConfService {
  constructor() { 
  }
  //./assets/config/settings.json
  private initAppSettings: any = {};
  private appSettings = new BehaviorSubject<any>(this.initAppSettings);
  getAppSettings= this.appSettings.asObservable();
  setAppSettings(_json: any) {
    this.appSettings.next(_json);
  }
  
  //Application Routes
  private initAppRoutes: any = {};
  private appRoutes = new BehaviorSubject<any>(this.initAppRoutes);
  getAppRoutes= this.appRoutes.asObservable();
  setAppRoutes(_json: any) {this.appRoutes.next(_json);}

  // osType
  private initOsTypeConfig: string = "";
  private osTypeConfig = new BehaviorSubject<string>(this.initOsTypeConfig);
  getOsTypeConfig = this.osTypeConfig.asObservable();
  setOsTypeConfig(_osType: string) {this.osTypeConfig.next(_osType);}
}
