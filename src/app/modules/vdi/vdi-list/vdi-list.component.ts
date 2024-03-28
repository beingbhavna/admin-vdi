import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'ngx-i2k2-message-lib';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Vdi } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import bubbleConfig from './../../../../assets/config/bubbleConfig.json';
@Component({
  selector: 'app-vdi-list',
  templateUrl: './vdi-list.component.html',
  styleUrls: ['./vdi-list.component.scss'],
})
export class VdiListComponent implements OnInit {
  public VdiList: any = [];
  public notFound: boolean = false;
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public paginationStyle = 'minimal';
  public config = bubbleConfig;
  public resetFilterFlag: boolean = false;
  public items: any = [];
  serverList: any = [];

  constructor(
    private authService: AuthService,
    private restService: GlobalRestService,
    private primaryHeader: PrimaryHeaderService,
    private sharedService: SharedService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    //setting page title
    this.primaryHeader.pageTitle.next('VDI List');
    this.getServerList();
  }

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

  private getVdiList(vdiData?) {
    this.resetFilterFlag = false;
    this.VdiList = [];
    let postParams = {
      vdis_filter: {
        vdis_filter: {
          connection_name: '',
          hostname: '',
          server_id: '',
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
    if (vdiData != undefined && vdiData != null) {
      postParams = {
        vdis_filter: {
          vdis_filter: {
            connection_name: vdiData.vdi.connection_name,
            hostname: vdiData.vdi.ip_name,
            server_id: vdiData.vdi.server_name,
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
    }

    //call api code here...
    this.restService.ApiEndPointUrlOrKey = Vdi.getVdiWiseFilterList;
    this.restService.HttpPostParams = postParams;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi().subscribe(
      (sucessResponse) => {
        this.items = sucessResponse.vdi_list;
        this.items.forEach((element) => {
          this.serverList.forEach((serverElement) => {
            if (serverElement.id == element.server_id) {
              element.server_name = serverElement.server_name;
            }
          });
        });
      },
      (errorResponse) => {
        this.items = [];
        if (errorResponse !== undefined) {
          this.sharedService.errorAlert(errorResponse);
        }
      }
    );
  }

  updateTable(data) {
    this.config.data[0] = data.bubbleConfig;
    if (data.vdi.server_name != '' && data.vdi.server_name != undefined) {
      this.getVdiList(data);
    } else {
      this.items = [];
    }
  }

  reset2FA(data) {
    this.messageService
      .confirm(
        ['Are you sure you want to reset password'],
        'Confirmation',
        'Yes',
        'No'
      )
      .subscribe((result) => {
        if (result == true) {
          // Api call for reset 2FA getReset2FA

          var keyData = [
            {
              name: 'userId',
              value: data.user_id,
            },
            {
              name: 'userName',
              value: data.name,
            },
          ];
          debugger;
          this.restService.ApiEndPointUrlOrKey = Vdi.reset2FA;
          this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
          this.restService.callApi(keyData).subscribe((sucessResponse) => {});
          this.messageService.hideModal();
        } else {
          this.messageService.hideModal();
        }
      });
  }

  disableVdi(data) {
    var keyData = [
      {
        name: 'userid',
        value: data.user_id,
      },
      // {
      //   name: 'id',
      //   value: data.id,
      // },
    ];
    debugger;
    this.restService.ApiEndPointUrlOrKey = Vdi.disableVdi;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData).subscribe((sucessResponse) => {});
  }

  public resetFilter() {
    this.resetFilterFlag = true;
    this.items = [];
    // this.getVdiList();
  }

  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }
  vdiEdit(rowitem) {
    this.sharedService.vdiData.next(rowitem);
    this.router.navigateByUrl('/vdi/' + rowitem.id + '/vdiedit');
  }
  redirectAsPerAction(rowitem) {
    this.sharedService.vdiData.next(rowitem);
    this.router.navigateByUrl('/vdi/' + rowitem.id + '/vdiview');
  }
  back() {
    this.router.navigateByUrl('main');
  }
}
