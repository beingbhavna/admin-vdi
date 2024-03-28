import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-i2k2-message-lib';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { HandelError } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { Server } from '../../../shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-server-add',
  templateUrl: './server-add.component.html',
  styleUrls: ['./server-add.component.scss']
})
export class ServerAddComponent implements OnInit {

  @ViewChild('tabset', { static: true }) tabset: TabsetComponent;
  public addServerFormGroup: FormGroup;
  public addEvaluterDetailsForm: FormGroup;
  public dataUserType;
  public titleList: any;
  public userTypeId: any;
  private appRoutes: any = {};
  public serverId: any;
  public userTypeDesc = '';
  public dataServerGroups;
  public dataAddedUserGroups;
  public originalUserGroups: Array<any>;
  public originalAddedUserGroups: Array<any>;
  public searchUserGroupsModal: any;
  public searchAddedUserGroupsModal: any;
  public examList: any;

  public identityTypeList: any;
  public isShowIdentityType: any;
  public imageBase64: any;

  constructor(
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private authService: AuthService,
    private configService: AppsettingsConfService,
    private messageService: MessageService,
    private router: Router,
    private primaryHeader: PrimaryHeaderService
  ) {
    this.restService.ShowLoadingSpinner = true;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.configService.getAppRoutes.subscribe(
      (configData) => {
        this.appRoutes = configData;
      },
      (error) => {
        console.error('Error for configService.getAppRoutes: ', error);
      }
    );
    debugger
  }

  ngOnInit() {
    // this.serverId = this.authService.getOSMExamId();
    //setting page title
    this.getServerList();
    this.initilizeEvaluterDetails();
    this.primaryHeader.pageTitle.next('Server Add');

    this.dataServerGroups = [];
    this.dataAddedUserGroups = [];
    this.originalAddedUserGroups = [];
    this.addServerFormGroup = new FormGroup({
      exam_id: new FormControl(''),
      user_name: new FormControl('', Validators.required),
      connection_name: new FormControl('', Validators.required),
      ostype_name: new FormControl('', Validators.required),
      user_password: new FormControl(''),
      confirmedPassword: new FormControl(''),
      server_type_id: new FormControl(''),
    });
    this.getUserType(); // get user type list
  }

  getServerList() {
    this.restService.ApiEndPointUrlOrKey = Server.getServerList;
    this.restService.callApi().subscribe(
      (successResponse) => {
        console.log(successResponse);
        this.examList = successResponse.servers;
      },
      (errorResponse) => {
        // console.error('ERROR: ', errorResponse.message[0]);
      }
    );
  }
  getUserType() {
    // Get User Type List
    // this.restService.ApiEndPointUrlOrKey = Server.getUserTypeList;
    this.restService.callApi().subscribe(
      (successResponse) => {
        this.dataUserType = successResponse.user_type;
      },
      (errorResponse) => {
        // console.error('ERROR: ', errorResponse.message[0]);
      }
    );
  }
  // public getPermissions(userTypeId) {
  //   this.originalUserGroups = []
  //   this.dataAddedUserGroups = [];
  //   this.originalAddedUserGroups = [];
  //   this.userTypeDesc = this.dataUserType.filter(it => it.id == userTypeId)[0].user_type_desc;

  //   this.userTypeId = userTypeId;

  //   var keyData = [
  //     {
  //       "name": "userTypeId",
  //       "value": userTypeId
  //     }
  //   ];

  //   this.restService.ApiEndPointUrlOrKey = Servers.getUserPermissionGroupsByUserId;
  //   this.restService.callApi(keyData).subscribe(successResponse => {
  //     if (userTypeId == 1) { //-----    1-> Admin
  //       this.dataAddedUserGroups = successResponse.server_type_id;
  //       this.originalAddedUserGroups = Object.assign([], this.dataAddedUserGroups);
  //       this.dataServerGroups = [];
  //     } else {
  //       this.dataServerGroups = successResponse.server_type_id;
  //       this.originalUserGroups = Object.assign([], this.dataServerGroups);
  //       //-- on change user type - Reset Selected Permission Groups Table
  //       this.dataAddedUserGroups = [];
  //       this.originalAddedUserGroups = [];
  //       //------------------------------------------------------------------------
  //     }

  //   }, errorResponse => {
  //     console.error('ERROR: ', errorResponse.message[0]);
  //   });

  // }

  private getParams() {
    let formControls = this.addServerFormGroup.controls;
    let params = {
      id: '',
      user_id: '',
      server_type_id: formControls.server_type_id.value,
      ostype_name: formControls.ostype_name.value,
      user_name: formControls.user_name.value,
      connection_name: formControls.connection_name.value,
      password: formControls.user_password.value,
      new_password: '',
      confirm_password: formControls.confirmedPassword.value,
    };

    return params;
  }
  private getEvaluterParams() {
    let formControls: any = this.addEvaluterDetailsForm.controls;

    // let language_guid: any = [];
    // let languages = formControls.language_guid.value;
    // for (let i = 0; i < languages.length; i++) {
    //   language_guid.push({
    //     language_guid: languages[i],
    //   });
    // }

    // let subject_guid: any = [];
    // let subjects = formControls.subject_guid.value;
    // for (let i = 0; i < subjects.length; i++) {
    //   subject_guid.push({
    //     subject_guid: subjects[i],
    //   });
    // }

    let params = {
      evaluator_Code: formControls.code.value,
      // organization_Guid: formControls.organization_id.value,
      // department_guid: formControls.department_guid.value,
      // designation_Guid: formControls.designation_guid.value,
      // height_qualification_guid: formControls.height_qualification_guid.value,

      // evaluter_subjects: subject_guid,
      // evaluter_language: language_guid,

      // experience: formControls.experience.value,
      // rating: formControls.rating.value,
      identity_Type_guid: formControls.identity_Type_guid.value,
      // alternate_mobile_number: formControls.alternate_mobile_number.value,

      photo: this.imageBase64,
    };

    return params;
  }

  onformSubmit() {
    if (this.addServerFormGroup.valid === false) {
      let form = document.getElementById('addServerForm');
      form.classList.add('was-validated');
    } else if (this.addServerFormGroup.valid === true) {
      if (this.userTypeId == 8) {
        // this.tabset.tabs[1].active = true;
        return;
      }

      let user = this.getParams();
      let evaluuserter: any = this.getEvaluterParams();

      let dataParam = Object.assign({}, user, evaluuserter, {
        evaluator_Type: false,
      });

      this.submitUser(dataParam);
    }
  }

  onEvaluterFormSubmit() {
    if (this.addEvaluterDetailsForm.value.identity_number0) {
      this.addEvaluterDetailsForm.controls.identity_number.patchValue(
        this.addEvaluterDetailsForm.value.identity_number0
      );
    } else if (this.addEvaluterDetailsForm.value.identity_number1) {
      this.addEvaluterDetailsForm.controls.identity_number.patchValue(
        this.addEvaluterDetailsForm.value.identity_number1
      );
    } else if (this.addEvaluterDetailsForm.value.identity_number2) {
      this.addEvaluterDetailsForm.controls.identity_number.patchValue(
        this.addEvaluterDetailsForm.value.identity_number2
      );
    } else if (this.addEvaluterDetailsForm.value.identity_number3) {
      this.addEvaluterDetailsForm.controls.identity_number.patchValue(
        this.addEvaluterDetailsForm.value.identity_number3
      );
    }

    if (this.addServerFormGroup.valid === false) {
      let form = document.getElementById('addServerForm');
      form.classList.add('was-validated');

      // this.tabset.tabs[0].active = true;
      return;
    } else if (this.addEvaluterDetailsForm.valid === false) {
      let form = document.getElementById('addEvaluterDetailsForm');
      form.classList.add('was-validated');
    } else {
      let user: any = this.getParams();
      let evaluuserter: any = this.getEvaluterParams();

      let dataParam = Object.assign({}, user, evaluuserter, {
        evaluator_Type: 'EVALUATOR',
      });

      this.submitUser(dataParam);
    }
  }

  submitUser(dataVar: any) {
    if (Object.keys(this.appRoutes).length !== 0) {
      var keyData = [
        {
          name: 'serverId',
          value: this.serverId,
        },
      ];
      // this.restService.ApiEndPointUrlOrKey = Servers.saveUser;
      this.restService.HttpPostParams = dataVar;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi(keyData).subscribe(
        (sucessResponse) => {
          this.messageService
            .okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List')
            .subscribe((result) => {
              this.reset();
              if (result == true) {
                // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['osm/user']);
              } else {
                // NO/CANCEL = false
                this.messageService.hideModal();
              }
            });
        },
        (error) => {
          this.messageService.alert(error.httpErrorResponse);
        }
      );
    }
  }

  changeListener($event): void {
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imageBase64 = myReader.result;
      // console.log(myReader.result);
    };
    myReader.readAsDataURL(file);
  }

  onChange(value: any) {
    if (value) {
      this.addEvaluterDetailsForm.controls.identity_number0.patchValue('');
      this.addEvaluterDetailsForm.controls.identity_number1.patchValue('');
      this.addEvaluterDetailsForm.controls.identity_number2.patchValue('');
      this.addEvaluterDetailsForm.controls.identity_number3.patchValue('');
      let isShowIdentity = this.identityTypeList.filter(
        (item) => item.identity_type_guid == value
      )[0];
      this.isShowIdentityType = isShowIdentity.name;
    } else {
      this.isShowIdentityType = '';
    }
  }
debugger
  reset() {
    this.addServerFormGroup.reset({
      user_name: '',
      server_type_id: '',
      connection_name: '',
      ostype_name: '',
      user_password: '',
      confirmedPassword: '',
    });

    this.dataServerGroups = [];
    this.originalUserGroups = [];
    //Assigned
    // this.dataAddedUserGroups = [];
    // this.originalAddedUserGroups = [];
    // this.dataAddedUserGroups = Object.assign([], this.originalAddedUserGroups);
    //
  }

  // Filtering the search inputs
  doFilterEvents(data) {
    data = data.toLowerCase();
    if (this.originalUserGroups) {
      this.dataServerGroups = this.originalUserGroups.filter(
        (it) =>
          it.group_name.toLowerCase().includes(data) ||
          it.group_desc.toLowerCase().includes(data)
      );
    }
  }

  doFilterWorkFlow(data) {
    data = data.toLowerCase();
    if (this.originalAddedUserGroups) {
      this.dataAddedUserGroups = this.originalAddedUserGroups.filter(
        (it) =>
          it.group_name.toLowerCase().includes(data) ||
          it.group_desc.toLowerCase().includes(data)
      );
    }
  }

  add(group, i) {
    this.dataServerGroups.splice(i, 1);
    this.dataAddedUserGroups.push({
      group_id: group.group_id,
      group_name: group.group_name,
      group_desc: group.group_desc,
    });
    const indexInoriginalUserGroups = this.originalUserGroups.indexOf(group);
    this.originalUserGroups.splice(indexInoriginalUserGroups, 1); //removing it from the original data right table

    if (this.searchUserGroupsModal !== '') {
      this.searchUserGroupsModal = '';
      this.doFilterEvents(this.searchUserGroupsModal);
    }
    this.searchAddedUserGroupsModal = '';
    this.originalAddedUserGroups.push(group);
    if (this.searchAddedUserGroupsModal !== undefined) {
      this.doFilterWorkFlow(this.searchAddedUserGroupsModal);
    }
  }

  revert(addedGroup, i) {
    this.dataAddedUserGroups.splice(i, 1);
    this.originalUserGroups.push({
      group_id: addedGroup.group_id,
      group_name: addedGroup.group_name,
      group_desc: addedGroup.group_desc,
    });
    this.searchUserGroupsModal = '';
    let index = this.originalUserGroups.indexOf(addedGroup);
    this.dataServerGroups.splice(index, 0, addedGroup);
    const indexInoriginalAddedUserGroups =
      this.originalAddedUserGroups.indexOf(addedGroup);
    this.originalAddedUserGroups.splice(indexInoriginalAddedUserGroups, 1); //removing it from the original Added data Left table
    if (this.searchUserGroupsModal !== undefined) {
      this.doFilterEvents(this.searchUserGroupsModal);
    }

    if (this.searchAddedUserGroupsModal !== '') {
      this.searchAddedUserGroupsModal = '';
      this.doFilterWorkFlow(this.searchAddedUserGroupsModal);
    }
  }

  // allow only numbers
  public checkInput(event) {
    var ctrlCode = event.ctrlKey ? event.ctrlKey : event.metaKey; // get key cross-browser
    var charCode = event.which ? event.which : event.keyCode; // get key cross-browser

    if (
      // Allow: home, end, left, right, down, up
      (charCode >= 35 && charCode <= 40) ||
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      ((charCode == 65 || charCode == 86 || charCode == 67) &&
        ctrlCode === true)
    ) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      return true;
    }
    //this.commonClass.isNumbers(event, event.target, false);
  }

  initilizeEvaluterDetails() {
    this.addEvaluterDetailsForm = new FormGroup({
    //   code: new FormControl('', Validators.required),
    //   title: new FormControl('Mr', Validators.required),

    //   language_guid: new FormControl('', Validators.required),
    //   identity_Type_guid: new FormControl('', Validators.required),
    //   identity_number: new FormControl('', Validators.required),
    //   identity_number0: new FormControl('', [
    //     Validators.pattern('^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$'),
    //   ]),
    //   identity_number1: new FormControl('', [
    //     Validators.pattern(
    //       '^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$'
    //     ),
    //   ]),
    //   identity_number2: new FormControl('', [
    //     Validators.pattern('^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$'),
    //   ]),
    //   identity_number3: new FormControl('', [
    //     Validators.pattern(
    //       '[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}'
    //     ),
    //   ]),

    //   //mobile_number: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{9}')]),
    //   alternate_mobile_number: new FormControl('', [
    //     Validators.pattern('[6-9][0-9]{9}'),
    //   ]),
    //   rating: new FormControl('', Validators.required),
    });
  }
}
