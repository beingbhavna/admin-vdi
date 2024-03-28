import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'ngx-i2k2-message-lib';
import { NgxI2k2TableParams } from 'ngx-i2k2-table-lib';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Server } from 'src/app/shared/enumrations/app-enum.enumerations';
import { HandelError } from 'src/app/shared/models/app.models';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import bubbleConfig from './../../../../assets/config/bubbleConfig.json';
@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss'],
})
export class ServerListComponent implements OnInit {
  public serverList: any = [];
  public notFound: boolean = false;
  public itemCount = 0;
  public lastSeenIdMax = 0;
  public lastSeenIdMin = 0;
  public lastOffset = 0;
  public offset = 0;
  public paginationStyle = 'minimal';
  public config = bubbleConfig;
  public resetFilterFlag: boolean = false;
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
    this.primaryHeader.pageTitle.next('SERVERS LIST');
    this.getServerList();
  }

  private getServerList(serverName?) {
    this.resetFilterFlag = false;
    this.serverList = [];
    // call api code here...

    let postParams = {
      servers_filter: {
        servers_filter: {
          id: serverName,
          // server_name: serverName,
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
    this.restService.ApiEndPointUrlOrKey = Server.getServerWiseFilterList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi().subscribe((sucessResponse) => {
      this.serverList = sucessResponse.server_list;
       // if (serverName) {
      //         this.serverList = this.serverList.filter((item) => {
      //           return item.server_name
      //             .toUpperCase()
      //             .includes(serverName.toUpperCase());
      //         });
      //       }
      //       (errorResponse) => {
      //             if (errorResponse !== undefined) {
      //               this.sharedService.errorAlert(errorResponse);
      //             }
      //           }
    });
  }

  updateTable(serverName) {
    debugger
    this.config.data[0] = serverName.bubbleConfig;
    this.getServerList(serverName.servers.server_guid);

  }

  getServerFilteredList(serverId) {
    if (serverId == '' && serverId != undefined) {
      this.getServerList();
    } else {
      this.getServerList(serverId);
      // let keyData = [{ name: 'id', value: serverId }];
      // this.restService.ApiEndPointUrlOrKey = Server.getServerWiseList;
      // this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
      // this.restService.ShowLoadingSpinner = true;
      // this.restService.callApi(keyData).subscribe((sucessResponse) => {
      //   this.items = sucessResponse.server_list;
      // });
    }
  }
  public resetFilter() {
    this.resetFilterFlag = true;
    this.getServerList();
  }

  ngOnDestroy() {
    this.config.data = [];
    this.config.data.push({});
  }

  redirectAsPerAction(rowitem) {
    // console.log(rowitem.server_name)
    this.sharedService.serverName.next(rowitem.server_name);
    this.router.navigateByUrl('/server/' + rowitem.id + '/serverview');
  }
  back() {
    this.router.navigateByUrl('main');
  }
}
