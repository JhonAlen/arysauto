import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-payment-record-index',
  templateUrl: './payment-record-index.component.html',
  styleUrls: ['./payment-record-index.component.css']
})
export class PaymentRecordIndexComponent implements OnInit {

  currentUser;
  search_form : UntypedFormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  serviceOrderList: any[] = [];
  danosList: any[] = [];
  settlementList: any[] = [];
  settlements: any[] = [];
  paymentInfo;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      corden: [''],
      cfiniquito: [''],
      xdanos: [''],
      ffactura: [''],
      frecepcion: [''],
      fvencimiento: [''],
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 110
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          if(!response.data.bindice){
            this.router.navigate([`/permission-error`]);
          }else{
            this.initializeDropdownDataRequest();
          }
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
  }

  initializeDropdownDataRequest(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/service-order`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.danosList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.danosList.push({ 
            corden: response.data.list[i].corden,
            xdanos: `${response.data.list[i].xdanos} - ${response.data.list[i].xcliente}`
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });

    //Busca valor de finiquitos
    this.http.post(`${environment.apiUrl}/api/valrep/settlement`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.settlements = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.settlements.push({ 
            id: response.data.list[i].cfiniquito,
            value: `Por ${response.data.list[i].xcausafiniquito} - ${response.data.list[i].xnombre} - ${response.data.list[i].xapellido}`
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.search_form.invalid) {
      this.loading = false;
      return;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ffactura: form.ffactura,
      frecepcion: form.frecepcion,
      fvencimiento: form.fvencimiento
    }
    this.http.post(`${environment.apiUrl}/api/administration/search`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.serviceOrderList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceOrderList.push({ 
            cfactura: response.data.list[i].cfactura,
            xcliente: response.data.list[i].xcliente,
            xnombre: response.data.list[i].xnombre,
            mmontofactura: response.data.list[i].mmontofactura,
            ncontrol: response.data.list[i].ncontrol,
            nfactura: response.data.list[i].nfactura,
            ffactura: response.data.list[i].ffactura,
            frecepcion: response.data.list[i].frecepcion,
            fvencimiento: response.data.list[i].fvencimiento,
          });
        }
      }
      if(response.data.settlementList){
        this.settlementList = [];
        for(let i = 0; i < response.data.settlementList.length; i++){
          this.settlementList.push({ 
            cfactura: response.data.settlementList[i].cfactura,
            xcliente: response.data.settlementList[i].xcliente,
            xnombre: response.data.settlementList[i].xnombre,
            mmontofactura: response.data.settlementList[i].mmontofactura,
            ncontrol: response.data.settlementList[i].ncontrol,
            nfactura: response.data.settlementList[i].nfactura,
            ffactura: response.data.settlementList[i].ffactura,
            frecepcion: response.data.settlementList[i].frecepcion,
            fvencimiento: response.data.settlementList[i].fvencimiento,
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontró información con los parámetros ingresados."; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
      this.loading = false;
    });
  }

  rowClicked(event: any){
    let corden = event.data.corden;
    let cfiniquito = event.data.cfiniquito;
    this.paymentInfo = {
      corden: corden,
      cfiniquito: cfiniquito
    }
    this.router.navigate([`administration/payment-record-detail/${event.data.cfactura}`], { state: this.paymentInfo});
  }

}
