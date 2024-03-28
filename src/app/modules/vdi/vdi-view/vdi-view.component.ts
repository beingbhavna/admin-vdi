import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppsettingsConfService } from 'src/app/services/conf/appsettings-conf/appsettings-conf.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Vdi } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-vdi-view',
  templateUrl: './vdi-view.component.html',
  styleUrls: ['./vdi-view.component.scss'],
})
export class VdiViewComponent implements OnInit {
  public vdiViewFormGroup: FormGroup;
  public vdiId: any;
  private appRoutes: any = {};
  vdiData: any;

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
    this.primaryHeader.pageTitle.next('Vdi View');
    this.vdiViewFormGroup = new FormGroup({
      server_name: new FormControl({ value: '', disabled: true }),
      connection_name: new FormControl({ value: '', disabled: true }),
      hostname: new FormControl({ value: '', disabled: true }),
      name: new FormControl({ value: '', disabled: true }),
      image_os_type: new FormControl({ value: '', disabled: true }),
    });
    this.route.params.subscribe((params: Params) => {
      this.vdiId = params['vdiId'];

      this.getSharedServiceData();

      this.getData();
    });
  }
  getSharedServiceData() {
    this.sharedService.vdiData.subscribe((vdiData) => {
      if (vdiData != null) {
        this.vdiData = vdiData;
      }
    });
  }

  // initializeFields(result) {
  //   this.restService.ApiEndPointUrlOrKey = Vdi.getVdiList;
  //   this.vdiViewFormGroup = new FormGroup({
  //     server_name: new FormControl({ value: result.user_name, disabled: true }),
  //     hostname: new FormControl(result.ostype_name, Validators.required),
  //     image_os_type: new FormControl(result.connection_name, Validators.required),
  //     connection_name: new FormControl(

  //     ),
  //   });
  // }

  getData() {
    var keyData = [
      {
        name: 'connectionId',
        value: this.vdiData.id,
      },
      {
        name: 'serverId',
        value: this.vdiData.server_id,
      },
    ];
    this.restService.ApiEndPointUrlOrKey = Vdi.getVdiListById;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi(keyData).subscribe(
      (sucessResponse) => {
        if (sucessResponse != null) {
          this.vdiViewFormGroup.patchValue({
            server_name: sucessResponse.vdi[0].server_name,
            hostname: sucessResponse.vdi[0].hostname,
            name: sucessResponse.vdi[0].name,
            image_os_type: sucessResponse.vdi[0].image_os_type,
            connection_name: sucessResponse.vdi[0].connection_name,
          });
        }
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
