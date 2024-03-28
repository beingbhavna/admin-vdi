import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { MessageService } from 'ngx-i2k2-message-lib';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Vdi } from 'src/app/shared/enumrations/app-enum.enumerations';
import { RestMethods, HandelError } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
@Component({
  selector: 'app-vdi-add',
  templateUrl: './vdi-add.component.html',
  styleUrls: ['./vdi-add.component.scss'],
})
export class VdiAddComponent implements OnInit {
  public addVdiFormGroup: FormGroup;
  public serverType;
  public osType;
  private appRoutes: any = {};
  public vdiId: any;
  public dataVdiGroup;
  public vdiList: any;
  public serverList: any;
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
    debugger;
  }

  ngOnInit() {
    this.getServerList();
    this.initializeFields();
    //setting page title
    this.primaryHeader.pageTitle.next('VDI Add');
    this.dataVdiGroup = [];
    // this.getVdiType(); // get vdi type list
  }
  initializeFields() {
    this.addVdiFormGroup = new FormGroup(
      {
        user_name: new FormControl('', Validators.required),
        connection_name: new FormControl('', Validators.required),
        host_ip: new FormControl('', Validators.required),
        ostype_name: new FormControl('', Validators.required),
        user_password: new FormControl('', Validators.required),
        confirmedPassword: new FormControl('', Validators.required),
        server_type_id: new FormControl('', Validators.required),
      }
      // this.pwdMatchValidator
    );
  }

  // pwdMatchValidator(frm: FormGroup) {
  //   return frm.get('new_password').value === frm.get('confirm_password').value
  //     ? null : { 'mismatch': true };
  // }
  // addVdiList() {
  //   this.restService.ApiEndPointUrlOrKey = Vdi.addVdiDetails;
  //   this.restService.callApi().subscribe(
  //     (successResponse) => {
  //       console.log(successResponse);
  //       this.vdiList = successResponse.servers;
  //     },
  //   );
  // }
  getServerList() {
    let postParams = {
      servers_filter: {
        servers_filter: {
          server_name: '',
        },
        Cols: [],
        Paging: {
          total_rows: 0,
          returned_rows: 0,
          direction: 0,
          order_dir: '',
          page_size: 10,
          sort_by: '',
          last_offset: 0,
          last_seen_id_max: 0,
          last_seen_id_min: 0,
        },
      },
    };
    this.restService.HttpPostParams = postParams;
    this.restService.ApiEndPointUrlOrKey = Vdi.getServerWiseFilterList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi().subscribe((sucessResponse) => {
      this.serverList = sucessResponse.server_list;
    });
  }
  private getParams() {
    let formControls = this.addVdiFormGroup.controls;
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
  vdiFormSubmit() {
    if (this.addVdiFormGroup.valid === false) {
      const form = document.getElementById('addVdiForm');
      form.classList.add('was-validated');
      debugger;
      // return false;
    } else {
      let dataVar = {
        server_id: this.addVdiFormGroup.value.server_type_id,
        name: this.addVdiFormGroup.value.user_name,
        password_hash: this.addVdiFormGroup.value.user_password,
        connection_name: this.addVdiFormGroup.value.connection_name,
        hostname: this.addVdiFormGroup.value.host_ip,
        image_os_type: this.addVdiFormGroup.value.ostype_name,
      };
      this.restService.ApiEndPointUrlOrKey = Vdi.addVdiDetails;
      this.restService.HttpPostParams = dataVar;
      this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
      this.restService.callApi().subscribe(
        (sucessResponse) => {
          this.messageService
            .okRedirectModal(sucessResponse, 'SUCCESS', 'Go to List')
            .subscribe((result) => {
              this.reset();
              if (result == true) {
                // OK = true for redirection
                this.messageService.hideModal();
                this.router.navigate(['vdi']);
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
  reset() {
    this.addVdiFormGroup.reset({
      user_name: '',
      server_type_id: '',
      connection_name: '',
      ostype_name: '',
      user_password: '',
      confirmedPassword: '',
    });

    // this.dataVdiGroup = [];
    // this.originalUserGroups = [];
  }
}
