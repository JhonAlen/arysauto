import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@services/authentication.service';
import { WebServiceConnectionService } from '@services/web-service-connection.service';

@Component({
  selector: 'app-collection-order-fleet-contract-index',
  templateUrl: './collection-order-fleet-contract-index.component.html',
  styleUrls: ['./collection-order-fleet-contract-index.component.css']
})
export class CollectionOrderFleetContractIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  clientList: any[] = [];
  collectionOrderFleetContractList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private webService: WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.search_form = this.formBuilder.group({
      ccliente: [''],
      ifacturacion: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 92
      }
      let request = await this.webService.securityVerifyModulePermission(params);
      if(request.error){
        request.condition && request.conditionMessage == 'user-dont-have-permissions' ? this.router.navigate([`/permission-error`]) : false;
        this.alert.message = request.message;
        this.alert.type = 'danger';
        this.alert.show = true;
        return;
      }
      if(request.data.status){
        !request.data.bindice ? this.router.navigate([`/permission-error`]) : false;
        this.initializeDropdownDataRequest();
      }
      return;
    }
  }

  async initializeDropdownDataRequest(): Promise<void>{
    let params = { 
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    let request = await this.webService.valrepClient(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      for(let i = 0; i < request.data.list.length; i++){
        this.clientList.push({ id: request.data.list[i].ccliente, value: request.data.list[i].xcliente });
      }
      this.clientList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    return;
  }

  async onSubmit(form): Promise<void>{
    this.submitted = true;
    this.loading = true;
    if(this.search_form.invalid){
      this.loading = false;
      return;
    }
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 92
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccliente: form.ccliente ? form.ccliente : undefined,
      ifacturacion: form.ifacturacion ? form.ifacturacion : undefined
    }
    let request = await this.webService.searchCollectionOrderFleetContract(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      this.collectionOrderFleetContractList = [];
      for(let i = 0; i < request.data.list.length; i++){
        this.collectionOrderFleetContractList.push({ 
          csolicitudcobrocontratoflota: request.data.list[i].csolicitudcobrocontratoflota,
          xcliente: request.data.list[i].xcliente,
          xestatusgeneral: request.data.list[i].xestatusgeneral,
          xfacturacion: request.data.list[i].ifacturacion == 'G' ? this.translate.instant("DROPDOWN.GLOBAL") : this.translate.instant("DROPDOWN.INDIVIDUAL"),
          xactivo: request.data.list[i].bactivo ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
        });
      }
    }
    this.loading = false;
    return;
  }

  rowClicked(event: any){
    this.router.navigate([`administration/collection-order-fleet-contract-detail/${event.data.csolicitudcobrocontratoflota}`]);
  }

}
