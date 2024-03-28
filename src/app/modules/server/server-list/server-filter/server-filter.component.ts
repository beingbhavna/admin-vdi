import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import {
  HandelError,
  Server,
} from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-server-filter',
  templateUrl: './server-filter.component.html',
  styleUrls: ['./server-filter.component.scss'],
})
export class ServerFilterComponent implements OnInit {
  public searchFilter: any = {};
  public serverFormGroup: FormGroup;
  public _resetFlag = false;
  public _updateFilter = false;
  public serverList = [];
  public serverGuid: any;
  @Output() updateEvent = new EventEmitter<{ searchFilterData: any }>();

  @Input() get resetFlter() {
    return this._resetFlag;
  }

  set resetFlter(flag: any) {
    this._resetFlag = flag;
    if (this._resetFlag) {
      this.resetFilterGroup();
    }
  }

  @Input() get updatedFilter() {
    return this._updateFilter;
  }
  @Input() serverName;
  set updatedFilter(updatedFilter: any) {
    this._updateFilter = updatedFilter;
    this.updateFilterFG();
  }

  constructor(
    private filterService: FilterService,
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {

        this.serverGuid = params['serverGuid'];
        let filters = this.filterService.getFilter('serverListFilter');
        if (filters === undefined) {
          this.filterService.addFilter('serverList');
          filters = this.filterService.getFilter('serverListFilter');
        }

        this.initFormGroup();
        this.getServerList();
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
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
    this.restService.ApiEndPointUrlOrKey = Server.getServerWiseFilterList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi().subscribe((sucessResponse) => {
      this.serverList = sucessResponse.server_list;
    });
  }

  ngOnChanges() {}

  public initFormGroup() {
    this.serverFormGroup = new FormGroup({
      // ip_address: new FormControl(''),
      // vpn_name: new FormControl(''),
      server_guid: new FormControl(''),
      // database_name: new FormControl(''),
    });
  }

  onServerFormSubmit() {
    if (this.serverFormGroup.invalid) {
      return;
    } else {
     
      this.updateBubbleConfig(this.serverFormGroup.value);
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.servers = this.serverFormGroup.value;
    for (let filter in this.searchFilter.servers) {
      if (
        this.searchFilter.servers[filter] == null ||
        this.searchFilter.servers[filter] == ''
      ) {
        delete this.searchFilter.servers[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter('serverListFilter');
    if (filters) {
      this.filterService.updateFilter(
        this.searchFilter.servers,
        0,
        'serverListFilter'
      );
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.servers = this.serverFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.resetFormGroup();
    this.serverFormGroup.reset();
    this.updateEvent.emit(this.searchFilter);
    this.searchFilter.servers = this.serverFormGroup.value;
    this.updateBubbleConfig(this.serverFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }

  updateFilterFG() {
    this.updateFilterService();
    this.initFormGroup();
  }

  resetFilterGroup() {
    this.resetFormGroup();
    this.searchFilter.servers = this.serverFormGroup.value;
    this.updateFilterService();
  }

  private updateBubbleConfig(ctrlVal: any) {
    this.searchFilter.bubbleConfig = {};
    for (let filter in ctrlVal) {
      if (
        ctrlVal[filter] !== null &&
        ctrlVal[filter] !== '' &&
        ctrlVal[filter] !== '-1'
      ) {
        this.searchFilter.bubbleConfig[filter] = ctrlVal[filter];
        if (filter == 'server') {
          let name = this.serverList.find(
            (x: any) => x.id == ctrlVal[filter]
          ).server_name;
          this.searchFilter.bubbleConfig[filter] = name;
      }
    }
  }
  }
  resetFormGroup() {
    this.serverFormGroup.reset({
      ip_address: '',
      vpn_name: '',
      server_guid: '',
      // database_name : '',
      // connection_name : '',
    });
  }
}
