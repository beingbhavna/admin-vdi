import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { GlobalRestService } from 'src/app/services/rest/global-rest.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import {
  HandelError,
  Vdi,
} from 'src/app/shared/enumrations/app-enum.enumerations';

@Component({
  selector: 'app-vdi-filter',
  templateUrl: './vdi-filter.component.html',
  styleUrls: ['./vdi-filter.component.scss'],
})
export class VdiFilterComponent implements OnInit {
  public searchFilter: any = {};
  public vdiFormGroup: FormGroup;
  public _resetFlag = false;
  public _updateFilter = false;
  public VdiList = [];
  public vdiGuid: any;
  serverList: any = [];
  // public ip_name=[];
  // public vpn_name=[];
  // public connection_name=[];
  // public database_name=[];
  // public user_name=[];

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
  @Input() vdiName;

  set updatedFilter(updatedFilter: any) {
    this._updateFilter = updatedFilter;
  }
  constructor(
    private filterService: FilterService,
    private restService: GlobalRestService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.initFormGroup();
    this.getServerList();
    this.route.params.subscribe(
      (params: Params) => {
        this.vdiGuid = params['vdiGuid'];
        let filters = this.filterService.getFilter('vdiListFilter');
        if (filters === undefined) {
          this.filterService.addFilter('VdiList');
          filters = this.filterService.getFilter('vdiListFilter');
        }
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
    this.restService.ApiEndPointUrlOrKey = Vdi.getServerWiseFilterList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.ShowLoadingSpinner = true;
    this.restService.callApi().subscribe((sucessResponse) => {
      this.serverList = sucessResponse.server_list;
      this.vdiFormGroup.patchValue({
        server_name: this.serverList[0].id,
      });
      this.sendDataToListComponent();
    });
  }

  public initFormGroup() {
    this.vdiFormGroup = new FormGroup({
      ip_name: new FormControl(''),
      server_name: new FormControl(''),
      connection_name: new FormControl(''),
      user_name: new FormControl(''),
    });
  }

  onvdiFormSubmit() {
    if (this.vdiFormGroup.invalid) {
      return;
    } else {
      this.updateBubbleConfig(this.vdiFormGroup.value);
      this.updateSearchFilter();
      this.updateFilterService();
      this.sendDataToListComponent();
    }
  }

  private updateSearchFilter() {
    this.searchFilter.vdi = this.vdiFormGroup.value;
    for (let filter in this.searchFilter.vdi) {
      if (
        this.searchFilter.vdi[filter] == null ||
        this.searchFilter.vdi[filter] == ''
      ) {
        delete this.searchFilter.vdi[filter];
      }
    }
  }

  public updateFilterService() {
    let filters = this.filterService.getFilter('vdiListFilter');
    if (filters) {
      this.filterService.updateFilter(
        this.searchFilter.vdi,
        0,
        'vdiListFilter'
      );
    }
  }

  public sendDataToListComponent() {
    this.searchFilter.vdi = this.vdiFormGroup.value;
    this.updateEvent.emit(this.searchFilter);
  }

  resetFilters() {
    this.vdiFormGroup.reset();
    this.resetFormGroup();
    this.updateBubbleConfig(this.vdiFormGroup.value);
    this.sendDataToListComponent();
    this.updateFilterService();
  }
  resetFilterGroup() {
    this.resetFormGroup();
    this.searchFilter.servers = this.vdiFormGroup.value;
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
    this.vdiFormGroup.reset({
      vdi_name: '',
      ip_name: '',
      server_name: '',
      // database_name : '',
      connection_name: '',
      user_name: '',
    });
  }
}
