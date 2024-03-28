import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs/index';
import { MessageService } from 'ngx-i2k2-message-lib';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private messageService: MessageService, private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      //*****************************************
      //check if state.url is permitted route
      //*****************************************

      // "selected_modules": [
      //   "/main",
      //   "/changepassword"
      // ]

      //loop all routes
      //state.url  = selected_modules[i]
 
      //if yes
        //return true;
      //else
        // //Show Popup Error Message
        // let httpErrorResponse = {
        //   http_status: "401",
        //   data: [
        //     {
        //       type: "APP_ERROR",
        //       attributes: {
        //         message_type: "APP_ERROR",
        //         message: ["Access Denied"]
        //       }
        //     }
        //   ]
        // }
        // this.messageService.okRedirectModal(httpErrorResponse, 'ERROR', 'OK').subscribe(result =>
        // {
        //   this.messageService.hideModal();
        //   this.router.navigate(['/login']);
        // })
        //return false;
      //end
      
      return true;
    } else {
      //Show Popup Error Message
      let httpErrorResponse = {
        http_status: "401",
        data: [
          {
            type: "APP_ERROR",
            attributes: {
              message_type: "APP_ERROR",
              message: ["Access Denied"]
            }
          }
        ]
      }
      this.messageService.okRedirectModal(httpErrorResponse, 'ERROR', 'OK').subscribe(result =>
      {
        this.messageService.hideModal();
        this.router.navigate(['/login']);
      })
      return false;
    }
  }
}
