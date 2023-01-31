import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-administration-payment',
  templateUrl: './administration-payment.component.html',
  styleUrls: ['./administration-payment.component.css']
})
export class AdministrationPaymentComponent implements OnInit {

  @Input() public payment;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canDelete: boolean = false;
  showSaveButton: boolean = false;
  code;
  bankList: any[] = [];
  typeOfPayList: any[] = [];
  coinList: any[] = [];
  alert = { show : false, type : "", message : "" }
  ctasacambio: number;
  mtasacambio: number;
  ftasacambio: Date;
  destinationBankList: any[] = [];

  constructor(public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      ctipopago: [''],
      xtipopago: [''],
      xreferencia: [''],
      fcobro: [''],
      cbanco: [''],
      xbanco: [''],
      mprima_pagada: [''],
      mprima: [''],
      mprima_bs: [''],
      mtasa_cambio: [''],
      ftasa_cambio: [''],
      xnota: [''],
      cbanco_destino: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 103
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.initializeDetailModule();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 401){
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      crecibo: this.payment.crecibo,
      mpima_pagada: this.payment.mpima_pagada
    };

    //Buscar listas de bancos.

    this.http.post(`${environment.apiUrl}/api/valrep/bank`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.bankList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.bankList.push({ id: response.data.list[i].cbanco, value: response.data.list[i].xbanco});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    //Buscar lista de tipo de pagos

    this.http.post(`${environment.apiUrl}/api/valrep/payment-type`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.typeOfPayList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.typeOfPayList.push({ id: response.data.list[i].ctipopago, value: response.data.list[i].xtipopago});
        }

      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    // Buscar prima
    if(this.payment.mprima){
      this.popup_form.get('mprima').setValue(this.payment.mprima);
      this.popup_form.get('mprima').disable();
    }else{
      this.http.post(`${environment.apiUrl}/api/administration-collection/detail`, params, options).subscribe((response: any) => {
        if(response.data.status){
          //let prima = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(response.data.mprima)}`;
          this.popup_form.get('mprima').setValue(response.data.mprima_pagada);
          this.popup_form.get('mprima').disable();
          // console.log(response.data.mprima_pagada)
          // this.popup_form.get('mprima_pagada').setValue(response.data.mprima_pagada);
          // this.popup_form.get('mprima_pagada').disable();
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONTYPENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }

    //Buscar tasa de cambio
  
    this.http.post(`${environment.apiUrl}/api/administration/last-exchange-rate`, null, options).subscribe((response: any) => {
      if (response.data.status) {
        this.ctasacambio = response.data.tasaCambio.ctasa_cambio;
        this.mtasacambio = response.data.tasaCambio.mtasa_cambio;
        this.ftasacambio = response.data.tasaCambio.fingreso;

        let prima = this.popup_form.get('mprima').value * response.data.tasaCambio.mtasa_cambio
        let prima_bs = prima.toFixed(2)
        this.popup_form.get('mprima_bs').setValue(prima_bs)
        this.popup_form.get('mprima_bs').disable();
        this.popup_form.get('mtasa_cambio').setValue(response.data.tasaCambio.mtasa_cambio);
        this.popup_form.get('mtasa_cambio').disable();
      }
    })

    //Buscar listas de bancos destinos.

    this.http.post(`${environment.apiUrl}/api/valrep/destinationBank`, params, options).subscribe((response : any) => {
      if(response.data.list){
        this.destinationBankList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.destinationBankList.push({ 
            id: response.data.list[i].cbanco_destino, 
            value: response.data.list[i].xbanco_destino
          });
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.TAXESCONFIGURATION.TAXNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.canSave = true;
    this.showSaveButton = true;
  }

  changeBank(){
    if(this.popup_form.get('ctipopago').value == 4 || this.popup_form.get('ctipopago').value == 5){
      this.popup_form.get('cbanco').setValue(0);
      this.popup_form.get('cbanco').disable();
      this.popup_form.get('cbanco_destino').setValue(0);
      this.popup_form.get('cbanco_destino').disable();
    }else{
      this.popup_form.get('cbanco').enable();
      this.popup_form.get('cbanco_destino').enable();
    }

    if(this.popup_form.get('ctipopago').value == 5){
      this.popup_form.get('xreferencia').setValue('Pago por Divisas');
      this.popup_form.get('xreferencia').disable();
    }else{
      this.popup_form.get('xreferencia').setValue('');
      this.popup_form.get('xreferencia').enable();
    }

    if(this.popup_form.get('ctipopago').value == 4){
      this.popup_form.get('cbanco_destino').enable();
    }

    this.destinationBank();
  }

  destinationBank(){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cpais: this.currentUser.data.cpais,
        ctipopago: this.popup_form.get('ctipopago').value
      };
      this.http.post(`${environment.apiUrl}/api/administration/destinationBank`, params, options).subscribe((response : any) => {
        if(response.data.list){
          this.destinationBankList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.destinationBankList.push({ 
              id: response.data.list[i].cbanco_destino, 
              value: response.data.list[i].xbanco_destino
            });
          }
        }
      })
  }

  onSubmit(form){

    this.submitted = true;
    this.loading = true;

   let bankFilter = this.bankList.filter((option) => { return option.id == this.popup_form.get('cbanco').value; });
   let typeOfPayFilter = this.typeOfPayList.filter((option) => { return option.id == this.popup_form.get('ctipopago').value; });

   this.payment.ctipopago = this.popup_form.get('ctipopago').value;
   this.payment.xtipopago = typeOfPayFilter[0].value;
   if(this.popup_form.get('ctipopago').value == 4){
    this.payment.xbanco = 'Pago por Zelle';
   }else if(this.popup_form.get('ctipopago').value == 5){
    this.payment.xbanco = 'Pago por Divisas';
   }else{
    this.payment.cbanco = this.popup_form.get('cbanco').value;
    this.payment.xbanco = bankFilter[0].value;
   }
   this.payment.xreferencia = form.xreferencia;
   this.payment.fcobro = form.fcobro;
   
   this.payment.mprima_pagada = this.popup_form.get('mprima').value;

  //  if(this.popup_form.get('mprima_pagada').value){
  //   this.payment.mprima_pagada = this.popup_form.get('mprima_pagada').value;
  //  }else{
  //   this.payment.mprima_pagada = this.popup_form.get('mprima').value;
  //  }
   
   this.payment.mprima_bs = this.popup_form.get('mprima_bs').value;

   if(form.xnota){
    this.payment.xnota = form.xnota;
   }else{
    this.payment.xnota = 'Sin nota agregada.'
   }

   if(this.popup_form.get('cbanco_destino').value){
    this.payment.cbanco_destino = this.popup_form.get('cbanco_destino').value;
   }else{
    this.payment.cbanco_destino = 0;
   }

   this.payment.mtasa_cambio = this.mtasacambio
   this.payment.ftasa_cambio = this.ftasacambio

   this.activeModal.close(this.payment);
  }

}
