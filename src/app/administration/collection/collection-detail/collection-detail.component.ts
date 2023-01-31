import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdministrationPaymentComponent } from '@app/pop-up/administration-payment/administration-payment.component';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { RoadManagementConfigurationIndexComponent } from '@app/quotation/road-management-configuration/road-management-configuration-index/road-management-configuration-index.component';
import { DateSelectionModelChange } from '@angular/material/datepicker';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import { initUbii } from '@ubiipagos/boton-ubii-dc';
//import { initUbii } from '@ubiipagos/boton-ubii';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {
  private paymentGridApi;
  showSaveButton: boolean = false;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  guardado: boolean = false;
  bpago: boolean = false;
  botonRegresar: boolean = false;
  code;
  sub;
  currentUser;
  detail_form: FormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  pagoUbii: boolean = false;
  alert = { show: false, type: "", message: "" };
  paymentList = {};
  closeResult = '';
  ctipopago: number;
  xreferencia: string;
  mprima_pagada: number;
  fcobro: Date;
  ctasacambio: number;
  mtasacambio: number;
  ftasacambio: Date;
  ccodigo_ubii: String;
  ccontratoflota: number;

  constructor(private formBuilder: FormBuilder, 
              private authenticationService : AuthenticationService,
              public http: HttpClient,
              private router: Router,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { }

  ngOnInit(): void {
    this.detail_form = this.formBuilder.group({
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      fdesde_rec: [''],
      fhasta_rec: [''],
      xdocidentidadpropietario: [''],
      xvehiculo: [''],
      xplaca: [''],
      crecibo: [''],
      xmoneda: [''],
      xestatusgeneral: [''],
      mprima: [''],
      mprima_bs: [''],
      ctipopago: [''],
      xtipopago: [''],
      xreferencia: [''],
      fcobro: [''],
      cbanco: [''],
      mprima_pagada: [''],
      ccliente: [''],
      xcliente: [''],
      xdocidentidadcliente: [''],
      xemail: [''],
      xtelefono: [''],
      xnombres: ['']
    })
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 103
      };
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
          let condition = err.error.data.condition;
          if(condition == 'user-dont-have-permissions'){ this.router.navigate([`/permission-error`]); }
        }else if(code == 500){ message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
      }
    });

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };

    this.http.post(`${environment.apiUrl}/api/administration/last-exchange-rate`, null, options).subscribe((response: any) => {
      if (response.data.status) {
        this.ctasacambio = response.data.tasaCambio.ctasa_cambio;
        this.mtasacambio = response.data.tasaCambio.mtasa_cambio;
        this.ftasacambio = response.data.tasaCambio.fingreso;
      }
    })

    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      crecibo: this.code
    };
    this.http.post(`${environment.apiUrl}/api/administration-collection/detail`, params, options).subscribe((response: any) => {
      if(response.data.status){

        /*if (response.data.xestatusgeneral == "PENDIENTE") {
          this.verifyReceipt();
        } else {
          this.detail_form.get('xestatusgeneral').setValue(response.data.xestatusgeneral);
          this.detail_form.get('xestatusgeneral').disable();
        }*/

        this.ccontratoflota = response.data.ccontratoflota;

        if(response.data.ccliente){
          this.detail_form.get('ccliente').setValue(response.data.ccliente);
          this.detail_form.get('ccliente').disable();
        }else{
          this.detail_form.get('ccliente').setValue('');
          this.detail_form.get('ccliente').disable();
        }

        if(response.data.xcliente){
          this.detail_form.get('xcliente').setValue(response.data.xcliente);
          this.detail_form.get('xcliente').disable();
        }else{
          this.detail_form.get('xcliente').setValue('');
          this.detail_form.get('xcliente').disable();
        }
        
        if(response.data.xdocidentidadcliente){
          this.detail_form.get('xdocidentidadcliente').setValue(response.data.xdocidentidadcliente);
          this.detail_form.get('xdocidentidadcliente').disable();
        }else{
          this.detail_form.get('xdocidentidadcliente').setValue('');
          this.detail_form.get('xdocidentidadcliente').disable();
        }
      
        if(response.data.xemail){
          this.detail_form.get('xemail').setValue(response.data.xemail);
          this.detail_form.get('xemail').disable();
        }else{
          this.detail_form.get('xemail').setValue('');
          this.detail_form.get('xemail').disable();
        }

        if(response.data.xtelefono){
          this.detail_form.get('xtelefono').setValue(response.data.xtelefono);
          this.detail_form.get('xtelefono').disable();
        }else{
          this.detail_form.get('xtelefono').setValue('');
          this.detail_form.get('xtelefono').disable();
        }
        this.detail_form.get('fdesde_rec').setValue(new Date(response.data.fdesde_rec).toISOString().substring(0, 10));
        this.detail_form.get('fdesde_rec').disable();
        this.detail_form.get('fhasta_rec').setValue(new Date(response.data.fhasta_rec).toISOString().substring(0, 10));
        this.detail_form.get('fhasta_rec').disable();

        if(response.data.xdocidentidadpropietario){
          this.detail_form.get('xdocidentidadpropietario').setValue(response.data.xdocidentidadpropietario);
          this.detail_form.get('xdocidentidadpropietario').disable();
        }else{
          this.detail_form.get('xdocidentidadpropietario').setValue('');
          this.detail_form.get('xdocidentidadpropietario').disable();
        }

        if(response.data.xvehiculo){
          this.detail_form.get('xvehiculo').setValue(response.data.xvehiculo);
          this.detail_form.get('xvehiculo').disable();
        }else{
          this.detail_form.get('xvehiculo').setValue('');
          this.detail_form.get('xvehiculo').disable();
        }

        if(response.data.xplaca){
          this.detail_form.get('xplaca').setValue(response.data.xplaca);
          this.detail_form.get('xplaca').disable();
        }else{
          this.detail_form.get('xplaca').setValue('');
          this.detail_form.get('xplaca').disable();
        }

        this.detail_form.get('xestatusgeneral').setValue(response.data.xestatusgeneral);
        this.detail_form.get('xestatusgeneral').disable();
        this.detail_form.get('mprima').setValue(response.data.mprima);
        this.detail_form.get('mprima').disable();
        let prima = this.detail_form.get('mprima').value.split(" ");

        let prima_ds: String = String(parseFloat(prima[0]).toFixed(2));

        let prima_bs: String = String( (Math.round( ( (parseFloat(prima[0]) * (this.mtasacambio) ) + Number.EPSILON ) * 100 ) /100).toFixed(2) );       

        this.ccodigo_ubii = String(response.data.ccodigo_ubii);

        initUbii(
          'ubiiboton',
          {
            amount_ds: prima_ds,
            amount_bs: prima_bs,
            concept: "COMPRA",
            principal: "bs",
            clientId:"f2514eda-610b-11ed-8e56-000c29b62ba1",
            orderId: this.ccodigo_ubii
          },
          this.callbackFn.bind(this),
          {
            text: 'Pagar con Ubii Pagos '
          }
        );
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

    this.bpago = true;
  }

  addPayment(){
    let payment = { crecibo: this.code , mpima_pagada : this.mprima_pagada };
    const modalRef = this.modalService.open(AdministrationPaymentComponent);
    modalRef.componentInstance.payment = payment;
    modalRef.result.then((result: any) => { 
      if(result){
          this.paymentList = {
            edit: true,
            ctipopago: result.ctipopago,
            xreferencia: result.xreferencia,
            fcobro: result.fcobro,
            mprima_bs: result.mprima_bs,
            cbanco: result.cbanco,
            mprima_pagada: result.mprima_pagada,
            xnota: result.xnota,
            cbanco_destino: result.cbanco_destino,
            mtasa_cambio: result.mtasa_cambio,
            ftasa_cambio: result.ftasa_cambio
          }
  
          if(this.paymentList){
            this.showSaveButton= true;
            this.bpago = false;
          }

          this.onSubmit(this.detail_form.value)
      }
    });
  }

  onPaymentGridReady(event){
    this.paymentGridApi = event.api;
  }

  async callbackFn(answer) {

    if(answer.data.R == 0){
      let ctipopago;
      if(answer.data.method == "ZELLE"){
        ctipopago = 4;
      }
      if(answer.data.method == "P2C") {
        ctipopago = 3;
      }
      let datetimeformat = answer.data.date.split(' ');
      let dateformat = datetimeformat[0].split('/');
      let fcobro = dateformat[2] + '-' + dateformat[1] + '-' + dateformat[0] + ' ' + datetimeformat[1];
      
      window.alert(`Se ha procesado exitosamente el pago de la póliza`);
      const response = await fetch(`${environment.apiUrl}/api/administration-collection/ubii/update`, {
        "method": "POST",
        "headers": {
          "CONTENT-TYPE": "Application/json",
          "Authorization": `Bearer ${this.currentUser.data.csession}`
        },
        "body": JSON.stringify({
          paymentData: {
            crecibo: this.code,
            ccontratoflota: this.ccontratoflota,
            orderId: this.ccodigo_ubii,
            ctipopago: ctipopago,
            xreferencia: answer.data.ref,
            fcobro: fcobro,
            mprima_pagada: answer.data.m
          }
        })

      });
      location.reload();
    }

    if (answer.data.R == 1) {
      window.alert(`No se pudo procesar el pago ${answer.data.M}, intente nuevamente`);
    }
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if(this.detail_form.invalid){
      this.loading = false;
      return;
    }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params;
    let url;
    let dateFormat = new Date(form.fcreacion).toUTCString();
    let fajusteDateFormat = new Date(form.fajuste).toUTCString();

    if(this.code){
      params = {
        ccompania: this.currentUser.data.ccompania,
        cpais: this.currentUser.data.cpais,
        crecibo: this.code,
        pago: this.paymentList
      };
      url = `${environment.apiUrl}/api/administration-collection/update`;
    } 
    this.http.post(url, params, options).subscribe((response: any) => {
      if(response.data.status){
        if(this.code){
          //this.returnIndex();
          this.router.navigate([`/administration/collection-index`]);
        }else{
          this.router.navigate([`/administration/collection-detail/${response.data.crecibo}`]);
        }
      }else{
        let condition = response.data.condition;
        if(condition == "service-order-already-exist"){
          this.alert.message = "EVENTS.SERVICEORDER.NAMEREADYEXIST";
          this.alert.type = 'danger';
          this.alert.show = true;
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = 1;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.THIRDPARTIES.ASSOCIATENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }
 
/*  open() {
      this.modalService.open({ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed`;
      });
  }

  returnIndex(){
    this.guardado = true;
    if(this.guardado){
      this.open();
    }

  }

  returnTrue(){
    this.botonRegresar = true;
    if(this.botonRegresar){
      this.router.navigate([`/administration/collection-index`]);
    }
  }*/
}
