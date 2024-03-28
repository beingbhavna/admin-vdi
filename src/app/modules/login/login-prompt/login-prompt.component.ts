import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RestApiParams, HandelError, RestMethods } from '../../../shared/models/app.models';
import { GlobalRestService } from '../../../services/rest/global-rest.service'
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service'
import appSettings from "../../../../assets/config/settings.json"
import { Generatekey} from '../../../shared/enumrations/app-enum.enumerations';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.scss']
})
export class LoginPromptComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public errMessage = "";
  private restPrams : RestApiParams;
  private appSettingsJson : any = {};

  constructor(
    private restService: GlobalRestService,
    private configService : AppsettingsConfService,
    private router: Router,
    private authService: AuthService
    ) {

    this.restPrams = new RestApiParams;
    this.restPrams.ShowLoadingSpinner = true;
    this.restPrams.AlertAndErrorAction =  HandelError.ShowAndReturn;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userPermissions");
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_type');
    localStorage.removeItem('publicKey');
    localStorage.removeItem('privateKey');
  }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  public login(event){
    event.preventDefault();
    event.stopPropagation();

    this.appSettingsJson = appSettings;

    this.errMessage = "";
    const username : string = this.loginFormGroup.controls.username.value;
    const password : string = this.loginFormGroup.controls.password.value;

    let httpPostParams = {
      userName : username,
      password : password,
      appGuid: this.appSettingsJson.application_guid,
      publicRsaKey: 1
    }

    //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.token.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.token.method;
    this.restService.HttpPostParams = httpPostParams;
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi()
      .subscribe(sucessResponse => {
          if(sucessResponse.token.access_token != "")
          {
            localStorage.setItem('accessToken', sucessResponse.token.access_token);
            localStorage.setItem('user_name', sucessResponse.user_name);
            localStorage.setItem('user_type', sucessResponse.user_type);
            localStorage.setItem('userPermissions', JSON.stringify(sucessResponse.token.access_permissions));
            localStorage.setItem('publicKey', 'false');
            localStorage.setItem('privateKey', 'false');
            // this.router.navigate(['/main']);
            if(sucessResponse.token.rsa_private_public_key_pair == "YES") {
              localStorage.setItem('publicPrivateKey', 'true');
            } else {
              localStorage.setItem('publicPrivateKey', 'false');
            }
            if(sucessResponse.token.public_rsa_key == "YES") {
              localStorage.setItem('publicKey', 'true');
              // this.router.navigate(['/generatekey']);
              let publicKey = localStorage.getItem("publicKey");
              let privateKey = localStorage.getItem("publicPrivateKey")

              if (publicKey == 'true' && privateKey == 'true') {
                this.autoValidateUser();
              }
              else{
                this.router.navigate(['/main']);
              }

            } else {
              localStorage.setItem('publicKey', 'false');
              this.router.navigate(['/main']);
              // this.router.navigate(['/generatekey']);
            }

          }
          else
          {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userPermissions");
            localStorage.removeItem("currentUser");
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_type');
            localStorage.removeItem('publicKey');
            localStorage.removeItem('privateKey');
            this.errMessage = 'Un-expected error';
          }
      }, errorResponse => {
          //view returned error object
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userPermissions");
          localStorage.removeItem("currentUser");
          localStorage.removeItem('user_name');
          localStorage.removeItem('user_type');
          localStorage.removeItem('publicKey');
          localStorage.removeItem('privateKey');
          this.errMessage = errorResponse.httpErrorResponse.data[0].attributes.message[0];
        }
     );
  }

  public autoValidateUser() {
      this.checkKeys();
  }

  public checkKeys() {
    let keyData = [
      {
        name: "userId",
        value: this.authService.getUserUniqueId()
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Generatekey.checkKeys;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe(successResponse => {
      if (successResponse.are_both_keys_same == "YES") {
        this.saveKeys();
      } else {
        this.router.navigate(['/main']);
      }
    }, errorResponse => {
      this.router.navigate(['/main']);
    })
  }

  public saveKeys() {
    let keyData = [
      {
        name: "userId",
        value: this.authService.getUserUniqueId()
      }
    ]
    this.restService.ApiEndPointUrlOrKey = Generatekey.saveKey;
    this.restService.ApiEndPointMehod = RestMethods.Post;
    this.restService.HttpPostParams = {};
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe(sucessResponse => {
      this.router.navigate(['/main']);
    }, errorResponse => {
      this.router.navigate(['/main']);
    }
    );
  }



}
