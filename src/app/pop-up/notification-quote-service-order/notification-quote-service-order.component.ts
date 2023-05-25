import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-notification-quote-service-order',
  templateUrl: './notification-quote-service-order.component.html',
  styleUrls: ['./notification-quote-service-order.component.css']
})
export class NotificationQuoteServiceOrderComponent implements OnInit {

  private replacementGridApi;
  @Input() public notificacion;
  @Input() public quote;
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
  canDelete: boolean = false;
  corden: number;
  variablex: number;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  serviceOrder: any[] = [];
  notificationList: any[] = [];
  serviceList: any[] = [];
  taxList: any[] = [];
  aditionalServiceList: any[] = [];
  changeServiceList: any[] = [];
  coinList: any[] = []
  code;
  danos;
  alert = { show : false, type : "", message : "" }
  replacementDeletedRowList;

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
      xobservacion: [''],
      fcreacion: [''],
      xdescripcion: [''],
      xdanos: [''],
      xfecha: [''],
      xnombrepropietario: [''],
      xapellidopropietario: [''],
      xdocidentidad: [''],
      xtelefonocelular: [''],
      xplaca:[''],
      xcolor: [''],
      xmodelo: [''],
      xmarca: [''],
      fajuste: [''],
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
      xrepuesto: ['']
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

    if(this.quote.createServiceOrder){
      this.canSave = true;
      this.createServiceOrder();
      this.repuestos();
    }
  }

  createServiceOrder(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.quote.cnotificacion
    };
    this.http.post(`${environment.apiUrl}/api/service-order/notification-order`, params, options).subscribe((response : any) => {
      this.aditionalServiceList = [];
      if(this.quote.cnotificacion){
          if (this.quote.cnotificacion == response.data.list[0].cnotificacion){
            this.popup_form.get('cnotificacion').setValue(response.data.list[0].cnotificacion);
            this.popup_form.get('cnotificacion').disable();
            this.popup_form.get('ccontratoflota').setValue(response.data.list[0].ccontratoflota);
            this.popup_form.get('ccontratoflota').disable();
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
            this.popup_form.get('xproveedor').setValue(this.quote.xnombre);
            this.popup_form.get('xproveedor').disable();
          }
          this.notificationList.push({ id: response.data.list[0].cnotificacion, ccontratoflota: response.data.list[0].ccontratoflota, nombre: response.data.list[0].xnombre, apellido: response.data.list[0].xapellido, nombrealternativo: response.data.list[0].xnombrealternativo, apellidoalternativo: response.data.list[0].xapellidoalternativo, xmarca: response.data.list[0].xmarca, xdescripcion: response.data.list[0].xdescripcion, xnombrepropietario: response.data.list[0].xnombrepropietario, xapellidopropietario: response.data.list[0].xapellidopropietario, xdocidentidad: response.data.list[0].xdocidentidad, xtelefonocelular: response.data.list[0].xtelefonocelular, xplaca: response.data.list[0].xplaca, xcolor: response.data.list[0].xcolor, xmodelo: response.data.list[0].xmodelo, xcliente: response.data.list[0].xcliente, fano: response.data.list[0].fano, fecha: response.data.list[0].fcreacion });
      }

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cnotificacion: this.popup_form.get('cnotificacion').value,
      ccompania: this.currentUser.data.ccompania,
      cpais: this.currentUser.data.cpais
    }
    this.http.post(`${environment.apiUrl}/api/valrep/aditional-service-quote`, params, options).subscribe((response: any) => {
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

    if(this.quote.cnotificacion){
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
      this.quote.createServiceOrder = true;
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

  editar(){
    this.popup_form.get('bactivo').enable();
    this.showEditButton = false;
    this.showSaveButton = true;
  }

  repuestos(){
    let repuestos = [];
    if(this.quote.repuestos){
      for(let i = 0; i < this.quote.repuestos.length; i++){
        let repuesto = this.quote.repuestos[i].xrepuesto;
        let montocotizacion = this.quote.repuestos[i].mtotalrepuesto
        repuestos.push(repuesto);

      }
      this.popup_form.get('xrepuesto').setValue(repuestos);
      this.popup_form.get('xrepuesto').disable();
    }
    this.danos = this.popup_form.get('xrepuesto').value;
    this.popup_form.get('xdanos').setValue(`${this.danos}`);
    this.popup_form.get('xdanos').disable();
  }

  onSubmit(form){
    this.submitted = true;
    this.loading = true;
    if (this.popup_form.invalid) {
      this.loading = false;
      return;
    }

    this.popup_form.get('xproveedor').setValue(this.quote.xnombre);

    let notificacionFilter = this.notificationList.filter((option) => { return option.id == this.popup_form.get('cnotificacion').value; });
    let aditionalServiceFilter = this.aditionalServiceList.filter((option) => { return option.servicio == this.popup_form.get('cservicioadicional').value; });

    this.quote.cservicioadicional = this.popup_form.get('cservicioadicional').value;
    this.quote.xservicio = aditionalServiceFilter[0].value ? aditionalServiceFilter[0].value: undefined;
   
    this.quote.xobservacion = this.popup_form.get('xobservacion').value;
    this.quote.xfecha = this.popup_form.get('xfecha').value;
    this.quote.xdanos = this.danos;
    this.quote.fajuste = this.popup_form.get('fajuste').value.substring(0, 10);
    this.quote.cproveedor = this.quote.cproveedor;
    this.quote.bactivo = this.popup_form.get('bactivo').value;
    this.quote.xnombre = this.popup_form.get('xproveedor').value;
    this.quote.baceptacion = 1;
    this.quote.ccotizacion = this.quote.ccotizacion;

    this.activeModal.close(this.quote);
  }

  changeStatus(){
    if(this.popup_form.get('bactivo').value == true){
      this.popup_form.get('xactivo').setValue('PENDIENTE');
      this.popup_form.get('xactivo').disable();
    }else{
      this.popup_form.get('xactivo').setValue('ANULADO');
      this.popup_form.get('xactivo').disable();
    }
  }
}
