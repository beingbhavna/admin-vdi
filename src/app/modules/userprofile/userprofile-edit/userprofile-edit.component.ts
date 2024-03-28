import { Component, OnInit } from '@angular/core';
import { Security } from './../../../shared/enumrations/app-enum.enumerations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HandelError } from './../../../shared/models/app.models';
import { PrimaryHeaderService } from './../../layout/primary-header/primary-header.service';
import { MessageService } from 'ngx-i2k2-message-lib';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { ActivatedRoute, Router, Params } from '@angular/router';


@Component({
  selector: 'app-userprofile-edit',
  templateUrl: './userprofile-edit.component.html',
  styleUrls: ['./userprofile-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  public editOrgsUserFormGroup: FormGroup;
  public orgId;

  userId;
  public dataUserType;
  orginalData;

  dataPermissions;
  dataAddedPermissions;
  originalPermissionsData: Array<any>;
  originalAdeddPermissions: Array<any>;
  resetPermissionsUnassigned;
  searchUserModal;
  searchAddedUserModal;
  resetPermissions;

  private appRoutes: any = {};

  constructor(private route: ActivatedRoute, private restService: GlobalRestService, private authService: AuthService,
    private configService: AppsettingsConfService, private messageService: MessageService, private router: Router,
    private primaryHeader: PrimaryHeaderService) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(configData => {
      this.appRoutes = configData;
    }, error => {
      console.error('Error for configService.getAppRoutes: ', error);
    });
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Profile Edit");
    this.dataPermissions = [];///
    this.dataAddedPermissions = [];
    this.originalAdeddPermissions = [];
    this.editOrgsUserFormGroup = new FormGroup({
      user_name: new FormControl({ value: '', disabled: true }),
      email: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]),
      user_type_id: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      user_type: new FormControl('', Validators.required),
      app_id: new FormControl('', Validators.required),
      first_name: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      middle_name: new FormControl('', Validators.required),
      phone_number: new FormControl(''),
      title: new FormControl('', Validators.required),
      org_name: new FormControl('')
    });
    this.orgId = this.authService.getUserOrgId();
    this.route.params.subscribe((params: Params) => {
      this.getData(this.orgId, this.authService.getCustomerUserId());
    });
  }

  private getParams() {
    let params = this.editOrgsUserFormGroup.value;
    params['user_id'] = this.userId;
    params['unassign_permissions'] = this.originalPermissionsData;
    params['assign_permissions'] = this.originalAdeddPermissions;

    return params;

  }

  onformSubmit() {
    if (this.editOrgsUserFormGroup.valid === false) {
      let form = document.getElementById('editOrgsUserForm');
      form.classList.add('was-validated');
      debugger
    } else if (this.editOrgsUserFormGroup.valid === true) {
      let params = this.getParams();
      // call api code here...
      if (Object.keys(this.appRoutes).length !== 0) {
        var keyData = [
          {
            "name": "orgId",
            "value": this.orgId
          },
          {
            "name": "userId",
            "value": this.userId
          }
        ];
        this.restService.ApiEndPointUrlOrKey = Security.saveEditedOrgsUser;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
        this.restService.callApi(keyData)
          .subscribe(successResponse => {
            this.messageService.okRedirectModal(successResponse, 'SUCCESS', 'Go to List').subscribe(result => {
              if (result == true) { // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['main']);
              }
              else { // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
          }, errorResponse => {
          }
          );
      }
    }
  }


  initializeFields(result) {
    this.editOrgsUserFormGroup = new FormGroup({
      user_name: new FormControl(result.user_name, Validators.required),
      email: new FormControl(result.email, Validators.required),
      phone_number: new FormControl(result.phone_number,),
      mobile: new FormControl(result.mobile, [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]),
      user_type_id: new FormControl(result.user_type_id, Validators.required),
      status: new FormControl(result.status, Validators.required),
      user_type: new FormControl(result.user_type, Validators.required),
      app_id: new FormControl(result.app_id, Validators.required),
      first_name: new FormControl(result.first_name, Validators.required),
      id: new FormControl(result.id, Validators.required),
      last_name: new FormControl(result.last_name, Validators.required),
      middle_name: new FormControl(result.middle_name, Validators.required),
      title: new FormControl(result.title, Validators.required),
      org_name: new FormControl(result.org_name)
    });
    this.userId = result.id;
  }
  initializePermissions(result) {
    if (result.unassign_permission_groups != undefined) {
      this.dataPermissions = result.unassign_permission_groups;
      this.originalPermissionsData = Object.assign([], this.dataPermissions);
    }
    if (result.assign_permission_groups != undefined) {
      this.dataAddedPermissions = result.assign_permission_groups;
      this.originalAdeddPermissions = Object.assign([], this.dataAddedPermissions);
    }
  }

  getData(orgID, userID) {
    var keyData = [
      {
        "name": "userId",
        "value": userID
      }
    ];
    this.restService.ApiEndPointUrlOrKey = Security.getUserDataByUserId;
    this.restService.callApi(keyData).subscribe(successResponse => {
      this.initializeFields(successResponse.customer_users[0]);
      this.initializePermissions(successResponse);

    }, errorResponse => {
      // console.error('ERROR: ', errorResponse.message[0]);
    });
  }

  // allow only numbers
  public checkInput(event) {
    var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey;  // get key cross-browser
    var charCode = (event.which) ? event.which : event.keyCode;      // get key cross-browser

    if ( // Allow: home, end, left, right, down, up
      (charCode >= 35 && charCode <= 40)
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      || (charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
      return true;
    }
    if (charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      return true
    }
  }
  ngOnDestroy() {
  }

}
