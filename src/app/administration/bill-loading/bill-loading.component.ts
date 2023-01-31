import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BillLoadingServiceOrderComponent } from '@app/pop-up/bill-loading-service-order/bill-loading-service-order.component';
import { BillLoadingSettlementComponent } from '@app/pop-up/bill-loading-settlement/bill-loading-settlement.component';
import { AdministrationBillLoadingComponent } from '@app/pop-up/administration-bill-loading/administration-bill-loading.component';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-bill-loading',
  templateUrl: './bill-loading.component.html',
  styleUrls: ['./bill-loading.component.css']
})
export class BillLoadingComponent implements OnInit {

  private serviceOrderGridApi;
  private settlementGridApi;
  private billGridApi;
  sub;
  currentUser;
  bill_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  providerList: any[] = [];
  paymasterList: any[] = [];
  settlementList: any[] = [];
  billList: any[] = [];
  serviceOrderList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  showSaveButtonSettlement: boolean = false;
  editStatus: boolean = false;
  cfiniquito;
  corden;
  sumatoriaCotizacion: number;
  sumatoriaGrua: number;
  sumatoriaFiniquito;
  coinList: any[] = [];
  sum1;
  sum2;
  sum3;
  pagador: any[] = [];
  keyword = 'name';
  titles;
  filteredTitles;
  model;
  bactivarrecibidor: boolean = false;
  bfiniquito: boolean = false;


  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal){}

  ngOnInit(): void {
    this.bill_form = this.formBuilder.group({
      xrazonsocial: [''],
      xtipopagador: [''],
      ffactura: [''],
      frecepcion: [''],
      fvencimiento: [''],
      nlimite: [''],
      nfactura: [''],
      ncontrol: [''],
      mmontofactura: [''],
      xobservacion: [''],
      cproveedor: [''],
      crecibidor: [''],
      xpagador: [''],
      msumatoriagrua: [''],
      msumatoriacotizacion: [''],
      msumatoriafiniquito: [''],
      cfactura: [''],
      xrutaarchivo: [''],
      cmoneda: [''],
      xmoneda: [''],
      brecibidor: [false]
    });
    this.bill_form.get('msumatoriagrua').disable();
    this.bill_form.get('msumatoriacotizacion').disable();
    this.bill_form.get('msumatoriafiniquito').disable();
    this.bill_form.get('xtipopagador').setValue('CLIENTE')
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 111
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    this.http.post(`${environment.apiUrl}/api/administration/code-bill-loading`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.bill_form.get('cfactura').setValue(response.data.cfactura)
      }
    })
  }

  initializeDetailModule(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
    }
    this.http.post(`${environment.apiUrl}/api/valrep/provider-bill`, params, options).subscribe((response: any) => {
      this.providerList = [];
      this.keyword = 'value'
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ id: response.data.list[i].cproveedor, value: response.data.list[i].xnombre});
        }
      }
      this.searchCoin();
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  changeInfo(event){
    this.bill_form.get('cproveedor').setValue(event.id)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cproveedor: this.bill_form.get('cproveedor').value
    }
    this.http.post(`${environment.apiUrl}/api/administration/change-provider`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.bill_form.get('xrazonsocial').setValue(response.data.xrazonsocial);
        this.bill_form.get('xrazonsocial').disable();
        this.bill_form.get('nlimite').setValue(response.data.nlimite);
        this.bill_form.get('nlimite').disable();
      }
      this.changeReceiver();
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    })
  }

  changePaymaster(){
    this.keyword = 'value';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
    }
    this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).subscribe((response: any) => {
      this.paymasterList = [];
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.paymasterList.push({ id: response.data.list[i].ccliente, value: response.data.list[i].xcliente});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }
  
  searchCoin(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais
    };
    this.http.post(`${environment.apiUrl}/api/valrep/coin`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.coinList.push({ id: response.data.list[i].cmoneda, value: response.data.list[i].xmoneda });
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.COINNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  changeStatus(event){
    this.bill_form.get('crecibidor').setValue(event.id)
    console.log(this.bill_form.get('crecibidor').value)
    if(this.bill_form.get('crecibidor').value){
      if(this.paymasterList[0].value == 'ArysAutos C.A'){
        this.showEditButton = false;
        this.showSaveButton = false;
      }else{
        this.showEditButton = true
        this.showSaveButton = true;
      }
    }
  }

  addServiceOrder(){
    console.log(this.bill_form.get('crecibidor').value)
    let orden = { cproveedor: this.bill_form.get('cproveedor').value, ccliente: this.bill_form.get('crecibidor').value };
    const modalRef = this.modalService.open(BillLoadingServiceOrderComponent, { size: 'xl' });
    modalRef.componentInstance.orden = orden;
    modalRef.result.then((result: any) => { 
      this.serviceOrderList = [];
      this.sumatoriaCotizacion = 0;
      this.sumatoriaGrua = 0;
      this.sum1 = 0
      this.sum2 = 0;
      if(result){
        for(let i = 0; i < result.length; i++){
          this.serviceOrderList.push({
            create: true,
            corden: result[i].corden,
            xservicio: result[i].xservicio,
            mmontototal: result[i].mmontototal,
            xmonedagrua: result[i].xmonedagrua,
            mtotal: result[i].mtotal,
            xmonedacoti: result[i].xmonedacoti
          })
          this.sumatoriaCotizacion += result[i].mtotal;
          this.sumatoriaGrua += result[i].mmontototal;
          this.sum1 = this.sumatoriaCotizacion + ' ' + result[i].xmonedacoti
          this.sum2 = this.sumatoriaGrua + ' ' + result[i].xmonedagrua
        }
        if(this.sumatoriaCotizacion){
          this.funtion();
        }else if(this.sumatoriaGrua){
          this.funtion();
        }
      }
    });
  }

  funtion(){
    if(this.sumatoriaGrua){
      this.bill_form.get('msumatoriagrua').setValue(this.sum2)
      this.bill_form.get('msumatoriagrua').disable();
    }else{
      this.bill_form.get('msumatoriagrua').setValue(0)
      this.bill_form.get('msumatoriagrua').disable();
    }

    if(this.sumatoriaCotizacion){
      this.bill_form.get('msumatoriacotizacion').setValue(this.sum1)
      this.bill_form.get('msumatoriacotizacion').disable();
    }else{
      this.bill_form.get('msumatoriacotizacion').setValue(0)
      this.bill_form.get('msumatoriacotizacion').disable();
    }

    if(this.sumatoriaFiniquito){
      this.bill_form.get('msumatoriafiniquito').setValue(this.sum3)
      this.bill_form.get('msumatoriafiniquito').disable();
    }else{
      this.bill_form.get('msumatoriafiniquito').setValue(0)
      this.bill_form.get('msumatoriafiniquito').disable();
    }
  }

  onServiceOrderGridReady(event){
    this.serviceOrderGridApi = event.api;
  }

  addSettlement(){
    let finiquito = {ccliente: this.bill_form.get('crecibidor').value};
    const modalRef = this.modalService.open(BillLoadingSettlementComponent, { size: 'xl' });
    modalRef.componentInstance.finiquito = finiquito;
    modalRef.result.then((result: any) => { 
      this.settlementList = [];
      this.sumatoriaFiniquito = 0;
      this.sum3 = 0
      if(result){
        for(let i = 0; i < result.length; i++){
          this.settlementList.push({
            create: true,
            cfiniquito: result[i].cfiniquito,
            xdanos: result[i].xdanos,
            mmontofiniquito: result[i].mmontofiniquito,
            xmoneda: result[i].xmoneda,
          })
          this.sumatoriaFiniquito += result[i].mmontofiniquito;
          this.sum3 = this.sumatoriaFiniquito + ' ' + result[i].xmoneda
        }
        if(this.sumatoriaFiniquito){
          this.funtion();
        }
      }
    });
  }

  onSettlementGridReady(event){
    this.settlementGridApi = event.api;
  }

  changeReceiver(){
    //Si brecibidor esta en true se activa el beneficiario
    if(this.bill_form.get('brecibidor').value == true){
      this.bactivarrecibidor = true;
      this.bfiniquito = true;
    }else{
      this.bfiniquito = false;
      this.showEditButton = true;
      this.showSaveButton = true;
      //this.bill_form.get('crecibidor').setValue(this.bill_form.get('cproveedor').value)
    }
  }

  addBillLoading(){
    let bill = { cfactura: this.bill_form.get('cfactura').value};
    const modalRef = this.modalService.open(AdministrationBillLoadingComponent);
    modalRef.componentInstance.bill = bill;
    modalRef.result.then((result: any) => { 
      if(result){
        this.billList.push({
          cgrid: this.billList.length,
          create: true,
          xrutaarchivo: result.xrutaarchivo
        });
        this.billGridApi.setRowData(this.billList);
      }
    });
  }

  onBillGridReady(event){
    this.billGridApi = event.api;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;

    let params;
    let url;

    let serviceOrderFilter = this.serviceOrderList.filter((row) => { return row.create; });
    let settlementFilter = this.settlementList.filter((row) => { return row.create; });

    params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      cusuario: this.currentUser.data.cusuario,
      cfactura: this.bill_form.get('cfactura').value,
      cproveedor: this.bill_form.get('cproveedor').value,
      xtipopagador: this.bill_form.get('xtipopagador').value,
      xpagador: this.bill_form.get('xpagador').value,
      crecibidor: this.bill_form.get('crecibidor').value,
      ffactura: form.ffactura,
      frecepcion: form.frecepcion,
      fvencimiento: form.fvencimiento,
      nfactura: form.nfactura,
      ncontrol: form.ncontrol,
      mmontofactura: form.mmontofactura,
      xobservacion: form.xobservacion,
      xrutaarchivo: this.billList[0].xrutaarchivo,
      cestatusgeneral: 10,
      cmoneda: form.cmoneda,
      serviceorder: {
        create: serviceOrderFilter
      },
      settlement:{
        create: settlementFilter
      }
    },
    url = `${environment.apiUrl}/api/administration/create-bill-loading`;
    this.sendFormData(params, url);
  
    this.loading = false;
    return;
  }

  sendFormData(params, url){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    this.http.post(url, params, options).subscribe((response : any) => {
      if(response.data.status){
        if(this.code){

        }else{
          if (window.confirm("¡Se ha registrado la factura exitosamente!... ¿Desea registrar el Pago?")) {
            this.router.navigate([`/administration/payment-record-index`]);
          }else{
            location.reload();
          }
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.NOTIFICATIONS.NOTIFICATIONNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
}
