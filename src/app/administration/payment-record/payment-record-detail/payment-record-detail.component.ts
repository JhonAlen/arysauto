import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-payment-record-detail',
  templateUrl: './payment-record-detail.component.html',
  styleUrls: ['./payment-record-detail.component.css']
})
export class PaymentRecordDetailComponent implements OnInit {

  sub;
  currentUser;
  payment_form: UntypedFormGroup;
  loading: boolean = false;
  loading_cancel: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  serviceOrderList: any[] = [];
  settlementList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  code;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  cfiniquito;
  corden;
  sumafactura;
  bordenservicio: boolean = false;
  bfiniquito: boolean = false;
  moneda;
  mmontocotizacion;
  mmontocotizacioniva;
  bcalculo: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService : NgbModal) { 
                if (this.router.getCurrentNavigation().extras.state == null) {
                  this.router.navigate([`administration/payment-record-index`]);
                } else {
                  this.cfiniquito = this.router.getCurrentNavigation().extras.state.cfiniquito; 
                  this.corden = this.router.getCurrentNavigation().extras.state.corden; 
                }
              }

  ngOnInit(): void {
    this.payment_form = this.formBuilder.group({
      xcliente: [''],
      nfactura: [''],
      ncontrol: [''],
      ffactura: [''],
      frecepcion: [''],
      fvencimiento: [''],
      msumafactura: [''],
      pretencion: [''],
      pislr: [''],
      porcentajeretencion: [''],
      porcentajeimpuesto: [''],
      pimpuesto: [''],
      etiquetamoneda: [''],
      mmontocotizacion: [''],
      mmontocotizacioniva: [''],
      mmontototaliva: [''],
      mmontototalretencion: [''],
      mmontototalislr: [''],
      mmontototalimpuestos: [''],
      mmontototalfactura: [''],
      sumafactura: [''],
      mfactura: [''],
      cfactura: ['']
    });
    this.payment_form.get('sumafactura').disable();
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
  }

  initializeDetailModule(){
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.code = params.get('id');
      if(this.code){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
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

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cfactura: this.code
    }
    this.http.post(`${environment.apiUrl}/api/administration/search-bill`, params, options).subscribe((response : any) => {
      if(response.data.serviceOrder){
        this.serviceOrderList = [];

        //Lista de Ordenes de Servicio
        for(let i = 0; i < response.data.serviceOrder.length; i++){
          this.serviceOrderList.push({ 
            corden: response.data.serviceOrder[i].corden,
            xnombre: response.data.serviceOrder[i].xnombre,
            mmontofactura: response.data.serviceOrder[i].mmontofactura,
            xtipopagador: response.data.serviceOrder[i].xtipopagador,
            xmoneda: response.data.serviceOrder[i].xmoneda
          });
          this.sumafactura = 0;
          this.sumafactura += response.data.serviceOrder[i].mmontofactura;
          this.moneda = response.data.serviceOrder[i].xmoneda;
          this.mmontocotizacion = response.data.serviceOrder[i].mmontocotizacion;
          this.mmontocotizacioniva = response.data.serviceOrder[i].mmontocotizacioniva;
        }
        if(this.serviceOrderList[0]){
          this.payment_form.get('sumafactura').setValue(this.sumafactura + ' ' + this.moneda)
          this.payment_form.get('msumafactura').setValue(this.sumafactura)
          this.bordenservicio = true;
        }
      }

      if(response.data.settlement){
        this.settlementList = [];

        //Lista de finiquitos

        for(let i = 0; i < response.data.settlement.length; i++){
          this.settlementList.push({ 
            cfiniquito: response.data.settlement[i].cfiniquito,
            xnombre: response.data.settlement[i].xnombre,
            mmontofactura: response.data.settlement[i].mmontofactura
          });
          this.sumafactura = 0;
          this.sumafactura += response.data.settlement[i].mmontofactura;
          this.moneda = response.data.settlement[i].xmoneda;
        }
        if(this.settlementList[0]){
          this.payment_form.get('sumafactura').setValue(this.sumafactura + ' ' + this.moneda)
          this.payment_form.get('msumafactura').setValue(this.sumafactura)
          this.bfiniquito = true;
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

    this.getBillData();
  }

  getBillData(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cfactura: this.code
    }
    this.http.post(`${environment.apiUrl}/api/administration/bill-detail`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.payment_form.get('cfactura').setValue(response.data.cfactura)
        this.payment_form.get('cfactura').disable();
        this.payment_form.get('xcliente').setValue(response.data.xcliente)
        this.payment_form.get('xcliente').disable();
        this.payment_form.get('nfactura').setValue(response.data.nfactura)
        this.payment_form.get('nfactura').disable();
        this.payment_form.get('ncontrol').setValue(response.data.ncontrol)
        this.payment_form.get('ncontrol').disable();
        this.payment_form.get('ffactura').setValue(new Date(response.data.ffactura).toISOString().substring(0, 10));
        this.payment_form.get('ffactura').disable();
        this.payment_form.get('frecepcion').setValue(new Date(response.data.frecepcion).toISOString().substring(0, 10))
        this.payment_form.get('frecepcion').disable();
        this.payment_form.get('fvencimiento').setValue(new Date(response.data.fvencimiento).toISOString().substring(0, 10))
        this.payment_form.get('fvencimiento').disable();
        this.payment_form.get('pretencion').setValue(response.data.pretencion)
        this.payment_form.get('pretencion').disable();
        this.payment_form.get('pislr').setValue(response.data.pislr)
        this.payment_form.get('pislr').disable();
        this.payment_form.get('pimpuesto').setValue(response.data.pimpuesto)
        this.payment_form.get('pimpuesto').disable();

        //máscara
        this.payment_form.get('porcentajeretencion').setValue(this.payment_form.get('pretencion').value + '%');
        this.payment_form.get('porcentajeretencion').disable();
        this.payment_form.get('porcentajeimpuesto').setValue(this.payment_form.get('pislr').value + '%');
        this.payment_form.get('porcentajeimpuesto').disable();
      
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

  calculationBill(){
    this.bcalculo = true;
    this.payment_form.get('etiquetamoneda').setValue(this.moneda + ':')
    this.payment_form.get('etiquetamoneda').disable();

    let monto_convertido = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mmontocotizacion)
    this.payment_form.get('mmontocotizacion').setValue(monto_convertido)
    this.payment_form.get('mmontocotizacion').disable();

    //Calculo de iva al monto original.

    let calculoiva = this.mmontocotizacion * this.payment_form.get('pimpuesto').value / 100;
    let monto_convertido_iva = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculoiva)
    this.payment_form.get('mmontototaliva').setValue(monto_convertido_iva)
    this.payment_form.get('mmontototaliva').disable();


    //Calculo de retencion e iva.

    let calculoretencion = calculoiva * this.payment_form.get('pretencion').value / 100;
    let monto_convertido_retencion = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculoretencion)
    this.payment_form.get('mmontototalretencion').setValue(monto_convertido_retencion)
    this.payment_form.get('mmontototalretencion').disable();


    //calculo impuesto sobre la renta y monto original

    let calculoislr = this.mmontocotizacion * this.payment_form.get('pislr').value / 100;
    let monto_convertido_islr = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculoislr)
    this.payment_form.get('mmontototalislr').setValue(monto_convertido_islr)
    this.payment_form.get('mmontototalislr').disable();


    //Total impuestos

    let resta_Impuestos = calculoretencion - calculoislr;
    let monto_convertido_impuestos = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(resta_Impuestos)

    this.payment_form.get('mmontototalimpuestos').setValue(monto_convertido_impuestos)
    this.payment_form.get('mmontototalimpuestos').disable();


    //Colocarle la mascara al monto de la factura

    let mascara = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.payment_form.get('msumafactura').value)
    this.payment_form.get('mfactura').setValue(mascara)
    this.payment_form.get('mfactura').disable();


    //Monto total a pagar
    
    let calculo_a_pagar = this.payment_form.get('msumafactura').value - resta_Impuestos;
    let monto_convertido_total = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculo_a_pagar)
    this.payment_form.get('mmontototalfactura').setValue(monto_convertido_total)
    this.payment_form.get('mmontototalfactura').disable();
  }

  onSubmit(){
    this.submitted = true;
    this.loading = true;

    let params = {
      cfactura: this.payment_form.get('cfactura').value,
      xcliente: this.payment_form.get('xcliente').value,
      nfactura: this.payment_form.get('nfactura').value,
      ffactura: this.payment_form.get('ffactura').value,
      msumafactura: this.payment_form.get('msumafactura').value,
      mmontocotizacion: this.payment_form.get('mmontocotizacion').value,
      mmontototaliva: this.payment_form.get('mmontototaliva').value,
      mmontototalretencion: this.payment_form.get('mmontototalretencion').value,
      mmontototalislr: this.payment_form.get('mmontototalislr').value,
      mmontototalimpuestos: this.payment_form.get('mmontototalimpuestos').value,
      mmontototalfactura: this.payment_form.get('mmontototalfactura').value,
      cusuario: this.currentUser.data.cusuario,
      cestatusgeneral: 12
    };

    this.http.post( `${environment.apiUrl}/api/administration/create-payment`,params).subscribe((response : any) => {
      if(response.data.status){
        this.loading = false;
        window.alert('Se ha procesado el pago de la factura seleccionada.')
        location.reload()
      }
    })
  }

}
