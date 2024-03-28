import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { Server } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-server-view',
  templateUrl: './server-view.component.html',
  styleUrls: ['./server-view.component.scss'],
})
export class ServerViewComponent implements OnInit {
  public serverViewFormGroup: FormGroup;
  public serverId: any;
  private appRoutes: any = {};
  public server_type_id: any;
  public connection_name: any;
  public user_name: any;
  public password: any;
  public confirmedPassword: any;
  public ostype_name: any;
  server_name: any;

  constructor(
    private route: ActivatedRoute,
    private restService: GlobalRestService,
    private authService: AuthService,
    private configService: AppsettingsConfService,
    private primaryHeader: PrimaryHeaderService,
    public sharedService: SharedService
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
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next('Server View');
    this.serverViewFormGroup = new FormGroup({
      server_name: new FormControl({ value: '', disabled: true }),
      vpn_name: new FormControl({ value: '', disabled: true }),
      ip_address: new FormControl({ value: '', disabled: true }),
      database_name: new FormControl({ value: '', disabled: true }),
    });
    this.route.params.subscribe((params: Params) => {
      this.serverId = params['serverId'];
      this.getData();
    });
  }

  initializeFields(result) {
    this.restService.ApiEndPointUrlOrKey = Server.getServerList;
    this.serverViewFormGroup = new FormGroup({
      server_name: new FormControl({ value: result.user_name, disabled: true }),
      vpn_name: new FormControl(result.ostype_name, Validators.required),
      ip_address: new FormControl(result.connection_name, Validators.required),
      database_name: new FormControl(
        result.server_type_id,
        Validators.required
      ),
    });

  }

 getData() {
    var keyData = [
      {
        name: 'id',
        value: this.serverId,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Server.getServerListById;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        this.serverViewFormGroup.patchValue({
          server_name: sucessResponse.server_list[0].server_name,
          vpn_name: sucessResponse.server_list[0].vpn,
          ip_address: sucessResponse.server_list[0].ip,
          database_name: sucessResponse.server_list[0].database,
        });
      },
      (errorResponse) => {
        if (errorResponse !== undefined) {
          this.sharedService.errorAlert(errorResponse);
        }
      }
    );
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
  }
}
