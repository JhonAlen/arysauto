import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators , FormBuilder} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environments/environment';
import { GridApi } from 'ag-grid-community';
import { NgbPaginationModule, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-contract-service-arys-administration',
  templateUrl: './contract-service-arys-administration.component.html',
  styleUrls: ['./contract-service-arys-administration.component.css']
})
export class ContractServiceArysAdministrationComponent implements OnInit {

  currentUser;
  keyword = 'value';
  search_form : UntypedFormGroup;
  searchStatus: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  alert = { show: false, type: "", message: "" };
  contractList: any[] = [];
  batchList: any[] = [];
  fleetContractList: any[] = [];
  id: number;
  xcliente: string;
  xdocidentidadcliente: number;
  xemailcliente: string;
  xpropietario: string;
  xdocidentidadpropietario: number;
  xemailpropietario: string;
  xplaca: string;
  xmarca: string;
  xmodelo: string;
  xversion: string;
  fano: number;
  xserialcarroceria: string;
  xserialmotor: string;
  xcolor: string;
  ncapacidadpasajeros: number;
  mtotal: number;
  fdesde;
  fhasta;
  canCreate: boolean = false;
  canDetail: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  filteredData;
  public page = 1;
  public pageSize = 7;
  ccontratoflota: number;
  ccarga: number;
  mprimatotal: number;
  mprimaprorratatotal: number;
  xpoliza: string;
  xrecibo: string;
  fdesde_rec: Date;
  fhasta_rec: Date;
  femision: Date;
  fsuscripcion: Date;
  fnacimientopropietario2: string;
  xnombrecliente: string;
  xdireccionfiscalcliente: string;
  xtelefonocliente: string;
  xrepresentantecliente: string;
  xciudadcliente: string;
  xestadocliente: string;
  showSaveButton: boolean = false;
  showEditButton: boolean = false;
  editStatus: boolean = false;
  accesoryDeletedRowList: any[] = [];
  inspectionDeletedRowList: any[] = [];
  planCoberturas: string;
  planServicios: string;
  xtituloreporte: string;
  xobservaciones: string;
  xnombrerepresentantelegal: string;
  xdocidentidadrepresentantelegal: string;
  xanexo: string;
  cstatuspoliza: number;
  rowClick: boolean = false;
  cuadro: boolean = false;
  coverage = {};
  xtomador : string;
  xprofesion : string;
  xrif;
  xdomicilio : string;
  xzona_postal : string;
  
  xtelefono : string;
  xcorreo : string;
  xestado : string;
  xciudad : string;



  ccontratoflora: number;
  xsucursalsuscriptora: string;
  xsucursalemision: string;
  ccorredor: number;
  xcorredor: string;
  xnombrepropietario: string;
  xapellidopropietario: string;
  xtipodocidentidadpropietario: string;
  xtelefonocelularpropietario: string;
  xdireccionpropietario: string;
  xestadopropietario: string;
  xciudadpropietario: string;
  xestadocivilpropietario: string;
  xocupacionpropietario: string;
  fnacimientopropietario: string
  cmetodologiapago: number;
  xtelefonopropietario: string;
  cvehiculopropietario: number;
  ctipoplan: number;
  cplan: number;
  ctiporecibo: number;
  mpreciovehiculo: number;
  ctipovehiculo: number;
  xtipomodelovehiculo: string;
  ncapacidadcargavehiculo: number;
  ncapacidadpasajerosvehiculo: number;
  xplancoberturas: string;
  xplanservicios: string;
  xnombrecorredor: string;
  modalidad: boolean = true;
  montorcv: boolean = true;
  cobertura: boolean = false;
  grua: boolean = false;
  xuso: any;
  xtipovehiculo: any;
  xclase: any;
  xtransmision: any;
  xzona_postal_propietario: any;
  nkilometraje: any;
  xmoneda;
  mmonto_plan;
  serviceList = [];


  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService : AuthenticationService,
              private http: HttpClient,
              private router: Router) { }

  async ngOnInit(): Promise<void>{
    this.search_form = this.formBuilder.group({
      xnombre: [''],
      xapellido: [''],
      cano: [''],
      xcolor: [''],
      cmarca: [''],
      cmodelo: [''],
      cversion: [''],
      xrif_cliente:[''],
      email: [''],
      xtelefono_prop:[''],
      xdireccionfiscal: [''],
      xserialmotor: [''],
      xserialcarroceria: [''],
      xplaca: [''],
      xtelefono_emp: [''],
      cplan: [''],
      ncapacidad_p: [''],
      cestado:[''],
      cciudad:[''],
      icedula:[''],
      femision:[''],
      ivigencia:[''],
      cpais:[''],
      xreferencia:[''],
      fcobro:[''],
      cbanco: [''],
      xcedula: [''],
      binternacional: [''],
      ctomador: [''],
      cuso: [''],
      cclase: [''],
      ctipovehiculo: [''],
      xzona_postal:[''],
      nkilometraje: [''],
      xmoneda: [''],
    });
    
    this.currentUser = this.authenticationService.currentUserValue;
    if(this.currentUser){
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let options = { headers: headers };
      let params = {
        cusuario: this.currentUser.data.cusuario,
        cmodulo: 120
      }
      this.http.post(`${environment.apiUrl}/api/security/verify-module-permission`, params, options).subscribe((response : any) => {
        if(response.data.status){
          this.canCreate = response.data.bcrear;
          this.canDetail = response.data.bdetalle;
          this.canEdit = response.data.beditar;
          this.canDelete = response.data.beliminar;
          this.initializeDropdownDataRequest();
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
    let params;
    this.http.post(`${environment.apiUrl}/api/contract-arys/search-contract-arys`, params, options).subscribe((response : any) => {
      this.contractList = [];
      if(response.data.status){
        for(let i = 0; i < response.data.list.length; i++){
          this.contractList.push({
            ccodigo_serv: response.data.list[i].ccodigo_serv,
            xnombres: response.data.list[i].xnombres,
            xvehiculo: response.data.list[i].xvehiculo,
            fano: response.data.list[i].fano,
            identificacion: response.data.list[i].identificacion,
          })
        }
        this.filteredData = this.contractList;
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

  filterData(value: string) {
    this.filteredData = this.contractList.filter((item) => {
      const searchValue = value.toLowerCase();
      return item.xnombres.toString().toLowerCase().includes(searchValue) || item.xvehiculo.toString().toLowerCase().includes(searchValue) || item.identificacion.toString().toLowerCase().includes(searchValue);
    });
  }

  changeDateFormat(date) {
    if (date) {
      let dateArray = date.substring(0,10).split("-");
      return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
    }
    else {
      return ' ';
    }
  }

  getContractArysFromCertificate(ccodigo_serv){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let options = { headers: headers };
    let params = {
      cpais: this.currentUser.data.cpais,
      ccompania: this.currentUser.data.ccompania,
      ccodigo_serv: ccodigo_serv
    };
    this.http.post(`${environment.apiUrl}/api/contract-arys/detail-contract-arys`, params, options).subscribe((response : any) => {
      this.contractList = [];
      if(response.data.status){
        this.ccarga = response.data.ccarga;
        this.xpoliza = response.data.xpoliza;
        this.xtituloreporte = response.data.xtituloreporte;
        this.xanexo = response.data.xanexo;
        this.xobservaciones = response.data.xobservaciones;
        this.xnombrerepresentantelegal = response.data.xnombrerepresentantelegal;
        this.xdocidentidadrepresentantelegal = response.data.xdocidentidadrepresentantelegal;
        this.xnombrecliente = response.data.xnombrecliente;
        this.xdocidentidadcliente = response.data.xdocidentidadcliente;
        this.xdireccionfiscalcliente = response.data.xdireccionfiscalcliente;
        this.xciudadcliente = response.data.xciudadcliente;
        this.xestadocliente = response.data.xestadocliente;
        if (response.data.xtelefonocliente) {
          this.xtelefonocliente = response.data.xtelefonocliente;
        } else {
          this.xtelefonocliente = ' ';
        }
        if (response.data.xemailcliente) {
          this.xemailcliente = response.data.xemailcliente;
        } else {
          this.xemailcliente = ' ';
        }
        if (response.data.xrepresentantecliente) {
          this.xrepresentantecliente = response.data.xrepresentantecliente;
        } else {
          this.xrepresentantecliente = ' ';
        }
        this.xsucursalemision = response.data.xsucursalemision;
        this.xsucursalsuscriptora = response.data.xsucursalsuscriptora;
        this.ccorredor = response.data.ccorredor;
        this.xnombrecorredor = response.data.xcorredor;
        this.xnombrepropietario = response.data.xnombrepropietario;
        this.xapellidopropietario = response.data.xapellidopropietario;
        this.xtipodocidentidadpropietario = response.data.xtipodocidentidadpropietario ;
        this.xdocidentidadpropietario = response.data.xdocidentidadpropietario ;
        this.xdireccionpropietario = response.data.xdireccionpropietario ;
        this.xtelefonocelularpropietario = response.data.xtelefonocelularpropietario;
        this.xestadopropietario = response.data.xestadopropietario;
        this.xciudadpropietario = response.data.xciudadpropietario;
        this.xocupacionpropietario = response.data.xocupacionpropietario;
        this.xestadocivilpropietario = response.data.xestadocivilpropietario;
        this.xemailpropietario = response.data.xemailpropietario;
        this.xtelefonopropietario = response.data.xtelefonopropietario;
        this.cvehiculopropietario = response.data.cvehiculopropietario;
        this.ctipoplan = response.data.ctipoplan;
        this.cplan = response.data.cplan;
        this.cmetodologiapago = response.data.cmetodologiapago;
        this.ctiporecibo = response.data.ctiporecibo;
        this.xmarca = response.data.xmarca;
        this.xmoneda = response.data.xmoneda;
        this.xmodelo = response.data.xmodelo;
        this.xversion = response.data.xversion;
        console.log(this.xmarca)
        console.log(this.xmodelo)
        console.log(this.xversion)
        this.xplaca = response.data.xplaca;
        this.xuso = response.data.xuso;
        this.xtipovehiculo = response.data.xtipovehiculo;
        this.nkilometraje = response.data.nkilometraje;
        this.xclase = response.data.xclase;
        this.xtransmision = response.data.xtransmision;
        this.fano = response.data.fano;
        this.xserialcarroceria = response.data.xserialcarroceria;
        this.xserialmotor = response.data.xserialmotor;
        this.xcolor = response.data.xcolor;
        this.mpreciovehiculo = response.data.mpreciovehiculo;
        this.ctipovehiculo = response.data.ctipovehiculo;
        this.xtipomodelovehiculo = response.data.xtipomodelovehiculo;
        this.ncapacidadcargavehiculo = response.data.ncapacidadcargavehiculo;
        this.ncapacidadpasajeros = response.data.ncapacidadpasajeros;
        this.xplancoberturas = response.data.xplancoberturas;
        this.xplanservicios = response.data.xplanservicios;
        this.mprimatotal = response.data.mprimatotal;
        this.mprimaprorratatotal = response.data.mprimaprorratatotal;
        this.xzona_postal_propietario = response.data.xzona_postal_propietario;
        this.mmonto_plan = response.data.mtotal_plan
        this.femision = response.data.femision;
        let fechaInicio = this.femision;
        this.fdesde = response.data.femision;
        const fecha = new Date(fechaInicio); // Convertimos la cadena a objeto Date
        fecha.setFullYear(fecha.getFullYear() + 1); // Sumamos 1 al año
        this.fhasta = fecha.toISOString().slice(0, 10); // Convertimos la fecha resultante a cadena en formato ISO y extraemos solo la parte de la fecha
        if(response.data.xtomador){
          this.xtomador = response.data.xtomador;
        }else{
          this.xtomador = this.xnombrecliente;
        }
        
        if(response.data.xprofesion){
          this.xprofesion = response.data.xprofesion;
        }else{
          this.xprofesion = ' ';
        }

        if(response.data.xrif){
          this.xrif = response.data.xrif;
        }else{
          this.xrif = this.xdocidentidadcliente;
        }

        if(response.data.xdomicilio){
          this.xdomicilio = response.data.xdomicilio;
        }else{
          this.xdomicilio = this.xdireccionfiscalcliente;
        }

        if(response.data.xzona_postal){
          this.xzona_postal = response.data.xzona_postal;
        }else{
          this.xzona_postal = ' ';
        }

        if(response.data.xtelefono){
          this.xtelefono = response.data.xtelefono;
        }else{
          this.xtelefono = this.xtelefonocliente;
        }

        if(response.data.xcorreo){
          this.xcorreo = response.data.xcorreo;
        }else{
          this.xcorreo = this.xemailcliente;
        }

        if(response.data.xestado){
          this.xestado = response.data.xestado;
        }else{
          this.xestado = this.xestadocliente;
        }
        
        if(response.data.xciudad){
          this.xciudad = response.data.xciudad;
        }else{
          this.xciudad = this.xciudadcliente;
        }

        if(response.data.services){
          for(let i = 0; i < response.data.services.length; i++){
            this.serviceList.push({
              cservicio: response.data.services[i].cservicio,
              xservicio: response.data.services[i].xservicio,
            })
          }
        }

        this.createPDF();
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

  buildServiceBody() {
    let body = [];
    let dataRow = [];
    for (let i = 0; i < this.serviceList.length; i++) {
      if (dataRow.length === 3) {
        console.log(dataRow);
        body.push(dataRow);
        dataRow = [];
      }
      if (dataRow.length === 2) {
        dataRow.push({text: this.serviceList[i].xservicio, border:[false, false, true, false]})
      }
      if (dataRow.length === 1) {
        dataRow.push({text: this.serviceList[i].xservicio, border:[true, false, true, false]});
      }
      if (dataRow.length === 0) {
        dataRow.push({text: this.serviceList[i].xservicio, border:[true, false, false, false]});
      }
    };
  
    return body;
  }

  buildServiceBody2() {
    let body = [];
    let counter = 0;
    let maxRowsPerColumn = 20;
    let currentColumn = [];
    let newServiceList = [];
    let services = [];
    this.serviceList.forEach(function(service) {
      services.push(service.xservicio);
      if (services.length >= 20) {
        newServiceList.push(services);
        services = [];
      }
    })
    if (services.length > 0) {
      newServiceList.push(services);
    }
    console.log(newServiceList);
    for (let i = 0; i < newServiceList.length; i++) {
      let tablebody = [];
      newServiceList[i].forEach(function(row){
        let dataRow = [{text: row, border:[true, false, false, false]}];
        tablebody.push(dataRow);
      })
      let table = {
        style: 'data',
        table: {
          widths: [125],
          heights: 20,
          body: tablebody
        }
      };
      console.log(table);
      body.push(table);
    }
    console.log(body);
    // this.serviceList.forEach(function(row) {
    //   //console.log(currentColumn);
    //   let dataRow = [{text: row.xservicio, border:[true, false, false, false]}];
    //   currentColumn.push(dataRow);
    //   counter++;
  
    //   if (counter >= maxRowsPerColumn) {
    //     body.push(currentColumn);
    //     dataRow = [];
    //     currentColumn = [];
    //     counter = 0;
    //   }
    // });
  
    // if (currentColumn.length > 0) {
    //   body.push(currentColumn);
    // }
    
    // body.splice(0, 1)
  
    return body;
  }

  createPDF(){
    try{
    const pdfDefinition: any = {
      footer: function(currentPage, pageCount) { 
        return {
          table: {
            widths: ['*'],
            body: [
              [{text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', border: [false, false, false, false]}]
            ]
          }
        }
      },
      content: [
        {
          style: 'data',
          table: {
            widths: [165, 216, 35, '*'],
            body: [
              [ {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAf4AAADDCAYAAABj/HPiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAIkVJREFUeNrsnU9uG0myh9ODxsMAbyH1CcTezkbsE6h0ArNPIOoEpoG3F32Cpk/g0gks4R3A1Ala2sy2qROMtBhg8DZ+GXJUd5lNkZWRWf+/DyhI7lYVWVlZ+YuIjIx88/XrVwcAAADj4G80AQAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAAe/iBJgDoDm/evJn6H8c1XPr+69evT7QwACD8APUIeKa/iohPd/wuTPxx0uB32v5PD/4oGwPrHb8/eYPhnicKMKDxiU16AMxeeSHuxb8bFfIWKAyFzfbhx5ENPQMA4Qfou7hPVNQnpd+PaJ2DhsFaf0qkgCkGAIQfoFMCXwj6tCTyp7RMcu7UENhgEAAg/ABNevHl44xWaZXHwgjQKAHGAADCD2AW+WIOfqo/Efl+GQOFIbCmSQAQfoBdQj9RgS+OE1plMNypIbDGEABA+AGhR+gxBAAA4YcBCn0Rup8h9LDFbckQoOYAAMIPPRb7aUns+z5H/+y+zV2Xec1b3egRwr6Kf9mOvx3qssRHbdcbP7bd8BYBIPzQfbGflcS+6159WczXO0S784VtNJJSVBOc6FE2JCau39EViQbcqCHAigEAhB86JPbF0TVPVOaTi2I0haiPrlJdyUDY/tknw+CuZARsePMA4QcYr9gXnjsFZuzPs1zGuIgcdHlKQYyAnEgAIPwAwxf7h5LII/DNRQqykjHQtcqIt2oA5DwxQPgB0niCcz2aFvuHLYFf80Q61S+6VkVRIj8yFbBidQAg/ADhXl4h9k16d3+s78aT72W/yUrRAfnZZu6ArA5Y' +
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
              'ef3Wl3qeyOPvtPAbo0KdXOUhm+m0MEDIgHDuP7uyoawJfTHZ5XM3XGK8/qPQ88Vr0w1fflJPu2lhedTPlbDxbOxe/gFDLdcIwLmO688NPZuf1cPPm7znN/4DQwdz65Ksl4FM9yIfBLpm+3fj6d/N1fprfQ29gD//TYfbRqJCvxlOPe+DYaj3J4P6zKVdxlUsBVwNICoGfzXMpN9kekwT951n9+cy0huEPvpZZaVndZbg2bw8F3lGbT+bYOEHqGgQ3TtbMt+qp/c71UMGCQkJV5neKELPxWB9j9iPTlyOtd8UP93W77vYuD+jfcXv94TwGzHaJqVnUzy3fc9H3u1N10peI/yQWgSLyneh8/qSzDenBQEA6uVvNAEkxrLEsxclmwEAEH6A7719Ee9BJPMBAAwVQv2QSvQlye2z4dTzIazyAADA44cxib4kueSGU98j+gAAePzQL9EnmQ8AAI8fRkTuSOYDAED4YRTevmTwvw087WVLWZL5AAAQfuiX6M+drYLjXHe/AwAAhB96IvrWTZo+BGw0AwAANUByH4SKviTzicceWmP8VjaboQUBAPD4oV+sDaIvyXxzmg4AAOGHfnn7uQvP4CeZDwAA4Yceir547BeGU0nmAwBA+KFnoi/JfJ8Mp5LMBwDQMUjug0OiP3HfkvmOAk8lmQ8AAI8feib6ksF/YxB9kvkAABB+6CGyVp9kPgAAhB9G4O1LLX2S+QAAEH4YgejL3PyvhlNJ5gMA6Dgk9wEAAODxAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAAAg/AAAAIDwAwAAAMIPAAAACD8AAADCDwAAAAg/AAAA9J//F2AA16O5hU8xXAQAAAAASUVORK5CYII=', width: 160, height: 50, border:[true, true, false, false]},
              {text: `\n\n${this.xtituloreporte}`, fontSize: 8.5, alignment: 'center', bold: true, border: [false, true, false, false]}, {text: '\nPóliza N°\n\nRecibo N°\n\nNota N°', bold: true, border: [true, true, false, false]}, {text: `\n${this.xpoliza}\n\n${this.xrecibo}\n\n`, border:[false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, 80, 30, 55, 30, 55, '*'],
            body: [
              [{text: 'Datos del Contrato', alignment: 'center', fillColor: '#ababab', bold: true}, {text: 'Vigencia del Contrato:', bold: true, border: [false, true, false, false]}, {text: 'Desde:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fdesde)}`, border: [false, true, false, false]}, {text: 'Hasta:', bold: true, border: [false, true, false, false]}, {text: `${this.changeDateFormat(this.fhasta)}`, border: [false, true, false, false]}, {text: 'Ambas a las 12 AM.', border: [false, true, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 80, 80, '*'],
            body: [
              [{text: 'Fecha de Suscripción:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Sucursal Emisión:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalemision}`, border: [false, false, false, true]}, {text: 'Sucursal Suscriptora:', bold: true, border: [false, false, false, true]}, {text: `Sucursal ${this.xsucursalsuscriptora}`, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [130, '*'],
            body: [
              [{text: 'Datos del Recibo', alignment: 'center', fillColor: '#ababab', bold: true, border: [true, false, true, true]}, {text: ' ', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [70, 51, 80, 50, 80, '*'],
            body: [
              [{text: 'Fecha de Emisión:', bold: true, border: [true, false, true, true]}, {text: this.changeDateFormat(this.femision), alignment: 'center', border: [false, false, true, true]}, {text: 'Moneda:', bold: true, border: [false, false, false, true]}, {text: this.xmoneda, border: [false, false, false, true]}, {text: 'Monto Total del Plan', bold: true, border: [false, false, false, true]}, {text: this.mmonto_plan, border: [false, false, true, true]} ]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [44, 296, '*', '*'],
            body: [
              [{text: 'ASEGURADO:', bold: true, border: [true, false, false, false]}, {text: `${this.xnombrepropietario} ${this.xapellidopropietario}`, border: [false, false, false, false]}, {text: 'C.I. / R.I.F.:', bold: true, border: [false, false, false, false]}, {text: this.xdocidentidadpropietario, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [40, 310, '*'],
            body: [
              [{text: 'DOMICILIO:', bold: true, border: [true, false, false, false]}, {text: this.xdireccionpropietario, border: [false, false, false, false]}, {text: '', border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [24, 90, 40, 50, 30, 50, 24, '*'],
            body: [
              [{text: 'Estado:', bold: true, border: [true, false, false, false]}, {text: this.xestadopropietario, border: [false, false, false, false]}, {text: 'Ciudad:', bold: true, border: [false, false, false, false]}, {text: this.xciudadpropietario, border: [false, false, false, false]}, {text: 'Teléfono:', bold: true, border: [false, false, false, false]}, {text: this.xtelefonocelularpropietario, border: [false, false, false, false]}, {text: 'E-mail:', bold: true, border: [false, false, false, false]}, {text: this.xemailpropietario, border: [false, false, true, false]}]
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
            widths: [30, 100, 30, 100, 35, '*'],
            body: [
              [{text: 'MARCA:', bold: true, border: [true, false, false, true]}, {text: this.xmarca, border: [false, false, false, true]}, {text: 'MODELO:', bold: true, border: [false, false, false, true]}, {text: this.xmodelo, border: [false, false, false, true]}, {text: 'VERSIÓN:', bold: true, border: [false, false, false, true]}, {text: this.xversion, border: [false, false, true, true]} ]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [20, 45, 80, 75, 70, 70, 50, '*'],
            body: [
              [{text: 'Año:', bold: true, border: [true, false, false, true]}, {text: this.fano, border: [false, false, false, true]}, {text: 'SERIAL CARROCERIA:', bold: true, border: [false, false, false, true]}, {text: this.xserialcarroceria, border: [false, false, false, true]}, {text: 'SERIAL DEL MOTOR:', bold: true, border: [false, false, false, true]}, {text: this.xserialmotor, border: [false, false, false, true]}, {text: 'Color:', bold: true, border: [false, false, false, true]}, {text: this.xcolor, border: [false, false, true, true]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [60, 30, 30, 50, 30, 90, 60, '*'],
            body: [
              [{text: 'N° DE PUESTOS:', bold: true, border: [true, false, false, false]}, {text: this.ncapacidadpasajeros, border: [false, false, false, false]}, {text: 'CLASE:', bold: true, border: [false, false, false, false]}, {text: this.xclase, border: [false, false, false, false]}, {text: 'TIPO:', bold: true, border: [false, false, false, false]}, {text: this.xtipovehiculo, border: [false, false, false, false]}, {text: 'PLACA:', bold: true, border: [false, false, false, false]}, {text: this.xplaca, border: [false, false, true, false]}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: ['*'],
            body: [
              [{text: 'DESCRIPCIÓN DE LOS SERVICIOS', alignment: 'center', fillColor: '#ababab', bold: true}]
            ]
          }
        },
        {
          style: 'data',
          table: {
            widths: [170, 170, '*'],
            body: this.buildServiceBody()
          }
        },
        {
          style: 'data',
          table: {
            widths: [171, 100, 60, '*'],
            body: [
              [{text: 'Costo Total de Plan', colSpan: 3, alignment: 'right', fillColor: '#ababab', bold: true, border: [true, true, true, true]}, {}, {}, {text: `USD ${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.mmonto_plan)}`, alignment: 'right', bold: true, fillColor: '#ababab', border: [false, true, true, true]}],
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
          fontSize: 7
        }
      }
    }
    let pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download(`Póliza - ${this.xnombrecliente}`);
    pdf.open();
    this.search_form.disable()
  }
    catch(err){console.log(err.message)}
  }
}
