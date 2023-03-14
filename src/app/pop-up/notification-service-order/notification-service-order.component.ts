import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { color } from 'html2canvas/dist/types/css/types/color';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-service-order',
  templateUrl: './notification-service-order.component.html',
  styleUrls: ['./notification-service-order.component.css']
})
export class NotificationServiceOrderComponent implements OnInit {

  private replacementGridApi;
  private emailGridApi;
  @Input() public notificacion;
  sub;
  currentUser;
  popup_form: UntypedFormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loading_cancel: boolean = false;
  canSave: boolean = false;
  isEdit: boolean = false;
  providerList: any[] = [];
  replacementList: any[] = [];
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canEditServiceOrder: boolean = false;
  canDelete: boolean = false;
  corden: number;
  variablex: number;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  showEditButtonServiceOrder: boolean = false;
  serviceOrder: any[] = [];
  notificationList: any[] = [];
  serviceList: any[] = [];
  serviceTypeList: any[] = [];
  orderList: any[] = [];
  taxList: any[] = [];
  aditionalServiceList: any[] = [];
  changeServiceList: any[] = [];
  purchaseOrder;
  coinList: any[] = [];
  code;
  danos: boolean = false;
  emailList: any[] = [];
  statusList: any[] = [];
  cancellationList: any[] = [];
  alert = { show : false, type : "", message : "" }
  replacementDeletedRowList;
  cancelled: boolean = false;
  replacement: boolean = false

    constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.popup_form = this.formBuilder.group({
      cnotificacion: [''],
      corden: [''],
      cservicio: [''],
      cservicioadicional: [''],
      cproveedor: [''],
      xproveedor: [''],
      ccontratoflota: [''],
      xtiposervicio: [''],
      xservicio: [''],
      xservicioadicional: [''],
      xnombre: [''],
      xapellido: [''],
      xnombrealternativo: [''],
      xapellidoalternativo: [''],
      xobservacion: ['', Validators.required],
      fcreacion: [''],
      xdescripcion: [''],
      xdanos: ['', Validators.required],
      xfecha: ['', Validators.required],
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      xplaca:[''],
      xcolor: [''],
      xmodelo: [''],
      xmarca: [''],
      fajuste: ['', Validators.required],
      xcliente: [''],
      fano: [''],
      xdireccionproveedor: [''],
      xnombreproveedor: [''],
      xdocumentocliente: [''],
      xdireccionfiscal: [''],
      xtelefono: [''],
      xtelefonoproveedor:[''],
      xdocumentoproveedor: [''],
      xdesde: [''],
      xhacia: [''],
      mmonto: [''],
      cimpuesto: [''],
      pimpuesto:[''],
      mmontototal: [''],
      mmontototaliva: [''],
      cmoneda: [''],
      xmoneda: [''],
      bactivo: [true],
      xactivo: [''],
      ccotizacion: [''],
      crepuesto: [''],
      xrepuesto: [''],
      ncantidad: [''],
      mtotalcotizacion: [''],
      munitariorepuesto: [''],
      mmontoiva: [''],
      mtotal: [''],
      repuestos: [' '],
      cestatusgeneral: [''],
      xestatusgeneral: [''],
      ccausaanulacion: [''],
      xcausaanulacion: [''],
      xauto: [''],
      xnombres: [''],
      xnombresalternativos: [''],
      xnombrespropietario: [''],
      ccarga: ['']
    });
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 95
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
        }else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
    }
  }

  initializeDetailModule(){
    if(this.notificacion.edit){
      this.canSave = true;
      this.editServiceOrder();
      this.repuestos();
      this.getStatus();
    }

    if(!this.notificacion.edit && !this.notificacion.createServiceOrder ){
      this.editServiceOrder();
      this.getStatus();
      if(this.notificacion.cnotificacion){
        this.searchQuote();
      }
    }

    if(this.notificacion.createServiceOrder){
      this.canSave = true;
      this.createServiceOrder();
      this.repuestos();
      this.getStatus();
      this.popup_form.get('cestatusgeneral').setValue(13);
      this.popup_form.get('cestatusgeneral').disable();
      this.popup_form.get('ccausaanulacion').setValue('');
      this.popup_form.get('ccausaanulacion').disable();
      if(this.notificacion.cnotificacion){
        this.searchQuote();
      }
    }
  }

  createServiceOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais
    };
    this.http.post(`${environment.apiUrl}/api/service-order/notification-order`, params, options).subscribe((response : any) => {
      this.serviceList = [];
      this.aditionalServiceList = [];
      if(this.notificacion.cnotificacion){
        //let cnotificacion = this.code;
          if (this.notificacion.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
            this.getServiceFromContract();
            this.popup_form.get('xnombre').setValue(response.data.list[0].xnombre);
            this.popup_form.get('xnombre').disable();
            this.popup_form.get('xapellido').setValue(response.data.list[0].xapellido);
            this.popup_form.get('xapellido').disable();
            this.popup_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
            this.popup_form.get('xnombrealternativo').disable();
            this.popup_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
            this.popup_form.get('xapellidoalternativo').disable();
            this.popup_form.get('xcliente').setValue(response.data.list[0].xcliente);
            this.popup_form.get('xcliente').disable();
            this.popup_form.get('xdocumentocliente').setValue(response.data.list[0].xdocumentocliente);
            this.popup_form.get('xdocumentocliente').disable();
            this.popup_form.get('xdireccionfiscal').setValue(response.data.list[0].xdireccionfiscal);
            this.popup_form.get('xdireccionfiscal').disable();
            this.popup_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
            this.popup_form.get('xtelefono').disable();
            this.popup_form.get('xdesde').disable();
            this.popup_form.get('xhacia').disable();
            this.popup_form.get('mmonto').disable();
            this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
            this.popup_form.get('xdescripcion').disable();
            this.popup_form.get('xnombrepropietario').setValue(response.data.list[0].xnombrepropietario);
            this.popup_form.get('xnombrepropietario').disable();
            this.popup_form.get('mmontototal').disable();
            this.popup_form.get('pimpuesto').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
            this.popup_form.get('xtelefonocelular').disable();
            this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
            this.popup_form.get('cservicio').enable();
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xmoneda').disable();
            this.popup_form.get('cmoneda').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('fano').setValue(response.data.list[0].fano);
            this.popup_form.get('fano').disable();
            this.popup_form.get('fcreacion').setValue(response.data.list[0].fcreacion);
            this.popup_form.get('fcreacion').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xauto').setValue(response.data.list[0].xauto);
            this.popup_form.get('xauto').disable(); 
            this.popup_form.get('xnombres').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombres').disable(); 
            this.popup_form.get('xnombrespropietario').setValue(response.data.list[0].xnombrespropietario);
            this.popup_form.get('xnombrespropietario').disable(); 
            this.popup_form.get('xnombresalternativos').setValue(response.data.list[0].xnombresalternativos);
            this.popup_form.get('xnombresalternativos').disable(); 
            this.popup_form.get('ccarga').setValue(response.data.list[0].ccarga);
            this.popup_form.get('ccarga').disable(); 
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion });
      }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let servicio;
    if(this.popup_form.get('cservicio').value){
      servicio = this.popup_form.get('cservicio').value
    }else{
      servicio = this.popup_form.get('cservicioadicional').value
    }
    let params = {
      cnotificacion: this.popup_form.get('cnotificacion').value,
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais,
      ccarga: this.popup_form.get('ccarga').value,
      cestado: this.notificacion.cestado,
      cservicio: servicio
    }
    this.http.post(`${environment.apiUrl}/api/valrep/aditional-service`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.aditionalServiceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio});
        }
        this.aditionalServiceList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.http.post(`${environment.apiUrl}/api/valrep/service-order-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, xdireccionproveedor: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.searchCoin();

    if(this.notificacion.cnotificacion){
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
      this.notificacion.createServiceOrder = true;
    }
  },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

  }

  getServiceFromContract(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccontratoflota: this.popup_form.get('ccontratoflota').value,
    }
    this.http.post(`${environment.apiUrl}/api/notification/search-service-type`, params, options).subscribe((response: any) => {
      if(response.data.list){
        this.serviceTypeList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceTypeList.push({
            cplan: response.data.list[i].cplan,
            ctiposervicio: response.data.list[i].ctiposervicio
          })
        }
        if(this.serviceTypeList){
          this.getStoreProcedure();
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  getStoreProcedure(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      ccontratoflota: this.popup_form.get('ccontratoflota').value,
      servicio: this.serviceTypeList,
      cusuario: this.currentUser.data.cusuario
    }
    this.http.post(`${environment.apiUrl}/api/notification/search-service`, params, options).subscribe((response: any) => {
      if(response.data.status){
        this.getService()
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  getService(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.popup_form.get('cnotificacion').value
    }
    this.http.post(`${environment.apiUrl}/api/valrep/notification-services`, params, options).subscribe((response: any) => {
      this.serviceList = [];
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio, ccontratoflota: response.data.list[i].ccontratoflota, ccarga: response.data.list[i].ccarga});
        }
        this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }


  searchQuote(){
    //Buscar cotizacion para obtener el código y elaborar el reporte
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
    }
    this.http.post(`${environment.apiUrl}/api/quote-request/search-quote`, params, options).subscribe((response: any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.popup_form.get('ccotizacion').setValue(response.data.list[i].ccotizacion);
          this.popup_form.get('ccotizacion').disable();
        }
      }
      if(this.popup_form.get('ccotizacion').value) {
        this.listRepairOrder();
      }else{
        window.alert('¡Recuerda que el proveedor no ha cotizado!')
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        //message = "¡Recuerda que el proveedor no ha cotizado!"; 
        window.alert('¡Recuerda que el proveedor no ha cotizado!')
      }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      // this.alert.message = message;
      // this.alert.type = 'primary';
      // this.alert.show = true;
    });
  }

  editServiceOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      corden: this.notificacion.corden,
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais
    };
    if(this.notificacion.edit){
    this.http.post(`${environment.apiUrl}/api/service-order/notification-service-order`, params, options).subscribe((response : any) => {
      this.serviceList = [];
      this.aditionalServiceList = [];
      if(this.notificacion.cnotificacion){
        //let cnotificacion = this.code;
          if (this.notificacion.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('corden').setValue(response.data.list[0].corden);
            this.popup_form.get('corden').disable();
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
            this.popup_form.get('xnombre').setValue(response.data.list[0].xnombre);
            this.popup_form.get('xnombre').disable();
            this.popup_form.get('xtelefonoproveedor').setValue(response.data.list[0].xtelefonoproveedor);
            this.popup_form.get('xtelefonoproveedor').disable();
            this.popup_form.get('xapellido').setValue(response.data.list[0].xapellido);
            this.popup_form.get('xapellido').disable();
            this.popup_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
            this.popup_form.get('xnombrealternativo').disable();
            this.popup_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
            this.popup_form.get('xapellidoalternativo').disable();
            this.popup_form.get('xcliente').setValue(response.data.list[0].xcliente);
            this.popup_form.get('xcliente').disable();
            this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
            this.popup_form.get('xdesde').disable();
            this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
            this.popup_form.get('xhacia').disable();
            this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
            this.popup_form.get('mmonto').disable();
            this.popup_form.get('xdocumentocliente').setValue(response.data.list[0].xdocumentocliente);
            this.popup_form.get('xdocumentocliente').disable();
            this.popup_form.get('xdireccionfiscal').setValue(response.data.list[0].xdireccionfiscal);
            this.popup_form.get('xdireccionfiscal').disable();
            this.popup_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
            this.popup_form.get('xtelefono').disable();
            this.popup_form.get('mmontototal').setValue(response.data.list[0].mmontototal);
            this.popup_form.get('mmontototal').disable();
            this.popup_form.get('mmontototaliva').setValue(response.data.list[0].mmontototaliva);
            this.popup_form.get('mmontototaliva').disable();
            this.popup_form.get('pimpuesto').setValue(response.data.list[0].pimpuesto);
            this.popup_form.get('pimpuesto').disable();
            this.popup_form.get('xobservacion').setValue(response.data.list[0].xobservacion);
            this.popup_form.get('xobservacion').disable();
            this.replacementList.push({ id: response.data.list[0].corden, value: response.data.list[0].xdanos});
            this.popup_form.get('xdanos').setValue(response.data.list[0].xdanos);
            this.popup_form.get('xdanos').disable();
            this.popup_form.get('cmoneda').setValue(response.data.list[0].cmoneda);
            this.popup_form.get('cmoneda').disable();
            this.popup_form.get('xmoneda').setValue(response.data.list[0].xmoneda);
            this.popup_form.get('xmoneda').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xfecha').setValue(response.data.list[0].xfecha);
            this.popup_form.get('xfecha').disable();
            if(response.data.list[0].fajuste){
              let dateFormat = new Date(response.data.list[0].fajuste).toISOString().substring(0, 10);
              this.popup_form.get('fajuste').setValue(dateFormat);
              this.popup_form.get('fajuste').disable();
            }
            this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
            this.popup_form.get('cservicio').disable();
            if(response.data.list[0].cservicio){
              this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
              this.popup_form.get('cservicio').disable();
              this.popup_form.get('xservicio').setValue(response.data.list[0].xservicio);
              this.popup_form.get('xservicio').disable();
            } else { this.popup_form.get('cservicio').disable(); }
            if(response.data.list[0].cservicio == 228){
              this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
              this.popup_form.get('xdesde').enable();
              this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
              this.popup_form.get('xhacia').enable();
              this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
              this.popup_form.get('mmonto').enable();
            }else{
              this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
              this.popup_form.get('xdesde').disable();
              this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
              this.popup_form.get('xhacia').disable();
              this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
              this.popup_form.get('mmonto').disable();
            }
            if(response.data.list[0].cservicioadicional) {
              this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
              this.popup_form.get('cservicioadicional').disable();
              this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
              this.popup_form.get('xservicioadicional').disable();
            } else { this.popup_form.get('cservicioadicional').disable(); }
            if(response.data.list[0].cservicioadicional == 228){
              this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
              this.popup_form.get('cservicioadicional').disable();
              this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
              this.popup_form.get('xservicioadicional').disable();
            }
            this.popup_form.get('cproveedor').setValue(response.data.list[0].cproveedor);
            this.popup_form.get('cproveedor').disable();
            this.popup_form.get('xproveedor').setValue(response.data.list[0].xproveedor);
            this.popup_form.get('xproveedor').disable();
            this.providerList.push({ proveedor: response.data.list[0].cproveedor, value: response.data.list[0].xproveedor});
            this.popup_form.get('xdireccionproveedor').setValue(response.data.list[0].xdireccionproveedor);
            this.popup_form.get('xdireccionproveedor').disable();
            this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
            this.popup_form.get('xdescripcion').disable();
            this.popup_form.get('xnombres').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombres').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
            this.popup_form.get('xtelefonocelular').disable();
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xdocumentoproveedor').setValue(response.data.list[0].xdocumentoproveedor);
            this.popup_form.get('xdocumentoproveedor').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('fano').setValue(response.data.list[0].fano);
            this.popup_form.get('fano').disable();
            this.popup_form.get('fcreacion').setValue(response.data.list[0].fcreacion);
            this.popup_form.get('fcreacion').disable(); 
            this.popup_form.get('xauto').setValue(response.data.list[0].xauto);
            this.popup_form.get('xauto').disable(); 
            this.popup_form.get('xnombres').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombres').disable(); 
            this.popup_form.get('xnombrespropietario').setValue(response.data.list[0].xnombrespropietario);
            this.popup_form.get('xnombrespropietario').disable(); 
            this.popup_form.get('xnombresalternativos').setValue(response.data.list[0].xnombresalternativos);
            this.popup_form.get('xnombresalternativos').disable(); 
            this.popup_form.get('cestatusgeneral').setValue(response.data.list[0].cestatusgeneral);
            if(this.popup_form.get('cestatusgeneral').value == 3){
              this.cancelled = true;
            }else{
              this.cancelled = false;
            }
            this.popup_form.get('xestatusgeneral').setValue(response.data.list[0].xestatusgeneral);
            this.statusList.push({ id: response.data.list[0].cestatusgeneral, value: response.data.list[0].xestatusgeneral})
            this.changeCancellationCause();
            //this.cancellationList.push({ id: response.data.list[0].ccausaanulacion, value: response.data.list[0].xcausaanulacion})
            this.popup_form.get('ccausaanulacion').setValue(response.data.list[0].ccausaanulacion);
            this.popup_form.get('xcausaanulacion').setValue(response.data.list[0].xcausaanulacion);
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion, cservicio: response.data.list[0].cservicio, corden: response.data.list[0].corden, cproveedor: response.data.list[0].cproveedor, xdireccionproveedor: response.data.list[0].xdireccionproveedor, cservicioadicional: response.data.list[0].cservicioadicional, xservicioadicional: response.data.list[0].xservicioadicional });
      }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.popup_form.get('cnotificacion').value,
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/notification-services`, params, options).subscribe((response: any) => {
      this.serviceList = [];
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.serviceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio, ccontratoflota: response.data.list[i].ccontratoflota, ccarga: response.data.list[i].ccarga});
        }
        //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/aditional-service`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.aditionalServiceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.http.post(`${environment.apiUrl}/api/valrep/service-order-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, xdireccionproveedor: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });

    this.searchCoin();
    this.showEditButtonServiceOrder = true;
    this.canEditServiceOrder = true
    if(this.notificacion.cnotificacion){
      if(!this.canDetail){
        this.router.navigate([`/permission-error`]);
        return;
      }
      this.editar();
      // this.sendEmail();
      if(this.notificacion.edit){ this.notificacion.edit = true; }
    }else{
      if(!this.canCreate){
        this.router.navigate([`/permission-error`]);
        return;
      }
      this.showEditButtonServiceOrder = true;
      this.showSaveButton = true;
      this.canEditServiceOrder = true
    }
  },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }else{
    this.http.post(`${environment.apiUrl}/api/service-order/notification-service-order`, params, options).subscribe((response : any) => {
      this.serviceList = [];
      this.aditionalServiceList = [];
      if(this.notificacion.cnotificacion){
          if (this.notificacion.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('corden').setValue(response.data.list[0].corden);
            this.popup_form.get('corden').disable();
            this.repuestos();
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
            this.popup_form.get('xnombres').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombres').disable();
            this.popup_form.get('xapellido').setValue(response.data.list[0].xapellido);
            this.popup_form.get('xapellido').disable();
            this.popup_form.get('xnombrealternativo').setValue(response.data.list[0].xnombrealternativo);
            this.popup_form.get('xnombrealternativo').disable();
            this.popup_form.get('xapellidoalternativo').setValue(response.data.list[0].xapellidoalternativo);
            this.popup_form.get('xapellidoalternativo').disable();
            this.popup_form.get('xcliente').setValue(response.data.list[0].xcliente);
            this.popup_form.get('xcliente').disable();
            this.popup_form.get('xdesde').setValue(response.data.list[0].xdesde);
            this.popup_form.get('xdesde').disable();
            this.popup_form.get('xhacia').setValue(response.data.list[0].xhacia);
            this.popup_form.get('xhacia').disable();
            this.popup_form.get('mmonto').setValue(response.data.list[0].mmonto);
            this.popup_form.get('mmonto').disable();
            this.popup_form.get('xdocumentocliente').setValue(response.data.list[0].xdocumentocliente);
            this.popup_form.get('xdocumentocliente').disable();
            if(response.data.list[0].xdireccionfiscal){
              this.popup_form.get('xdireccionfiscal').setValue(response.data.list[0].xdireccionfiscal);
              this.popup_form.get('xdireccionfiscal').disable();
            }else{
              this.popup_form.get('xdireccionfiscal').setValue('');
              this.popup_form.get('xdireccionfiscal').disable();
            }
            this.popup_form.get('xtelefono').setValue(response.data.list[0].xtelefono);
            this.popup_form.get('xtelefono').disable();
            this.popup_form.get('xdocumentoproveedor').setValue(response.data.list[0].xdocumentoproveedor);
            this.popup_form.get('xdocumentoproveedor').disable();
            this.popup_form.get('xobservacion').setValue(response.data.list[0].xobservacion);
            this.popup_form.get('xobservacion').disable();
            this.replacementList.push({ id: response.data.list[0].corden, value: response.data.list[0].xdanos});
            this.popup_form.get('xdanos').setValue(response.data.list[0].xdanos);
            this.popup_form.get('xdanos').disable();
            this.popup_form.get('mmontototal').setValue(response.data.list[0].mmontototal);
            this.popup_form.get('mmontototal').disable();
            this.popup_form.get('mmontototaliva').setValue(response.data.list[0].mmontototaliva);
            this.popup_form.get('mmontototaliva').disable();
            console.log(this.popup_form.get('mmontototaliva').value)
            this.popup_form.get('cmoneda').setValue(response.data.list[0].cmoneda);
            this.popup_form.get('cmoneda').disable();
            this.popup_form.get('xmoneda').setValue(response.data.list[0].xmoneda);
            this.popup_form.get('xmoneda').disable();
            this.coinList.push({ id: response.data.list[0].cmoneda, value: response.data.list[0].xmoneda });
            this.popup_form.get('pimpuesto').setValue(response.data.list[0].pimpuesto);
            this.popup_form.get('pimpuesto').disable();
            this.popup_form.get('bactivo').setValue(response.data.list[0].bactivo);
            this.popup_form.get('bactivo').disable();
            this.popup_form.get('xactivo').disable();
            this.popup_form.get('xfecha').setValue(response.data.list[0].xfecha);
            this.popup_form.get('xfecha').disable();
            if(response.data.list[0].fajuste){
              let dateFormat = new Date(response.data.list[0].fajuste).toISOString().substring(0, 10);
              this.popup_form.get('fajuste').setValue(dateFormat);
              this.popup_form.get('fajuste').disable();
            }
            this.popup_form.get('cservicio').setValue(response.data.list[0].cservicio);
            this.popup_form.get('cservicio').disable();
            this.popup_form.get('xservicio').setValue(response.data.list[0].xservicio);
            this.popup_form.get('xservicio').disable();
            this.serviceList.push({ servicio: response.data.list[0].cservicio, value: response.data.list[0].xservicio});
            this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
            this.popup_form.get('cservicioadicional').disable();
            this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
            this.popup_form.get('xservicioadicional').disable();
            this.aditionalServiceList.push({ servicio: response.data.list[0].cservicioadicional, value: response.data.list[0].xservicioadicional});
            if(response.data.list[0].cservicioadicional == 224){
              this.popup_form.get('cservicioadicional').setValue(response.data.list[0].cservicioadicional);
              this.popup_form.get('cservicioadicional').disable();
              this.popup_form.get('xservicioadicional').setValue(response.data.list[0].xservicioadicional);
              this.popup_form.get('xservicioadicional').disable();
              this.aditionalServiceList.push({ servicio: response.data.list[0].cservicioadicional, value: response.data.list[0].xservicioadicional});
            }
            this.popup_form.get('cproveedor').setValue(response.data.list[0].cproveedor);
            this.popup_form.get('cproveedor').disable();
            this.popup_form.get('xproveedor').setValue(response.data.list[0].xnombreproveedor);
            this.popup_form.get('xproveedor').disable();
            this.providerList.push({ proveedor: response.data.list[0].cproveedor, value: response.data.list[0].xnombreproveedor});
            this.popup_form.get('xtelefonoproveedor').setValue(response.data.list[0].xtelefonoproveedor);
            this.popup_form.get('xtelefonoproveedor').disable();
            if(response.data.list[0].xdescripcion){
              this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
              this.popup_form.get('xdescripcion').disable()
            }else{
              this.popup_form.get('xdescripcion').setValue(response.data.list[0].xdescripcion);
              this.popup_form.get('xdescripcion').disable()
            }
            this.popup_form.get('xnombrepropietario').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombrepropietario').disable();
            this.popup_form.get('xapellidopropietario').setValue(response.data.list[0].xapellidopropietario);
            this.popup_form.get('xapellidopropietario').disable();
            this.popup_form.get('xdocidentidad').setValue(response.data.list[0].xdocidentidad);
            this.popup_form.get('xdocidentidad').disable();
            if(response.data.list[0].xtelefonocelular){
              this.popup_form.get('xtelefonocelular').setValue(response.data.list[0].xtelefonocelular);
              this.popup_form.get('xtelefonocelular').disable();
            }else{
              this.popup_form.get('xtelefonocelular').setValue('Sin número telefónico');
              this.popup_form.get('xtelefonocelular').disable();
            }
            this.popup_form.get('xplaca').setValue(response.data.list[0].xplaca);
            this.popup_form.get('xplaca').disable();
            this.popup_form.get('xcolor').setValue(response.data.list[0].xcolor);
            this.popup_form.get('xcolor').disable();
            this.popup_form.get('xmodelo').setValue(response.data.list[0].xmodelo);
            this.popup_form.get('xmodelo').disable();
            this.popup_form.get('xmarca').setValue(response.data.list[0].xmarca);
            this.popup_form.get('xmarca').disable();
            this.popup_form.get('fano').setValue(response.data.list[0].fano);
            this.popup_form.get('fano').disable();
            if (response.data.list[0].fcreacion) {
              let dateFormat = new Date(response.data.list[0].fcreacion);
              let dd = dateFormat.getDay();
              let mm = dateFormat.getMonth();
              let yyyy = dateFormat.getFullYear();
              response.data.list[0].fcreacion = dd + '-' + mm + '-' + yyyy;
              this.popup_form.get('fcreacion').setValue(response.data.list[0].fcreacion);
              this.popup_form.get('fcreacion').disable();
            } else {
              this.popup_form.get('fcreacion').setValue('');
              this.popup_form.get('fcreacion').disable();
            }

            if(response.data.list[0].xdireccionproveedor){
              this.popup_form.get('xdireccionproveedor').setValue(response.data.list[0].xdireccionproveedor);
              this.popup_form.get('xdireccionproveedor').disable();
            }else{
              this.popup_form.get('xdireccionproveedor').setValue(' ');
              this.popup_form.get('xdireccionproveedor').disable();
            }
            if(response.data.list[0].xnombreproveedor){
              this.popup_form.get('xnombreproveedor').setValue(response.data.list[0].xnombreproveedor);
              this.popup_form.get('xnombreproveedor').disable();
            }else{
              this.popup_form.get('xnombreproveedor').setValue('Sin proveedor');
              this.popup_form.get('xnombreproveedor').disable();
            }
            this.popup_form.get('cestatusgeneral').setValue(response.data.list[0].cestatusgeneral);
            this.popup_form.get('cestatusgeneral').disable()
            this.popup_form.get('xestatusgeneral').setValue(response.data.list[0].xestatusgeneral);
            this.popup_form.get('xestatusgeneral').disable()
            this.statusList.push({ id: response.data.list[0].cestatusgeneral, value: response.data.list[0].xestatusgeneral})
            this.popup_form.get('xauto').setValue(response.data.list[0].xauto);
            this.popup_form.get('xauto').disable(); 
            this.popup_form.get('xnombres').setValue(response.data.list[0].xnombres);
            this.popup_form.get('xnombres').disable(); 
            this.popup_form.get('xnombrespropietario').setValue(response.data.list[0].xnombrespropietario);
            this.popup_form.get('xnombrespropietario').disable(); 
            this.popup_form.get('xnombresalternativos').setValue(response.data.list[0].xnombresalternativos);
            this.popup_form.get('xnombresalternativos').disable(); 
            this.cancellationList.push({ id: response.data.list[0].ccausaanulacion, value: response.data.list[0].xcausaanulacion})
            this.popup_form.get('ccausaanulacion').setValue(response.data.list[0].ccausaanulacion);
            this.popup_form.get('ccausaanulacion').disable()
            this.popup_form.get('xcausaanulacion').setValue(response.data.list[0].xcausaanulacion);
            this.popup_form.get('xcausaanulacion').disable()
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion, cservicio: response.data.list[0].cservicio, corden: response.data.list[0].corden, cproveedor: response.data.list[0].cproveedor, xdireccionproveedor: response.data.list[0].xdireccionproveedor, xnombreproveedor: response.data.list[0].xnombreproveedor, cservicioadicional: response.data.list[0].cservicioadicional, xservicioadicional: response.data.list[0].xservicioadicional });
      }
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cnotificacion: this.popup_form.get('cnotificacion').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/notification-services`, params, options).subscribe((response: any) => {
        this.serviceList = [];
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.serviceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio, ccontratoflota: response.data.list[i].ccontratoflota, ccarga: response.data.list[i].ccarga});
          }
          //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
        //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.http.post(`${environment.apiUrl}/api/valrep/aditional-service`, params, options).subscribe((response: any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.aditionalServiceList.push({ servicio: response.data.list[i].cservicio, value: response.data.list[i].xservicio});
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
        //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
  
      this.http.post(`${environment.apiUrl}/api/valrep/service-order-providers`, params, options).subscribe((response: any) => {
        if(response.data.status){
          for(let i = 0; i < response.data.list.length; i++){
            this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, xdireccionproveedor: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
          }
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.SERVICEORDER.SERVICEORDERNOTFOUND"; }
        //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });

      this.searchCoin();
      this.showEditButtonServiceOrder = true;
      this.canEditServiceOrder = true
      if(this.notificacion.cnotificacion){
        if(!this.canDetail){
          this.router.navigate([`/permission-error`]);
          return;
        }
        if(this.canEditServiceOrder){ this.showEditButtonServiceOrder = true; }
      }else{
        if(!this.canCreate){
          this.router.navigate([`/permission-error`]);
          return;
        }
        this.showEditButtonServiceOrder = true;
        this.canEditServiceOrder = true
      }
    },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.NOTIFICATIONNOTFOUND"; }
        //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
  }
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

  editar(){
    this.popup_form.get('cestatusgeneral').enable();
    this.popup_form.get('xestatusgeneral').enable();
    this.popup_form.get('ccausaanulacion').enable();
    this.popup_form.get('xcausaanulacion').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    // if (this.popup_form.invalid) {
    //   this.loading = false;
    //   return;
    // }

    let notificacionFilter = this.notificationList.filter((option) => { return option.id == this.popup_form.get('cnotificacion').value; });
    let serviceFilter = this.serviceList.filter((option) => { return option.servicio == this.popup_form.get('cservicio').value ; });
    let aditionalServiceFilter = this.aditionalServiceList.filter((option) => { return option.servicio == this.popup_form.get('cservicioadicional').value; });
    let providerFilter = this.providerList.filter((option) => { return option.proveedor == this.popup_form.get('cproveedor').value; });
    let coinFilter = this.coinList.filter((option) => { return option.id == this.popup_form.get('cmoneda').value; });
    let statusFilter = this.statusList.filter((option) => { return option.id == this.popup_form.get('cestatusgeneral').value; });
    let cancellationFilter = this.cancellationList.filter((option) => { return option.id == this.popup_form.get('ccausaanulacion').value; });
    let replacementFilter = this.replacementList.filter((option) => { return option.value == this.popup_form.get('xrepuesto').value; });

    if(this.popup_form.get('cservicio').value){
      this.notificacion.cservicio = this.popup_form.get('cservicio').value ? this.popup_form.get('cservicio').value: undefined;
      this.notificacion.xservicio = serviceFilter[0].value ? serviceFilter[0].value: undefined;
    }else{
      this.notificacion.cservicioadicional = this.popup_form.get('cservicioadicional').value;
      this.notificacion.xservicio = aditionalServiceFilter[0].value ? aditionalServiceFilter[0].value: undefined;
    }

    if(this.popup_form.get('cmoneda').value){
      this.notificacion.cmoneda = this.popup_form.get('cmoneda').value;
      this.notificacion.xmoneda = coinFilter[0].value;
    }else{
      this.notificacion.cmoneda = 0;
      this.notificacion.xmoneda = 'Sin Moneda';
    }

    if(this.popup_form.get('xdesde').value){
      this.notificacion.xdesde = this.popup_form.get('xdesde').value;
    }else{
      this.notificacion.xdesde = null;
    }

    if(this.popup_form.get('xhacia').value){
      this.notificacion.xhacia = this.popup_form.get('xhacia').value;
    }else{
      this.notificacion.xhacia = null;
    }

    if(this.popup_form.get('mmonto').value){
      this.notificacion.mmonto = this.popup_form.get('mmonto').value;
    }else{
      this.notificacion.mmonto = null;
    }

    if(this.popup_form.get('xobservacion').value){
      this.notificacion.xobservacion = this.popup_form.get('xobservacion').value;
    }else{
      this.notificacion.xobservacion = null;
    }

    if(this.popup_form.get('xfecha').value){
      this.notificacion.xfecha = this.popup_form.get('xfecha').value;
    }else{
      this.notificacion.xfecha = null;
    }

    if(this.popup_form.get('xrepuesto').value){
      this.notificacion.xdanos = this.popup_form.get('xrepuesto').value;
    }else{
      this.notificacion.xdanos = 'SIN DAÑOS';
    }
    this.notificacion.fajuste = this.popup_form.get('fajuste').value.substring(0, 10);
    if(this.popup_form.get('cproveedor').value){
      this.notificacion.cproveedor = this.popup_form.get('cproveedor').value;
    }else{
      this.notificacion.cproveedor = null;
    }

    this.notificacion.bactivo = 1
    this.notificacion.cestatusgeneral = this.popup_form.get('cestatusgeneral').value;
    if(this.popup_form.get('ccausaanulacion').value){
      this.notificacion.ccausaanulacion = this.popup_form.get('ccausaanulacion').value;
    }else{
      this.notificacion.ccausaanulacion = 0;
    }

    this.activeModal.close(this.notificacion);
  }

  changeAditionalService(){

    if(this.popup_form.get('cservicioadicional').value != 228){
      this.popup_form.get('xdesde').disable();
      this.popup_form.get('xhacia').disable();
      this.popup_form.get('mmonto').disable();
      this.popup_form.get('cmoneda').disable();
      this.popup_form.get('xmoneda').disable();
    }else{
      this.popup_form.get('xdesde').enable();
      this.popup_form.get('xhacia').enable();
      this.popup_form.get('mmonto').enable();
      this.popup_form.get('cmoneda').enable();
      this.popup_form.get('xmoneda').disable();
    }
    if(this.popup_form.get('cservicioadicional').value){
      this.popup_form.get('xservicio').value == this.popup_form.get('xservicioadicional').value;
    }
    this.popup_form.get('cservicio').setValue('');
    console.log(this.popup_form.get('cservicioadicional').value)
    this.providerList = [];
    this.popup_form.get('cproveedor').setValue('');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cservicio: this.popup_form.get('cservicioadicional').value,
      cestado: this.notificacion.cestado
    }
    this.http.post(`${environment.apiUrl}/api/valrep/service-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor});
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  changeService(){
        console.log(this.popup_form.get('cservicio').value)
    if(this.popup_form.get('cservicio').value != 228){
      this.popup_form.get('xdesde').disable();
      this.popup_form.get('xhacia').disable();
      this.popup_form.get('mmonto').disable();
      this.popup_form.get('cmoneda').disable();
      this.popup_form.get('xmoneda').disable();
    }else{
      this.popup_form.get('xdesde').enable();
      this.popup_form.get('xhacia').enable();
      this.popup_form.get('mmonto').enable();
      this.popup_form.get('cmoneda').enable();
      this.popup_form.get('xmoneda').disable();
    }
    if(this.popup_form.get('cservicioadicional').value){
      this.popup_form.get('xservicio').value == this.popup_form.get('xservicioadicional').value;
    }
    this.popup_form.get('cservicioadicional').setValue('');
    this.providerList = [];
    this.popup_form.get('cproveedor').setValue('');


    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cservicio: this.popup_form.get('cservicio').value,
      cestado: this.notificacion.cestado
    }
    this.http.post(`${environment.apiUrl}/api/valrep/service-providers`, params, options).subscribe((response: any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.providerList.push({ proveedor: response.data.list[i].cproveedor, value: response.data.list[i].xproveedor, direccion: response.data.list[i].xdireccionproveedor, telefono: response.data.list[i].xtelefonoproveedor});
        }
        //this.serviceList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.SERVICENOTFOUND"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });
  }

  getServiceOrderService(){
    if (this.popup_form.get('cservicio').value){
      return this.popup_form.get('xservicio').value;
    }
    if(this.popup_form.get('cservicioadicional').value){
      return this.popup_form.get('xservicioadicional').value;
    }
  }

  listPurchaseOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      baceptacion: 1,
      ccotizacion: this.popup_form.get('ccotizacion').value
    };
    this.http.post(`${environment.apiUrl}/api/quote-request/detail-list`, params, options).subscribe((response : any) => {
      this.purchaseOrder = {}
      if(response.data.status){
        let replacementsList = [];
          for(let i = 0; i < response.data.replacements.length; i++){
            let replacement = {};
            replacement = {
              crepuesto: response.data.replacements[i].crepuesto,
              xrepuesto: response.data.replacements[i].xrepuesto,
              ncantidad: response.data.replacements[i].ncantidad,
              munitariorepuesto: response.data.replacements[i].munitariorepuesto,
              cmoneda: response.data.replacements[i].cmoneda,
              xmoneda: response.data.replacements[i].xmoneda
            }
            replacementsList.push(replacement);
          }
          this.purchaseOrder = {
            ccotizacion: response.data.ccotizacion,
            xobservacion: response.data.xobservacion,
            mtotalcotizacion: response.data.mtotalcotizacion,
            mmontoiva: response.data.mmontoiva,
            mtotal: response.data.mtotal,
            cmoneda: response.data.cmoneda,
            xmoneda: response.data.xmoneda,
            replacements: replacementsList
          }
          this.popup_form.get('mmontoiva').setValue(response.data.mmontoiva);
          this.popup_form.get('mtotal').setValue(response.data.mtotal);
          this.popup_form.get('xmoneda').setValue(response.data.xmoneda);
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

  buildPurchaseOrderBody(){
    let body = [];
    this.purchaseOrder.replacements.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.ncantidad, border:[false, false, false, false]});
      dataRow.push({text: row.xrepuesto, border:[false, false, false, false]});
      dataRow.push({text: row.munitariorepuesto, border:[false, false, false, false]});
      body.push(dataRow);
    });
    return body;
  }

  listRepairOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.notificacion.cnotificacion,
      baceptacion: 1,
      ccotizacion: this.popup_form.get('ccotizacion').value
    };
    this.http.post(`${environment.apiUrl}/api/quote-request/detail-list`, params, options).subscribe((response : any) => {
      this.purchaseOrder = {}
      if(response.data.status){
        let replacementsList = [];
          for(let i = 0; i < response.data.replacements.length; i++){
            let replacement = {};
            replacement = {
              crepuesto: response.data.replacements[i].crepuesto,
              xrepuesto: response.data.replacements[i].xrepuesto,
              ncantidad: response.data.replacements[i].ncantidad,
              munitariorepuesto: response.data.replacements[i].munitariorepuesto,
              cmoneda: response.data.replacements[i].cmoneda,
              xmoneda: response.data.replacements[i].xmoneda
            }
            replacementsList.push(replacement);
          }
          this.purchaseOrder = {
            ccotizacion: response.data.ccotizacion,
            xobservacion: response.data.xobservacion,
            mtotalcotizacion: response.data.mtotalcotizacion,
            mmontoiva: response.data.mmontoiva,
            mtotal: response.data.mtotal,
            cmoneda: response.data.cmoneda,
            xmoneda: response.data.xmoneda,
            replacements: replacementsList
          }
          this.popup_form.get('mmontoiva').setValue(response.data.mmontoiva);
          this.popup_form.get('mtotal').setValue(response.data.mtotal);
          this.popup_form.get('xmoneda').setValue(response.data.xmoneda);
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

  buildRepairOrderBody(){
    let body = [];
    this.purchaseOrder.replacements.forEach(function(row) {
      let dataRow = [];
      dataRow.push({text: row.ncantidad, border:[false, false, false, false]});
      dataRow.push({text: row.xrepuesto, border:[false, false, false, false]});
      dataRow.push({text:    `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.munitariorepuesto)} ${row.xmoneda} `, border:[false, false, false, false]});
      body.push(dataRow);
    });
    return body;
  }

  getMonthAsString(month) {
    month = month + 1;
    if (month == 1) {
      return 'Enero'
    }
    if (month == 2) {
      return 'Febrero'
    }
    if (month == 3) {
      return 'Marzo'
    }
    if (month == 4) {
      return 'Abril'
    }
    if (month == 5) {
      return 'Mayo'
    }
    if (month == 6) {
      return 'Junio'
    }
    if (month == 7) {
      return 'Julio'
    }
    if (month == 8) {
      return 'Agosto'
    }
    if (month == 9) {
      return 'Septiembre'
    }
    if (month == 10) {
      return 'Octubre'
    }
    if (month == 11) {
      return 'Noviembre'
    }
    if (month == 12) {
      return 'Diciembre'
    }
  }

  repuestos(){
    if(this.notificacion.createServiceOrder){
        this.replacement = true;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let params = {
          cnotificacion: this.notificacion.cnotificacion
        };
        this.http.post(`${environment.apiUrl}/api/valrep/settlement/replacement`, params, options).subscribe((response : any) => {
          if(response.data.list){
            for(let i = 0; i < response.data.list.length; i++){
              this.replacementList.push({ id: response.data.list[i].crepuesto, value: response.data.list[i].xrepuesto});
            }
          }
        },
        (err) => {
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 404){ message = "hola2"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
    }else{
        this.danos = true;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        let params = {
          cnotificacion: this.notificacion.cnotificacion,
          corden: this.popup_form.get('corden').value
        };
        this.http.post(`${environment.apiUrl}/api/service-order/notification-service-order`, params, options).subscribe((response : any) => {
          if(response.data.list){
            this.replacementList.push({ id: response.data.list[0].corden, value: response.data.list[0].xdanos});
            this.popup_form.get('corden').setValue(response.data.list[0].corden)
            this.popup_form.get('corden').disable();
            this.popup_form.get('xdanos').setValue(response.data.list[0].xdanos)
            this.popup_form.get('xdanos').disable();
          }
        },
        (err) => {
          let code = err.error.data.code;
          let message;
          if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
          else if(code == 404){ message = "hola1"; }
          else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
          this.alert.message = message;
          this.alert.type = 'danger';
          this.alert.show = true;
        });
    }
    // if(this.notificacion.repuestos){
    //   for(let i = 0; i < this.notificacion.repuestos.length; i++){
    //     let repuesto = this.notificacion.repuestos[i].xrepuesto;

    //     repuestos.push(repuesto);
    //   }
    //   this.popup_form.get('xrepuesto').setValue(repuestos);
    //   this.popup_form.get('xrepuesto').disable();
    // }
    // this.danos = this.popup_form.get('xrepuesto').value;
    // this.popup_form.get('xdanos').setValue(`${this.danos}`);
    // this.popup_form.get('xdanos').disable();
  }

  changeDateFormat(date) {
    let dateArray = date.split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  }

  getStatus(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/general-status/service-order`, params, options).subscribe((response: any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          this.statusList.push({ id: response.data.list[i].cestatusgeneral, value: response.data.list[i].xestatusgeneral})
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron Daños"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  changeCancellationCause(){  
    if(this.popup_form.get('cestatusgeneral').value == 3){
      this.cancelled = true;
    }else{
      this.cancelled = false;
    }
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/cancellation-cause/service-order`, params, options).subscribe((response: any) => {
      if(response.data.list){
        for(let i = 0; i < response.data.list.length; i++){
          if(this.popup_form.get('cestatusgeneral').value == 3){
            this.cancellationList.push({ id: response.data.list[i].ccausaanulacion, value: response.data.list[i].xcausaanulacion})
            this.popup_form.get('ccausaanulacion').enable()
            this.popup_form.get('xcausaanulacion').enable()
          }else if(this.popup_form.get('cestatusgeneral').value != 3){
            this.popup_form.get('ccausaanulacion').setValue('')
            this.popup_form.get('ccausaanulacion').disable()
            this.popup_form.get('xcausaanulacion').setValue('')
            this.popup_form.get('xcausaanulacion').disable()
          }
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "No se encontraron Daños"; }
      //else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'primary';
      this.alert.show = true;
    });
  }

  buildStatus(){
    if(this.popup_form.get('cestatusgeneral').value == 13){
      this.popup_form.get('xestatusgeneral').value
      return "color1"
    }else{
      this.popup_form.get('xestatusgeneral').value
      return "color2"
    }
  }

  createPDF(){
    if(this.popup_form.get('cservicioadicional').value == 228 || this.popup_form.get('cservicio').value == 228){
      const pdfDefinition: any = {
        content: [
          {
            columns: [
            	{
                style: 'header',
                text: [
                  {text: 'RIF: '}, {text: 'J000846448', bold: true},
                  '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                  '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                  '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                  '\nUrl: www.lamundialdeseguros.com'
                ],
                alignment: 'left'
              },
              {
                width: 160,
                height: 80,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
                '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
                '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
                'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
                'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
                'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
                'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
                'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
                'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
                'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
                'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
                'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=',
                alignment: 'right'
              }
            ]
          },
          {
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nSolicitud de Grúa #', bold: true}, {text: `${this.popup_form.get('corden').value}`, bold: true}
            ]
          },
          {
            style: 'title',
            text: ' '
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'FACTURAR A NOMBRE DE: ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocidentidad').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'DIRECCIÓN FISCAL: ', bold: true}, {text: `${this.popup_form.get('xdireccionfiscal').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'TELÉFONO: ', bold: true}, {text: `${this.popup_form.get('xtelefono').value}`}
              ]
            },
          ]
          },
          {
            style: 'title',
            text: ' '
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                fontSize: 10,
                alignment: 'right',
                style: this.buildStatus(),
                text: [
                  {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                table: {
                  alignment: 'right',
                  //widths: [200, -49, 5],
                  body: [
                    [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                  ]
                },
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                alignment: 'left',
                text: [
                  {text: 'ATENCION: ', bold: true}, {text: `${this.popup_form.get('xnombreproveedor').value}`},

                ]
              },
              {
                alignment: 'right',
                text: [
                  {text: 'NOTIFICACION: ', bold: true}, {text: this.popup_form.get('cnotificacion').value}
                ]
              }
            ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'DIRECCIÓN: ', bold: true}, {text: `${this.popup_form.get('xdireccionproveedor').value}`}
              ]
            },
          ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentoproveedor').value}`}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonoproveedor').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService()}, {text: ' para nuestro afiliado:'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'NOMBRE:   ', bold: true}, {text: `${this.popup_form.get('xnombres').value}`}, {text: ', Documento de identificación: ', bold: true}, {text: `${this.popup_form.get('xdocidentidad').value}`}, {text: ', TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonocelular').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'VEHÍCULO: ', bold: true}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`}, {text: ', Año ', bold: true}, {text: this.popup_form.get('fano').value}, {text: ', Color ', bold: true}, {text: `${this.popup_form.get('xcolor').value}`}, {text: ', Placa nro.: ', bold: true}, {text: `${this.popup_form.get('xplaca').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'FECHA:    ', bold: true}, {text: this.popup_form.get('xfecha').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'PUNTO DE INICIO:    ', bold: true}, {text: this.popup_form.get('xdesde').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'PUNTO FINAL:    ', bold: true}, {text: this.popup_form.get('xhacia').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, false, false, true]}]
              ]
            }
          },
          {
            columns: [
              {
                alignment: 'left',
                width: 50,
                style: 'data',
                text: [
                  {text: 'Cant.', bold: true}
                ]
              },
              {
                alignment: 'left',
                width: 350,
                style: 'data',
                text: [
                  {text: 'Servicio    ', bold: true}
                ]
              },
              {
                alignment: 'right',
                width: 50,
                style: 'data',
                text: [
                  {text: 'Precio    ', bold: true}
                ]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                alignment: 'left',
                width: 50,
                style: 'data',
                text: [
                  {text: '1'}
                ]
              },
              {
                alignment: 'left',
                width: 350,
                style: 'data',
                text: [
                  {text: 'Servicio de '}, {text: this.getServiceOrderService()}
                ]
              },
              {
                alignment: 'right',
                width: 70,
                style: 'data',
                text: [
                  {text: ''}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmonto').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'Subtotal: ', bold: true}, {text: ' '}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmonto').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          { 
            columns: [
              {
                alignment: 'right',
                width: 465,
                style: 'data',
                text: [
                  {text: 'IVA:         ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontototaliva').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'Total:        ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontototal').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'Cubierto:       ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontototal').value)} ${this.popup_form.get('xmoneda').value}`
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 470,
                style: 'data',
                text: [
                  {text: 'No Cubierto:       ', bold: true}, {text: '0,00 USD'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'OBSERVACIONES: '}, {text: this.popup_form.get('xobservacion').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'Sin más a que hacer referencia, me despido'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          }
        ],
        styles: {
          data: {
            fontSize: 10
          },
          title: {
            fontSize: 15,
            bold: true,
            alignment: 'center'
          },
          color1: {
            color: '#1D4C01'
          },
          color2: {
            color: '#7F0303'
          },
          header: {
            fontSize: 7.5,
            color: 'gray'
          },
        }
      }
      pdfMake.createPdf(pdfDefinition).open();
      pdfMake.createPdf(pdfDefinition).download(`Orden de Servicio para ${this.getServiceOrderService()} #${this.popup_form.get('corden').value}, PARA ${this.popup_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
  } else if(this.popup_form.get('cservicioadicional').value == 282 || this.popup_form.get('cservicio').value == 282){
    const pdfDefinition: any = {
      content: [
        {
          columns: [
            {
              style: 'header',
              text: [
                {text: 'RIF: '}, {text: 'J000846448', bold: true},
                '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                '\nUrl: www.lamundialdeseguros.com'
              ],
              alignment: 'left'
            },
            {
              width: 160,
              height: 80,
              image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
              '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
              '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
              'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
              'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
              'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
              'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
              'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
              'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
              'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
              'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
              'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=',
              alignment: 'right'
            }
          ]
        },
        {
          alignment: 'center',
          style: 'title',
          text: [
            {text: '\nOrden de Compra #', bold: true}, {text: `${this.popup_form.get('corden').value}`, bold: true}
          ]
        },
        {
          style: 'title',
          text: ' '
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'FACTURAR A NOMBRE DE: ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
            ]
          },
        ]
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentocliente').value}`}
            ]
          },
        ]
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'DIRECCIÓN FISCAL: ', bold: true}, {text: `${this.popup_form.get('xdireccionfiscal').value}`}
            ]
          },
        ]
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'TELÉFONO: ', bold: true}, {text: `${this.popup_form.get('xtelefono').value}`}
            ]
          },
        ]
        },
        {
          style: 'title',
          text: ' '
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, true, false, false]}]
            ]
          }
        },
        {
          columns: [
            {
              fontSize: 10,
              alignment: 'right',
              style: this.buildStatus(),
              text: [
                {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              style: 'data',
              text: [
                {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
              ]
            },
            {
              alignment: 'center',
              text: [
                {text: ''}
              ]
            },
            {
              table: {
                widths: [200, -49, 5],
                body: [
                  [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                ]
              },
            },
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'ATENCION: ', bold: true}, {text: `${this.popup_form.get('xnombreproveedor').value}`},

              ]
            },
            {
              alignment: 'right',
              text: [
                {text: 'NOTIFICACION: ', bold: true}, {text: this.popup_form.get('cnotificacion').value}
              ]
            }
          ]
        },
        {
        style: 'data',
        columns: [
          {
            alignment: 'left',
            text: [
              {text: 'DIRECCIÓN: ', bold: true}, {text: `${this.popup_form.get('xdireccionproveedor').value}`}
            ]
          },
        ]
        },
        {
          style: 'data',
          columns: [
            {
              text: [
                {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentoproveedor').value}`}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              text: [
                {text: 'TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonoproveedor').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          style: 'data',
          columns: [
            {
              text: [
                {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService()}, {text: ' para nuestro afiliado:'}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'NOMBRE:   ', bold: true}, {text: `${this.popup_form.get('xnombres').value}`}, {text: ', Documento de identificación: ', bold: true}, {text: `${this.popup_form.get('xdocidentidad').value}`}, {text: ', TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonocelular').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'VEHÍCULO: ', bold: true}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`}, {text: ', Año ', bold: true}, {text: this.popup_form.get('fano').value}, {text: ', Color ', bold: true}, {text: `${this.popup_form.get('xcolor').value}`}, {text: ', Placa nro.: ', bold: true}, {text: `${this.popup_form.get('xplaca').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'left',
              style: 'data',
              text: [
                {text: 'REPUESTOS A COMPRAR', bold: true}
              ]
            }
          ]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, false, false, true]}]
            ]
          }
        },
        {
          columns: [
            {
              alignment: 'left',
              width: 50,
              style: 'data',
              text: [
                {text: 'Cant.', bold: true}
              ]
            },
            {
              alignment: 'left',
              width: 350,
              style: 'data',
              text: [
                {text: 'Descripción de la Compra    ', bold: true}
              ]
            },
            {
              alignment: 'right',
              width: 50,
              style: 'data',
              text: [
                {text: 'Precio    ', bold: true}
              ]
            }
          ]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [false, true, false, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [50, 350, 70],
            body: this.buildRepairOrderBody()
          }
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'Subtotal:                 ', bold: true}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.purchaseOrder.mtotalcotizacion)} `, {text: `${this.popup_form.get('xmoneda').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'IVA:                            ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontoiva').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              alignment: 'right',
              width: 475,
              style: 'data',
              text: [
                {text: 'Total:                        ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mtotal').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          fontSize: 6,
          table: {
            widths: ['*'],
            body: [
              [{text: 'Yo____________, CI ____________hago constar que el taller____________________ha sustituido el_______________producto de daños sufridos a mi vehiculo marca____________, modelo____________, placas____________. Daños reportados en notificación escrita a Mundial Autoss del día____________.'
              + 'Importante: usted cuenta con 15 días a partir de esta fecha para comenzar la reparación de su vehículo en el taller asignado, de no hacerlo cualquier aumento en los precios será de su estricta responsabilidad'
              + 'Cualquier cambio en los montos de la mano de repuestos debe ser notificado a Mundial AutosS, C.A. para su autorización. SOLO SE RECIBEN LAS FACTURAS CON FECHA DEL MES EN CURSO HASTA LOS 23 DE CADA MES, AGRADECEMOS SE SIRVAN DISCULPARNOS, PERO SI LAS ENVIAN FUERA DE ESTA FECHA LAS MISMAS LAMENTABLEMENTE SERAN DEVUELTAS.'
              , alignment: 'justify', border:[false, false, false, false]}]
            ]
          }
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                {text: 'Sin más a que hacer referencia, me despido'}
              ]
            }
          ]
        },
        {
          columns: [
            {
              text: [
                {text: ' '}
              ]
            }
          ]
        },
        {
          columns: [
            {
              style: 'data',
              text: [
                {text: ''}
              ]
            }
          ]
        },
      ],
      styles: {
        data: {
          fontSize: 10
        },
        title: {
          fontSize: 15,
          bold: true,
          alignment: 'center'
        },
        color1: {
          color: '#1D4C01'
        },
        color2: {
          color: '#7F0303'
        },
        header: {
          fontSize: 7.5,
          color: 'gray'
        },
      }
    }
    pdfMake.createPdf(pdfDefinition).open();
    pdfMake.createPdf(pdfDefinition).download(`${this.getServiceOrderService()} #${this.popup_form.get('corden').value}, PARA ${this.popup_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
    } else if(this.popup_form.get('cservicioadicional').value == 283 || this.popup_form.get('cservicio').value == 283){
      const pdfDefinition: any = {
        content: [
          {
            columns: [
            	{
                style: 'header',
                text: [
                  {text: 'RIF: '}, {text: 'J000846448', bold: true},
                  '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                  '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                  '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                  '\nUrl: www.lamundialdeseguros.com'
                ],
                alignment: 'left'
              },
              {
                width: 160,
                height: 80,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
                '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
                '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
                'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
                'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
                'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
                'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
                'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
                'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
                'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
                'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
                'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=',
                alignment: 'right'
              },
            ]
          },
          {
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nOrden de Reparación #', bold: true}, {text: `${this.popup_form.get('corden').value}`, bold: true}
            ]
          },
          {
            style: 'title',
            text: ' '
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'FACTURAR A NOMBRE DE: ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentocliente').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'DIRECCIÓN FISCAL: ', bold: true}, {text: `${this.popup_form.get('xdireccionfiscal').value}`}
              ]
            },
          ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'TELÉFONO: ', bold: true}, {text: `${this.popup_form.get('xtelefono').value}`}
              ]
            },
          ]
          },
          {
            style: 'title',
            text: ' '
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                fontSize: 10,
                alignment: 'right',
                style: this.buildStatus(),
                text: [
                  {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                alignment: 'left',
                style: 'data',
                text: [
                  {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
                ]
              },
              {
                alignment: 'center',
                text: [
                  {text: ''}
                ]
              },
              {
                table: {
                  widths: [200, -49, 5],
                  body: [
                    [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                  ]
                },
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                alignment: 'left',
                text: [
                  {text: 'ATENCION: ', bold: true}, {text: `${this.popup_form.get('xnombreproveedor').value}`},

                ]
              },
              {
                alignment: 'right',
                text: [
                  {text: 'NOTIFICACION: ', bold: true}, {text: this.popup_form.get('cnotificacion').value}
                ]
              }
            ]
          },
          {
          style: 'data',
          columns: [
            {
              alignment: 'left',
              text: [
                {text: 'DIRECCIÓN: ', bold: true}, {text: `${this.popup_form.get('xdireccionproveedor').value}`}
              ]
            },
          ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'RIF: ', bold: true}, {text: `${this.popup_form.get('xdocumentoproveedor').value}`}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonoproveedor').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService()}, {text: ' para nuestro afiliado:'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'NOMBRE:   ', bold: true}, {text: `${this.popup_form.get('xnombres').value}`}, {text: ', Documento de identificación: ', bold: true}, {text: `${this.popup_form.get('xdocidentidad').value}`}, {text: ', TLF.: ', bold: true}, {text: `${this.popup_form.get('xtelefonocelular').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'VEHÍCULO: ', bold: true}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`}, {text: ', Año ', bold: true}, {text: this.popup_form.get('fano').value}, {text: ', Color ', bold: true}, {text: `${this.popup_form.get('xcolor').value}`}, {text: ', Placa nro.: ', bold: true}, {text: `${this.popup_form.get('xplaca').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'left',
                style: 'data',
                text: [
                  {text: 'PIEZAS A REPARAR', bold: true}
                ]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, false, false, true]}]
              ]
            }
          },
          {
            columns: [
              {
                alignment: 'left',
                width: 50,
                style: 'data',
                text: [
                  {text: 'Cant.', bold: true}
                ]
              },
              {
                alignment: 'left',
                width: 350,
                style: 'data',
                text: [
                  {text: 'Descripción de Reparación    ', bold: true}
                ]
              },
              {
                alignment: 'right',
                width: 50,
                style: 'data',
                text: [
                  {text: 'Precio    ', bold: true}
                ]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            style: 'data',
            table: {
              widths: [50, 350, 70],
              body: this.buildRepairOrderBody()
            }
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'Subtotal:                 ', bold: true}, `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.purchaseOrder.mtotalcotizacion)} `, {text: `${this.popup_form.get('xmoneda').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'IVA:                            ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mmontoiva').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                alignment: 'right',
                width: 475,
                style: 'data',
                text: [
                  {text: 'Total:                        ', bold: true},  `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.popup_form.get('mtotal').value)} `, {text: `${this.popup_form.get('xmoneda').value}`}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            fontSize: 6,
            table: {
              widths: ['*'],
              body: [
                [{text: 'Yo____________, CI ____________hago constar que el taller____________________ha sustituido el_______________producto de daños sufridos a mi vehiculo marca____________, modelo____________, placas____________. Daños reportados en notificación escrita a Mundial Autoss del día____________.'
                + 'Importante: usted cuenta con 15 días a partir de esta fecha para comenzar la reparación de su vehículo en el taller asignado, de no hacerlo cualquier aumento en los precios será de su estricta responsabilidad'
                + 'Cualquier cambio en los montos de la mano de repuestos debe ser notificado a Mundial AutosS, C.A. para su autorización. SOLO SE RECIBEN LAS FACTURAS CON FECHA DEL MES EN CURSO HASTA LOS 23 DE CADA MES, AGRADECEMOS SE SIRVAN DISCULPARNOS, PERO SI LAS ENVIAN FUERA DE ESTA FECHA LAS MISMAS LAMENTABLEMENTE SERAN DEVUELTAS.'
                , alignment: 'justify', border:[false, false, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'Sin más a que hacer referencia, me despido'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
        ],
        styles: {
          data: {
            fontSize: 10
          },
          title: {
            fontSize: 15,
            bold: true,
            alignment: 'center'
          },
          color1: {
            color: '#1D4C01'
          },
          color2: {
            color: '#7F0303'
          },
          header: {
            fontSize: 7.5,
            color: 'gray'
          },
        }
      }
      pdfMake.createPdf(pdfDefinition).open();
      pdfMake.createPdf(pdfDefinition).download(`${this.getServiceOrderService()} #${this.popup_form.get('corden').value}, PARA ${this.popup_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
      }else{
      const pdfDefinition: any = {
        content: [
          {
            columns: [
            	{
                style: 'header',
                text: [
                  {text: 'RIF: '}, {text: 'J000846448', bold: true},
                  '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
                  '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
                  '\nTelf. +58 212 283-9619 / +58 424 206-1351',
                  '\nUrl: www.lamundialdeseguros.com'
                ],
                alignment: 'left'
              },
              {
                width: 160,
                height: 80,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
                '+SOnHwHCD7B/4Baxv2ha6PHmB9mfJiVDIHPtTRFcqwFAHwOEH6Dk3S8a8NAkdH/TNaH/zz//WwRK8hakLe7//o9/s368vr6WtWgISBRg6UgIBIQfRjoIT1Xs6/Tu/yjGomLfucHWi74YPRISPtoyUDJvACAO9UcECiOgyYTRZ/fnNMCGJwEIPwx9sJ2rh19XMlbh1d90PcHKi74IzpdX/ve1F/45PaZxY7RYNdJUNECmAZYYAIDww9AG1LrD+bclr743A6gX/vs9AvPohX9C72m1zxZGwNsGPvJODYA1rQ8IP/R98FzokTqM2utSqjqv//ueP3n2wn9ML+pMP85cMzUkMAAA4YdeDpQiakuXfv5+MHXTD4T5XwTAC39Gb+pk/y4MgDrzUzAAoLP8jSaAsuD7I1dPNtWgKHP27/3xkx8EZ1IdbSAZ0VN6TD+RXfv8Mfe//uiPSzVIUyM5MF/8+7TWZa4ACD8MWvAl6/mjP372A+zUH6sBJj8Rxu+/AfCkhqh4/z/544P7tpKkLgMAYxEQfhic4Ivn9IsfSI/9sRh52VNKvvbLCJAdFyU0P/H/PK8hCiAGwG/yvulUGgDCD40K/rE/VokE/1E9pSKUT/Gab7CGv79GwHorCvCc8PLyvt3792+pSYcACD/ULvhL923r2XeRl7tT736intJmZM1J2HYkUQD3bVfB9y7dNICsKrhSA2BOSwPCD3WJ/lwF/8rZlzMVc/fi3Wcj9+4PeWt4/MMxAJ40T0UMgMuEEQCpifGJ+X9A+CG14Gf+kPnmTxGC/6gez0Tn7je07EGY4x+mEZBrBCDlFEAx/0/4HxB+iBJ8SdwTj1zWmlvLl0o4/1LD+Ss2Jgny+GHYEYBlDQZAEf7H+weEH4IEv5jHl8Q9a6lSEfxzDefntOpOTmkCDICSAfAx0WVPCu+fFgaEH6qIvmQi36vnYEE2HCnm79e0aBSE+sdlAEhZa1kFkGoZ4JXO/RNZAoQfdgp+Edb/' +
                '7Gyb6BSCP2f+Pg1syTtKA2CjywClDsBdgkvK3P+Gyn+A8MO26C/Uu7SE9RF8A1qnH+A1A0DqAEgfSbECQBJyvxD6B4QfXvYel1Cg//VXF56tj+DXyzNNAFsrAGK5YtkfIPzjFn2x/n9z30KBCH73YH4fCvEvEgB/dvHh/2LZ343U5dCluhNaGUL5gSbol5fvf4gXEZpRzhahacHrglADQIzBTAtpSbnso4jLvXWlqT1/Tet1ZOfMp5Kx+lT8ZKxA+KE7Xv6V4cVe8BInh0zrBvjPP/97utXW0x1tP93zPM5q+mpiSG/8Ie/VTUgip4T/NRE3d/bltqk4fa2t1Jh4VkNgrfd7P/KNt4ajJ/5B0grdFvyJDhIhg9ijevg5LViLIB0ywj56MVjQUn9pN+nLE/1nVjKipg2IdZ3IFNoidCWHZuvLO3rSs/u9U2PgxSigsBceP6QV/ZkODFXDgmKhSxiRKnvtMrq296J+XPK+p1viPnVxoe2uIzvuZRKhCPT+i2S9hbPX3miDs7KB5u/hQQ2BNYYAwg92wT9WAQ/ZMlcKh1BHvxmykXrshagXnnsh9Gd0iRevXd7ZechJKpJSoz934ZG9rnCqx7uSISDTGTdMDSD8UE30p/rSVA3/MY+Px59a4Athz0oij7gfZmI9UQ32TMP/EgF42+N2KAwBWYL4qJGAm5Hv5onww6uiLy/8rxX/XML6Mo+/ouU6R2+8HC1GNC158Ai8nTz2AmrArzW3Z+nCon5d5ETv4cLf03MpEoAR0KbWkNzXCcEPDe1LWH/OXFprYrk+IJDnf//Hv9cdFvniGMtGQ3c1X1+89byOZ64GgOT6FM/uZCDP5FkNpZzpAIR/jKIfsjb/UQV/Tcu1KqCHXprWhV/D9YVYZD0W+WJJWcF6S3A35X/7dt+MYMzI9NfiZzmhctJD4+BRHZ8cZwbhH4Poh2Ttf9AKYNB94f+x6U161JsvC33Xs+jLgl6IeVFExnUxYtLD8aVs' +
                'EJR/L5IyjztoEF6rAcDzR/gH+VKKiFdZwvOgXj7hsJ4IvxetNw18h0Lo5ejivPxjySP/7hiDV97zKEJhJLS5DPNODYCcp4PwD8UKl858KGuX5D2Ev+tCX4h74amLl/bk7x8jdXhGQVsJoBQjQ/h7/wLJiyPZrIfCa3fq5eMZ9U/4n73wHSf4DOkrs5LYtxm6fygJfOG1r+kJGAMN9k8MAIS/ly/KVD2iI7z8QQv/nRfFzHDNYx1AC7FvI0HrL7XZ8d4hYHwrjIA6axBgACD8vXkp5u7wjlzM5Y9M+Le8+qYLtjyUPPi1ijwZ1ZBqzJtp357VFA2gcBnC3+kXoEpRHjL2RyL8uuPcXAfEprz6QuTvVeAZLKFpI2Bek3FLTROEv3MdPnf7i/JI2GqGlz8o4X/0wjrZ+vu6vZ/tPlWIPJ48dGk8PFYDYJHY6GWKFOHvjei/bOWJpTo44X/x+lV4m8iAvtsS+Q1PCHoSBVgkfj/u1JFiTEX4W7FqZRA+3WOdzqlV3Wvhf3LtZNk/u9I+6ITsYQDjZea+7UlwlvAdYXxF+Dsl+g9qkeKV9Vv4166ZtcyPJW9+TYY9YABUhrwphL8Tok9HHI7wy1ziu5qEfl0SegxEGKMBkLs0OQAk/iH8rYk+y/SGJ/wyOH1JcKnnktDfIPQAf4yp4iRdJbiUjL8Z4o/wp+6g+3bXI4FvuOIvYm0JS946QvcAVcbWiY6tseF/xB/hb8zTv6S61KCFX579TYVB6a4k9GtaDqAV7x/xR/iTdcj7HaL/rB0Mb24cBkBRqrRcn/+lIh4ePUCysXaqhnbM3P+DH5entCbCH9MRdyV4MZ8PAFDPmFs1yraPaz8+zxF+hN9qff62Q/QJJQEA1Dv+5m5/cbRD/DL2df5/oxuZWCH6AADNox77h4hL5Bo9QPihsrU5cd+HmopKUYg+AEAz4r/0Py6Npx/tcN4QftjLbOvfJPIBADQv/nmE+F+oE4fwQyXKIaJLRB8A' +
                'oJfiv0T4IZRr1ukDAHRC/K8Np87GOtdPVn9og33rKFPfbmtaAwCgM2OzGACh2f6jLLSG8AMAwFDEf1dRtX2Mcl0/oX4AABgKi8C/H2UlPzx+AAAYkte/cQGlfb0GvsHjBwAA6C8bmgDhB4BuembHY6+gBp3oh6ML9yP8ANAWMh+b0wyQmCBjcoy1WJjjB4A2vKyJ//G7/vOc5bGQqF+J6P8rUPiZ4wcAaID8ld8BYpgF/v3zGBsJ4QeApr0yGZzLG12d+P+2pGWgBeEfZcl1hB8AmhR9CcXu2hltMeZNUyBJ35L+8zbwtPUY2+qHMd70dX59rJZedjG/2PDKADSGJPTtWmMtW6Xm8k7SRGBkbjjnBo9/POQ6+Mx5VwAa9ciu9vzJmU4DAIT2rWMXXrXvbqy7q45O+L23L52jCAct1PsHgGYM7kOsWNsPBmRcPwo8ZznWxhqV8HuRl0INv5b+05HBSgSAcI9s7r5P6HuNE95JaMjbXyP8wxf941c8DgYZgPoH5lXAKVck+kHN3v58zA02Jo9fBp5d2zUeeaNgzrsDUBtLw8Cc02y9N/iW/vgaeGSBnzExOG+yFe8G4R++ty/CfnFgYAKA9IO/TK+9M5xKoh/UYVQ+M96PQPh1Xv9QmPEErx+gFlYx55LoBwe8/YvQPjV2b3/wwl+a169iETLXD5B2YBZj+iziEiT6wT4s5XlXNNvwPf7X5vV3ceoNhYwuAZBE9EMT+l6DRD9IJfwL7+0/0WwDFn4v4tIpQsNAS7oEQBLkXTpKdK2c5oQdTEMkwYs+/WjIwu9Ff2IcLM7w+gGivX1rQt+r7yWJfrCDqoaliP6c5hq+x38T4W3QQQDiqGMeNSfRDyx+IKI/AuH3HnvIvP4uLjRiAADh3r4k453VcGkx5Je0MJR4RvQR/mJeP0WIkQEGIFz0j2t+d97pNAKAsN7z/94j+iMQ/oh5fbx+gDSsXLqEvn2fAfBaX7jzx89e9Okne/hhQPcS' +
                'M6+/i4VjDTFAVW8/c+GraITnwPdWEv3mZGiDbLLj+8K5/zUrIgBj3nhndB6/986XLm5efxdztuwFqNUTfzQa11T0gz/E3x9LPRD9sQi/Lr+7quHSbNkLUM3bXxgNb/Hab9zhJK1d7+aSlgcYofCrR34TeFrIILPA6wfYK/oxCX25VlK7MZxLoh+Akb7P8YfO6z/qIPUpwLOYOSqHAbyGNaHvtrRZiryTF8bPzngE0JCRK4bmxP1ZMVB+7nIMN3oIa/m9axsD9Vb4dV4/dL3wvPRAqrJE+AF2DoSZUbAL0X5BBkV/rTvD+9xKop9GOYKjDW3MQYfub6/c76tpH3D/E8NnT/31O9GWWi0y03sN6Zvlv73Sa8mPOzUEWk9CfOO/QB9FXx7Gl1AP42J+MdPzRfxPAs699Oci/gDfD4z3zja3f+fHnWyHQH0xXEum7iZNbr5i/a7+O75p4RlZBvjzfcIU8aySUVdbqthb9nmx9FuJWMs2wfd4/IdF3zqvX07Uk/NDCv0MzuvXYkeFNSvHa+HaR42SyEBw7w2gGwehRmqm3s/kQFvvbHNt903HRH/p7Ctplrs8OKPXXyT6kYgL1r58rP1nHugQxnCkxsWF//yXKegmI1e98/j9QCrC8zbwtPd+4Fxtid7nUCvYX2Pd0j2vAwfEO/9dsx3XmZQ6uLXmwf/5479Cb8F/n3kL7TZR4bTc60f/nRfGz52r1/A24e08qPF507YRoNvkWtv1L95+Ik/yvKnwKR7/MDz+kuAvXP2Fp6rQmAHQq6x+P6AuDIPpXVn0BfVaQ5cQLVu89VAv6Gk7SuIP6Uy/a6QjppP/r+GcWUurI6xFnR5CRV/beOkPaftPiUXfqXf9qzxDMQRb3kUypkLfYs9gLmJzHfGdAKqKvhjmYkBfdUT0nUYbPvnvtq57xUpvhN8PdFMd+EJ43jPQhIasW9my11g6+H4ruiEdPMWclVik/2M4r1gd0WS7WTdrkj6TBX7WvOFB' +
                'RAzBL20YAOrtWY2ajxXmMxcGo/zFMNJ6AgB7vXx/yNj/uUOCv+v9/k2n08Yr/MZ5/Rcv3Xturw00eUpvpUbMwq/il7KDLzXMfNvltovcrCnz9/hUtV/q1NOnlgaRwgDIG4yo5MbzRMwPDmSapGf13pdU9IM9oj/VsfFtT77ylXr/yft0Xzz+3IUnXfwlxF9G5+sfA6/5toXNeywe3ZOG9t8l/B7PJePLMjCfatSmiQiJVZwu9xiKu4zRdUcGEYnmbOr2/tUDsSY/Latm3kv5VcO76dT4IuQPu/ruXN/Xk559dTHu71OH/jsv/MZ5fRGpKqHlpeErLRtuAouhMXfpl6PkhSesRtNDR71+67z+ddUlmyXRP+3Qq3Kk3n8t/VMT+qzP78GwW9rcagQZ167DsEW/rqjc3Y4jNWKsJJ3377TwG+f1hVnFcK0lya/pLXstn1XHGtTVgX9Xei51hqQj5vUfAlcdWD+nCepaz15LQt8er18Mq9tEfRUQ/RSIVnz0xy/++FFWFsgKlR2HrDj4Sf/u2tlyVnYZ9snEv7PCHzGv/7Hqsjs1DnLDZzQ513/Wgcdxu72ETL3jR0PnndXUX6zz+kHJfBpOv4gYOK51QDjfOuS/fYjwGORZ/Lxveiti8JR7tk5p3EYss7O+ZyT61YjuiPfm0KH9OZTziteu0m+niURf3slL/7nH/lj44+bQtJVUo9S/k8qSomWXzjZ9tUv8o52nLhfwWbnw+ZgHw9rrlUEwZMveZdUksAgxqyuyUJSOvN/hIU5UCC8qeFAi/qE7Iy5c4mJIkfP6WeBznBs/RwbB1YHPuikZvTP9rCqGn3jG8xr7o7Vtn2OMZC3l+8HZdt+URL+8yYp+0ClP3+o4/qX/plhXr9fI1SBdOnv07EjvK4v5Pp0Ufl0edWF4SMGDsniy/vNuAz2aYsveZc1NkVL4n1XAVxUEItfcCrm/2Z4IysqFF794SfKrmkRXEeu8/qXhe8yMn5MH9Mki' +
                'EpVrhGG5xwD44P++tn4YmdC3SrA5ycrZKqodlc6F8bFycYl8ksOUpTYcJddFlxPKYZ0ulD0qlpoEa6JzoX6d17eEK5cRYmL5vCa27M1SNasYESIQVb1C+TuJnvhjckCgLFb1ImF/sc63X4fuv6B9M9TAuIvZ50GMLq3C+N59P1cov5/XLPoTo7ctPMYMTKWB8inCwCbRb5zefubi8pyufb+b1hUtUmM4c/ZiVcKVvp/9F34V0twwuN7GzG0al/Y1UZQmhccv3madYWDLoDxL1F+s8/oPxhLCFkNvneJetX9n6oncqSG3rrn/5RHnJjPuNEx618I9QD+JMThF9Od1f0ExKvRzbtu4z655/BbvzRTiT+T1L2tuj1jhr31XQU36Cx2Uj3Q6J0b0J8ZBPbgyXySzhG0tm/XINElWd36JljS1JpZKPf7UmzlZDYmTOiugQSe9fWu/fWhC9LeYO9vS6Jchwer1d0b4jfP6LwNrokEwd+HLLk5iBewAMRn9HxrcSnhp7PAxWOf1axfNLU61mFKfBs9jF7ckLvk7oaV+raHRRUxYFHqFte9Vrf2S3POPfF9MBnEnhF+9N8tA8yFVuDNivnpZY5tYeahz7ndH28kzCJ0qObPeY8S8/mVkUqH1XKn9cNNC1ceYwcSaGPUxQULfvu9lWRNNRb9xePvHzj63v6qx39Zp1JqMla5k9Vu8tzrEbWnoOOL1z2rYpz5GJNpYwyxt98nwPUN3wbPO61/HRkDEOPSf/2A0OmTVSKZGy6rhqEPI4Cn97iryGnUanRtr+0sYuKmte6EVsohz2zYMLdrzoj9Sr6DC5lfdEn6j91ZLWEaX9sl8dWiIfeHi14ym6sR3DSR97Wq7XJ9liAE3DxH+iHl9azLfawOEtSjIkYrqlb8XsfDzNp7VAfLI89+57pK7tEtkoVtYq9rdtl3vQWtWWJ0K0Yog4W811B/hvS22K8klxGL51bFl76TB799W24Um+VkiQ0mT+TRq' +
                'kKIet1j3UltfjM1lF6YBIhP6+gCJfnj8u+iK8W11HoPHjtaEP8J7u60zaU1D9pbSiqkHFIv1+ljDlEPdRse8Yn+xzuvXkcwnAvmQ6FonGgX43d/juuZk0X2iH5vQ1xdI9INt7nv+PYK1QuoetyX89667G51Y+SlVJMK3j+XBfDSULE79XHMXPle1t900MvTZ8HVqW85Y2kuiDg85pMpiKuG3lK7uKxLanUW0lXiWX0LPq1pjPvFztYwj5ylyITS6ctXUZ/vP2zhbUuqPXSjtbO1X7tvy2aBoRysef4T31nWWidrHOle17kAbmKog7mkL8c4s4n1dc2To6ZWKeikocgGKaYBaK0TqZiZjEX3hLRX9BolpJcoY93NoXPh1Lnyog0yqLXtN12g5zF98B4nkhM6Bz/f8P+uKj3lD9yuGjgjndQ2XLwyAe416dMlY6zu5g6Fh2v0uxW53CP9+0U+xY9IYvH6Lx//QoTawJPlNd/QX64qPRr05maZQQ+PcpUn82+XJfNZaAEkHKd2v/MyNDxL9hsemwfG2DhozQJr2+K3V1vrELMHgbOmIXUlQsSZIzrZE37riI2trjXxpQ52fa4oASC2AdSrxH1FC32tYNzrZOOgi1ve+K8Jv/R7BY39jwi9zlSPxLIote2OYNPHwaybUm8pKfaXYrCmUy8Tb/VoNgHuNAPzkj48ubQ7AaULxX47AED9EcD+zVnjTXIo+cN/TZ2n93llXnEbjecH9sRHh13n9KzceYrfsPR3Ay3oTKHjTSEG6bnBvgqoGwEZXWYghd+nSTcecusgppQQJfZJ9/aYLh/8uPzrj/K77trd5UzXaG51LthoaPU52WxvPe9v2PL9Gnk6buu/ahX8k8/q7vP65sb0aC/fULHoyeISEkWWef6LJkaGC9ODaKVNcuS3EKJGd9Vy6PIB3kYmkMSH+6y6VvlWhijGEVoaB3/IMJw03jeXzHlxP0T5pja61PX5Y++9jaLnepjz+Mczr' +
                'p+xIlpf1saO133PDvYee81K+uau173cYAUUewHmEl1pg8lQjE/qeu2hk+cEvjzCoTgz3tDF8TtZws1g+b+P6jdXJbK2wk0ZmLpq831qF33skCzfOjOGXwcRYhW06lJdVi/KEJLktDf1lVmP55roNABloPjQp/AkS+lYdDgXHeP2hiX6WCFsfhL+v8/t/9E/jeUeuhci0vo950/db2yY9GrL+NeIS73WNdOtIKVWjAbM0PFSL8K87/CLmAdbsmaGPdPneqxgAUqBHDBfLxj/WPmmNwElYcdnVtpRQrx9IryO8pzxALC39TpYQzvz3rF1gtECRZc6419OyEvb2935nfDdO/bm5v8a8wa+cO/vc/rU10bQWjz/BvP5tV0Q/0pM4MRRemRg+p7MerwpzHWvbr5vsI/Ic/fFURy19TUp835AYxCT0zV33kXfVOs9bOdFP51W7sKdHys95tswXd5CYqagLEf8mPH39nLct6FJtoX65oRPjuQ9dG2AixSu0Ew4ho39Xf0hJo8l8Kvaf1VP+VJP4r1z60r/bxBhKd33Yy149oKipjIBEP4tzc1q3sGhhIovHO4gkbDVePkaK/7quTH+dUpJ36SLiMh+s3n4twq/z+lYrRga+eUcTtayDSeUte60Z/V1Yu17Bo31MdLlGk/m0/sR2GP6T/vfU1HZPfrBZuLj9Mfrg7ZffVWt/C0n0swp4bV6lbrZkXTqdu4HgRXHh4lYoiOG00UTY1O9h7AZ1D7FTbkmFP8G8/qKrIhaxXa9Q9SFNjN5vXwbjFDSWzKc7Db42iF7pNrqThO9OaJSsUhRKPZeYgSLKu2hh0I9d3ndVZQ28epbWSKCIfzJhkWkcf8j3sU7l9CKiEzpWuLgo2kuET73/WeTzmevugb+6uFVuz85e6Ce98CeY1+9cAZYIAd/l9VcRiF6X6q3gTcSGshtJ5pO+LHXx3eFQnHgF97E76EVUKqz67FcRg82z62FZ38jlfSGGaoyBcaLC' +
                'IgaATDHMqq4s0DnimZ4ngvIl0otcuoGhxmqWYNyR9/zz1nM6rvh8cn+IIfrJ2ae/y+9ilsIIT+nxr1zcvP6i6x0pMmRd5cUazFK+HW335OJCiY0k86kIi3FRdbqqvIXuKjQCoPkC1tDfwfbUhL6YucRFjyu5xYjZWRVvXL3k2H0ZTtRTlzyS3/3nfhXvXT3N7UP++1f/d//Sv3+XQFBuB+jtl6MyKcR/+zn9SwT9lWdUfj4XLk0dm0L0kzh6SZbz6eB1EXFDvSnAooOJZemVbNm7PBCmnhiu26cXduVsocgmDcMbowgf6b1JRb0HfS73rxhmEx2MsohB+67itFhsQl/uekqC5X3i3d1UMHwWkc9yF6cNNdNLXpUbMLrEL9N3MmUxuSPXTJ2apKKfxOPXucmYwWXepwIs6vVbrcdlDS97n5bfZD0wDBcJvINTNQLEQPyy4/ikYnQSMRAcHKwTJPQtXP9ZRjzPoypRAzUMZq7+VRl1CcqTGzgqmlPXv5LEMl01Sb3MMkr4S3OTVivqoybN9Q2rofPqlr3GjP7nvkRKIgzERivzqReddXyAWBxqkwQJfddDWNOdYHnfu4BEv6xH4p/ci+xJX5Bn9LEnX1mSamsxzGI9/lWER/GgO5f1Eeua631b9g42sa+U+BlqILZSma8k/l0cIC4rJsHGJvQNwdsvt8Vj5PlVvcrMpVu6WhePYxP90jN60qV+5x1+TuLl/1RnlUyz8KeY1+9r5zHsPPedt/aK1z8xXGvdkyaT7xka1r5us3qj7qjXpQFC3plfqoh+goS+5ZDCvwmW951VXXZXCil31auU7zUdo+hvPae1P2TMfe+6E6WRceYX9fI3dX6QSfgTzOv3cmMVixcQ4PVnhmt1vg11LXxoVKgzqzy2NtNpa4C4lcE6YFosj/gsqce/cgMjxfK+qpXcSl7lTy4+4z9lH/pZvtcY5vQD+sVKna7LFg186ZeXYog0sY9DjMefO3sY8UPfN1Yp' +
                'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=',
                alignment: 'right'
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            alignment: 'center',
            style: 'title',
            text: [
              {text: '\nORDEN DE '}, {text: this.getServiceOrderService(), bold: true}, {text: ' #'}, {text: `${this.popup_form.get('corden').value}`, bold: true}
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                fontSize: 10,
                alignment: 'right',
                style: this.buildStatus(),
                text: [
                  {text: `${this.popup_form.get('xestatusgeneral').value}`, bold: true}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                alignment: 'left',
                style: 'data',
                text: [
                  {text: 'CLIENTE:   ', bold: true}, {text: `${this.popup_form.get('xcliente').value}`}
                ]
              },
              {
                alignment: 'center',
                text: [
                  {text: ''}
                ]
              },
              {
                table: {
                  alignment: 'right',
                  widths: [200, -49, 5],
                  body: [
                    [{text: [{text: `Caracas, ${new Date().getDate()} de ${this.getMonthAsString(new Date().getMonth())} de ${new Date().getFullYear()}`}], border: [false, false, false, false]} ]
                  ]
                },
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                alignment: 'left',
                text: [
                  {text: 'ATENCION: '}, {text: `${this.popup_form.get('xnombreproveedor').value}\n${this.popup_form.get('xdireccionproveedor').value}`, bold: true},

                ]
              },
              {
                alignment: 'right',
                text: [
                  {text: 'NOTIFICACION: '}, {text: this.popup_form.get('cnotificacion').value, bold: true}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'TLF.: '}, {text: '02122503211', bold: true}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            style: 'data',
            columns: [
              {
                text: [
                  {text: 'Sirva la presente para solicitarle la prestación del servicio de '}, {text: this.getServiceOrderService(), bold: true}, {text: ' para nuestro afiliado:'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'NOMBRE:   '}, {text: `${this.popup_form.get('xnombres').value}`, bold: true}, {text: ', Documento de identificación: '}, {text: `${this.popup_form.get('xdocidentidad').value}`, bold: true}, {text: ', TLF.: '}, {text: `${this.popup_form.get('xtelefonocelular').value}`, bold: true}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'VEHÍCULO: '}, {text: `${this.popup_form.get('xmarca').value} ${this.popup_form.get('xmodelo').value}`, bold: true}, {text: ', Año '}, {text: this.popup_form.get('fano').value, bold: true}, {text: ', Color '}, {text: `${this.popup_form.get('xcolor').value}`, bold: true}, {text: ', Placa nro.: '}, {text: `${this.popup_form.get('xplaca').value}`, bold: true}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'FECHA:    '}, {text: this.popup_form.get('xfecha').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'ACCIDENTE:  '}, {text: this.popup_form.get('xdescripcion').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'DAÑOS:  '}, {text: this.popup_form.get('xdanos').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'ENTREGAR EL AJUSTE ANTES DE: '}, {text: [{text: this.changeDateFormat(this.popup_form.get('fajuste').value)}], border:[false, false, true, true]}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'OBSERVACIONES:  '}, {text: this.popup_form.get('xobservacion').value}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'Sin más a que hacer referencia, me despido'}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            columns: [
              {
                text: [
                  {text: ' '}
                ]
              }
            ]
          },
          {
            table: {
              widths: [200],
              body: [
                [{text: ' ', border: [false, true, false, false]}]
              ]
            }
          },
          {
            columns: [
              {
                style: 'data',
                text: [
                  {text: 'NOMBRE APELLIDO:      '}, {text: this.popup_form.get('xnombres').value}
                ]
              }
            ]
          }
        ],
        styles: {
          data: {
            fontSize: 10
          },
          color1: {
            color: '#1D4C01'
          },
          color2: {
            color: '#7F0303'
          },
          header: {
            fontSize: 7.5,
            color: 'gray'
          },
        }
      }
      pdfMake.createPdf(pdfDefinition).open();
      //pdfMake.createPdf(pdfDefinition).download(`ORDEN DE SERVICIO PARA ${this.getServiceOrderService()} #${this.popup_form.get('corden').value}, PARA ${this.popup_form.get('xcliente').value}.pdf`, function() { alert('El PDF se está Generando'); });
    }
  }
}
