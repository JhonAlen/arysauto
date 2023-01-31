import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@app/_services/authentication.service';
import { environment } from '@environments/environment';
import { ColDef} from 'ag-grid-community'
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-fleet-contract-management-index',
  templateUrl: './fleet-contract-management-index.component.html',
  styleUrls: ['./fleet-contract-management-index.component.css']
})
export class FleetContractManagementIndexComponent implements OnInit {

  currentUser;
  receiptInfo;
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  receiptStatus: boolean = false;
  alert = { show: false, type: "", message: "" };
  clientList: any[] = [];
  chargeList: any[] = [];
  receiptList: any[] = [];
  batchList: any[] = [];
  fleetContractList: any[] = [];
  ccarga: number;
  crecibo: number;
  xrecibo: string;
  xpoliza: string;
  nconsecutivo: number;
  femision: string;
  fdesde_pol: string; 
  fhasta_pol: string;
  fdesde_rec: string;
  fhasta_rec: string;
  xsucursalemision: string;
  xsucursalsuscriptora: string;
  cmoneda: number;
  xmoneda: string;
  mprimaanual: number;
  mprimaprorrata: number;
  fanulado: string;
  fcobro: string;
  iestado: string;
  xnombrecliente: string;
  xdocidentidadcliente: string;
  xdireccionfiscalcliente: string;
  xtelefonocliente: string;
  xemailcliente: string;
  xrepresentantecliente: string;
  xestadocliente: string;
  xciudadcliente: string;
  xmetodologiapago: string;
  ccorredor: number;
  xcorredor: string;
  xnombretomador: string;
  xdocidentidadtomador: string;
  xdireccionfiscaltomador: string;
  xtelefonotomador: string;
  xemailtomador: string;
  xestadotomador: string;
  xciudadtomador: string;
  xnombrepropietario: string;
  xdocidentidadpropietario: string;
  xdireccionpropietario: string;
  xtelefonopropietario: string;
  xemailpropietario: string;
  xestadorpopietario: string;
  xciudadpropietario: string;
  xplaca : string;
  fano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  xuso: string;
  xtipo: string;
  xcolor: string;
  xmarca: string;
  xmodelo: string;
  xversion: string;
  xtransmision: string;
  npasajeros: number;
  nkilometraje: number;
  xtituloreporte: string;
  xnombrerepresentantelegal: string;
  xdocidentidadrepresentantelegal: string;
  cestatusgeneral: number;

  keyword = 'value';
  columnDefs: ColDef[] = [
    { headerName: 'N° Recibo', field: 'nrecibo', width: 105, resizable: true },
    { headerName: 'N° Placa', field: 'xplaca', width: 135, resizable: true},
    { headerName: 'Inicio Vigencia', field: 'fdesde_rec', width: 150, resizable: true},
    { headerName: 'Fin Vigencia', field: 'fhasta_rec', width: 150, resizable: true},
    { headerName: 'Prima Total Recibo (USD)', field: 'mprima_anual', width: 220, resizable: true},
    { headerName: 'Estatus', field: 'xstatus', width: 140, resizable: true},
    { headerName: 'Descargar', field: 'xdescargar', width: 145, resizable: true, cellStyle: {color: 'white', 'background-color': 'green', 'border-radius': '5px'}, onCellClicked: (e) => {this.downloadReceipt(e)}}
  ];
  fsubscripcion: string;

  constructor(private formBuilder: UntypedFormBuilder, 
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.search_form = this.formBuilder.group({
      clote: [''],
      ccarga: [''],
      crecibo: [''],
      xplaca: ['']
    });
    this.search_form.get('clote').disable();
    this.search_form.get('crecibo').disable();
    // this.search_form.get('xplaca').disable();
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 71
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
    this.chargeList = [];
    this.keyword;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/valrep/charge`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.chargeList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.chargeList.push({ id: response.data.list[i].ccarga, value: `${response.data.list[i].xcliente} - Póliza Nro. ${response.data.list[i].xpoliza} - Placa ${response.data.list[i].xplaca}` });
        }
        this.chargeList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });


    /*let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania
    };
    this.http.post(`${environment.apiUrl}/api/valrep/client`, params, options).subscribe((response : any) => {
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.clientList.push({ id: response.data.list[i].ccliente, value: response.data.list[i].xcliente });
        }
        this.clientList.sort((a,b) => a.value > b.value ? 1 : -1);
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ message = "HTTP.ERROR.VALREP.CLIENTNOTFOUND"; }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
    });*/
  }
  //drop down list con las fechas de carga de una flota matriz y nombre del cliente
  batchDropdownDataRequest(event){
    this.receiptStatus = false;
    this.searchStatus = false;
    this.batchList = [];
    this.keyword;
    this.search_form.get('clote').setValue(undefined);
    this.search_form.get('crecibo').setValue(undefined);
    this.search_form.get('xplaca').setValue(undefined);
    this.search_form.get('ccarga').setValue(event.id)
    if(this.search_form.get('ccarga').value){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        ccarga: this.search_form.get('ccarga').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/batch`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.batchList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.batchList.push({ id: response.data.list[i].clote, value: `Lote Nro. ${response.data.list[i].clote} - ${response.data.list[i].xobservacion} - ${response.data.list[i].fcreacion}` });
          }
          this.batchList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });
      this.search_form.get('clote').enable();
    } else {
      this.search_form.get('clote').disable();
      //this.search_form.get('crecibo').disable();
      //this.search_form.get('xplaca').disable();
    }
  }

  receiptDropdownDataRequest(event){
    this.searchStatus = false;
    this.receiptStatus = false;
    this.receiptList = [];
    this.keyword;
    this.search_form.get('crecibo').setValue(undefined);
    this.search_form.get('clote').setValue(event.id)
    if(this.search_form.get('clote').value){
      this.searchStatus = true;
      /*let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        clote: this.search_form.get('clote').value,
        ccarga: this.search_form.get('ccarga').value
      }
      this.http.post(`${environment.apiUrl}/api/valrep/receipt`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.receiptList = [];
          for(let i = 0; i < response.data.list.length; i++){
            this.receiptList.push({ id: response.data.list[i].crecibo, value: `Recibo Nro. ${response.data.list[i].nconsecutivo} - Desde: ${response.data.list[i].fdesde_rec} Hasta: ${response.data.list[i].fhasta_rec}` });
          }
          this.receiptList.sort((a,b) => a.value > b.value ? 1 : -1);
        }
      },
      (err) => {
        let code = err.error.data.code;
        let message;
        if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
        else if(code == 404){ message = "HTTP.ERROR.VALREP.CHARGENOTFOUND"; }
        else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
        this.alert.message = message;
        this.alert.type = 'danger';
        this.alert.show = true;
      });*/
      //this.search_form.get('crecibo').enable();
    } else {
      //this.search_form.get('crecibo').disable();
      //this.search_form.get('xplaca').disable();
      //this.search_form.get('crecibo').setValue(undefined);
      this.search_form.get('xplaca').setValue(undefined);
      this.searchStatus = false;
    }
  }

  generateReceipt(crecibo) {
    this.keyword;
    
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      crecibo: crecibo
    };
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/receipt-detail`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.ccarga = response.data.ccarga;
        this.crecibo = response.data.crecibo;
        this.xrecibo = response.data.xrecibo;
        this.xpoliza = response.data.xpoliza;
        this.nconsecutivo = response.data.nconsecutivo;
        if (response.data.femision) {
          let dateFormat = new Date(response.data.femision).toISOString().substring(0, 10);
          this.femision = dateFormat;
        }
        if (response.data.fsubscripcion) {
          let dateFormat = new Date(response.data.fsubscripcion).toISOString().substring(0, 10);
          this.fsubscripcion = dateFormat;
        }
        if (response.data.fdesde_pol) {
          let dateFormat = new Date(response.data.fdesde_pol).toISOString().substring(0, 10);
          this.fdesde_pol = dateFormat;
        }
        if (response.data.fhasta_pol) {
          let dateFormat = new Date(response.data.fhasta_pol).toISOString().substring(0, 10);
          this.fhasta_pol = dateFormat
        }
        if (response.data.fdesde_rec) {
          let dateFormat = new Date(response.data.fdesde_rec).toISOString().substring(0, 10);
          this.fdesde_rec = dateFormat
        }
        if (response.data.fhasta_rec) {
          let dateFormat = new Date(response.data.fhasta_rec).toISOString().substring(0, 10);
          this.fhasta_rec = dateFormat
        }
        this.xsucursalemision = response.data.xsucursalemision;
        this.xsucursalsuscriptora = response.data.xsucursalsuscriptora;
        this.cmoneda = response.data.cmoneda;
        this.xmoneda = response.data.xmoneda;
        this.mprimaanual = response.data.mprimaanual;
        this.mprimaprorrata = response.data.mprimaprorrata;
        if (response.data.fanulado) {
          let dateFormat = new Date(response.data.fanulado).toISOString().substring(0, 10);
          this.fanulado = dateFormat
        }
        if (response.data.fcobro) {
          let dateFormat = new Date(response.data.fcobro).toISOString().substring(0, 10);
          this.fcobro = dateFormat
        }
        this.iestado = response.data.iestado;
        this.xnombretomador = response.data.xnombretomador;
        this.xdocidentidadtomador = response.data.xdocidentidadtomador;
        this.xdireccionfiscaltomador = response.data.xdireccionfiscaltomador;
        this.xtelefonotomador = response.data.xtelefonotomador;
        this.xemailtomador = response.data.xemailtomador;
        this.xestadotomador = response.data.xestadotomador;
        this.xciudadtomador = response.data.xciudadtomador;
        this.xmetodologiapago = response.data.xmetodologiapago;
        this.xnombrepropietario = response.data.xnombrepropietario;
        this.xdocidentidadpropietario = response.data.xdocidentidadpropietario;
        this.xdireccionpropietario = response.data.xdireccionpropietario;
        this.xtelefonopropietario = response.data.xtelefonopropietario;
        this.xemailpropietario = response.data.xemailpropietario;
        this.xestadorpopietario = response.data.xestadopropietario;
        this.xciudadpropietario = response.data.xciudadpropietario;
        this.xplaca = response.data.xplaca;
        this.fano = response.data.fano;
        this.xserialcarroceria = response.data.xserialcarroceria;
        this.xserialmotor = response.data.xserialmotor;
        this.xuso = response.data.xuso;
        this.xtipo = response.data.xtipo;
        this.xcolor = response.data.xcolor;
        this.xmarca = response.data.xmarca;
        this.xmodelo = response.data.xmodelo;
        this.xversion = response.data.xversion;
        this.xtransmision = response.data.xtransmision;
        this.npasajeros = response.data.npasajeros;
        this.nkilometraje = response.data.nkilometraje;
        this.ccorredor = response.data.ccorredor;
        this.xcorredor = response.data.xcorredor;
        this.xtituloreporte = response.data.xtituloreporte;
        this.xnombrerepresentantelegal = response.data.xrepresentantelegal;
        this.xdocidentidadrepresentantelegal = response.data.xdocidentidadrepresentantelegal;
        this.cestatusgeneral = response.data.cestatusgeneral;
        this.createPDFReceipt();
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
    this.receiptStatus = true;
    this.search_form.get('xplaca').enable();
    
  }

  searchforbadge(){
    this.searchStatus = true

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
      ccarga: form.ccarga,
      clote: form.clote,
      crecibo: form.crecibo,
      xplaca: form.xplaca,
      ccompania: this.currentUser.data.ccompania
    }
    this.http.post(`${environment.apiUrl}/api/fleet-contract-management/search`, params, options).subscribe((response : any) => {
      if(response.data.status){
        this.fleetContractList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.fleetContractList.push({ 
            xcliente: response.data.list[i].xcliente,
            ccontratoflota: response.data.list[i].ccontratoflota,
            xmarca: response.data.list[i].xmarca,
            xmodelo: response.data.list[i].xmodelo,
            xversion: response.data.list[i].xversion,
            xplaca: response.data.list[i].xplaca,
            xestatusgeneral: response.data.list[i].xestatusgeneral,
            xpoliza: response.data.list[i].xpoliza
          });
        }
      }
      this.loading = false;
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        message = "No se encontraron contratos que cumplan con los parámetros de búsqueda"; 
      }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
    this.http.post(`${environment.apiUrl}/api/valrep/receipt`, params, options).subscribe((response : any) => {
      if(response.data.status) {
        this.receiptList = [];
        for(let i = 0; i < response.data.list.length; i++){
          this.receiptList.push({
            ccontratoflota: response.data.list[i].ccontratoflota,
            crecibo: response.data.list[i].crecibo,
            xrecibo: response.data.list[i].xrecibo,
            nconsecutivo: response.data.list[i].nconsecutivo,
            fdesde_rec: response.data.list[i].fdesde_rec,
            fhasta_rec: response.data.list[i].fhasta_rec,
            mprima_anual: response.data.list[i].mprima_anual,
            msuma_anual: response.data.list[i].msuma_anual,
            xstatus: response.data.list[i].xstatus,
            xplaca: response.data.list[i].xplaca,
            nrecibo: response.data.list[i].xrecibo + '-' + response.data.list[i].nconsecutivo,
            xdescargar: "Descargar Recibo"
          })
        }
      }
    },
    (err) => {
      let code = err.error.data.code;
      let message;
      if(code == 400){ message = "HTTP.ERROR.PARAMSERROR"; }
      else if(code == 404){ 
        message = "No se encontraron contratos que cumplan con los parámetros de búsqueda"; 
      }
      else if(code == 500){  message = "HTTP.ERROR.INTERNALSERVERERROR"; }
      this.alert.message = message;
      this.alert.type = 'danger';
      this.alert.show = true;
      this.loading = false;
    });
  }

  downloadReceipt(e) {
    let recibo = this.receiptList.find(receipt => receipt.xrecibo == e.data.xrecibo && receipt.nconsecutivo == e.data.nconsecutivo);
    this.generateReceipt(recibo.crecibo);
  }

  goToDetail(){
    this.router.navigate([`subscription/fleet-contract-management-detail`]);
  }

  rowClicked(event: any){
    this.router.navigate([`subscription/fleet-contract-management-detail/${event.data.ccontratoflota}`]);
  }

  changeDateFormat(date) {
    let dateArray = date.split("-");
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
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

  getCoverageStatus(codigo){
    if(codigo == 0) {
      return 'No Contratada'
    }
    if (codigo == 1) {
      return 'Contratada ver Certificados'
    }
  }

  selectWatermark() {
    let watermarkBody = {}
    if (this.cestatusgeneral == 13) {
      watermarkBody = {text: 'PENDIENTE DE PAGO', color: 'red', opacity: 0.3, bold: true, italics: false, fontSize: 50, angle: 70}
      return watermarkBody;
    }
    if (this.cestatusgeneral == 7) {
      watermarkBody = {text: 'COBRADO', color: 'green', opacity: 0.3, bold: true, italics: false, fontSize: 50, angle: 70}
      return watermarkBody;
    }
    if (this.cestatusgeneral == 3) {
      watermarkBody = {text: 'PÓLIZA ANULADA', color: 'red', opacity: 0.3, bold: true, italics: false, fontSize: 50, angle: 70}
      return watermarkBody;
    }

  }

  createPDFReceipt() {
    const pdfDefinition: any = {
      info: {
        title: `Recibo N° ${this.xrecibo}-${this.nconsecutivo} - ${this.xnombretomador}`,
        subject: `Recibo N° ${this.xrecibo}-${this.nconsecutivo} - ${this.xnombretomador}`
      },
      watermark: this.selectWatermark(),
      content: [
        {
          style: 'data',
          table: {
            widths: [165, 216, 35, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS0AAABLCAYAAAAlOdEdAAAACXBIWXMAAAsTAAALEwEAmpwYAABDLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMTEgNzkuMTU4MzI1LCAyMDE1LzA5LzEwLTAxOjEwOjIwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIzLTAxLTExVDE1OjMzOjMyLTA0OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjdiZDRiZjQxLTE4MTAtZTM0Yy04M2I0LTk5ZTVkNmEyZDRlNjwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMzYzc4Y2M5LTkxZTctMTFlZC1hYzIyLWNlNDc5NDRmMDkwOTwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmUwY2Q5YWFlLTg4MmUtZTY0OS05OTk3LTAzN2JhZWJjNDEwMzwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6MzM6MzItMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NWU4Y2JhNTctZTNkMy1hZTQxLTk4MjAtYjJhOTk0NmYzMmFhPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIzLTAxLTExVDE1OjM1OjI4LTA0OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMy0wMS0xMVQxNTo0MDoyMC0wNDowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5kZXJpdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3YmQ0YmY0MS0xODEwLWUzNGMtODNiNC05OWU1ZDZhMmQ0ZTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjMtMDEtMTFUMTU6NDA6MjAtMDQ6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjIxMGE2MTEyLTI4NDEtNTA0NS04ZTE4LTZlM2M4YjEyODJlZTwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDplMGNkOWFhZS04ODJlLWU2NDktOTk5Ny0wMzdiYWViYzQxMDM8L3N0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJOYW1lPmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllck5hbWU+CiAgICAgICAgICAgICAgICAgIDxwaG90b3Nob3A6TGF5ZXJUZXh0PmRlIFNlZ3Vyb3M8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllck5hbWU+Si0wMDA4NDY0NC04PC9waG90b3Nob3A6TGF5ZXJOYW1lPgogICAgICAgICAgICAgICAgICA8cGhvdG9zaG9wOkxheWVyVGV4dD5KLTAwMDg0NjQ0LTg8L3Bob3Rvc2hvcDpMYXllclRleHQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOlRleHRMYXllcnM+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zMDE8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NzU8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA'
              + 'gICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg'
              + 'ICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmE3qp0AAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAANA1JREFUeNrsnXeYFFX297+3quN0Tw5MIA05gwIiUUVBUMyYQRQFA4uJ9SfqqqvrvsY1rVkMCChiZDGACQURFEQlhxnSMEzO3dPdVTe8f9St6ZqhhySGwTrPU09VV7gV76e+59xTt4kQ4iTYZptttrUQU+xLYJttttnQss0222yzoWWbbbbZZkPLNttss6Flm2222WZDyzbbbLMNAOA4Fk9KCAFBKUQkAhGqBy0r8vH6Gi8RugMORRC3W1MT0+rUxHQKpxvE6QZRVPtpsM02G1q/L6h4fQj1+Tviar7+uk9ky8bOvLwwm1QV5jiculuNV7qqfgLFp0DxKiAu8oviT6hW09rsVVNy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'
              + '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'
              + 'YHVXGAc7Puw+pmW++FT74AWnSXy+Ro/SmobbbZZputtGz7az+cnc4ZD+BKAA/RvIXfHmB5AMAzAMx1MgHMhJG9/jOirX8A0Nw25nzE2MYs80m57CE5bxiASdLlehfA6022GQPgb3L+u7HKonkLH2rm3GfK8gHgdZq38F37iTDMzvGxraUCbZgFMn4JB7/8bQILAPpZ1mtum06W+eY245vs8kpL+dbtsyzQG9ZkmwuaOfymZcWCsbWsKx2dzuln33UbWra1bOsrx/+QSsYvK3qmRWGNA1AEYOhBtjGB8DqAm+V0J8u+hsUA0hi5/TMW5dW3CZiyYhx3rLKamrnvmy3qrZN9y2330LaWbVnSxftZjk23K9Pi4gHGx8nDJGCa26Y4Rvl1TVzKny1wMyESALBY/h7XxP0bE2Ob5so60L5NC9i33FZatrVss7pXxc3MP9Ay6/zFEiRXwog1FQF4zwKZTKmoYtkDAD5CtDtlU2UVW4CGQyzLtPdgfC70pCzrZ5q3cLF9y22lZVtLelAbB6aPdlDa3wRoWRYldbqET6CZ7UzF1M8EjDzOh2KsG7OsGOf2rUUxAkArR6dzMmnewmL7SbChZdufC0yZAGYB+JTmLXy2GVUUy13KPIAblXkI24yRkHpIQucJGK2CJsDGIxqYHwYj0G/azfL4ZjVx+WY2UV4xy5LAamrm+pfI43oARlD/WfspsaFl25/IaN7CYkencwIAOstZnSzLHmoCuGkSEv0s6xVbANdPqpaO0t0LyHGsbWL9IUb8QQ43D9FY2a8976bn9vIRHI8NLdts+4PsZ6lAPpK/i2jewrwY6/0CYCyisaSAdKsCEij9YMSarO7kgbYZ20QdfSuHcRb3br6c95AFeg80OfbXEW3xM1XZ6/IY3m1aVjN5WiukGpvfBJK2wQ7E2/bns9ctFTQPwMPNqJNvLXAwE0VN9+8hSxk/W9ZrbhvrfHObgwXL8+R+AjHK/rXK63VEk14B4F07uTRq9mc8ttlmm620bLPNNttsaNlmm2222dCyzTbbbGjZZptttv2G9v8HAFqcTtSyHgmwAAAAAElFTkSuQmCC', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\n${this.xtituloreporte}`, fontSize: 8.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}-${this.nconsecutivo}\n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos de la Póliza', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia de la Póliza:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: this.changeDateFormat(this.fdesde_pol), border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: this.changeDateFormat(this.fhasta_pol), border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.fsubscripcion), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, false]}, {text: this.xsucursalemision, border: [false, false, true, false]}],
              [{}, {}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: this.xsucursalsuscriptora, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: 'Vigencia del Recibo:', bold: true, border: [false, false, false, false]}, {text: 'Desde:', bold: true, border: [false, false, false, false]}, {text: this.changeDateFormat(this.fdesde_rec), border: [false, false, false, false]}, {text: 'Hasta:', bold: true, border: [false, false, false, false]}, {text: this.changeDateFormat(this.fhasta_rec), border: [false, false, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', rowSpan: 2, bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), rowSpan: 2, alignment: 'center', border: [false, false, true, true]}, {text: 'Tipo de Movimiento:', bold: true, border: [false, false, false, false]}, {text: 'EMISIÓN', border: [false, false, false, false]}, {text: 'Frecuencia de Pago:', bold: true, border: [false, false, false, false]}, {text: this.xmetodologiapago, border: [false, false, true, false]}],
              [{}, {}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Prima Total', bold: true, border: [false, false, false, true]}, {text: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mprimaanual), border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 150, 70, 60, '*', '*'],
            body: [
              [{text: 'TOMADOR:', bold: true, border: [true, false, false, false]}, {text: this.xnombretomador, border: [false, false, false, false]}, {text: 'Índole o Profesión:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadtomador, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, 28, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscaltomador, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadotomador, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [30, 122, 50, 20, 32, 50, 24, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadtomador, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonotomador, border: [false, false, false, true]}, {text: 'E-mail:', bold: true, border: [false, false, false, true]}, {text: this.xemailtomador, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [80, 270, 30, '*'],
            body: [
              [{text: 'DIRECCIÓN DE COBRO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionfiscaltomador, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadotomador, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [28, 130, 50, 24, 50, 24, '*', '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, true]}, {text: this.xciudadtomador, border: [false, false, false, true]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Zona Cobro:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'Teléfono:', bold: true, border: [false, false, false, true]}, {text: this.xtelefonotomador, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 300, '*', '*'],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: this.xnombrepropietario, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 294, 28, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: 'Estado:', bold: true, border: [false, false, false, false]}, {text: this.xestadorpopietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [28, 126, 50, 15, 32, 50, 28, '*'],
            body: [
              [{text: 'Ciudad:', bold: true, border: [true, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Zona Postal:', bold: true, border: [false, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonopropietario, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL INTERMEDIARIO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, '*', 40, 20, 50, 30],
            body: [
              [{text: 'INTERMEDIARIO:', bold: true, border: [true, false, false, false]}, {text: this.xcorredor, border: [false, false, false, false]}, {text: 'Control:', bold: true, border: [false, false, false, false]}, {text: this.ccorredor, border: [false, false, false, false]}, {text: 'Participación:', bold: true, border: [false, false, false, false]}, {text: '100%', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DATOS DEL VEHÍCULO', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [30, 85, 35, 100, 35, '*'],
            body: [
              [{text: 'MARCA:', bold: true, border: [true, false, false, true]}, {text: this.xmarca, border: [false, false, false, true]}, {text: 'MODELO:', bold: true, border: [false, false, false, true]}, {text: this.xmodelo, border: [false, false, false, true]}, {text: 'VERSIÓN:', bold: true, border: [false, false, false, true]}, {text: this.xversion, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 30, 30, 50, 30, 50, 60, '*'],
            body: [
              [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, true]}, {text: this.npasajeros, border: [false, false, false, true]}, {text: 'CLASE:', bold: true, border: [false, false, false, true]}, {text: ' ', border: [false, false, false, true]}, {text: 'PLACA:', bold: true, border: [false, false, false, true]}, {text: this.xplaca, border: [false, false, false, true]}, {text: 'TRANSMISIÓN:', bold: true, border: [false, false, false, true]}, {text: this.xtransmision, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 78, 75, 70, 68, 54, '*'],
            body: [
              [{text: 'USO:', bold: true, border: [true, false, false, true]}, {text: this.xuso, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.xserialcarroceria, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.xserialmotor, border: [false, false, false, true]}, {text: 'KILOMETRAJE:', bold: true, border: [false, false, false, true]}, {text: this.nkilometraje, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 30, 50, 50, 140, '*'],
            body: [
              [{text: 'TIPO:', bold: true, border: [true, false, false, false]}, {text: this.xtipo, border: [false, false, false, false]}, {text: 'AÑO:', bold: true, border: [false, false, false, false]}, {text: this.fano, border: [false, false, false, false]}, {text: 'COLOR:', bold: true, border: [false, false, false, false]}, {text: this.xcolor, border: [false, false, false, false]}, {text: ' ', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [180, '*', 180],
            body: [
              [{text: 'Para constancia se firma:\nLugar y fecha', colSpan: 3, border: [true, true, true, false]}, {}, {}],
              [{text: ' ', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {image: 'data:image/jpeg;base64,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', width: 136, height: 77, border: [false, false, true, false]}],
              [{text: '_________________________________', bold: true, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: '_________________________________', bold: true, alignment: 'center', border: [false, false, true, false]}],
              [{text: 'FIRMA DEL TOMADOR', alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: 'Por La Mundial Seguros, C.A', alignment: 'center', border: [false, false, true, false]}],
              [{text: `Nombre y Apellido: ${this.xnombretomador}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `Nombre y Apellido: ${this.xnombrerepresentantelegal}`, alignment: 'center', border: [false, false, true, false]}],
              [{text: `C.I: ${this.xdocidentidadtomador}`, alignment: 'center', border: [true, false, false, false]}, {text: ' ', border: [false, false, false, false]}, {text: `C.I: ${this.xdocidentidadrepresentantelegal}`, alignment: 'center', border: [false, false, true, false]},]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'Aprobado por la Superintendencia de la Actividad Aseguradora mediante Providencia Nº FSAA-1-1-0361-2022 de fecha 5/8/2022', alignment: 'center', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: '\nLa Mundial  de Seguros, C.A, inscrita en la Superintendencia de la Actividad Aseguradora bajo el No. 73' + 
                      '\nDIRECCIÓN: AV. FRANCISCO DE MIRANDA, EDIFICIO CAVENDES, PISO 11, OFICINA 1101- CARACAS', alignment: 'center', border: [true, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: ' ', border: [true, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'En caso de SINIESTRO o SOLICITUD DE SERVICIO dar aviso a la brevedad posible al número telefónico: 0500-2797288 Atención 24/7', alignment: 'center', bold: true, border: [true, false, true, true]}]
            ]
          }
        }
      ],
      styles: {
        title: {
          fontSize: 9.5,
          bold: true,
          alignment: 'center'
        },
        header: {
          fontSize: 7.5,
          color: 'gray'
        },
        data: {
          fontSize: 7.5
        }
      }
      /*,
      defaultStyle: {
        font: 'TimesNewRoman'
      }*/
    }
    let pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download(`Recibo N° ${this.xrecibo}-${this.nconsecutivo} - ${this.xnombretomador}`);
    pdf.open();
  }

}
