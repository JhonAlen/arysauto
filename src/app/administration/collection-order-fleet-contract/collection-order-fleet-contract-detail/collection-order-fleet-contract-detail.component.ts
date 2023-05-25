import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CollectionOrderFleetContractPaymentComponent } from '@app/pop-up/collection-order-fleet-contract-payment/collection-order-fleet-contract-payment.component';
import { WebServiceConnectionService } from '@services/web-service-connection.service';
import { AuthenticationService } from '@services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-collection-order-fleet-contract-detail',
  templateUrl: './collection-order-fleet-contract-detail.component.html',
  styleUrls: ['./collection-order-fleet-contract-detail.component.css']
})
export class CollectionOrderFleetContractDetailComponent implements OnInit {

  private paymentGridApi;
  sub;
  currentUser;
  detail_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  clientList: any[] = [];
  generalStatusList: any[] = [];
  fleetContractList: any[] = [];
  paymentList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  paymentDeletedRowList: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService: AuthenticationService, 
              private router: Router,
              private modalService: NgbModal,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private webService : WebServiceConnectionService) { }

  async ngOnInit(): Promise<void> {
    this.detail_form = this.formBuilder.group({
      ccliente: [''],
      ifacturacion: [''],
      cestatusgeneral: [''],
      bactivo: [true]
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
        this.canCreate = request.data.bcrear;
        this.canDetail = request.data.bdetalle;
        this.canEdit = request.data.beditar;
        this.canDelete = request.data.beliminar;
        this.initializeDetailModule();
      }
    }
  }

  async initializeDetailModule(): Promise<void>{
    let clientParams = { 
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    let clientRequest = await this.webService.valrepClient(clientParams);
    if(clientRequest.error){
      this.alert.message = clientRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(clientRequest.data.status){
      for(let i = 0; i < clientRequest.data.list.length; i++){
        this.clientList.push({ id: clientRequest.data.list[i].ccliente, value: clientRequest.data.list[i].xcliente });
      }
      this.clientList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    let generalStatusParams = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cmodulo: 92
    }
    let generalStatusRequest = await this.webService.valrepGeneralStatus(generalStatusParams);
    if(generalStatusRequest.error){
      this.alert.message = generalStatusRequest.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(generalStatusRequest.data.status){
      for(let i = 0; i < generalStatusRequest.data.list.length; i++){
        this.generalStatusList.push({ id: generalStatusRequest.data.list[i].cestatusgeneral, value: generalStatusRequest.data.list[i].xestatusgeneral });
      }
      this.generalStatusList.sort((a,b) => a.value > b.value ? 1 : -1);
    }
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.detail_form.get('ccliente').disable();
        this.detail_form.get('ifacturacion').disable();
        this.getCollectionOrderFleetContractData();
        if(this.canEdit){ this.showEditButton = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.editStatus = true;
        this.showSaveButton = true;
      }
    });
    return;
  }

  async getCollectionOrderFleetContractData(): Promise<void>{
    let params = {
      permissionData: {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 92
      },
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      csolicitudcobrocontratoflota: this.code
    };
    let request = await this.webService.detailCollectionOrderFleetContract(params);
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      this.detail_form.get('ccliente').setValue(request.data.ccliente);
      this.detail_form.get('ifacturacion').setValue(request.data.ifacturacion);
      this.detail_form.get('ifacturacion').disable();
      this.detail_form.get('cestatusgeneral').setValue(request.data.cestatusgeneral);
      this.detail_form.get('cestatusgeneral').disable();
      this.detail_form.get('bactivo').setValue(request.data.bactivo);
      this.detail_form.get('bactivo').disable();
      this.fleetContractList = [];
      if(request.data.suscriptions){
        for(let i =0; i < request.data.suscriptions.length; i++){
          this.fleetContractList.push({
            cgrid: i,
            ccontratoflota: request.data.suscriptions[i].ccontratoflota,
            xplaca: request.data.suscriptions[i].xplaca,
            xmarca: request.data.suscriptions[i].xmarca,
            xmodelo: request.data.suscriptions[i].xmodelo,
            xversion: request.data.suscriptions[i].xversion
          });
        }
      }
      this.paymentList = [];
      if(request.data.payments){
        for(let i =0; i < request.data.payments.length; i++){
          this.paymentList.push({
            cgrid: i,
            create: false,
            cpago: request.data.payments[i].cpago,
            mpago: request.data.payments[i].mpago,
            bpagado: request.data.payments[i].bpagado,
            xpagado: request.data.payments[i].bpagado ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
        }
      }
    }
    this.loading_cancel = false;
  }

  editCollectionOrderFleetContract(){
    this.detail_form.get('cestatusgeneral').enable();
    this.detail_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
    this.editStatus = true;
  }

  cancelSave(){
    if(this.code){
      this.loading_cancel = true;
      this.showSaveButton = false;
      this.editStatus = false;
      this.showEditButton = true;
      this.getCollectionOrderFleetContractData();
    }else{
      this.router.navigate([`/administration/collection-order-fleet-contract-index`]);
    }
  }

  addPayment(){
    let payment = { type: 3 };
    const modalRef = this.modalService.open(CollectionOrderFleetContractPaymentComponent);
    modalRef.componentInstance.payment = payment;
    modalRef.result.then((result: any) => { 
      if(result){
        if(result.type == 3){
          this.paymentList.push({
            cgrid: this.paymentList.length,
            create: true,
            mpago: result.mpago,
            bpagado: result.bpagado,
            xpagado: result.bpagado ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
          });
          this.paymentGridApi.setRowData(this.paymentList);
        }
      }
    });
  }

  paymentRowClicked(event: any){
    let payment = {};
    if(this.editStatus){ 
      payment = { 
        type: 1,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cpago: event.data.cpago,
        mpago: event.data.mpago,
        bpagado: event.data.bpagado,
        delete: false
      };
    }else{ 
      payment = { 
        type: 2,
        create: event.data.create, 
        cgrid: event.data.cgrid,
        cpago: event.data.cpago,
        mpago: event.data.mpago,
        bpagado: event.data.bpagado,
        delete: false
      }; 
    }
    const modalRef = this.modalService.open(CollectionOrderFleetContractPaymentComponent);
    modalRef.componentInstance.payment = payment;
    modalRef.result.then((result: any) => {
      if(result){
        if(result.type == 1){
          for(let i = 0; i < this.paymentList.length; i++){
            if(this.paymentList[i].cgrid == result.cgrid){
              this.paymentList[i].mpago = result.mpago;
              this.paymentList[i].bpagado = result.bpagado;
              this.paymentList[i].xpagado = result.bpagado ? this.translate.instant("DROPDOWN.YES") : this.translate.instant("DROPDOWN.NO")
              this.paymentGridApi.refreshCells();
              return;
            }
          }
        }else if(result.type == 4){
          if(result.cpago){
            this.paymentDeletedRowList.push({ cpago: result.cpago });
          }
          this.paymentList = this.paymentList.filter((row) => { return row.cgrid != result.cgrid });
          for(let i = 0; i < this.paymentList.length; i++){
            this.paymentList[i].cgrid = i;
          }
          this.paymentGridApi.setRowData(this.paymentList);
        }
      }
    });
  }

  onPaymentsGridReady(event){
    this.paymentGridApi = event.api;
  }

  async onSubmit(form): Promise<void>{
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }
    let params;
    let request;
    if(this.code){
      let updatePaymentList = this.paymentList.filter((row) => { return !row.create; });
      for(let i = 0; i < updatePaymentList.length; i++){
        delete updatePaymentList[i].cgrid;
        delete updatePaymentList[i].create;
        delete updatePaymentList[i].xpagado;
      }
      let createPaymentList = this.paymentList.filter((row) => { return row.create; });
      for(let i = 0; i < createPaymentList.length; i++){
        delete createPaymentList[i].cgrid;
        delete createPaymentList[i].create;
        delete createPaymentList[i].xpagado;
      }
      params = {
        permissionData: {
          cusuario: this.currentUser.data.cusuario,
          cmodulo: 92
        },
        csolicitudcobrocontratoflota: this.code,
        cpais: this.currentUser.data.cpais,
        ccompania: this.currentUser.data.ccompania,
        cestatusgeneral: form.cestatusgeneral,
        bactivo: form.bactivo,
        cusuariomodificacion: this.currentUser.data.cusuario,
        payments: {
          create: createPaymentList,
          update: updatePaymentList,
          delete: this.paymentDeletedRowList
        }
      };
      request = await this.webService.updateCollectionOrderFleetContract(params);
    }
    if(request.error){
      this.alert.message = request.message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
      return;
    }
    if(request.data.status){
      if(this.code){
        location.reload();
      }
    }
    this.loading = false;
    return;
  }

}
